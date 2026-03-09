
/**
 * ForgeController.js - [SH-1200]
 * Orchestrates the 1-hour "Sprint Forge" multi-agent pipeline.
 */

export class ForgeController {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.activeSprint = null;
        this.timerInterval = null;
        this.PHASES = {
            'ALEX': { duration: 10 * 60 * 1000, agent: 'Alex', status: 'IDEA', next: 'JORDAN' },
            'JORDAN': { duration: 15 * 60 * 1000, agent: 'Jordan', status: 'REFINING', next: 'MAYA' },
            'MAYA': { duration: 15 * 60 * 1000, agent: 'Maya', status: 'MOCKUP', next: 'DEV' },
            'DEV': { duration: 20 * 60 * 1000, agent: 'Dev', status: 'PROTOTYPE', next: 'VALIDATED' }
        };
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        console.log("ForgeController: Uplink_Stable.");
        this.subscribeToRealtime();
        this.checkResumeActiveSprint();
        this.initialized = true;
    }

    subscribeToRealtime() {
        this.supabase.channel('public:product_blueprints')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'product_blueprints' }, (payload) => {
                this.handleDataChange(payload);
            })
            .subscribe();
    }

    async handleDataChange(payload) {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const product = payload.new;
            if (window.updateForgeHUD) window.updateForgeHUD(product);
            
            if (product.forge_meta?.autonomous_sprint && product.status !== 'VALIDATED') {
                this.manageSprintSequence(product);
            }
        }
    }

    async startSprint(productId) {
        const { data: product, error } = await this.supabase
            .from('product_blueprints')
            .update({ 
                forge_meta: { 
                    autonomous_sprint: true, 
                    timer_started_at: new Date().toISOString(),
                    current_phase: 'ALEX' 
                },
                status: 'IDEA'
            })
            .eq('id', productId)
            .select()
            .single();

        if (error) {
            console.error("ForgeController: Start_Sprint_Fail", error);
            return;
        }

        if (window.sovereignGateway) {
            const slug = product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
            await window.sovereignGateway.provision(productId, slug);
        }

        console.log("ForgeController: Sprint_Initiated", product.name);
        this.activeSprint = product;
        this.startLocalTimer(product);
    }

    startLocalTimer(product) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        const startTime = new Date(product.forge_meta.timer_started_at).getTime();
        this.timerInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime;
            const remaining = Math.max(0, 3600000 - elapsed);
            
            if (window.renderForgeTimer) window.renderForgeTimer(remaining, elapsed);
            
            if (remaining === 0) {
                clearInterval(this.timerInterval);
                console.log("ForgeController: Sprint_Cycle_Complete.");
            }
        }, 1000);
    }

    async manageSprintSequence(product) {
        const currentPhaseKey = product.forge_meta.current_phase || 'ALEX';
        const elapsedSinceStart = Date.now() - new Date(product.forge_meta.timer_started_at).getTime();
        
        let targetPhase = currentPhaseKey;
        if (elapsedSinceStart >= (10+15+15) * 60 * 1000) targetPhase = 'DEV';
        else if (elapsedSinceStart >= (10+15) * 60 * 1000) targetPhase = 'MAYA';
        else if (elapsedSinceStart >= 10 * 60 * 1000) targetPhase = 'JORDAN';

        if (targetPhase !== currentPhaseKey) {
            console.log(`ForgeController: Phase_Transition [${currentPhaseKey} -> ${targetPhase}]`);
            await this.advancePhase(product.id, targetPhase);
        }
    }

    async advancePhase(productId, nextPhase) {
        await this.supabase
            .from('product_blueprints')
            .update({ 
                status: this.PHASES[nextPhase].status,
                forge_meta: { 
                    ...this.activeSprint?.forge_meta,
                    current_phase: nextPhase 
                }
            })
            .eq('id', productId);
    }

    async checkResumeActiveSprint() {
        const { data } = await this.supabase
            .from('product_blueprints')
            .select('*')
            .eq('forge_meta->autonomous_sprint', true)
            .neq('status', 'VALIDATED')
            .order('created_at', { ascending: false })
            .limit(1);

        if (data && data.length > 0) {
            const product = data[0];
            const startTime = new Date(product.forge_meta.timer_started_at).getTime();
            if (Date.now() - startTime < 3600000) {
                console.log("ForgeController: Resuming_Active_Sprint", product.name);
                this.activeSprint = product;
                this.startLocalTimer(product);
            }
        }
    }
}

export default ForgeController;

/**
 * PersistenceWarden.js - Sovereign Hub v4.0 Middleware
 * 
 * Logic that manages cloud synchronization and multi-repo persistence.
 */

export class PersistenceWarden {
    constructor(supabase) {
        this.supabase = supabase;
        this.zones = ['/v4/', '/planning/', '/tmp/prototypes/'];
        this.initialized = false;
        this.status = 'HARDENED';
        this.uncommittedCount = 0;
        this.syncHistory = [];
        this.repos = [];
    }

    async init() {
        if (this.initialized) return;
        console.log('SH-1900: Persistence Warden Initialized.');
        
        // Initial data fetch
        await this.syncState();
        
        // Real-time subscription to repo updates
        this.supabase
            .channel('public:persistence_repos')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'persistence_repos' }, payload => {
                this.handleRepoUpdate(payload);
            })
            .subscribe();

        // Real-time subscription to agent logs (Sentinel Gate)
        this.supabase
            .channel('public:agent_logs')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'agent_logs' }, payload => {
                if (payload.new.task_description?.includes('RELEASE_CLEARED')) {
                    this.status = 'RELEASE_READY';
                    this.updateUI();
                }
            })
            .subscribe();

        this.initialized = true;
        this.updateUI();
        
        // Start Heartbeat
        setInterval(() => this.pulse(), 30000); // 30s check
    }

    async syncState() {
        const { data: repos } = await this.supabase.from('persistence_repos').select('*');
        this.repos = repos || [];
        
        const { data: logs } = await this.supabase
            .from('agent_logs')
            .select('*')
            .eq('agent_name', 'Sam')
            .ilike('task_description', '%RELEASE_CLEARED%')
            .order('created_at', { ascending: false })
            .limit(1);

        if (logs && logs.length > 0) {
            this.status = 'RELEASE_READY';
        }

        // Mock uncommitted count (would come from bridge API in production)
        this.uncommittedCount = Math.floor(Math.random() * 5); 
    }

    handleRepoUpdate(payload) {
        const index = this.repos.findIndex(r => r.id === payload.new.id);
        if (index !== -1) {
            this.repos[index] = payload.new;
        } else {
            this.repos.push(payload.new);
        }
        this.updateUI();
    }

    async pulse() {
        this.updateUI();
    }

    async forceSync() {
        if (!confirm("FORCE_SYNC BYPASSES SENTINEL GATE. PROCEED?")) return;
        
        this.status = 'SYNCING';
        this.updateUI();

        const commitMessage = await this.generateCommitMessage();
        console.log(`SH-1900: Generated Commit Message: ${commitMessage}`);

        for (const repo of this.repos) {
            await this.supabase.from('persistence_repos').update({ health_status: 'SYNCING' }).eq('id', repo.id);
            
            if (repo.type === 'PROTOTYPE' && !repo.remote_url) {
                console.log(`SH-1900: Initializing GenesisSync for ${repo.local_path}`);
                repo.remote_url = `https://github.com/sovereign-hub/${repo.local_path.split('/').filter(Boolean).pop()}.git`;
            }

            await new Promise(r => setTimeout(r, 1500));
            await this.supabase.from('persistence_repos').update({ 
                health_status: 'GREEN', 
                last_sync: new Date().toISOString(),
                remote_url: repo.remote_url
            }).eq('id', repo.id);
        }

        this.status = 'HARDENED';
        this.updateUI();
    }

    async generateCommitMessage() {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const epic = "SH-1900";
        const objective = "Sovereign Persistence Warden Implementation";
        return `[${epic}] [Pulse: ${timestamp}] ${objective} - Automated Sync via Warden.`;
    }

    /**
     * Update all instances of the Persistence HUD in the UI.
     */
    updateUI() {
        // Handle elements that might exist in multiple tabs using classes
        const containers = document.querySelectorAll('.persistence-hud-container');
        
        document.querySelectorAll('.warden-pulse-status').forEach(el => {
            el.innerText = `Status: ${this.status}`;
            el.className = `warden-pulse-status text-[8px] font-mono uppercase tracking-widest mt-1 ${this.status === 'SYNCING' ? 'text-[#8B5CF6] animate-pulse' : (this.status === 'RELEASE_READY' ? 'text-gold' : 'text-[#8B5CF6]/60')}`;
        });

        document.querySelectorAll('.persistence-ring').forEach(el => {
            el.className = `persistence-ring transition-all duration-1000 ${this.status === 'SYNCING' ? 'syncing-ring' : (this.status === 'RELEASE_READY' ? 'text-gold-glow' : '')}`;
            el.style.stroke = this.status === 'SYNCING' ? '#A855F7' : '#FFD700';
        });

        document.querySelectorAll('.uncommitted-count').forEach(el => {
            el.innerText = `${this.uncommittedCount} Files`;
        });

        const repoMatrixHtml = this.repos.map(repo => `
            <tr class="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                <td class="py-3">
                    <div class="flex flex-col">
                        <span class="text-white/60 font-bold">${repo.local_path.split('/').filter(Boolean).pop()}</span>
                        <span class="text-[7px] text-white/20 uppercase truncate max-w-[100px]">${repo.remote_url || 'No Remote'}</span>
                    </div>
                </td>
                <td class="py-3">
                    <span class="px-1.5 py-0.5 rounded text-[8px] border ${this.getStatusStyle(repo.health_status)}">
                        ${repo.health_status}
                    </span>
                </td>
                <td class="py-3 text-right text-white/20">${this.formatRelativeTime(repo.last_sync)}</td>
            </tr>
        `).join('');

        document.querySelectorAll('.repo-matrix-body').forEach(el => {
            el.innerHTML = repoMatrixHtml;
        });
    }

    getStatusStyle(status) {
        if (status === 'GREEN') return 'border-emerald-500/20 text-emerald-400';
        if (status === 'SYNCING') return 'border-[#8B5CF6]/20 text-[#8B5CF6] animate-pulse';
        if (status === 'RED') return 'border-rose-500/20 text-rose-500';
        return 'border-white/10 text-white/40';
    }

    formatRelativeTime(ts) {
        if (!ts) return 'NEVER';
        const diff = Math.floor((new Date() - new Date(ts)) / 1000);
        if (diff < 60) return 'JUST NOW';
        if (diff < 3600) return `${Math.floor(diff/60)}M AGO`;
        return `${Math.floor(diff/3600)}H AGO`;
    }
}

export default PersistenceWarden;

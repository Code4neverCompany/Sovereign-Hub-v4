/**
 * NeuralRepair.js - Sovereign Hub v4.0 Middleware
 * 
 * Logic that detects and repairs UI/API failures autonomously.
 */

export class NeuralRepair {
    constructor(supabase) {
        this.supabase = supabase;
        this.config = {
            severityThreshold: 3,
            diagnosticsTable: 'system_diagnostics',
            repairAgentRole: 'Sovereign_Repair_Specialist'
        };
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        console.log("🧠 [NeuralRepair] Initializing Nervous System...");
        this.setupGlobalListeners();
        this.patchFetch();
        this.initialized = true;
    }

    setupGlobalListeners() {
        window.onerror = (message, source, lineno, colno, error) => {
            this.handleError({
                type: 'JS_CRASH',
                message: message,
                source: `${source}:${lineno}:${colno}`,
                stack: error ? error.stack : null,
                severity: 3
            }, { component: 'Global_UI_Scope' });
            return false;
        };

        window.onunhandledrejection = (event) => {
            this.handleError({
                type: 'PROMISE_REJECTION',
                message: event.reason?.message || 'Unknown Rejection',
                stack: event.reason?.stack || null,
                severity: 2
            }, { component: 'Async_Logic_Stream' });
        };
    }

    patchFetch() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok) {
                    this.handleError({
                        type: 'API_FAILURE',
                        message: `HTTP ${response.status}: ${response.statusText}`,
                        url: args[0],
                        severity: response.status >= 500 ? 3 : 2
                    }, { component: 'Sovereign_Gateway_Uplink' });
                }
                return response;
            } catch (error) {
                this.handleError({
                    type: 'NETWORK_ERROR',
                    message: error.message,
                    url: args[0],
                    severity: 3
                }, { component: 'Sovereign_Gateway_Uplink' });
                throw error;
            }
        };
    }

    async handleError(error, context) {
        console.error(`🔴 [NeuralRepair] Detected ${error.type}:`, error.message);
        
        const diagnostic = {
            error_type: error.type,
            source_component: context.component,
            error_payload: { 
                message: error.message, 
                stack: error.stack, 
                url: error.url,
                timestamp: new Date().toISOString()
            },
            severity_level: error.severity || 2,
            repair_status: 'PENDING'
        };

        try {
            if (this.supabase) {
                const { data, error: dbError } = await this.supabase
                    .from(this.config.diagnosticsTable)
                    .insert(diagnostic)
                    .select();
                
                if (dbError) throw dbError;

                window.dispatchEvent(new CustomEvent('neural-event', { detail: data[0] }));

                if (diagnostic.severity_level >= this.config.severityThreshold) {
                    this.triggerImmuneResponse(data[0]);
                }
            }
        } catch (dbErr) {
            console.error("Critical: Failed to log diagnostic to Supabase.", dbErr);
        }
    }

    async triggerImmuneResponse(diagnostic) {
        console.warn(`🛡️ [NeuralRepair] Severity ${diagnostic.severity_level} reached. Triggering Immune Response...`);
        
        if (this.supabase) {
            await this.supabase
                .from(this.config.diagnosticsTable)
                .update({ 
                    repair_status: 'INVESTIGATING',
                    subagent_session_id: 'pending_spawn_sh2000'
                })
                .eq('id', diagnostic.id);
        }

        window.dispatchEvent(new CustomEvent('immune-response-active', { detail: diagnostic }));
        
        if (window.sovereignGateway) {
            window.sovereignGateway.callApi('sessions_spawn', {
                label: `repair_${diagnostic.error_type.toLowerCase()}_${diagnostic.id.slice(0,8)}`,
                task: `[REPAIR_MISSION] Fix ${diagnostic.error_type} in ${diagnostic.source_component}. Diagnostic ID: ${diagnostic.id}. Payload: ${JSON.stringify(diagnostic.error_payload)}`
            });
        }
    }

    /**
     * Update all Singularity Pulse nodes in the UI.
     */
    updateUIState(status) {
        document.querySelectorAll('.singularity-pulse').forEach(pulse => {
            const statusLabel = pulse.parentElement.querySelector('.singularity-status');
            
            if (status === 'REPAIRING') {
                pulse.classList.add('repairing', 'pulse-repairing');
                pulse.classList.remove('pulse-healthy');
                if(statusLabel) {
                    statusLabel.innerText = "System_Healing_Active";
                    statusLabel.className = "singularity-status text-[10px] font-mono text-healing uppercase tracking-widest animate-pulse";
                }
            } else {
                pulse.classList.remove('repairing', 'pulse-repairing');
                pulse.classList.add('pulse-healthy');
                if(statusLabel) {
                    statusLabel.innerText = "Systems_Nominal";
                    statusLabel.className = "singularity-status text-[10px] font-mono text-cyan uppercase tracking-widest";
                }
            }
        });
    }
}

export default NeuralRepair;

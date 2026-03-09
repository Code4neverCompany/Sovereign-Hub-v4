const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://vxipofhhsmjbbehtbxbu.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY in environment.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function finalizeBlueprint() {
    console.log("Dev: Finalizing product_blueprints record for ID: FORGE_20260305_01...");
    
    // Attempting update by ID as specified in the task
    const { data, error } = await supabase
        .from('product_blueprints')
        .update({
            status: 'code_complete',
            forge_meta: {
                phase: 'dev',
                implementation: {
                    kill_switch: 'TemporalEngine.neuralPurge()',
                    drift_detector: 'TokenDrift.js',
                    prototype_path: '/tmp/prototypes/loopshield'
                },
                updated_at: new Date().toISOString()
            }
        })
        .match({ id: 'FORGE_20260305_01' });

    if (error) {
        console.warn("Could not update by ID. Falling back to name: 'OmniTrace Agentic Debugger'...");
        const { data: data2, error: error2 } = await supabase
            .from('product_blueprints')
            .update({
                status: 'code_complete',
                forge_meta: {
                    phase: 'dev',
                    implementation: {
                        kill_switch: 'TemporalEngine.neuralPurge()',
                        drift_detector: 'TokenDrift.js',
                        prototype_path: '/tmp/prototypes/loopshield'
                    },
                    updated_at: new Date().toISOString()
                }
            })
            .match({ name: 'OmniTrace Agentic Debugger' });
            
        if (error2) {
            console.error("Finalization FAILED:", error2);
            process.exit(1);
        }
    }

    console.log("Blueprint 'FORGE_20260305_01' finalized with 'code_complete' status.");
}

finalizeBlueprint();

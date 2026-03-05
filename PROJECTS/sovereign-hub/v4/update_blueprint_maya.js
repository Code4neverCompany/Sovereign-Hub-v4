const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase credentials.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function updateBlueprint() {
    const { data, error } = await supabase
        .from('product_blueprints')
        .update({
            status: 'design_complete',
            forge_meta: {
                phase: 'maya',
                mockup_url: 'v4/LoopShield_Landing.html',
                design_json: {
                    aesthetic: 'Lux 3.0',
                    primary_accent: '#D4AF37',
                    components: ['Kill-Switch', 'Token Drift Chart']
                },
                updated_at: new Date().toISOString()
            }
        })
        .match({ name: 'OmniTrace Agentic Debugger' }); // Using the name as ID from the scout script

    if (error) {
        console.error("Error updating blueprint:", error);
        process.exit(1);
    }

    console.log("Blueprint updated successfully.");
}

updateBlueprint();

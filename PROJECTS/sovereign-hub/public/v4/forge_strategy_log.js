const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = "https://vxipofhhsmjbbehtbxbu.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const blueprint = {
    id: "FORGE_20260305_01",
    name: "LoopShield AI",
    description: "Runaway cost protection and recursive loop detection for agentic swarms.",
    niche: "Agentic Cost-Guard",
    status: "strategy_complete",
    prd_link: "/planning/LOOPSHIELD_PRD.md",
    value_prop: "Never wake up to a 0,000 API bill again. Proactive agentic logic safety.",
    forge_meta: {
        phase: "jordan",
        autonomous_sprint: true,
        updated_at: new Date().toISOString()
    }
};

async function logStrategy() {
    const { data, error } = await supabase
        .from('product_blueprints')
        .upsert([blueprint])
        .select();

    if (error) {
        console.error("Error logging strategy:", error);
        process.exit(1);
    }

    console.log("Strategy logged successfully for LoopShield AI.");
}

logStrategy();

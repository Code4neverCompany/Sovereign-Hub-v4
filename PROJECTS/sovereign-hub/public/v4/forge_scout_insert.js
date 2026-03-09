
const { createClient } = require('@supabase/supabase-js');

// Config - In a real scenario, these would be in process.env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase credentials.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const blueprint = {
    name: "OmniTrace Agentic Debugger",
    description: "A cross-framework observability and debugging layer for multi-agent systems. It provides real-time 'reasoning-loop' visualization, token-cost attribution per agent role, and automated root-cause analysis for cascading agent failures.",
    niche: "Agentic DevOps & Observability",
    status: "scouting_complete",
    tech_stack: {
        backend: "Node.js (Fastify) + Python (FastAPI)",
        database: "Supabase (PostgreSQL + Vector)",
        frontend: "React + Tailwind + Vis.js (for graph visualization)",
        integration: "OpenTelemetry + Custom SDKs for LangGraph, CrewAI, and AutoGen"
    },
    market_data: {
        pain_point: "Cascading failures in autonomous agent loops and lack of granular cost attribution.",
        trending_indicator: "Claude Code accounting for 4% of GitHub commits (Anthropic, 2026), Gartner reporting 40% of agentic projects face cancellation due to lack of visibility.",
        competitors: ["LangSmith", "Langfuse", "Arize Phoenix", "Maxim AI"]
    },
    forge_meta: {
        phase: "alex",
        autonomous_sprint: true,
        timer_started_at: new Date().toISOString(),
        current_phase: "ALEX",
        cycle: "FORGE_SCOUT_CYCLE_01"
    }
};

async function logDiscovery() {
    const { data, error } = await supabase
        .from('product_blueprints')
        .insert([blueprint])
        .select();

    if (error) {
        console.error("Error logging discovery:", error);
        process.exit(1);
    }

    console.log("Discovery logged successfully:", data[0].id);
    console.log("Handoff triggered for Jordan [Strategist].");
}

logDiscovery();

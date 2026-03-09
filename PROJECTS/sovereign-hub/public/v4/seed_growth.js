
const { createClient } = require('@supabase/supabase-js');

// Config - Fetching from Environment for Dev 
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase credentials.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const MOCK_CONTENT = [
    {
        content_type: 'X_POST',
        status: 'POSTED',
        body_text: "The era of manual debugging is over. OmniTrace Agentic Debugger just went live. 🚀\n\nTrack every reasoning step, every token cost, every agentic drift in real-time. Secure your Hive infrastructure now. #AgentOS #SovereignHub",
        performance_score: 92,
        creator_agent: 'ALEX',
        optimizer_agent: 'JORDAN',
        visualizer_agent: 'MAYA',
        posted_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
        content_type: 'LI_ARTICLE',
        status: 'READY',
        body_text: "Why 40% of AI Agent projects fail: A study by Gartner (2026). The missing piece? Observability. Introducing OmniTrace.",
        performance_score: 78,
        creator_agent: 'ALEX',
        optimizer_agent: 'JORDAN',
        visualizer_agent: 'MAYA'
    },
    {
        content_type: 'X_POST',
        status: 'OPTIMIZING',
        body_text: "Ever wonder why your agents start hallucinating in recursive loops? OmniTrace sees what they're thinking before the loop breaks your budget. 🧠⚡",
        performance_score: 45,
        creator_agent: 'ALEX',
        optimizer_agent: 'JORDAN'
    },
    {
        content_type: 'BLOG_HOOK',
        status: 'DRAFT',
        body_text: "The hidden costs of autonomous agents: How to attribute every cent of your token usage with precision.",
        performance_score: 12,
        creator_agent: 'ALEX'
    }
];

async function seedGrowth() {
    console.log("Seeding Viral Growth Content...");

    // 1. Get the latest product blueprint to link to
    const { data: blueprints } = await supabase.from('product_blueprints').select('id').order('created_at', {ascending:false}).limit(1);
    const productId = blueprints && blueprints[0] ? blueprints[0].id : null;

    if (!productId) {
        console.error("No product blueprints found. Please seed products first.");
        return;
    }

    const entries = MOCK_CONTENT.map(c => ({ ...c, product_id: productId }));

    const { data, error } = await supabase
        .from('marketing_content')
        .insert(entries)
        .select();

    if (error) {
        console.error("Error seeding growth content:", error);
    } else {
        console.log(`Successfully seeded ${data.length} growth content entries.`);
    }
}

seedGrowth();

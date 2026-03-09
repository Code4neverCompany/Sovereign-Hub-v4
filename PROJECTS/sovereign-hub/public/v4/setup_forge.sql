
-- [SH-1200] Product Blueprints Table
CREATE TABLE IF NOT EXISTS product_blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    description TEXT,
    niche TEXT,
    tech_stack JSONB,
    roadmap JSONB,
    market_data JSONB,
    status TEXT DEFAULT 'IDEA', -- IDEA, REFINING, MOCKUP, PROTOTYPE, VALIDATED
    prd_json JSONB,
    mockup_url TEXT,
    code_repo TEXT,
    forge_meta JSONB DEFAULT '{"phase": "alex", "timer_started_at": null}'::jsonb
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE product_blueprints;

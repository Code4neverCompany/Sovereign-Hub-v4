
-- [SH-1400] Market Deployment & Revenue Tables

-- 1. Deployment Manifests
CREATE TABLE IF NOT EXISTS deployment_manifests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES product_blueprints(id) ON DELETE CASCADE,
    subdomain_slug TEXT UNIQUE NOT NULL,
    provider TEXT DEFAULT 'LOCAL', -- VERCEL, CLOUDFLARE, CUSTOM, LOCAL
    live_url TEXT,
    ssl_status TEXT DEFAULT 'PENDING', -- VALID, EXPIRED, PENDING
    deployment_status TEXT DEFAULT 'PROVISIONING', -- PROVISIONING, LIVE, FAILED, TEARDOWN
    metadata JSONB DEFAULT '{}'::jsonb,
    last_deployed TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Market Metrics
CREATE TABLE IF NOT EXISTS market_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES product_blueprints(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- VISIT, SIGNUP, CLICK, CONVERSION
    value NUMERIC DEFAULT 0,
    is_simulated BOOLEAN DEFAULT true,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime for both
ALTER PUBLICATION supabase_realtime ADD TABLE deployment_manifests;
ALTER PUBLICATION supabase_realtime ADD TABLE market_metrics;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deployment_product ON deployment_manifests(product_id);
CREATE INDEX IF NOT EXISTS idx_metrics_product ON market_metrics(product_id);
CREATE INDEX IF NOT EXISTS idx_metrics_event ON market_metrics(event_type);
CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON market_metrics(timestamp);

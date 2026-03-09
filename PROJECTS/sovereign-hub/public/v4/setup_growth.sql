-- [SH-1500] Viral Growth & Content Forge Tables

-- 1. Marketing Content Table
CREATE TABLE IF NOT EXISTS marketing_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES product_blueprints(id) ON DELETE CASCADE,
    
    -- Content Details
    content_type TEXT NOT NULL, -- 'X_POST', 'LI_ARTICLE', 'BLOG_HOOK', 'AD_COPY'
    status TEXT DEFAULT 'DRAFT', -- 'DRAFT', 'OPTIMIZING', 'READY', 'POSTED', 'ARCHIVED'
    body_text TEXT NOT NULL,
    headline TEXT,
    
    -- Viral Metadata
    viral_hook_id UUID, -- Reference to the specific psychological hook used
    target_keywords TEXT[], -- Keywords intended for the Signal Boost mechanism
    media_assets JSONB DEFAULT '[]'::jsonb, -- { type: 'IMAGE', url: '...', prompt: '...' }
    
    -- Performance Tracking
    scheduled_at TIMESTAMPTZ,
    posted_at TIMESTAMPTZ,
    performance_score NUMERIC DEFAULT 0, -- Calculated Viral Momentum
    
    -- Agent Metadata
    creator_agent TEXT DEFAULT 'ALEX', -- The agent that initiated the draft
    optimizer_agent TEXT DEFAULT 'JORDAN', -- The agent that refined the hook
    visualizer_agent TEXT DEFAULT 'MAYA', -- The agent that generated the assets
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- [SH-1800] Node Genesis & Scaling Infrastructure

-- Track Physical Infrastructure Nodes
CREATE TABLE IF NOT EXISTS infrastructure_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_name TEXT UNIQUE NOT NULL,
    provider TEXT NOT NULL, -- 'AWS', 'GCP', 'RUNPOD', etc.
    instance_id TEXT UNIQUE,
    region TEXT,
    ip_internal TEXT, -- Tailscale IP
    status TEXT DEFAULT 'PROVISIONING' CHECK (status IN ('PROVISIONING', 'BOOTING', 'SYNCING', 'ONLINE', 'DRAINING', 'OFFLINE')),
    instance_type TEXT,
    hourly_cost NUMERIC(10, 4),
    last_heartbeat TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Track Scaling Events for Audit & Optimization
CREATE TABLE IF NOT EXISTS scaling_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT CHECK (event_type IN ('SCALE_UP', 'SCALE_DOWN')),
    reason TEXT, -- e.g., 'High Latency', 'Budget Adjustment'
    node_id UUID REFERENCES infrastructure_nodes(id),
    cost_impact NUMERIC(10, 4),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Genesis Keys (Short-lived)
CREATE TABLE IF NOT EXISTS genesis_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_hash TEXT NOT NULL,
    is_used BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE marketing_content;
ALTER PUBLICATION supabase_realtime ADD TABLE infrastructure_nodes;
ALTER PUBLICATION supabase_realtime ADD TABLE scaling_events;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketing_product ON marketing_content(product_id);
CREATE INDEX IF NOT EXISTS idx_marketing_status ON marketing_content(status);
CREATE INDEX IF NOT EXISTS idx_infra_status ON infrastructure_nodes(status);
CREATE INDEX IF NOT EXISTS idx_scaling_type ON scaling_events(event_type);

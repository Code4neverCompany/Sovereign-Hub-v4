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

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE marketing_content;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketing_product ON marketing_content(product_id);
CREATE INDEX IF NOT EXISTS idx_marketing_status ON marketing_content(status);

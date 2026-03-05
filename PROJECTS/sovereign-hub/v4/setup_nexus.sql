-- Project Nexus: Supabase Schema (SH-1600-D)
-- Source of truth for project metadata and pending scout discoveries.

-- 1. Projects Table: Index of active physical project folders
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    path TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED')),
    lead_agent TEXT DEFAULT 'Alex',
    epic_count INT DEFAULT 0,
    last_synced TIMESTAMPTZ DEFAULT now(),
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Pending Discoveries: Staging area for Scout findings (SH-1200)
CREATE TABLE IF NOT EXISTS pending_discoveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    niche TEXT NOT NULL,
    market_heat INT DEFAULT 0,
    source_link TEXT,
    scout_log_id TEXT, -- Link to agent_logs entry
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'DISCARDED')),
    suggested_lead TEXT DEFAULT 'Jordan',
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime for the Hub Dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE pending_discoveries;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_path ON projects(path);
CREATE INDEX IF NOT EXISTS idx_pending_discoveries_status ON pending_discoveries(status);

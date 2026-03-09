-- setup_diagnostics.sql
-- Run this in the Supabase SQL Editor for Sovereign Hub v4.0

-- 1. Create the system_diagnostics table
CREATE TABLE IF NOT EXISTS system_diagnostics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    error_type VARCHAR(50) NOT NULL, -- 'JS_CRASH', 'API_TIMEOUT', '404_NOT_FOUND', 'AUTH_FAILURE'
    source_component VARCHAR(100),   -- 'NexusController', 'Sovereign_App_UI', 'TemporalEngine'
    error_payload JSONB,             -- Stack trace, URL, or API response body
    severity_level INT DEFAULT 1,    -- 1: Warning, 2: Error, 3: Critical (Triggers Auto-Spawn)
    repair_status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'INVESTIGATING', 'RESOLVED', 'FAILED'
    subagent_session_id VARCHAR(100),-- Reference to the OpenClaw session handling the fix
    resolution_summary TEXT
);

-- 2. Indices for performance
CREATE INDEX IF NOT EXISTS idx_diag_status ON system_diagnostics(repair_status);
CREATE INDEX IF NOT EXISTS idx_diag_severity ON system_diagnostics(severity_level);
CREATE INDEX IF NOT EXISTS idx_diag_timestamp ON system_diagnostics(timestamp DESC);

-- 3. RLS Policies (Allow Authenticated users to view/insert)
ALTER TABLE system_diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated to select diagnostics" ON system_diagnostics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert diagnostics" ON system_diagnostics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to update diagnostics" ON system_diagnostics
    FOR UPDATE USING (auth.role() = 'authenticated');

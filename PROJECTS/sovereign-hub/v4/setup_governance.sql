-- Project Governance: Supabase Schema (SH-1700-A)
-- Source of truth for swarm policies and violation logs.

-- 1. Governance Policies Table
CREATE TABLE IF NOT EXISTS governance_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT CHECK (category IN ('FINANCIAL', 'SECURITY', 'OPERATIONAL', 'COMPLIANCE')),
    value JSONB NOT NULL,
    risk_tier TEXT DEFAULT 'MEDIUM' CHECK (risk_tier IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    is_active BOOLEAN DEFAULT true,
    enforcement TEXT DEFAULT 'BLOCK' CHECK (enforcement IN ('BLOCK', 'WARN')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Policy Violations Table
CREATE TABLE IF NOT EXISTS policy_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES governance_policies(id),
    agent_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    resolution TEXT DEFAULT 'BLOCKED' CHECK (resolution IN ('BLOCKED', 'OVERRIDDEN', 'PENDING_REVIEW')),
    sovereign_note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Seed Default Constitution
INSERT INTO governance_policies (name, category, value, risk_tier, enforcement)
VALUES 
('daily_spend_limit', 'FINANCIAL', '{"limit": 100, "unit": "USD"}'::jsonb, 'HIGH', 'BLOCK'),
('unauthorized_file_write', 'SECURITY', '{"protected_dirs": ["/core", "/config"]}'::jsonb, 'CRITICAL', 'BLOCK'),
('high_risk_tool_usage', 'OPERATIONAL', '{"tools": ["exec", "browser"]}'::jsonb, 'MEDIUM', 'WARN'),
('mandatory_audit', 'COMPLIANCE', '{"triggers": ["DELETE_NODE", "PURGE_LOGS"]}'::jsonb, 'HIGH', 'BLOCK'),
('privacy_exposure', 'SECURITY', '{"sensitive_pattern": "PRIVATE_KEY|API_KEY"}'::jsonb, 'CRITICAL', 'BLOCK'),
('system_uptime', 'OPERATIONAL', '{"max_complexity": 90}'::jsonb, 'MEDIUM', 'WARN')
ON CONFLICT (name) DO NOTHING;

-- Enable Realtime for the Governance HUD
ALTER PUBLICATION supabase_realtime ADD TABLE governance_policies;
ALTER PUBLICATION supabase_realtime ADD TABLE policy_violations;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_governance_policies_category ON governance_policies(category);
CREATE INDEX IF NOT EXISTS idx_policy_violations_agent ON policy_violations(agent_id);

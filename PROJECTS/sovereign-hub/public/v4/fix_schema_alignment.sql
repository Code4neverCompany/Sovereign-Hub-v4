-- 🔱 Sovereign_OS Hub | DB Schema Alignment [SH-800]
-- Objective: Fix discrepancies between UI logic and DB constraints.

-- 1. Extend Governance Categories to support Nexus and specialized missions
ALTER TABLE public.governance_policies 
DROP CONSTRAINT IF EXISTS governance_policies_category_check;

ALTER TABLE public.governance_policies 
ADD CONSTRAINT governance_policies_category_check 
CHECK (category IN ('FINANCIAL', 'SECURITY', 'OPERATIONAL', 'COMPLIANCE', 'NEXUS', 'DISPATCH', 'CORE', 'RESEARCH'));

-- 2. Align Risk Tiers
ALTER TABLE public.governance_policies 
DROP CONSTRAINT IF EXISTS governance_policies_risk_tier_check;

ALTER TABLE public.governance_policies 
ADD CONSTRAINT governance_policies_risk_tier_check 
CHECK (risk_tier IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'SOVEREIGN'));

-- 3. Ensure agent_logs table exists with high-authority schema
CREATE TABLE IF NOT EXISTS public.agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT now(),
    agent_id TEXT NOT NULL,
    agent_name TEXT,
    message TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'INFO',
    category TEXT DEFAULT 'GENERAL',
    meta JSONB DEFAULT '{}'::jsonb,
    hash TEXT
);

-- 4. Ensure todos table exists with aligned priority levels
CREATE TABLE IF NOT EXISTS public.todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'URGENT')),
    assigned_to TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED')),
    task_description TEXT NOT NULL,
    meta JSONB DEFAULT '{}'::jsonb
);

-- 5. Enable Realtime for all aligned tables
ALTER PUBLICATION supabase_realtime ADD TABLE agent_logs, todos;

-- 6. Grant Access (Anonymous for Prototype)
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON public.agent_logs FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON public.todos FOR ALL USING (true) WITH CHECK (true);

-- [AUDIT]: Schema Aligned. Nexus mission types and URGENT priorities now supported.

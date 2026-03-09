-- 🔱 Sovereign_OS Hub | FINAL BACKEND ALIGNMENT [SH-800]
-- Objective: Ensure all tables and columns match the v7.2 Frontend Logic.

-- 1. Agent States Table (Ensuring name and columns match app.js)
CREATE TABLE IF NOT EXISTS public.agent_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id TEXT UNIQUE NOT NULL,           -- e.g., 'alex-01'
    status TEXT NOT NULL DEFAULT 'IDLE',     -- IDLE, BUSY, ERROR
    active_task TEXT DEFAULT 'Awaiting command...',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Agent Logs Table (Standardizing for Intel Stream)
CREATE TABLE IF NOT EXISTS public.agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT now(),
    agent_id TEXT NOT NULL,                  -- e.g., 'ALEX', 'MAYA', 'SYS'
    message TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'INFO',      -- INFO, WARN, ERROR, SUCCESS
    meta JSONB DEFAULT '{}'::jsonb
);

-- 3. Projects Table (For Saturation HUD)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    meta JSONB DEFAULT '{"progress": 0}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Realtime for all core tables
ALTER PUBLICATION supabase_realtime ADD TABLE agent_states, agent_logs, projects;

-- 5. Seed Initial Project Data
INSERT INTO public.projects (name, meta)
VALUES 
('SOVEREIGN_HUB', '{"progress": 10}'::jsonb),
('LOOPSHIELD_AI', '{"progress": 45}'::jsonb)
ON CONFLICT (name) DO UPDATE SET meta = EXCLUDED.meta;

-- 6. Seed Initial Agent Data
INSERT INTO public.agent_states (agent_id, status, active_task)
VALUES 
('alex-01', 'IDLE', 'Awaiting instruction.'),
('maya-02', 'IDLE', 'Design processors active.'),
('dev-04', 'IDLE', 'Code execution standby.'),
('jordan-03', 'IDLE', 'Research buffer clear.'),
('sam-05', 'IDLE', 'Security audit nominal.')
ON CONFLICT (agent_id) DO NOTHING;

-- SECURITY: Simple Policy for Prototype
ALTER TABLE public.agent_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Full access for operators" ON public.agent_states FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access for operators" ON public.agent_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access for operators" ON public.projects FOR ALL USING (true) WITH CHECK (true);

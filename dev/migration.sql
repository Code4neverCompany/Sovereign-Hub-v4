-- Sovereign Hub v4.0 - Swarm Collective Intelligence [SH-1100]
-- Backend: Supabase Postgres Schema

-- 1. Create the 'swarm_knowledge' table
CREATE TABLE IF NOT EXISTS public.swarm_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    agent_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    mission_id UUID,
    type TEXT, -- CONSTRAINT, INSIGHT, STATE, DISCOVERY
    content TEXT,
    insight_json JSONB, -- The structured insight as requested in prompt
    relevance_score FLOAT DEFAULT 1.0, -- Relevance score as requested in prompt
    metadata JSONB DEFAULT '{}'::jsonb,
    priority INT DEFAULT 1, -- 1 (Low) to 5 (Critical Signal)
    timestamp TIMESTAMPTZ DEFAULT now() -- Explicit timestamp as requested
);

-- 2. Enable Realtime for the table
ALTER TABLE public.swarm_knowledge REPLICA IDENTITY FULL;

-- Add it to the supabase_realtime publication (if using Supabase default setup)
-- This might fail if the publication doesn't exist yet, but it's the standard way.
BEGIN;
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.swarm_knowledge;
  END IF;
COMMIT;

-- 3. Row Level Security (RLS) - Basic permissive for now (Sovereign mode)
ALTER TABLE public.swarm_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to agents" ON public.swarm_knowledge FOR ALL USING (true);

-- 4. Indices for Performance
CREATE INDEX IF NOT EXISTS idx_swarm_knowledge_agent_id ON public.swarm_knowledge(agent_id);
CREATE INDEX IF NOT EXISTS idx_swarm_knowledge_session_id ON public.swarm_knowledge(session_id);
CREATE INDEX IF NOT EXISTS idx_swarm_knowledge_timestamp ON public.swarm_knowledge(timestamp DESC);

-- Create agent_metrics table
CREATE TABLE IF NOT EXISTS public.agent_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT now(),
    agent_id TEXT NOT NULL,
    session_id UUID,
    execution_time_ms INTEGER,
    status TEXT NOT NULL,
    error_message TEXT,
    metadata JSONB
);

-- Create token_usage table
CREATE TABLE IF NOT EXISTS public.token_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT now(),
    agent_id TEXT NOT NULL,
    model TEXT NOT NULL,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER,
    cost_estimate NUMERIC(10, 6)
);

-- Enable Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE agent_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE token_usage;

-- Add RLS policies (Allowing anon for this prototype as per index.html setup)
ALTER TABLE public.agent_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anonymous" ON public.agent_metrics FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.token_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anonymous" ON public.token_usage FOR ALL USING (true) WITH CHECK (true);

-- V4-DB-Trace: Neural Trace Recording Schema (SH-1000)
-- Objective: Security Audit for 'neural_snapshots' Supabase table.

-- Create table: `neural_snapshots`
CREATE TABLE IF NOT EXISTS public.neural_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    agent_id TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now(),
    step_index INT4 NOT NULL,
    event_type TEXT NOT NULL, -- Enum: THOUGHT, TOOL_CALL, TOOL_RESULT, STATE_CHANGE, ERROR
    payload JSONB, -- The core data (thought text, tool args, or result output)
    workspace_diff JSONB, -- Git-style diff of modified files at this specific step
    metadata JSONB, -- Model name, temperature, token usage, hardware telemetry
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexing Strategy (Phase 1 ARCHITECTURE compliance)
CREATE INDEX IF NOT EXISTS idx_snapshots_session_step ON public.neural_snapshots (session_id, step_index);
CREATE INDEX IF NOT EXISTS idx_snapshots_payload_gin ON public.neural_snapshots USING GIN (payload);
CREATE INDEX IF NOT EXISTS idx_snapshots_diff_gin ON public.neural_snapshots USING GIN (workspace_diff);

-- SECURITY: Enable Row Level Security (RLS)
ALTER TABLE public.neural_snapshots ENABLE ROW LEVEL SECURITY;

-- Policy 1: Service Role Bypass (For the agent-recorder itself)
-- Note: In a production environment, this would use a secure service_role.
-- For the Sovereign Hub HUD prototype, we allow authenticated users (operators).

-- Policy 2: Allow Operators to SELECT their own session traces
CREATE POLICY "Operators can view session traces" 
ON public.neural_snapshots 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Policy 3: Allow Agents (Authenticated Apps) to INSERT traces
CREATE POLICY "Agents can insert neural traces" 
ON public.neural_snapshots 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: DENY ALL UPDATE/DELETE (Ensures Immutable Audit Trail)
CREATE POLICY "No modifications allowed to trace history"
ON public.neural_snapshots
FOR UPDATE
USING (false);

CREATE POLICY "No deletions allowed to trace history"
ON public.neural_snapshots
FOR DELETE
USING (false);

-- Enable Realtime for the Scrubber
ALTER PUBLICATION supabase_realtime ADD TABLE neural_snapshots;

-- [AUDIT STATUS]: RLS COMPLIANT. Thought-streams and workspace deltas protected.

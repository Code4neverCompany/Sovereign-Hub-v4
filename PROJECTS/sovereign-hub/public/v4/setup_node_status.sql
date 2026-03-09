-- SH-900: Global Infrastructure Tracking
-- This table serves as the "Single Source of Truth" for the entire fleet's health.

CREATE TABLE IF NOT EXISTS node_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id TEXT UNIQUE NOT NULL,           -- Unique identifier (e.g., bot-pod-london-01)
    name TEXT NOT NULL,                     -- Display name
    region TEXT,                            -- Geographic region (e.g., 'eu-west-1')
    lat DOUBLE PRECISION,                   -- Latitude for map rendering
    lng DOUBLE PRECISION,                   -- Longitude for map rendering
    status TEXT DEFAULT 'offline',          -- 'online', 'offline', 'busy', 'maintenance'
    uptime TEXT,                            -- Human-readable uptime (e.g., '14d 6h')
    cpu_load INTEGER DEFAULT 0,             -- CPU usage percentage
    ram_load INTEGER DEFAULT 0,             -- RAM usage percentage
    tailscale_ip TEXT,                      -- Private mesh network IP
    last_seen TIMESTAMPTZ DEFAULT now(),    -- Updated on every heartbeat
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime for this table
-- Note: Depending on Supabase version/setup, you might need to check if the publication exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'node_status'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE node_status;
    END IF;
EXCEPTION
    WHEN undefined_object THEN
        -- Publication doesn't exist, ignore or handle accordingly
        NULL;
END $$;

-- Index for performance on the HUD
CREATE INDEX IF NOT EXISTS idx_node_status_last_seen ON node_status (last_seen DESC);

-- Seed some initial nodes for visualization
INSERT INTO node_status (node_id, name, region, lat, lng, status, uptime, cpu_load, ram_load, tailscale_ip)
VALUES 
('bot-pod-london-01', 'London Nexus', 'eu-west-2', 51.5074, -0.1278, 'online', '12d 4h', 15, 45, '100.64.0.1'),
('bot-pod-ny-01', 'NYC Sprawl', 'us-east-1', 40.7128, -74.0060, 'online', '5d 22h', 42, 60, '100.64.0.2'),
('bot-pod-tokyo-01', 'Neo Tokyo', 'ap-northeast-1', 35.6762, 139.6503, 'busy', '45d 1h', 88, 75, '100.64.0.3'),
('bot-pod-berlin-01', 'Berlin Gate', 'eu-central-1', 52.5200, 13.4050, 'online', '1d 12h', 10, 30, '100.64.0.4'),
('bot-pod-sf-01', 'Silicon Valley', 'us-west-1', 37.7749, -122.4194, 'offline', '0d 0h', 0, 0, '100.64.0.5')
ON CONFLICT (node_id) DO NOTHING;

-- [SH-900] SECURITY HARDENING: Enable Row Level Security
ALTER TABLE node_status ENABLE ROW LEVEL SECURITY;

-- [SH-900] SECURITY HARDENING: Create Access Policy
-- Restricts access to authenticated users only (protecting Tailscale IPs)
DROP POLICY IF EXISTS "Allow authenticated users access" ON node_status;
CREATE POLICY "Allow authenticated users access" ON node_status
    FOR ALL
    TO authenticated
    USING (true);

# [PHASE 1: ARCHITECTURAL BLUEPRINT]
# Project: Sovereign Hub v4.0 (Slim-Stack)
# Epic: Global HUD Expansion [SH-900]
# Objective: Design the Global Node & Infrastructure Tracking layer.

## 1. RESEARCH: Fleet Monitoring & Telemetry via Supabase

For a decentralized fleet of **bot-pods** (remote agentic nodes), the "Slim-Stack" approach leverages Supabase as a real-time event bus rather than just a passive database.

### **Architectural Patterns:**
*   **Edge-to-Hub Heartbeat:** Each remote node executes a lightweight telemetry script that pushes status updates to the Hub via the Supabase PostgREST API.
*   **Supabase Realtime (Cdc):** The Hub frontend uses `supabase.channel()` to subscribe to changes in the `node_status` table. This provides a "live" feel to the Global HUD without polling.
*   **Mesh Connectivity:** Using **Tailscale** ensures that even nodes behind NAT/Firewalls can be accessed directly from the Hub via private IP, provided the Hub is on the same tailnet.

---

## 2. SCHEMA: The `node_status` Table

This table serves as the "Single Source of Truth" for the entire fleet's health.

```sql
-- SH-900: Global Infrastructure Tracking
CREATE TABLE node_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id TEXT UNIQUE NOT NULL,           -- Unique identifier (e.g., bot-pod-london-01)
    name TEXT NOT NULL,                     -- Display name
    region TEXT,                            -- Geographic region (e.g., 'eu-west-1')
    location JSONB,                         -- Latitude/Longitude for map rendering: { "lat": 51.5, "lng": -0.12 }
    status TEXT DEFAULT 'offline',          -- 'online', 'offline', 'busy', 'maintenance'
    uptime TEXT,                            -- Human-readable uptime (e.g., '14d 6h')
    load_metrics JSONB,                     -- { "cpu": 45, "mem": 60, "disk": 30, "temp": 42 }
    tailscale_ip TEXT,                      -- Private mesh network IP
    last_seen TIMESTAMPTZ DEFAULT now(),    -- Updated on every heartbeat
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE node_status;

-- Index for performance on the HUD
CREATE INDEX idx_node_status_last_seen ON node_status (last_seen DESC);
```

---

## 3. BLUEPRINT: "Infrastructure" Tab Layout

The UI focuses on **Spatial Awareness** (Map) and **Operational Health** (Cards).

### **A. Global Map Visualization (Top Section)**
*   **Library:** [Leaflet.js](https://leafletjs.com/) (Lightweight, no-build friendly).
*   **Features:**
    *   Dark-themed tile provider (CartoDB DarkMatter).
    *   Node Markers: Color-coded by status (Green=Online, Red=Offline, Yellow=Alert).
    *   Tooltip: Displays `node_id` and current `cpu` load on hover.

### **B. Node Monitoring Cards (Grid Section)**
*   **Design:** High-fidelity cards with "Cyberpunk/Sovereign" aesthetic.
*   **Components:**
    *   **Status Pulse:** A small CSS animation indicating "live" connectivity.
    *   **Metric Bars:** CPU and Memory usage shown as micro-progress bars.
    *   **Tailscale Link:** A `btn-link` that copies the Tailscale IP or opens `ssh://[ip]`.
    *   **Last Seen:** Relative time (e.g., "30s ago").

---

## 4. CONNECTIVITY: The Heartbeat Protocol

To minimize overhead, nodes use a simple "Fire and Forget" heartbeat.

### **Heartbeat Script (Pseudocode for Bot-Pods):**
```javascript
/**
 * SH-900: Node Heartbeat (Run via cron or background daemon)
 */
async function sendHeartbeat() {
    const metrics = await getSystemMetrics(); // CPU, RAM, etc.
    const { data, error } = await supabase
        .from('node_status')
        .upsert({
            node_id: process.env.NODE_ID,
            name: process.env.NODE_NAME,
            status: 'online',
            load_metrics: metrics,
            tailscale_ip: getTailscaleIP(),
            last_seen: new Date().toISOString()
        }, { onConflict: 'node_id' });
}

// Interval: 60 seconds
setInterval(sendHeartbeat, 60000);
```

### **Stale Node Detection:**
Instead of a complex cron job, the Hub (Frontend) calculates status dynamically:
*   `Node.isOnline = (currentTime - last_seen) < 120 seconds`

---

## 5. HANDOFF: Jordan [Strategist]

### Technical Spec for Jordan
*   **Feature:** Global Infrastructure HUD (SH-900).
*   **Objective:** Provide a real-time command-and-control view of all active agent pods globally.
*   **Mechanism:** Supabase Realtime + Leaflet.js + Node-side Heartbeat daemon.

### Requested User Stories (Jordan):
1.  **Fleet Visibility:** *As an operator, I want to see all my bot-pods on a map so I can verify geographic redundancy.*
2.  **Health Monitoring:** *As a developer, I want to see CPU/Memory metrics for each node in real-time so I can identify bottlenecked pods before they fail.*
3.  **Direct Access:** *As a sysadmin, I want a one-click way to get the Tailscale IP of a node so I can SSH in for emergency maintenance.*
4.  **Auto-Discovery:** *As a user, I want new nodes to automatically appear in the HUD as soon as they are provisioned and send their first heartbeat.*

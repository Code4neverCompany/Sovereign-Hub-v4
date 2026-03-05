# Sentinel-Trace Technical Research
**Project:** Sovereign Hub v4.0 (Slim-Stack)  
**Researcher:** Alex (Architect / Winston)  
**Date:** 2026-03-05  

## 1. Tailscale Node Status Ingestion
### Local API Analysis
To stream live node status from within the pod, we leverage the **Tailscale Local API**. The `tailscaled` daemon exposes a Unix socket that provides high-frequency updates without hitting external rate limits or requiring WAN egress.

- **Primary Endpoint:** `/localapi/v0/status`
- **Access Method:** `curl --unix-socket /var/run/tailscale/tailscaled.sock http://localhost/localapi/v0/status`
- **Key Metrics for Sentinel-Trace:**
  - `Peer[].Online`: Boolean status for radial dot illumination.
  - `Peer[].Relay`: Indicates if traffic is via DERP (latency warning).
  - `Peer[].CurAddr`: Real-time endpoint resolution.
  - `Peer[].RxBytes` / `TxBytes`: For radial pulse intensity (activity monitoring).

**Streaming Strategy:** Use a lightweight Sidecar (Go or Node.js) to poll the Unix socket every 1-2 seconds and broadcast via **Supabase Realtime (Broadcast)** to the HUD.

---

## 2. Supabase DB Health Monitoring
### Metrics API & Realtime Strategy
For the DB health ring, we monitor the Postgres instance and the Realtime service health.

- **Source A: Supabase Metrics API (Prometheus compatible):**
  - **Endpoint:** `https://<project-ref>.supabase.co/customer/v1/privileged/metrics`
  - **Metric to Watch:** `pg_stat_activity_count` (Connection health) and `pg_up` (Instance status).
- **Source B: Self-Healing Check:**
  - Execute a simple `SELECT 1` via the Supabase client every 30s.
- **Data-Packet Structure (Sentinel-Trace):**
```json
{
  "component": "sentinel-trace",
  "timestamp": "2026-03-05T14:45:00Z",
  "payload": {
    "network": {
      "nodes_online": 12,
      "nodes_total": 15,
      "mesh_latency_avg": "42ms",
      "active_peers": ["node-alpha", "node-bravo"]
    },
    "database": {
      "status": "healthy",
      "load_factor": 0.24,
      "active_connections": 8,
      "replication_lag": "0ms"
    },
    "anomalies": []
  }
}
```

---

## 3. Lux Aesthetic 3.0: Animation Audit
### SVG vs. Canvas Performance
The 'Sentinel-Trace' component requires high-frequency radial scanning and "ping" pulses.

| Metric | SVG (current) | Canvas (recommended) |
| :--- | :--- | :--- |
| **DOM Overhead** | High (each node is an element) | Zero (single element) |
| **Animation Loop** | CSS/Web Animations API | RequestAnimationFrame (rAF) |
| **Styling** | Tailwind/CSS (Easy) | Script-based (Complex) |
| **Max Nodes** | ~50 before stutter | 1000+ fluidly |

**Audit Conclusion:**  
For the **Lux Aesthetic 3.0**, we should transition the core radial scanner to **HTML5 Canvas** while keeping the outer decorative rings in **SVG**. This "Hybrid-Radial" approach allows Tailwind to handle the UI layout while the Canvas handles the 60FPS status pulses and "trace" lines.

---

## 4. Implementation Blueprint
1. **Sidecar:** Deployment of a `ts-exporter` container in the pod.
2. **Supabase Channel:** Establish a `system_health` channel for Realtime Broadcast.
3. **Frontend:** Initialize a `SentinelTrace` Canvas component in the HUD.
4. **Logic:** Map `Peer[].Online` to radial coordinates $(r, \theta)$ on the Canvas.

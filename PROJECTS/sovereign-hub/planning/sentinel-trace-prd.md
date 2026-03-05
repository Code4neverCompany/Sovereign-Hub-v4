# PRD: Sentinel-Trace HUD Module
**Project:** Sovereign Hub v4.0 (Slim-Stack)
**Version:** 1.0 (Lean)
**Owner:** John (Product Manager)
**Status:** Approved for Implementation (BMad_CYCLE_3)

## 1. Product Objective
The **Sentinel-Trace HUD** provides real-time, agent-to-agent "neural health" monitoring for the v4 Dashboard. It is a high-performance visual component that integrates with the existing dashboard to show the state of the Tailscale mesh and Supabase infrastructure.

## 2. Requirements & Constraints

### 2.1 Functional Requirements (Agent-Driven)
- **Node Discovery:** Must automatically discover all peers in the Tailscale tailnet via the Local API.
- **Status Mapping:** Map Boolean `Online` status to radial dot illumination (Green/Yellow/Red).
- **Latency Visualization:** DERP/Relay status must trigger a "low-fidelity" visual (Yellow Pulse).
- **Activity Monitoring:** `RxBytes` and `TxBytes` must drive the "Pulse Intensity" of each node's "ping" ripple.
- **Infrastructure Pulse:** The central hub must visualize Supabase health (`pg_stat_activity_count`).

### 2.2 Aesthetic & UX Requirements (Lux Aesthetic 3.0)
- **Hybrid-Radial Architecture:** Core radial scanner and node pulses must use **HTML5 Canvas** for 60FPS fluid motion.
- **Decorative Geometry:** Outer rings, labels, and static UI elements must use **SVG** styled with **Tailwind CSS**.
- **Theming:** Must strictly adhere to the v4 "Lux 3.0" dark theme (Onyx background, Neon-Emerald/Golden-Amber highlights).
- **Ambient Intelligence:** Information must be conveyed through motion and color, not text density.

### 2.3 Technical Constraints
- **Low-Latency Streaming:** Updates must be broadcast via **Supabase Realtime (Broadcast)**.
- **High-Frequency Polling:** The `ts-exporter` sidecar must poll the Tailscale Unix socket every 1-2 seconds.
- **Dashboard Integration:** Must be a standalone React component `<SentinelTraceHUD />` that fits into the v4 dashboard grid.
- **Browser Performance:** Must maintain 60FPS on Chrome/Brave (Desktop) with up to 50 active nodes.

## 3. Data Structure (Sentinel-Trace Packet)
```json
{
  "component": "sentinel-trace",
  "payload": {
    "network": {
      "nodes": [
        { "id": "node-alpha", "online": true, "relay": false, "activity": 0.42 },
        { "id": "node-bravo", "online": true, "relay": true, "activity": 0.15 }
      ]
    },
    "infrastructure": {
      "db_status": "healthy",
      "load": 0.24
    }
  }
}
```

## 4. UI/UX Flow
1. **Initial Scan:** On mount, the component fetches the initial state from the Supabase `system_health` table.
2. **Realtime Listen:** Subscribes to the `system_health` Broadcast channel.
3. **Radial Mapping:** New nodes are assigned a $(\rho, \theta)$ coordinate based on their ID hash.
4. **Animation Loop:** `requestAnimationFrame` (rAF) drives the Canvas scanner and ripple effects.

## 5. Success Criteria (QA)
- [ ] No visual stuttering when more than 20 nodes are active.
- [ ] "Ping" pulses correlate visually with real network activity.
- [ ] Transition from Online -> Offline is smooth (fade-out vs. abrupt removal).
- [ ] Complies with Lux Aesthetic 3.0 (Zero clunky borders, subtle glows).

---
*Authored by Jordan (Strategist) on behalf of John (Product Manager).*

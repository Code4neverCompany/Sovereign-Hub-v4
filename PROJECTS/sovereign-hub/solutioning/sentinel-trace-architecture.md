# Sentinel-Trace Architecture (SH-501)

## Overview
The Sentinel-Trace HUD is an ambient infrastructure monitoring module for Sovereign Hub v4. It visualizes agent connectivity (Tailscale) and core health (Supabase) using a radial topology.

## Components
1. **Core (Canvas):** `v4/core/sentinel.js` - Handles 60FPS radial rendering, pulses, and node management.
2. **HUD Overlay:** Integrated into `v4/index.html` within the `#intel-stream` section.
3. **Data Link:** Wired in `v4/app.js` to the `agent_states` and `agent_logs` Supabase channels.

## Lux Aesthetic 3.0 Rules
- **Minimalist Palette:** Gold (#D4AF37), Cyan (#00F2FF), Void (#0A0A0B).
- **Ambient Feedback:** Status updates trigger radial pulses instead of text flashes.
- **Fluid Motion:** 60FPS requestAnimationFrame loop for scanner and ripples.

## Data Mapping
- **Agent Logs (Insert):** Triggers an 'activity' pulse on the corresponding node.
- **Agent States (Update):** Updates node status (Nominal/Active) and ensures node exists on the radial map.

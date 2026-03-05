# Product Brief: Sentinel-Trace HUD Module
**Project:** Sovereign Hub v4.0 (Slim-Stack)
**Owner:** John (Product Manager)
**Status:** Draft / Planning Phase
**Aesthetic:** Lux Aesthetic 3.0 (Agent-Driven)

## 1. Executive Summary
The **Sentinel-Trace HUD** is a mission-critical observability module for the Sovereign Hub v4.0 Dashboard. It provides a real-time, high-fidelity visual representation of the internal "neural health" of the agent-to-agent network (Tailscale Mesh) and the core infrastructure (Supabase/Postgres). 

Designed with the **Lux Aesthetic 3.0** philosophy, it prioritizes "ambient intelligence"—conveying complex system states through fluid animations and minimalist radial data visualizations rather than dense text grids.

## 2. The Problem
As the Sovereign Hub scales, the "Blind-Spot" problem grows. Operators cannot easily see if sub-agents are disconnected, if database replication is lagging, or if the Tailscale mesh is relying on high-latency relays (DERP). Standard monitoring tools are too "clunky" and break the immersion of the Sovereign Hub's elite user experience.

## 3. The Solution: Sentinel-Trace
A "Hybrid-Radial" HUD component integrated into the v4 Dashboard that:
- **Visualizes Neural Health:** Every active agent node is a "synapse" on a radial map.
- **Streams Real-Time Status:** Low-latency updates via Tailscale Local API and Supabase Realtime.
- **Enforces Lux Aesthetic 3.0:** Uses HTML5 Canvas for 60FPS "ping" pulses and SVG for high-end decorative geometry.

## 4. Key Features (Agent-Driven)
- **Radial Node Topology:** A circular map of all peers in the Tailscale Tailnet.
- **Neural Pulse:** Activity-based "ripples" emanating from nodes based on Rx/Tx byte flow.
- **DERP/Relay Warning:** Color-shifted "ghost" pulses when a node is trapped behind a high-latency relay.
- **Infrastructure Core:** A central "Orb" representing Supabase/Postgres health (Pulse = Load Factor).

## 5. User Persona: The Sovereign Operator
The Operator needs to know, at a glance, if the "Hives" (Agent clusters) are healthy. They don't want to run `tailscale status` or check the Supabase dashboard. They want to see the "Sentinel" glow steady and the "Trace" lines fluid.

## 6. Success Metrics
- **Zero-Latency Perception:** HUD updates must feel instantaneous (<100ms from event to visual).
- **Aesthetic Fidelity:** 60FPS fluid motion on modern browsers.
- **Information Density:** Capacity to visualize up to 50 agent nodes without visual clutter.

---
*Authored by Jordan (Strategist) on behalf of John (Product Manager).*

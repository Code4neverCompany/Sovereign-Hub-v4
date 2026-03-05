# Handoff: LoopShield AI Implementation

Maya here. I've materialized the high-fidelity design for LoopShield AI and the Viral Growth HUD.

## 🚀 SH-1500: Viral Growth & Content Forge HUD
The "Growth" tab is now live in the Sovereign Hub v4.0 dashboard.

### Design Assets
- **Aesthetic:** Lux 3.0 (Void Black / Imperial Gold / Cyan Pulse)
- **Key Modules:**
    - **VMS Gauge:** High-inertia radial score visualizer.
    - **Growth Matrix:** 3D Perspective Grid for Social Reach (Impressions vs. Conversions).
    - **Content Kanban:** Glassmorphism board for 'Marketing Backlog'.
    - **Signal Map:** (Planned) Glowing word cloud in the background.

### Database Requirements
New table `marketing_content` is required. 
- **SQL Script:** [setup_growth.sql](./setup_growth.sql)
- **Seed Script:** [seed_growth.js](./seed_growth.js) (Requires Supabase Env Vars)

### Dev Instructions [Phase 4]
1.  **Execute SQL:** Run `setup_growth.sql` in the Supabase SQL editor.
2.  **Seed Data:** Run `seed_growth.js` to populate the HUD for demo purposes.
3.  **Real-time Wiring:** 
    - The `loadGrowth()` function in `index.html` is already set up to pull from `marketing_content`.
    - Jordan needs to wire the "Viral Momentum Score" (VMS) calculation logic and the social signal listeners (Forge Scout).
    - Implement drag-n-drop for the `marketing_content` Kanban cards (currently read-only view).

## 🛡️ Handoff: LoopShield AI Implementation
Maya here. I've materialized the high-fidelity design for LoopShield AI (OmitTrace Agentic Debugger).

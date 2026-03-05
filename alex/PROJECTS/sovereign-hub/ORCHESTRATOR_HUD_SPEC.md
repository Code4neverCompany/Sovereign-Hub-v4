# ORCHESTRATOR HUD TECHNICAL BLUEPRINT (SH-005.3)

## 0. Metadata
- **Project:** Sovereign Hub (Epoch 2026)
- **Status:** Phase 1 Analysis Complete
- **Architect:** Alex (Architect / Deep Research)
- **Standard:** Aureum Luxury Cinematic (Noir/Glow/Gold)

---

## 1. Visual Representation: FAB-WP Logic Tree
To visualize the 5-Phase Logic Tree (Foundation, Automation, Bridge, Wisdom, Power), we will move beyond standard hierarchy.

### The Component Stack
- **Framework:** Next.js 15 (App Router).
- **Core Engine:** **React Flow** (for the node-based interactivity).
- **Styling:** Tailwind CSS + Framer Motion (for the "Cinematic Tech Glow").
- **Geometry:** Non-linear "Orbital" layout where Phase 1 (Foundation) is the gravity well and subsequent phases spiral outward.

### Phase Nodes
| Phase | UI Identifier | Logic Type | Aesthetic |
| :--- | :--- | :--- | :--- |
| **1: Foundation** | `ROOT_CORE` | Static Config | Deep Gold Glow, solid border |
| **2: Automation** | `AUTO_SPIN` | Event-Based | Pulse Blue, dashed links |
| **3: Bridge** | `MEM_TRANS` | Bidirectional | Gradient Shift (Gold to Cyan) |
| **4: Wisdom** | `INTEL_SYN` | Recursive | Crystalline/Glassmorphism |
| **5: Power** | `EXEC_GATE` | Deployment | High-Intensity Amber, Neon Border |

---

## 2. Telemetry Mapping: Nova's Decision Engine
Visualizing 'Nova's' (The Orchestrator) current state requires real-time data binding.

### Data Flow
1. **Source:** OpenClaw Gateway `logs` and `acp` session metadata.
2. **Intermediate:** Supabase Realtime (CDC - Change Data Capture).
3. **Frontend:** Custom hook `useNovaTelemetry()` subscribing to the `agent_dispatch` table.

### Visualized Paths
- **Active Path:** The current logical branch being executed is highlighted with a moving "data-packet" animation (Framer Motion `draw` transition) along the edge.
- **Agent Dispatch:** Sub-agents (Alex, Winston, etc.) appear as "Satellites" orbiting the parent node that triggered them.
- **Fail/Retry:** Nodes vibrate and turn "Crimson-Glow" on error, with a trail showing the backtracking logic.

---

## 3. Aesthetic: Aureum Standard
The "High-Luxury Cinematic" look is achieved through specific CSS/Motion constraints:

- **The Void:** Background is `#0a0a0a` with a subtle SVG grain filter for texture.
- **The Glow:** `box-shadow: 0 0 20px rgba(212, 175, 55, 0.3)` on active nodes.
- **Typography:** Inter (for data) paired with a monospace font (JetBrains Mono) for raw log streams.
- **Motion:** Transitions use a custom `cubic-bezier(0.22, 1, 0.36, 1)` (The "Quintessential Luxury" ease).

---

## 4. Implementation Blueprint (Supabase Schema)

### Table: `telemetry_node_logs`
- `id`: UUID
- `session_id`: UUID (matches OpenClaw `acp` session)
- `phase`: INT (1-5)
- `node_id`: STRING (the component key)
- `status`: ENUM (idle, processing, success, error)
- `metadata`: JSONB (contains the 'Nova' thought process string)
- `created_at`: TIMESTAMPTZ

### API Route: `/api/hud/tree-state`
Returns the current snapshot of the Logic Tree including active node weights.

---

## 5. Next Steps
1. [ ] Scaffold `components/hud/LogicTree.tsx` using React Flow.
2. [ ] Define the `AureumTheme` object in Tailwind config.
3. [ ] Integrate `supabase-js` for real-time telemetry updates.

**Blueprint Locked.**
🦾🏗️🛰️

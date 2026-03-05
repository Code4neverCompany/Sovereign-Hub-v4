# Sprint v4.0: Sovereign Hub Reactive HUD (Phase 2)

## Status: ACTIVE (BMad Cycle 2)
**Goal:** Transition from Next.js bloat to a high-velocity, agent-driven Vanilla Slim-Stack.

---

## Task Group 1: Foundation & Realtime Core
*Prioritize Agent-Driven sync for the "Matrix" and "Intel Stream".*

### [TASK SH-401] Initialize Sovereign Slim-Stack Repository
- **Action:** Create `index.html`, `style.css` (Tailwind CDN), and `app.js`.
- **Constraint:** Zero build tools. Use ES6 Modules.
- **Output:** Base layout with three main sections: `#agent-matrix`, `#intel-stream`, `#command-center`.

### [TASK SH-402] Database Schema Realignment (Supabase)
- **Action:** Ensure the following tables exist and have Realtime enabled.
- **Tables:**
  - `agent_states` (Columns: `id`, `agent_id`, `status`, `current_task`, `last_active`)
  - `agent_logs` (Columns: `id`, `created_at`, `agent_name`, `log_level`, `message`)
  - `todos` (Columns: `id`, `priority`, `assigned_to`, `status`, `task_description`)
- **SQL:** Run `ALTER PUBLICATION supabase_realtime ADD TABLE agent_states, agent_logs, todos;`

### [TASK SH-403] Implementation of `SovereignStream` Uplink
- **Action:** Implement the WebSocket listener logic in `core/uplink.js` (or integrated in `app.js`).
- **Logic:**
  - `INSERT` on `agent_logs` -> Trigger `UI.renderLogLine()`
  - `UPDATE` on `agent_states` -> Trigger `UI.updateAgentMatrix()`
  - `*` on `todos` -> Trigger `UI.refreshTaskBoard()`

---

## Task Group 2: Agent-Driven UI Components
*Materializing the HUD components based on ARCHITECTURE_v4.*

### [TASK SH-404] Materialize `AgentMatrix` (Sidebar)
- **Action:** Build the reactive left sidebar showing agent statuses.
- **Styling:** Lux Aesthetic 3.0 (Neural Pulses). LED status indicators (Online: Emerald, Busy: Amber, Idle: Slate).
- **Data Source:** `public.agent_states`.

### [TASK SH-405] Materialize `IntelStream` (Central Terminal)
- **Action:** Build the scrolling terminal for real-time agent logs.
- **Styling:** JetBrains Mono font, color-coded agent tags (Alex: #D4AF37, Maya: #9B59B6).
- **Data Source:** `public.agent_logs`.
- **Feature:** Auto-scroll to bottom on new `INSERT`.

---

## Task Group 3: Task Orchestration
*Connecting the Command Center to the BMad workflow.*

### [TASK SH-406] Materialize `CommandCenter` (Task Board)
- **Action:** Build the task grid/list in the right panel.
- **Styling:** Glassmorphism cards. Border-left color intensity based on `priority`.
- **Data Source:** `public.todos`.
- **Interaction:** One-click status updates that sync back to Supabase.

---

## Handoff Instructions for Dev [Builder]
1.  **Start with SH-401 & SH-402.** Verify Supabase connectivity and schema existence.
2.  **Move to SH-403 (The Engine).** Ensure Realtime payloads are being logged to the console before building UI.
3.  **Implement UI Components (SH-404, SH-405, SH-406) sequentially.**
4.  **Final Polish:** Audit against ARCHITECTURE_v4 Performance Targets (FCP < 0.4s).

**Authority:** FULL AUTONOMOUS AUTHORITY (PARTYMODE) GRANTED to Dev.

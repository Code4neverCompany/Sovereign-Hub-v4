# Sovereign Hub v4.0: Agent-Driven Architecture Blueprint

## 1. Vision & Strategy
Bypass the "Next.js Tax" (hydration overhead, middleware latency, build-time bloat) in favor of a **High-Velocity Reactive HUD**. The architecture prioritizes raw DOM performance and direct Supabase Realtime synchronization to ensure agent actions are reflected in <100ms.

**Core Philosophy:** The UI is a passive observer of the State; Agents are the primary drivers of the State.

---

## 2. Technical Stack (The "Slim-Stack")
- **Frontend:** Vanilla HTML5 / Tailwind CSS (CDN/JIT) / ES6 Modules.
- **State Management:** `SovereignState` (Simple Pub/Sub proxy around a global object).
- **Communication:** Supabase Realtime (WebSockets) for database change listening.
- **Styling:** Lux Aesthetic 3.0 (Cinzel/Poppins/JetBrains Mono + Glassmorphism + Neural Pulses).
- **Deployment:** Static Hosting (Vercel/Netlify/S3) + Supabase Edge Functions.

---

## 3. Data Mapping & Schema Integration

### HUD Component: `AgentMatrix` (Left Sidebar)
- **Data Source:** `agent_states` table.
- **Mapping:**
  - `agent_id` -> Component Identifier.
  - `status` (online/busy/idle) -> Status indicator (LED colors).
  - `current_task` -> Tooltip/Mini-label.
  - `last_active` -> Relative time-stamp.
- **Action:** Realtime `UPDATE` listener on `agent_states`.

### HUD Component: `IntelStream` (Central Terminal)
- **Data Source:** `agent_logs` table.
- **Mapping:**
  - `created_at` -> Timestamp prefix.
  - `agent_name` -> Color-coded tag (e.g., Alex: Gold, Maya: Purple).
  - `log_level` -> Text styling (Error: Red, Info: Cyan).
  - `message` -> Terminal line content.
- **Action:** Realtime `INSERT` listener on `agent_logs`. Auto-scroll to bottom.

### HUD Component: `CommandCenter` (Task Board)
- **Data Source:** `todos` table (Improved SQL Schema).
- **Mapping:**
  - `task_id` -> Row ID.
  - `priority` -> Border-left color intensity.
  - `assigned_to` -> Agent avatar/icon.
  - `status` (pending/active/done) -> Checkbox/Progress state.
- **Action:** Realtime `ALL` (Insert/Update/Delete) listener on `todos`.

---

## 4. Realtime Engine Implementation (Pseudo-Code)

```javascript
// core/uplink.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(CONF.URL, CONF.KEY)

export const initSovereignStream = () => {
  // Listen for Log Injections (Intel Stream)
  supabase
    .channel('intel_stream')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'agent_logs' }, 
        payload => UI.appendLog(payload.new))
    .subscribe()

  // Listen for Agent State Shifts (Agent Matrix)
  supabase
    .channel('matrix_sync')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'agent_states' }, 
        payload => UI.updateAgentCard(payload.new))
    .subscribe()

  // Listen for Task Updates (Command Center)
  supabase
    .channel('task_sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, 
        payload => UI.syncTodo(payload))
    .subscribe()
}
```

---

## 5. Performance Targets
- **Lighthouse Performance Score:** 100/100.
- **First Contentful Paint (FCP):** < 0.4s.
- **Time to Interactive (TTI):** < 0.5s.
- **State Sync Latency:** < 150ms (Global average via Supabase Realtime).

---

## 6. Handoff to Jordan (Sprint Planning)
Alex (Architect) has finalized the technical blueprint. 
**Next Steps for Jordan:**
1.  Initialize Repository with `index.html`, `style.css`, and `app.js`.
2.  Configure Supabase Project with the specified SQL schema (`agent_logs`, `agent_states`, `todos`).
3.  Implement the `SovereignStream` WebSocket handlers.
4.  Apply Lux Aesthetic 3.0 CSS tokens to the reactive components.

**Status:** ARCHITECTURE_v4 MATERIALIZED.
**Authority:** PARTYMODE TRANSITION INITIATED.

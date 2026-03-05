# [PHASE 1: ARCHITECTURAL BLUEPRINT]
# Project: Sovereign Hub v4.0 (Slim-Stack)
# Epic: Swarm Collective Intelligence [SH-1100]
# Objective: Neural Cross-Link (Real-Time Swarm Memory)

## 1. SHARED MEMORY: The `swarm_knowledge` Infrastructure

To enable parallel agents to share insights without redundant research, we implement a Vector-enabled Postgres table in Supabase. This acts as the "Hive Mind" for all active sessions.

### **Database Schema: `swarm_knowledge`**

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key (default: `gen_random_uuid()`). |
| `created_at` | `timestamptz` | Timestamp of entry (default: `now()`). |
| `agent_id` | `text` | Source agent (e.g., 'alex', 'maya', 'dev'). |
| `mission_id` | `uuid` | Reference to the current task/epic ID. |
| `type` | `text` | Category: `CONSTRAINT`, `INSIGHT`, `STATE`, `DISCOVERY`. |
| `content` | `text` | The core observation or data point. |
| `metadata` | `jsonb` | Context: file paths, error codes, specific model used. |
| `embedding` | `vector(1536)` | Vector embedding for semantic similarity search. |
| `priority` | `int` | 1 (Low) to 5 (Critical Signal). |

---

## 2. CROSS-TALK PROTOCOL: The "Swarm Signal" Mechanism

The "Swarm Signal" is a real-time broadcast system built on **Supabase Realtime (Postgres Changes)**. It allows agents to interrupt or inform each other mid-execution.

### **The Signal Workflow:**
1.  **Detection:** An agent (e.g., Alex) identifies a critical constraint (e.g., "Supabase RLS policy prevents writing to table X").
2.  **Emission:** The agent writes to `swarm_knowledge` with `priority = 5` and `type = CONSTRAINT`.
3.  **Broadcast:** A database trigger fires a notification to the `swarm_signals` channel.
4.  **Reception:** All active agent processes (subagents) listening to the channel receive the payload.
5.  **Reaction:** Subagents check the payload against their current task. If relevant, they adjust their plan or pause for clarification.

### **Signal Payload Example:**
```json
{
  "event": "SWARM_SIGNAL",
  "payload": {
    "source": "alex",
    "type": "CONSTRAINT",
    "priority": 5,
    "message": "Critical: Directory /v4/core/ is read-only in current environment.",
    "impact": "Low-level engine modifications blocked."
  }
}
```

---

## 3. BLUEPRINT: "Swarm Pulse" UI (Agents Tab)

The **Swarm Pulse** is a real-time visualization of agent interaction, integrated into the Sovereign Hub dashboard.

### **UI Components:**
*   **The Hub:** A central node representing the `swarm_knowledge` table.
*   **The Satellites:** Active agent icons (Alex, Maya, Jordan, etc.) orbiting the Hub.
*   **The Pulse Lines:** 
    *   **Inbound (Blue):** An agent querying the Hive Mind for existing knowledge.
    *   **Outbound (Amber):** An agent contributing a new discovery/insight.
    *   **Signal Flash (Red):** A high-priority "Swarm Signal" broadcasting across the network.
*   **Knowledge Stream:** A side-feed showing the last 10 entries in `swarm_knowledge` in real-time.

---

## 4. OPTIMIZATION: SH-800 EngineSwitch Integration

The `EngineSwitch` (Strategic Optimization) is upgraded to be "Swarm-Aware." It no longer routes based solely on local task content, but also on global swarm health.

### **Logic Enhancement:**
```javascript
// core/engine-switch.js update
async function getOptimalModel(task, swarmState) {
    // 1. Check Swarm for "Failure Signals"
    const failureRate = await swarmState.getRecentFailureRate(task.type);
    
    // 2. If the swarm reports high failure for Gemini on this task type, 
    // force escalation to Claude Opus regardless of Tier 1/2 status.
    if (failureRate > 0.3) {
        return 'claude-opus-4.6'; // Swarm-driven escalation
    }

    // 3. Fallback to standard SH-800 logic
    return standardRoute(task);
}
```

---

## 5. HANDOFF: Jordan [Strategist]

### Technical Spec for Implementation
*   **Epic:** SH-1100 (Collective Intelligence).
*   **Core Value:** Eliminates redundant agent effort and prevents "collision" during parallel execution (multiple agents trying to solve the same constraint independently).
*   **User Stories:**
    1.  *Shared Discovery:* "As an agent, I want to check if any other agent has already mapped the file structure of `/v4/core` so I don't have to spend tokens running `ls -R` again."
    2.  *Real-time Alert:* "As an operator, I want to see a visual 'Pulse' when agents are sharing data, so I know the swarm is collaborating effectively."
    3.  *Adaptive Routing:* "As the system, I want to stop using a specific model for a specific task if the swarm reports it's consistently failing, ensuring high reliability."

### Status Update
- [x] Shared Memory Table Designed (`swarm_knowledge`).
- [x] Cross-Talk Protocol Designed (Supabase Realtime).
- [x] UI Blueprint Drafted (Swarm Pulse).
- [x] EngineSwitch Integration Logic Defined.
- [ ] Next Step: SQL Schema implementation and `engine-switch.js` refactor.

# 📋 User Stories: Swarm Collective Intelligence [SH-1100]
**Project:** Sovereign Hub v4.0  
**Epic:** Swarm Collective Intelligence [SH-1100]  
**Objective:** Neural Cross-Link and Real-time Knowledge Sharing.

---

## 🏗️ 1. Real-time Insight Sharing (The Hive Mind)
**Goal:** Enable agents to share and reuse discoveries to eliminate redundant research and tokens.

### **SH-1100.1: [Insight Entry] Agent Contribution to Swarm Knowledge**
*   **As an** active agent,
*   **I want to** log my discoveries (file structures, constraints, environment variables) to a shared `swarm_knowledge` table,
*   **So that** other agents working in parallel can benefit from my research immediately.
*   **Acceptance Criteria:**
    *   Agent can write to `swarm_knowledge` with `type` (CONSTRAINT, INSIGHT, etc.) and `priority`.
    *   Automatic vector embedding generation for semantic search.
    *   Entries include `metadata` for context (file paths, error codes).

### **SH-1100.2: [Insight Retrieval] Semantic Swarm Lookup**
*   **As an** active agent starting a new task,
*   **I want to** query the Hive Mind for relevant existing knowledge based on my task context,
*   **So that** I don't repeat expensive operations (like `ls -R` or complex `grep` searches) already performed by others.
*   **Acceptance Criteria:**
    *   Integration of vector search in agent startup/planning phase.
    *   Threshold-based filtering for relevant insights.
    *   Significant reduction in redundant "exploration" tool calls.

---

## 📡 2. Swarm Signal (Cross-Talk Protocol)
**Goal:** A real-time interrupt system for critical updates and constraints.

### **SH-1100.3: [Signal Broadcast] High-Priority Constraint Emission**
*   **As an** agent encountering a critical blocker (e.g., read-only filesystem, API outage),
*   **I want to** broadcast a "Swarm Signal" to all active sessions,
*   **So that** the entire swarm can pivot or pause immediately without waiting for their own failure.
*   **Acceptance Criteria:**
    *   Supabase Realtime trigger on `priority 5` entries in `swarm_knowledge`.
    *   Low-latency broadcast to the `swarm_signals` channel.

### **SH-1100.4: [Signal Reception] Subagent Adaptive Reaction**
*   **As a** subagent running a task,
*   **I want to** listen for incoming Swarm Signals and evaluate their impact on my current mission,
*   **So that** I can adjust my strategy or halt execution if a critical constraint is detected elsewhere.
*   **Acceptance Criteria:**
    *   Subagents maintain an active listener for `swarm_signals`.
    *   Automated impact assessment logic (Is this signal relevant to my working directory/tools?).
    *   Graceful "Pivot" or "Pause" states implemented.

---

## 🎨 3. Swarm Pulse HUD (Visualization)
**Goal:** Real-time visibility into the collective's health and activity.

### **SH-1100.5: [UI] The Swarm Pulse Dashboard**
*   **As an** operator,
*   **I want to** see a visual map of active agents orbiting a central "Knowledge Hub,"
*   **So that** I can intuitively monitor swarm collaboration and identify communication bottlenecks.
*   **Acceptance Criteria:**
    *   Real-time animation of "Pulse Lines" (Inbound/Outbound/Signal Flash).
    *   Color-coded activity (Blue: Querying, Amber: Contributing, Red: Signaling).
    *   Agent status indicators (Active, Thinking, Paused).

### **SH-1100.6: [UI] Knowledge Stream Side-Feed**
*   **As an** operator,
*   **I want to** see a scrolling feed of recent entries in the `swarm_knowledge` table,
*   **So that** I can read the specific insights being shared without digging into database logs.
*   **Acceptance Criteria:**
    *   Real-time feed component in the HUD.
    *   Display of `type`, `source agent`, and a snippet of `content`.

---

## ⚙️ 4. Swarm-Aware Engine Switching
**Goal:** Collective reliability through shared failure awareness.

### **SH-1100.7: [Logic] Swarm-Aware Model Escalation**
*   **As the** EngineSwitch system,
*   **I want to** check the swarm's recent failure rate for specific model/task combinations,
*   **So that** I can proactively escalate to a more capable model (e.g., Claude Opus) if the standard model is struggling across the swarm.
*   **Acceptance Criteria:**
    *   `EngineSwitch` queries `swarm_knowledge` for failure signals before routing.
    *   Dynamic threshold for escalation (e.g., >30% failure rate in the last 10 tasks).
    *   Override mechanism for "Standard Routing" based on collective health.

---

## 🚀 ROI & Value Proposition
*   **Efficiency:** ~30-50% reduction in redundant exploration tokens.
*   **Reliability:** Faster failure detection via the Cross-Talk Protocol.
*   **Visibility:** Clear, real-time understanding of how multiple agents are cooperating.
*   **Intelligence:** Models "learn" from each other's failures in real-time through the EngineSwitch.

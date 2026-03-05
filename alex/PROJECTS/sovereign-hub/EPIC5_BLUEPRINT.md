# EPIC-5: THE AUTONOMOUS INTEGRATION LAYER - BLUEPRINT
## Phase 1 Architecture | Alex (Architect)
**Date:** 2026-03-04
**Status:** DRAFT / ANALYSIS LOOP TRIGGERED

---

## 1. Feasibility Analysis: "One-Click Dispatch"
### Infrastructure Overview
The current architecture utilizes a **Next.js Web UI** acting as the "Command Center" and a **Node.js OpenClaw Gateway** as the dispatch engine. 

### Feasibility Findings
- **Next.js API Routes:** High feasibility. We can implement a `POST /api/dispatch` endpoint that leverages the `openclaw` CLI or the Gateway's WebSocket/REST interface to trigger specific sub-agents.
- **OpenClaw `acp spawn`:** Recent releases support "ACP/Thread-bound agents." This allows the Web UI to spawn persistent agent sessions specifically for dispatched tasks (Story SH-005.1).
- **Security:** Requires strict `target-path` validation and auth-profile support (referencing OpenClaw v26.155 security standards).

### Recommendation
Implement a "Dispatch Trigger" component in the Next.js HUD that sends a standardized JSON payload to the OpenClaw Gateway, initiating an `acp spawn` command with pre-defined parameters.

---

## 2. Blueprint: Neural Memory Bridge
### Concept
The **Neural Memory Bridge** is the bidirectional data conduit between the real-time **HUD Intel Stream** (UI/UX) and the long-term **BRAIN/quantum-vault/** (Sovereign Knowledge Base).

### Multi-Layer Design
1.  **Ingestion Layer (HUD):** Captures transient data (chat logs, web_search results, sensor data).
2.  **Synthesis Layer (OpenClaw):** Processes raw intel into structured Markdown/JSON.
3.  **Storage Layer (Quantum-Vault):** Commits synthesized data to `/BRAIN/quantum-vault/journals/YYYY-MM-DD.md`.
4.  **Logging Layer (Supabase):** Mirroring all bridge transitions to external Supabase tables for audit and reliability.

### Flow
`HUD (Next.js) -> Dispatch (Gate) -> Alex (Agent) -> BRAIN Storage -> Supabase Log`

---

## 3. Technical Specification: Story SH-005.1 through SH-005.3

### SH-005.1: The Dispatch Interface (Frontend)
- **Goal:** Create the "One-Click" UI component in Next.js.
- **Requirements:** 
    - Input: Task prompt + Target Agent selection.
    - Action: Trigger API call to `/api/agent/dispatch`.
    - Feedback: Visual "Pulse" indicating agent activity.

### SH-005.2: The Gateway Connector (Backend)
- **Goal:** Bridge Next.js API to OpenClaw runtime.
- **Requirements:**
    - Handle `acp spawn` calls.
    - Manage session persistence.
    - Return a unique `SessionID` to the frontend for HUD tracking.

### SH-005.3: Memory Bridge Implementation (Logic)
- **Goal:** Automation of the "Journaling" process.
- **Requirements:**
    - Trigger: Completion of an Epic/Story.
    - Action: `write` to `/BRAIN/quantum-vault/journals/` and `message` to Supabase.
    - Format: Semantic Markdown with tags.

---

## 4. Execution Roadmap
1. [ ] Create `/BRAIN/quantum-vault/journals/` directory structure.
2. [ ] Prototype the `dispatch` route in Next.js.
3. [ ] Initialize Supabase logging schema for Epoch 2026.

**End of Blueprint.**
🦾🏗️🛰️

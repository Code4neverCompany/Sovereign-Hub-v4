# 🔱 [SH-2000] Sovereign Singularity: User Stories & Sprint Plan

## 🎯 Epic Overview
The **Sovereign Singularity [SH-2000]** is the final evolution of the Sovereign Hub v4.0—the transformation into a self-healing, autonomous digital organism. This plan sequences the technical architecture defined by Alex into actionable user stories for the Hive.

---

## 📖 User Stories

### 🔍 Category: System Diagnostics (The Immune System)
**Story SH-2000.7: Diagnostic Data Infrastructure**
* **As a** Sovereign System,
* **I want to** log all health anomalies (JS crashes, API timeouts, 404s) into a unified `system_diagnostics` table,
* **So that** the Neural Repair Layer has a structured record of all failures to analyze and resolve.
* **Acceptance Criteria:**
    - [ ] Supabase table `system_diagnostics` is created per ARCHITECTURE_SH2000.md.
    - [ ] Indexes on `repair_status` and `severity_level` are implemented for performance.
    - [ ] `id`, `timestamp`, `error_type`, and `severity_level` fields are correctly populated.

**Story SH-2000.8: Real-time Error Interception**
* **As a** Sovereign User,
* **I want** the system to automatically intercept front-end and back-end errors via `NeuralRepair.js` middleware,
* **So that** I don't have to manually report bugs.
* **Acceptance Criteria:**
    - [ ] `window.onerror` and failed `fetch` calls are wrapped by the interceptor.
    - [ ] Errors are classified as 'transient' (retry) or 'structural' (repair).
    - [ ] Critical failures (Severity 3) trigger the autonomous spawning hook.

### 🧠 Category: Neural Repair Logic (The Brain)
**Story SH-2000.9: Autonomous Repair Spawning**
* **As a** Sovereign Product Owner,
* **I want** the system to deploy an OpenClaw Dev Sub-agent whenever a Severity 3 error is logged,
* **So that** the platform can fix itself without human intervention.
* **Acceptance Criteria:**
    - [ ] `spawnRepairMission` logic successfully invokes the `subagents` tool.
    - [ ] The spawned agent receives the full diagnostic context (ID, stack trace, file path).
    - [ ] `REPAIR_MISSION_TEMPLATE.md` is used as the base prompt for the Dev Agent.

**Story SH-2000.10: Shadow Build Verification**
* **As a** Sovereign System,
* **I want** all repairs to be performed in an isolated `/v4/shadow_build/` environment,
* **So that** experimental fixes do not break the production dashboard.
* **Acceptance Criteria:**
    - [ ] Sub-agent successfully clones affected files to the shadow directory.
    - [ ] Fixes are applied only within the shadow environment initially.
    - [ ] Automated verification scripts (`verify_ui_*.js`) must pass before merging.

### 📊 Category: Visual HUD (The Feedback Loop)
**Story SH-2000.11: Singularity Pulse HUD**
* **As a** Sovereign User,
* **I want** a real-time "Neural Node" in the dashboard header that pulses based on system health,
* **So that** I can see the status of autonomous repairs at a glance.
* **Acceptance Criteria:**
    - [ ] Pulse Icon colors: Green (Nominal), Yellow (Investigating), Red (Repairing).
    - [ ] On click, shows a mini-terminal with active mission details.
    - [ ] Real-time updates via Supabase Realtime for the pulse state.

---

## 🛡️ Repair Protocol: Shadow Build Verification
To ensure system stability, all autonomous repairs must follow these "Shadow Build" steps:

1.  **Isolation:** Clone the target file(s) into `/v4/shadow_build/[diagnostic_id]/`.
2.  **Shadow Patch:** Apply the code fix within the isolated directory.
3.  **Syntactic Check:** Run a linter or basic syntax check on the patched file.
4.  **UI Verification:** Execute headless browser tests (e.g., `verify_ui_*.js`) against the shadow environment.
5.  **Logic Diff:** Compare the `Logic Diff` (Old vs. New) to ensure no unintended side effects.
6.  **Hot-Swap:** Overwrite the production file only after all tests return `SUCCESS`.

---

## 🎨 Handoff to Maya [Phase 3]
**Objective:** Design the visual language for the Self-Healing layer.

**Design Brief:**
1.  **Singularity Pulse Node:** Create a header-mounted icon that feels alive. It should have three distinct pulsing frequencies:
    - *Steady Green:* 0.5Hz pulse (Living system).
    - *Searching Yellow:* 2Hz erratic pulse (Diagnostic mode).
    - *Urgent Red:* 5Hz rapid pulse (Active Sub-agent repair).
2.  **Logic Diff Visualizer:** A clean, modal-based UI that shows the code "before" and "after" the repair, highlighting the fix in a neon-cyan color.
3.  **Repair HUD Terminal:** A "Matrix-style" mini-terminal that slides out when the Pulse Node is clicked, showing raw logs of the active Repair Mission.

---

## 📅 SH-2000 Sprint Allocation
| Task ID | Task Name | Priority | Assigned |
| :--- | :--- | :--- | :--- |
| SH-2000.3 | `system_diagnostics` SQL Schema & Logic | HIGH | Alex |
| SH-2000.4 | `NeuralRepair.js` Middleware | HIGH | Alex |
| SH-2000.5 | Automated Dev-Agent Spawning | HIGH | Alex |
| SH-2000.2 | UX/UI Design: Pulse HUD & Diff Visualizer | MEDIUM | Maya |
| SH-2000.6 | Singularity HUD Implementation | MEDIUM | Maya |

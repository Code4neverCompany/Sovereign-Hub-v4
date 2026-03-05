# [PHASE 1: ARCHITECTURAL BLUEPRINT]
# Project: Sovereign Hub v4.0 (Slim-Stack)
# Epic: Sovereign Executive Bridge [SH-1300] - FINAL
# Objective: Design the unified "CEO Briefing" and "Directive Uplink" layer.

## 1. EXECUTIVE SUMMARY: The `executive_briefings` Infrastructure

The `executive_briefings` table provides the high-level cognitive layer for the Sovereign (The User), distilling massive hive activity into a single, hourly "CEO-ready" report.

### **Database Schema: `executive_briefings`**

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key (default: `gen_random_uuid()`). |
| `timestamp` | `timestamptz` | Time the briefing was generated. |
| `hour_start` | `timestamptz` | The start of the window being summarized. |
| `hour_end` | `timestamptz` | The end of the window being summarized. |
| `summary_text` | `text` | The AI-distilled narrative of the hour's progress. |
| `total_cost_usd` | `numeric(10,6)` | Aggregated cost from `token_usage` for the window. |
| `total_tasks` | `integer` | Count of agent actions executed. |
| `forge_state` | `jsonb` | Snapshot of active products in `product_blueprints`. |
| `system_health` | `text` | Status indicator (`OPTIMAL`, `DEGRADED`, `CRITICAL`). |
| `metadata` | `jsonb` | Context: most active agent, top niche identified, etc. |

### **The Briefing Engine:**
A cron-job (Supabase Edge Function or local worker) triggers every hour at `:00`:
1.  **Aggregate:** Sums costs from `token_usage` and tasks from `agent_metrics`.
2.  **Summarize:** Feeds the raw logs of the past hour to a LLM (Gemini-3-Flash) with the prompt: *"You are the Sovereign Architect. Summarize the Hive's activity for the past hour into 3 bullet points: Wins, Costs, and Forge Status."*
3.  **Persist:** Writes the output to `executive_briefings`.

---

## 2. VOICE-TO-DIRECTIVE: The "Speech-to-Task" Bridge

The Directive Uplink allows the Sovereign to steer the entire Hive using natural language commands, which are then decomposed into executable agent missions.

### **The Command Pipeline:**
1.  **Capture:** The "Command" Tab captures audio via `MediaRecorder` API.
2.  **Transcribe:** Audio is streamed to a STT service (e.g., Whisper/OpenAI/Groq).
3.  **Parse (The Intent Layer):**
    *   **Input:** "Alex, scout the market for local AI-first SEO tools for dentists."
    *   **LLM Action:** Extracts `Intent: RESEARCH`, `Target: SEO Tools`, `Niche: Dentists`.
4.  **Decompose (The Decomposition Layer):**
    *   The system creates a "Parent Directive" and spawns "Child Missions".
    *   *Alex (Research):* "Find top 10 pain points for dental SEO."
    *   *Jordan (Strategy):* "Develop a roadmap for a 'Dental-Bot' MVP."
5.  **Inject:** Missions are pushed into the `product_blueprints` table with status `IDEA`, triggering the SH-1200 Forge pipeline.

---

## 3. BLUEPRINT: The "Command" Tab (God-View HUD)

The final high-fidelity view designed for strategic oversight and direct intervention.

### **UI Components (HUD Layout):**
*   **The Pulse (Analytics Sidebar):**
    *   *Real-time Burn:* A speedometer-style widget showing $/hr.
    *   *Success Rate:* A circular health bar showing the ratio of successful tasks vs. errors.
*   **The Global Node Map (Center Canvas):**
    *   A visualization of all active worker pods. 
    *   Each pod glows when an agent is active. 
    *   Clicking a pod shows the live `process` log from OpenClaw.
*   **The Directive Uplink (Right Panel):**
    *   **Vocal Orb:** A pulsating visualizer that reacts to the Sovereign's voice.
    *   **Directive Log:** A timeline of vocal commands and how they were decomposed into missions.
*   **The Forge Status (Bottom Dock):**
    *   Horizontal cards for every product in the Forge.
    *   Shows current phase: `RESEARCH` -> `STRATEGY` -> `DESIGN` -> `DEV`.

---

## 4. FINAL HANDOFF: Jordan [Strategist]

### Technical Spec for Implementation
*   **Epic:** SH-1300 (Sovereign Executive Bridge).
*   **Core Value:** Zero-friction command and control for the Hive operator.
*   **User Stories:**
    1.  *CEO Insight:* "As the Sovereign, I want to wake up and see exactly how much the Hive spent while I slept and what products were prototyped."
    2.  *Vocal Autonomy:* "As the Sovereign, I want to say 'Build a fleet of price-comparison bots' and have the system automatically start the Forge pipeline."
    3.  *God-View Map:* "As an operator, I want to see the physical location and status of my worker pods in a unified map view."

### Status Update
- [x] `executive_briefings` Schema Designed (Cognitive Layer).
- [x] Speech-to-Task Logic Defined (Directive Bridge).
- [x] Command Tab God-View UI Drafted (HUD Interface).
- [x] Final Handoff Spec Prepared for Jordan.

**Next Step:** Jordan to finalize the v4 sprint cycle and prepare for the Sovereign Hub v4.0 "Unstoppable" Deployment.

# 🔱 User Stories: Dynamic Model-Switching Engine [SH-800]

## 🎯 Epic Overview
**Project:** Sovereign Hub v4.0 (Slim-Stack)  
**Epic:** Strategic Optimization [SH-800]  
**Objective:** Implement an intelligent routing middleware that dynamically selects the optimal LLM (Gemini 3 Flash vs. Claude Opus 4.6) based on task complexity, cost, and latency requirements.

---

## 📖 User Stories

### 1. [SH-800.1] Complexity-Based Auto-Routing
**As an** Operator,  
**I want** the system to automatically analyze my prompt and route it to the most efficient model (Tier 1-4),  
**So that** I don't waste expensive frontier-model tokens on simple utility tasks.  
- **Acceptance Criteria:**
    - [ ] System correctly identifies "Micro" (T1) and "Utility" (T2) tasks and routes them to Gemini 3 Flash.
    - [ ] System identifies "Cognitive" (T3) and "Creative" (T4) tasks (via keywords like 'architect', 'refactor', 'philosophical') and routes them to Claude Opus 4.6.
    - [ ] Latency for the routing decision itself is < 100ms.

### 2. [SH-800.2] High-Context Bypass
**As a** Power User,  
**I want** tasks with massive context windows (>1M tokens) to automatically bypass expensive models,  
**So that** I can process large datasets without hitting prohibitive costs or context limits.  
- **Acceptance Criteria:**
    - [ ] Middleware detects `contextLength > 1,000,000`.
    - [ ] Force-routes to Gemini 3 Flash regardless of complexity signals.

### 3. [SH-800.3] Manual Model Override (Force-Mode)
**As a** Developer,  
**I want** to be able to explicitly specify a model (e.g., via CLI flag or UI toggle),  
**So that** I can bypass the automated routing when I know a specific nuance is required.  
- **Acceptance Criteria:**
    - [ ] Nexus Dispatcher respects `model_id` if provided in the task payload.
    - [ ] Manual override logs a specific "Override" event for audit purposes.

### 4. [SH-800.4] Fallback & Resilience Logic
**As an** Operator,  
**I want** the system to automatically fall back to an alternative model if the primary choice is rate-limited or unavailable,  
**So that** my workflows are never interrupted.  
- **Acceptance Criteria:**
    - [ ] If Claude Opus 4.6 returns a 429 (Rate Limit) or 5xx error, the engine retries with Gemini 3 Flash using a "High-Instruction" system prompt.
    - [ ] Fallback events are clearly flagged in the logs.

### 5. [SH-800.5] ROI & Savings Tracking (HUD Integration)
**As a** Stakeholder,  
**I want** to see the "Optimization Delta" (Savings vs. Baseline) on my dashboard,  
**So that** I can quantify the ROI of the switching engine.  
- **Acceptance Criteria:**
    - [ ] Dashboard displays "Economic Efficiency" gauge.
    - [ ] "Dollars Saved" counter compares actual cost against a hypothetical "All-Opus" baseline.
    - [ ] Real-time distribution chart shows % of tasks handled by Flash vs. Opus.

---

## 📈 Success KPIs (Metrics)
1. **Average Token Cost Reduction:** > 60% reduction compared to routing all tasks to Claude Opus 4.6.
2. **Routing Accuracy:** > 90% of T1/T2 tasks correctly identified and routed to Gemini 3 Flash.
3. **Latency Overhead:** The `EngineSwitch` middleware must add less than 150ms to the total request lifecycle.
4. **Availability:** 100% task completion rate (zero "no-model-available" failures) using the fallback mechanism.

---

## 🎨 Design Brief for Maya [Phase 3: Solutioning]
**Objective:** Create the UI components for SH-800 within the Sovereign Hub Dashboard.
1. **Model Selector Toggle:** A clean UI element in the prompt area to switch between "Auto-Optimize" and "Force Model" (Flash/Opus).
2. **Efficiency Gauge:** A "Speedometer" style gauge showing current cost efficiency.
3. **Usage Distribution Chart:** A simple bar or donut chart showing the split between Flash and Opus usage.
4. **Visual Cues:** Subtle icons in the chat/log history indicating which model handled a specific task (e.g., ⚡ for Flash, 🧠 for Opus).

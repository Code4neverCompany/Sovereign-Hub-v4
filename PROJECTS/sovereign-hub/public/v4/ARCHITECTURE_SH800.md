# [PHASE 1: ARCHITECTURAL BLUEPRINT]
# Project: Sovereign Hub v4.0 (Slim-Stack)
# Epic: Strategic Optimization [SH-800]
# Objective: Dynamic Model-Switching Engine

## 1. RESEARCH: Complexity Thresholds & Model Selection

To optimize for performance and cost, tasks are categorized into four "Complexity Tiers."

| Tier | Task Type | Logic Complexity | Recommended Model | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **T1: Micro** | Chat, Greeting, Log formatting, Simple Regex | Low | **Gemini 3 Flash** | Sub-500ms latency, near-zero cost. |
| **T2: Utility** | Data transformation, Summarization, Email drafting | Moderate | **Gemini 3 Flash** | High throughput (250+ tps), handles large context windows cheaply. |
| **T3: Cognitive** | Complex reasoning, Debugging, Architectural planning | High | **Claude Opus 4.6** | Frontier-level logic, superior tool use, reduced hallucinations. |
| **T4: Creative** | Narrative arcs, Philosophical exploration, Long-form prose | Very High | **Claude Opus 4.6** | Nuanced tone control and sophisticated linguistic patterns. |

### **Switching Heuristics:**
*   **Default Path:** Route all incoming tasks to **Gemini 3 Flash** unless specifically flagged.
*   **Escalation Path:** If task description contains keywords (*"architect," "debug," "complex," "novel," "refactor"*) or fails a T1/T2 validation check, escalate to **Claude Opus 4.6**.
*   **Fallback Path:** If Opus rate limits are hit, fallback to Gemini 3 Flash with a "High-Instruction" system prompt.

---

## 2. LOGIC: The Switching Algorithm (Pseudocode)

```javascript
/**
 * SH-800: Dynamic Routing Algorithm
 * Returns the optimal model based on task metadata.
 */
function routeTask(task) {
    const { type, priority, content, contextLength } = task;

    // 1. Mandatory Overrides
    if (priority === 'CRITICAL' || type === 'ARCHITECTURE') return 'claude-opus-4.6';
    if (contextLength > 1000000) return 'gemini-3-flash'; // Massive context handling

    // 2. Keyword-Based Escalation
    const highComplexitySignals = ['refactor', 'philosophical', 'deep-dive', 'optimization'];
    const hasSignal = highComplexitySignals.some(sig => content.toLowerCase().includes(sig));
    if (hasSignal) return 'claude-opus-4.6';

    // 3. Cost-Efficiency Default
    // Gemini 3 Flash is ~10x-50x cheaper than Opus 4.6
    return 'gemini-3-flash';
}
```

---

## 3. BLUEPRINT: `v4/core/engine-switch.js`

This module acts as a middleware between the **Nexus Dispatcher** and the Model APIs.

### **Structure:**
- `EngineSwitch.getProvider(task)`: Core routing logic.
- `EngineSwitch.getStats()`: Returns current session efficiency (Savings vs. Baseline).
- `EngineSwitch.setPolicy(policy)`: Allows dynamic updates to switching thresholds (e.g., "Aggressive Savings" vs. "Maximum Logic").

### **Integration with Nexus Dispatcher:**
1.  **Nexus** receives a task.
2.  **Nexus** calls `EngineSwitch.getProvider(task)`.
3.  **Nexus** attaches the recommended `model_id` to the task payload.
4.  **Nexus** dispatches to the selected LLM adapter.
5.  On completion, **Nexus** logs usage to `token_usage` table (defined in SH-700).

---

## 4. METRICS: SH-700 Analytics Integration

To track "Savings/Efficiency" in the SH-700 HUD, we introduce the **"Optimization Delta."**

### **New Metric: Savings Coefficient**
*   **Baseline Cost:** Calculated as if *all* tasks were routed to Claude Opus 4.6.
*   **Actual Cost:** Real-time cost from `token_usage`.
*   **Savings = Baseline - Actual.**

### **HUD Implementation:**
- **Widget:** "Economic Efficiency" (Gauge Chart).
- **Target:** 70% savings compared to Opus-only routing.
- **Visual:** A "Flash vs. Opus" distribution bar showing the percentage of tasks handled by each tier.

---

## 5. HANDOFF: Jordan [Strategist]

### Technical Spec for Jordan
*   **Feature:** Dynamic Model Routing (SH-800).
*   **Objective:** Reduce operational costs by ~60% without sacrificing architectural integrity.
*   **Mechanism:** Middleware-based classification using Gemini 3 Flash for high-speed/low-cost "Utility" and Claude Opus 4.6 for "Frontier Logic."

### Requested User Stories (Jordan):
1.  *Resource Optimization:* As an operator, I want the system to automatically pick the cheapest model that can handle my task so I don't waste budget.
2.  *Manual Override:* As a developer, I want to force a specific model for a task (via CLI/UI) when I know it requires specific "Opus-level" nuance.
3.  *Efficiency Tracking:* As a stakeholder, I want to see a "Dollars Saved" counter in the dashboard to justify the optimization engine.

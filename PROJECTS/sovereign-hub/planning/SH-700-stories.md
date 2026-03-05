# 📋 User Stories: Analytics Engine & Dashboard [SH-700]
**Project:** Sovereign Hub v4.0 (Slim-Stack)  
**Status:** 🟢 PLANNED (Phase 2)  
**Reference:** ARCHITECTURE_SH700.md  

## 🎯 Executive Summary
The Analytics Engine [SH-700] provides critical visibility into the "Neural Throughput" of the Sovereign Hub. It transforms raw Supabase logs from `agent_metrics` and `token_usage` into actionable insights for cost control, performance optimization, and reliability auditing.

---

## 📖 User Stories (High-Fidelity)

### 1. Cost & Budgetary Awareness [SH-701]
*   **User Story:** As an operator, I want to see my estimated spend per agent and model in real-time so I can optimize my budget and prevent cost overruns.
*   **Acceptance Criteria:**
    - [ ] Real-time "Total Tokens (MTD)" card updated via Supabase.
    - [ ] "Neural Throughput" Area Chart showing token usage over time (ApexCharts).
    - [ ] Cost breakdown by model (e.g., Gemini-1.5 vs GPT-4o).
    - [ ] Dynamic currency formatting for `cost_estimate`.

### 2. Performance & Bottleneck Detection [SH-702]
*   **User Story:** As a developer, I want to visualize the execution latency across different agents so I can identify and fix architectural bottlenecks ("Neural Lag").
*   **Acceptance Criteria:**
    - [ ] "Avg. Execution Time" metric card.
    - [ ] Bar Chart comparing average latency per agent (e.g., Alex vs Jordan).
    - [ ] Latency Heatmap showing spikes by hour/day to detect system-wide slowdowns.
    - [ ] Filtering by `session_id` to trace specific mission performance.

### 3. Reliability & Error Audit [SH-703]
*   **User Story:** As a system administrator, I want to monitor success vs. failure rates across the neural stack so I can proactively address silent failures or API timeouts.
*   **Acceptance Criteria:**
    - [ ] "Success Rate (%)" metric card.
    - [ ] Donut Chart showing distribution of Statuses (Success, Error, Timeout).
    - [ ] Error Log Table showing the most recent `error_message` from `agent_metrics`.
    - [ ] Drill-down capability to see which specific `agent_id` is failing most frequently.

### 4. Real-time Operational HUD [SH-704]
*   **User Story:** As a mission controller, I want a high-level dashboard that updates automatically as agents work so I can maintain situational awareness without manual refreshes.
*   **Acceptance Criteria:**
    - [ ] "Active Subagents" live counter.
    - [ ] 12-column CSS Grid layout (Responsive).
    - [ ] Auto-refresh/Real-time subscription to `agent_metrics` table.
    - [ ] "Slim-Stack" implementation using CDN-only ApexCharts (No Build).

---

## 📈 Success KPIs (Metrics)
| Metric | Target Goal | Measurement Tool |
| :--- | :--- | :--- |
| **Dashboard Load Time** | < 2.0 seconds | Chrome DevTools (Lighthouse) |
| **Metric Capture Rate** | 100% of all agent calls | Supabase `agent_metrics` vs Logs |
| **Data Freshness** | < 5 second lag | Supabase Realtime Latency |
| **Visualization Accuracy** | 1:1 match with SQL queries | Manual Query Verification |
| **Build Size Impact** | 0kb (CDN-only) | Bundle Analyzer / Network Tab |

---

## 🤝 Handoff: Maya [UX/Designer] (Phase 3)
**Objective:** Materialize the Analytics Dashboard using Lux 3.0 aesthetics.

**Task List for Maya:**
1.  **Layout Mockup:** Design the 12-column grid specified in the blueprint (Top Stats, Middle Charts, Bottom Details).
2.  **Color Palette:** Map "Neural Throughput" colors (e.g., Success = Emerald, Error = Crimson, Latency = Amber).
3.  **Component Styling:** Style the ApexCharts containers to match the Sovereign Hub "Glassmorphism" or "Slim-Stack" UI.
4.  **Empty States:** Design the "No Data Found" states for new users/empty tables.
5.  **Interaction Design:** Define hover tooltips for the Area and Bar charts.

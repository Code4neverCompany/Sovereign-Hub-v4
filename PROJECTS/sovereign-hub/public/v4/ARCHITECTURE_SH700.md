# [PHASE 1: ARCHITECTURAL BLUEPRINT]
# Project: Sovereign Hub v4.0 (Slim-Stack)
# Objective: Analytics Engine & Dashboard [SH-700]

## 1. RESEARCH: Charting Libraries (CDN-Only / No Build)

For Sovereign Hub v4.0's "Slim-Stack" (HTML/CSS/JS with minimal build), we require libraries that can be dropped in via `<script>` tags and initialized without a complex build pipeline.

| Library | Best For | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Chart.js** | Simplicity & Canvas | Lightweight (117kb gzipped), great for standard charts, responsive. | Customizing beyond defaults can be tricky; Canvas-based (raster). |
| **ApexCharts** | Dashboards & Interactivity | Modern aesthetics, built-in zoom/pan, excellent documentation, SVG-based. | Slightly heavier than Chart.js; more "opinionated" styling. |
| **Apache ECharts** | Enterprise & Performance | Handles massive datasets, highly configurable, powerful geo-spatial features. | Steep learning curve; large file size if using all modules. |
| **uPlot** | Extreme Performance | Tiny (~25kb), fastest for real-time time-series data. | Minimalist; lacks "fancy" dashboard widgets (gauges, bars). |

### **Recommendation: ApexCharts**
**Why:** It strikes the best balance for a dashboard. Its SVG rendering makes it crisp at any scale, and its default "modern" look fits the Sovereign Hub aesthetic. It provides interactive tooltips and easy JSON-based configuration which simplifies the data flow from Supabase.

---

## 2. SCHEMA: Supabase "Neural Throughput"

To track performance, costs, and success rates, we define the following tables.

### Table: `agent_metrics`
Tracks individual agent execution performance.
- `id`: uuid (PK, default: gen_random_uuid())
- `timestamp`: timestamptz (default: now())
- `agent_id`: text (e.g., 'alex', 'jordan')
- `session_id`: uuid (FK to sessions)
- `execution_time_ms`: int4
- `status`: text (e.g., 'success', 'error', 'timeout')
- `error_message`: text (nullable)
- `metadata`: jsonb (extra context: machine_id, os, etc.)

### Table: `token_usage`
Granular tracking of LLM costs.
- `id`: uuid (PK)
- `timestamp`: timestamptz (default: now())
- `agent_id`: text
- `model`: text (e.g., 'gemini-1.5-pro', 'gpt-4o')
- `prompt_tokens`: int4
- `completion_tokens`: int4
- `total_tokens`: int4
- `cost_estimate`: numeric(10, 6) (calculated based on model rates)

### Table: `user_activity_summary` (Aggregated View/Table)
For faster dashboard loading, we use a materialized view or periodic aggregation.
- `bucket`: timestamptz (hourly/daily)
- `avg_latency`: numeric
- `success_rate`: numeric
- `total_tokens`: bigint

---

## 3. BLUEPRINT: Analytics Dashboard Layout

The "Analytics" tab will follow a **CSS Grid (12-column)** system for responsiveness.

### Grid Layout:
1.  **Top Row (Stats Cards):** 4 Widgets (3 cols each)
    - Total Tokens (MTD)
    - Avg. Execution Time
    - Success Rate (%)
    - Active Subagents
2.  **Middle Row (Primary Charts):**
    - **Neural Throughput (Left, 8 cols):** ApexCharts *Area Chart* showing Token Usage vs. Time.
    - **Success Distribution (Right, 4 cols):** ApexCharts *Donut Chart* (Success vs. Failures vs. Retries).
3.  **Bottom Row (Detailed Analysis):**
    - **Latency Heatmap (Left, 6 cols):** ApexCharts *Heatmap* showing latency spikes across different hours of the day.
    - **Agent Performance (Right, 6 cols):** ApexCharts *Bar Chart* comparing average execution time per agent.

### Data Flow:
1.  **Fetch:** `supabase-js` client fetches the last 24h/7d of data from `agent_metrics` and `token_usage`.
2.  **Transform:** A lightweight JS utility (`dataTransformer.js`) formats the Supabase JSON into the `series` format expected by ApexCharts.
3.  **Render:** `new ApexCharts(el, options).render()` is called within the `onMounted` or equivalent lifecycle hook.

---

## 4. HANDOFF: Jordan [Strategist]

### Technical Specification Overview
- **Library:** ApexCharts (via CDN).
- **Backend:** Supabase (PostgreSQL + Realtime).
- **Update Frequency:** Real-time for stats cards; On-demand/Lazy-load for heavy charts.
- **Critical Metrics:** Token cost control and "Neural Lag" (latency) detection.

### Requested User Stories (Jordan):
1.  *Cost Awareness:* As an operator, I want to see my estimated spend per agent so I can optimize my budget.
2.  *Bottleneck Detection:* As a developer, I want to see which agent has the highest average execution time to identify architectural bottlenecks.
3.  *Reliability Audit:* As a system admin, I want to view error rates over time to catch silent failures in the neural stack.

# [ARCHITECTURE_SH2000] Sovereign Singularity: Neural Repair Layer

## 1. OVERVIEW
The **Neural Repair Layer** is the self-healing immune system of the Sovereign Hub v4.0. It transforms the dashboard from a passive UI into an active, self-correcting organism. When a component fails (JS crash, API timeout, 404), the system detects, diagnoses, and autonomously spawns a **Repair Sub-agent** to resolve the issue in a shadow environment before hot-patching the production directory.

---

## 2. DIAGNOSTICS: 'system_diagnostics' Table
A unified logging structure in Supabase to track all health anomalies.

```sql
-- SQL Schema for Sovereign Diagnostics
CREATE TABLE system_diagnostics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    error_type VARCHAR(50) NOT NULL, -- 'JS_CRASH', 'API_TIMEOUT', '404_NOT_FOUND', 'AUTH_FAILURE'
    source_component VARCHAR(100),   -- 'NexusController', 'Sovereign_App_UI', 'TemporalEngine'
    error_payload JSONB,             -- Stack trace, URL, or API response body
    severity_level INT DEFAULT 1,    -- 1: Warning, 2: Error, 3: Critical (Triggers Auto-Spawn)
    repair_status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'INVESTIGATING', 'RESOLVED', 'FAILED'
    subagent_session_id VARCHAR(100),-- Reference to the OpenClaw session handling the fix
    resolution_summary TEXT
);

CREATE INDEX idx_diag_status ON system_diagnostics(repair_status);
CREATE INDEX idx_diag_severity ON system_diagnostics(severity_level);
```

---

## 3. HEALING LOGIC: NeuralRepair.js Middleware
The `NeuralRepair.js` interceptor wraps API calls and UI event handlers.

**Key Logic Flow:**
1. **Intercept:** Catch `window.onerror` and failed `fetch` calls.
2. **Classify:** Determine if the error is transient (retry) or structural (needs repair).
3. **Log:** Write to `system_diagnostics`.
4. **Trigger:** If severity == 3, invoke the **Autonomous Spawning** hook.

```javascript
// NeuralRepair.js - Conceptual Logic
const NeuralRepair = {
    handleError: async (error, context) => {
        const diagnostic = {
            error_type: error.type || 'JS_CRASH',
            source_component: context.component,
            error_payload: { message: error.message, stack: error.stack },
            severity_level: NeuralRepair.calculateSeverity(error)
        };

        const { data } = await supabase.from('system_diagnostics').insert(diagnostic).select();
        
        if (diagnostic.severity_level >= 3) {
            NeuralRepair.spawnRepairMission(data[0].id);
        }
    },

    spawnRepairMission: async (diagnosticId) => {
        // Integration with OpenClaw Subagent Spawning
        console.log(`[NeuralRepair] Critical failure detected. Initiating Repair Mission for ID: ${diagnosticId}`);
        // Call backend service to trigger subagents tool
    }
};
```

---

## 4. AUTONOMOUS SPAWNING: OpenClaw Integration
When a diagnostic threshold is met, the Sovereign Hub uses the `subagents` tool to deploy a **Dev Sub-agent**.

**Spawn Parameters:**
- **Role:** `Sovereign_Repair_Specialist`
- **Context:** Diagnostic ID, Stack Trace, and target file path.
- **Goal:** Fix the bug, test in `shadow_build/`, and submit a PR-equivalent for the Hive to review.

---

## 5. REPAIR HUD: "Repair Pulse" Visualization
A real-time status overlay on the Sovereign Dashboard.

- **Pulse Icon:** A glowing "neural node" in the header.
  - 🟢 **Steady Green:** All systems nominal.
  - 🟡 **Pulsing Yellow:** Investigation in progress (Severity 1-2).
  - 🔴 **Rapid Red Pulse:** Repair Sub-agent Active (Severity 3).
- **HUD Details:** On click, shows a mini-terminal with:
  - `[ACTIVE MISSION]` -> "Fixing 404 in /api/nexus/sync"
  - `[PROGRESS]` -> "Shadow Build: 85% Complete"
  - `[HEALTH]` -> Real-time uptime metrics.

---

## 6. PREVENTATIVE: "Shadow Build" Process
To ensure the repair doesn't break production, the Hive utilizes an isolated directory.

1. **Isolation:** Sub-agent clones the affected files into `/v4/shadow_build/`.
2. **Correction:** Apply fix in the shadow directory.
3. **Verification:** Run `verify_ui_*.js` scripts against the shadow build.
4. **Validation:** Use `RiskCalculus.js` to ensure no regression.
5. **Hot-Swap:** Once validated, the shadow file overwrites the main `/v4/` file.

---

## 7. EXECUTION ROADMAP
1. **Initialize Table:** Run `setup_diagnostics.sql`.
2. **Deploy Middleware:** Inject `NeuralRepair.js` into `app.js`.
3. **Sub-agent Template:** Create `REPAIR_MISSION_TEMPLATE.md` for OpenClaw spawns.
4. **Visual HUD:** Update `style.css` and `index.html` with the Pulse Node.

**Status:** ARCHITECTURE APPROVED | **Epic:** SH-2000 | **Agent:** ALEX

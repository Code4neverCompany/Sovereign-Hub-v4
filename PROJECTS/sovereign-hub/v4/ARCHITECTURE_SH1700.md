# ARCHITECTURE: Sovereign Governance & Policy [SH-1700]
## Project: Sovereign Hub v4.0
## Epic: Sovereign Governance & Policy
## Status: [PHASE 1: ARCHITECTURAL BLUEPRINT]
## Date: 2026-03-05

---

### 1. OVERVIEW
The "Constitution" layer provides a hard-coded and soft-configurable governance framework for the Sovereign Hub. It ensures that all autonomous actions (mission dispatches, spending, resource allocation) adhere to predefined safety and business logic before reaching the execution stage.

### 2. POLICY ENGINE: Database Schema (Supabase)

#### Table: `governance_policies`
Stores the active ruleset for the swarm.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key (Default: `gen_random_uuid()`) |
| `name` | TEXT | Unique identifier (e.g., 'max_daily_spend', 'min_audit_score') |
| `category` | TEXT | 'FINANCIAL', 'SECURITY', 'OPERATIONAL', 'COMPLIANCE' |
| `value` | JSONB | The actual limit or rule (e.g., `{"limit": 500, "currency": "USD"}`) |
| `risk_tier` | TEXT | 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL' |
| `is_active` | BOOLEAN | Toggle for the policy (Default: `true`) |
| `enforcement` | TEXT | 'BLOCK' (Hard gate) or 'WARN' (Log & Alert) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last modification timestamp |

#### Table: `policy_violations`
Tracks all instances where an agent action was flagged or blocked.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `policy_id` | UUID | Foreign Key to `governance_policies` |
| `agent_id` | TEXT | ID of the agent attempting the action |
| `action_type` | TEXT | e.g., 'DISPATCH', 'TRANSACTION', 'FILE_WRITE' |
| `payload` | JSONB | The blocked/flagged data for audit |
| `resolution` | TEXT | 'BLOCKED', 'OVERRIDDEN', 'PENDING_REVIEW' |
| `sovereign_note` | TEXT | Manual entry from the Sovereign during review |
| `created_at` | TIMESTAMPTZ | Timestamp of violation |

---

### 3. CONSTITUTIONAL GATE: `DirectiveValidator.js`
Location: `/home/skywork/workspace/PROJECTS/sovereign-hub/v4/core/DirectiveValidator.js`

This middleware intercepts mission dispatches from `NexusController.js` or `ForgeController.js`.

**Logic Flow:**
1. **Intercept:** Receive `mission_object` and `requesting_agent`.
2. **Fetch:** Load active `governance_policies` from Supabase.
3. **Validate:**
    - Check `spending_limit` against proposed budget.
    - Check `agent_risk_tier` against the requested tool/resource.
    - Check `mandatory_audit` triggers (e.g., any code change in `core/`).
4. **Decision:**
    - If **PASS**: Return `true` (Proceed to execution).
    - If **WARN**: Log to `policy_violations`, notify Sovereign, return `true`.
    - If **BLOCK**: Log to `policy_violations`, notify Sovereign, return `false`.

---

### 4. GOVERNANCE HUD (UI Design)
Location: "Governance" Tab in Hub Dashboard.

**Features:**
- **Policy Matrix:** A high-fidelity table showing all active rules with real-time "Is Active" toggles.
- **Risk Dial:** A visual representation of the current swarm risk level based on active policies and recent violations.
- **Audit Feed:** A live stream of `policy_violations` with "Approve Exception" or "Permanent Block" actions for the Sovereign.
- **Constitution Editor:** A JSON/Form interface to define new business rules (e.g., "Block all outbound webhooks after 10:00 PM UTC").

---

### 5. IMPLEMENTATION ROADMAP (SQL)

```sql
-- Create Governance Tables
CREATE TABLE IF NOT EXISTS governance_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT CHECK (category IN ('FINANCIAL', 'SECURITY', 'OPERATIONAL', 'COMPLIANCE')),
    value JSONB NOT NULL,
    risk_tier TEXT DEFAULT 'MEDIUM' CHECK (risk_tier IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    is_active BOOLEAN DEFAULT true,
    enforcement TEXT DEFAULT 'BLOCK' CHECK (enforcement IN ('BLOCK', 'WARN')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS policy_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES governance_policies(id),
    agent_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    resolution TEXT DEFAULT 'BLOCKED',
    sovereign_note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed Default Constitution
INSERT INTO governance_policies (name, category, value, risk_tier, enforcement)
VALUES 
('daily_spend_limit', 'FINANCIAL', '{"limit": 100, "unit": "USD"}', 'HIGH', 'BLOCK'),
('unauthorized_file_write', 'SECURITY', '{"protected_dirs": ["/core", "/config"]}', 'CRITICAL', 'BLOCK'),
('high_risk_tool_usage', 'OPERATIONAL', '{"tools": ["exec", "browser"]}', 'MEDIUM', 'WARN');
```

---

### 6. HANDOFF: JORDAN [STRATEGIST]
**Task:** Implementation of the Governance HUD and Policy Engine logic.
1. Execute `setup_governance.sql` (to be generated from roadmap).
2. Implement `DirectiveValidator.js` in the `core/` directory.
3. Update `NexusController.js` to wrap all `dispatch` calls in the validator.
4. Build the "Governance" tab in the frontend using the `policy_violations` stream for real-time alerting.

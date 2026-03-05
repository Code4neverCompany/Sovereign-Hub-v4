# User Stories: Sovereign Governance & Policy [SH-1700]
## Epic: Sovereign Governance & Policy
## Status: [PHASE 2: STRATEGIC PLANNING]
## Date: 2026-03-05

---

### 1. POLICY ENGINE (Backend Logic & Schema)
*The ruleset and violation tracking system.*

- **SH-1700.1: Policy Schema Implementation**
  - **As a** Sovereign,
  - **I want** a structured database to store governance rules (Financial, Security, Operational),
  - **So that** I can programmatically define the "laws" of my autonomous swarm.
  - **Acceptance Criteria:** `governance_policies` table created with `category`, `risk_tier`, and `enforcement` (Block/Warn) logic.

- **SH-1700.2: Violation Audit Logging**
  - **As a** Sovereign,
  - **I want** every blocked or flagged action to be logged with full payload context,
  - **So that** I can audit why an agent was stopped and decide if an override is necessary.
  - **Acceptance Criteria:** `policy_violations` table records `agent_id`, `action_type`, and `payload` whenever a policy is triggered.

---

### 2. CONSTITUTIONAL GATE (Middleware)
*The interception and validation layer.*

- **SH-1700.3: Directive Interceptor (`DirectiveValidator.js`)**
  - **As a** System Architect,
  - **I want** a middleware layer that intercepts all `mission_dispatch` calls,
  - **So that** no agent can execute a command without first passing through the Governance check.
  - **Acceptance Criteria:** `DirectiveValidator.js` created; returns `true/false` based on `governance_policies` evaluation.

- **SH-1700.4: Multi-Tier Enforcement (Block vs. Warn)**
  - **As a** Sovereign,
  - **I want** some policies to strictly block actions while others only notify me,
  - **So that** I don't cripple the swarm's autonomy for low-risk operations while maintaining hard-gates on critical ones.
  - **Acceptance Criteria:** Validator distinguishes between `BLOCK` (stop execution) and `WARN` (log and continue).

- **SH-1700.5: Nexus/Forge Integration**
  - **As a** System Architect,
  - **I want** the main controllers (`NexusController`, `ForgeController`) to implement the `DirectiveValidator`,
  - **So that** governance is enforced across all core hub functions.
  - **Acceptance Criteria:** All dispatch calls in Hub controllers are wrapped in the validation logic.

---

### 3. GOVERNANCE HUD (Frontend UI)
*The command and control interface.*

- **SH-1700.6: Policy Matrix Interface**
  - **As a** Sovereign,
  - **I want** a visual table to view and toggle active policies,
  - **So that** I can adjust the swarm's "Constitutional" constraints in real-time without writing SQL.
  - **Acceptance Criteria:** "Governance" tab displays all policies with an "Is Active" toggle and value editor.

- **SH-1700.7: Risk-Dial & Violation Alerting**
  - **As a** Sovereign,
  - **I want** a high-level visual indicator of the swarm's current risk state and a live feed of violations,
  - **So that** I can immediately respond to security threats or budget overages.
  - **Acceptance Criteria:** Risk-Dial component reflects violation frequency/severity; Audit Feed shows real-time `policy_violations`.

- **SH-1700.8: The Sovereign Override**
  - **As a** Sovereign,
  - **I want** to manually "Approve Exception" for a blocked violation directly from the HUD,
  - **So that** I can handle edge cases where a strict policy needs a temporary bypass.
  - **Acceptance Criteria:** HUD provides an "Approve" button on violation logs that triggers a one-time dispatch override.

---

### 4. CORE LAWS (Initial Configuration)
*The "Genesis" policies for the Sovereign Hub v4.0.*

1. **Daily Budget Cap:** `{"limit": 100, "unit": "USD"}` | Category: FINANCIAL | Tier: HIGH | Enforcement: BLOCK.
2. **Data Privacy Guard:** Block any `exec` or `file_read` targeting `.env` or `~/.ssh` unless explicitly whitelisted. | Category: SECURITY | Tier: CRITICAL | Enforcement: BLOCK.
3. **Mandatory Sentinel Audit:** Any file modification in `/core` or `/config` must be logged to the Audit Feed. | Category: COMPLIANCE | Tier: MEDIUM | Enforcement: WARN.
4. **Tool Access Control:** Use of `browser` or `web_search` for more than 50 calls per hour triggers a warning. | Category: OPERATIONAL | Tier: MEDIUM | Enforcement: WARN.
5. **Night-Watch Lockdown:** Block all outbound API calls (except web_search) between 02:00 and 06:00 UTC unless `emergency_mode` is active. | Category: SECURITY | Tier: HIGH | Enforcement: BLOCK.

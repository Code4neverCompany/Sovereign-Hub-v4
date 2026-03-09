# DESIGN: Sovereign Governance & Policy [SH-1700]
## Status: [PHASE 3: DESIGN COMPLETED]
## Date: 2026-03-05
## Theme: Lux Aesthetic 3.0 (Void / Gold / Violet)

---

### 1. UI ARCHITECTURE: THE GOVERNANCE TAB
The Governance tab is structured as a mission-critical command center, prioritizing high-risk indicators and real-time policy enforcement.

#### A. Header: System Risk Gauge (The Risk Dial)
- **Visual:** A large, central SVG semi-circle gauge.
- **Color Logic:** 
    - 0-30%: Violet (Stable)
    - 31-70%: Gold (Elevated)
    - 71-100%: Crimson (Critical)
- **Behaviors:** Needles fluctuate based on the frequency of recent `policy_violations`.

#### B. Left Wing: Policy Matrix (Law Toggles)
- **Visual:** A grid of glassmorphism cards.
- **Card Design:** 
    - Title: Policy Name (e.g., `DAILY_SPEND_LIMIT`)
    - Subtitle: Category (FINANCIAL, SECURITY, etc.)
    - Indicator: Neon "Active" (Violet) or "Suspended" (Dim Gold/Gray).
    - Interaction: Toggle switch to enable/disable; "Edit" icon to open JSON value editor.

#### C. Right Wing: Audit Stream (Violation Feed)
- **Visual:** Terminal-style black box with JetBrains Mono font.
- **Feed Item:**
    - `[TIME] [CATEGORY] [AGENT] -> ACTION_BLOCKED: Reason`
    - Action Buttons: `[APPROVE EXCEPTION]` | `[REINFORCE POLICY]`
- **Aesthetic:** Scanline overlay with slight flicker effect for the "Surveillance" feel.

---

### 2. LUX AESTHETIC 3.0 SPECIFICATIONS
- **Void (#0A0A0A):** Deepest black background for maximum contrast.
- **Gold (#D4AF37):** Used for "Sovereign" level elements, labels, and "Elevated" risk.
- **Violet (#8B5CF6):** Used for "System/Logic" elements, active status, and "Stable" risk.
- **Glassmorphism:** `backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.02);`

---

### 3. HANDOFF: DEV [PHASE 4]
The following components are prepared in `index.html`:
- `section#governance-tab`: Main container.
- `updateRiskDial(value)`: JS function to animate the gauge.
- `renderPolicyMatrix(policies)`: JS function to build the toggle grid.
- `appendViolation(violation)`: JS function to push to the Audit Stream.

**Wiring Instructions:**
1. Connect `renderPolicyMatrix` to `supabase.from('governance_policies').select('*')`.
2. Connect the Toggle switch to `supabase.from('governance_policies').update({ is_active: bool }).eq('id', id)`.
3. Subscribe to `policy_violations` table for the live Audit Stream updates.
4. Logic in `DirectiveValidator.js` must be triggered on every dispatch, and its results (if blocked) should be emitted via Supabase Realtime to update this UI.

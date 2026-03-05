# [PHASE 1: ARCHITECTURAL BLUEPRINT]
# Project: Sovereign Hub v4.0
# Epic: Market Deployment & Revenue HUD [SH-1400]
# Objective: Design the automated deployment and monetization tracking layer.

## 1. DEPLOYMENT ENGINE: The `deployment_manifests` Layer

The Deployment Engine automates the transition from "Design" to "Live Prototype," tracking where every product in the Forge is hosted and its public accessibility.

### **Database Schema: `deployment_manifests`**

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key (default: `gen_random_uuid()`). |
| `product_id` | `uuid` | Foreign Key to `product_blueprints`. |
| `subdomain_slug` | `text` | Unique slug for `[slug].sovereign.hub`. |
| `provider` | `text` | Hosting provider: `VERCEL`, `CLOUDFLARE`, `CUSTOM`, `LOCAL`. |
| `live_url` | `text` | The final public-facing URL. |
| `ssl_status` | `text` | Status of SSL certificate (`VALID`, `EXPIRED`, `PENDING`). |
| `deployment_status`| `text` | `PROVISIONING`, `LIVE`, `FAILED`, `TEARDOWN`. |
| `metadata` | `jsonb` | Provider-specific IDs (e.g., Vercel Project ID, Deployment ID). |
| `last_deployed` | `timestamptz`| Timestamp of the most recent successful push. |

---

## 2. TRAFFIC EMULATOR: The "Simulated Traction" Layer

To test market viability without immediate ad spend, the Hive simulates user behavior based on "Market Heat" and "Product Quality" variables.

### **The Simulation Logic:**
1.  **Market Heat Index:** Each niche in the `market_analysis` table has a "Heat Score" (0-100).
2.  **Conversion Probability ($P_c$):** Calculated as:
    $P_c = (ProductQuality / 100) * (MarketHeat / 100) * (NicheFitScore / 100)$
3.  **Emulator Worker (`TrafficEmulator.js`):**
    *   Runs every hour.
    *   Generates $N$ "Visits" based on Market Heat.
    *   For each visit, rolls a dice against $P_c$ to determine if a "Conversion" (Signup/Click) occurred.
4.  **Data Persistence:** All simulated events are logged to `market_metrics` with an `is_simulated: true` flag.

### **Database Schema: `market_metrics`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key. |
| `product_id` | `uuid` | Reference to the product. |
| `event_type` | `text` | `VISIT`, `SIGNUP`, `CLICK`, `CONVERSION`. |
| `value` | `numeric` | Financial value (if any) or count. |
| `is_simulated` | `boolean` | Flag to separate mock data from real market tests. |
| `timestamp` | `timestamptz` | When the event occurred. |

---

## 3. REVENUE HUD: The High-Fidelity "Revenue" Tab

The Revenue HUD provides the Sovereign with a financial forecast and "Product-Market Fit" (PMF) validation at a glance.

### **UI Components (Revenue Tab):**
*   **The MRR Forecast (Big Number):**
    *   Shows *Projected MRR* based on simulated/real conversions and a set "Pricing Tier" from the blueprint.
*   **Conversion Funnel:**
    *   A visual funnel: `Visits` -> `Clicks` -> `Signups` -> `Revenue`.
    *   Toggle between "Simulated" and "Real" traffic modes.
*   **PMF Scorecard:**
    *   A gauge (0-100) indicating the likelihood of the product succeeding in the wild. 
    *   *Calculation:* (Total Conversions / Total Visits) normalized against industry benchmarks for that niche.
*   **The "Kill/Scale" Switch:**
    *   A strategic button for the Sovereign. 
    *   *Kill:* Archives the deployment and stops the emulator.
    *   *Scale:* Triggers a "Real Traffic" campaign (Jordan's next phase).

---

## 4. GATEWAY INTEGRATION: Automated DNS & Routing

The Sovereign Gateway (S-GW) acts as the traffic controller, mapping internal and external prototypes to the Sovereign domain.

### **The Routing Pipeline:**
1.  **Wildcard DNS:** `*.sovereign.hub` points to the Gateway IP.
2.  **Dynamic Routing Table:** The Gateway (Nginx or Node Proxy) queries `deployment_manifests` on every request.
3.  **Mapping:** 
    *   Request: `loopshield.sovereign.hub`
    *   Lookup: Find `subdomain_slug = 'loopshield'`.
    *   Proxy: Forward request to the `live_url` (e.g., `loopshield-v1.vercel.app`).
4.  **SSL Automation:** Integration with Let's Encrypt (Certbot) to automatically provision certificates for new slugs as they go `LIVE`.

---

## 5. FINAL HANDOFF: Jordan [Strategist]

### Technical Spec for Implementation
*   **Epic:** SH-1400 (Market Deployment & Revenue HUD).
*   **Core Value:** Automated market testing and monetization visibility.
*   **User Stories:**
    1.  *Deployment:* "As an operator, I want to see exactly where my prototype is hosted and click a single link to visit it."
    2.  *Viability Testing:* "As the Sovereign, I want to see 'Simulated Traction' to understand if my product idea actually resonates before I spend real money on ads."
    3.  *Revenue Insight:* "As the Sovereign, I want to see a projected MRR for my entire portfolio of prototypes."

### Status Update
- [x] `deployment_manifests` Schema Designed (Infrastructure Layer).
- [x] Traffic Emulator Logic & `market_metrics` Defined (Simulation Layer).
- [x] Revenue Tab HUD Components Drafted (Visual Layer).
- [x] Gateway DNS/Routing Logic Mapped (Network Layer).

**Next Step:** Jordan to initiate the SH-1400 implementation cycle and link the Forge products to the live internet.

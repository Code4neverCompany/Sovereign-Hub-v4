# 📋 User Stories: Market Deployment & Revenue HUD [SH-1400]

## Epic Overview
**Epic:** SH-1400 - Market Deployment & Revenue HUD  
**Objective:** Automate the transition from "Forge Prototype" to "Live Product" and provide a high-fidelity visualization of monetization potential and real-world performance.  
**Strategic Goal:** Enable the Sovereign to validate product-market fit (PMF) through simulation and real traffic, with a clear ROI-focused dashboard.

---

## 1. Automated Deployment Engine (Infrastructure)

### **SH-1400.3: `deployment_manifests` SQL Schema & Migration**
- **User Story:** As a System Architect, I want a dedicated table to track where prototypes are hosted so that the Gateway can dynamically route traffic to them.
- **Acceptance Criteria:**
    - Table `deployment_manifests` created in Supabase.
    - Fields include `product_id`, `subdomain_slug`, `provider`, `live_url`, `ssl_status`, and `deployment_status`.
    - Foreign key relationship with `product_blueprints`.

### **SH-1400.4: Dynamic Gateway Router (S-GW)**
- **User Story:** As an Operator, I want the Sovereign Gateway to automatically map `*.sovereign.hub` subdomains to their respective hosting providers based on the database.
- **Acceptance Criteria:**
    - Nginx or Node Proxy logic implemented to query `deployment_manifests` by `subdomain_slug`.
    - Successful proxying of requests from `[slug].sovereign.hub` to `live_url`.
    - Automatic SSL provisioning (Certbot/Let's Encrypt) for new slugs.

---

## 2. Traffic Emulator (Simulation Layer)

### **SH-1400.5: `market_metrics` Schema & Event Logging**
- **User Story:** As a Data Scientist, I want to log all traffic events (simulated and real) in a unified format so that I can calculate conversion rates accurately.
- **Acceptance Criteria:**
    - Table `market_metrics` created with `event_type` (VISIT, SIGNUP, CLICK, CONVERSION) and `is_simulated` flag.
    - API endpoint/hook to log events from prototypes.

### **SH-1400.6: Traffic Emulator Worker (`TrafficEmulator.js`)**
- **User Story:** As the Sovereign, I want to see "Simulated Traction" based on market variables so that I can test the viability of a niche without spending money on ads.
- **Acceptance Criteria:**
    - Hourly background job that calculates `Conversion Probability (Pc)` using `Market Heat`, `Product Quality`, and `Niche Fit`.
    - Generates and logs simulated `VISIT` and `CONVERSION` events to `market_metrics`.

---

## 3. Revenue HUD (Visual Layer)

### **SH-1400.7: "Economic Mastery" (Revenue) Tab UI**
- **User Story:** As the Sovereign, I want a dedicated "Revenue" tab in the HUD to see the financial health and potential of my entire portfolio.
- **Acceptance Criteria:**
    - New "Revenue" tab added to the main Sovereign HUD.
    - Features a high-fidelity "MRR Forecast" (Projected vs. Real).
    - Toggle between "Simulated" and "Real" traffic data.

### **SH-1400.8: Conversion Funnel & PMF Scorecard**
- **User Story:** As a Product Owner, I want to see a visual funnel and a PMF gauge so that I can decide whether to "Kill" or "Scale" a prototype.
- **Acceptance Criteria:**
    - Visual funnel component: `Visits` -> `Clicks` -> `Signups` -> `Revenue`.
    - PMF Gauge (0-100) based on conversion rates normalized against niche benchmarks.
    - Functional "Kill/Scale" strategic buttons that trigger deployment teardown or ad-campaign readiness.

---

## 🎨 Design Brief: Maya [Phase 3] - Economic Mastery HUD

**Focus:** High-Fidelity Financial Visualization & Conversion Analytics.

1.  **The MRR Pulse:** A central, glowing "Projected MRR" counter. It should feel alive, updating as simulated or real conversions occur.
2.  **The Funnel Flow:** A CSS/Canvas-based funnel visualization.
    *   *Visual Cue:* Use "Golden Fluid" for real revenue and "Silver Ghost" for simulated projections.
3.  **The PMF Gauge:** A high-end automotive-style gauge. 
    *   *States:* 0-30 (Red/Archive), 31-70 (Yellow/Refine), 71-100 (Green/Scale).
4.  **The Strategic "Scale" Button:** This should feel high-stakes. A guarded toggle or a button that requires a "Confirmed" state to prevent accidental real-world spend.
5.  **Portfolio View:** A list of active deployments with mini-sparklines for traffic/revenue trends.

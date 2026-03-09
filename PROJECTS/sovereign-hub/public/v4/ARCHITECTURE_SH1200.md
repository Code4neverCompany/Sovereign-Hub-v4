# [PHASE 1: ARCHITECTURAL BLUEPRINT]
# Project: Sovereign Hub v4.0 (Slim-Stack)
# Epic: Autonomous Product Forge [SH-1200]
# Objective: Design the "Market-Aware" Autonomous Prototype Layer

## 1. RESEARCH ENGINE: The "Scout" Protocol (SH-1200-S)

The "Scout" Protocol transforms Alex from a reactive researcher into a proactive market hunter. It operates on a "Pulse" basis (every 6 hours) or can be manually triggered via the Forge HUD.

### **The Scouting Workflow:**
1.  **Scan:** Alex queries high-signal sources using `web_search`:
    *   *GitHub:* "Trending [language] repositories last 24h", "Show HN alternatives".
    *   *Marketplace:* "Top growing micro-SaaS niches 2026", "Product Hunt top AI tools today".
    *   *Social/Forums:* "Reddit r/SaaS 'I wish there was an app for'", "Indie Hackers pain points".
2.  **Filter:** Applies a "Viability Filter" (Difficulty vs. Market Demand).
3.  **Synthesis:** If a high-score opportunity is found, Alex creates a `DISCOVERY` entry in `swarm_knowledge` and initializes a record in `product_blueprints`.

---

## 2. PRODUCT VAULT: The `product_blueprints` Infrastructure

The Product Vault is the persistent storage for all autonomously generated intellectual property within the Sovereign Hub.

### **Database Schema: `product_blueprints`**

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key (default: `gen_random_uuid()`). |
| `created_at` | `timestamptz` | Timestamp of discovery. |
| `name` | `text` | Working title of the product. |
| `description` | `text` | One-sentence "Elevator Pitch". |
| `niche` | `text` | Target market (e.g., "DevOps Tooling", "AI Productivity"). |
| `tech_stack` | `jsonb` | Recommended stack (Frontend, Backend, DB, AI Model). |
| `roadmap` | `jsonb` | Phase-based feature breakdown (MVP, V1, V2). |
| `market_data` | `jsonb` | Competitor links, estimated difficulty (1-10), potential MRR. |
| `status` | `text` | `IDEA` | `REFINING` | `MOCKUP` | `PROTOTYPE` | `VALIDATED`. |
| `forge_meta` | `jsonb` | Agent handoff timestamps and session IDs. |

---

## 3. FORGE LOGIC: The 1-Hour "Sprint Forge" (SH-1200-F)

The "Sprint Forge" is a synchronized, multi-agent pipeline designed to go from market insight to a functional code prototype in exactly 60 minutes.

### **The Pipeline (Serial Execution):**
1.  **[00-10m] ALEX (Research):** Scouts the niche. Populates `product_blueprints` with a high-fidelity `IDEA`.
2.  **[10-25m] JORDAN (Strategy):** Reviews the `IDEA`. Generates a PRD (Product Requirements Document), core user stories, and pricing model. Sets status to `REFINING`.
3.  **[25-40m] MAYA (UI/UX):** Pulls the PRD. Generates a Design System (colors, fonts), Component Schema, and a high-level UI Mockup (represented as markdown/layout JSON). Sets status to `MOCKUP`.
4.  **[40-60m] DEV (Engineering):** Scaffolds the repository. Implements core logic + basic UI using the Maya's spec and Jordan's requirements. Commits to `/prototypes/[project-name]`. Sets status to `PROTOTYPE`.

---

## 4. HUD INTEGRATION: The "Forge" Tab

A high-fidelity dashboard for monitoring the lifecycle of autonomous products.

### **UI Components:**
*   **The Incubator:** A central progress ring showing the current Phase (Alex -> Jordan -> Maya -> Dev) and the 60-minute countdown timer.
*   **The DNA Strand:** A vertical timeline visualization of a product's evolution. Each node on the strand shows a "Snapshot" (e.g., Maya's design tokens or Dev's first commit).
*   **Blueprint Gallery:** A grid of cards for all items in the `product_blueprints` table.
    *   *Card Detail:* Hovering over a card shows "Market Heat" (from Alex's research) and "Build Readiness" (from Jordan's strategy).
*   **Scout Feed:** A scrolling terminal-style feed of Alex's live market scans.

---

## 5. HANDOFF: Jordan [Strategist]

### Technical Spec for Implementation
*   **Epic:** SH-1200 (Autonomous Product Forge).
*   **Core Value:** Rapid iteration of market-aware prototypes with zero human intervention until the "Validation" stage.
*   **User Stories:**
    1.  *Autonomous Discovery:* "As the system, I want to identify a trending GitHub repository and propose a 'SaaS Wrapper' for it without being asked."
    2.  *Synchronized Handoff:* "As an agent in the Forge, I want to be automatically triggered the moment the previous agent updates the `product_blueprints` status."
    3.  *Visual Incubation:* "As an operator, I want to watch the 'Forge' Tab and see a product being built layer-by-layer in real-time."

### Status Update
- [x] Scout Protocol Designed (Research Engine).
- [x] `product_blueprints` Schema Designed (Product Vault).
- [x] 1-Hour Sprint Forge Pipeline Defined (Forge Logic).
- [x] Forge Tab UI Blueprint Drafted (HUD Integration).
- [ ] Next Step: SQL migration for `product_blueprints` and Alex's Scout script implementation.

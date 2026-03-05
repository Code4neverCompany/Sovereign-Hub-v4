# USER STORIES: SH-1500 | Viral Growth & Content Forge

**Epic:** Viral Growth & Content Forge [SH-1500]  
**Objective:** Establish an autonomous marketing layer for Sovereign Hub v4.0.  
**Reference:** `ARCHITECTURE_SH1500.md`  
**Status:** DRAFT | **Priority:** HIGH (Strategic Revenue Driver)

---

## 🛠️ THEME 1: AUTONOMOUS CONTENT ENGINE
*Focus: Automated generation and refinement of high-impact marketing assets.*

### **SH-1500.1: Marketing Content Repository**
**As a** Product Owner (Jordan),  
**I want** a centralized `marketing_content` table in Supabase,  
**So that** I can store, track, and manage all AI-generated social and promotional assets for every product prototype.
- **Acceptance Criteria:**
  - Table created with fields for `content_type`, `status`, `body_text`, `viral_hook_id`, and `performance_score`.
  - Relation established with `product_blueprints`.
  - Indexes created for `product_id` and `status` for rapid retrieval.

### **SH-1500.2: Hook Optimization Loop (Jordan's Protocol)**
**As a** Strategist (Jordan),  
**I want** an automated script (`optimize_hooks.js`) to review and refine content drafts,  
**So that** every post uses the "Sovereign Persuasion Framework" to maximize engagement and conversion.
- **Acceptance Criteria:**
  - Script polls `marketing_content` for 'DRAFT' status.
  - Injects A/B test variations for the "First Sentence" (the Hook).
  - Ensures every post includes a "Hard CTA" to the prototype's `live_url`.
  - Updates status to 'READY' and populates `viral_hook_id`.

### **SH-1500.3: Viral Visual Generation (Maya's Protocol)**
**As a** Visualist (Maya),  
**I want** to automatically generate high-fidelity viral images/infographics for 'READY' content,  
**So that** each post has a compelling visual identity that stops the scroll.
- **Acceptance Criteria:**
  - Triggered by status change to 'READY_FOR_VISUALS'.
  - Analyzes `body_text` to generate optimized image prompts.
  - Saves generated asset URLs to the `media_assets` JSONB field.

---

## 📡 THEME 2: SIGNAL BOOST (TREND MONITORING)
*Focus: Reactive monitoring and real-time conversation hijacking.*

### **SH-1500.4: Forge Scout (Trend Monitor)**
**As an** Architect (Alex),  
**I want** a background worker to poll X/Twitter and LinkedIn for product-relevant keywords,  
**So that** the Hive is always aware of trending conversations it can contribute to.
- **Acceptance Criteria:**
  - Periodically polls social APIs for keywords defined in `product_blueprints.metadata.tags`.
  - Logs "High-Velocity" matches to a signals buffer.

### **SH-1500.5: Contextual Signal Injection**
**As a** Strategist (Jordan),  
**I want** to automatically rewrite content hooks to reference trending topics in real-time,  
**So that** our autonomous deployment feels timely, relevant, and human.
- **Acceptance Criteria:**
  - Triggered by Forge Scout signal matches.
  - Jordan agent selects a "Ready" post and rewrites the "Intro Hook" to reference the trend.
  - Modified post is queued for autonomous deployment.

---

## 📊 THEME 3: GROWTH HUD (VISUALIZATION)
*Focus: Real-time monitoring of viral momentum and reach.*

### **SH-1500.6: Viral Momentum Score (VMS) Engine**
**As a** Strategist (Jordan),  
**I want** a proprietary metric to calculate the real-time impact of our content,  
**So that** I can identify winning patterns and kill underperforming campaigns.
- **Acceptance Criteria:**
  - Implement calculation: `VMS = (Engagement Velocity * Conversion Rate) / Time Since Post`.
  - Store score in `performance_score` field.

### **SH-1500.7: Growth HUD - Social Reach Matrix**
**As a** User (The Hive),  
**I want** a high-fidelity dashboard view of Impressions vs. Conversions across all active prototypes,  
**So that** I can see the aggregate impact of our autonomous marketing efforts.
- **Acceptance Criteria:**
  - Aggregate view of `marketing_content` performance metrics.
  - Time-series chart of Reach vs. Growth.

### **SH-1500.8: Growth HUD - Content Backlog & Signal Map**
**As a** User (The Hive),  
**I want** a Kanban view of content status and a word cloud of "Hot Keywords,"  
**So that** I can monitor the production pipeline and see what trends we are currently tracking.
- **Acceptance Criteria:**
  - Kanban board: Draft -> Optimizing -> Ready -> Posted.
  - Signal Map word cloud reflecting currently tracked keywords.

---

## 🎨 DESIGN BRIEF: MAYA [PHASE 3]
**Objective:** Growth Matrix & Viral Momentum Visualizations.

1.  **Growth Matrix:** A dual-axis scatter plot (Impressions vs. Conversions) where each bubble represents a content piece. Size of bubble = VMS.
2.  **Viral Momentum Pulse:** A real-time "heartbeat" line chart showing global engagement velocity across the entire portfolio.
3.  **Signal Map:** A high-fidelity, "glowing" word cloud using the Imperial Gold / Deep Space Navy palette. Keywords should pulse when a match is detected by Forge Scout.
4.  **Content Cards:** Kanban cards that show the current Hook + the AI-generated visual preview.

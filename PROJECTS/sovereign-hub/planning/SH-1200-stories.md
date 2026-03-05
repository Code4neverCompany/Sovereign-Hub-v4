# 📖 User Stories: Autonomous Product Forge [SH-1200]
**Project:** Sovereign Hub v4.0 (Slim-Stack)  
**Epic:** SH-1200  
**Strategist:** Jordan  

## 🌌 Epic Vision
To create a fully autonomous "Market-to-Code" pipeline that identifies trending opportunities and builds functional prototypes in 60 minutes, maximizing the ROI of agent compute by focusing on high-signal market gaps.

---

## 🛰️ Scout Protocol (SH-1200.1: Research Engine)
*Focused on proactive market hunting and signal synthesis.*

### **SH-1200.1.1: High-Signal Market Scan**
- **User Story:** As the system, I want to scan GitHub trending, HN, and Indie Hackers every 6 hours so that I can identify emerging niches and "pain point" clusters without manual intervention.
- **ROI:** 24/7 market monitoring; 10x faster identification of trends compared to human scouting.
- **Acceptance Criteria:** 
    - [ ] `web_search` queries implemented for specified sources.
    - [ ] Logic for identifying "Pain Points" via keyword clustering.

### **SH-1200.1.2: Viability Filter (The "Build-O-Meter")**
- **User Story:** As a Market Scout, I want to apply a "Difficulty vs. Demand" filter to all findings so that the Forge only commits resources to projects that are technically feasible within a 1-hour sprint.
- **ROI:** Zero wasted compute on "Pipe Dream" projects.
- **Acceptance Criteria:**
    - [ ] Scoring algorithm (1-10) for Market Heat and Technical Difficulty.
    - [ ] Filter threshold defined (e.g., Score > 7).

### **SH-1200.1.3: Blueprint Initialization**
- **User Story:** As the Scout, I want to populate the `product_blueprints` table with a name, pitch, and technical stack for every viable idea found.
- **ROI:** Persistent IP storage; structured handoff to Jordan.
- **Acceptance Criteria:**
    - [ ] SQL `INSERT` to `product_blueprints` upon discovery.
    - [ ] Status set to `IDEA`.

---

## 🏗️ 1-Hour Sprint Forge (SH-1200.2: Forge Logic)
*Focused on the orchestrated multi-agent execution pipeline.*

### **SH-1200.2.1: Automated Pulse Handoff**
- **User Story:** As the Forge Controller, I want to automatically trigger the next agent in the sequence (Jordan -> Maya -> Dev) the moment a blueprint's status is updated.
- **ROI:** Eliminates idle time between agents; ensures the 60-minute deadline is met.
- **Acceptance Criteria:**
    - [ ] Supabase Realtime hook or `process` watcher for status changes.
    - [ ] Handoff payload includes previous agent's output.

### **SH-1200.2.2: Strategic Refinement (Jordan)**
- **User Story:** As the Strategist, I want to generate a PRD and monetization strategy for an `IDEA` so that the designer and developer have functional constraints.
- **ROI:** Business-aligned prototypes vs. just "cool tech."
- **Acceptance Criteria:**
    - [ ] PRD includes: MVP Features, User Flow, Pricing Model.
    - [ ] Status updated to `REFINING`.

### **SH-1200.2.3: Rapid Materialization (Dev)**
- **User Story:** As the Engineering agent, I want to scaffold a functional repository and implement core logic based on the PRD and UI Mockup within 20 minutes.
- **ROI:** Tangible "Proof of Concept" delivered to the `/prototypes/` directory.
- **Acceptance Criteria:**
    - [ ] Functional codebase in `/home/skywork/workspace/PROJECTS/prototypes/[name]`.
    - [ ] Status updated to `PROTOTYPE`.

---

## 🖥️ Forge HUD (SH-1200.3: HUD Integration)
*Focused on the visual monitoring and control layer.*

### **SH-1200.3.1: The Incubator (Progress Ring)**
- **User Story:** As an Operator, I want to see a central UI ring showing a 60-minute countdown and the current active agent so that I can visualize the "birth" of a product.
- **ROI:** High-fidelity observability; operator confidence.
- **Acceptance Criteria:**
    - [ ] SVG-based circular progress bar in the "Forge" Tab.
    - [ ] Active agent name/icon displayed in the center.

### **SH-1200.3.2: The DNA Strand (Evolution Timeline)**
- **User Story:** As an Operator, I want to see a vertical timeline of "Snapshots" (research logs, design tokens, code commits) for a product.
- **ROI:** Traceability and auditability of autonomous decisions.
- **Acceptance Criteria:**
    - [ ] Scrollable vertical timeline component.
    - [ ] Expandable nodes showing agent outputs.

### **SH-1200.3.3: Blueprint Gallery**
- **User Story:** As an Operator, I want to view a grid of all scouted ideas with hover states showing "Market Heat" and "Build Readiness."
- **ROI:** Efficient decision-making for human-led validation.
- **Acceptance Criteria:**
    - [ ] Responsive grid layout for blueprint cards.
    - [ ] "Promote to Validation" button on each card.

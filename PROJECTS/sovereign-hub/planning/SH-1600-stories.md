# 🔱 User Stories: Project Nexus / File Explorer [SH-1600]

## 1. EPIC OVERVIEW
**Epic:** SH-1600
**Objective:** Centralized visibility and control over the Sovereign Hub's physical workspace and the discovery-to-project pipeline.
**Value Proposition:** Redefines the Hub from a collection of scripts into a managed operating system where the Sovereign can browse, edit, and approve expansion at the speed of thought.

---

## 2. USER STORIES

### 📂 Nexus Explorer (SH-1600-E)
*   **SH-1600.E1: Deep Workspace Visibility**
    *   *As the Sovereign,* I want to browse the `/PROJECTS/`, `/PLANNING/`, and `/AGENTS/` directories in a unified tree view so that I can maintain full situational awareness of my digital estate.
    *   **Acceptance Criteria:**
        *   Fast, depth-limited (max 3) recursive directory scanning.
        *   Visual distinction between Project folders, Planning assets, and Agent workspaces.
        *   Auto-filtering of noise (node_modules, .git).
*   **SH-1600.E2: Project Pulse Metadata**
    *   *As the Sovereign,* I want the explorer to display project status and lead agent info next to folder names so that I don't have to open files to know what's active.
    *   **Acceptance Criteria:**
        *   Automatic parsing of `stories.md` or `project.json` for metadata.
        *   Visual status indicators (ACTIVE, PAUSED, COMPLETED).

### 📝 Sovereign HUD Editor (SH-1600-F)
*   **SH-1600.F1: Instant Markdown Management**
    *   *As the Sovereign,* I want to click any `.md` file in the Nexus and open it in a dual-pane editor (Markdown + Preview) so that I can read and update project documentation instantly.
    *   **Acceptance Criteria:**
        *   Live preview rendering using `marked.js`.
        *   Integrated Monaco/CodeMirror editor for source editing.
*   **SH-1600.F2: Fail-Safe Sovereign Edits**
    *   *As the Sovereign,* I want a "Backup-on-Save" mechanism whenever I edit a file so that I can recover from accidental deletions or bad manual updates.
    *   **Acceptance Criteria:**
        *   Creation of `.bak` files in `/nexus/backups/` before saving.
        *   Restricted file access to safe types (.md, .yaml, .json, .txt).

### 📊 Project Index (SH-1600-D)
*   **SH-1600.D1: Physical-to-Digital Sync**
    *   *As the System,* I want a background service to sync the physical folder structure to the Supabase `projects` table so that the Hub's UI stays up-to-date with reality.
    *   **Acceptance Criteria:**
        *   Migration script for `projects` schema.
        *   `last_synced` timestamp updates on folder scan.
*   **SH-1600.D2: Agent-Project Mapping**
    *   *As the Sovereign,* I want to see which agent is the "Lead" for a project and jump directly to their `MEMORY.md` so that I can understand their current reasoning.
    *   **Acceptance Criteria:**
        *   Clickable "Lead Agent" links that trigger the HUD Editor on the specific agent's memory file.

### 🚦 Discovery Queue (SH-1600-S)
*   **SH-1600.S1: The Gating Protocol**
    *   *As the Sovereign,* I want to review Alex's "Scout Findings" in a staging area before they are turned into projects so that I can prevent feature creep and focus resources on high-ROI ideas.
    *   **Acceptance Criteria:**
        *   "Discovery Cards" displaying Name, Niche, Heat, and Source.
        *   Three-tier action bar: APPROVE (Build), REFINE (Strategize), DISCARD (Archive).
*   **SH-1600.S2: Source Verification**
    *   *As the Sovereign,* I want to see a preview of the original source (GitHub/Reddit) for a discovery so that I can verify the context without searching manually.
    *   **Acceptance Criteria:**
        *   Integrated snapshot or iframe preview of the source link.

---

## 3. GATING PROTOCOL: THE SOVEREIGN FILTER

This protocol defines the boundary between Autonomous Execution and Sovereign Approval.

### **Criteria for Autonomous Decision (No Approval Needed):**
*   **Internal Refactoring:** Code cleanup or bug fixes within existing projects.
*   **Memory Maintenance:** Updating `MEMORY.md` or session logs.
*   **Routine Reports:** Generating daily/hourly briefings.
*   **Standard Scaling:** Spinning up a sub-agent for a pre-approved Epic task.

### **Criteria for Sovereign Approval (Discovery Queue Gate):**
*   **New Project Creation:** Turning a "Scout Finding" into a `/PROJECTS/` directory.
*   **Strategic Pivot:** Changing the core objective defined in a PRD/ARCHITECTURE file.
*   **External Deployment:** Launching a project to a public-facing URL/Social.
*   **Financial Allocation:** Tasks involving actual spend (Ads, APIs, etc.).

### **Discovery Queue UI Logic:**
1.  **Stage 1: The Pulse (Autonomous):** Alex populates `swarm_knowledge` with signals.
2.  **Stage 2: The Pitch (Gated):** Jordan filters signals into "Project Candidates." These appear in the Discovery Queue.
3.  **Stage 3: The Verdict (Sovereign):**
    *   **APPROVE:** Creates `/PROJECTS/[NAME]`, updates Supabase `projects`, and triggers Maya (Phase 3).
    *   **REFINE:** Flags the candidate with a "Clarification Requested" tag, sending it back to Jordan's planning queue.
    *   **DISCARD:** Marks the entry as `ARCHIVED` in `swarm_knowledge`.

---

## 4. PHASE 3 HANDOFF: DESIGN BRIEF [MAYA]

**Attention Maya:** Phase 3 implementation for SH-1600 should focus on:

1.  **The Nexus Tree:** An elegant, collapsible file explorer in the left sidebar. Use "Imperial Gold" accents for folders containing `ACTIVE` projects.
2.  **The Dual HUD:** A split-pane Markdown editor. Left = Editor (Dark Mode, high contrast), Right = Preview (Clean typography).
3.  **Discovery Cards:** High-impact cards for the Scout Queue. Needs a "Market Heat" gauge and a prominent [APPROVE] button that feels heavy and significant.
4.  **Transitions:** Smooth sliding animations when opening a file from the Nexus into the HUD.

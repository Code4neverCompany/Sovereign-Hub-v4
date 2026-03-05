# [PHASE 1: ARCHITECTURAL BLUEPRINT]
# Project: Sovereign Hub v4.0 (Slim-Stack)
# Epic: Project Nexus / File Explorer [SH-1600]
# Objective: Design a centralized Project Manager and File Explorer tab for the Dashboard.

## 1. EXPLORER LOGIC: The "Nexus" Directory Engine (SH-1600-E)

The Nexus Explorer is the primary navigation layer for the Sovereign Hub. It provides a structured view of the `/home/skywork/workspace/` environment, optimized for project management and agent orchestration.

### **Core Directory Mapping:**
*   **PROJECTS (`/PROJECTS/`):** High-level project folders (e.g., `sovereign-hub`, `sentinel`).
*   **PLANNING:** Scans each project for `stories.md`, `ARCHITECTURE.md`, and `sprint-status.yaml`.
*   **AGENTS (`/alex/`, `/jordan/`, etc.):** Agent-specific workspaces, focusing on `MEMORY.md` and active task logs.
*   **PROTOTYPES (`/prototypes/`):** Output from the SH-1200 Forge.

### **Navigation Mechanism:**
1.  **Server-Side (Node.js/SovereignGateway):** A specialized `FileService.js` utilizing `fs.readdir` and `fs.stat` with a depth-limit of 3 to prevent performance lag.
2.  **Filtering:** Automatically ignores `node_modules`, `.git`, and system-level hidden files.
3.  **Metadata Extraction:** When a directory is scanned, the engine looks for a `project.json` or `stories.md` to extract a "Project Name" and "Status" for the UI.

---

## 2. FILE ACCESS: The "Sovereign HUD" Markdown Editor (SH-1600-F)

Integrated directly into the Dashboard, the Markdown Reader/Editor allows the Sovereign to oversee and modify the "Brain" files of any project.

### **Logic Flow:**
1.  **Read:** `GET /api/files?path=[url_encoded_path]`. Returns raw text + file metadata (last modified, size).
2.  **Render:** Uses `marked.js` or `react-markdown` for high-fidelity preview in the HUD.
3.  **Edit:** A simple `Monaco Editor` or `CodeMirror` instance for live editing.
4.  **Save:** `POST /api/files/save`. Includes `path` and `content`. Implements a "Backup-on-Save" mechanism (creating a `.bak` in a hidden `/nexus/backups/` folder) before overwriting.
5.  **Allowed Files:** Strictly restricted to `.md`, `.yaml`, `.json`, and `.txt` to prevent accidental execution of scripts via the editor.

---

## 3. PROJECT INDEX: Supabase `projects` Schema (SH-1600-D)

The `projects` table acts as the source of truth for high-level metadata, linking the physical file structure to the Hub's logic.

### **Database Schema: `projects`**

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key. |
| `name` | `text` | Display name of the project. |
| `path` | `text` | Absolute path (e.g., `/home/skywork/workspace/PROJECTS/sovereign-hub`). |
| `status` | `text` | `ACTIVE` | `PAUSED` | `COMPLETED` | `ARCHIVED`. |
| `lead_agent` | `text` | The primary agent assigned (e.g., "Alex", "Jordan"). |
| `epic_count` | `int` | Number of detected Epics (parsed from `stories.md`). |
| `last_synced` | `timestamptz` | Last time the folder was scanned by the Nexus Engine. |
| `meta` | `jsonb` | Extended data: tech stack, priority, and link to Time-Machine logs. |

---

## 4. SCOUT QUEUE: The "Discovery Queue" UI (SH-1600-S)

The Scout Queue is the staging area for SH-1200 findings. It prevents autonomous "feature creep" by requiring Sovereign approval before Alex's discoveries enter the BMad Workflow.

### **UI Components:**
*   **Discovery Card:** Displays the Scout's finding (Name, Niche, Market Heat, Source Link).
*   **Action Bar:** 
    *   `[APPROVE]`: Moves the entry from `swarm_knowledge` to the `projects` table and triggers the Forge (SH-1200).
    *   `[REFINE]`: Sends a prompt back to Jordan to adjust the strategy.
    *   `[DISCARD]`: Archives the discovery.
*   **Source Preview:** An iframe or snapshot of the original source (GitHub/Reddit/PH) found by the Scout.

---

## 5. INTEGRATION: The Dashboard "Brain" Layer

Nexus acts as the connective tissue between the Hub's various epics.

*   **Time-Machine (SH-1000) Link:** Each file in the Explorer has a "History" button that pulls event logs from the `temporal_events` table filtered by the file's path.
*   **Forge (SH-1200) Link:** Approved Scout findings automatically create a new folder in `/PROJECTS/` and a corresponding entry in the Explorer.
*   **Agent Workspace:** Clicking an agent's name in the "Lead Agent" column opens their `MEMORY.md` directly in the HUD Editor.

---

## 6. HANDOFF: Jordan [Strategist]

### Technical Spec for Implementation
*   **Epic:** SH-1600 (Project Nexus / File Explorer).
*   **Core Value:** Centralized visibility and control over the entire 4Never Hive workspace.
*   **User Stories:**
    1.  *Deep Visibility:* "As the Sovereign, I want to browse all projects and read their current stories.md without leaving the Dashboard."
    2.  *Controlled Autonomy:* "As the Sovereign, I want to see a list of everything Alex discovered today and choose which ones to build."
    3.  *Live Edits:* "As the Sovereign, I want to manually update the `sprint-status.yaml` of a project to override an agent's decision."

### Status Update
- [x] Nexus Explorer Logic Designed (Directory Engine).
- [x] HUD Markdown Editor Logic Defined (File Access).
- [x] `projects` Supabase Schema Designed (Project Index).
- [x] Discovery Queue UI Drafted (Scout Queue).
- [x] Integration Points Mapped (Dashboard Brain).
- [ ] Next Step: Create `setup_projects.sql` and implement `FileService.js` in the core gateway.

# [PHASE 1: ARCHITECTURAL BLUEPRINT]
# Project: Sovereign Hub v4.0 (Slim-Stack)
# Epic: Sovereign Persistence Warden [SH-1900]
# Objective: Design the Autonomous GitHub Synchronization and Project Backup Layer

## 1. THE AGENT: Persistence Warden (SH-1900-W)

The **Persistence Warden** is the system's "Git Guardian." It operates as a background service (or high-frequency pulse) responsible for ensuring that no intellectual property created by the Sovereign Hub is lost. It bridges the gap between the local workspace and remote GitHub repositories.

### **Core Responsibilities:**
- **Continuous Monitoring:** Tracking uncommitted changes across critical directories.
- **Safety Enforcement:** Ensuring commits only occur when the system is in a stable, "Cleared" state.
- **Multi-Repo Management:** Orchestrating the synchronization of the main dashboard and multiple forged product repositories.
- **Auto-Initialization:** Provisioning new repositories for projects discovered by Alex (SH-1200).

---

## 2. MONITORING: The "Diff Engine" (SH-1900-M)

The Warden implements a "Workspace Watcher" that identifies uncommitted changes across three primary zones.

### **Target Zones:**
1.  **/v4/**: The core Sovereign Hub application, engine, and UI.
2.  **/planning/**: Strategic documents, blueprints, and mission logs.
3.  **/tmp/prototypes/**: Newly forged products and experimental code.

### **Mechanism:**
- **Git Pulse:** Runs `git status --porcelain` on a 5-minute interval (Configurable).
- **Hash Verification:** For directories not yet under Git control, the Warden calculates recursive SHA-256 hashes to detect file-level changes.
- **Change Log:** Maintains a local `persistence_buffer.json` to track pending changes before they are committed.

---

## 3. COMMIT LOGIC: "Atomic Persistence" Protocol (SH-1900-C)

To prevent "Half-Baked" commits (committing broken code or incomplete thoughts), the Warden follows a strict protocol.

### **Safety Gate: Sam [Sentinel] Integration**
The Warden will not initiate a commit unless the **Sentinel (Sam)** has issued a `RELEASE_CLEARED` signal.
- **Source:** The Warden queries the `swarm_knowledge` table (SH-1100) or looks for a `SENTINEL_RELEASE_REPORT_*.md` file with a verified status.
- **Status Check:** `SELECT content FROM swarm_knowledge WHERE type = 'STATE' AND agent_id = 'sam' ORDER BY created_at DESC LIMIT 1;`

### **The Sync Pipeline:**
1.  **Detection:** Identify uncommitted changes in Target Zones.
2.  **Audit:** Verify `RELEASE_CLEARED == true`.
3.  **Staging:** `git add .` (filtering out `.env` and sensitive data).
4.  **Verification:** Run a lightweight `npm test` or `verify_ui_*.js` check (if applicable).
5.  **Atomic Commit:** 
    - Message Format: `[SH-1900] [Pulse: {Timestamp}] {Summary of Changes}`
6.  **Push:** Push to the configured remote.
7.  **Finalization:** Update the "Persistence" Widget with the new Sync Timestamp.

---

## 4. MULTI-REPO SYNC: Repository Management (SH-1900-R)

The Sovereign Hub manages a distributed network of repositories. The Warden acts as the central coordinator.

### **Registry: `persistence_repos` (Supabase Table)**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Repo ID. |
| `local_path` | `text` | e.g., `/home/skywork/workspace/PROJECTS/sovereign-hub/v4/`. |
| `remote_url` | `text` | GitHub URL. |
| `type` | `text` | `CORE` | `PROTOTYPE` | `ARCHIVE`. |
| `last_sync` | `timestamptz` | Timestamp of last successful push. |
| `health_status` | `text` | `GREEN` | `YELLOW` (pending) | `RED` (conflict/error). |

### **Sync Strategy:**
- **Main Sync:** Bi-directional sync for `/v4/` (Main Dashboard).
- **Product Sync:** Unidirectional (Local -> Remote) for `/tmp/prototypes/` until they are promoted to standalone repositories.

---

## 5. HUD INTEGRATION: The "Persistence" Widget (SH-1900-U)

Integrated into the **Command Tab**, this widget provides the operator with real-time visibility into the system's "Persistence Layer."

### **UI Components:**
- **Cloud Connectivity Ring:** A radial indicator showing GitHub API latency and connection status.
- **Sync Timeline:** A mini-log showing the last 5 commits and their status.
- **Warden Pulse:** A "Heartbeat" animation that flashes when the Warden is scanning for changes.
- **Pending Count:** A badge showing the number of uncommitted files across all managed zones.
- **"Force Sync" Button:** An emergency override to bypass the Sentinel gate (requires Operator confirmation).

---

## 6. DISCOVERY: Project Initialization (SH-1900-D)

The Warden proactively initializes repositories for new products identified by Alex.

### **The Discovery Workflow:**
1.  **Scanner:** Monitors the `product_blueprints` table (SH-1200).
2.  **Trigger:** Finds an entry with `status = 'PROTOTYPE'` and `repo_url = NULL`.
3.  **Provisioning:**
    - Calls the GitHub API to create a new private repository.
    - Copies the prototype from `/tmp/prototypes/[project]` to a managed workspace directory.
    - Initializes Git, sets the remote, and performs the initial push.
4.  **Handoff:** Updates the `product_blueprints` record with the new `repo_url` and marks the project as `MANAGED`.

---

## 7. HANDOFF: Dev [Engineering]

### Technical Spec for Implementation
- **Epic:** SH-1900 (Sovereign Persistence Warden).
- **Core Value:** Guaranteed intellectual property preservation and autonomous project scaffolding.
- **User Stories:**
    1.  *Atomic Safety:* "As the system, I want to wait for the Sentinel to confirm the build is stable before pushing code to GitHub, preventing repo pollution."
    2.  *Autonomous Provisioning:* "As an operator, I want to see a new GitHub repo automatically appear for every viable product Alex discovers."
    3.  *HUD Visibility:* "As an operator, I want to glance at the Command Tab and know exactly when the last backup happened and if any files are currently unsaved."

### Status Update
- [x] Warden Agent Role Defined.
- [x] Workspace Watcher (Diff Engine) Designed.
- [x] Atomic Persistence Protocol (Safety Gate) Defined.
- [x] Multi-Repo Sync Registry Designed.
- [x] HUD Persistence Widget Blueprint Drafted.
- [x] Project Discovery & Initialization Logic Defined.
- [ ] Next Step: SQL migration for `persistence_repos` and Warden core script implementation.

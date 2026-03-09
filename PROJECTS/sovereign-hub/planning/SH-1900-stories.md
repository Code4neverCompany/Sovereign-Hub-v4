# Epic: Sovereign Persistence Warden [SH-1900]
## Objective: Plan the "Guardian of the Vault" autonomous backup features.

### 1. USER STORIES

#### SH-1900.M: Workspace Observer (The Diff Engine)
- **Story:** As the system, I want to continuously monitor the `/v4/`, `/planning/`, and `/tmp/prototypes/` directories for uncommitted changes so that I can maintain a real-time buffer of unsaved progress.
- **Acceptance Criteria:**
    - Warden runs `git status --porcelain` every 5 minutes.
    - Non-git directories are hashed using SHA-256 to detect changes.
    - Pending changes are logged to `persistence_buffer.json`.

#### SH-1900.C: Atomic Persistence (Sentinel-Gated Commits)
- **Story:** As a developer, I want the system to only push code to GitHub when the Sentinel (Sam) has issued a `RELEASE_CLEARED` signal, ensuring that the remote repository always contains a stable build.
- **Acceptance Criteria:**
    - Warden queries `swarm_knowledge` for Sam's latest state.
    - Commit/Push is blocked if `RELEASE_CLEARED` is false.
    - Manual override ("Force Sync") is available for the operator.

#### SH-1900.D: Autonomous Repo Proliferation (Discovery & Provisioning)
- **Story:** As an operator, I want the Warden to automatically provision new GitHub repositories for every viable product blueprint discovered by Alex, so that the Hive can scale its intellectual property without manual intervention.
- **Acceptance Criteria:**
    - Warden monitors the `product_blueprints` table for `PROTOTYPE` status.
    - Warden calls GitHub API to create private repos for new products.
    - Warden initializes local git, sets remotes, and performs initial push.
    - `product_blueprints` is updated with the new `repo_url`.

#### SH-1900.R: Multi-Repo Management (The Registry)
- **Story:** As the system, I want to manage a registry of all active project repositories and their health status, so that I can orchestrate synchronized backups across the entire Sovereign Hub ecosystem.
- **Acceptance Criteria:**
    - `persistence_repos` table tracks `local_path`, `remote_url`, and `health_status`.
    - Health is marked `RED` on conflict or sync error.
    - Bi-directional sync for core (`/v4/`), Uni-directional for prototypes.

#### SH-1900.U: Persistence HUD (Visibility Layer)
- **Story:** As an operator, I want to see a "Persistence" widget on the Command Tab showing sync status, latency, and pending changes, so that I have full visibility into the system's backup state.
- **Acceptance Criteria:**
    - Real-time display of last sync timestamp.
    - Badge showing count of uncommitted files.
    - Connectivity indicator (Cloud Ring).

---

### 2. SYNC PROTOCOL: Commit Message Generation Rules

The Warden must write professional, context-aware summaries. Messages should follow this standard:

**Format:** `[SH-1900] [Pulse: YYYY-MM-DD HH:mm] {Summary}`

**Rules:**
1.  **Context Detection:** If changes are primarily in `/planning/`, the summary should start with "Strategic Update:".
2.  **Epic Tracking:** If a file path matches an active epic ID (e.g., `SH-1200`), mention it in the summary.
3.  **Sentinel Stamp:** Always append the Sentinel status (e.g., `[Sentinel: CLEARED]`).
4.  **Change Summary:** Use a concise list of modified modules (e.g., "Updated core/SovereignGateway.js and 3 planning docs").
5.  **No Generic Spam:** Avoid "Auto-commit" or "Pulse update" without descriptive context.

---

### 3. HANDOFF: Maya [Phase 3] Design Brief

**Target:** Command Tab -> Persistence Widget & Repository Matrix.

**Visual Requirements:**
- **Cloud Health Widget:**
    - A radial "Cloud Connectivity Ring" that glows Imperial Gold when connected.
    - API Latency (ms) displayed in the center.
    - "Warden Pulse": A subtle heartbeat animation (opacity pulse) synchronized with the 5-minute scan interval.
- **Repository Matrix HUD:**
    - A vertical scrollable list of managed repositories.
    - Status LEDs: 🟢 (Synced), 🟡 (Syncing/Pending), 🔴 (Error/Conflict).
    - "Last Sync" relative timestamps (e.g., "2m ago").
    - "Force Sync" button: A dangerous-looking button with a confirmation modal.
- **Pending Changes Badge:** A high-contrast red circle with white text showing the number of modified files, positioned over the "Persistence" icon.

---

### 4. SPRINT PLAN (SH-1900)

| ID | Task | Owner | Est. Pts | Status |
| :--- | :--- | :--- | :--- | :--- |
| SH-1900.1 | User Stories & Strategic Planning | Jordan | 2 | ✅ DONE |
| SH-1900.2 | UX/UI Design Mockups: Persistence HUD & Repo Matrix | Maya | 5 | ⏳ TODO |
| SH-1900.3 | `persistence_repos` SQL Schema & Migration | Alex | 2 | ⏳ TODO |
| SH-1900.4 | Workspace Watcher Script (`sentinel.js` extension) | Alex | 5 | ⏳ TODO |
| SH-1900.5 | GitHub API Integration & Provisioning Logic | Alex | 6 | ⏳ TODO |
| SH-1900.6 | Persistence Widget: Latency Ring & Pulse | Maya | 4 | ⏳ TODO |
| SH-1900.7 | Repo Matrix: Status List & Force Sync Button | Maya | 5 | ⏳ TODO |
| SH-1900.8 | Commit Message Generator (Context-Aware Logic) | Alex | 4 | ⏳ TODO |

# [PHASE 1: ARCHITECTURAL BLUEPRINT]
# Project: Sovereign Hub v4.0
# Epic: Neural Trace Recording [SH-1000]
# Objective: Design the "Time-Machine" layer for agent thought-streams.

## 1. STORAGE: Supabase 'neural_snapshots' Schema

To enable granular playback and state reconstruction, we define a high-density event table. This table uses JSONB for flexibility and indexed timestamps for fast range queries.

### Table: `neural_snapshots`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key (gen_random_uuid()) |
| `session_id` | uuid | Foreign Key to agent sessions |
| `agent_id` | text | Unique identifier of the agent (e.g., 'alex', 'jordan') |
| `timestamp` | timestamptz | Precise time of the event (default: now()) |
| `step_index` | int4 | Sequential counter to maintain absolute order within a session |
| `event_type` | text | Enums: `THOUGHT`, `TOOL_CALL`, `TOOL_RESULT`, `STATE_CHANGE`, `ERROR` |
| `payload` | jsonb | The core data (thought text, tool args, or result output) |
| `workspace_diff` | jsonb | Git-style diff of modified files at this specific step |
| `metadata` | jsonb | Model name, temperature, token usage, and hardware telemetry |

**Indexing Strategy:**
- Composite Index: `(session_id, step_index)` for sequential playback.
- Gin Index: `payload` and `workspace_diff` for deep searching within thoughts or file changes.

---

## 2. LOGIC: HUD Recording Mechanism (The "Black Box")

The recording mechanism operates as a non-blocking background listener within the Sovereign Hub HUD (`app.js`).

### The `TraceRecorder` Module:
1.  **Event Hook:** Subscribes to the OpenClaw `/events` stream (or monitors the existing `agent_logs` and `agent_states` realtime channels).
2.  **State Tracking:** Maintains a local "Shadow State" of the agent's current thought buffer.
3.  **Diff Generation:** When a file-system event is detected (e.g., `write`, `edit`), it captures the `oldText` vs `newText` and generates a compact JSON diff.
4.  **Persistence:**
    - **Buffering:** Events are collected in a 500ms buffer to prevent database hammering.
    - **Batch Upsert:** Uses Supabase `.insert()` with the collected batch.
    - **Neural Lag Detection:** Calculates the delta between the OpenClaw event timestamp and the successful storage confirmation.

---

## 3. BLUEPRINT: Playback UI ("The Scrubber")

The Playback UI is a dedicated tab in the Sovereign Hub HUD that allows operators to "Rewind" time.

### Component 1: The Chrono-Scrubber (Timeline)
- **Visuals:** A horizontal SVG timeline with "Heat Markers" indicating high-activity zones (clusters of tool calls).
- **Control:** A draggable gold needle (Imperial Gold #D4AF37) that maps to `step_index`.
- **Logic:** Dragging the needle triggers a "State Reconstitution" — the UI updates to show the agent's thoughts and file states as they existed at that exact `step_index`.

### Component 2: Visual Diff (Ghost-Writer View)
- **Engine:** `diff-match-patch` (Lightweight JS library via CDN).
- **View:** A split-pane or unified diff viewer.
- **Functionality:** Highlights line-by-line changes in the workspace. Operators can see *exactly* how an agent's thought led to a specific code modification.

### Component 3: Thought-Stream Animator
- **Visuals:** Terminal-style "Typewriter" effect that replays the "Streaming Thoughts" at adjustable speeds (1x, 2x, 4x, or Instant).

---

## 4. METRICS: SH-700 Integration

Neural Trace Recording introduces overhead. We must monitor this via the SH-700 Analytics Engine.

### Integrated Metrics:
1.  **Trace Latency (`recording_latency_ms`):** Tracked in `agent_metrics.metadata`. Measures the delay added by the recording layer.
2.  **Storage Growth (`trace_disk_usage`):** A custom ApexChart in the Analytics tab showing cumulative bytes stored in `neural_snapshots`.
3.  **Trace Density:** A metric showing the number of events per session (Events/min), helping identify "Chatty" agents that may need optimization.

---

## 5. HANDOFF: Jordan [Strategist]

### Strategic Value:
- **Auditability:** Total transparency into agent reasoning.
- **Debugging:** Reproduce intermittent failures by "Replaying" the exact state sequence.
- **Safety:** Human-in-the-loop "Pause & Rewind" capability before final execution.

### Implementation Priority:
1.  **V4-Core-Recorder:** Build the `TraceRecorder.js` and link to `app.js`.
2.  **V4-DB-Trace:** Execute the SQL migration for `neural_snapshots`.
3.  **V4-UI-Playback:** Build the Scrubber and Diff viewer in the "Trace" tab.

### Requested User Stories (Jordan):
1.  *Rewind to Failure:* As an operator, I want to scrub back to the exact moment an agent made a logic error so I can understand its context.
2.  *Visual Validation:* As a developer, I want to see a side-by-side diff of file changes during a mission to verify code integrity.
3.  *Latency Audit:* As a system admin, I want to ensure the recording layer isn't slowing down agent execution by more than 50ms.

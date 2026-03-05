# 🔱 User Stories: Neural Nexus Dispatcher [SH-601]

## 🎯 Overview
The Neural Nexus Dispatcher is the bidirectional command layer for the Sovereign Hub v4.0. It enables the Sovereign to spawn, configure, and monitor agent missions directly from the HUD.

---

## 📖 User Story 1: Nexus Dispatch Modal [SH-601.1]
**As a Sovereign, I want a high-fidelity Modal UI to initiate new agent missions so I can command the Hive without leaving the HUD.**

### ✅ Acceptance Criteria
- [ ] Accessible via a "Dispatch" button in the HUD Navigation/Action bar.
- [ ] **Lux 3.0 Styling:** Semi-transparent glassmorphism with neon cyan accents (`#00f2ff`).
- [ ] Includes fields for `Mission Name`, `Objective/Prompt`, and `Model Engine`.
- [ ] Responsive design (Desktop/Tablet).

### 🛠️ Technical Requirements
- Component: `NexusDispatchModal.tsx` using Tailwind CSS + Headless UI/Radix.
- State Management: Local component state for form inputs.
- Styling: Framer Motion for entrance/exit animations.

---

## 📖 User Story 2: Model Engine Selector [SH-601.2]
**As a Sovereign, I want to select specific model-engine overrides for my missions so I can optimize cost and performance per task.**

### ✅ Acceptance Criteria
- [ ] Dropdown menu featuring: `Gemini 1.5 Pro`, `Gemini 1.5 Flash`, `GPT-4o`, `Claude 3.5 Sonnet`.
- [ ] Real-time "Cost/Speed" indicator icons for each model.
- [ ] Persists the selection to the dispatch payload.

### 🛠️ Technical Requirements
- Integration with the backend `available_models` config.
- Dynamic tooltips for model capabilities.

---

## 📖 User Story 3: Dispatch Uplink Integration [SH-601.3]
**As a Sovereign, I want the Dispatch Modal to communicate with the OpenClaw orchestration layer so that missions actually start upon clicking 'Launch'.**

### ✅ Acceptance Criteria
- [ ] 'Launch Mission' button triggers a POST request to the Hub API.
- [ ] Loading state (Pulse animation) while the agent is spawning.
- [ ] Success/Failure toast notifications.

### 🛠️ Technical Requirements
- API Endpoint: `POST /api/v1/nexus/dispatch`.
- Payload Schema: `{ mission_id, objective, model, settings: { ... } }`.
- Error handling for rate limits or unavailable models.

---

## 📖 User Story 4: Mission Manifest Link [SH-601.4]
**As a Sovereign, I want newly spawned missions to immediately appear in the 'Active Missions' list so I can track their progress.**

### ✅ Acceptance Criteria
- [ ] UI auto-refreshes or optimistic UI update upon successful dispatch.
- [ ] New mission entry shows the "Neural Nexus" origin tag.

### 🛠️ Technical Requirements
- Supabase Realtime subscription on the `missions` (or `todos`) table.
- Optimistic UI update using TanStack Query (React Query).

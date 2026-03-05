# Jordan_Strategy_Reactivate: EPIC-5 Re-alignment
**Date:** 2026-03-05 05:40 UTC
**Status:** EMERGENCY REACTIVATION

## 1. Stagnation Analysis
*   **Architect Finish (01:48):** Alex provided blueprints, but the handoff to Dev for Next.js implementation stalled.
*   **Visual Prototype (01:38):** Dev produced a high-fidelity HTML/Tailwind mockup (`PROOF/index.html`) but hasn't migrated the assets to the React/Next.js stack (`dev/mission-control`).
*   **Implementation Gap:** The WebSocket bridge in `src/lib/openclaw-bridge.ts` is a skeleton. Dev likely hit a "blank page" block or is waiting for specific API endpoints that aren't yet mocked.

## 2. Immediate Next Steps (Directive for Dev)
To break the 4-hour stagnation, Dev must pivot from "designing" to "plumbing" the SSE/WebSocket bridge.

### Phase A: The Component Migration (30 mins)
1.  **Extract Lux Aesthetic:** Move the Tailwind classes and custom CSS from `PROOF/index.html` into `dev/mission-control/src/app/globals.css`.
2.  **Hydrate `page.tsx`:** Replace the boilerplate in `src/app/page.tsx` with the JSX structure from the proof.

### Phase B: The OpenClaw SSE Bridge (The Hard Gate)
1.  **Switch to SSE:** WebSocket is overkill for the current read-heavy HUD. Dev must implement `EventSource` in `openclaw-bridge.ts` to listen to the OpenClaw `/events` stream.
2.  **Map Neural Feed:** Create a React Hook (`useNeuralFeed`) that subscribes to the SSE stream and updates the "Intel Stream" component in real-time.
3.  **Actionable Dispatch:** Wire the "🏗️ ALEX" card to an `onClick` event that hits `POST /api/dispatch` to demonstrate sub-agent spawning.

## 3. Decision Tree for Next 2 Hours
*   **IF** Dev encounters Next.js build errors -> **THEN** Fallback to `index.html` with a vanilla JS `EventSource` script in `PROOF/` to prove the data flow.
*   **IF** OpenClaw API is unreachable -> **THEN** Create a `mock-api.ts` in `lib/` to simulate the stream so UI development doesn't stall again.

## 4. ROI Target
By 08:00 UTC, the Dashboard must show *live* data (even if mocked) flowing through the "Lux" interface. Anything else is a failure of Phase 2 planning.

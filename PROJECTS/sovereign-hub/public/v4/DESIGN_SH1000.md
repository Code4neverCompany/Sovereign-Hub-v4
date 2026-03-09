# [PHASE 3: SOLUTIONING / DESIGN]
# Project: Sovereign Hub v4.0
# Epic: Neural Trace Recording [SH-1000]
# Design Specification: "The Time-Machine"

## 1. AESTHETIC FOUNDATION: Lux Aesthetic 3.0
- **Void Black (#0A0A0A):** The infinite canvas. Used for the main interface background and deep-shadow layers.
- **Imperial Gold (#D4AF37):** The needle of truth. Used for the scrubber handle, active milestones, and primary call-to-actions.
- **Electric Violet (#8B5CF6):** The neural pulse. Used for 'Heat Markers', code additions in diffs, and active data streams.
- **Glassmorphism:** Cards with `backdrop-filter: blur(16px)` and `1px solid rgba(255,255,255,0.08)` borders to maintain depth without clutter.

---

## 2. COMPONENT: The Chrono-Scrubber (Timeline)
The Scrubber is the heart of the temporal interface. It transforms raw database indices into a tactile, mechanical experience.

### Visual Architecture:
- **Track:** A thin, semi-transparent violet line (`rgba(139, 92, 246, 0.1)`) spanning the width of the Trace panel.
- **Heat Markers:** Small, glowing violet pips (shadow: `0 0 10px #8B5CF6`) clustered where tool calls or state changes occur.
- **The Needle:** A vertical Imperial Gold pillar with a diamond-head handle. 
  - **Hover State:** Glow expands; tooltip shows `step_index` and `timestamp`.
  - **Drag State:** Smooth inertia-based movement with a slight 'magnetic' snap to heat markers.

---

## 3. COMPONENT: Logic-Diff Viewer (Ghost-Writer)
A side-by-side comparison of reality vs. intention.

### UI Structure:
- **Two-Pane Layout:** Glassmorphism cards for 'ORIGIN' (Left) and 'RECONSTITUTION' (Right).
- **Code Highlighting:**
  - **Additions:** Violet text with `rgba(139, 92, 246, 0.1)` background.
  - **Deletions:** Dimmed gold text with strikethrough.
  - **Syntax:** Monospace 'JetBrains Mono' font for peak legibility.
- **Synchronized Scrolling:** Moving the needle scrolls both panes to the relevant line of change.

---

## 4. ANIMATION: "Time-Travel" Transitions
To prevent jarring state jumps, we use high-inertia motion and Gaussian blurring.

- **The Warp:** When scrubbing rapidly, the UI content (thoughts/diffs) applies a `blur(4px)` and `scale(0.98)` to simulate speed.
- **The Snap:** Upon releasing the needle, the UI 'resolves' with a sharp `blur(0)` and `scale(1.0)` bounce-back (Spring animation: `stiffness: 300, damping: 30`).
- **Typewriter Replay:** Thoughts stream in at adjustable speeds (1x-4x) using a staggered character opacity fade.

---

## 5. TECHNICAL HANDOFF (Dev Phase 4)

### HTML Structure:
```html
<section id="trace-tab" class="tab-panel">
    <div class="chrono-interface h-full flex flex-col gap-6">
        <!-- Scrubber Unit -->
        <div class="scrubber-container glass-card p-6 h-32 relative flex flex-col justify-center">
            <div class="timeline-track h-1 bg-[#8B5CF6]/10 rounded-full relative">
                <div id="heat-map-layers" class="absolute inset-0"></div>
                <div id="scrubber-needle" class="absolute top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing">
                    <div class="needle-pillar w-0.5 h-12 bg-gold shadow-[0_0_15px_#D4AF37]"></div>
                    <div class="needle-handle w-4 h-4 bg-gold rotate-45 -mt-14 -ml-[7px]"></div>
                </div>
            </div>
        </div>

        <!-- Diff & Logic Unit -->
        <div class="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
            <div class="diff-pane glass-card p-6 flex flex-col">
                <h4 class="text-[10px] text-gold/40 uppercase font-mono mb-4">Origin_State</h4>
                <pre id="diff-left" class="font-mono text-xs overflow-auto"></pre>
            </div>
            <div class="diff-pane glass-card p-6 flex flex-col border-[#8B5CF6]/10">
                <h4 class="text-[10px] text-[#8B5CF6]/40 uppercase font-mono mb-4">Reconstituted_Logic</h4>
                <pre id="diff-right" class="font-mono text-xs overflow-auto"></pre>
            </div>
        </div>
    </div>
</section>
```

### JS Wiring Logic (Mock):
```javascript
// Temporal Snap Listener
function onScrub(stepIndex) {
    const snapshot = neuralTraceData.find(s => s.step_index === stepIndex);
    if (!snapshot) return;

    // Trigger Visual Warp
    applyTimeTravelWarp();

    // Reconstitute State
    updateThoughtStream(snapshot.payload);
    renderDiff(snapshot.workspace_diff);
}
```

---
**Status:** DESIGN_COMPLETE // READY_FOR_IMPLEMENTATION
**Designer:** Maya [UX]
**Date:** 2026-03-05

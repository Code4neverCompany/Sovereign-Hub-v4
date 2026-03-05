# 🎨 [PHASE 3: DESIGN BRIEF]
# Project: Sovereign Hub v4.0
# Epic: Sovereign Executive Bridge [SH-1300]
# Objective: The "God-View" Command Layer & Directive Uplink.

## 🌌 Creative Vision
The Executive Bridge is the definitive command center for the Hive. It should feel tactical, high-fidelity, and reactive. Think: A futuristic War Room HUD combined with a cognitive, living presence (The Command Orb).

---

## 🛠️ Design Requirements

### 1. The "Command" Tab (The God-View HUD)
*   **Layout:** A full-screen centralized dashboard that integrates multiple telemetry streams.
*   **Central Element (The World Map):** 
    *   A high-fidelity world map (Leaflet.js) showing the location of all worker pods. 
    *   Pods should pulse with an **Amber/Gold** glow when active and **Red** when disconnected. 
    *   Hovering/Clicking a pod should open a minimal, high-contrast log window.
*   **The Pulse Sidebar:** 
    *   A vertical strip on the left with speedometer widgets for:
        *   `Real-time Burn` ($/hr).
        *   `Hive Throughput` (Tasks/min).
        *   `Success Rate` (%).
*   **The Forge Dock:** 
    *   A horizontal strip at the bottom showing product cards. 
    *   Each card has a progress ring and a status label (RESEARCH, STRATEGY, DESIGN, DEV).
    *   Colors: Sleek, high-contrast Dark UI with Imperial Gold accents.

### 2. The Command Orb (Vocal Interaction)
*   **Concept:** A reactive visualizer that serves as the visual representation of the Directive Uplink.
*   **Behavior:** 
    *   **Idle:** A subtle, slow-pulse gold glow. 
    *   **Listening:** Rapid, rhythmic expansion/contraction synchronized with the user's voice frequencies. 
    *   **Processing:** A rotating "Cognitive Vortex" animation (Three.js or Canvas). 
    *   **Success:** A bright gold burst. 
    *   **Error:** A sharp, rapid red flicker.
*   **Placement:** Fixed positioned in the bottom-right corner of the HUD, accessible globally.

### 3. The Directive Log (Timeline)
*   **Design:** A vertical, high-contrast timeline of vocal commands.
*   **Content:** Shows the original command transcription, the parsed intent (extracted via LLM), and the resulting agent missions. 
*   **Aesthetic:** Mono-spaced fonts, minimal borders, and subtle glow effects.

---

## 💎 Design Constraints & Aesthetics
*   **Color Palette:** Imperial Gold (`#D4AF37`), Dark Graphite (`#1A1A1B`), and Signal Red (`#FF4C4C`).
*   **Typography:** High-legibility sans-serif for analytics; Monospaced for logs.
*   **Vibe:** Professional, powerful, "Sovereign". Not cluttered, but information-dense.

---

## 🚀 Handoff Summary
Maya, your goal is to merge the **Global Map** from SH-900 with the **Incubator** from SH-1200 and the **Neural Scrubber** from SH-1000 into a single, unified "Command Tab". This is the v4 Master Interface.

**Reference:** `/home/skywork/workspace/PROJECTS/sovereign-hub/v4/ARCHITECTURE_SH1300.md`

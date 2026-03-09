# DESIGN SPECIFICATION: SH-1300 Sovereign Executive Bridge

## 1. VISION: The "God-View" Interface
The Sovereign Executive Bridge (Command Tab) is the ultimate oversight and control layer for the 4Never Hive. It transitions the user from "monitoring" to "steering." The design language follows the **Lux Aesthetic 3.0** (Void Black / Imperial Gold / Cyber Violet).

## 2. HUD ARCHITECTURE (12-Column Grid)

### **A. CEO BRIEFING SIDEBAR (Cols 1-3)**
*   **Typography:** Elegant Cinzel headers with Inter Body.
*   **The Pulse:**
    *   *Real-time Burn:* A vertical gauge showing $/hr with a "Heat" glow (Gold).
    *   *Neural Health:* A circular SVG progress bar for success rate (Violet).
*   **Briefing Cards:** Glassmorphism cards containing the hourly `executive_briefings` summary.
    *   *Glass Effect:* `backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.01);`

### **B. THE GOD-VIEW HUD (Cols 4-9 - CENTRAL)**
*   **The Global Node Map:** A dark-themed Leaflet map (CartoDB DarkMatter) showing physical node locations.
*   **Forge DNA Overlay:** A translucent D3.js SVG overlaying the map, showing the "Active Intent" (DNA helix) moving from Research nodes to Development nodes.
*   **The Command Orb:**
    *   **Visuals:** A multi-layered CSS-animated orb.
    *   **Layers:**
        1.  *Core:* Solid Gold/Violet gradient pulse.
        2.  *Atmosphere:* Rotating rings with `mix-blend-mode: screen`.
        3.  *Voice Reactive:* A `canvas`-based visualizer ring that scales based on audio input.
    *   **States:**
        *   `IDLE`: Low-frequency gold pulse.
        *   `LISTENING`: Rapid violet oscillation.
        *   `THINKING`: Swirling golden nebula.
        *   `EXECUTING`: Intense white/violet flash.

### **C. DIRECTIVE UPLINK (Cols 10-12)**
*   **The Directive Log:** A terminal-style feed of processed vocal commands.
*   **Actionable Feed:** Shows "Decomposing..." -> "Mission Created" -> "Agent Dispatched" animations.

### **D. FORGE DOCK (BOTTOM - OVERLAY)**
*   **Structure:** Horizontal scrolling cards showing the active Forge pipeline.
*   **Phases:** Animated icons (Scout, PRD, Design, Code).

## 3. TECHNICAL HANDOFF: CSS & JS COMPONENTS

### **CSS: The Command Orb**
```css
.command-orb {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, #D4AF37 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(20px);
    animation: orb-pulse 4s infinite ease-in-out;
}
@keyframes orb-pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 0.8; }
}
```

### **JS: Web Speech API Integration (Stub)**
```javascript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    dispatchDirective(transcript);
};
```

## 4. DESIGN DECISION LOG
*   **Decision:** Move the Orb to the center of the God-View Map.
*   **Rationale:** To emphasize the "Sovereign Center" where all commands emanate and affect the global nodes.
*   **Decision:** Use a 12-column grid instead of flexbox for rigid HUD alignment.
*   **Rationale:** Ensures alignment of sidebar metrics with map features across high-resolution displays.

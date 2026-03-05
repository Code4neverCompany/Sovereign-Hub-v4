# 🎨 DESIGN SPECIFICATION: Swarm Collective Intelligence [SH-1100]
**Project:** Sovereign Hub v4.0  
**Epic:** Swarm Collective Intelligence [SH-1100]  
**Objective:** UI/UX for the "Swarm Pulse" Neural Cross-Link.

---

## 🌌 1. AESTHETIC: Lux Aesthetic 3.0
The Swarm Pulse UI adheres to the high-luxury design language of the 4Never Hive.

*   **Background:** `Void (#0A0A0A)` - Deep, infinite black.
*   **Primary Accent:** `Imperial Gold (#D4AF37)` - Represents knowledge, value, and contributions.
*   **Secondary Accent:** `Electric Cyan (#00FFFF)` - Represents communication, queries, and active signals.
*   **Typography:** Inter / JetBrains Mono (for data snippets).

---

## 🧠 2. COMPONENT: The "Swarm Pulse" Graph
A real-time, force-directed network visualization located in the **Agents Tab**.

### **Nodes**
1.  **The Hive Mind (Central Hub):**
    *   **Visual:** A large, glowing sphere with a slow, radial gradient (Gold to Transparent).
    *   **Behavior:** "Breathes" (subtle scaling animation) when the `swarm_knowledge` table is idle. Pulses sharply when receiving new data.
2.  **Agent Satellites:**
    *   **Visual:** Small circular nodes with agent avatars or initials.
    *   **States:**
        *   `IDLE`: Dim Gold border.
        *   `THINKING`: Pulsing Cyan outer ring.
        *   `SHARING`: Bright Gold glow.

### **Edges (Links)**
*   **Resting State:** Thin, semi-transparent grey lines connecting agents to the Hub.
*   **Insight Pulse (Animation):**
    *   **Contribution:** A Gold "spark" travels from the Agent Node to the Hive Mind.
    *   **Query:** A Cyan "wave" travels from the Hive Mind to the Agent Node.
    *   **Signal Flash:** When `priority = 5`, a Cyan ripple expands from the source agent, momentarily illuminating all connected nodes.

---

## 📄 3. COMPONENT: The "Insight Card"
A non-obtrusive, ephemeral popup for real-time knowledge display.

*   **Placement:** Floats near the agent node currently "pulsing."
*   **Style:**
    *   Background: `rgba(10, 10, 10, 0.85)` with Backdrop Blur (10px).
    *   Border: 1px Solid `#D4AF37`.
    *   Shadow: `0 4px 20px rgba(212, 175, 55, 0.2)`.
*   **Content:**
    ```text
    [AGENT_NAME] → [TYPE]
    "Insight content snippet..."
    ```

---

## 🛠️ 4. HANDOFF: Technical Snippets (D3.js & CSS)

### **HTML Structure**
```html
<div id="swarm-pulse-wrapper" class="lux-container">
    <div id="swarm-pulse-viz"></div>
    <div id="insight-stream-sidebar">
        <h3>Swarm Knowledge</h3>
        <ul id="knowledge-feed"></ul>
    </div>
</div>
```

### **CSS (Lux Aesthetic 3.0)**
```css
#swarm-pulse-wrapper {
    display: flex;
    background: #0A0A0A;
    border: 1px solid #D4AF37;
    height: 500px;
    border-radius: 8px;
    overflow: hidden;
}

#swarm-pulse-viz {
    flex-grow: 1;
    position: relative;
}

.agent-node {
    cursor: pointer;
    transition: filter 0.3s ease;
}

.agent-node:hover {
    filter: drop-shadow(0 0 8px #D4AF37);
}

.pulse-line {
    stroke-dasharray: 5;
    animation: dash 20s linear infinite;
}

@keyframes dash {
    to { stroke-dashoffset: -1000; }
}

.insight-card {
    position: absolute;
    padding: 12px;
    background: rgba(10, 10, 10, 0.9);
    border: 1px solid #D4AF37;
    color: #D4AF37;
    font-size: 0.8rem;
    pointer-events: none;
    z-index: 100;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.5s ease;
}

.insight-card.active {
    opacity: 1;
    transform: translateY(0);
}
```

### **JS Handoff (D3.js Skeleton)**
```javascript
const width = 800, height = 500;
const svg = d3.select("#swarm-pulse-viz").append("svg")
    .attr("width", width).attr("height", height);

// Force Simulation
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

// Trigger Animation (Called via Supabase Realtime)
function triggerPulse(sourceId, targetId, type) {
    const color = type === 'CONTRIBUTION' ? '#D4AF37' : '#00FFFF';
    // Logic to animate a particle along the link path
}
```

---

## 🚦 5. STATUS UPDATE
- [x] Design Document Created.
- [x] Aesthetic Standards Enforced.
- [x] Component Mockups Defined (Graph, Card, Feed).
- [ ] Next Step: Integrate structure into `index.html`.

# [PHASE 3: DESIGN SYSTEM]
# Project: Sovereign Hub v4.0
# Epic: Autonomous Product Forge [SH-1200]
# Objective: Materialize the high-fidelity "Forge" Tab UI/UX.

## 1. DESIGN SPECIFICATION (Lux Aesthetic 3.0)

The "Forge" Tab represents the most advanced layer of the Sovereign Hub—the point of creation. It must feel like an elite industrial laboratory.

- **Background:** Void Black (#0A0A0A).
- **Primary Accent:** Imperial Gold (#D4AF37) for headers and status rings.
- **Secondary Accent:** Violet (#8B5CF6) for active data streams and "Neural Connectivity" lines.
- **Typography:** 
    - Headers: `Cinzel` (Serif, Bold) for a sense of legacy/authority.
    - Body/Data: `JetBrains Mono` for technical precision.
- **Motion:** Subtle rotation of the Incubator ring (60s cycle simulation) and "DNA" strand growth animations.

---

## 2. COMPONENT ARCHITECTURE

### **A. THE INCUBATOR (Circular Progress Timer)**
A dual-concentric ring visualization:
- **Outer Ring:** Shows the 60-minute global sprint progress.
- **Inner Ring:** Divided into 4 segments representing the agent phases:
    1. **Scout (Alex):** [00-10m] - Blue Pulse.
    2. **PRD (Jordan):** [10-25m] - Gold Glow.
    3. **Design (Maya):** [25-40m] - Purple Haze.
    4. **Code (Dev):** [40-60m] - Green Matrix.

### **B. THE DNA STRAND (Temporal Timeline)**
A vertical visualizer using SVGs to draw a "double helix" where each "base pair" is an agent snapshot.
- **Nodes:** Represent discrete outputs (e.g., "PRD Generated", "UI Palette Defined").
- **Interactivity:** Clicking a node reveals the specific markdown/JSON artifact in a side-pane.

### **C. BLUEPRINT GALLERY (Market-Aware Cards)**
A grid of 3D-effect cards showing products currently in the `product_blueprints` table.
- **Market Heat:** A small sparkline showing the "Scout Pulse" interest level.
- **Status Badges:** IDEA -> REFINING -> MOCKUP -> PROTOTYPE.

---

## 3. HTML/CSS SNIPPETS (HANDOFF FOR DEV)

### **CSS Additions (Lux Forge)**
```css
.forge-ring-scout { stroke: #3B82F6; }
.forge-ring-prd { stroke: #D4AF37; }
.forge-ring-design { stroke: #A855F7; }
.forge-ring-code { stroke: #10B981; }

.dna-strand-path { 
    stroke: rgba(139, 92, 246, 0.1); 
    stroke-width: 1.5; 
    fill: none; 
}

@keyframes helix-spin {
    from { stroke-dashoffset: 1000; }
    to { stroke-dashoffset: 0; }
}

.market-heat-spark { 
    filter: drop-shadow(0 0 5px #8B5CF6); 
}
```

### **JS Logic (Mock Timer & Helix)**
```javascript
function updateIncubator(seconds) {
    const total = 3600; // 60 mins
    const progress = (seconds / total) * 100;
    // Update SVG stroke-dasharray...
}

function renderDNAStrand(snapshots) {
    const svg = d3.select('#forge-dna-viz');
    // Generate sine-wave paths for helix...
    // Place nodes at intersections...
}
```

---

## 4. NEXT STEPS (PHASE 4: DEV)
- [ ] Implement `product_blueprints` table in Supabase.
- [ ] Connect `updateIncubator()` to the live `forge_meta` timestamps.
- [ ] Wire the Blueprint Gallery to fetch from the database.

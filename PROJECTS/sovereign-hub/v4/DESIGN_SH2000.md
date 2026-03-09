# 🎨 DESIGN_SH2000: Sovereign Singularity UI/UX

## 🌌 Vision: The Living HUD
The **Neural Repair HUD** is the visual manifestation of the Sovereign Hub's immune system. It transitions the platform from a static interface into a self-healing organism. The design leverages **Lux Aesthetic 3.0** to convey high-fidelity automation and "Divine Engineering."

---

## 🛠️ Component 1: The Singularity Pulse (SVG)
An organic, breathing visualization that acts as the primary health indicator for the Hive.

### 🎨 Visual Specs
- **Healthy State (Nominal):** "Neural Violet" (`#8B5CF6`) with a slow, 0.5Hz breathing pulse.
- **Repair State (Active Fix):** "Repair Red" (`#FF3131`) with a rapid, 4Hz erratic pulse.
- **Form:** Three concentric SVG paths representing neural pathways, rotating at slightly different speeds to create a Moire-like organic effect.

### 🧬 SVG Structure
```html
<div id="singularity-pulse" class="relative w-48 h-48 cursor-pointer group">
    <!-- Outer Glow -->
    <div class="absolute inset-0 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000 pulse-glow"></div>
    
    <svg viewBox="0 0 200 200" class="w-full h-full">
        <!-- Neural Ring 1 -->
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="10 20" class="path-ring-1" />
        <!-- Neural Ring 2 -->
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="40 10" class="path-ring-2" />
        <!-- Core Node -->
        <circle cx="100" cy="100" r="15" fill="currentColor" class="pulse-core shadow-[0_0_30px_currentColor]" />
    </svg>
</div>
```

---

## 📊 Component 2: The Diagnostic Matrix
A minimalist, glowing list that tracks "Neural Events" and their repair status.

### 🎨 Aesthetic Standards
- **Void Background:** `#0A0A0A`
- **Typography:** `JetBrains Mono` (10px)
- **Status Colors:**
    - `NOMINAL`: Violet (`#8B5CF6`)
    - `HEALING`: Repair Red (`#FF3131`)
    - `HARDENED`: Imperial Gold (`#D4AF37`)

---

## 🛠️ Handoff: Implementation Logic

### CSS (Lux Aesthetic 3.0 Extension)
```css
.pulse-healthy { color: #8B5CF6; }
.pulse-repairing { color: #FF3131; }

@keyframes singularity-breathe {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
}

@keyframes singularity-erratic {
    0% { transform: scale(1); }
    25% { transform: scale(1.1) rotate(2deg); }
    50% { transform: scale(0.9) rotate(-2deg); }
    75% { transform: scale(1.15); }
    100% { transform: scale(1); }
}

.path-ring-1 { animation: rotate 20s linear infinite; }
.path-ring-2 { animation: rotate-reverse 15s linear infinite; }
.pulse-core { animation: singularity-breathe 4s ease-in-out infinite; }
.repairing .pulse-core { animation: singularity-erratic 0.25s infinite; }
```

### JS (NeuralRepair Hook)
```javascript
function updateSingularityState(status) {
    const pulse = document.getElementById('singularity-pulse');
    if (status === 'REPAIRING') {
        pulse.classList.add('repairing', 'pulse-repairing');
        pulse.classList.remove('pulse-healthy');
    } else {
        pulse.classList.remove('repairing', 'pulse-repairing');
        pulse.classList.add('pulse-healthy');
    }
}
```

---

## 📅 Status: DESIGN COMPLETED
**Next Step:** Hot-patching `index.html` with the Singularity HUD.

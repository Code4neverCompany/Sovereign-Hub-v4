# 🎨 DESIGN_SH700: Analytics Dashboard (Lux Aesthetic 3.0)

## 1. VISION: Neural Throughput HUD
The Analytics Dashboard is designed as a high-fidelity "Mission Control" for the Sovereign Hub. It prioritizes real-time visibility into costs (tokens), performance (latency), and reliability (success rates) while maintaining the **Lux Aesthetic 3.0** standards.

**Aesthetic Core:**
- **Background:** Void Black (#0A0A0A)
- **Primary Accent:** Imperial Gold (#D4AF37) - Used for high-value metrics and headers.
- **Secondary Accent:** Cyber Violet (#8B5CF6) - Used for system status and active uplinks.
- **Library:** ApexCharts (CDN-based, SVG rendering for crispness).

---

## 2. COMPONENT: Stats Cards (Top Row)
Four specialized "Neural Pulse" cards providing instant situational awareness.

```html
<!-- Stats Card Template -->
<div class="glass-card glowing-border p-6 h-40 flex flex-col justify-between animate-stagger">
    <div>
        <h3 class="text-gold/40 text-[10px] font-bold uppercase tracking-widest">[TITLE]</h3>
        <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-bold text-white text-gold-glow" id="[ID]">[VALUE]</span>
            <span class="text-[10px] text-[#8B5CF6]/60 font-mono uppercase">[UNIT]</span>
        </div>
    </div>
    <div class="flex items-center gap-2">
        <div class="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-gold/40" style="width: 70%"></div>
        </div>
        <span class="text-[9px] text-white/20 font-mono">NOMINAL</span>
    </div>
</div>
```

---

## 3. COMPONENT: Chart Grid (Middle & Bottom)
Utilizing a 12-column CSS grid for balanced data visualization.

### A. Primary: Neural Throughput (Area Chart)
- **Color:** Gradient from Imperial Gold to Void.
- **Interaction:** Custom tooltips with Cyber Violet borders.

### B. Secondary: Distribution & Latency
- **Success Rate (Donut):** Emerald (Success) | Crimson (Error) | Gold (Pending).
- **Agent Performance (Bar):** Comparative latency analysis per agent.

---

## 4. APEXCHARTS CONFIGURATION (Lux 3.0 Theme)
JS configuration snippet for developers to integrate.

```javascript
const LUX_CHART_OPTIONS = {
    chart: {
        foreColor: 'rgba(212, 175, 55, 0.4)', // Faded Gold for axes
        fontFamily: 'JetBrains Mono, monospace',
        toolbar: { show: false },
        background: 'transparent'
    },
    colors: ['#D4AF37', '#8B5CF6', '#10B981'],
    grid: {
        borderColor: 'rgba(255, 255, 255, 0.05)',
        strokeDashArray: 4
    },
    tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' },
        marker: { show: true }
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.05,
            stops: [0, 90, 100]
        }
    }
};
```

---

## 5. HANDOFF: Dev Integration [Phase 4]
- **HTML Container:** Use `<section id="analytics-tab">`.
- **Initialization:** Trigger `initAnalytics()` on tab switch.
- **Supabase Hooks:**
    - `agent_metrics` -> Success Rate & Latency Charts.
    - `token_usage` -> Throughput & Cost Cards.
- **Real-time:** Subscribe to `agent_metrics` for "Active Subagents" counter.

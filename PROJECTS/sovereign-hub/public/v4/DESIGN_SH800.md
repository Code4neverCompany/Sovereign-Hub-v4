# 🔱 DESIGN_SH800: Dynamic Model-Switching & Savings HUD
**Project:** Sovereign Hub v4.0 (Slim-Stack)  
**Epic:** Strategic Optimization [SH-800]  
**Aesthetic:** Lux Aesthetic 3.0 (Void Black, Imperial Gold, Cyber Violet)

---

## 1. UI Components: Nexus Dispatcher (Manual Engine Selector)

The manual engine selector is integrated into the Nexus Dispatcher modal. It allows users to toggle between **Auto-Optimize** (Middleware Logic) and **Force Mode** (Specific Model).

### HTML Snippet (Modal Update)
```html
<!-- Inside #nexus-form -->
<div class="space-y-4">
    <div class="flex items-center justify-between ml-1">
        <label class="text-[10px] font-bold text-gold/40 uppercase tracking-widest">Routing Strategy</label>
        <div class="flex items-center gap-2">
            <span id="strategy-label" class="text-[9px] font-mono text-[#8B5CF6] uppercase">Auto-Optimize</span>
            <button type="button" onclick="toggleRoutingStrategy()" class="w-8 h-4 bg-white/5 border border-white/10 rounded-full relative transition-all">
                <div id="strategy-toggle-pip" class="absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-[#8B5CF6] rounded-full transition-all shadow-[0_0_8px_#8B5CF6]"></div>
            </button>
        </div>
    </div>

    <div id="engine-selector-container" class="grid grid-cols-2 gap-4 opacity-50 pointer-events-none transition-all duration-300">
        <!-- Gemini Option -->
        <label class="relative cursor-pointer group">
            <input type="radio" name="engine-force" value="gemini-3-flash" class="hidden peer">
            <div class="glass-card p-3 border-white/5 group-hover:border-gold/30 peer-checked:border-gold peer-checked:bg-gold/5 transition-all">
                <div class="flex items-center gap-2">
                    <span class="text-lg">⚡</span>
                    <div>
                        <p class="text-[10px] font-bold text-white uppercase tracking-tighter">Gemini Flash</p>
                        <p class="text-[8px] text-gold/40 font-mono">T1/T2 UTILITY</p>
                    </div>
                </div>
            </div>
        </label>
        <!-- Claude Option -->
        <label class="relative cursor-pointer group">
            <input type="radio" name="engine-force" value="claude-opus-4-6" class="hidden peer">
            <div class="glass-card p-3 border-white/5 group-hover:border-[#8B5CF6]/30 peer-checked:border-[#8B5CF6] peer-checked:bg-[#8B5CF6]/5 transition-all">
                <div class="flex items-center gap-2">
                    <span class="text-lg">🧠</span>
                    <div>
                        <p class="text-[10px] font-bold text-white uppercase tracking-tighter">Claude Opus</p>
                        <p class="text-[8px] text-[#8B5CF6]/40 font-mono">T3/T4 FRONTIER</p>
                    </div>
                </div>
            </div>
        </label>
    </div>
</div>
```

### JS Logic (Switching Middleware)
```javascript
let isAutoOptimize = true;

function toggleRoutingStrategy() {
    isAutoOptimize = !isAutoOptimize;
    const pip = document.getElementById('strategy-toggle-pip');
    const label = document.getElementById('strategy-label');
    const container = document.getElementById('engine-selector-container');
    
    if (isAutoOptimize) {
        pip.style.left = '2px';
        pip.classList.replace('bg-gold', 'bg-[#8B5CF6]');
        pip.style.boxShadow = '0 0 8px #8B5CF6';
        label.innerText = 'Auto-Optimize';
        label.className = 'text-[9px] font-mono text-[#8B5CF6] uppercase';
        container.classList.add('opacity-50', 'pointer-events-none');
    } else {
        pip.style.left = '18px';
        pip.classList.replace('bg-[#8B5CF6]', 'bg-gold');
        pip.style.boxShadow = '0 0 8px #D4AF37';
        label.innerText = 'Manual Override';
        label.className = 'text-[9px] font-mono text-gold uppercase';
        container.classList.remove('opacity-50', 'pointer-events-none');
    }
}
```

---

## 2. HUD: Strategic Savings Gauge (Analytics Tab)

This widget provides real-time ROI tracking of the engine-switch logic.

### HTML Snippet (Analytics Tab)
```html
<div class="glass-card glowing-border p-6 h-64 flex flex-col justify-between animate-stagger" style="animation-delay: 0.1s;">
    <div class="flex justify-between items-start">
        <div>
            <h3 class="text-gold/40 text-[10px] font-bold uppercase tracking-widest">Economic Efficiency</h3>
            <div class="mt-2 flex items-baseline gap-2">
                <span class="text-4xl font-bold text-white text-gold-glow" id="stat-savings-pct">0%</span>
                <span class="text-[10px] text-[#8B5CF6]/60 font-mono uppercase">ROI Delta</span>
            </div>
        </div>
        <div class="text-right">
            <p class="text-[10px] text-white/20 uppercase font-mono">Total Saved</p>
            <p class="text-lg font-bold text-emerald-400" id="stat-dollars-saved">$0.00</p>
        </div>
    </div>
    <div id="savingsGaugeChart" class="h-32 -mt-4"></div>
</div>
```

---

## 3. CHARTING: ApexCharts Configuration

### Savings vs. Potential Cost (Radial Gauge)
```javascript
const savingsGaugeOptions = {
    series: [0], // Dynamic
    chart: { height: 200, type: 'radialBar', sparkline: { enabled: true } },
    plotOptions: {
        radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: { background: "rgba(255, 255, 255, 0.05)", strokeWidth: '97%' },
            dataLabels: {
                name: { show: false },
                value: { offsetY: -2, fontSize: '22px', color: '#D4AF37', fontWeight: 'bold' }
            }
        }
    },
    grid: { padding: { top: -10 } },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            type: 'horizontal',
            gradientToColors: ['#8B5CF6'],
            stops: [0, 100]
        }
    },
    stroke: { lineCap: 'butt' },
    labels: ['Efficiency'],
};
```

---

## 4. METRICS CALCULATION (Data Handoff)
The following logic should be implemented in `dataTransformer.js` to feed the HUD.

```javascript
/**
 * Calculates theoretical savings vs. baseline (All-Opus).
 * Flash Price: $0.10 / 1M tokens (avg)
 * Opus Price: $15.00 / 1M tokens (avg)
 */
function calculateSavings(tokenLogs) {
    let actualCost = 0;
    let baselineCost = 0;
    
    tokenLogs.forEach(log => {
        const total = (log.total_tokens || 0) / 1000000;
        baselineCost += total * 15.00; // Hypothetical Opus Cost
        
        if (log.model_id.includes('flash')) {
            actualCost += total * 0.10;
        } else {
            actualCost += total * 15.00;
        }
    });

    const savings = baselineCost - actualCost;
    const efficiency = baselineCost > 0 ? (savings / baselineCost) * 100 : 0;
    
    return {
        dollars: savings.toFixed(2),
        percentage: Math.round(efficiency)
    };
}
```

---
**Status:** Design Materialized. Awaiting Handoff to Phase 4 (Dev).

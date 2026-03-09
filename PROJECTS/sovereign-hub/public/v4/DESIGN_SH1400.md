# [PHASE 3: DESIGN SPECIFICATION]
# Project: Sovereign Hub v4.0
# Epic: Market Deployment & Revenue HUD [SH-1400]
# Status: DESIGN_COMPLETE -> HANDOFF_READY

## 1. VISION: THE ECONOMIC HUD
The Revenue HUD is the definitive financial dashboard for the Sovereign. It transitions the Hub from a "Build" tool into a "Wealth" tool. By visualizing projected and real-world traction, it provides the strategic leverage needed to decide which prototypes to scale and which to kill.

---

## 2. LUX AESTHETIC 3.0: DESIGN TOKENS
- **Void Black:** `#0A0A0A` (Background & Deep Shadows)
- **Imperial Gold:** `#D4AF37` (Primary Wealth & Victory Indicators)
- **Neon Violet:** `#8B5CF6` (Data Flow & Traction Signals)
- **Gradient - Funnel:** `linear-gradient(180deg, #8B5CF6 0%, #D4AF37 100%)`
- **Typography:** Cinzel (Titles), Inter (UI), JetBrains Mono (Metrics)

---

## 3. UI COMPONENTS

### **A. Economic Mastery Cards (Top Row)**
High-impact metric cards displaying core SaaS/Product performance:
- **Projected MRR:** Gold-glow primary figure.
- **LTV (Lifetime Value):** Average value per sovereign subscriber.
- **CAC (Cost Per Acquisition):** Calculated efficiency of simulated/real ad spend.
- **ROI (Return on Investment):** The ultimate performance delta.

### **B. The Conversion Funnel (Center Left)**
A vertical, glowing trapezoidal funnel visual:
1. **Visits (Violet):** Top-level traffic (Simulated/Real).
2. **Clicks (Violet-Gold):** High-intent interaction.
3. **Signups (Gold):** Lead generation.
4. **Revenue (Imperial Gold):** Verified conversions.
- *Interaction:* Hovering over levels shows the % drop-off between stages.

### **C. PMF Speedometer (Center Right)**
A "Product-Market Fit" gauge (0-100%):
- **0-30%:** *Red-Zone* (Concept Failure / High Friction).
- **30-70%:** *Violet-Zone* (Iterating / Growing Signal).
- **70-100%:** *Gold-Zone* (Product-Market Fit Achieved).
- *Logic:* (Conversions / Visits) / Industry_Benchmark.

### **D. Deployment Manifest Table (Bottom)**
A list of all live product prototypes:
- **Product Name:** Slug and direct link.
- **Provider:** Vercel / Cloudflare / Custom.
- **Status:** `LIVE` (Green Pulse) / `DEPLOYING` (Violet Spin) / `FAILED` (Red).
- **Control:** `RE-DEPLOY` | `TEARDOWN`.

---

## 4. TECHNICAL HANDOFF (FOR DEV)

### **Database Integration:**
- Query `deployment_manifests` for the deployment list.
- Query `market_metrics` for real-time traffic/conversion counts.
- Calculate MRR: `SUM(value)` where `event_type = 'REVENUE'`.

### **CSS Snippets (Lux 3.0):**
```css
/* Funnel Gradient Level */
.funnel-level-visits { background: rgba(139, 92, 246, 0.1); border-left: 2px solid #8B5CF6; }
.funnel-level-revenue { background: rgba(212, 175, 55, 0.1); border-left: 2px solid #D4AF37; }

/* PMF Gauge Animation */
@keyframes pmf-pulse {
  0% { filter: drop-shadow(0 0 5px #D4AF37); }
  100% { filter: drop-shadow(0 0 15px #D4AF37); }
}
```

### **JS Logic for Funnel Scaling:**
```javascript
function updateFunnel(data) {
  const max = data.visits;
  const levels = ['visits', 'clicks', 'signups', 'revenue'];
  levels.forEach(lvl => {
    const pct = (data[lvl] / max) * 100;
    document.getElementById(`funnel-${lvl}`).style.width = `${pct}%`;
  });
}
```

---

## 5. DESIGNER NOTES (MAYA)
The "Revenue" tab should feel like a High-Net-Worth banking application mixed with a Cyberpunk Command Center. Every dollar shown in Gold should glow with prestige. The Funnel is the heart of the tab—it must look like a liquid energy stream turning Violet traffic into Gold wealth.

**Next Step:** Dev to wire `deployment_status` and `market_metrics` to the visual components.

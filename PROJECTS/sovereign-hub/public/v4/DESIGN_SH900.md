# DESIGN_SH900: Global HUD Expansion (Infrastructure Tab)
**Project:** Sovereign Hub v4.0 (Slim-Stack)  
**Designer:** Maya [UX/Designer]  
**Aesthetic:** Lux Aesthetic 3.0 (Void / Imperial Gold / Electric Violet)

## 1. UI/UX Strategy
The "Infrastructure" tab provides a spatial and operational command center for the 4Never Hive's decentralized node fleet. The design focuses on high-contrast information density and "Cyber-Lux" visual cues.

## 2. Visual Palette (Lux 3.0)
| Element | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Void** | `#0A0A0A` | Primary Background / Deep Space |
| **Imperial Gold** | `#D4AF37` | Primary Borders / Connection Lines / Highlights |
| **Electric Violet** | `#8B5CF6` | Active Pulses / Status Indicators / Real-time Data |
| **Stellar White** | `#E2E8F0` | Typography (Primary) |
| **Obsidian** | `rgba(255,255,255,0.03)` | Card Backgrounds |

## 3. Component Specifications

### A. Global Map (Leaflet.js)
*   **Tile Layer:** `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png` (CartoDB Dark Matter).
*   **Customization:**
    *   Map container background: `#0A0A0A`.
    *   Node Markers: Custom CSS DivIcons with a Violet pulse animation.
    *   Lines: Polyline with Gold (`#D4AF37`) stroke and subtle glow.

### B. Node Health Cards
*   **Structure:**
    *   **Header:** Node Name + Region Tag.
    *   **Stats Grid:**
        *   Tailscale IP (Monospace, clickable to copy).
        *   Uptime (Relative string).
    *   **Gauges:** Micro-progress bars for CPU and RAM using Violet for fill.
    *   **Footer:** "Last Seen" timestamp with relative aging logic.

### C. Interactions
*   **Tab Switching:** Smooth fade-in transition (Standardized in v4).
*   **Map Hover:** Reveal mini-overlay with detailed metrics (Disk, Temp).
*   **IP Copy:** Visual feedback toast or button state change.

## 4. Technical Handoff [Phase 4]

### Supabase Hook:
```javascript
// Listener for infrastructure updates
const infraSubscription = supabaseClient
    .channel('public:node_status')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'node_status' }, payload => {
        updateMapMarker(payload.new);
        updateNodeCard(payload.new);
    })
    .subscribe();
```

### Map Initializer:
```javascript
const map = L.map('infra-map', { zoomControl: false }).setView([20, 0], 2);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB'
}).addTo(map);
```

### CSS Pulse (Violet):
```css
@keyframes pulse-violet {
    0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
}
.node-pulse {
    width: 12px; height: 12px;
    background: #8B5CF6;
    border-radius: 50%;
    animation: pulse-violet 2s infinite;
}
```

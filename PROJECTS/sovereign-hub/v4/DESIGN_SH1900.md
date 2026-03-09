# [PHASE 3: DESIGN] Sovereign Persistence Warden [SH-1900]
## UI/UX Specification: Cloud Persistence HUD

### 1. Aesthetic Framework: Lux Aesthetic 3.0
- **Void (#0A0A0A)**: Background for the widget container and deep contrast areas.
- **Imperial Gold (#D4AF37)**: Primary accents for "Hardened" status and finalized syncs.
- **Violet (#8B5CF6)**: Dynamic accents for "Syncing" pulses and active connectivity.

---

### 2. UI Components

#### A. Persistence Pulse (Sync Ring)
A high-fidelity SVG component located at the top-left of the HUD.
- **Dormant**: Thin, dim gold circle.
- **Syncing**: Rotating violet ring with a variable `stroke-dashoffset` to simulate data flow.
- **Hardened**: Solid gold ring with a soft outer glow.
- **Warning**: Pulsing crimson ring if a conflict or disconnect is detected.

#### B. Cloud Health Widget
A minimalist summary panel providing immediate system state.
- **Connectivity**: Real-time GitHub API latency indicator (ms).
- **Pulse Badge**: Animated "HEARTBEAT" text that blinks when the Warden scans Target Zones.
- **Uncommitted Counter**: A violet badge showing the total number of uncommitted files.

#### C. Repo Matrix
A grid-based component showcasing the distributed state of the Sovereign infrastructure.
- **Columns**: Repo Name, Status (Hardened/Syncing), and Last Sync (Relative Time).
- **Interaction**: Hovering over a row reveals the last 3 commit messages in a minimalist tooltip.

---

### 3. Engineering Handoff: Code Snippets

#### HTML Structure (to be injected into `/v4/index.html` Command Tab)
```html
<div class="glass-card p-6 flex flex-col col-span-2 border-[#8B5CF6]/10" id="persistence-hud">
    <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
            <!-- Sync Ring SVG -->
            <div class="relative w-12 h-12">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(212, 175, 55, 0.05)" stroke-width="4" />
                    <circle id="persistence-ring" cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" stroke-width="5" stroke-dasharray="283" stroke-dashoffset="0" stroke-linecap="round" class="transition-all duration-1000" />
                </svg>
                <div id="persistence-icon" class="absolute inset-0 flex items-center justify-center text-[10px]">🔒</div>
            </div>
            <div>
                <h3 class="text-gold/80 font-bold uppercase text-[10px] tracking-[0.3em]">Persistence_Warden // Cloud_Health</h3>
                <p id="warden-pulse-status" class="text-[8px] font-mono text-[#8B5CF6]/60 uppercase tracking-widest mt-1">Status: Hardened</p>
            </div>
        </div>
        <div class="flex gap-6 items-center">
            <div class="flex flex-col items-end">
                <span class="text-[8px] text-white/20 uppercase font-mono">Uncommitted</span>
                <span id="uncommitted-count" class="text-xs font-bold text-[#8B5CF6]">0 Files</span>
            </div>
            <button id="force-sync-btn" class="px-3 py-1.5 bg-gold/5 border border-gold/20 text-gold text-[8px] font-bold uppercase rounded hover:bg-gold/10 transition-all">Force_Sync</button>
        </div>
    </div>
    
    <!-- Repo Matrix -->
    <div class="flex-1 overflow-y-auto custom-scrollbar">
        <table class="w-full text-left">
            <thead class="text-[8px] font-mono text-white/20 uppercase border-b border-white/5">
                <tr>
                    <th class="pb-2">Repository</th>
                    <th class="pb-2">Status</th>
                    <th class="pb-2 text-right">Last_Pulse</th>
                </tr>
            </thead>
            <tbody id="repo-matrix-body" class="text-[10px] font-mono">
                <!-- Injected by PersistenceWarden.js -->
            </tbody>
        </table>
    </div>
</div>
```

#### CSS Integration (Add to `style.css` or `index.html` styles)
```css
@keyframes sync-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.syncing-ring {
    animation: sync-rotate 2s linear infinite;
    stroke: #8B5CF6 !important;
    stroke-dasharray: 70 213 !important;
}

.warning-ring {
    stroke: #EF4444 !important;
    animation: pulse-red 1.5s infinite;
}

@keyframes pulse-red {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
}
```

#### JS Middleware: `PersistenceWarden.js` (Core Logic for Dev Handoff)
```javascript
class PersistenceWarden {
    constructor(supabase) {
        this.supabase = supabase;
        this.zones = ['/v4/', '/planning/', '/tmp/prototypes/'];
    }

    async updateHUD() {
        const { data: repos } = await this.supabase.from('persistence_repos').select('*');
        const matrixBody = document.getElementById('repo-matrix-body');
        const ring = document.getElementById('persistence-ring');
        
        if (!repos || !matrixBody) return;

        matrixBody.innerHTML = repos.map(repo => `
            <tr class="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                <td class="py-3 text-white/60 font-bold">${repo.local_path.split('/').filter(Boolean).pop()}</td>
                <td class="py-3">
                    <span class="px-1.5 py-0.5 rounded text-[8px] border ${this.getStatusStyle(repo.health_status)}">
                        ${repo.health_status}
                    </span>
                </td>
                <td class="py-3 text-right text-white/20">${this.formatRelativeTime(repo.last_sync)}</td>
            </tr>
        `).join('');

        // Update Global Ring
        const isSyncing = repos.some(r => r.health_status === 'SYNCING');
        const hasWarning = repos.some(r => r.health_status === 'RED');
        
        ring.className = isSyncing ? 'syncing-ring' : (hasWarning ? 'warning-ring' : '');
    }

    getStatusStyle(status) {
        if (status === 'GREEN') return 'border-emerald-500/20 text-emerald-400';
        if (status === 'YELLOW') return 'border-gold/20 text-gold';
        if (status === 'RED') return 'border-rose-500/20 text-rose-500';
        return 'border-white/10 text-white/40';
    }

    formatRelativeTime(ts) {
        // Implementation for relative time...
    }
}
```

---

### 4. Implementation Priorities (Phase 4)
1. **Real-time Subscriptions**: Wire `updateHUD()` to Supabase `persistence_repos` table changes.
2. **Pulse Animation**: Trigger the "Syncing" ring state when the Warden agent initiates a Git push.
3. **Safety Gate**: Implement the "Force Sync" confirm modal to bypass Sentinel (Sam) status.

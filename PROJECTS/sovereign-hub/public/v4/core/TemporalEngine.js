/**
 * 🕰️ TemporalEngine.js [SH-1000]
 * Total Persistence & State Reconstitution Logic
 */
export class TemporalEngine {
    constructor(supabase) {
        this.supabase = supabase;
        this.isScrubbing = false;
        this.snapshots = [];
        this.currentIndex = -1;
    }

    async init() {
        console.log("🕰️ TemporalEngine: Initializing Time-Machine Logic...");
        this.setupUI();
        await this.loadSnapshots();
    }

    setupUI() {
        this.container = document.getElementById('chrono-viewport');
        this.handle = document.getElementById('scrubber-handle');
        this.track = document.getElementById('scrubber-track');
        
        if (this.track) {
            this.track.addEventListener('mousedown', (e) => this.startScrubbing(e));
            window.addEventListener('mousemove', (e) => this.scrub(e));
            window.addEventListener('mouseup', () => this.stopScrubbing());
        }
    }

    async loadSnapshots() {
        const { data } = await this.supabase
            .from('neural_snapshots')
            .select('*')
            .order('step_index', { ascending: true })
            .limit(100);
        
        if (data) {
            this.snapshots = data;
            this.renderHeatMarkers();
        }
    }

    renderHeatMarkers() {
        const track = document.getElementById('scrubber-track');
        if (!track || this.snapshots.length === 0) return;
        
        const max = this.snapshots[this.snapshots.length - 1].step_index;
        this.snapshots.forEach(s => {
            const marker = document.createElement('div');
            marker.className = 'heat-marker';
            marker.style.left = (s.step_index / max * 100) + '%';
            track.appendChild(marker);
        });
    }

    startScrubbing(e) { this.isScrubbing = true; this.scrub(e); document.body.classList.add('temporal-active'); }
    stopScrubbing() { this.isScrubbing = false; document.body.classList.remove('temporal-active'); }

    scrub(e) {
        if (!this.isScrubbing || !this.track) return;
        const rect = this.track.getBoundingClientRect();
        const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
        const percent = x / rect.width;
        
        if (this.handle) this.handle.style.left = (percent * 100) + '%';
        this.reconstituteState(percent);
    }

    reconstituteState(percent) {
        if (this.snapshots.length === 0) return;
        const index = Math.floor(percent * (this.snapshots.length - 1));
        if (index === this.currentIndex) return;
        
        this.currentIndex = index;
        const snap = this.snapshots[index];
        
        // Broadcast state shift to other components
        window.dispatchEvent(new CustomEvent('temporal-shift', { detail: snap }));
        
        // Update Intel Stream locally for visual feedback
        const feed = document.getElementById('dashboard-activity-feed');
        if (feed) {
            feed.innerHTML = `<div class="text-gold font-black italic">>> TEMPORAL_RECONSTITUTION: STEP_${snap.step_index} ACTIVE</div>` + feed.innerHTML;
        }
    }
}

    /**
     * SH-1000.5: Logic for Ghost-Writer Reconstitution
     */
    updateDiffViewer(snap) {
        const preEl = document.getElementById('diff-pre');
        const postEl = document.getElementById('diff-post');
        const thoughtEl = document.getElementById('thought-stream-replay');
        const stepCounter = document.getElementById('current-step');

        if (stepCounter) stepCounter.innerText = snap.step_index;

        if (thoughtEl && snap.payload) {
            thoughtEl.innerHTML = `<div class="animate-in fade-in slide-in-from-top-2">
                <span class="text-gold font-black uppercase text-[10px] block mb-2">Neural_Inference:</span>
                ${snap.payload.thought || snap.message || "Analyzing task parameters..."}
            </div>`;
        }

        if (preEl && postEl && snap.workspace_diff) {
            preEl.innerHTML = snap.workspace_diff.pre || "// No baseline change.";
            postEl.innerHTML = snap.workspace_diff.post || "// No target change.";
            
            // Highlight changes (Simple line-based mock)
            if (snap.workspace_diff.post) {
                postEl.innerHTML = snap.workspace_diff.post.split('\n').map(line => 
                    line.includes('+') ? `<div class="diff-add">${line}</div>` : 
                    line.includes('-') ? `<div class="diff-del">${line}</div>` : line
                ).join('\n');
            }
        }
    }

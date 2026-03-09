# DESIGN_SH1600: Project Nexus / File Explorer

## 1. Visual Identity & Aesthetic Standards
- **Standard:** Lux Aesthetic 3.0
- **Primary Color:** Void `#0A0A0A` (Background & Deep Cards)
- **Primary Accent:** Gold `#D4AF37` (Active states, progress, headings)
- **Secondary Accent:** Violet `#8B5CF6` (Code, technical details, network status)
- **Glassmorphism:** `backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.02);`

## 2. Nexus Explorer UI (Tab: Explorer)
The Explorer tab is designed to be the "Central Nervous System" of the Sovereign Hub.

### **Sidebar: Sublime-Inspired Directory Tree**
- **Materialization:** Vertical list with hierarchical indentation (1rem per level).
- **Icon Set:**
    - `.md`: Gold document icon (`text-gold`).
    - `.js`: Violet code icon (`text-[#8B5CF6]`).
    - `.json / .yaml`: Amber data icon (`text-amber-400`).
    - `Folders`: Standard folder icon with violet-glow on hover.
- **Micro-interactions:** 
    - Hover: `background: rgba(212, 175, 55, 0.05);`
    - Selection: Left-border gold indicator (2px solid #D4AF37).

### **Main Pane: Dual-Pane Sovereign HUD Markdown Editor**
- **Left Pane (Edit):** Monaco Editor or JetBrains-styled textarea with syntax highlighting.
- **Right Pane (Preview):** Live Markdown render using `marked.js`.
- **Logic:** Auto-save every 30 seconds to the `temporal_events` (as a draft) and the actual FS bridge upon manual save.

## 3. Scout Queue: The Discovery Gate
A specialized section within the Explorer to approve SH-1200 findings.

### **Component: Discovery Cards**
- **Layout:** Masonry or Horizontal scroll of "Opportunity Cards".
- **Data Points:** Niche Name, Market Signal (0-100), Suggested Lead Agent.
- **Authoritative Actions:**
    - `[APPROVE]`: Green (Emerald-400) border, triggers Folder Creation + Forge PRD step.
    - `[DISCARD]`: Red (Rose-500) border, archives the finding.

## 4. Technical Implementation (Handoff to Dev)

### **HTML Structure (`index.html`)**
```html
<section id="explorer-tab" class="tab-panel">
    <div class="max-w-[1920px] mx-auto grid grid-cols-12 gap-6 h-[calc(100vh-160px)]">
        <!-- Sidebar: Nexus Tree -->
        <aside class="col-span-3 glass-card flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <h3 class="text-gold/60 font-bold uppercase text-[10px] tracking-[0.3em]">Nexus_Tree // Root</h3>
                <button class="text-[9px] text-white/20 hover:text-white transition-colors">↻ REFRESH</button>
            </div>
            <div id="nexus-file-tree" class="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1">
                <!-- Tree items injected by NexusController.js -->
            </div>
        </aside>

        <!-- Main: HUD Editor -->
        <div class="col-span-9 flex flex-col gap-6 overflow-hidden">
            <div class="glass-card flex-1 flex flex-col overflow-hidden">
                <div class="px-6 py-3 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <span id="active-file-icon" class="text-gold">📄</span>
                        <span id="active-file-path" class="text-[11px] font-mono text-white/40 uppercase">/PROJECTS/sovereign-hub/v4/index.html</span>
                    </div>
                    <div class="flex gap-4">
                        <button class="px-3 py-1 bg-gold/10 border border-gold/20 text-gold text-[9px] font-bold uppercase rounded">Save_Changes</button>
                        <button class="px-3 py-1 bg-white/5 border border-white/10 text-white/40 text-[9px] font-bold uppercase rounded hover:text-white transition-colors">History_Trace</button>
                    </div>
                </div>
                <div class="flex-1 grid grid-cols-2 divide-x divide-white/5 overflow-hidden">
                    <div id="editor-pane" class="bg-black/20 p-6 font-mono text-[12px] leading-relaxed text-[#8B5CF6]/80 overflow-y-auto focus:outline-none" contenteditable="true">
                        <!-- Raw content -->
                    </div>
                    <div id="preview-pane" class="p-8 prose prose-invert prose-sm max-w-none overflow-y-auto bg-void/40">
                        <!-- Rendered Markdown -->
                    </div>
                </div>
            </div>

            <!-- Discovery Gate: Scout Queue -->
            <div class="h-48 glass-card p-6 flex flex-col gap-4 overflow-hidden border-[#8B5CF6]/10">
                <h3 class="text-[#8B5CF6]/60 font-bold uppercase text-[9px] tracking-[0.3em]">Discovery_Gate // Scout_Queue</h3>
                <div id="scout-queue-strip" class="flex-1 flex gap-6 overflow-x-auto pb-2">
                    <!-- Discovery Cards -->
                </div>
            </div>
        </div>
    </div>
</section>
```

### **JS Logic (`core/NexusController.js`)**
```javascript
class NexusController {
    constructor(supabase) {
        this.supabase = supabase;
        this.currentPath = '/';
    }

    async init() {
        await this.loadTree();
        this.setupEventListeners();
    }

    async loadTree() {
        // Fetch from SovereignGateway /api/files (SH-1600-E)
    }

    async openFile(path) {
        // Fetch content and populate HUD Editor (SH-1600-F)
    }

    renderTree(data, container) {
        // Logic for Sublime-Inspired vertical tree
    }
}
```

## 5. Status Update
- [x] Design materialization for Explorer Tab completed.
- [x] Lux Aesthetic 3.0 enforced.
- [x] Sublime-Inspired tree structure defined.
- [x] Dual-pane Editor HUD mockup provided.
- [x] Discovery Gate / Scout Queue integrated.
- [x] Handoff snippets prepared for Phase 4 implementation.

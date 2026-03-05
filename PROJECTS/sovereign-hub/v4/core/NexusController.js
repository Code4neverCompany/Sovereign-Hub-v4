/**
 * Nexus Controller (SH-1600)
 * Logic for the Sublime-Inspired File Explorer and HUD Editor.
 * Integrating Virtual FS Bridge with UI.
 */
class NexusController {
    constructor(supabase) {
        this.supabase = supabase;
        this.currentPath = null;
        this.isDirty = false;
        this.treeContainer = document.getElementById('nexus-file-tree');
        this.editorPane = document.getElementById('editor-pane');
        this.previewPane = document.getElementById('preview-pane');
        this.activePathLabel = document.getElementById('active-file-path');
        this.activeIcon = document.getElementById('active-file-icon');
        this.scoutQueue = document.getElementById('scout-queue-strip');
        this.saveBtn = document.getElementById('save-changes-btn');
    }

    async init() {
        console.log("Nexus_Controller: Initializing Virtual FS Bridge...");
        this.setupEventListeners();
        await this.loadTree();
        await this.loadScoutQueue();
    }

    setupEventListeners() {
        // [SH-1600-F] Save Button Wire
        if (this.saveBtn) {
            this.saveBtn.onclick = () => this.saveCurrentFile();
        }

        // [SH-1600-F] Editor Sync with Preview
        if (this.editorPane) {
            this.editorPane.oninput = () => {
                this.isDirty = true;
                this.renderPreview();
            };
        }

        // [SH-1600-S] Global Refresh
        const refreshBtn = document.getElementById('nexus-refresh-btn');
        if (refreshBtn) {
            refreshBtn.onclick = () => {
                this.loadTree();
                this.loadScoutQueue();
            };
        }
    }

    /**
     * Fetch hierarchical JSON tree from Gateway
     */
    async loadTree() {
        if (!this.treeContainer) return;
        this.treeContainer.innerHTML = `<div class="p-4 text-cyan/40 animate-pulse">Scanning_FileSystem...</div>`;

        try {
            // [MOCK_BRIDGE] In Phase 4, the Gateway handles this via FileService.js
            // Fetch from local node proxy for demonstration
            const response = await fetch('/api/nexus/scan');
            const tree = await response.json();
            
            this.renderTree(tree, this.treeContainer);
        } catch (err) {
            console.error("Nexus_Explorer_Load_Error:", err);
            this.treeContainer.innerHTML = `<div class="p-4 text-rose-500/60 font-mono text-[9px] uppercase">Uplink_Failed: No_Local_FS_Bridge_Detected</div>`;
            
            // FALLBACK: Load a dummy tree for design verification
            this.renderTree([
                { name: 'PROJECTS', type: 'directory', path: 'PROJECTS', children: [
                    { name: 'sovereign-hub', type: 'directory', path: 'PROJECTS/sovereign-hub', children: [
                        { name: 'stories.md', type: 'file', path: 'PROJECTS/sovereign-hub/stories.md' },
                        { name: 'ARCHITECTURE_SH1600.md', type: 'file', path: 'PROJECTS/sovereign-hub/ARCHITECTURE_SH1600.md' }
                    ]}
                ]},
                { name: 'alex', type: 'directory', path: 'alex', children: [{ name: 'MEMORY.md', type: 'file', path: 'alex/MEMORY.md' }] }
            ], this.treeContainer);
        }
    }

    /**
     * Recursive Tree Rendering (Sublime Style)
     */
    renderTree(nodes, container, level = 0) {
        if (level === 0) container.innerHTML = '';

        nodes.forEach(node => {
            const el = document.createElement('div');
            el.className = `group flex flex-col`;
            
            const paddingLeft = `${level * 0.75}rem`;
            const icon = node.type === 'directory' ? '📁' : this.getFileIcon(node.name);
            const iconColor = node.type === 'directory' ? 'text-cyan/60' : this.getFileIconColor(node.name);

            el.innerHTML = `
                <div class="flex items-center gap-2 px-4 py-1 cursor-pointer hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-gold/40" 
                     style="padding-left: ${paddingLeft}" onclick="nexusController.handleNodeClick('${node.path}', '${node.type}')">
                    <span class="text-[10px] ${iconColor}">${icon}</span>
                    <span class="text-white/60 group-hover:text-white truncate ${node.type === 'directory' ? 'font-bold uppercase tracking-tighter' : ''}">${node.name}</span>
                </div>
                <div id="children-${node.path.replace(/\//g, '-')}" class="hidden flex flex-col"></div>
            `;

            container.appendChild(el);

            if (node.type === 'directory' && node.children) {
                const childContainer = document.getElementById(`children-${node.path.replace(/\//g, '-')}`);
                this.renderTree(node.children, childContainer, level + 1);
            }
        });
    }

    getFileIcon(name) {
        const ext = name.split('.').pop().toLowerCase();
        if (['md', 'txt'].includes(ext)) return '📄';
        if (['js', 'ts', 'html', 'css'].includes(ext)) return '📜';
        if (['json', 'yaml', 'yml'].includes(ext)) return '📦';
        return '📄';
    }

    getFileIconColor(name) {
        const ext = name.split('.').pop().toLowerCase();
        if (ext === 'md') return 'text-gold';
        if (['js', 'html', 'css'].includes(ext)) return 'text-cyan';
        if (['json', 'yaml', 'yml'].includes(ext)) return 'text-amber-400';
        return 'text-white/20';
    }

    handleNodeClick(path, type) {
        if (type === 'directory') {
            const childContainer = document.getElementById(`children-${path.replace(/\//g, '-')}`);
            childContainer.classList.toggle('hidden');
        } else {
            this.openFile(path);
        }
    }

    /**
     * [SH-1600-F] Open File logic
     */
    async openFile(path) {
        if (this.isDirty && !confirm("UNSAVED_CHANGES: Continue without saving?")) return;

        console.log(`Nexus_HUD: Opening ${path}...`);
        this.currentPath = path;
        if (this.activePathLabel) this.activePathLabel.innerText = '/' + path;
        
        try {
            const response = await fetch(`/api/nexus/read?path=${encodeURIComponent(path)}`);
            const content = await response.text();
            
            this.editorPane.innerText = content;
            this.renderPreview();
            this.isDirty = false;
        } catch (err) {
            console.error("Nexus_Read_Error:", err);
            // MOCK for Dev Environment
            this.editorPane.innerText = `# Simulation_File: ${path}\n\nThis is a mock response from the Nexus Virtual FS Bridge.\n\n### Logic_State: NOMINAL\n\n- Path: /home/skywork/workspace/${path}\n- Last_Accessed: ${new Date().toISOString()}`;
            this.renderPreview();
            this.isDirty = false;
        }
    }

    renderPreview() {
        if (!this.previewPane || !this.editorPane) return;
        const raw = this.editorPane.innerText;
        
        // Simple Markdown Renderer (Replace with marked.js for production)
        let html = raw
            .replace(/^# (.*$)/gim, '<h1 class="text-gold font-cinzel text-2xl border-b border-gold/10 pb-4 mb-6 uppercase tracking-widest">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-gold/80 font-cinzel text-xl mt-8 mb-4 uppercase tracking-widest">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-cyan/80 font-bold text-sm mt-6 mb-2 uppercase tracking-widest">$1</h3>')
            .replace(/^\- (.*$)/gim, '<li class="text-white/60 ml-4 list-disc">$1</li>')
            .replace(/\*\*(.*)\*\*/gim, '<b class="text-white">$1</b>')
            .replace(/\*(.*)\*/gim, '<i class="text-white/40">$1</i>')
            .replace(/\n/gim, '<br>');

        this.previewPane.innerHTML = `<div class="prose prose-invert prose-sm max-w-none">${html}</div>`;
    }

    async saveCurrentFile() {
        if (!this.currentPath) return;
        console.log(`Nexus_HUD: Saving ${this.currentPath}...`);
        
        const content = this.editorPane.innerText;
        
        try {
            const response = await fetch('/api/nexus/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: this.currentPath, content })
            });
            const result = await response.json();
            
            if (result.success) {
                this.isDirty = false;
                alert("FILE_SAVED: /" + this.currentPath);
            }
        } catch (err) {
            console.error("Nexus_Save_Error:", err);
            alert("UPLINK_FAILURE: Virtual FS Bridge Offline.");
        }
    }

    /**
     * [SH-1600-S] Discovery Gate Logic
     */
    async loadScoutQueue() {
        if (!this.scoutQueue) return;
        this.scoutQueue.innerHTML = `<div class="p-4 text-cyan/20 animate-pulse uppercase text-[8px] font-mono tracking-widest">Awaiting_Scout_Pings...</div>`;

        const { data: discoveries } = await this.supabase
            .from('pending_discoveries')
            .select('*')
            .eq('status', 'PENDING')
            .order('created_at', { ascending: false });

        if (!discoveries || discoveries.length === 0) {
            this.scoutQueue.innerHTML = `<div class="flex-1 flex items-center justify-center border border-white/5 border-dashed rounded-xl text-[9px] text-white/10 uppercase tracking-[0.4em]">Queue_Clear // Scout_Standby</div>`;
            return;
        }

        this.scoutQueue.innerHTML = discoveries.map(d => `
            <div class="shrink-0 w-80 glass-card p-4 flex flex-col gap-3 border-cyan/10 hover:border-cyan/40 transition-colors">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-white font-bold text-[10px] uppercase tracking-widest">${d.name}</h4>
                        <p class="text-[8px] text-cyan/60 font-mono uppercase">${d.niche}</p>
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="text-[8px] text-gold font-bold">${d.market_heat}%</span>
                        <div class="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="nexusController.approveDiscovery('${d.id}')" class="flex-1 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase rounded hover:bg-emerald-500/20 transition-all">Approve</button>
                    <button onclick="nexusController.discardDiscovery('${d.id}')" class="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[8px] font-bold uppercase rounded hover:bg-rose-500/20 transition-all">Discard</button>
                </div>
            </div>
        `).join('');
    }

    async approveDiscovery(id) {
        console.log(`Nexus_Gate: Approving Discovery ${id}...`);
        
        // 1. Move to projects table
        const { data: discovery } = await this.supabase.from('pending_discoveries').select('*').eq('id', id).single();
        if (discovery) {
            await this.supabase.from('projects').insert([{
                name: discovery.name,
                path: `PROJECTS/${discovery.name.toLowerCase().replace(/\s/g, '-')}`,
                lead_agent: discovery.suggested_lead,
                status: 'ACTIVE',
                meta: discovery.meta
            }]);

            // 2. Mark as approved
            await this.supabase.from('pending_discoveries').update({ status: 'APPROVED' }).eq('id', id);

            // 3. TRIGGER FORGE (SH-1200)
            if (window.forgeController) {
                window.forgeController.initiateBMAD(discovery.name, discovery.niche);
            }

            this.loadScoutQueue();
            alert(`FORGE_INITIATED: Creating environment for ${discovery.name}.`);
        }
    }

    async discardDiscovery(id) {
        await this.supabase.from('pending_discoveries').update({ status: 'DISCARDED' }).eq('id', id);
        this.loadScoutQueue();
    }
}

// Global Export
window.nexusController = new NexusController(window.supabaseClient);
window.onload = (originalOnload => {
    return () => {
        if (originalOnload) originalOnload();
        window.nexusController.init();
    };
})(window.onload);

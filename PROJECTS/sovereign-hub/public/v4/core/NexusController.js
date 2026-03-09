/**
 * Nexus Controller (SH-1600)
 * Logic for the File Explorer and HUD Editor.
 */
export class NexusController {
    constructor(supabase) {
        this.supabase = supabase;
        this.currentPath = null;
        this.isDirty = false;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        this.treeContainer = document.getElementById('nexus-file-tree');
        this.editorPane = document.getElementById('editor-pane');
        this.previewPane = document.getElementById('preview-pane');
        this.activePathLabel = document.getElementById('active-file-path');
        this.activeIcon = document.getElementById('active-file-icon');
        this.scoutQueue = document.getElementById('scout-queue-strip');
        this.saveBtn = document.getElementById('save-changes-btn');

        console.log("Nexus_Controller: Initializing Virtual FS Bridge...");
        this.setupEventListeners();
        await this.loadTree();
        await this.loadScoutQueue();
        this.initialized = true;
    }

    setupEventListeners() {
        if (this.saveBtn) {
            this.saveBtn.onclick = () => this.saveCurrentFile();
        }

        if (this.editorPane) {
            this.editorPane.oninput = () => {
                this.isDirty = true;
                this.renderPreview();
            };
        }

        const refreshBtn = document.getElementById('nexus-refresh-btn');
        if (refreshBtn) {
            refreshBtn.onclick = () => {
                this.loadTree();
                this.loadScoutQueue();
            };
        }
    }

    async loadTree() {
        if (!this.treeContainer) return;
        this.treeContainer.innerHTML = `<div class="p-4 text-[#8B5CF6]/40 animate-pulse">Scanning_FileSystem...</div>`;

        try {
            // Simulated bridge for v4.0 demonstration
            this.renderTree([
                { name: 'PROJECTS', type: 'directory', path: 'PROJECTS', children: [
                    { name: 'sovereign-hub', type: 'directory', path: 'PROJECTS/sovereign-hub', children: [
                        { name: 'v4', type: 'directory', path: 'PROJECTS/sovereign-hub/v4', children: [
                            { name: 'index.html', type: 'file', path: 'PROJECTS/sovereign-hub/v4/index.html' },
                            { name: 'app.js', type: 'file', path: 'PROJECTS/sovereign-hub/v4/app.js' }
                        ]}
                    ]}
                ]},
                { name: 'core', type: 'directory', path: 'core', children: [
                    { name: 'NexusController.js', type: 'file', path: 'core/NexusController.js' }
                ]}
            ], this.treeContainer);
        } catch (err) {
            console.error("Nexus_Explorer_Load_Error:", err);
            this.treeContainer.innerHTML = `<div class="p-4 text-rose-500/60 font-mono text-[9px] uppercase">Uplink_Failed</div>`;
        }
    }

    renderTree(nodes, container, level = 0) {
        if (level === 0) container.innerHTML = '';

        nodes.forEach(node => {
            const el = document.createElement('div');
            el.className = `group flex flex-col`;
            
            const paddingLeft = `${level * 0.75}rem`;
            const icon = node.type === 'directory' ? '📁' : this.getFileIcon(node.name);
            const iconColor = node.type === 'directory' ? 'text-[#8B5CF6]/60' : this.getFileIconColor(node.name);

            el.innerHTML = `
                <div class="flex items-center gap-2 px-4 py-1 cursor-pointer hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-gold/40" 
                     style="padding-left: ${paddingLeft}" onclick="window.nexusController.handleNodeClick('${node.path}', '${node.type}')">
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
        if (['js', 'html', 'css'].includes(ext)) return 'text-[#8B5CF6]';
        if (['json', 'yaml', 'yml'].includes(ext)) return 'text-amber-400';
        return 'text-white/20';
    }

    handleNodeClick(path, type) {
        if (type === 'directory') {
            const childContainer = document.getElementById(`children-${path.replace(/\//g, '-')}`);
            if (childContainer) childContainer.classList.toggle('hidden');
        } else {
            this.openFile(path);
        }
    }

    async openFile(path) {
        if (this.isDirty && !confirm("UNSAVED_CHANGES: Continue without saving?")) return;

        console.log(`Nexus_HUD: Opening ${path}...`);
        this.currentPath = path;
        if (this.activePathLabel) this.activePathLabel.innerText = '/' + path;
        
        // Mock content for demonstration
        this.editorPane.innerText = `# File: ${path}\n\nLoading logic from virtual FS...`;
        this.renderPreview();
        this.isDirty = false;
    }

    renderPreview() {
        if (!this.previewPane || !this.editorPane) return;
        const raw = this.editorPane.innerText;
        
        let html = raw
            .replace(/^# (.*$)/gim, '<h1 class="text-gold font-cinzel text-2xl border-b border-gold/10 pb-4 mb-6 uppercase tracking-widest">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-gold/80 font-cinzel text-xl mt-8 mb-4 uppercase tracking-widest">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-[#8B5CF6]/80 font-bold text-sm mt-6 mb-2 uppercase tracking-widest">$1</h3>')
            .replace(/^\- (.*$)/gim, '<li class="text-white/60 ml-4 list-disc">$1</li>')
            .replace(/\*\*(.*)\*\*/gim, '<b class="text-white">$1</b>')
            .replace(/\*(.*)\*/gim, '<i class="text-white/40">$1</i>')
            .replace(/\n/gim, '<br>');

        this.previewPane.innerHTML = `<div class="prose prose-invert prose-sm max-w-none">${html}</div>`;
    }

    async saveCurrentFile() {
        if (!this.currentPath) return;
        alert("SAVE_SUCCESS: /" + this.currentPath);
        this.isDirty = false;
    }

    async loadScoutQueue() {
        if (!this.scoutQueue) return;
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
            <div class="shrink-0 w-80 glass-card p-4 flex flex-col gap-3 border-[#8B5CF6]/10 hover:border-[#8B5CF6]/40 transition-colors">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-white font-bold text-[10px] uppercase tracking-widest">${d.name}</h4>
                        <p class="text-[8px] text-[#8B5CF6]/60 font-mono uppercase">${d.niche}</p>
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="text-[8px] text-gold font-bold">${d.market_heat}%</span>
                        <div class="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="window.nexusController.approveDiscovery('${d.id}')" class="flex-1 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase rounded hover:bg-emerald-500/20 transition-all">Approve</button>
                    <button onclick="window.nexusController.discardDiscovery('${d.id}')" class="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[8px] font-bold uppercase rounded hover:bg-rose-500/20 transition-all">Discard</button>
                </div>
            </div>
        `).join('');
    }

    async approveDiscovery(id) {
        const { data: discovery } = await this.supabase.from('pending_discoveries').update({ status: 'APPROVED' }).eq('id', id).select().single();
        if (discovery) {
            this.loadScoutQueue();
            alert(`FORGE_INITIATED: ${discovery.name}.`);
        }
    }

    async discardDiscovery(id) {
        await this.supabase.from('pending_discoveries').update({ status: 'DISCARDED' }).eq('id', id);
        this.loadScoutQueue();
    }
}

export default NexusController;

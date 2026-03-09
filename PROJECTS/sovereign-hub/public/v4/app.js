/* 🔱 Sovereign_OS Hub | app.js v10.0 - SOVEREIGN-NATIVE NEP v1.1 */

// 🏁 CLOUD PURGE: Supabase deprecated. Using OpenClaw Native API.
const API_BASE = '/api';

// Native Supabase Mock for compatibility with legacy components
window.supabase = {
    createClient: () => ({
        from: (table) => ({
            select: (columns) => ({
                order: (col, opts) => ({
                    limit: (count) => ({
                        then: async (cb) => {
                            let url = `${API_BASE}/logs`;
                            if (table === 'agent_states' || table === 'node_status') url = `${API_BASE}/states`;
                            try {
                                const res = await fetch(url);
                                const data = await res.json();
                                cb({ data: data.logs || data.agents || [], error: null });
                            } catch (e) { cb({ data: [], error: e }); }
                        }
                    }),
                    then: async (cb) => {
                        let url = `${API_BASE}/logs`;
                        if (table === 'agent_states' || table === 'node_status') url = `${API_BASE}/states`;
                        try {
                            const res = await fetch(url);
                            const data = await res.json();
                            cb({ data: data.logs || data.agents || [], error: null });
                        } catch (e) { cb({ data: [], error: e }); }
                    }
                }),
                then: async (cb) => {
                    let url = `${API_BASE}/logs`;
                    if (table === 'agent_states' || table === 'node_status') url = `${API_BASE}/states`;
                    try {
                        const res = await fetch(url);
                        const data = await res.json();
                        cb({ data: data.logs || data.agents || [], error: null });
                    } catch (e) { cb({ data: [], error: e }); }
                }
            }),
            insert: (records) => ({
                then: async (cb) => {
                    try {
                        const res = await fetch(`${API_BASE}/dispatch`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(records[0])
                        });
                        cb({ error: null });
                    } catch (e) { cb({ error: e }); }
                }
            })
        }),
        channel: () => ({ on: () => ({ subscribe: () => {} }), subscribe: () => {} })
    })
};

const supabase = window.supabase.createClient();

document.addEventListener('DOMContentLoaded', () => {
    console.log("Sovereign_OS: Neural Bridge - 100% NATIVE.");
    loadInitialState();
    startHardwareMonitor();
    discoverFleet();
    initRealtimePolling();
    
    // Initialize complex visuals
    setTimeout(() => {
        if (typeof window.drawNeuralFlow === 'function') window.drawNeuralFlow();
        if (typeof window.activateSentinel === 'function') window.activateSentinel();
    }, 1000);
});

async function startHardwareMonitor() {
    const update = async () => {
        try {
            const res = await fetch(`${API_BASE}/system/telemetry`);
            const data = await res.json();
            
            const cpuEl = document.getElementById('cpu-load-value');
            const memEl = document.getElementById('mem-load-value');
            const uptimeEl = document.getElementById('system-uptime');
            
            if (cpuEl) cpuEl.innerText = `${data.cpu.usage}%`;
            if (memEl) memEl.innerText = `${data.memory.usagePercent}%`;
            if (uptimeEl) uptimeEl.innerText = data.system.uptime;
        } catch (e) {}
    };
    update();
    setInterval(update, 5000);
}

async function discoverFleet() {
    try {
        const res = await fetch(`${API_BASE}/states`);
        const data = await res.json();
        const container = document.getElementById('agent-grid-container');
        if (!container || !data.agents) return;
        
        container.innerHTML = data.agents.map(agent => `
            <div class="agent-card border border-gold/20 bg-black/40 p-4 rounded-lg animate-in zoom-in-95">
                <div class="flex justify-between items-start">
                    <span class="text-2xl">${agent.emoji || '🤖'}</span>
                    <span class="text-[10px] text-gold font-bold uppercase">${agent.status}</span>
                </div>
                <h3 class="text-xs font-black mt-2 text-white">${agent.agent_id}</h3>
                <p class="text-[9px] text-white/40 font-mono mt-1">${agent.active_task || 'Standby'}</p>
            </div>
        `).join('');
    } catch (e) {}
}

async function loadInitialState() {
    try {
        const response = await fetch(`${API_BASE}/logs`);
        const { logs } = await response.json();
        const feed = document.getElementById('dashboard-activity-feed');
        if (feed) feed.innerHTML = ''; 
        if (logs) logs.reverse().forEach(log => appendLog(log));
    } catch(e) { console.error("Initial_Load_Error:", e); }
}

function initRealtimePolling() {
    setInterval(async () => {
        try {
            const response = await fetch(`${API_BASE}/logs`);
            const { logs } = await response.json();
            if (logs && logs.length > 0) {
                const newest = logs[0];
                const feed = document.getElementById('dashboard-activity-feed');
                if (feed && !feed.innerText.includes(newest.message.substring(0, 20))) {
                    refreshFeed(logs);
                }
            }
        } catch(e) {}
    }, 3000);
}

function refreshFeed(logs) {
    const feed = document.getElementById('dashboard-activity-feed');
    if (!feed) return;
    feed.innerHTML = '';
    logs.reverse().forEach(log => appendLog(log));
}

function appendLog(log) {
    const feed = document.getElementById('dashboard-activity-feed');
    if (!feed) return;
    
    const timestamp = log.timestamp || log.created_at;
    const time = new Date(timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    const line = document.createElement('div');
    line.className = "flex gap-4 border-b border-white/[0.03] py-1.5 animate-in fade-in";
    
    const name = log.agent_id || log.agent_name || 'SYS';
    const msg = log.message || log.task_description || 'No data.';
    const color = log.level === 'SUCCESS' || log.status === 'completed' ? '#10B981' : '#FFD700';

    line.innerHTML = `
        <span class="text-white/20 shrink-0 text-[9px]">[${time}]</span>
        <span style="color: ${color}" class="font-black uppercase shrink-0 text-[10px]">${name}:</span>
        <span class="text-white/90 font-mono text-[11px]">${msg}</span>
    `;
    
    feed.appendChild(line);
    feed.scrollTop = feed.scrollHeight;
}

window.broadcastMission = async (cmdOverride) => {
    const input = document.getElementById('imperial-directive-input');
    const cmd = cmdOverride || input.value.trim();
    if(!cmd) return;
    if(!cmdOverride && input) input.value = '';

    try {
        await fetch(`${API_BASE}/dispatch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                agentId: 'main',
                agentName: 'SOVEREIGN',
                description: cmd,
                priority: 'URGENT'
            })
        });
        appendLog({ agent_id: 'SOVEREIGN', message: `>> MISSION_BROADCAST: ${cmd}`, level: 'INFO', timestamp: new Date().toISOString() });
    } catch(e) { console.error("Broadcast_Failed:", e); }
};

window.switchTab = (name) => {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(name + '-tab');
    if(target) target.classList.remove('hidden');
    
    document.querySelectorAll('#top-nav button').forEach(btn => {
        btn.classList.remove('text-gold');
        btn.classList.add('text-white/60');
    });
    
    const navButtons = document.querySelectorAll('#top-nav button');
    navButtons.forEach(btn => {
        if(btn.getAttribute('onclick')?.includes(name)) {
            btn.classList.add('text-gold');
            btn.classList.remove('text-white/60');
        }
    });
};

window.triggerTool = (agent, action) => {
    const feed = document.getElementById('command-output-feed');
    if(!feed) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = "animate-in slide-in-from-left-2";
    line.innerHTML = `<span class="text-gold/40">[${timestamp}]</span> <span class="text-violet font-black">TOOL_TRIGGER:</span> <span>Activating ${action.toUpperCase()} for ${agent.toUpperCase()}...</span>`;
    feed.appendChild(line);
    feed.scrollTop = feed.scrollHeight;

    appendLog({ agent_id: agent, message: `>> Manual_Tool_Activation: [${action.toUpperCase()}]`, level: 'INFO', timestamp: new Date().toISOString() });
};

window.executeSovereignDirective = async () => {
    const input = document.getElementById('imperial-directive-input');
    const cmd = input.value.trim();
    if(!cmd) return;

    const feed = document.getElementById('command-output-feed');
    const timestamp = new Date().toLocaleTimeString();
    
    const line = document.createElement('div');
    line.innerHTML = `<span class="text-gold/40">[${timestamp}]</span> <span class="text-emerald-400 font-black">IMPERIAL_DIRECTIVE:</span> <span class="italic text-white">\"${cmd}\"</span>`;
    feed.appendChild(line);

    window.broadcastMission(cmd);
};

window.switchContentSubTab = (view, btn) => {
    document.querySelectorAll('.content-sub-view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(`content-${view}-view`);
    if(target) target.classList.remove('hidden');
    
    document.querySelectorAll('.sub-tab-btn').forEach(b => {
        b.style.color = 'rgba(255,255,255,0.4)';
        b.style.borderBottomColor = 'transparent';
    });
    
    btn.style.color = '#FF00FF'; 
    btn.style.borderBottomColor = '#FF00FF';
};

window.drawNeuralFlow = () => {
    const svg = document.getElementById('neural-links-layer');
    if(!svg) return;
    svg.innerHTML = ''; 

    const nodes = document.querySelectorAll('.neural-node');
    const root = nodes[0]; 
    if (!root) return;
    
    nodes.forEach((node, i) => {
        if(i === 0) return; 

        const rRect = root.getBoundingClientRect();
        const nRect = node.getBoundingClientRect();
        const cRect = svg.getBoundingClientRect();

        const x1 = (rRect.left + rRect.width/2) - cRect.left;
        const y1 = (rRect.top + rRect.height/2) - cRect.top;
        const x2 = (nRect.left + nRect.width/2) - cRect.left;
        const y2 = (nRect.top + nRect.height/2) - cRect.top;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${x1} ${y1} Q ${(x1+x2)/2} ${y1} ${x2} ${y2}`);
        path.setAttribute("class", "flow-line");
        path.setAttribute("stroke", "rgba(212, 175, 55, 0.1)");
        path.setAttribute("fill", "none");
        svg.appendChild(path);

        const pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pulse.setAttribute("r", "2");
        pulse.setAttribute("fill", "#FFD700");
        
        const mPath = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        mPath.setAttribute("dur", "3s");
        mPath.setAttribute("repeatCount", "indefinite");
        mPath.setAttribute("path", `M ${x1} ${y1} Q ${(x1+x2)/2} ${y1} ${x2} ${y2}`);
        
        pulse.appendChild(mPath);
        svg.appendChild(pulse);
    });
};

window.activateSentinel = () => {
    appendLog({ agent_id: 'SAM', message: '>> SENTINEL_PROTOCOL: System Hardening Level 4 ACTIVE.', level: 'INFO', timestamp: new Date().toISOString() });
};

window.toggleManifest = async () => {
    const drawer = document.getElementById('mission-manifest-drawer');
    if (!drawer) return;
    
    drawer.classList.toggle('active');
    
    if (drawer.classList.contains('active')) {
        await loadManifest();
    }
};

async function loadManifest() {
    const list = document.getElementById('manifest-list');
    if (!list) return;
    
    try {
        const response = await fetch(`${API_BASE}/states`);
        const { agents } = await response.json();
        
        list.innerHTML = '';
        if (agents) {
            agents.forEach(agent => {
                const item = document.createElement('div');
                item.className = `manifest-item ${agent.status === 'ERROR' ? 'opacity-60' : ''}`;
                item.innerHTML = `
                    <span class="manifest-item-status">${agent.status || 'IDLE'}</span>
                    <h4 class="text-[11px] font-black text-white uppercase">${agent.agent_id || agent.name}</h4>
                    <p class="text-[8px] text-white/40 mt-1">${agent.active_task || 'Awaiting directive...'}</p>
                    <div class="w-full bg-white/5 h-1 mt-3">
                        <div class="bg-gold h-full ${agent.status === 'BUSY' ? 'animate-pulse' : ''}" style="width: ${agent.progress || 0}%"></div>
                    </div>
                `;
                list.appendChild(item);
            });
        }
    } catch(e) { console.error("Manifest_Load_Error:", e); }
}

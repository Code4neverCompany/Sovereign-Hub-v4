/* 
  Sovereign Hub v4.0 | app.js
  SovereignStream Realtime Engine (SH-403)
*/

import { SentinelTrace } from './core/sentinel.js';

// Lux Aesthetic 3.0 Color Palette for Console
const COLORS = {
    void: 'color: #0A0A0B',
    gold: 'color: #D4AF37',
    cyan: 'color: #00F2FF',
    system: 'color: #D4AF37; font-weight: bold; text-transform: uppercase;',
    stream: 'color: #00F2FF; font-weight: bold;'
};

let sentinel;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('%c Sovereign Hub v4.0 Materialized ', 'background: #0A0A0B; color: #D4AF37; border: 1px solid #D4AF37; padding: 4px;');
    
    // Initialize Sentinel-Trace HUD (SH-501)
    sentinel = new SentinelTrace('sentinel-trace');

    updateTimestamp();
    setInterval(updateTimestamp, 1000);

    // 1. UI Components Setup
    setupAgentMatrix();
    setupIntelStream();
    setupCommandCenter();

    // 2. Realtime Uplink (SH-403)
    await initSovereignStream();
});

function updateTimestamp() {
    const timestampElement = document.getElementById('timestamp');
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    if (timestampElement) {
        timestampElement.textContent = timeStr;
    }
}

/**
 * SovereignStream Realtime Engine (SH-403)
 * Handles Supabase WebSocket subscriptions
 */
async function initSovereignStream() {
    console.log('%c[SYSTEM]: Initializing SovereignStream Uplink...%c', COLORS.system, '');
    
    // In a real environment, these would be in a config/env file.
    // Since we are in the workspace, we assume availability via global 'supabase' if linked.
    // For SH-403, we implement the logic and verify connection status.
    
    try {
        const SUPABASE_URL = window.SUPABASE_URL || 'https://your-project.supabase.co';
        const SUPABASE_KEY = window.SUPABASE_KEY || 'your-anon-key';
        
        if (typeof supabase === 'undefined') {
            console.error('%c[ERROR]: Supabase client not found. Ensure script is loaded in index.html%c', 'color: red; font-weight: bold;', '');
            updateUplinkStatus('ERROR', 'text-red-500');
            return;
        }

        const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('%c[SYSTEM]: Supabase Client Materialized.%c', COLORS.system, '');

        // SUBSCRIBE to 'agent_logs' (INSERT)
        const logChannel = client
            .channel('agent_logs_channel')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'agent_logs' }, payload => {
                console.log('%c[STREAM]: New Agent Log Received%c', COLORS.stream, '', payload.new);
                renderLogLine(payload.new);
                
                // SH-501: Pulse Sentinel-Trace on logs
                if (sentinel) {
                    sentinel.updateNodes({
                        id: payload.new.agent_id || 'remote-node',
                        name: payload.new.agent_name || 'REMOTE_NODE',
                        status: 'active',
                        activity: true
                    });
                }
            })
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    console.log('%c[SYSTEM]: Subscribed to agent_logs%c', COLORS.gold, '');
                    updateUplinkStatus('ONLINE', 'text-cyan');
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error('%c[SYSTEM]: Channel Error on agent_logs%c', 'color: red;', '', err);
                    updateUplinkStatus('ERROR', 'text-red-500');
                }
                if (status === 'TIMED_OUT') {
                    console.error('%c[SYSTEM]: Subscription Timed Out%c', 'color: orange;', '');
                    updateUplinkStatus('RETRYING', 'text-amber-500');
                }
            });

        // SUBSCRIBE to 'agent_states' (UPDATE)
        client
            .channel('agent_states_channel')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'agent_states' }, payload => {
                console.log('%c[STREAM]: Agent State Update%c', COLORS.stream, '', payload.new);
                updateAgentMatrix(payload.new);
                
                // SH-501: Sync Sentinel-Trace HUD
                if (sentinel) {
                    sentinel.updateNodes({
                        id: payload.new.agent_id || 'remote-node',
                        name: (payload.new.agent_name || 'NODE').toUpperCase(),
                        status: payload.new.status === 'BUSY' ? 'active' : 'nominal'
                    });
                }
            })
            .subscribe((status, err) => {
                if (status === 'CHANNEL_ERROR') console.error('[SYSTEM]: agent_states channel error:', err);
            });

        // SUBSCRIBE to 'todos' (ALL)
        client
            .channel('todos_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, payload => {
                console.log('%c[STREAM]: Todo Board Sync%c', COLORS.stream, '', payload.eventType);
                refreshTaskBoard(payload);
            })
            .subscribe((status, err) => {
                if (status === 'CHANNEL_ERROR') console.error('[SYSTEM]: todos channel error:', err);
            });

    } catch (err) {
        console.error('%c[SYSTEM]: Uplink Failure%c', 'color: red;', '', err);
        updateUplinkStatus('FAILED', 'text-red-500');
    }
}

function updateUplinkStatus(status, colorClass) {
    const statusEl = document.getElementById('uplink-status');
    if (statusEl) {
        statusEl.textContent = status;
        statusEl.className = colorClass;
    }
}

/**
 * UI Placeholders for Realtime Actions
 */
const AGENT_COLORS = {
    'Alex': '#D4AF37',   // Gold
    'Maya': '#9B59B6',   // Purple
    'Jordan': '#3498DB', // Blue
    'Dev': '#E67E22',    // Orange
    'Sam': '#E74C3C',    // Red
    'System': '#00F2FF'  // Cyan
};

function renderLogLine(log) {
    console.log('%c[UI]: Triggering renderLogLine()...%c', COLORS.cyan, '');
    const logContainer = document.getElementById('log-container');
    if (!logContainer) return;
    
    // Create element
    const line = document.createElement('div');
    line.className = 'log-entry font-mono text-[13px] leading-relaxed flex gap-2 py-1 border-b border-gold/5';
    
    // Timestamp
    const timestamp = log.created_at ? new Date(log.created_at).toISOString().substring(11, 19) : new Date().toISOString().substring(11, 19);
    
    // Agent Tag Styling
    const agentName = log.agent_name || 'System';
    const agentColor = AGENT_COLORS[agentName] || AGENT_COLORS['System'];
    
    line.innerHTML = `
        <span class="text-gold/40 shrink-0">[${timestamp}]</span>
        <span style="color: ${agentColor};" class="font-bold shrink-0 uppercase tracking-tighter">${agentName}:</span>
        <span class="text-white/80">${log.message || '...'}</span>
    `;
    
    // Append and scroll
    logContainer.appendChild(line);
    
    // Auto-scroll to bottom
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // Max log limit to prevent memory bloat (optional but good practice)
    const MAX_LOGS = 200;
    if (logContainer.children.length > MAX_LOGS) {
        logContainer.removeChild(logContainer.firstChild);
    }
}

function updateAgentMatrix(state) {
    console.log('%c[UI]: Updating Agent Matrix for:', COLORS.cyan, '', state.agent_id || state.agent_name);
    
    // Normalize agent_id to lowercase to match our IDs
    const agentId = (state.agent_id || state.agent_name || '').toLowerCase();
    const card = document.getElementById(`agent-card-${agentId}`);
    if (!card) return;

    const led = document.getElementById(`agent-status-${agentId}`);
    const label = document.getElementById(`agent-label-${agentId}`);
    const task = document.getElementById(`agent-task-${agentId}`);
    const lastActive = document.getElementById(`agent-last-active-${agentId}`);

    // Update LED and Label based on status
    const status = (state.status || 'IDLE').toUpperCase();
    if (label) label.textContent = status;
    
    // Reset classes
    if (led) led.className = 'led-pip';
    if (label) label.className = 'font-bold';
    card.classList.remove('neural-pulsing');

    if (['ONLINE', 'IDLE', 'READY', 'NOMINAL'].includes(status)) {
        if (led) led.classList.add('led-emerald');
        if (label) label.classList.add('text-emerald-500');
    } else if (['BUSY', 'PROCESSING', 'WORKING', 'ACTIVE'].includes(status)) {
        if (led) led.classList.add('led-amber');
        if (label) label.classList.add('text-amber-500');
        card.classList.add('neural-pulsing'); // Pulse when working
    } else if (['ERROR', 'OFFLINE', 'FAILED', 'CRITICAL'].includes(status)) {
        if (led) led.classList.add('led-red');
        if (label) label.classList.add('text-red-500');
    } else {
        if (led) led.classList.add('led-emerald');
        if (label) label.classList.add('text-emerald-500');
    }

    // Update Task
    if (task && state.current_task) {
        task.textContent = state.current_task;
        task.classList.add('text-cyan/80');
    }

    // Update Timestamp
    if (lastActive) {
        const date = state.last_active || state.updated_at ? new Date(state.last_active || state.updated_at) : new Date();
        lastActive.textContent = date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
}

/**
 * SH-404: Materialize Agent Matrix
 */
function setupAgentMatrix() {
    const container = document.getElementById('agent-cards-container');
    if (!container) return;

    const AGENTS = [
        { id: 'alex', name: 'Alex', role: 'Strategic Architect' },
        { id: 'maya', name: 'Maya', role: 'Visual Engineer' },
        { id: 'jordan', name: 'Jordan', role: 'Narrative Lead' },
        { id: 'dev', name: 'Dev', role: 'System Builder' },
        { id: 'sam', name: 'Sam', role: 'Ops & QA' }
    ];

    container.innerHTML = AGENTS.map(agent => `
        <div id="agent-card-${agent.id}" class="agent-card p-3 rounded glass-card flex flex-col gap-2 transition-all duration-300">
            <div class="flex items-center justify-between">
                <div class="flex flex-col">
                    <span class="text-[9px] text-gold/50 uppercase font-mono tracking-tighter">${agent.role}</span>
                    <span class="text-xs font-bold text-gold tracking-widest font-cinzel">${agent.name.toUpperCase()}</span>
                </div>
                <div class="led-pip led-emerald" id="agent-status-${agent.id}"></div>
            </div>
            
            <div class="flex flex-col gap-1 border-t border-gold/5 pt-2">
                <div class="flex justify-between items-center text-[8px] font-mono text-white/40">
                    <span>STATUS:</span>
                    <span id="agent-label-${agent.id}" class="text-emerald-500 font-bold">IDLE</span>
                </div>
                <div class="flex flex-col text-[10px] text-white/60 leading-tight">
                    <span class="text-[8px] text-gold/30 uppercase">Current Task:</span>
                    <span id="agent-task-${agent.id}" class="truncate text-white/40">Awaiting command...</span>
                </div>
                <div class="text-[8px] font-mono text-gold/20 mt-1 flex justify-between">
                    <span>LAST ACTIVE:</span>
                    <span id="agent-last-active-${agent.id}">--:--:--</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * SH-405: Materialize Intel Stream (Initial Setup)
 */
function setupIntelStream() {
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
        logContainer.innerHTML = ''; // Clear the initial placeholder
        renderLogLine({
            agent_name: 'System',
            message: 'IntelStream Online. Neural Uplink Initialized.',
            created_at: new Date().toISOString()
        });
    }
}

/**
 * SH-406: Materialize Command Center (Task Board)
 * Reactive Task List from Supabase 'todos'
 */
function refreshTaskBoard(payload = null) {
    console.log('%c[UI]: Triggering refreshTaskBoard()...%c', COLORS.cyan, '', payload ? '(Payload Included)' : '(Initial Load)');
    
    const todoList = document.getElementById('todo-list');
    if (!todoList) return;

    // Handle Payload if passed via Realtime; otherwise Fetch Initial
    if (payload && payload.new) {
        // Simple logic: if new item, prepend; if delete, find and remove
        if (payload.eventType === 'INSERT') {
            const card = createTaskCard(payload.new);
            todoList.insertBefore(card, todoList.firstChild);
        } else {
            // Re-fetch all for consistency on update/delete for simplicity
            fetchInitialTodos();
        }
    } else {
        fetchInitialTodos();
    }
}

async function fetchInitialTodos() {
    const todoList = document.getElementById('todo-list');
    if (typeof supabase === 'undefined') return;

    const SUPABASE_URL = window.SUPABASE_URL || 'https://your-project.supabase.co';
    const SUPABASE_KEY = window.SUPABASE_KEY || 'your-anon-key';
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    try {
        const { data: todos, error } = await client
            .from('todos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        todoList.innerHTML = '';
        if (todos.length === 0) {
            todoList.innerHTML = '<div class="text-[10px] text-gold/20 italic p-4 text-center">No Active Commands Detected.</div>';
            return;
        }

        todos.forEach(todo => {
            const card = createTaskCard(todo);
            todoList.appendChild(card);
        });

    } catch (err) {
        console.error('Failed to fetch todos:', err);
        todoList.innerHTML = '<div class="text-[10px] text-red-500/50 p-4">Sync Error. Retrying...</div>';
    }
}

function createTaskCard(todo) {
    const card = document.createElement('div');
    const priority = (todo.priority || 'low').toLowerCase();
    const status = (todo.status || 'pending').toLowerCase();
    
    // Priority Colors mapping (LUX 3.0 Compliance)
    const priorityClass = `priority-${priority}`; // Defined in style.css
    
    card.id = `task-${todo.id}`;
    card.className = `task-card p-3 rounded glass-card flex flex-col gap-2 ${priorityClass}`;
    
    const statusColor = status === 'completed' ? 'text-emerald-500 bg-emerald-500/10' : 
                       status === 'processing' ? 'text-cyan bg-cyan/10 animate-pulse' :
                       'text-gold/60 bg-gold/5';

    card.innerHTML = `
        <div class="flex justify-between items-start">
            <span class="text-[9px] font-mono text-gold/50 uppercase tracking-widest">${todo.id ? `SH-${todo.id.toString().slice(-4)}` : 'SH-NEW'}</span>
            <span class="text-[8px] font-mono text-gold/30">${new Date(todo.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="text-[11px] text-white/90 leading-snug font-poppins">${todo.task_description || 'No description...'}</div>
        <div class="flex items-center justify-between mt-1">
            <div class="flex gap-2">
                <span class="px-2 py-0.5 rounded border border-gold/10 text-[8px] ${statusColor} uppercase font-mono tracking-tighter">${status}</span>
                <span class="px-2 py-0.5 rounded border border-gold/10 bg-black/20 text-[8px] text-gold/60 uppercase font-mono tracking-tighter">${priority}</span>
            </div>
            <span class="text-[9px] font-mono text-gold/40 italic">@${todo.assigned_to || 'System'}</span>
        </div>
    `;
    return card;
}

/**
 * SH-406: Materialize Command Center (Initial Setup)
 */
function setupCommandCenter() {
    refreshTaskBoard();
    
    // Command Input Handling
    const commandInput = document.getElementById('command-input');
    if (commandInput) {
        commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = commandInput.value;
                if (!command) return;
                
                console.log('%c[SYSTEM]: Executing Steering Command: %c' + command, COLORS.system, 'color: white');
                
                // Trigger local visual feedback
                renderLogLine({
                    agent_name: 'System',
                    message: `Steering command received: [${command}]`,
                    created_at: new Date().toISOString()
                });
                
                commandInput.value = '';
                commandInput.placeholder = 'Processing Command...';
                setTimeout(() => { commandInput.placeholder = 'Enter System Steering Command...'; }, 2000);
            }
        });
    }
}

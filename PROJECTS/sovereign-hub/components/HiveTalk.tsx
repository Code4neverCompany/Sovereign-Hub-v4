// components/HiveTalk.tsx
'use client';

import React, { useState } from 'react';
import { logToSupabase } from '../lib/supabase';

interface Agent {
    id: string;
    name: string;
    emoji: string;
}

const HIVE_AGENTS: Agent[] = [
    { id: 'alex-01', name: 'Alex', emoji: '🦾' },
    { id: 'maya-02', name: 'Maya', emoji: '💻' },
    { id: 'jordan-03', name: 'Jordan', emoji: '🧩' },
    { id: 'dev-04', name: 'Dev', emoji: '🚀' },
    { id: 'sam-05', name: 'Sam', emoji: '🛡️' },
];

export const HiveTalk: React.FC = () => {
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    const toggleAgent = (id: string) => {
        setSelectedAgents(prev => 
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handleBroadcast = async () => {
        if (!message || selectedAgents.length === 0) return;
        
        setIsBroadcasting(true);
        try {
            await logToSupabase({
                agent_id: 'SYSTEM',
                message: `Broadcasting Hive-Talk Command: "${message}" to [${selectedAgents.join(', ')}]`,
                level: 'COMMAND',
                timestamp: new Date().toISOString()
            });

            // Simulate dispatching to each agent
            for (const agentId of selectedAgents) {
                await fetch('/api/dispatch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        agentId, 
                        agentName: HIVE_AGENTS.find(a => a.id === agentId)?.name,
                        command: message 
                    }),
                });
            }

            setMessage('');
            setSelectedAgents([]);
        } catch (error) {
            console.error('Broadcast failed:', error);
        } finally {
            setIsBroadcasting(false);
        }
    };

    return (
        <section className="glass-panel p-6 flex flex-col h-full space-y-4">
            <div className="flex justify-between items-center border-b border-[#8B5CF6]/20 pb-3">
                <h2 className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                    Hive-Talk // Unified Mission Control
                </h2>
                <span className="text-[8px] font-mono text-[#8B5CF6] animate-pulse">BROADCAST_ENABLED</span>
            </div>

            <div className="flex gap-2 flex-wrap">
                {HIVE_AGENTS.map(agent => (
                    <button
                        key={agent.id}
                        onClick={() => toggleAgent(agent.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all duration-300 text-[10px] font-bold ${
                            selectedAgents.includes(agent.id)
                                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                                : 'bg-black/40 border-white/5 text-gray-500 hover:border-[#8B5CF6]/30'
                        }`}
                    >
                        <span>{agent.emoji}</span>
                        {agent.name.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="flex-1 flex flex-col space-y-2">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter Global Mission Command..."
                    className="flex-1 bg-[#050505]/80 border border-white/5 rounded p-3 font-mono text-[11px] text-[#FFD700] placeholder:text-gray-700 focus:outline-none focus:border-[#8B5CF6]/30 transition-colors resize-none"
                />
                <button
                    onClick={handleBroadcast}
                    disabled={isBroadcasting || !message || selectedAgents.length === 0}
                    className={`w-full py-2 font-black text-[10px] tracking-[0.4em] uppercase transition-all duration-500 rounded ${
                        isBroadcasting || !message || selectedAgents.length === 0
                            ? 'bg-gray-900 text-gray-700 border border-white/5 cursor-not-allowed'
                            : 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/40 hover:bg-[#FFD700] hover:text-[#050505] shadow-[0_0_20px_rgba(255,215,0,0.1)]'
                    }`}
                >
                    {isBroadcasting ? 'TRANSMITTING...' : 'BROADCAST_MISSION'}
                </button>
            </div>
        </section>
    );
};

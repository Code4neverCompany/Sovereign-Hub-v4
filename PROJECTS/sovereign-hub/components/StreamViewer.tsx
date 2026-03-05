// components/StreamViewer.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { subscribeToLogs, AgentLog } from '../lib/supabase';

export const StreamViewer: React.FC = () => {
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial Mock Connection Log
        const initLog: AgentLog = {
            agent_id: 'SYSTEM',
            message: 'Intel Stream Initialized. Connecting to Aureum Core...',
            level: 'INFO',
            timestamp: new Date().toISOString()
        };
        setLogs([initLog]);

        // Subscribe to New Logs
        const channel = subscribeToLogs((payload) => {
            const newLog = payload.new as AgentLog;
            setLogs((prev) => [...prev, newLog].slice(-50)); // Keep last 50
        });

        return () => {
            channel.unsubscribe();
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="flex flex-col h-full w-full bg-[#0A0A0A] border border-[#C5A059] rounded-lg overflow-hidden font-mono shadow-[0_0_15px_rgba(197,160,89,0.2)]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#C5A059] text-[#0A0A0A] font-bold text-xs uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0A0A0A] animate-pulse"></span>
                    Real-time Intel Stream
                </div>
                <div className="opacity-70">AUREUM CORE V1.0</div>
            </div>

            {/* Stream Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-none">
                {logs.map((log, i) => (
                    <div 
                        key={i} 
                        className={`text-xs p-2 rounded border border-transparent hover:border-[#00FFFF] transition-all duration-300 group`}
                    >
                        {/* Cyan-Glow Aura implementation via text shadow and border glow */}
                        <div className="flex items-start gap-3">
                            <span className="text-[#C5A059] shrink-0">
                                [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]
                            </span>
                            <span className={`font-bold shrink-0 ${
                                log.level === 'ERROR' ? 'text-red-500' : 
                                log.level === 'WARN' ? 'text-yellow-500' : 'text-[#00FFFF]'
                            }`}>
                                {log.agent_id}
                            </span>
                            <span className="text-gray-300 group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_3px_rgba(0,255,255,0.4)]">
                                {log.message}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Footer */}
            <div className="px-4 py-1 bg-[#0A0A0A] border-t border-[#C5A059]/30 text-[10px] text-[#C5A059]/50 flex justify-between">
                <span>ENCRYPTED_CHANNEL_ACTIVE</span>
                <span>STATUS: STREAMING</span>
            </div>

            <style jsx>{`
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

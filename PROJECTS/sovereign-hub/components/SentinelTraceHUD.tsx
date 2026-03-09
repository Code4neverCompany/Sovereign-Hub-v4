'use client';

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface LogEntry {
  id: string;
  agent_id: string;
  message: string;
  level: 'ERROR' | 'WARN';
  timestamp: string;
}

export const SentinelTraceHUD: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('agent_logs')
        .select('*')
        .in('level', ['ERROR', 'WARN'])
        .order('timestamp', { ascending: false })
        .limit(20);

      if (data) setLogs(data.reverse());
    };

    fetchLogs();

    const channel = supabase
      .channel('sentinel-trace')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'agent_logs', filter: "level=eq.ERROR" },
        (payload) => {
          setLogs((prev) => [...prev, payload.new as LogEntry].slice(-20));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'agent_logs', filter: "level=eq.WARN" },
        (payload) => {
          setLogs((prev) => [...prev, payload.new as LogEntry].slice(-20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel overflow-hidden flex flex-col h-full shadow-2xl relative group">
      {/* Header */}
      <div className="bg-[#8B5CF6]/5 px-4 py-2 border-b border-[#8B5CF6]/20 flex justify-between items-center relative z-10">
        <span className="text-[10px] font-black font-cinzel text-[#FFD700] uppercase tracking-[0.2em] violet-aura">Sentinel Trace HUD</span>
        <div className="flex gap-2 items-center">
          <span className="text-[8px] font-mono text-gray-600">ERR_WARN_ONLY</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.5)]" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>

      {/* Log Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-1 relative z-10 custom-scrollbar"
      >
        {/* Scanning Animation */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FFD700] opacity-20 animate-scan pointer-events-none" />

        {logs.length === 0 ? (
          <div className="text-gray-700 italic flex items-center justify-center h-full">Listening for anomalous traces...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3 py-1 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors group/entry">
              <span className="text-gray-600 shrink-0 text-[9px]">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className={`font-black shrink-0 ${log.level === 'ERROR' ? 'text-red-500' : 'text-[#FFD700]'}`}>
                {log.level}
              </span>
              <span className="text-gray-500 shrink-0 font-bold uppercase text-[9px] tracking-tighter">[{log.agent_id}]</span>
              <span className="text-gray-300 group-hover/entry:text-white transition-colors">{log.message}</span>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0.1; }
          50% { opacity: 0.4; }
          100% { top: 100%; opacity: 0.1; }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

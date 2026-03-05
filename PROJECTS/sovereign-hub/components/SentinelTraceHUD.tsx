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
    // Initial fetch
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

    // Real-time subscription
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
    <div className="glass-panel overflow-hidden flex flex-col h-full shadow-lg relative">
      {/* Header */}
      <div className="bg-gold-leaf/10 px-4 py-2 border-b border-gold-leaf/20 flex justify-between items-center">
        <span className="text-[10px] font-bold font-cinzel text-gold-leaf uppercase tracking-widest">Sentinel Trace HUD // ERROR+WARN</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold-leaf animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Log Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-poppins text-[11px] space-y-2 relative"
      >
        {/* Scanning Animation */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gold-leaf shadow-[0_0_10px_var(--gold-leaf)] opacity-20 animate-scan pointer-events-none" />

        {logs.length === 0 ? (
          <div className="text-gray-500 italic opacity-50">Listening for anomalous traces...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3 border-l-2 border-transparent hover:border-gold-leaf/30 pl-2 transition-colors">
              <span className="text-gold-leaf/50 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className={log.level === 'ERROR' ? 'text-red-500 font-bold' : 'text-gold-leaf'}>
                {log.level}
              </span>
              <span className="text-gray-400 shrink-0 font-cinzel text-[9px]">{log.agent_id}:</span>
              <span className="text-[#FFFFF0] break-all">{log.message}</span>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0.1; }
          50% { opacity: 0.3; }
          100% { top: 100%; opacity: 0.1; }
        }
        .animate-scan {
          animation: scan 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

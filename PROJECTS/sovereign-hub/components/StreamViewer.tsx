// PROJECTS/sovereign-hub/components/StreamViewer.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import type { LogEntry } from '../lib/sovereign-native/adapter';

export const StreamViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs.slice(0, 50).reverse());
      }
    } catch (e) {
      console.error("Failed to fetch logs", e);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '20px', overflow: 'hidden' }}>
      <div style={{ 
        padding: '15px 25px', borderBottom: '1px solid rgba(255,255,255,0.05)', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(to right, rgba(168, 85, 247, 0.1), transparent)'
      }}>
        <h3 style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.5)', margin: 0, fontFamily: 'Cinzel' }}>NEURAL_INTEL_STREAM</h3>
        <div style={{ display: 'flex', items: 'center', gap: '10px' }}>
          <span style={{ fontSize: '8px', color: '#A855F7', fontFamily: 'monospace' }} className="animate-pulse">STREAMING_ACTIVE</span>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#A855F7', boxShadow: '0 0 10px #A855F7' }}></div>
        </div>
      </div>
      
      <div 
        ref={feedRef}
        style={{ flex: 1, padding: '25px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '11px', lineHeight: '1.8' }}
        className="custom-scrollbar"
      >
        {logs.length > 0 ? (
          logs.map((log, i) => {
            const time = new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const isSuccess = log.level === 'SUCCESS';
            const isError = log.level === 'ERROR';
            const color = isSuccess ? '#10B981' : isError ? '#EF4444' : '#FFD700';
            
            return (
              <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '9px' }}>[{time}]</span>
                <span style={{ color: color, fontWeight: 900, textTransform: 'uppercase', minWidth: '70px' }}>
                  {(log.agent_id || 'SYS')}:
                </span>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {log.message}
                </span>
              </div>
            );
          })
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1, letterSpacing: '0.5em', textTransform: 'uppercase' }}>
            Awaiting_Intel_Pulse...
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamViewer;

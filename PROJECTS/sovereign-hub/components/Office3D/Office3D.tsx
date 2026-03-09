// PROJECTS/sovereign-hub/components/Office3D/Office3D.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { AGENTS, AgentState } from './agentsConfig';

const AGENT_PFP_MAP: Record<string, string> = {
  ALEX: 'Documents/architect_v2.jpg',
  DEV: 'Documents/developer_v2.jpg',
  SAM: 'Documents/sentinel_v2.jpg',
  MAIN: 'Documents/nova_pfp.jpg',
  JORDAN: 'Documents/strategist_v2.jpg',
  MAYA: 'Documents/maya_v2.jpg'
};

export default function Office3D() {
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>({});
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch('/api/states');
        const data = await res.json();
        if (data.agents) {
          const states: Record<string, AgentState> = {};
          data.agents.forEach((a: any) => {
            const id = a.agent_id.toUpperCase();
            states[id] = {
              id: id,
              status: a.status || 'IDLE',
              currentTask: a.active_task,
              model: a.model_engine
            };
          });
          setAgentStates(states);
        }
      } catch (e) {}
    };
    fetchStates();
    const interval = setInterval(fetchStates, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      onClick={() => setSelectedAgent(null)}
      style={{ width: '100%', height: '100%', backgroundColor: '#020105', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      
      {/* 🔮 SPATIAL PERSPECTIVE GRID */}
      <div style={{ position: 'absolute', inset: 0, perspective: '1000px', pointerEvents: 'none' }}>
        <div style={{ 
          position: 'absolute', inset: 0, 
          transform: 'rotateX(65deg) scale(3)',
          transformOrigin: 'center center',
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 215, 0, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.6
        }}></div>
      </div>

      {/* 🚀 CENTRAL NODE: THE HEADCHIEF CORE (MAIN) */}
      <div style={{ position: 'relative', zIndex: 10, width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          position: 'absolute', inset: 0, border: '2px solid #FFD700', transform: 'rotate(45deg)',
          boxShadow: '0 0 50px rgba(255, 215, 0, 0.4)', animation: 'spin 12s linear infinite'
        }}></div>
        <div style={{ 
          position: 'absolute', inset: '10px', border: '1px solid rgba(168, 85, 247, 0.4)', transform: 'rotate(-45deg)',
          animation: 'spin 18s linear infinite reverse'
        }}></div>
        <div style={{ 
          width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', 
          border: '2px solid #FFD700', boxShadow: '0 0 30px #FFD700', position: 'relative', zIndex: 20
        }}>
          <img src="/api/media?path=Documents/nova_pfp.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
        </div>
      </div>

      {/* 🧬 AGENT NODES */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 100, width: '100%', height: '100%' }}>
        {AGENTS.map((agent, i) => {
          const state = agentStates[agent.id];
          const isBusy = state?.status === 'BUSY';
          const color = isBusy ? '#FFD700' : (agent.color || '#A855F7');
          const pfp = AGENT_PFP_MAP[agent.id] || 'Documents/nova_pfp.jpg';
          
          const leftOffset = agent.position[0] * 70;
          const topOffset = agent.position[2] * 50;

          return (
            <div 
              key={agent.id}
              onClick={(e) => { e.stopPropagation(); setSelectedAgent(selectedAgent === agent.id ? null : agent.id); }}
              className="absolute pointer-events-auto"
              style={{ 
                left: `calc(50% + ${leftOffset}px)`, 
                top: `calc(50% + ${topOffset}px)`, 
                transform: 'translate(-50%, -50%)', 
                cursor: 'pointer',
                zIndex: selectedAgent === agent.id ? 200 : 100
              }}
            >
              <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000" style={{ animationDelay: `${i * 0.2}s` }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#000',
                  boxShadow: `0 0 20px ${color}66`, position: 'relative', border: `2px solid ${color}`,
                  transform: selectedAgent === agent.id ? 'scale(1.5)' : 'scale(1)',
                  transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  overflow: 'hidden'
                }}>
                  <img src={`/api/media?path=${pfp}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  {isBusy && <div className="animate-ping" style={{ position: 'absolute', inset: 0, backgroundColor: color, borderRadius: '50%', opacity: 0.4 }}></div>}
                </div>

                <div className={`transition-all duration-500 ${selectedAgent === agent.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-100 translate-y-0 scale-90'}`}>
                  <div className="glass-panel px-5 py-3 border-[#FFD700]/30 min-w-[140px] shadow-2xl relative flex flex-col items-center backdrop-blur-2xl">
                    <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.25em', color: '#FFF' }}>{agent.name.toUpperCase()}</span>
                    <span style={{ fontSize: '8px', color: isBusy ? '#FFD700' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginTop: '4px', fontWeight: 'bold' }}>{state?.status || 'IDLE'}</span>
                    
                    {selectedAgent === agent.id && (
                      <div className="mt-4 pt-3 border-t border-white/5 w-full flex flex-col gap-3 animate-in fade-in">
                        <p className="text-[9px] font-mono text-white/40 leading-relaxed text-center italic">
                          "{state?.currentTask || 'Monitoring neural pathways...'}"
                        </p>
                        <button className="w-full py-2 bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-[8px] font-black uppercase tracking-widest hover:bg-[#FFD700] hover:text-black transition-all">TERMINAL_UPLINK</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

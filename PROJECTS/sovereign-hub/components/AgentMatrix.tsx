// PROJECTS/sovereign-hub/components/AgentMatrix.tsx
"use client";

import React, { useEffect, useState } from 'react';
import type { AgentState } from '../lib/sovereign-native/adapter';

const AGENT_PFP_MAP: Record<string, string> = {
  alex: 'architect_v2.jpg',
  dev: 'developer_v2.jpg',
  sentinel: 'sentinel_v2.jpg',
  sam: 'sentinel_v2.jpg',
  main: 'nova_pfp.jpg',
  jordan: 'strategist_v2.jpg',
  maya: 'maya_v2.jpg',
  headchief: 'nova_pfp.jpg'
};

const AgentCard: React.FC<{ state: AgentState, onAction: (action: string) => void }> = ({ state, onAction }) => {
  const isBusy = state.status === 'BUSY' || state.status === 'ACTIVE' || state.status === 'PROCESSING';
  const [imgError, setImgError] = useState(false);
  
  const rawId = (state.agent_id || 'main').toLowerCase();
  const pfpFile = AGENT_PFP_MAP[rawId] || AGENT_PFP_MAP['main'];
  const profileImg = `/api/media?path=Documents/${pfpFile}`;

  return (
    <div className="p-5 glass-panel text-white transition-all duration-500 hover:scale-[1.02] active:scale-95 cursor-pointer relative overflow-hidden group">
      <div className="hud-corner tl !w-3 !h-3"></div>
      <div className="hud-corner br !w-3 !h-3 opacity-20"></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="w-16 h-16 bg-black/60 rounded-sm border border-[#FFD700]/20 relative overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.1)]">
          {!imgError ? (
            <img 
              src={profileImg} 
              alt={state.name || state.agent_id}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {state.emoji || (rawId === "alex" ? "🏗️" : rawId === "maya" ? "🎨" : rawId === "jordan" ? "📈" : rawId === "dev" ? "💻" : "🛡️")}
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[#FFD700]/5 pointer-events-none"></div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex gap-1.5 mb-3">
            {[1,2,3].map(i => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${isBusy ? 'bg-[#FFD700] animate-pulse' : 'bg-white/10'}`} style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          <span className={`text-[9px] font-mono tracking-[0.3em] font-black ${isBusy ? 'text-[#FFD700] drop-shadow-[0_0_5px_#FFD700]' : 'text-white/20'}`}>
            {state.status || 'IDLE'}
          </span>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-2">
          <h3 className="text-[13px] font-black font-cinzel tracking-[0.2em] text-[#FFD700] group-hover:text-white transition-colors">
            {(state.name || state.agent_id).toUpperCase()}
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[#FFD700]/20 to-transparent"></div>
        </div>
        <p className="text-[8px] font-mono text-[#A855F7] mb-5 uppercase tracking-widest opacity-60">Engine: {state.model_engine || 'NATIVE_V4'}</p>
        
        <div className="bg-black/80 border border-white/5 p-4 rounded-sm font-mono text-[11px] leading-relaxed text-white/70 min-h-[60px] flex items-start gap-4 relative overflow-hidden shadow-inner backdrop-blur-md">
          <span className="text-[#FFD700]/60 font-black">»</span>
          <p className="relative z-10 line-clamp-2">{state.active_task || 'Standing by for directives.'}</p>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500"></div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.03] flex justify-between items-center text-[8px] font-mono text-white/20 uppercase tracking-widest">
        <span className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isBusy ? 'bg-[#FFD700] shadow-[0_0_8px_#FFD700]' : 'bg-emerald-500 shadow-[0_0_8px_#10B981]'}`}></div>
          Neural_Link: Stable
        </span>
        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
          <button onClick={(e) => { e.stopPropagation(); onAction('restart'); }} className="text-emerald-500 hover:text-emerald-400 font-black">REBOOT</button>
          <button onClick={(e) => { e.stopPropagation(); onAction('terminate'); }} className="text-rose-500 hover:text-rose-400 font-black">PURGE</button>
        </div>
      </div>
    </div>
  );
};

export const AgentMatrix: React.FC = () => {
  const [agents, setAgents] = useState<AgentState[]>([]);

  const fetchStates = async () => {
    try {
      const res = await fetch('/api/states');
      const data = await res.json();
      if (data.agents) setAgents(data.agents);
    } catch (e) {
      console.error("Failed to fetch agent states", e);
    }
  };

  useEffect(() => {
    fetchStates();
    const interval = setInterval(fetchStates, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (agentId: string, action: string) => {
    try {
      await fetch('/api/agents/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, action })
      });
      fetchStates();
    } catch (e) {}
  };

  return (
    <div className="grid grid-cols-1 gap-8 px-2">
      {agents.length > 0 ? (
        agents.map(agent => (
          <AgentCard key={agent.agent_id} state={agent} onAction={(action) => handleAction(agent.agent_id, action)} />
        ))
      ) : (
        <div className="text-center p-20 opacity-10 uppercase tracking-[0.5em] text-xs border border-dashed border-white/5 rounded-xl">
          Scanning_Swarm_Nodes...
        </div>
      )}
    </div>
  );
};

export default AgentMatrix;

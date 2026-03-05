// PROJECTS/sovereign-hub/components/AgentMatrix.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { AgentState, subscribeToAgentStates, updateAgentState } from '../lib/supabase';

const AGENTS: Omit<AgentState, 'status' | 'active_task' | 'last_updated'>[] = [
  { agent_id: 'alex-01', name: 'Alex', emoji: '🦾', model_engine: 'GPT-4o' },
  { agent_id: 'maya-02', name: 'Maya', emoji: '💻', model_engine: 'Claude 3.5 Sonnet' },
  { agent_id: 'jordan-03', name: 'Jordan', emoji: '🧩', model_engine: 'Gemini 1.5 Pro' },
  { agent_id: 'dev-04', name: 'Dev', emoji: '🚀', model_engine: 'Llama 3 70B' },
  { agent_id: 'sam-05', name: 'Sam', emoji: '🛡️', model_engine: 'Mistral Large 2' }
];

const INITIAL_STATES: AgentState[] = AGENTS.map(agent => ({
  ...agent,
  status: 'IDLE',
  active_task: 'Awaiting deployment...',
  last_updated: new Date().toISOString()
}));

const AgentCard: React.FC<{ state: AgentState }> = ({ state }) => {
  const isBusy = state.status === 'BUSY';
  const pulseClass = isBusy ? 'animate-pulse' : '';
  
  return (
    <div className={`p-4 glass-panel text-white ${pulseClass} border-gold-leaf/30 shadow-lg`}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-4xl">{state.emoji}</span>
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ 
            backgroundColor: isBusy ? 'var(--gold-leaf)' : '#444', 
            boxShadow: isBusy ? `0 0 10px var(--gold-leaf)` : 'none' 
          }}
        />
      </div>
      <div>
        <h3 className="text-xl font-bold font-cinzel tracking-widest text-gold-leaf">{state.name.toUpperCase()}</h3>
        <p className="text-xs font-poppins text-gray-400 mb-2">{state.model_engine}</p>
        <div className="bg-black/40 p-2 rounded text-sm font-poppins overflow-hidden text-ellipsis whitespace-nowrap">
          {state.active_task}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center text-[10px] font-poppins text-gold-leaf uppercase tracking-tighter opacity-70">
        <span>STATUS: {state.status}</span>
        <span>NOVA PROT: ACTIVE</span>
      </div>
    </div>
  );
};

export const AgentMatrix: React.FC = () => {
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_STATES);

  useEffect(() => {
    // Initial update to Supabase according to N.O.V.A protocol
    const initLogs = async () => {
      for (const agent of INITIAL_STATES) {
        await updateAgentState(agent);
      }
    };
    
    initLogs();

    const subscription = subscribeToAgentStates((payload) => {
      // In a real app, we update state based on payload
      console.log('Realtime Payload:', payload);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="p-2 min-h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1 gap-4">
        {agents.map(agent => (
          <AgentCard key={agent.agent_id} state={agent} />
        ))}
      </div>
    </div>
  );
};

export default AgentMatrix;

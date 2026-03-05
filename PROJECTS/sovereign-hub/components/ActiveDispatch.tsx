'use client';

import React, { useState } from 'react';
import './Dispatch.css';

interface Agent {
  id: string;
  name: string;
  icon: string;
  color: string;
  aura: string;
}

const agents: Agent[] = [
  { id: 'alex', name: 'Alex', icon: '🏗️', color: 'blue', aura: '#00F2FF' },
  { id: 'maya', name: 'Maya', icon: '🎨', color: 'magenta', aura: '#FF00FF' },
  { id: 'jordan', name: 'Jordan', icon: '📋', color: 'emerald', aura: '#50FFAB' },
  { id: 'dev', name: 'Dev', icon: '💻', color: 'gold', aura: '#FFD700' },
  { id: 'sam', name: 'Sam', icon: '🛡️', color: 'crimson', aura: '#FF2A2A' },
];

export const ActiveDispatch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDispatching, setIsDispatching] = useState<string | null>(null);

  const handleDispatch = async (agent: Agent) => {
    setIsDispatching(agent.id);
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.id, agentName: agent.name }),
      });
      const data = await response.json();
      if (data.success) {
        console.log(`Successfully dispatched ${agent.name}`);
      }
    } catch (error) {
      console.error('Failed to dispatch:', error);
    } finally {
      setIsDispatching(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="aureum-dispatch-container fixed bottom-10 right-10 z-50">
      {isOpen && (
        <div className="agent-flyout absolute bottom-20 right-0 mb-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex flex-row gap-6 items-end p-6 glass-morphism border-l-2 border-[#D4AF37]">
            {agents.map((agent) => (
              <button
                key={agent.id}
                className={`agent-btn aura-${agent.color} group relative`}
                onClick={() => handleDispatch(agent)}
                disabled={isDispatching !== null}
              >
                <span className="icon text-4xl mb-2 transition-all duration-300 group-hover:scale-125">
                  {agent.icon}
                </span>
                <span className="name text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#D4AF37]/70 group-hover:text-[#D4AF37]">
                  {agent.name}
                </span>
                {isDispatching === agent.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent animate-spin rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        className={`dispatch-trigger ${isOpen ? 'active' : ''} group relative px-8 py-4 font-cinzel tracking-[0.3em] overflow-hidden`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="relative z-10">ACTIVE DISPATCH</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
      </button>
    </div>
  );
};

// PROJECTS/sovereign-hub/components/SkillMarketplace.tsx
"use client";

import React, { useEffect, useState } from 'react';

interface Skill {
  name: string;
  path: string;
  source: 'SYSTEM' | 'USER';
}

export const SkillMarketplace: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [skRes, agRes] = await Promise.all([
        fetch('/api/skills'),
        fetch('/api/states')
      ]);
      const skData = await skRes.json();
      const agData = await agRes.json();
      if (skData.skills) setSkills(skData.skills);
      if (agData.agents) setAgents(agData.agents);
    } catch (e) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEquip = async (agentId: string, skillName: string) => {
    setLoading(`${agentId}-${skillName}`);
    try {
      await fetch('/api/agents/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, skillName })
      });
      await fetchData();
    } catch (e) {
      console.error("Equip failed", e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="h-full flex flex-col gap-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto pr-4 custom-scrollbar">
        {skills.map((skill) => (
          <div key={skill.path} className="p-8 border border-white/5 bg-black/40 hover:border-[#FFD700]/30 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[8px] font-black px-3 py-1 rounded bg-white/5 text-white/40 uppercase tracking-widest`}>
                  {skill.source}
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]"></div>
              </div>
              <h4 className="text-[14px] font-black text-white group-hover:text-[#FFD700] transition-colors uppercase tracking-[0.2em] font-cinzel">
                {skill.name.replace(/-/g, '_')}
              </h4>
              <p className="text-[8px] font-mono text-white/20 mt-4 truncate">{skill.path}</p>
            </div>

            <div className="mt-10">
              <p className="text-[7px] font-mono text-white/30 uppercase mb-4 tracking-widest">Assign_to_Node:</p>
              <div className="flex flex-wrap gap-2">
                {agents.map(agent => (
                  <button
                    key={agent.agent_id}
                    disabled={loading === `${agent.agent_id}-${skill.name}`}
                    onClick={() => handleEquip(agent.agent_id, skill.name)}
                    className="px-3 py-1.5 border border-white/10 text-[8px] font-black uppercase text-white/40 hover:text-[#FFD700] hover:border-[#FFD700]/40 transition-all"
                  >
                    {agent.agent_id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillMarketplace;

// PROJECTS/sovereign-hub/components/ProjectNexus.tsx
"use client";

import React, { useEffect, useState } from 'react';
import type { Project } from '../lib/sovereign-native/adapter';

export const ProjectNexus: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
    } catch (e) {}
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col gap-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 overflow-y-auto pr-4 custom-scrollbar">
        {projects.map((project) => (
          <div key={project.id} className="glass-panel p-10 relative overflow-hidden group border-white/5 hover:border-[#FFD700]/20 transition-all duration-700">
            <div className="hud-corner tl opacity-40"></div>
            <div className="hud-corner br opacity-40"></div>
            
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <h3 className="text-2xl font-black font-cinzel text-white group-hover:text-[#FFD700] transition-colors tracking-widest">{project.name}</h3>
                <p className="text-[10px] font-mono text-white/30 uppercase mt-2 tracking-[0.4em]">Node_Ref: 0X-{project.name.substring(0,4)}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-[#A855F7] tracking-widest border border-[#A855F7]/20 px-3 py-1 bg-[#A855F7]/5">{project.meta?.status || 'STABLE'}</span>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">Construction_Progress</span><span className="text-white">{project.meta?.progress}%</span></div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.4)] transition-all duration-1000" style={{ width: `${project.meta?.progress}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                <div>
                  <span className="text-[8px] font-mono text-white/20 uppercase block mb-1">ROI_Forecast</span>
                  <span className="text-lg font-black text-[#FFD700] font-michroma">{project.meta?.roi || 'TBD'}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-white/20 uppercase block mb-1">Uptime</span>
                  <span className="text-lg font-black text-white font-michroma">99.9%</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-white/20 uppercase block mb-1">Resource_Load</span>
                  <span className="text-lg font-black text-white font-michroma">LOW</span>
                </div>
              </div>
            </div>

            {/* Hover Action */}
            <div className="mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button className="w-full py-4 bg-[#FFD700]/5 border border-[#FFD700]/20 text-[#FFD700] text-[10px] font-black uppercase tracking-[0.5em] hover:bg-[#FFD700] hover:text-black transition-all">Open_Project_Core_</button>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/[0.02] to-transparent pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectNexus;

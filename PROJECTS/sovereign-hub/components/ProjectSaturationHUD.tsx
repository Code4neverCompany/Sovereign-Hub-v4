// PROJECTS/sovereign-hub/components/ProjectSaturationHUD.tsx
"use client";

import React, { useEffect, useState } from 'react';
import type { Project } from '../lib/sovereign-native/adapter';

export const ProjectSaturationHUD: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
    } catch (e) {
      console.error("Failed to fetch projects", e);
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12">
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id} className="group cursor-default relative">
            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse shadow-[0_0_8px_#FFD700]"></div>
                  <h4 className="text-[12px] font-black text-white group-hover:text-[#FFD700] transition-colors tracking-widest uppercase font-cinzel">
                    {project.name}
                  </h4>
                </div>
                <p className="text-[7px] font-mono text-white/20 uppercase tracking-widest pl-4">
                  Status: <span className="text-white/40">{project.meta?.status || 'UNKNOWN'}</span> // ROI: <span className="text-[#FFD700]">{project.meta?.roi || 'TBD'}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[16px] font-black font-michroma text-white group-hover:text-[#FFD700] transition-all">
                  {project.meta?.progress || 0}<span className="text-[9px] opacity-30 ml-1">%</span>
                </span>
              </div>
            </div>
            
            <div className="h-1 w-full bg-white/5 relative overflow-hidden rounded-full border border-white/[0.03] ml-4">
              <div 
                className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out bg-[#FFD700]"
                style={{ 
                  width: `${project.meta?.progress || 0}%`, 
                  boxShadow: `0 0 15px rgba(255, 215, 0, 0.4)`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shine_2s_infinite]"></div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center opacity-10 uppercase text-[8px] tracking-[0.5em] py-10">
          Awaiting_Project_Manifests...
        </div>
      )}

      <style jsx>{`
        @keyframes shine { to { transform: translateX(300%); } }
      `}</style>
    </div>
  );
};

export default ProjectSaturationHUD;

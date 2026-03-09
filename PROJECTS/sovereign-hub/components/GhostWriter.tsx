// PROJECTS/sovereign-hub/components/GhostWriter.tsx
"use client";

import React from 'react';
import type { SnapshotEntry } from '../lib/sovereign-native/adapter';

interface Props {
  snapshot: SnapshotEntry | null;
}

export const GhostWriter: React.FC<Props> = ({ snapshot }) => {
  if (!snapshot) return (
    <div className="h-full flex items-center justify-center opacity-10 uppercase tracking-[0.5em] text-xs">
      Awaiting_Temporal_Data...
    </div>
  );

  const renderDiff = (patch: string) => {
    if (!patch) return <div className="text-white/20 italic">// No workspace changes in this step.</div>;
    
    const lines = patch.split('\n');
    return (
      <div className="font-mono text-[10px] leading-relaxed">
        {lines.map((line, i) => {
          let bgColor = 'transparent';
          let textColor = 'rgba(255,255,255,0.4)';
          
          if (line.startsWith('+') && !line.startsWith('+++')) {
            bgColor = 'rgba(16, 185, 129, 0.1)';
            textColor = '#10B981';
          } else if (line.startsWith('-') && !line.startsWith('---')) {
            bgColor = 'rgba(239, 68, 68, 0.1)';
            textColor = '#EF4444';
          } else if (line.startsWith('@@')) {
            textColor = '#8B5CF6';
            bgColor = 'rgba(139, 92, 246, 0.05)';
          }

          return (
            <div key={i} style={{ backgroundColor: bgColor, color: textColor }} className="px-2 border-l-2 border-transparent">
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-8 overflow-hidden animate-in fade-in duration-500">
      
      {/* 🧠 THOUGHT STREAM REPLAY */}
      <div className="flex-1 glass-panel p-8 flex flex-col gap-6 border-white/5 overflow-hidden relative">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]"></div>
            <h3 className="text-[11px] font-black tracking-[0.4em] uppercase text-white/60 font-cinzel">Thought_Sequence</h3>
          </div>
          <span className="text-[9px] font-mono text-white/20 tracking-widest">AGENT_{snapshot.agent_id.toUpperCase()} // STEP_{snapshot.step_index}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[13px] leading-relaxed text-white/90 italic p-4 bg-black/20 rounded-lg">
          <span className="text-[#FFD700] mr-4 font-black">{">>"}</span>
          {snapshot.event_type === 'THOUGHT' ? (
            <p className="inline">{snapshot.payload?.text || "Analyzing current workspace parameters..."}</p>
          ) : snapshot.event_type === 'TOOL_CALL' ? (
            <p className="inline text-[#8B5CF6]">Executing Tool: [{snapshot.payload?.tool}] with parameters: {JSON.stringify(snapshot.payload?.args)}</p>
          ) : snapshot.event_type === 'TOOL_RESULT' ? (
            <p className="inline text-emerald-400">Tool Result Received: {JSON.stringify(snapshot.payload?.result).substring(0, 200)}...</p>
          ) : (
            <p className="inline opacity-40">System Event: {snapshot.event_type}</p>
          )}
        </div>
        
        {/* Decorative HUD Elements */}
        <div className="absolute bottom-4 right-8 opacity-10 font-mono text-[8px] uppercase tracking-[0.5em]">
          Trace_Active_Sync
        </div>
      </div>

      {/* 📄 GHOST-WRITER WORKSPACE DIFF */}
      <div className="h-[40%] glass-panel p-8 border-[#A855F7]/10 relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">Ghost-Writer // Workspace_Diff</h3>
          {snapshot.workspace_diff?.path && (
            <span className="text-[8px] font-mono text-[#A855F7] bg-[#A855F7]/10 px-3 py-1 rounded-full border border-[#A855F7]/20">
              FILE: {snapshot.workspace_diff.path}
            </span>
          )}
        </div>
        
        <div className="flex-1 bg-black/40 border border-white/5 rounded-lg overflow-y-auto custom-scrollbar p-6">
          {renderDiff(snapshot.workspace_diff?.patch)}
        </div>

        {/* Scanline FX */}
        <div className="scanline"></div>
      </div>

    </div>
  );
};

export default GhostWriter;

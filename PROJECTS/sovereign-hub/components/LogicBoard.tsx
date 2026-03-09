// PROJECTS/sovereign-hub/components/LogicBoard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import type { Task } from '../lib/sovereign-native/adapter';

export const LogicBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (data.tasks) setTasks(data.tasks);
    } catch (e) {
      console.error("Failed to fetch tasks", e);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMove = async (id: string, status: string) => {
    setLoading(id);
    try {
      await fetch('/api/tasks/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      await fetchTasks();
    } catch (e) {
      console.error("Task update failed", e);
    } finally {
      setLoading(null);
    }
  };

  const columns = [
    { id: 'INBOX', label: 'Neural_Inbox' },
    { id: 'PROGRESS', label: 'Active_Processing' },
    { id: 'REVIEW', label: 'Quality_Gate' },
    { id: 'DONE', label: 'Finalized' }
  ];

  return (
    <div className="flex-1 flex gap-10 overflow-x-auto pb-10 custom-scrollbar min-h-0 pt-10">
      {columns.map((col, colIdx) => (
        <div key={col.id} className="flex-1 min-w-[350px] flex flex-col gap-10">
          <div className="flex justify-between items-center px-4 border-b border-white/5 pb-6">
            <h3 className="text-[11px] font-black tracking-[0.5em] uppercase text-white/40 font-cinzel">
              {col.label}
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-mono text-[#FFD700]/40 bg-[#FFD700]/5 px-3 py-1 rounded-sm border border-[#FFD700]/10">
                {tasks.filter(t => (t.status || 'INBOX') === col.id).length}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {tasks.filter(t => (t.status || 'INBOX') === col.id).map((task) => (
              <div 
                key={task.id} 
                className={`glass-panel p-8 relative overflow-hidden group border-white/5 hover:border-[#FFD700]/20 transition-all duration-700 ${loading === task.id ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="hud-corner tl !w-2 !h-2 opacity-40"></div>
                <div className="hud-corner br !w-2 !h-2 opacity-40"></div>

                <div className="flex justify-between items-start mb-6">
                  <span className={`text-[8px] font-black px-3 py-1 rounded border ${
                    task.priority === 'HIGH' || task.priority === 'CRITICAL' ? 'text-rose-500 border-rose-500/30 bg-rose-500/5' : 
                    task.priority === 'MEDIUM' ? 'text-amber-500 border-amber-500/30 bg-amber-500/5' : 
                    'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
                  }`}>
                    {task.priority || 'MEDIUM'}
                  </span>
                  <span className="text-[9px] font-mono text-white/10 tracking-widest">SEQ_0X{task.id.toUpperCase()}</span>
                </div>
                
                <h4 className="text-[13px] font-bold text-white/90 leading-relaxed mb-8 group-hover:text-white transition-colors uppercase tracking-widest font-rajdhani">
                  {task.description}
                </h4>

                <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/[0.03]">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-black border border-[#FFD700]/20 flex items-center justify-center text-[10px] font-black text-[#FFD700] shadow-[0_0_10px_#FFD70033]">
                      {(task.agentId || 'S')[0].toUpperCase()}
                    </div>
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest group-hover:text-[#A855F7] transition-colors">{task.agentId || 'SOVEREIGN'}</span>
                  </div>
                  
                  {/* Quick Shift Controls */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {colIdx > 0 && (
                      <button onClick={() => handleMove(task.id, columns[colIdx-1].id)} className="w-6 h-6 border border-white/10 flex items-center justify-center text-[10px] hover:border-[#FFD700] transition-colors text-white/20">{'<'}</button>
                    )}
                    {colIdx < columns.length - 1 && (
                      <button onClick={() => handleMove(task.id, columns[colIdx+1].id)} className="w-6 h-6 border border-white/10 flex items-center justify-center text-[10px] hover:border-[#FFD700] transition-colors text-white/20">{'>'}</button>
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none"></div>
              </div>
            ))}
            
            {tasks.filter(t => (t.status || 'INBOX') === col.id).length === 0 && (
              <div className="h-32 border border-dashed border-white/5 rounded-xl flex items-center justify-center opacity-10 uppercase text-[10px] tracking-[0.6em]">
                Empty_Stack
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LogicBoard;

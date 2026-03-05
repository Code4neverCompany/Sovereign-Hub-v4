// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { StreamViewer } from '../components/StreamViewer';
import { AgentMatrix } from '../components/AgentMatrix';
import SystemHealth from '../components/SystemHealth';
import { SentinelTraceHUD } from '../components/SentinelTraceHUD';
import LogicTree from '../components/LogicTree';
import { ActiveDispatch } from '../components/ActiveDispatch';
import { logToSupabase } from '../lib/supabase';

export default function Home() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initial Connection Success Log (Supabase first!)
        logToSupabase({
            agent_id: 'SYSTEM',
            message: 'Aureum Core Connection: ESTABLISHED. Sentinel Trace Active.',
            level: 'INFO',
            timestamp: new Date().toISOString()
        });
    }, []);

    if (!mounted) return null;

    return (
        <main className="flex min-h-screen bg-[#0A0A0A] p-8 text-white relative flex-col overflow-x-hidden">
            {/* Global Cyan Glow Atmosphere */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,255,255,0.02)_100%)]"></div>

            {/* Top Health Bar */}
            <div className="w-full mb-6 z-20">
              <SystemHealth />
            </div>

            {/* HUD Content Area */}
            <div className="flex flex-col flex-1 max-w-[1800px] mx-auto space-y-8 w-full z-20">
                
                {/* HUD Header */}
                <div className="flex items-end justify-between border-b-2 border-[#C5A059] pb-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tighter text-[#C5A059] uppercase drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]">
                            Sovereign Command Center
                        </h1>
                        <p className="text-xs font-mono text-gray-500 uppercase mt-1">
                            Aureum HUD Terminal // Protocol N.O.V.A Active
                        </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-[#00FFFF] animate-pulse">SYSTEM SENTINEL V1.0</p>
                    </div>
                </div>

                {/* Main HUD Layout */}
                <div className="grid grid-cols-12 gap-8 flex-1">
                    
                    {/* Left: Agent Matrix (takes up full width on small, 4/12 on large) */}
                    <div className="col-span-12 xl:col-span-4 space-y-8">
                       <section className="border border-[#C5A059]/20 p-4 rounded bg-[#0A0A0A]/40 backdrop-blur-md relative">
                          <h2 className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-4">Agent Matrix // Neural Links</h2>
                          {/* We might need to adjust AgentMatrix to not have its own full page styling if it does */}
                          <div className="max-h-[800px] overflow-y-auto custom-scrollbar">
                            <AgentMatrix />
                          </div>
                       </section>
                    </div>

                    {/* Right: Intel Stream & Sentinel Trace HUD */}
                    <div className="col-span-12 xl:col-span-8 flex flex-col space-y-8">
                        
                        {/* Stream Hub */}
                        <div className="flex-1 min-h-[500px] border border-[#C5A059]/20 rounded-lg overflow-hidden relative">
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-50 z-20" />
                             <StreamViewer />
                        </div>

                        {/* Sentinel Trace HUD & Logic Infrastructure */}
                        <div className="grid grid-cols-2 gap-4 h-[300px]">
                            <SentinelTraceHUD />
                            <LogicTree />
                        </div>

                    </div>
                </div>
            </div>

            <ActiveDispatch />

            <style jsx global>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(197, 160, 89, 0.05);
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #C5A059;
                border-radius: 10px;
              }
            `}</style>
        </main>
    );
}

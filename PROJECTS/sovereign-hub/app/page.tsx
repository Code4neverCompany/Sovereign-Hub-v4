// PROJECTS/sovereign-hub/app/page.tsx
"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import AgentMatrix from '../components/AgentMatrix';
import StreamViewer from '../components/StreamViewer';
import ActiveDispatch from '../components/ActiveDispatch';
import ProjectSaturationHUD from '../components/ProjectSaturationHUD';
import SystemHealth from '../components/SystemHealth';
import LogicBoard from '../components/LogicBoard';
import GovernanceCenter from '../components/GovernanceCenter';
import SkillMarketplace from '../components/SkillMarketplace';
import MemoryBrowser from '../components/MemoryBrowser';
import ProjectNexus from '../components/ProjectNexus';
import ChronoScrubber from '../components/ChronoScrubber';
import GhostWriter from '../components/GhostWriter';
import type { SnapshotEntry } from '../lib/sovereign-native/adapter';

const Office3D = dynamic(() => import('../components/Office3D/Office3D'), { 
  ssr: false,
  loading: () => <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2, fontSize: '10px', letterSpacing: '0.5em' }}>BOOTING_SPATIAL_SYNC...</div>
});

type Tab = 'matrix' | 'nexus' | 'logic' | 'trace' | 'governance' | 'skills' | 'memory';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('matrix'); 
  const [currentSnapshot, setCurrentSnapshot] = useState<SnapshotEntry | null>(null);

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#020105', color: '#FFFFF0', fontFamily: 'Rajdhani, sans-serif', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* 🔱 TACTICAL NAVIGATION HEADER */}
      <header style={{ 
        height: '90px', width: '100%', display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', padding: '0 60px', backgroundColor: 'rgba(0,0,0,0.9)', 
        backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,215,0,0.1)', zIndex: 100 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '50px', height: '50px', border: '2px solid #FFD700', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(255,215,0,0.2)' 
            }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#FFD700', fontFamily: 'Cinzel' }}>4</span>
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '0.6em', color: '#FFD700', margin: 0, fontFamily: 'Cinzel' }}>SOVEREIGN HUB</h1>
              <div style={{ display: 'flex', gap: '15px', marginTop: '4px', alignItems: 'center' }}>
                <span style={{ fontSize: '8px', color: '#10B981', letterSpacing: '0.3em', opacity: 0.8 }}>UPLINK: NOMINAL</span>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }}></div>
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '30px', marginLeft: '20px' }}>
            {['matrix', 'nexus', 'logic', 'trace', 'governance', 'skills', 'memory'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as Tab)}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '9px', 
                  fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase',
                  color: activeTab === tab ? '#FFD700' : 'rgba(255,255,255,0.2)',
                  borderBottom: activeTab === tab ? '2px solid #FFD700' : '2px solid transparent',
                  paddingBottom: '6px', transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ textAlign: 'right', minWidth: '200px' }}>
          <p style={{ fontSize: '7px', letterSpacing: '0.4em', margin: 0, color: 'rgba(255,255,255,0.2)', marginBottom: '4px' }}>KERNEL_AUTHORITY_VERIFIED</p>
          <p style={{ fontSize: '10px', fontWeight: 900, color: '#A855F7', margin: 0, letterSpacing: '0.1em' }}>MASTER4NEVER // 4NEVERHIVE</p>
        </div>
      </header>

      {/* 📊 MISSION CONTROL INTERFACE */}
      <main style={{ 
        flex: 1, padding: '40px 60px 100px 60px', display: 'flex', flexDirection: 'column', minHeight: 0 
      }}>
        
        {activeTab === 'matrix' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '40px', height: '100%', minHeight: 0 }}>
            {/* 🟦 LEFT: SWARM TELEMETRY */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '30px', overflow: 'hidden' }}>
              <div className="glass-panel" style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', borderRadius: '15px', position: 'relative', minHeight: 0 }}>
                <div className="hud-corner tl" style={{ opacity: 0.4 }}></div>
                <h3 style={{ fontSize: '9px', letterSpacing: '0.6em', color: 'rgba(255,215,0,0.4)', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>SWARM_PRESENCE</h3>
                <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar pr-2">
                  <AgentMatrix />
                </div>
              </div>
            </aside>

            {/* 🟧 CENTER: COMMAND CORE */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '40px', minHeight: 0 }}>
              <div style={{ flex: 3, borderRadius: '25px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 0 60px rgba(0,0,0,0.8)', position: 'relative', backgroundColor: '#000' }}>
                <Office3D />
                <div className="hud-corner tl" style={{ width: '40px', height: '40px', opacity: 0.2 }}></div>
                <div className="hud-corner tr" style={{ width: '40px', height: '40px', opacity: 0.2 }}></div>
                <div className="hud-corner bl" style={{ width: '40px', height: '40px', opacity: 0.2 }}></div>
                <div className="hud-corner br" style={{ width: '40px', height: '40px', opacity: 0.2 }}></div>
                <div className="scanline" style={{ opacity: 0.02 }}></div>
              </div>
              
              <div style={{ flex: 2, borderRadius: '25px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                <StreamViewer />
              </div>
            </section>

            {/* 🟪 RIGHT: OPS HUB */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '40px', overflow: 'hidden' }}>
              <ActiveDispatch />
              <div className="glass-panel" style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', borderRadius: '15px', position: 'relative', minHeight: 0 }}>
                <div className="hud-corner tr" style={{ opacity: 0.4 }}></div>
                <h3 style={{ fontSize: '9px', letterSpacing: '0.6em', color: 'rgba(255,215,0,0.4)', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>SATURATION_INDEX</h3>
                <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar pr-2">
                  <ProjectSaturationHUD />
                </div>
                <div style={{ marginTop: '30px', paddingTop: '25px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em' }}>ROI_INDEX</span>
                    <p style={{ fontSize: '24px', fontWeight: 900, color: '#FFD700', margin: '5px 0 0 0', fontFamily: 'Michroma' }}>+312%</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em' }}>WORKERS</span>
                    <p style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', margin: '5px 0 0 0', fontFamily: 'Michroma' }}>06</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeTab === 'nexus' && <div className="h-full animate-in"><ProjectNexus /></div>}
        {activeTab === 'logic' && <div className="h-full animate-in"><LogicBoard /></div>}
        
        {activeTab === 'trace' && (
          <div className="h-full flex flex-col gap-10 min-h-0 animate-in">
            <ChronoScrubber sessionId="main" onStepChange={setCurrentSnapshot} />
            <div className="flex-1 min-h-0">
              <GhostWriter snapshot={currentSnapshot} />
            </div>
          </div>
        )}

        {activeTab === 'governance' && <div className="h-full animate-in"><GovernanceCenter /></div>}
        {activeTab === 'skills' && <div className="h-full animate-in"><SkillMarketplace /></div>}
        {activeTab === 'memory' && <div className="h-full animate-in"><MemoryBrowser /></div>}

      </main>

      <SystemHealth />

      <style jsx global>{`
        @keyframes scan { from { background-position: 0 0; } to { background-position: 0 100vh; } }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #8B5CF6, #FFD700); border-radius: 10px; }
        .glass-panel { background: rgba(10, 5, 25, 0.75); backdrop-filter: blur(25px); }
        .animate-in { animation: fade-in 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

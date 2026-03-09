// PROJECTS/sovereign-hub/components/GovernanceCenter.tsx
"use client";

import React, { useEffect, useState } from 'react';
import type { ApprovalRequest } from '../lib/sovereign-native/adapter';

export const GovernanceCenter: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [appRes, confRes] = await Promise.all([
        fetch('/api/approvals'),
        fetch('/api/config')
      ]);
      const appData = await appRes.json();
      const confData = await confRes.json();
      if (appData.approvals) setApprovals(appData.approvals);
      if (confData.config) setConfig(confData.config);
    } catch (e) {}
  };

  const handleResolve = async (id: string, status: 'APPROVED' | 'DENIED') => {
    setLoading(id);
    try {
      await fetch('/api/approvals/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      await fetchData();
    } catch (e) {
      console.error("Failed to resolve approval", e);
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', height: '100%', minHeight: 0 }}>
      
      {/* 🛡️ PENDING APPROVALS */}
      <div className="glass-panel" style={{ padding: '30px', borderRadius: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <h3 style={{ fontSize: '10px', letterSpacing: '0.5em', color: '#FFD700', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
          PENDING_APPROVALS
        </h3>
        <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar pr-2">
          {approvals.filter(a => a.status === 'PENDING').length > 0 ? (
            approvals.filter(a => a.status === 'PENDING').map((req) => (
              <div key={req.id} className="p-5 border border-white/5 bg-black/20 mb-4 group animate-in">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[7px] font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 uppercase tracking-widest">Action_Required</span>
                  <span className="text-[8px] font-mono text-white/20">AGENT_{req.agent_id.toUpperCase()}</span>
                </div>
                <h4 className="text-[11px] font-bold text-white mb-2 uppercase tracking-widest">{req.action}</h4>
                <div className="bg-black/40 p-3 rounded font-mono text-[9px] text-white/40 mb-6 break-all">
                  {JSON.stringify(req.payload)}
                </div>
                <div className="flex gap-4">
                  <button 
                    disabled={loading === req.id}
                    onClick={() => handleResolve(req.id, 'APPROVED')}
                    className="flex-1 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[8px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    {loading === req.id ? 'Processing...' : 'Approve_'}
                  </button>
                  <button 
                    disabled={loading === req.id}
                    onClick={() => handleResolve(req.id, 'DENIED')}
                    className="flex-1 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-[8px] font-black uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-black transition-all"
                  >
                    {loading === req.id ? '...' : 'Deny_'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', opacity: 0.1, marginTop: '100px', fontSize: '10px', letterSpacing: '0.5em' }}>NO_PENDING_REQUESTS</div>
          )}
        </div>
      </div>

      {/* ⚙️ SYSTEM CONFIGURATION */}
      <div className="glass-panel" style={{ padding: '30px', borderRadius: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <h3 style={{ fontSize: '10px', letterSpacing: '0.5em', color: '#A855F7', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
          SYSTEM_CONFIGURATION
        </h3>
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '25px' }} className="custom-scrollbar">
          {config ? (
            <pre style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
              {JSON.stringify(config, null, 2)}
            </pre>
          ) : (
            <div style={{ textAlign: 'center', opacity: 0.1, marginTop: '100px', fontSize: '10px', letterSpacing: '0.5em' }}>CONNECTING_CONFIG_WARDEN...</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default GovernanceCenter;

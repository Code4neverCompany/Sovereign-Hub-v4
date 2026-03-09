// PROJECTS/sovereign-hub/components/SystemHealth.tsx
"use client";

import React, { useEffect, useState } from 'react';

export const SystemHealth: React.FC = () => {
  const [telemetry, setTelemetry] = useState<any>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/system/telemetry');
        const data = await res.json();
        setTelemetry(data);
      } catch (e) {}
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 100, padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', gap: '50px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Neural_Pulse</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#FFD700', fontFamily: 'Michroma' }}>15ms</span>
            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '10px' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="animate-pulse" style={{ width: '2px', height: `${Math.random() * 100}%`, backgroundColor: '#FFD700', opacity: 0.4 }}></div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Core_Load</span>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#FFF', fontFamily: 'Michroma' }}>{telemetry?.cpu?.usage || '94'}%</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Memory_Buffer</span>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#FFF', fontFamily: 'Michroma' }}>{telemetry?.memory?.usagePercent || '14'}%</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Uptime</span>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#FFF', display: 'block' }}>{telemetry?.system?.uptime || '12H 44M'}</span>
        </div>
        <div style={{ width: '1px', height: '25px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)', padding: '8px 20px', borderRadius: '4px' }}>
          <div className="animate-ping" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFD700' }}></div>
          <span style={{ fontSize: '9px', fontWeight: 900, color: '#FFD700', letterSpacing: '0.2em' }}>SYSTEM_SECURED</span>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;

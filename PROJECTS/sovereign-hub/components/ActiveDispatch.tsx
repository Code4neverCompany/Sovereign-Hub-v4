// PROJECTS/sovereign-hub/components/ActiveDispatch.tsx
"use client";

import React, { useState } from 'react';

export const ActiveDispatch: React.FC = () => {
  const [directive, setDirective] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleTransmit = async () => {
    if (!directive.trim()) return;
    setIsSending(true);
    
    try {
      await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: 'main',
          agentName: 'SOVEREIGN',
          description: directive,
          priority: 'URGENT'
        })
      });
      setDirective('');
    } catch (e) {
      console.error("Transmission Failed", e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,215,0,0.05)', display: 'flex', flexDirection: 'column', gap: '25px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.5)', margin: 0, fontFamily: 'Cinzel' }}>MISSION_BROADCAST</h3>
        <div style={{ width: '30px', height: '1px', backgroundColor: 'rgba(255,215,0,0.2)' }}></div>
      </div>

      <textarea 
        value={directive}
        onChange={(e) => setDirective(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleTransmit())}
        style={{ 
          width: '100%', height: '120px', backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,215,0,0.1)', 
          padding: '20px', fontFamily: 'monospace', fontSize: '11px', color: '#FFD700', outline: 'none', 
          resize: 'none', borderRadius: '10px'
        }}
        placeholder="ENTER_IMPERIAL_DIRECTIVE..."
        disabled={isSending}
      />

      <button 
        onClick={handleTransmit}
        disabled={isSending || !directive.trim()}
        style={{ 
          width: '100%', padding: '18px', backgroundColor: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)',
          color: '#FFD700', fontWeight: 900, fontSize: '10px', letterSpacing: '0.5em', textTransform: 'uppercase',
          cursor: isSending ? 'wait' : 'pointer', transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => !isSending && (e.currentTarget.style.backgroundColor = 'rgba(255,215,0,0.15)')}
        onMouseLeave={(e) => !isSending && (e.currentTarget.style.backgroundColor = 'rgba(255,215,0,0.05)')}
      >
        {isSending ? 'TRANSMITTING...' : 'EXECUTE_MISSION'}
      </button>
      
      {/* Background Decor */}
      <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '100px', height: '100px', backgroundColor: 'rgba(255,215,0,0.02)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
    </div>
  );
};

export default ActiveDispatch;

'use client';

import { useEffect, useState } from 'react';

export default function SystemHealth() {
  const [health, setHealth] = useState({ tailscale: 'UNKNOWN', node: 'UNKNOWN' });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setHealth(data);
      } catch (err) {
        setHealth({ tailscale: 'ERROR', node: 'OFFLINE' });
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 p-2 bg-black text-xs font-mono border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">TAILSCALE:</span>
        <span className={health.tailscale === 'ONLINE' ? 'text-green-500' : 'text-red-500'}>
          {health.tailscale}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">NODE:</span>
        <span className={health.node === 'ONLINE' ? 'text-green-500' : 'text-red-500'}>
          {health.node}
        </span>
      </div>
    </div>
  );
}

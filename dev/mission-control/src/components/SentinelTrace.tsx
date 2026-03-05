'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TemporalEngine, NeuralSnapshot } from '../lib/TemporalEngine';

export default function SentinelTrace() {
  const [snapshots, setSnapshots] = useState<NeuralSnapshot[]>([]);
  const [currentSnapshot, setCurrentSnapshot] = useState<NeuralSnapshot | null>(null);
  const [seekPos, setSeekPos] = useState(0);
  const engineRef = useRef<TemporalEngine | null>(null);

  const sessionId = 'd290f1ee-6c54-4b01-90e6-d701748f0851'; // SH-1000 Mock Session ID

  useEffect(() => {
    const engine = new TemporalEngine(sessionId);
    engineRef.current = engine;

    const fetchTrace = async () => {
      const data = await engine.fetchSnapshots();
      setSnapshots(data);
      if (data.length > 0) {
        setCurrentSnapshot(data[0]);
      }
    };

    fetchTrace();
  }, [sessionId]);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSeekPos(val);
    const snapshot = engineRef.current?.seek(val);
    if (snapshot) {
      setCurrentSnapshot(snapshot);
    }
  };

  if (snapshots.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gold/40 italic">
        [ Sentinel Trace Scanning... ]
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full p-6 glass rounded-2xl border-cyan/10">
      {/* Chrono-Scrubber Timeline */}
      <div className="scrubber-container glass-card p-6 h-32 relative flex flex-col justify-center border border-white/5 rounded-xl">
        <div className="timeline-track h-1 bg-cyan/10 rounded-full relative w-full flex items-center">
          <input
            type="range"
            min="0"
            max={snapshots.length - 1}
            value={seekPos}
            onChange={handleScrub}
            className="w-full h-1 bg-transparent appearance-none cursor-pointer accent-gold hover:accent-cyan transition-all"
          />
          {/* Heat Markers (Simplified) */}
          {snapshots.map((s, idx) => (
            s.event_type !== 'THOUGHT' && (
              <div
                key={idx}
                className="absolute w-1 h-1 bg-cyan shadow-[0_0_8px_#00FFFF] rounded-full"
                style={{ left: `${(idx / (snapshots.length - 1)) * 100}%` }}
              ></div>
            )
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[10px] mono text-white/20 uppercase">
          <span>T_0</span>
          <span className="text-gold">STEP_INDEX: {seekPos} // {currentSnapshot?.event_type}</span>
          <span>T_MAX</span>
        </div>
      </div>

      {/* Diff & Logic Unit (Mock Split-Pane for now) */}
      <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden min-h-[300px]">
        <div className="diff-pane glass-card p-6 flex flex-col border border-white/5 rounded-xl bg-black/40 overflow-hidden">
          <h4 className="text-[10px] text-gold/40 uppercase font-mono mb-4 flex justify-between">
            <span>Origin_State</span>
            <span className="text-[8px] opacity-60">SH-1000-SRC</span>
          </h4>
          <pre className="font-mono text-[10px] text-white/60 overflow-auto whitespace-pre-wrap leading-relaxed">
            {JSON.stringify(currentSnapshot?.payload, null, 2)}
          </pre>
        </div>
        <div className="diff-pane glass-card p-6 flex flex-col border border-cyan/10 rounded-xl bg-black/60 overflow-hidden shadow-[inset_0_0_20px_rgba(0,255,255,0.05)]">
          <h4 className="text-[10px] text-cyan/40 uppercase font-mono mb-4 flex justify-between">
            <span>Reconstituted_Logic</span>
            <span className="text-[8px] opacity-60">SH-1000-RECON</span>
          </h4>
          <pre className="font-mono text-[10px] text-cyan/60 overflow-auto whitespace-pre-wrap leading-relaxed">
            {currentSnapshot?.event_type === 'THOUGHT' 
              ? currentSnapshot?.payload 
              : `// Execution Sequence Detected: \n${JSON.stringify(currentSnapshot?.payload, null, 2)}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// PROJECTS/sovereign-hub/components/ChronoScrubber.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { SnapshotEntry } from '../lib/sovereign-native/adapter';

interface Props {
  sessionId: string;
  onStepChange: (snapshot: SnapshotEntry) => void;
}

export const ChronoScrubber: React.FC<Props> = ({ sessionId, onStepChange }) => {
  const [snapshots, setSnapshots] = useState<SnapshotEntry[]>([]);
  const [currentIndex, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadTrace = async () => {
      try {
        const res = await fetch(`/api/snapshots?sessionId=${sessionId}`);
        const data = await res.json();
        if (data.snapshots && data.snapshots.length > 0) {
          setSnapshots(data.snapshots);
          setCurrentStep(data.snapshots.length - 1);
          onStepChange(data.snapshots[data.snapshots.length - 1]);
        }
      } catch (e) {
        console.error("Failed to load trace", e);
      }
    };
    loadTrace();
  }, [sessionId]);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setCurrentStep(val);
    onStepChange(snapshots[val]);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= snapshots.length - 1) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          onStepChange(snapshots[next]);
          return next;
        });
      }, 500);
    }
  };

  return (
    <div className="glass-panel p-6 flex flex-col gap-4 border-[#FFD700]/10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full hover:bg-[#FFD700]/20 transition-all"
          >
            {isPlaying ? '⏸' : '▶️'}
          </button>
          <div>
            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/60 font-cinzel">Temporal_Scrubber</h3>
            <p className="text-[8px] font-mono text-[#FFD700]/40 uppercase tracking-widest mt-1">
              Step: {currentIndex + 1} / {snapshots.length} // Latency: 12ms
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-emerald-400 font-michroma">
            {snapshots[currentIndex]?.event_type || 'IDLE'}
          </span>
        </div>
      </div>

      <div className="relative h-12 flex items-center">
        <input 
          type="range" 
          min="0" 
          max={Math.max(0, snapshots.length - 1)} 
          value={currentIndex}
          onChange={handleScrub}
          className="w-full appearance-none bg-white/5 h-1 rounded-full outline-none transition-all cursor-pointer accent-[#FFD700]"
          style={{
            background: `linear-gradient(90deg, #FFD700 ${(currentIndex / (snapshots.length - 1)) * 100}%, rgba(255,255,255,0.05) 0%)`
          }}
        />
        
        {/* Heat Markers */}
        <div className="absolute inset-0 pointer-events-none flex items-center px-1">
          {snapshots.map((s, i) => (
            s.event_type === 'TOOL_CALL' && (
              <div 
                key={i} 
                className="absolute w-0.5 h-3 bg-[#A855F7] shadow-[0_0_8px_#A855F7]"
                style={{ left: `${(i / (snapshots.length - 1)) * 100}%` }}
              ></div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChronoScrubber;

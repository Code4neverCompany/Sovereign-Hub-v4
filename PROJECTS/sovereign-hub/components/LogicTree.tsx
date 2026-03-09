'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTelemetry } from '../hooks/useTelemetry'

const NODES = {
  GATEWAY: { id: 'GATEWAY', x: 50, y: 50, label: 'CORE GATEWAY' },
  SENTINEL: { id: 'SENTINEL', x: 250, y: 50, label: 'SENTINEL PRIME' },
  NEURAL: { id: 'NEURAL', x: 450, y: 50, label: 'NEURAL HUB' },
  BRIDGE: { id: 'BRIDGE', x: 250, y: 200, label: 'QUANTUM BRIDGE' },
  STORAGE: { id: 'STORAGE', x: 50, y: 200, label: 'DATA VAULT' },
  DISPATCH: { id: 'DISPATCH', x: 450, y: 200, label: 'TASK DISPATCH' },
}

interface PathUpdate {
  id: string
  source: keyof typeof NODES
  target: keyof typeof NODES
  status: 'SUCCESS' | 'FAILURE' | 'PENDING'
}

export default function LogicTree() {
  const telemetry = useTelemetry()
  const [activePaths, setActivePaths] = useState<PathUpdate[]>([])
  const vaultEasing = [0.4, 0, 0.2, 1] as const

  useEffect(() => {
    const logRemediation = async () => {
      const { logToSupabase } = await import('../lib/supabase')
      await logToSupabase({
        agent_id: 'SYSTEM',
        message: 'Aureum Logic Visualizer: Restored to Sovereign Standard.',
        level: 'INFO',
        timestamp: new Date().toISOString(),
      })
    }
    logRemediation()
  }, [])

  useEffect(() => {
    if (telemetry.length > 0) {
      const latest = telemetry[0]
      if (NODES[latest.source_node as keyof typeof NODES] && NODES[latest.target_node as keyof typeof NODES]) {
        const newPath: PathUpdate = {
          id: latest.id,
          source: latest.source_node as keyof typeof NODES,
          target: latest.target_node as keyof typeof NODES,
          status: latest.status,
        }
        
        setActivePaths((prev) => [newPath, ...prev].slice(0, 5))
        
        setTimeout(() => {
          setActivePaths((prev) => prev.filter(p => p.id !== newPath.id))
        }, 2500)
      }
    }
  }, [telemetry])

  return (
    <div className="relative w-full h-full glass-panel overflow-hidden p-4 group">
      <div className="absolute top-2 left-4 text-[9px] font-black font-mono text-[#FFD700]/40 tracking-[0.3em] uppercase transition-colors group-hover:text-[#FFD700]/80">
        Logic_Infra_Visualizer // v4.0
      </div>
      
      <svg viewBox="0 0 500 250" className="w-full h-full relative z-10">
        <defs>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="layer1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="layer2" />
            <feMerge>
              <feMergeNode in="layer2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static Background Paths */}
        <g stroke="rgba(139, 92, 246, 0.05)" strokeWidth="0.5" fill="none">
          <path d="M 50 50 L 250 50" />
          <path d="M 250 50 L 450 50" />
          <path d="M 250 50 L 250 200" />
          <path d="M 50 200 L 250 200" />
          <path d="M 450 200 L 250 200" />
          <path d="M 50 50 L 50 200" />
          <path d="M 450 50 L 450 200" />
        </g>

        {/* Animated Data Paths */}
        <AnimatePresence>
          {activePaths.map((path) => {
            const start = NODES[path.source]
            const end = NODES[path.target]
            const color = path.status === 'SUCCESS' ? '#FFD700' : '#FF4444'
            
            return (
              <motion.path
                key={path.id}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                transition={{ 
                  duration: 2, 
                  ease: vaultEasing 
                }}
                d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                filter="url(#glow)"
                style={{ strokeDasharray: "4,4" }}
              />
            )
          })}
        </AnimatePresence>

        {/* Nodes */}
        {Object.values(NODES).map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`} className="group/node">
            <circle r="3" fill="#050505" stroke="#8B5CF6" strokeWidth="1" className="group-hover/node:stroke-[#FFD700] transition-colors duration-300" />
            <circle r="1" fill="#8B5CF6" className="group-hover/node:fill-[#FFD700] transition-colors duration-300" />
            <text
              y="-12"
              fontSize="7"
              fontFamily="monospace"
              fontWeight="900"
              fill="#FFD700"
              textAnchor="middle"
              className="uppercase tracking-widest opacity-40 group-hover/node:opacity-100 transition-all duration-300"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:20px_20px]" />
    </div>
  )
}

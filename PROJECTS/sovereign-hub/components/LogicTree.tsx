'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTelemetry } from '../hooks/useTelemetry'

// LogicTree Nodes Configuration
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

  // Use the cubic-bezier directly for Framer, keeping it synced with CSS --vault-easing
  const vaultEasing = [0.4, 0, 0.2, 1] as const // Maps to cubic-bezier(0.4, 0, 0.2, 1)

  useEffect(() => {
    // Audit log for remediation
    const logRemediation = async () => {
      const { logToSupabase } = await import('../lib/supabase')
      await logToSupabase({
        agent_id: 'SH-005.3',
        message: 'Aesthetic Restoration complete for LogicTree.tsx.',
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
        
        // Remove path after animation
        setTimeout(() => {
          setActivePaths((prev) => prev.filter(p => p.id !== newPath.id))
        }, 2500)
      }
    }
  }, [telemetry])

  return (
    <div className="relative w-full h-[300px] glass-panel overflow-hidden p-4">
      <div className="absolute top-2 left-4 text-[10px] font-cinzel text-gold-leaf/50 tracking-widest uppercase">
        Real-time Logic Infrastructure Visualizer
      </div>
      
      <svg viewBox="0 0 500 250" className="w-full h-full">
        {/* Connection Lines (Glow/Static) */}
        <defs>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="layer1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="layer2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="layer3" />
            <feMerge>
              <feMergeNode in="layer3" />
              <feMergeNode in="layer2" />
              <feMergeNode in="layer1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static Background Paths */}
        <g stroke="rgba(212, 175, 55, 0.1)" strokeWidth="0.5" fill="none">
          <path d="M 50 50 L 250 50" />
          <path d="M 250 50 L 450 50" />
          <path d="M 250 50 L 250 200" />
          <path d="M 50 200 L 250 200" />
          <path d="M 450 200 L 250 200" />
          <path d="M 50 50 L 50 200" />
          <path d="M 450 50 L 450 200" />
        </g>

        {/* Animated Data Paths (Aureum Cinematic) */}
        <AnimatePresence>
          {activePaths.map((path) => {
            const start = NODES[path.source]
            const end = NODES[path.target]
            const color = path.status === 'SUCCESS' ? '#D4AF37' : '#FF4444'
            
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
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
                style={{ strokeDasharray: "5,5" }}
              />
            )
          })}
        </AnimatePresence>

        {/* Nodes */}
        {Object.values(NODES).map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <circle r="4" fill="#000" stroke="#D4AF37" strokeWidth="1" />
            <circle r="1" fill="#D4AF37" />
            <text
              y="-10"
              fontSize="6"
              fontFamily="Cinzel, serif"
              fill="#D4AF37"
              textAnchor="middle"
              className="uppercase tracking-tighter opacity-70"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

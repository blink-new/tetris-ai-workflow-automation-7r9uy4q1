import React from 'react'
import { motion } from 'framer-motion'

interface GridCanvasProps {
  visible: boolean
}

export function GridCanvas({ visible }: GridCanvasProps) {
  if (!visible) return null

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="tetris-grid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="40"
              height="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border/30"
            />
            {/* Connection points at grid intersections */}
            <circle
              cx="40"
              cy="40"
              r="1"
              fill="currentColor"
              className="text-electric-blue/40"
            />
          </pattern>
          
          {/* Electrical trace pattern */}
          <pattern
            id="electrical-traces"
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 60h120M60 0v120"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-electric-blue/10"
            />
            <path
              d="M30 30h60M30 90h60M30 30v60M90 30v60"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-electric-green/10"
            />
          </pattern>
        </defs>
        
        {/* Main grid */}
        <rect width="100%" height="100%" fill="url(#tetris-grid)" />
        
        {/* Electrical traces overlay */}
        <rect width="100%" height="100%" fill="url(#electrical-traces)" opacity="0.3" />
        
        {/* Major grid lines every 5 units */}
        <g className="text-border/50" strokeWidth="1">
          {Array.from({ length: 50 }, (_, i) => (
            <g key={i}>
              <line
                x1={i * 200}
                y1="0"
                x2={i * 200}
                y2="100%"
                stroke="currentColor"
                opacity="0.3"
              />
              <line
                x1="0"
                y1={i * 200}
                x2="100%"
                y2={i * 200}
                stroke="currentColor"
                opacity="0.3"
              />
            </g>
          ))}
        </g>
      </svg>
    </motion.div>
  )
}
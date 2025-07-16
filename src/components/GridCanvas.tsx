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
            id="tetris-game-grid"
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
              strokeWidth="1"
              className="text-primary/20"
              rx="2"
            />
            {/* Tetris-style connection points */}
            <circle
              cx="20"
              cy="20"
              r="2"
              fill="currentColor"
              className="text-tetris-cyan/30"
            />
            <circle
              cx="40"
              cy="40"
              r="1.5"
              fill="currentColor"
              className="text-tetris-purple/40"
            />
          </pattern>
          
          {/* Candy Crush style sparkles */}
          <pattern
            id="candy-sparkles"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <motion.circle
              cx="20"
              cy="20"
              r="1"
              fill="currentColor"
              className="text-tetris-yellow/60"
            />
            <motion.circle
              cx="60"
              cy="20"
              r="1.5"
              fill="currentColor"
              className="text-tetris-pink/50"
            />
            <motion.circle
              cx="20"
              cy="60"
              r="1"
              fill="currentColor"
              className="text-candy-mint/60"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="1.5"
              fill="currentColor"
              className="text-tetris-orange/50"
            />
            {/* Game-style plus signs */}
            <path
              d="M40 35v10M35 40h10"
              stroke="currentColor"
              strokeWidth="1"
              className="text-tetris-cyan/30"
            />
          </pattern>
          
          {/* Glow filter for game effects */}
          <filter id="gameGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main Tetris-style grid */}
        <rect width="100%" height="100%" fill="url(#tetris-game-grid)" />
        
        {/* Candy Crush sparkles overlay */}
        <rect width="100%" height="100%" fill="url(#candy-sparkles)" opacity="0.4" />
        
        {/* Major grid lines every 5 units - more game-like */}
        <g className="text-primary/30" strokeWidth="2" filter="url(#gameGlow)">
          {Array.from({ length: 25 }, (_, i) => (
            <g key={i}>
              <line
                x1={i * 200}
                y1="0"
                x2={i * 200}
                y2="100%"
                stroke="currentColor"
                opacity="0.2"
                strokeDasharray="10,10"
              />
              <line
                x1="0"
                y1={i * 200}
                x2="100%"
                y2={i * 200}
                stroke="currentColor"
                opacity="0.2"
                strokeDasharray="10,10"
              />
            </g>
          ))}
        </g>
        
        {/* Animated game elements */}
        <g className="game-pulse">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.circle
              key={i}
              cx={100 + i * 150}
              cy={100 + (i % 3) * 150}
              r="3"
              fill={`hsl(var(--tetris-${['cyan', 'purple', 'yellow', 'orange', 'green', 'blue', 'red', 'pink'][i]}))`}
              opacity="0.3"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  )
}
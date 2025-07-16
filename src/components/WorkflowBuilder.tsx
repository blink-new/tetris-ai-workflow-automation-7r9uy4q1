import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Zap, Play, Activity, Trash } from 'lucide-react'
import { Card } from './ui/card'
import { GridCanvas } from './GridCanvas'
import { PlacedComponent } from './PlacedComponent'
import { WorkflowStatus } from './WorkflowStatus'
import { workflowTemplates, WorkflowTemplate } from '../data/workflowTemplates'

interface WorkflowBuilderProps {
  selectedComponent: string | null
  onComponentPlaced: () => void
}

interface PlacedComponentData {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  connections: string[]
}

interface Connection {
  id: string
  fromComponent: string
  toComponent: string
  fromPort: 'top' | 'bottom' | 'left' | 'right'
  toPort: 'top' | 'bottom' | 'left' | 'right'
}

export function WorkflowBuilder({ selectedComponent, onComponentPlaced }: WorkflowBuilderProps) {
  const [placedComponents, setPlacedComponents] = useState<PlacedComponentData[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionProgress, setExecutionProgress] = useState(0)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleCanvasClick = (event: React.MouseEvent) => {
    if (!selectedComponent || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / 40) * 40
    const y = Math.floor((event.clientY - rect.top) / 40) * 40

    const newComponent: PlacedComponentData = {
      id: `${selectedComponent}-${Date.now()}`,
      type: selectedComponent,
      x,
      y,
      width: 80,
      height: 80,
      connections: []
    }

    setPlacedComponents(prev => [...prev, newComponent])
    onComponentPlaced()
  }

  const handleComponentDrag = (id: string, x: number, y: number) => {
    setPlacedComponents(prev =>
      prev.map(comp =>
        comp.id === id
          ? { ...comp, x: Math.floor(x / 40) * 40, y: Math.floor(y / 40) * 40 }
          : comp
      )
    )
  }

  const handleComponentDelete = (id: string) => {
    setPlacedComponents(prev => prev.filter(comp => comp.id !== id))
    // Remove connections involving this component
    setConnections(prev => prev.filter(conn => 
      conn.fromComponent !== id && conn.toComponent !== id
    ))
  }

  const handleComponentConnect = (fromId: string, toId: string) => {
    const newConnection: Connection = {
      id: `${fromId}-${toId}-${Date.now()}`,
      fromComponent: fromId,
      toComponent: toId,
      fromPort: 'right',
      toPort: 'left'
    }
    setConnections(prev => [...prev, newConnection])
  }

  const executeWorkflow = async () => {
    if (placedComponents.length === 0) return
    
    setIsExecuting(true)
    setExecutionProgress(0)
    
    // Simulate workflow execution
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setExecutionProgress(i)
    }
    
    setIsExecuting(false)
    setExecutionProgress(0)
  }

  const loadTemplate = (template: WorkflowTemplate) => {
    setPlacedComponents(template.components)
    setConnections(template.connections)
  }

  const clearWorkflow = () => {
    setPlacedComponents([])
    setConnections([])
  }

  const getConnectionPath = (connection: Connection) => {
    const fromComp = placedComponents.find(c => c.id === connection.fromComponent)
    const toComp = placedComponents.find(c => c.id === connection.toComponent)
    
    if (!fromComp || !toComp) return ''
    
    const fromX = fromComp.x + fromComp.width
    const fromY = fromComp.y + fromComp.height / 2
    const toX = toComp.x
    const toY = toComp.y + toComp.height / 2
    
    const midX = (fromX + toX) / 2
    
    return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`
  }

  return (
    <div className="h-full relative bg-gradient-to-br from-background/40 to-background/60">
      {/* Enhanced Stats Overlay */}
      <div className="absolute top-4 left-4 z-20 flex gap-3 flex-wrap">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="px-4 py-3 bg-gradient-to-r from-tetris-cyan/20 to-tetris-blue/20 backdrop-blur-sm border-2 border-tetris-cyan/40 game-glow rounded-xl">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-6 h-6 bg-gradient-to-br from-tetris-cyan to-tetris-blue rounded-lg flex items-center justify-center tetris-block"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-3 h-3 text-white" />
              </motion.div>
              <span className="text-sm font-bold font-mono text-foreground">
                {placedComponents.length} Blocks
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="px-4 py-3 bg-gradient-to-r from-tetris-green/20 to-candy-mint/20 backdrop-blur-sm border-2 border-tetris-green/40 game-glow rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-tetris-green to-candy-mint animate-pulse tetris-glow" />
              <span className="text-sm font-bold font-mono text-foreground">
                {connections.length} Links
              </span>
            </div>
          </Card>
        </motion.div>

        {placedComponents.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="px-4 py-3 bg-gradient-to-r from-tetris-green/30 to-candy-lime/30 border-2 border-tetris-green/60 game-glow rounded-xl">
              <button
                onClick={executeWorkflow}
                disabled={isExecuting}
                className="flex items-center gap-2 text-sm font-bold text-tetris-green hover:text-candy-lime disabled:opacity-50 transition-colors duration-300"
              >
                <motion.div
                  animate={isExecuting ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isExecuting ? Infinity : 0, ease: "linear" }}
                >
                  <Play className="w-4 h-4" />
                </motion.div>
                {isExecuting ? 'Playing...' : 'Start Game'}
              </button>
            </Card>
          </motion.div>
        )}
        
        {selectedComponent && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="candy-bounce"
          >
            <Card className="px-4 py-3 bg-gradient-to-r from-tetris-purple/30 to-tetris-pink/30 border-2 border-tetris-purple/60 game-glow rounded-xl">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 90, 180, 270, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Plus className="w-4 h-4 text-tetris-purple" />
                </motion.div>
                <span className="text-sm font-bold text-tetris-purple">
                  Drop {selectedComponent}
                </span>
              </div>
            </Card>
          </motion.div>
        )}

        {isExecuting && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="px-4 py-3 bg-gradient-to-r from-tetris-orange/30 to-candy-coral/30 border-2 border-tetris-orange/60 game-glow rounded-xl">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-4 h-4 border-2 border-tetris-orange border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-sm font-bold text-tetris-orange">
                  {executionProgress}% Complete
                </span>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Canvas Area */}
      <motion.div
        ref={canvasRef}
        className="w-full h-full relative cursor-crosshair"
        onClick={handleCanvasClick}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Grid Background */}
        <GridCanvas visible={true} />
        
        {/* Animated Game Pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.svg 
            className="w-full h-full" 
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 2 }}
          >
            <defs>
              <pattern id="tetris-game-pattern" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
                {/* Tetris block shapes */}
                <motion.rect
                  x="20" y="20" width="40" height="40"
                  fill="currentColor"
                  className="text-tetris-cyan"
                  rx="6"
                  animate={{ 
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.rect
                  x="100" y="20" width="40" height="40"
                  fill="currentColor"
                  className="text-tetris-orange"
                  rx="6"
                  animate={{ 
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                <motion.rect
                  x="20" y="100" width="40" height="40"
                  fill="currentColor"
                  className="text-tetris-purple"
                  rx="6"
                  animate={{ 
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
                <motion.rect
                  x="100" y="100" width="40" height="40"
                  fill="currentColor"
                  className="text-tetris-green"
                  rx="6"
                  animate={{ 
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                />
                
                {/* Candy Crush style gems */}
                <motion.circle 
                  cx="80" cy="40" r="6" 
                  fill="currentColor" 
                  className="text-tetris-pink"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle 
                  cx="40" cy="80" r="6" 
                  fill="currentColor" 
                  className="text-candy-mint"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                />
                <motion.circle 
                  cx="120" cy="80" r="6" 
                  fill="currentColor" 
                  className="text-tetris-yellow"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                />
                <motion.circle 
                  cx="80" cy="120" r="6" 
                  fill="currentColor" 
                  className="text-candy-coral"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 2.1 }}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tetris-game-pattern)" />
          </motion.svg>
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <linearGradient id="tetrisConnectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--tetris-cyan))" stopOpacity="0.9" />
              <stop offset="25%" stopColor="hsl(var(--tetris-purple))" stopOpacity="1" />
              <stop offset="50%" stopColor="hsl(var(--tetris-pink))" stopOpacity="1" />
              <stop offset="75%" stopColor="hsl(var(--tetris-orange))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--tetris-yellow))" stopOpacity="0.9" />
            </linearGradient>
            <filter id="gameGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="candyGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feColorMatrix in="coloredBlur" values="1 0 1 0 0  0 1 1 0 0  1 0 1 0 0  0 0 0 1 0"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {connections.map((connection, index) => (
            <motion.path
              key={connection.id}
              d={getConnectionPath(connection)}
              stroke="url(#tetrisConnectionGradient)"
              strokeWidth="4"
              fill="none"
              filter="url(#gameGlow)"
              strokeDasharray="8,4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                strokeDashoffset: [0, -24]
              }}
              transition={{ 
                pathLength: { duration: 1, ease: "easeInOut" },
                opacity: { duration: 1, ease: "easeInOut" },
                strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
            />
          ))}
          
          {/* Animated candy-like data flow particles */}
          {connections.map((connection, index) => {
            const colors = ['tetris-cyan', 'tetris-purple', 'tetris-pink', 'tetris-orange', 'tetris-yellow', 'candy-mint', 'candy-coral'];
            const color = colors[index % colors.length];
            
            return (
              <motion.g key={`particle-group-${connection.id}`}>
                <motion.circle
                  r="4"
                  fill={`hsl(var(--${color}))`}
                  filter="url(#candyGlow)"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                    scale: [0.8, 1.2, 1, 0.8]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={getConnectionPath(connection)}
                  />
                </motion.circle>
                <motion.circle
                  r="2"
                  fill="white"
                  opacity="0.8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0.8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={getConnectionPath(connection)}
                  />
                </motion.circle>
              </motion.g>
            );
          })}
        </svg>

        {/* Placed Components */}
        <AnimatePresence>
          {placedComponents.map((component) => (
            <PlacedComponent
              key={component.id}
              component={component}
              onDrag={handleComponentDrag}
              onDelete={handleComponentDelete}
              onConnect={handleComponentConnect}
              isExecuting={isExecuting}
            />
          ))}
        </AnimatePresence>

        {/* Enhanced Empty State */}
        {placedComponents.length === 0 && !selectedComponent && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center">
              <motion.div 
                className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-tetris-purple/30 to-tetris-pink/30 rounded-3xl flex items-center justify-center border-4 border-tetris-purple/40 tetris-block"
                animate={{ 
                  boxShadow: [
                    '0 0 30px hsl(var(--tetris-purple) / 30%)',
                    '0 0 60px hsl(var(--tetris-pink) / 50%)',
                    '0 0 30px hsl(var(--tetris-purple) / 30%)'
                  ],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-16 h-16 text-tetris-purple drop-shadow-lg" />
                </motion.div>
              </motion.div>
              <motion.h3 
                className="text-3xl font-bold text-foreground mb-4 font-mono bg-gradient-to-r from-tetris-cyan via-tetris-purple to-tetris-pink bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0%', '100%', '0%']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Ready to Play?
              </motion.h3>
              <p className="text-base text-muted-foreground max-w-lg mb-6 leading-relaxed">
                🎮 Drag colorful blocks from the library and drop them on the grid!
                <br />
                🔗 Connect them like Tetris pieces to build amazing workflows!
                <br />
                ⚡ Watch your automation come to life!
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <motion.div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-tetris-cyan/20 border border-tetris-cyan/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <Activity className="w-4 h-4 text-tetris-cyan" />
                  <span className="font-mono">Drag & Drop</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-tetris-orange/20 border border-tetris-orange/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <Zap className="w-4 h-4 text-tetris-orange" />
                  <span className="font-mono">Connect</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-tetris-green/20 border border-tetris-green/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <Play className="w-4 h-4 text-tetris-green" />
                  <span className="font-mono">Play</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Workflow Status */}
        <WorkflowStatus
          isExecuting={isExecuting}
          progress={executionProgress}
          componentsCount={placedComponents.length}
          connectionsCount={connections.length}
        />
      </motion.div>
    </div>
  )
}
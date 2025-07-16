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
    <div className="h-full relative bg-background/30">
      {/* Enhanced Stats Overlay */}
      <div className="absolute top-4 left-4 z-20 flex gap-3 flex-wrap">
        <Card className="px-3 py-2 bg-card/80 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-electric-blue" />
            <span className="text-sm font-mono text-foreground">
              {placedComponents.length} Components
            </span>
          </div>
        </Card>

        <Card className="px-3 py-2 bg-card/80 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-electric-green animate-pulse" />
            <span className="text-sm font-mono text-foreground">
              {connections.length} Connections
            </span>
          </div>
        </Card>

        {placedComponents.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Card className="px-3 py-2 bg-electric-green/20 border-electric-green/50 electrical-glow">
              <button
                onClick={executeWorkflow}
                disabled={isExecuting}
                className="flex items-center gap-2 text-sm font-medium text-electric-green hover:text-electric-green/80 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {isExecuting ? 'Executing...' : 'Run Workflow'}
              </button>
            </Card>
          </motion.div>
        )}
        
        {selectedComponent && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Card className="px-3 py-2 bg-electric-blue/20 border-electric-blue/50 electrical-glow">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-electric-blue" />
                <span className="text-sm font-medium text-electric-blue">
                  Place {selectedComponent}
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
          >
            <Card className="px-3 py-2 bg-electric-orange/20 border-electric-orange/50 electrical-glow">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-electric-orange border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-electric-orange">
                  {executionProgress}%
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
        
        {/* Animated Circuit Pattern */}
        <div className="absolute inset-0 opacity-5">
          <motion.svg 
            className="w-full h-full" 
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 2 }}
          >
            <defs>
              <pattern id="circuit-game" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <motion.path
                  d="M20 20h160M20 60h40m80 0h40M20 100h160M20 140h40m80 0h40M20 180h160"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-electric-blue"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.circle 
                  cx="60" cy="60" r="4" 
                  fill="currentColor" 
                  className="text-electric-orange"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle 
                  cx="140" cy="60" r="4" 
                  fill="currentColor" 
                  className="text-electric-green"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.circle 
                  cx="60" cy="140" r="4" 
                  fill="currentColor" 
                  className="text-spark-yellow"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <motion.circle 
                  cx="140" cy="140" r="4" 
                  fill="currentColor" 
                  className="text-electric-blue"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-game)" />
          </motion.svg>
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--electric-blue))" stopOpacity="0.8" />
              <stop offset="50%" stopColor="hsl(var(--electric-green))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--electric-orange))" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {connections.map((connection) => (
            <motion.path
              key={connection.id}
              d={getConnectionPath(connection)}
              stroke="url(#connectionGradient)"
              strokeWidth="3"
              fill="none"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          ))}
          
          {/* Animated data flow particles */}
          {connections.map((connection) => (
            <motion.circle
              key={`particle-${connection.id}`}
              r="3"
              fill="hsl(var(--electric-blue))"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path={getConnectionPath(connection)}
              />
            </motion.circle>
          ))}
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
                className="w-24 h-24 mx-auto mb-6 bg-electric-blue/20 rounded-full flex items-center justify-center border-2 border-electric-blue/30"
                animate={{ 
                  boxShadow: [
                    '0 0 20px hsl(var(--electric-blue) / 20%)',
                    '0 0 40px hsl(var(--electric-blue) / 40%)',
                    '0 0 20px hsl(var(--electric-blue) / 20%)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-12 h-12 text-electric-blue" />
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-3 font-mono">
                Start Your Circuit
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                Select components from the library and place them on the grid.
                <br />
                Connect them with cables to build your automation workflow!
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  <span>Drag & Drop</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Connect</span>
                </div>
                <div className="flex items-center gap-1">
                  <Play className="w-3 h-3" />
                  <span>Execute</span>
                </div>
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
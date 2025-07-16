import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Zap } from 'lucide-react'
import { Card } from './ui/card'
import { GridCanvas } from './GridCanvas'
import { PlacedComponent } from './PlacedComponent'

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

export function WorkflowBuilder({ selectedComponent, onComponentPlaced }: WorkflowBuilderProps) {
  const [placedComponents, setPlacedComponents] = useState<PlacedComponentData[]>([])
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
  }

  return (
    <div className="h-full relative bg-background/30">
      {/* Game Stats Overlay */}
      <div className="absolute top-4 left-4 z-20 flex gap-3">
        <Card className="px-3 py-2 bg-card/80 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-electric-blue" />
            <span className="text-sm font-mono text-foreground">
              {placedComponents.length} Components
            </span>
          </div>
        </Card>
        
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

        {/* Placed Components */}
        <AnimatePresence>
          {placedComponents.map((component) => (
            <PlacedComponent
              key={component.id}
              component={component}
              onDrag={handleComponentDrag}
              onDelete={handleComponentDelete}
            />
          ))}
        </AnimatePresence>

        {/* Game-like Empty State */}
        {placedComponents.length === 0 && !selectedComponent && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center">
              <motion.div 
                className="w-20 h-20 mx-auto mb-6 bg-electric-blue/20 rounded-full flex items-center justify-center border-2 border-electric-blue/30"
                animate={{ 
                  boxShadow: [
                    '0 0 20px hsl(var(--electric-blue) / 20%)',
                    '0 0 40px hsl(var(--electric-blue) / 40%)',
                    '0 0 20px hsl(var(--electric-blue) / 20%)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-10 h-10 text-electric-blue" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-mono">
                Start Your Circuit
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Select components from the library and place them on the grid.
                <br />
                Ask the AI assistant for help building your workflow!
              </p>
            </div>
          </motion.div>
        )}

        {/* Connection Lines (for future use) */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {/* Future: Draw connection lines between components */}
        </svg>
      </motion.div>
    </div>
  )
}
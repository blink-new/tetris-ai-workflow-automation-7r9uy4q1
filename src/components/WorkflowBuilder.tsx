import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Grid3X3, Maximize2 } from 'lucide-react'
import { Button } from './ui/button'
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
  const [isGridVisible, setIsGridVisible] = useState(true)
  const [draggedComponent, setDraggedComponent] = useState<PlacedComponentData | null>(null)
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
    <div className="flex-1 flex flex-col bg-background/50">
      {/* Canvas Header */}
      <div className="h-12 bg-card/50 backdrop-blur-sm border-b border-border/30 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm text-foreground">Workflow Canvas</h2>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{placedComponents.length} components</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsGridVisible(!isGridVisible)}
            className={`text-xs ${isGridVisible ? 'text-electric-blue' : 'text-muted-foreground'}`}
          >
            <Grid3X3 className="w-3 h-3 mr-1" />
            Grid
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
          >
            <Maximize2 className="w-3 h-3 mr-1" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        <motion.div
          ref={canvasRef}
          className="w-full h-full relative cursor-crosshair"
          onClick={handleCanvasClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Grid Background */}
          <GridCanvas visible={isGridVisible} />
          
          {/* Circuit Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                  <path
                    d="M20 20h160M20 60h40m80 0h40M20 100h160M20 140h40m80 0h40M20 180h160"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                    className="text-electric-blue/20"
                  />
                  <circle cx="60" cy="60" r="3" fill="currentColor" className="text-electric-orange/30" />
                  <circle cx="140" cy="60" r="3" fill="currentColor" className="text-electric-green/30" />
                  <circle cx="60" cy="140" r="3" fill="currentColor" className="text-electric-yellow/30" />
                  <circle cx="140" cy="140" r="3" fill="currentColor" className="text-electric-blue/30" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit)" />
            </svg>
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

          {/* Selection Indicator */}
          {selectedComponent && (
            <motion.div
              className="absolute top-4 left-4 z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Card className="px-3 py-2 bg-electric-blue/20 border-electric-blue/50 electrical-glow">
                <div className="flex items-center gap-2">
                  <Plus className="w-3 h-3 text-electric-blue" />
                  <span className="text-xs font-medium text-electric-blue">
                    Click to place {selectedComponent}
                  </span>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Empty State */}
          {placedComponents.length === 0 && !selectedComponent && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary/30 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Start Building Your Workflow
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Select components from the library and click on the canvas to place them.
                  Connect electrical components to create automated workflows.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
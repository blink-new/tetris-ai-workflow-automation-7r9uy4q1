import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Cpu, 
  Zap, 
  Radio, 
  Battery, 
  Wifi, 
  Database,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  Image,
  Trash2,
  Settings,
  Link
} from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface PlacedComponentData {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  connections: string[]
}

interface PlacedComponentProps {
  component: PlacedComponentData
  onDrag: (id: string, x: number, y: number) => void
  onDelete: (id: string) => void
  onConnect?: (fromId: string, toId: string) => void
  isExecuting?: boolean
}

const componentIcons: Record<string, any> = {
  'power-source': Battery,
  'transformer': Zap,
  'capacitor': Radio,
  'microchip': Cpu,
  'logic-gate': Zap,
  'memory-chip': Database,
  'antenna': Wifi,
  'transmitter': Mail,
  'receiver': MessageSquare,
  'display': FileText,
  'scheduler': Calendar,
  'media-out': Image,
}

const componentColors: Record<string, string> = {
  'power-source': 'electric-yellow',
  'transformer': 'electric-yellow',
  'capacitor': 'electric-yellow',
  'microchip': 'electric-blue',
  'logic-gate': 'electric-blue',
  'memory-chip': 'electric-blue',
  'antenna': 'electric-green',
  'transmitter': 'electric-green',
  'receiver': 'electric-green',
  'display': 'electric-orange',
  'scheduler': 'electric-orange',
  'media-out': 'electric-orange',
}

export function PlacedComponent({ component, onDrag, onDelete, onConnect, isExecuting }: PlacedComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showControls, setShowControls] = useState(false)

  const Icon = componentIcons[component.type] || Cpu
  const color = componentColors[component.type] || 'electric-blue'

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    
    const startX = e.clientX - component.x
    const startY = e.clientY - component.y

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - startX
      const newY = e.clientY - startY
      onDrag(component.id, newX, newY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <motion.div
      className="absolute z-10"
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowControls(false)
      }}
      onClick={() => setShowControls(!showControls)}
    >
      {/* Main Component */}
      <motion.div
        className={`w-full h-full cursor-move relative`}
        onMouseDown={handleMouseDown}
        animate={{
          boxShadow: isDragging
            ? `0 0 20px hsl(var(--${color}) / 0.6), 0 0 40px hsl(var(--${color}) / 0.4)`
            : isHovered
            ? `0 0 10px hsl(var(--${color}) / 0.4)`
            : `0 0 5px hsl(var(--${color}) / 0.2)`,
        }}
      >
        <Card className={`w-full h-full bg-${color}/20 border-${color}/50 flex items-center justify-center relative overflow-hidden ${isExecuting ? 'animate-pulse' : ''}`}>
          {/* Circuit pattern background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`circuit-${component.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M0 10h20M10 0v20"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className={`text-${color}`}
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#circuit-${component.id})`} />
            </svg>
          </div>

          {/* Component Icon */}
          <Icon className={`w-8 h-8 text-${color} relative z-10`} />

          {/* Connection Points */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`w-3 h-3 rounded-full bg-${color} border-2 border-background spark-animation`} />
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className={`w-3 h-3 rounded-full bg-${color} border-2 border-background spark-animation`} />
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`w-3 h-3 rounded-full bg-${color} border-2 border-background spark-animation`} />
          </div>
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
            <div className={`w-3 h-3 rounded-full bg-${color} border-2 border-background spark-animation`} />
          </div>

          {/* Status Indicator */}
          <div className="absolute top-1 right-1">
            <div className="w-2 h-2 rounded-full bg-electric-green animate-pulse" />
          </div>
        </Card>
      </motion.div>

      {/* Control Panel */}
      {showControls && (
        <motion.div
          className="absolute -top-12 left-0 right-0 flex justify-center gap-1 z-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              // Handle connection logic
            }}
          >
            <Link className="w-3 h-3" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              // Handle settings
            }}
          >
            <Settings className="w-3 h-3" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-destructive/20 border-destructive/50 text-destructive hover:bg-destructive/30"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(component.id)
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </motion.div>
      )}

      {/* Component Label */}
      {isHovered && (
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="px-2 py-1 bg-card/90 backdrop-blur-sm border border-border/50 rounded text-xs font-medium text-foreground whitespace-nowrap">
            {component.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
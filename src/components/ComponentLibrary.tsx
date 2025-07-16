import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
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
  Video
} from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

interface ComponentLibraryProps {
  isOpen: boolean
  onToggle: () => void
  selectedComponent: string | null
  onSelectComponent: (component: string) => void
}

const componentCategories = [
  {
    name: 'Power Components',
    icon: Battery,
    color: 'electric-yellow',
    components: [
      { id: 'power-source', name: 'Power Source', icon: Battery, description: 'Workflow trigger' },
      { id: 'transformer', name: 'Transformer', icon: Zap, description: 'Data transformer' },
      { id: 'capacitor', name: 'Capacitor', icon: Radio, description: 'Data buffer' },
    ]
  },
  {
    name: 'Processing Units',
    icon: Cpu,
    color: 'electric-blue',
    components: [
      { id: 'microchip', name: 'AI Processor', icon: Cpu, description: 'AI processing unit' },
      { id: 'logic-gate', name: 'Logic Gate', icon: Zap, description: 'Conditional logic' },
      { id: 'memory-chip', name: 'Memory', icon: Database, description: 'Data storage' },
    ]
  },
  {
    name: 'Communication',
    icon: Wifi,
    color: 'electric-green',
    components: [
      { id: 'antenna', name: 'API Antenna', icon: Wifi, description: 'External API calls' },
      { id: 'transmitter', name: 'Email Sender', icon: Mail, description: 'Email notifications' },
      { id: 'receiver', name: 'Webhook', icon: MessageSquare, description: 'Receive webhooks' },
    ]
  },
  {
    name: 'Output Devices',
    icon: FileText,
    color: 'electric-orange',
    components: [
      { id: 'display', name: 'Display', icon: FileText, description: 'Show results' },
      { id: 'scheduler', name: 'Scheduler', icon: Calendar, description: 'Time-based actions' },
      { id: 'media-out', name: 'Media Output', icon: Image, description: 'Generate media' },
    ]
  }
]

export function ComponentLibrary({ isOpen, onToggle, selectedComponent, onSelectComponent }: ComponentLibraryProps) {
  return (
    <>
      {/* Toggle Button */}
      <motion.div
        className="absolute top-4 -right-12 z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="bg-card/80 backdrop-blur-sm border-border/50 electrical-glow"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </motion.div>

      {/* Library Panel */}
      <div className="w-80 h-full bg-card/90 backdrop-blur-sm border-r border-border/50 overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 h-full overflow-y-auto"
            >
              <div className="mb-6">
                <h2 className="text-lg font-bold font-mono text-foreground mb-2">
                  Component Library
                </h2>
                <p className="text-sm text-muted-foreground">
                  Drag electrical components to build your workflow
                </p>
              </div>

              <div className="space-y-6">
                {componentCategories.map((category, categoryIndex) => (
                  <motion.div
                    key={category.name}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <category.icon className={`w-4 h-4 text-${category.color}`} />
                      <h3 className="font-semibold text-sm text-foreground">
                        {category.name}
                      </h3>
                    </div>
                    
                    <div className="grid gap-2">
                      {category.components.map((component) => (
                        <motion.div
                          key={component.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`p-3 cursor-pointer transition-all duration-200 ${
                              selectedComponent === component.id
                                ? `bg-${category.color}/20 border-${category.color}/50 electrical-glow`
                                : 'bg-secondary/50 hover:bg-secondary/80 border-border/30'
                            }`}
                            onClick={() => onSelectComponent(component.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-lg bg-${category.color}/20 flex items-center justify-center`}>
                                <component.icon className={`w-4 h-4 text-${category.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-foreground truncate">
                                  {component.name}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {component.description}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 bg-secondary/30 rounded-lg border border-border/30"
              >
                <h3 className="font-semibold text-sm text-foreground mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    <Zap className="w-3 h-3 mr-2" />
                    New Workflow
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    <FileText className="w-3 h-3 mr-2" />
                    Templates
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
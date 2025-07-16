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
    name: 'Power Blocks',
    icon: Battery,
    color: 'tetris-yellow',
    bgGradient: 'from-tetris-yellow to-candy-lime',
    components: [
      { id: 'power-source', name: 'Power Block', icon: Battery, description: 'Workflow trigger', color: 'tetris-yellow' },
      { id: 'transformer', name: 'Transform Block', icon: Zap, description: 'Data transformer', color: 'candy-lime' },
      { id: 'capacitor', name: 'Buffer Block', icon: Radio, description: 'Data buffer', color: 'tetris-green' },
    ]
  },
  {
    name: 'Logic Pieces',
    icon: Cpu,
    color: 'tetris-blue',
    bgGradient: 'from-tetris-blue to-tetris-cyan',
    components: [
      { id: 'microchip', name: 'AI Chip', icon: Cpu, description: 'AI processing unit', color: 'tetris-blue' },
      { id: 'logic-gate', name: 'Logic Gate', icon: Zap, description: 'Conditional logic', color: 'tetris-cyan' },
      { id: 'memory-chip', name: 'Memory Cube', icon: Database, description: 'Data storage', color: 'candy-mint' },
    ]
  },
  {
    name: 'Connect Blocks',
    icon: Wifi,
    color: 'tetris-green',
    bgGradient: 'from-tetris-green to-candy-mint',
    components: [
      { id: 'antenna', name: 'API Block', icon: Wifi, description: 'External API calls', color: 'tetris-green' },
      { id: 'transmitter', name: 'Email Block', icon: Mail, description: 'Email notifications', color: 'candy-mint' },
      { id: 'receiver', name: 'Webhook Block', icon: MessageSquare, description: 'Receive webhooks', color: 'tetris-purple' },
    ]
  },
  {
    name: 'Output Pieces',
    icon: FileText,
    color: 'tetris-orange',
    bgGradient: 'from-tetris-orange to-candy-coral',
    components: [
      { id: 'display', name: 'Display Block', icon: FileText, description: 'Show results', color: 'tetris-orange' },
      { id: 'scheduler', name: 'Timer Block', icon: Calendar, description: 'Time-based actions', color: 'candy-coral' },
      { id: 'media-out', name: 'Media Block', icon: Image, description: 'Generate media', color: 'tetris-red' },
    ]
  }
]

export function ComponentLibrary({ isOpen, onToggle, selectedComponent, onSelectComponent }: ComponentLibraryProps) {
  return (
    <>
      {/* Toggle Button */}
      <motion.div
        className="absolute top-4 -right-12 z-20"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-tetris-purple/20 to-tetris-pink/20 backdrop-blur-sm border-2 border-tetris-purple/50 game-glow rounded-xl tetris-block"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4 text-tetris-purple" /> : <ChevronRight className="w-4 h-4 text-tetris-purple" />}
        </Button>
      </motion.div>

      {/* Library Panel */}
      <div className="w-80 h-full bg-gradient-to-b from-card/95 to-card/90 backdrop-blur-sm border-r-2 border-primary/30 overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 h-full overflow-y-auto"
            >
              <div className="mb-6">
                <motion.h2 
                  className="text-xl font-bold font-mono text-foreground mb-2 bg-gradient-to-r from-tetris-cyan to-tetris-purple bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Game Blocks
                </motion.h2>
                <p className="text-sm text-muted-foreground">
                  Drag colorful blocks to build your workflow like Tetris!
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
                    <motion.div 
                      className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-gradient-to-r bg-opacity-20"
                      style={{ background: `linear-gradient(135deg, hsl(var(--${category.color})) 0%, transparent 100%)` }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.bgGradient} flex items-center justify-center tetris-block candy-bounce`}>
                        <category.icon className="w-4 h-4 text-white drop-shadow-lg" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground font-mono">
                        {category.name}
                      </h3>
                    </motion.div>
                    
                    <div className="grid gap-2">
                      {category.components.map((component) => (
                        <motion.div
                          key={component.id}
                          whileHover={{ scale: 1.05, rotate: 2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Card
                            className={`p-3 cursor-pointer transition-all duration-300 rounded-xl border-2 ${
                              selectedComponent === component.id
                                ? `bg-gradient-to-br from-${component.color}/30 to-${component.color}/10 border-${component.color}/60 game-glow tetris-glow`
                                : 'bg-gradient-to-br from-secondary/60 to-secondary/30 hover:from-secondary/80 hover:to-secondary/50 border-border/40 hover:border-primary/30'
                            }`}
                            onClick={() => onSelectComponent(component.id)}
                          >
                            <div className="flex items-start gap-3">
                              <motion.div 
                                className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${component.color} to-${component.color}/70 flex items-center justify-center tetris-block candy-shine`}
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                <component.icon className="w-5 h-5 text-white drop-shadow-lg" />
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-foreground truncate font-mono">
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
                className="mt-8 p-4 bg-gradient-to-br from-tetris-purple/20 to-tetris-pink/20 rounded-xl border-2 border-tetris-purple/30 game-glow"
              >
                <h3 className="font-bold text-sm text-foreground mb-3 font-mono bg-gradient-to-r from-tetris-purple to-tetris-pink bg-clip-text text-transparent">Quick Actions</h3>
                <div className="space-y-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs bg-gradient-to-r from-tetris-cyan/20 to-tetris-blue/20 hover:from-tetris-cyan/30 hover:to-tetris-blue/30 border border-tetris-cyan/30 rounded-lg"
                    >
                      <Zap className="w-3 h-3 mr-2 text-tetris-cyan" />
                      New Game
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs bg-gradient-to-r from-tetris-orange/20 to-candy-coral/20 hover:from-tetris-orange/30 hover:to-candy-coral/30 border border-tetris-orange/30 rounded-lg"
                    >
                      <FileText className="w-3 h-3 mr-2 text-tetris-orange" />
                      Templates
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Play, Square, Settings, Save } from 'lucide-react'
import { Button } from './ui/button'

export function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/50 px-6 flex items-center justify-between"
    >
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        <motion.div
          className="w-8 h-8 bg-electric-blue rounded-lg flex items-center justify-center electrical-glow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-5 h-5 text-background" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold font-mono text-foreground">
            Circuit<span className="text-electric-blue">Flow</span>
          </h1>
          <p className="text-xs text-muted-foreground">AI Workflow Automation</p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-electric-green/10 border-electric-green/30 text-electric-green hover:bg-electric-green/20"
        >
          <Play className="w-4 h-4 mr-2" />
          Run
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="bg-electric-orange/10 border-electric-orange/30 text-electric-orange hover:bg-electric-orange/20"
        >
          <Square className="w-4 h-4 mr-2" />
          Stop
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="bg-electric-blue/10 border-electric-blue/30 text-electric-blue hover:bg-electric-blue/20"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </motion.header>
  )
}
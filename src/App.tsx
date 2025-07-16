import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { WorkflowBuilder } from './components/WorkflowBuilder'
import { ComponentLibrary } from './components/ComponentLibrary'
import { AIChat } from './components/AIChat'
import { Zap, Menu, X } from 'lucide-react'
import { Button } from './components/ui/button'

function App() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(true)

  const handleWorkflowSuggestion = (suggestion: string) => {
    // Auto-suggest components based on AI chat
    if (suggestion.toLowerCase().includes('timer')) {
      setSelectedComponent('timer')
    } else if (suggestion.toLowerCase().includes('email')) {
      setSelectedComponent('processor')
    }
  }

  return (
    <div className="h-screen bg-background tetris-pattern overflow-hidden">
      {/* Game-like Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 bg-gradient-to-r from-card/95 via-card/90 to-card/95 backdrop-blur-sm border-b-2 border-primary/30 px-4 flex items-center justify-between relative z-50"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-tetris-purple to-tetris-pink rounded-xl flex items-center justify-center game-glow tetris-block candy-bounce"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Zap className="w-6 h-6 text-white drop-shadow-lg" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold font-mono text-foreground">
              Tetris<span className="text-transparent bg-gradient-to-r from-tetris-cyan to-tetris-purple bg-clip-text">Flow</span>
            </h1>
            <div className="text-xs text-muted-foreground font-mono">AI Workflow Builder</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLibraryOpen(!isLibraryOpen)}
              className="lg:hidden bg-tetris-blue/20 hover:bg-tetris-blue/30 text-tetris-blue border border-tetris-blue/30 rounded-xl"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`rounded-xl border-2 transition-all duration-300 ${
                isChatOpen 
                  ? 'bg-gradient-to-r from-tetris-cyan/20 to-tetris-blue/20 text-tetris-cyan border-tetris-cyan/50 game-glow' 
                  : 'bg-muted/20 text-muted-foreground border-border hover:border-primary/30'
              }`}
            >
              <Zap className="w-4 h-4 mr-2" />
              AI Chat
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Game Layout */}
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Component Library - Collapsible */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ 
            x: isLibraryOpen ? 0 : -280,
            width: isLibraryOpen ? 320 : 40
          }}
          transition={{ type: "spring", damping: 20 }}
          className="relative z-40 lg:relative lg:z-auto"
        >
          <ComponentLibrary 
            isOpen={isLibraryOpen}
            onToggle={() => setIsLibraryOpen(!isLibraryOpen)}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
          />
        </motion.div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex">
          {/* Workflow Canvas */}
          <div className="flex-1">
            <WorkflowBuilder 
              selectedComponent={selectedComponent}
              onComponentPlaced={() => setSelectedComponent(null)}
            />
          </div>

          {/* AI Chat Panel - Right Side */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ 
              x: isChatOpen ? 0 : 360,
              width: isChatOpen ? 400 : 40
            }}
            transition={{ type: "spring", damping: 20 }}
            className="relative z-30 bg-background/50 backdrop-blur-sm border-l border-border/30"
          >
            {/* Chat Toggle Button */}
            <div className="absolute left-0 top-4 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="w-8 h-8 p-0 bg-card/80 border border-border/50 rounded-r-lg rounded-l-none"
              >
                {isChatOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Zap className="w-4 h-4 text-electric-blue" />
                )}
              </Button>
            </div>

            {/* Chat Content */}
            <div className={`h-full transition-opacity duration-300 ${isChatOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="p-4 h-full">
                <AIChat onWorkflowSuggestion={handleWorkflowSuggestion} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isLibraryOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsLibraryOpen(false)}
        />
      )}
    </div>
  )
}

export default App
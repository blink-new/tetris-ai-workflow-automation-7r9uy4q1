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
    <div className="h-screen bg-background circuit-pattern overflow-hidden">
      {/* Game-like Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-14 bg-card/90 backdrop-blur-sm border-b border-border/50 px-4 flex items-center justify-between relative z-50"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 bg-electric-blue rounded-lg flex items-center justify-center electrical-glow"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="w-5 h-5 text-background" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold font-mono text-foreground">
              Circuit<span className="text-electric-blue">Flow</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLibraryOpen(!isLibraryOpen)}
            className="lg:hidden"
          >
            <Menu className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`${isChatOpen ? 'text-electric-blue' : 'text-muted-foreground'}`}
          >
            AI Chat
          </Button>
        </div>
      </motion.header>

      {/* Main Game Layout */}
      <div className="h-[calc(100vh-3.5rem)] flex">
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
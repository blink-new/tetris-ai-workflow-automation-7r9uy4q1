import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { WorkflowBuilder } from './components/WorkflowBuilder'
import { ComponentLibrary } from './components/ComponentLibrary'
import { Header } from './components/Header'
import { StatusPanel } from './components/StatusPanel'

function App() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [isLibraryOpen, setIsLibraryOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background circuit-pattern">
      {/* Header */}
      <Header />
      
      {/* Main Layout */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Component Library Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: isLibraryOpen ? 0 : -280 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative z-10"
        >
          <ComponentLibrary 
            isOpen={isLibraryOpen}
            onToggle={() => setIsLibraryOpen(!isLibraryOpen)}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
          />
        </motion.div>

        {/* Main Workflow Canvas */}
        <div className="flex-1 flex flex-col">
          <WorkflowBuilder 
            selectedComponent={selectedComponent}
            onComponentPlaced={() => setSelectedComponent(null)}
          />
        </div>

        {/* Status Panel */}
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", damping: 20, delay: 0.2 }}
          className="w-80"
        >
          <StatusPanel />
        </motion.div>
      </div>
    </div>
  )
}

export default App
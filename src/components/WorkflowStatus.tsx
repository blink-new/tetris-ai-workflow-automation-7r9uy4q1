import React from 'react'
import { motion } from 'framer-motion'
import { Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { Card } from './ui/card'
import { Progress } from './ui/progress'

interface WorkflowStatusProps {
  isExecuting: boolean
  progress: number
  componentsCount: number
  connectionsCount: number
}

export function WorkflowStatus({ isExecuting, progress, componentsCount, connectionsCount }: WorkflowStatusProps) {
  const getStatusIcon = () => {
    if (isExecuting) return <Activity className="w-4 h-4 text-electric-blue animate-spin" />
    if (componentsCount > 0) return <CheckCircle className="w-4 h-4 text-electric-green" />
    return <Clock className="w-4 h-4 text-muted-foreground" />
  }

  const getStatusText = () => {
    if (isExecuting) return 'Executing Workflow...'
    if (componentsCount > 0) return 'Workflow Ready'
    return 'No Components'
  }

  return (
    <motion.div
      className="absolute bottom-4 right-4 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-4 bg-card/90 backdrop-blur-sm border-border/50 min-w-[200px]">
        <div className="space-y-3">
          {/* Status Header */}
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium text-foreground">
              {getStatusText()}
            </span>
          </div>

          {/* Progress Bar (when executing) */}
          {isExecuting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1 text-center">
                {progress}% Complete
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center">
              <div className="text-lg font-bold text-electric-blue font-mono">
                {componentsCount}
              </div>
              <div className="text-muted-foreground">Components</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-electric-green font-mono">
                {connectionsCount}
              </div>
              <div className="text-muted-foreground">Connections</div>
            </div>
          </div>

          {/* Execution Indicator */}
          {isExecuting && (
            <motion.div
              className="flex items-center justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-electric-blue rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
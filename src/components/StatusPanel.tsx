import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Cpu,
  Database
} from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

export function StatusPanel() {
  const [activeTab, setActiveTab] = useState('execution')

  const executionLogs = [
    { id: 1, time: '14:32:15', type: 'success', message: 'Power Source initialized', component: 'power-source-1' },
    { id: 2, time: '14:32:16', type: 'info', message: 'Data flowing to Transformer', component: 'transformer-1' },
    { id: 3, time: '14:32:17', type: 'success', message: 'AI Processor completed task', component: 'microchip-1' },
    { id: 4, time: '14:32:18', type: 'warning', message: 'Memory buffer 80% full', component: 'memory-chip-1' },
    { id: 5, time: '14:32:19', type: 'success', message: 'Email sent successfully', component: 'transmitter-1' },
  ]

  const systemMetrics = [
    { name: 'CPU Usage', value: 45, color: 'electric-blue' },
    { name: 'Memory', value: 67, color: 'electric-green' },
    { name: 'Network', value: 23, color: 'electric-orange' },
    { name: 'Storage', value: 89, color: 'electric-yellow' },
  ]

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-3 h-3 text-electric-green" />
      case 'warning': return <AlertCircle className="w-3 h-3 text-electric-yellow" />
      case 'error': return <XCircle className="w-3 h-3 text-electric-orange" />
      default: return <Activity className="w-3 h-3 text-electric-blue" />
    }
  }

  return (
    <div className="h-full bg-card/90 backdrop-blur-sm border-l border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm text-foreground">System Status</h2>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-electric-green animate-pulse" />
            <span className="text-xs text-electric-green font-medium">ACTIVE</span>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="p-2 bg-electric-blue/10 border-electric-blue/30">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-electric-blue" />
              <div>
                <div className="text-xs font-medium text-electric-blue">5</div>
                <div className="text-xs text-muted-foreground">Components</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-2 bg-electric-green/10 border-electric-green/30">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-electric-green" />
              <div>
                <div className="text-xs font-medium text-electric-green">98%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="execution" className="text-xs">Execution</TabsTrigger>
            <TabsTrigger value="metrics" className="text-xs">Metrics</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
          </TabsList>

          {/* Execution Tab */}
          <TabsContent value="execution" className="flex-1 p-4 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-foreground">Execution Log</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Play className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Pause className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2">
                {executionLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-2 bg-secondary/30 border-border/30">
                      <div className="flex items-start gap-2">
                        {getStatusIcon(log.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">
                              {log.time}
                            </span>
                            <Badge variant="outline" className="text-xs h-4">
                              {log.component}
                            </Badge>
                          </div>
                          <p className="text-xs text-foreground">{log.message}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="flex-1 p-4 overflow-hidden">
            <div className="h-full flex flex-col">
              <h3 className="font-semibold text-sm text-foreground mb-3">System Metrics</h3>
              
              <div className="space-y-4">
                {systemMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-3 bg-secondary/30 border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-foreground">{metric.name}</span>
                        <span className={`text-xs font-bold text-${metric.color}`}>{metric.value}%</span>
                      </div>
                      <Progress 
                        value={metric.value} 
                        className="h-2"
                      />
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Real-time Chart Placeholder */}
              <Card className="mt-4 p-3 bg-secondary/30 border-border/30 flex-1">
                <h4 className="text-xs font-medium text-foreground mb-2">Performance Graph</h4>
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Real-time metrics</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="flex-1 p-4 overflow-hidden">
            <div className="h-full flex flex-col">
              <h3 className="font-semibold text-sm text-foreground mb-3">Workflow Settings</h3>
              
              <div className="space-y-3">
                <Card className="p-3 bg-secondary/30 border-border/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-medium text-foreground">Auto-save</h4>
                      <p className="text-xs text-muted-foreground">Save changes automatically</p>
                    </div>
                    <div className="w-8 h-4 bg-electric-blue rounded-full relative">
                      <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5" />
                    </div>
                  </div>
                </Card>

                <Card className="p-3 bg-secondary/30 border-border/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-medium text-foreground">Debug Mode</h4>
                      <p className="text-xs text-muted-foreground">Show detailed execution info</p>
                    </div>
                    <div className="w-8 h-4 bg-border rounded-full relative">
                      <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5" />
                    </div>
                  </div>
                </Card>

                <Card className="p-3 bg-secondary/30 border-border/30">
                  <h4 className="text-xs font-medium text-foreground mb-2">Execution Interval</h4>
                  <select className="w-full text-xs bg-background border border-border rounded px-2 py-1">
                    <option>Every 5 minutes</option>
                    <option>Every 15 minutes</option>
                    <option>Every hour</option>
                    <option>Manual only</option>
                  </select>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
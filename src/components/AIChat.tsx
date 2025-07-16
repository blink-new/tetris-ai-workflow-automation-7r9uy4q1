import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface AIChatProps {
  onWorkflowSuggestion?: (suggestion: string) => void
}

export function AIChat({ onWorkflowSuggestion }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome to CircuitFlow! I\'m your AI assistant. Tell me what workflow you\'d like to build and I\'ll help you create it with electrical components.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
      
      // Trigger workflow suggestion if applicable
      if (onWorkflowSuggestion && aiResponse.includes('workflow')) {
        onWorkflowSuggestion(input)
      }
    }, 1000 + Math.random() * 2000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('email') || input.includes('notification')) {
      return 'Great! I can help you build an email notification workflow. You\'ll need: 1) A trigger component (like a timer or webhook), 2) An email processor chip, and 3) Output connectors. Start by placing a Timer component on the canvas!'
    }
    
    if (input.includes('data') || input.includes('process')) {
      return 'Perfect for a data processing pipeline! You\'ll want to connect: 1) Data input sensors, 2) Processing units (filters, transformers), and 3) Output displays. Try placing a Data Sensor first and connect it with cables!'
    }
    
    if (input.includes('schedule') || input.includes('time')) {
      return 'A scheduled workflow is a great choice! Use Timer components as your base, connect them to Logic Gates for conditions, and wire them to Action components. The electrical connections will show the flow of your automation!'
    }
    
    if (input.includes('api') || input.includes('webhook')) {
      return 'API integrations work beautifully here! Place a Webhook Receiver component, connect it through Signal Processors, and wire it to your desired outputs. Each connection represents data flow between services!'
    }
    
    return 'Interesting idea! In CircuitFlow, every workflow is like building an electrical circuit. Start by selecting components from the library on the left, place them on the grid, and connect them with cables. What specific automation are you trying to achieve?'
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="h-full bg-card/80 backdrop-blur-sm border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center electrical-glow"
            animate={{ 
              boxShadow: [
                '0 0 10px hsl(var(--electric-blue) / 30%)',
                '0 0 20px hsl(var(--electric-blue) / 50%)',
                '0 0 10px hsl(var(--electric-blue) / 30%)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bot className="w-4 h-4 text-background" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Workflow Builder Guide</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'ai' 
                  ? 'bg-electric-blue text-background' 
                  : 'bg-electric-orange text-background'
              }`}>
                {message.type === 'ai' ? (
                  <Bot className="w-3 h-3" />
                ) : (
                  <User className="w-3 h-3" />
                )}
              </div>
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`rounded-lg p-3 text-sm ${
                  message.type === 'ai'
                    ? 'bg-secondary/50 text-foreground'
                    : 'bg-electric-blue/20 text-foreground border border-electric-blue/30'
                }`}>
                  {message.content}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center">
              <Bot className="w-3 h-3 text-background" />
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 bg-electric-blue rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-electric-blue rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-electric-blue rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/30">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to build a workflow..."
            className="flex-1 bg-background/50 border-border/50 focus:border-electric-blue/50"
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-electric-blue hover:bg-electric-blue/80 text-background"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('Build an email notification workflow')}
            className="text-xs bg-background/30 border-border/50 hover:border-electric-blue/50"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Email Workflow
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('Create a data processing pipeline')}
            className="text-xs bg-background/30 border-border/50 hover:border-electric-blue/50"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Data Pipeline
          </Button>
        </div>
      </div>
    </Card>
  )
}
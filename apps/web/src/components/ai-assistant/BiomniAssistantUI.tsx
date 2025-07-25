'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { biomniClient } from '@/lib/ai/biomni-client'
import { 
  MessageSquare, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Brain,
  Sparkles,
  Zap,
  Shield,
  Users,
  FlaskConical,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LabContext {
  currentExperiment?: string
  equipmentStatus?: 'online' | 'offline' | 'maintenance'
  complianceStatus?: 'compliant' | 'warning' | 'non-compliant'
  temperature?: number
  humidity?: number
  lastCalibration?: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  toolCalls?: any[]
  metadata?: {
    experimentId?: string
    equipmentId?: string
    complianceCheck?: boolean
  }
}

export function BiomniAssistantUI() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Biomni, your AI laboratory assistant. I can help you with protocol design, data analysis, equipment management, compliance monitoring, and more. How can I assist you today?',
      timestamp: new Date(),
      metadata: {
        complianceCheck: false
      }
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [labContext, setLabContext] = useState<LabContext>({
    currentExperiment: 'PCR Analysis - Sample A',
    equipmentStatus: 'online',
    complianceStatus: 'compliant',
    temperature: 22.5,
    humidity: 45.2,
    lastCalibration: '2024-01-15'
  })

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about "${inputValue}". Let me analyze this in the context of your current experiment and laboratory conditions.`,
        timestamp: new Date(),
        metadata: {
          experimentId: labContext.currentExperiment,
          complianceCheck: true
        }
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'compliant':
        return 'text-green-400'
      case 'warning':
        return 'text-yellow-400'
      case 'offline':
      case 'non-compliant':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'compliant':
        return <CheckCircle className="w-4 h-4" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />
      case 'offline':
      case 'non-compliant':
        return <X className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-96 h-[600px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Biomni AI</h3>
                    <p className="text-xs text-gray-400">Laboratory Assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="text-gray-400 hover:text-white"
                      >
                        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isMinimized ? 'Maximize' : 'Minimize'}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Close</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Lab Context Status */}
                  <div className="p-4 border-b border-white/20">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(labContext.equipmentStatus || 'offline')}`}></div>
                        <span className="text-xs text-gray-400">Equipment</span>
                        <span className={`text-xs ${getStatusColor(labContext.equipmentStatus || 'offline')}`}>
                          {labContext.equipmentStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(labContext.complianceStatus || 'warning')}`}></div>
                        <span className="text-xs text-gray-400">Compliance</span>
                        <span className={`text-xs ${getStatusColor(labContext.complianceStatus || 'warning')}`}>
                          {labContext.complianceStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-gray-400">Temp</span>
                        <span className="text-xs text-white">{labContext.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-purple-400" />
                        <span className="text-xs text-gray-400">Humidity</span>
                        <span className="text-xs text-white">{labContext.humidity}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-blue-500/20 border border-blue-500/30' 
                            : 'bg-white/10 border border-white/20'
                        }`}>
                          <div className="flex items-start gap-2">
                            {message.role === 'assistant' && (
                              <Brain className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                            )}
                            <div>
                              <p className="text-sm text-white">{message.content}</p>
                              {message.metadata?.complianceCheck && (
                                <div className="flex items-center gap-1 mt-2">
                                  <Shield className="w-3 h-3 text-green-400" />
                                  <span className="text-xs text-green-400">Compliance verified</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-gray-400">Biomni is thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-white/20">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask Biomni about protocols, analysis, equipment..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Powered</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>Real-time</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-300">
                        Stanford Biomni
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsOpen(true)}
                  size="lg"
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                >
                  <MessageSquare className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-semibold">Biomni AI Assistant</p>
                  <p className="text-xs text-gray-400">Your laboratory AI companion</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </div>
    </TooltipProvider>
  )
} 
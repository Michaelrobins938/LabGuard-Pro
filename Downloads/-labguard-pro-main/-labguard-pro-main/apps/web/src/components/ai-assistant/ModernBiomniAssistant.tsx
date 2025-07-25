'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// Custom chat implementation since @assistant-ui/react doesn't export these
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

interface UseChatReturn {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  error: string | null
}

const useChat = (config: { api: string; initialMessages: Message[] }): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>(config.initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(config.api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error processing your request.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, input, handleInputChange, handleSubmit, isLoading, error }
}

const useCompletion = () => ({ complete: async () => ({ completion: '' }) })
const useAssistant = () => ({ messages: [], input: '', handleInputChange: () => {}, handleSubmit: () => {}, isLoading: false })
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Lightbulb, 
  Beaker, 
  Microscope, 
  Dna, 
  TestTube, 
  Brain, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  FileText, 
  Search, 
  Zap,
  Bot,
  User,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { biomniClient } from '@/lib/ai/biomni-client'
import { biomniIntegration } from '@/lib/ai/biomni-integration'
import { contextAnalyzer } from '@/lib/ai/context-analyzer'

interface LabContext {
  currentPage: string
  userRole: string
  equipmentCount: number
  pendingCalibrations: number
  complianceScore: number
  recentAlerts: string[]
}

interface Suggestion {
  id: string
  title: string
  description: string
  action: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  icon: any
  category: 'calibration' | 'compliance' | 'equipment' | 'optimization' | 'discovery' | 'research'
}

export function ModernBiomniAssistant() {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [biomniAvailable, setBiomniAvailable] = useState(false)
  const [labContext, setLabContext] = useState<LabContext>({
    currentPage: 'dashboard',
    userRole: 'lab_manager',
    equipmentCount: 145,
    pendingCalibrations: 3,
    complianceScore: 98.5,
    recentAlerts: []
  })

  // Initialize assistant-ui chat
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/ai/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "🧬 Hello! I'm Biomni, your AI laboratory assistant powered by Stanford's cutting-edge research. I can accelerate your research by 100x with access to 150+ tools, 59 databases, and 106 software packages. What would you like to explore today?"
      }
    ]
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize Biomni integration
  useEffect(() => {
    console.log('🧬 Initializing Stanford Biomni Assistant...')
    
    const initializeAssistant = async () => {
      const available = await biomniIntegration.checkAvailability()
      setBiomniAvailable(available)
      startProactiveMonitoring()
    }

    initializeAssistant()

    // Listen for toggle events
    const handleToggleAssistant = () => {
      setIsVisible(true)
      setIsExpanded(true)
    }

    window.addEventListener('toggle-assistant', handleToggleAssistant)
    return () => window.removeEventListener('toggle-assistant', handleToggleAssistant)
  }, [])

  // Proactive monitoring
  const startProactiveMonitoring = () => {
    console.log('🔬 Starting proactive monitoring with Stanford Biomni...')
    setInterval(async () => {
      if (!isExpanded) {
        try {
          const context = await contextAnalyzer.getCurrentContext()
          const analysis = await biomniIntegration.analyzeLabEquipment({
            equipmentCount: labContext.equipmentCount,
            pendingCalibrations: labContext.pendingCalibrations,
            complianceScore: labContext.complianceScore
          }, context)
          
          if (analysis.recommendations && analysis.recommendations.length > 0) {
            const criticalRecommendation = analysis.recommendations.find(rec => 
              rec.toLowerCase().includes('critical') || rec.toLowerCase().includes('urgent')
            )
            
            if (criticalRecommendation) {
              const suggestion: Suggestion = {
                id: `critical-${Date.now()}`,
                title: 'Critical Lab Action Required',
                description: criticalRecommendation,
                action: criticalRecommendation,
                priority: 'critical',
                confidence: analysis.confidence,
                icon: AlertTriangle,
                category: 'equipment'
              }
              
              setCurrentSuggestion(suggestion)
            }
          }
        } catch (error) {
          console.log('Proactive monitoring error:', error)
        }
      }
    }, 30000)
  }

  const handleApplySuggestion = () => {
    if (!currentSuggestion) return
    
    setIsExpanded(true)
    setCurrentSuggestion(null)
    
    // Add suggestion to chat
    const suggestionMessage = `🔬 Applying Stanford Biomni recommendation: "${currentSuggestion.title}". ${currentSuggestion.description}`
    handleInputChange({ target: { value: suggestionMessage } } as any)
  }

  const generateSuggestions = (): string[] => {
    return [
      "Design an experimental protocol",
      "Analyze genomic data",
      "Conduct literature review",
      "Optimize lab workflow",
      "Check equipment status",
      "Generate research hypothesis"
    ]
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange({ target: { value: suggestion } } as any)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) return

    // Check if it's a Biomni-specific query
    const lowerInput = input.toLowerCase()
    let enhancedInput = input

    if (lowerInput.includes('protocol') || lowerInput.includes('experiment') || lowerInput.includes('design')) {
      enhancedInput = `[BIOMNI_PROTOCOL] ${input}`
    } else if (lowerInput.includes('genomic') || lowerInput.includes('dna') || lowerInput.includes('sequence')) {
      enhancedInput = `[BIOMNI_GENOMIC] ${input}`
    } else if (lowerInput.includes('literature') || lowerInput.includes('review') || lowerInput.includes('paper')) {
      enhancedInput = `[BIOMNI_LITERATURE] ${input}`
    } else if (lowerInput.includes('equipment') || lowerInput.includes('calibration') || lowerInput.includes('maintenance')) {
      enhancedInput = `[BIOMNI_EQUIPMENT] ${input}`
    }

    handleInputChange({ target: { value: enhancedInput } } as any)
    handleSubmit(e)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
          style={{ zIndex: 1000 }}
        >
          {/* Collapsed State */}
          {!isExpanded && (
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Main Avatar */}
              <Card 
                className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 cursor-pointer shadow-2xl border-0"
                onClick={() => setIsExpanded(true)}
              >
                <CardContent className="p-0 w-full h-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </CardContent>
              </Card>
              
              {/* Status Indicator */}
              <div className="absolute -top-2 -right-2">
                <div className={`w-4 h-4 rounded-full ${biomniAvailable ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
              </div>
              
              {/* Welcome Bubble */}
              {showWelcome && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="absolute -left-80 top-4 w-72 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm mb-1">
                        Stanford Biomni AI Assistant 🧬
                      </h4>
                      <p className="text-xs text-gray-300 mb-3">
                        {biomniAvailable 
                          ? "Connected to Stanford's Biomni system. Ready to accelerate your research by 100x!"
                          : "Demo mode - Configure ANTHROPIC_API_KEY in .env.local or visit biomni.stanford.edu"
                        }
                      </p>
                      {!biomniAvailable && (
                        <div className="text-xs text-gray-400 mb-3 space-y-1">
                          <p>💡 <strong>Setup:</strong> <a href="https://github.com/snap-stanford/Biomni" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Official Guide</a></p>
                          <p>🌐 <strong>Web Interface:</strong> <a href="https://biomni.stanford.edu" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">biomni.stanford.edu</a></p>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setShowWelcome(false)
                            setIsExpanded(true)
                          }}
                          className="h-7 px-3 text-xs bg-gradient-to-r from-blue-500 to-purple-500"
                        >
                          Start Research
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowWelcome(false)}
                          className="h-7 px-3 text-xs hover:bg-white/10"
                        >
                          Later
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Speech bubble pointer */}
                  <div className="absolute right-4 top-6 w-0 h-0 border-l-8 border-l-white/20 border-t-4 border-t-transparent border-b-4 border-b-transparent transform rotate-90" />
                </motion.div>
              )}
              
              {/* Suggestion Bubble */}
              {currentSuggestion && !showWelcome && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="absolute -left-80 top-4 w-72 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentSuggestion.priority === 'critical' ? 'bg-red-500' :
                      currentSuggestion.priority === 'high' ? 'bg-orange-500' :
                      currentSuggestion.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      <currentSuggestion.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm mb-1">
                        {currentSuggestion.title}
                      </h4>
                      <p className="text-xs text-gray-300 mb-3">
                        {currentSuggestion.description}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={handleApplySuggestion}
                          className="h-7 px-3 text-xs bg-gradient-to-r from-teal-500 to-cyan-500"
                        >
                          Apply Now
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentSuggestion(null)}
                          className="h-7 px-3 text-xs hover:bg-white/10"
                        >
                          Later
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Speech bubble pointer */}
                  <div className="absolute right-4 top-6 w-0 h-0 border-l-8 border-l-white/20 border-t-4 border-t-transparent border-b-4 border-b-transparent transform rotate-90" />
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Expanded Chat Interface */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, height: 400 }}
              animate={{ opacity: 1, scale: 1, height: 500 }}
              exit={{ opacity: 0, scale: 0.9, height: 400 }}
              className="bg-white/10 backdrop-blur-md w-96 rounded-2xl overflow-hidden flex flex-col border border-white/20 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">🧬 Stanford Biomni</h3>
                    <p className="text-xs text-gray-400">
                      {isLoading ? 'Analyzing with Stanford AI...' : 
                       biomniAvailable ? 'Stanford AI Lab Partner' : 'Demo Mode'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${biomniAvailable ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={() => setIsSpeaking(!isSpeaking)}
                  >
                    {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={() => setIsExpanded(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end space-x-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {message.role === 'assistant' && (
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className={`rounded-2xl p-3 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        <p className="text-sm text-gray-200 whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-end space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                          <span className="text-sm text-gray-300">Analyzing with Stanford Biomni...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Suggestions */}
              {messages.length === 1 && !isLoading && (
                <div className="px-4 pb-2">
                  <div className="grid grid-cols-1 gap-2">
                    {generateSuggestions().map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-left text-xs text-blue-300 hover:text-blue-200 hover:bg-white/5 rounded-lg p-2 transition-colors border border-white/10"
                      >
                        💡 {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <form onSubmit={onSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about research, protocols, data analysis, or lab management..."
                    className="flex-1 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/70 focus:bg-white/15"
                    style={{
                      color: 'white',
                      textShadow: '0 0 1px rgba(255,255,255,0.3)'
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                    onClick={() => setIsListening(!isListening)}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 rounded-xl"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
} 
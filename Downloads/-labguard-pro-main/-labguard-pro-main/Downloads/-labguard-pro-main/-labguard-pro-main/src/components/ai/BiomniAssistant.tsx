'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  User, 
  TestTube, 
  Thermometer, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  MessageSquare,
  Zap
} from 'lucide-react'
import { PCRVerificationSystem } from '@/components/compliance/PCRVerificationSystem'
import { BiochemicalMediaValidator } from '@/components/compliance/BiochemicalMediaValidator'
import { CAPSafetyIncidentVerifier } from '@/components/compliance/CAPSafetyIncidentVerifier'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  complianceData?: any
}

interface ComplianceTool {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  component: React.ReactNode
}

export function BiomniAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  const complianceTools: ComplianceTool[] = [
    {
      id: 'pcr-verification',
      name: 'PCR Verification',
      description: 'Validate PCR run setup against protocols',
      icon: <TestTube className="h-4 w-4" />,
      component: <PCRVerificationSystem />
    },
    {
      id: 'media-validation',
      name: 'Media Validation',
      description: 'Check biochemical media safety and expiration',
      icon: <Thermometer className="h-4 w-4" />,
      component: <BiochemicalMediaValidator />
    },
    {
      id: 'incident-verification',
      name: 'Safety Incident Verification',
      description: 'Verify CAP safety incident protocols',
      icon: <Shield className="h-4 w-4" />,
      component: <CAPSafetyIncidentVerifier />
    }
  ]

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        handleSendMessage(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Add welcome message
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: `Hello! I'm Biomni, your AI laboratory compliance assistant. I can help you with:

🔬 **PCR Run Verification** - Validate PCR protocols before execution
🧪 **Media Safety Inspection** - Check biochemical media expiration and contamination
🛡️ **Safety Incident Verification** - Ensure CAP compliance for incidents

You can also ask me questions about laboratory procedures, compliance requirements, or use voice commands. How can I assist you today?`,
        timestamp: new Date()
      }
    ])
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsProcessing(true)

    // Check if user wants to access compliance tools
    const toolKeywords = {
      'pcr': 'pcr-verification',
      'pcr verification': 'pcr-verification',
      'pcr run': 'pcr-verification',
      'media': 'media-validation',
      'media validation': 'media-validation',
      'biochemical': 'media-validation',
      'incident': 'incident-verification',
      'safety incident': 'incident-verification',
      'cap': 'incident-verification',
      'compliance': 'pcr-verification'
    }

    const lowerContent = content.toLowerCase()
    const requestedTool = Object.entries(toolKeywords).find(([keyword]) => 
      lowerContent.includes(keyword)
    )?.[1]

    if (requestedTool) {
      setSelectedTool(requestedTool)
      setActiveTab('tools')
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I'll open the ${complianceTools.find(t => t.id === requestedTool)?.name} tool for you. You can now use it to validate your laboratory compliance requirements.`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsProcessing(false)
      return
    }

    // Process AI response
    try {
      const response = await processAIResponse(content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error processing message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or use one of the compliance tools directly.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const processAIResponse = async (userInput: string): Promise<string> => {
    // Simulate AI processing with compliance knowledge
    const complianceKeywords = [
      'pcr', 'protocol', 'validation', 'media', 'expiration', 'contamination',
      'incident', 'safety', 'cap', 'compliance', 'clia', 'accreditation'
    ]

    const hasComplianceKeywords = complianceKeywords.some(keyword => 
      userInput.toLowerCase().includes(keyword)
    )

    if (hasComplianceKeywords) {
      return `I can help you with laboratory compliance! Based on your question about "${userInput}", I recommend using one of our specialized compliance tools:

🔬 **PCR Verification** - For protocol validation and run setup
🧪 **Media Validation** - For checking media safety and expiration  
🛡️ **Safety Incident Verification** - For CAP compliance assessment

Would you like me to open the appropriate tool for you? Just say "open PCR verification" or "show me media validation" and I'll help you get started.`
    }

    // General laboratory assistance
    return `Thank you for your question about "${userInput}". As your AI laboratory assistant, I can help you with:

• Laboratory compliance and safety protocols
• Equipment calibration and maintenance
• Quality control procedures
• Documentation requirements
• Regulatory standards (CAP, CLIA, OSHA)

For specific compliance validation, I recommend using our specialized tools. You can also ask me to "open PCR verification", "show media validation", or "check safety incidents" for immediate access to compliance tools.`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Biomni AI Assistant
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            CAP Accredited
          </Badge>
        </CardTitle>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Compliance Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col space-y-4">
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'assistant' && (
                      <Bot className="h-4 w-4 mt-0.5 text-blue-600" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-0.5" />
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleListening}
                className={isListening ? 'bg-red-100 text-red-600' : ''}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <div className="flex-1 relative">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about laboratory compliance, or say 'open PCR verification' to use compliance tools..."
                  className="pr-12 resize-none"
                  rows={1}
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isProcessing}
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="flex-1 flex flex-col">
          {selectedTool ? (
            <div className="flex-1 overflow-y-auto p-4">
              {complianceTools.find(t => t.id === selectedTool)?.component}
            </div>
          ) : (
            <div className="flex-1 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {complianceTools.map((tool) => (
                  <Card
                    key={tool.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedTool(tool.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        {tool.icon}
                        {tool.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Select a compliance tool above to validate your laboratory procedures and ensure regulatory compliance.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 
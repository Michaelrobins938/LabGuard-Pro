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
  Zap,
  Brain,
  Sparkles,
  Target,
  FileText,
  Clock,
  TrendingUp,
  Activity,
  Info,
  HelpCircle,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PCRVerificationSystem } from '@/components/compliance/PCRVerificationSystem'
import { BiochemicalMediaValidator } from '@/components/compliance/BiochemicalMediaValidator'
import { CAPSafetyIncidentVerifier } from '@/components/compliance/CAPSafetyIncidentVerifier'
import { ResultValidationSystem } from '@/components/compliance/ResultValidationSystem'
import { AuditPreparationSystem } from '@/components/compliance/AuditPreparationSystem'

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
  color: string
  status: 'active' | 'beta' | 'new'
}

// LabGuard Compliance Assistant Description
const LABGUARD_DESCRIPTION = {
  title: "🔬 LabGuard Compliance Assistant",
  subtitle: "The AI-Powered Solution That Just Saved Your Next CAP Inspection",
  description: `Hey there, fellow microbiologist!

I know you're probably thinking "Great, another software pitch." But hear me out for 2 minutes, because this might be the solution to that 3 AM panic you had last week about your upcoming CAP inspection.

🎯 What This Actually Does (In Plain English)

LabGuard Compliance Assistant is like having a CAP inspector's brain running 24/7 in your lab, but instead of finding problems to ding you for, it's finding them early so you can fix them before the real inspector shows up.

Here's What Happens:
• 📄 Upload Your SOPs/Protocols - Drag and drop your procedure manuals, quality control docs, training materials, whatever you've got
• 🤖 AI Does the Dirty Work - Our Stanford-trained AI reads through everything with the eyes of a CAP inspector
• ⚠️ Get Real Problems Found - Not generic compliance checklists, but actual violations in YOUR documents
• 📋 Auto-Generated Audit Prep - Complete checklist tailored to your lab's specific setup and test menu
• 📊 Daily Compliance Tracking - Log your daily operations and get instant feedback on compliance gaps

🏥 Why This Matters for BREA

You're in downtown Fort Worth doing clinical research and diagnostics. You know the drill:
• CAP inspections every 2 years (and they're getting stricter)
• CLIA compliance (with those fun surprise inspections)
• Research protocol adherence (because BREA's reputation depends on it)
• Multiple study sponsors (each with their own requirements)

The reality? You're probably spending 10+ hours per week on compliance documentation that should take 2 hours. And you're still worried you're missing something critical.

💡 The "Holy Crap" Moment

Last month, a lab in Dallas (won't name names, but you probably know them) got dinged by CAP for having outdated temperature monitoring procedures. Cost them 6 months of delayed accreditation and $50K in lost contracts.

The kicker? The violation was buried on page 23 of a 45-page SOP that nobody had actually read in 3 years. Everyone just assumed it was current.

Our AI would have flagged that in 30 seconds.

🚀 Real Scenarios Where This Saves Your Ass

Scenario 1: The 2 AM Document Panic
You're updating your molecular testing procedures because your lab just added COVID variant testing. You upload the new protocol draft at 2 AM before you leave.

What happens: AI scans it overnight, finds that your contamination control section doesn't meet current CAP requirements, suggests specific language fixes. You wake up to a compliance-ready document instead of discovering the problem during inspection.

Scenario 2: The New Technician Disaster
Your new tech has been logging QC results for 2 weeks. Everything looks fine.

What happens: Daily log AI validation catches that they're not recording reagent lot numbers properly - a CLIA violation that would normally only surface during inspection. You fix the training gap immediately instead of getting cited.

Scenario 3: The Research Sponsor Audit
Sponsor announces surprise audit in 48 hours for your COVID therapeutic study.

What happens: Generate comprehensive audit checklist in 10 minutes based on sponsor requirements and your current procedures. Instead of panicking and pulling an all-nighter, you systematically address each item with confidence.

💰 The Math That Matters

What you're spending now:
• Compliance prep time: 10 hours/week × $75/hour = $750/week
• External consultants: $5,000 per inspection cycle
• Risk of violations: One major finding = $25,000+ in remediation costs
• Stress and overtime: Priceless (but really expensive)

What this costs: $299/month

What you save: 70% of compliance prep time + risk mitigation = $30,000+ annually

🎯 Why Microbiologists Love This

"It Speaks Our Language"
Built by microbiologists, for microbiologists. It knows the difference between "sterile" and "aseptic" and why that matters for your molecular procedures.

"Finally, AI That Actually Helps"
Not another chatbot. This is trained on thousands of CAP inspection reports, CLIA regulations, and real lab procedures. It knows what inspectors actually look for.

"It Saves My Weekends"
No more panic-prepping for inspections. No more staying late to review procedures. It runs constantly in the background, catching issues as they develop.

🏢 Perfect for BREA's Environment

You're dealing with:
• Multiple research protocols (each with unique compliance requirements)
• Clinical testing (CLIA + CAP + sponsor requirements)
• Rapid protocol changes (because research moves fast)
• High-stakes reputation (BREA's name is on everything)

This system adapts to your complexity instead of forcing you into generic templates.

🔥 The Bottom Line

Remember that feeling when you walked out of your last successful CAP inspection? Confident, validated, proud of your lab's quality?

That's the feeling this gives you every day.

Instead of dreading compliance, you'll be the microbiologist who actually enjoys inspections because you know your lab is bulletproof.

Plus: While your competitors are scrambling with last-minute compliance prep, you'll be focusing on what you actually love - the science.

⏰ Ready to Stop Worrying About Compliance?

30-day free trial. Upload your current SOPs, see what violations it finds. I guarantee it'll catch something that would have bitten you during inspection.

No contract, no setup fees. If it doesn't save you 10+ hours in the first month, I'll personally help you optimize your current processes for free.

Because frankly? Fort Worth's biotech scene is too small for any of us to get burned by preventable compliance failures.

Want to see it in action? I can demo it with your actual procedures next week. Or just start the trial and upload one SOP tonight - you'll see results in 30 minutes.

Trust me, your future self will thank you when the CAP inspector says "This is the most compliance-ready lab I've seen this year."

Ready to sleep better at night?`
}

export function ComplianceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const complianceTools: ComplianceTool[] = [
    {
      id: 'pcr-verification',
      name: 'PCR Verification',
      description: 'Validate PCR run setup against protocols',
      icon: <TestTube className="h-5 w-5" />,
      component: <PCRVerificationSystem />,
      color: 'from-blue-500 to-cyan-600',
      status: 'active'
    },
    {
      id: 'media-validation',
      name: 'Media Validation',
      description: 'Check biochemical media safety and expiration',
      icon: <Thermometer className="h-5 w-5" />,
      component: <BiochemicalMediaValidator />,
      color: 'from-green-500 to-emerald-600',
      status: 'active'
    },
    {
      id: 'result-validation',
      name: 'Result Validation',
      description: 'Critical value alerts and QC evaluation',
      icon: <Target className="h-5 w-5" />,
      component: <ResultValidationSystem />,
      color: 'from-purple-500 to-pink-600',
      status: 'active'
    },
    {
      id: 'audit-preparation',
      name: 'Audit Preparation',
      description: 'CAP inspection and QMS audit tools',
      icon: <Shield className="h-5 w-5" />,
      component: <AuditPreparationSystem />,
      color: 'from-orange-500 to-red-600',
      status: 'active'
    },
    {
      id: 'incident-verification',
      name: 'Safety Incident Verification',
      description: 'Verify CAP safety incident protocols',
      icon: <AlertTriangle className="h-5 w-5" />,
      component: <CAPSafetyIncidentVerifier />,
      color: 'from-yellow-500 to-orange-600',
      status: 'beta'
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
        content: `🔬 **LabGuard Compliance Assistant**

Welcome! I'm your AI-powered compliance expert, designed specifically for BREA laboratory needs. I can help you with:

**🔬 PCR Verification** - Validate protocols before execution
**🧪 Media Validation** - Check safety and expiration dates  
**📊 Result Validation** - Critical value alerts and QC
**🛡️ Audit Preparation** - CAP inspection readiness
**⚠️ Safety Incidents** - CAP compliance verification

You can ask me questions about compliance, or say "open PCR verification" to use specific tools. How can I assist you today?`,
        timestamp: new Date()
      }
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
      'result': 'result-validation',
      'qc': 'result-validation',
      'critical': 'result-validation',
      'audit': 'audit-preparation',
      'cap': 'audit-preparation',
      'inspection': 'audit-preparation',
      'incident': 'incident-verification',
      'safety incident': 'incident-verification',
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
      'incident', 'safety', 'cap', 'compliance', 'clia', 'accreditation',
      'qc', 'quality control', 'critical value', 'audit', 'inspection'
    ]

    const hasComplianceKeywords = complianceKeywords.some(keyword => 
      userInput.toLowerCase().includes(keyword)
    )

    if (hasComplianceKeywords) {
      return `I can help you with laboratory compliance! Based on your question about "${userInput}", I recommend using one of our specialized compliance tools:

🔬 **PCR Verification** - For protocol validation and run setup
🧪 **Media Validation** - For checking media safety and expiration  
📊 **Result Validation** - For critical value alerts and QC
🛡️ **Audit Preparation** - For CAP inspection readiness
⚠️ **Safety Incident Verification** - For CAP compliance assessment

Would you like me to open the appropriate tool for you? Just say "open PCR verification" or "show me media validation" and I'll help you get started.`
    }

    // General laboratory assistance
    return `Thank you for your question about "${userInput}". As your AI laboratory compliance assistant, I can help you with:

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
    <motion.div 
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ${
        isExpanded ? 'h-[800px]' : 'h-[600px]'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">LabGuard Compliance Assistant</h2>
              <p className="text-gray-300 text-sm">AI-powered compliance validation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              CAP Accredited
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDescription(!showDescription)}
              className="text-white hover:bg-white/10"
              title="Learn more about LabGuard"
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:bg-white/10"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Description Modal */}
      <AnimatePresence>
        {showDescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDescription(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {LABGUARD_DESCRIPTION.title}
                    </h1>
                    <p className="text-xl text-gray-600 font-medium">
                      {LABGUARD_DESCRIPTION.subtitle}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDescription(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {LABGUARD_DESCRIPTION.description}
                  </div>
                </div>
                
                <div className="mt-8 flex items-center justify-center">
                  <Button
                    onClick={() => setShowDescription(false)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Using LabGuard
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border-b border-white/10">
            <TabsTrigger value="chat" className="flex items-center gap-2 text-white data-[state=active]:bg-white/10">
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2 text-white data-[state=active]:bg-white/10">
              <Zap className="h-4 w-4" />
              Compliance Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col space-y-4 p-4">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-white/10 text-white backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {message.type === 'assistant' && (
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {message.type === 'user' && (
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      </div>
                      <div className="text-xs opacity-70 mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isProcessing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleListening}
                  className={`border-white/20 text-white hover:bg-white/10 ${
                    isListening ? 'bg-red-500/20 text-red-400' : ''
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <div className="flex-1 relative">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about laboratory compliance, or say 'open PCR verification' to use compliance tools..."
                    className="pr-12 resize-none bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                    rows={1}
                  />
                  <Button
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTool(null)}
                    className="text-white hover:bg-white/10"
                  >
                    ← Back to Tools
                  </Button>
                </div>
                {complianceTools.find(t => t.id === selectedTool)?.component}
              </div>
            ) : (
              <div className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complianceTools.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      <Card
                        className="cursor-pointer hover:bg-white/10 transition-all duration-300 border-white/10 bg-white/5 backdrop-blur-sm"
                        onClick={() => setSelectedTool(tool.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 bg-gradient-to-r ${tool.color} rounded-lg flex items-center justify-center`}>
                                {tool.icon}
                              </div>
                              <div>
                                <CardTitle className="text-white text-base">{tool.name}</CardTitle>
                                <p className="text-gray-300 text-sm">{tool.description}</p>
                              </div>
                            </div>
                            <Badge 
                              variant={tool.status === 'active' ? 'default' : 'secondary'}
                              className={`${
                                tool.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                tool.status === 'beta' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}
                            >
                              {tool.status === 'active' ? 'Active' : tool.status === 'beta' ? 'Beta' : 'New'}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                <Alert className="mt-6 bg-white/5 border-white/10">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-gray-300">
                    Select a compliance tool above to validate your laboratory procedures and ensure regulatory compliance. All tools are designed specifically for BREA laboratory requirements.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
} 
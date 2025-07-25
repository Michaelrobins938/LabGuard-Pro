'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BiomniAssistantUI } from '@/components/ai-assistant/BiomniAssistantUI'
import { useBiomniAssistant } from '@/hooks/useBiomniAssistant'
import { 
  Bot, 
  Beaker, 
  Dna, 
  Microscope, 
  Shield, 
  Database, 
  Code, 
  BarChart3, 
  BookOpen, 
  FlaskConical,
  Zap,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  MessageSquare,
  Settings,
  Download,
  Upload,
  HelpCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

export default function AIAssistantDemoPage() {
  const { state, actions } = useBiomniAssistant()

  const demoFeatures = [
    {
      title: '🧬 Protocol Design',
      description: 'Design experimental protocols using Stanford research',
      icon: Beaker,
      action: () => actions.sendMessage('Design a PCR protocol for gene expression analysis'),
      status: 'active'
    },
    {
      title: '🔬 Genomic Analysis',
      description: 'Process DNA/RNA data with advanced bioinformatics',
      icon: Dna,
      action: () => actions.sendMessage('Analyze RNA-seq data for differential expression'),
      status: 'active'
    },
    {
      title: '⚙️ Equipment Management',
      description: 'Monitor and optimize laboratory equipment',
      icon: Microscope,
      action: () => actions.sendMessage('Check equipment calibration status'),
      status: 'active'
    },
    {
      title: '🛡️ Compliance Monitoring',
      description: 'Ensure regulatory compliance and audit readiness',
      icon: Shield,
      action: () => actions.sendMessage('Review compliance status and generate audit report'),
      status: 'active'
    },
    {
      title: '📚 Literature Review',
      description: 'Conduct comprehensive literature reviews',
      icon: BookOpen,
      action: () => actions.sendMessage('Review recent literature on CRISPR gene editing'),
      status: 'active'
    },
    {
      title: '📊 Data Analysis',
      description: 'Advanced statistical and bioinformatics analysis',
      icon: BarChart3,
      action: () => actions.sendMessage('Perform statistical analysis on experimental data'),
      status: 'active'
    }
  ]

  const quickActions = [
    {
      title: 'Start New Chat',
      description: 'Begin a fresh conversation with Biomni',
      icon: MessageSquare,
      action: () => console.log('Start new chat')
    },
    {
      title: 'Export Chat History',
      description: 'Download your conversation history',
      icon: Download,
      action: () => console.log('Export chat')
    },
    {
      title: 'Import Chat History',
      description: 'Load previous conversations',
      icon: Upload,
      action: () => console.log('Import chat')
    },
    {
      title: 'Assistant Settings',
      description: 'Configure Biomni preferences',
      icon: Settings,
      action: () => console.log('Open settings')
    }
  ]

  return (
    <div className="space-y-6">
      {/* Biomni AI Assistant */}
      <BiomniAssistantUI />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biomni AI Assistant Demo</h1>
          <p className="text-gray-600 mt-2">
            Experience Stanford's cutting-edge AI laboratory assistant with persistent memory and advanced capabilities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Assistant Online
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by assistant-ui
          </Badge>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Biomni Status</p>
                <p className="text-lg font-bold text-gray-900">
                  {state.biomniAvailable ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FlaskConical className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Equipment</p>
                <p className="text-lg font-bold text-gray-900">{state.labContext.equipmentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Calibrations</p>
                <p className="text-lg font-bold text-gray-900">{state.labContext.pendingCalibrations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance</p>
                <p className="text-lg font-bold text-gray-900">{state.labContext.complianceScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Biomni AI Capabilities
          </CardTitle>
          <p className="text-gray-600">
            Click on any feature to test Biomni's advanced AI capabilities powered by Stanford research.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoFeatures.map((feature, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left justify-start bg-white hover:bg-blue-50 border-blue-200"
                onClick={feature.action}
              >
                <feature.icon className="h-6 w-6 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{feature.title}</p>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Quick Actions
          </CardTitle>
          <p className="text-gray-600">
            Manage your Biomni assistant and chat history.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left justify-start bg-white hover:bg-gray-50"
                onClick={action.action}
              >
                <action.icon className="h-5 w-5 mr-3 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assistant Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Assistant Controls
          </CardTitle>
          <p className="text-gray-600">
            Control the Biomni assistant interface and behavior.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant={state.isVisible ? "default" : "outline"}
              onClick={actions.toggleVisibility}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {state.isVisible ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Hide Assistant
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Show Assistant
                </>
              )}
            </Button>

            <Button
              variant={state.isExpanded ? "default" : "outline"}
              onClick={actions.toggleExpanded}
              className="bg-green-500 hover:bg-green-600"
            >
              {state.isExpanded ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Minimize
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Expand
                </>
              )}
            </Button>

            <Button
              variant={state.isListening ? "default" : "outline"}
              onClick={actions.toggleVoice}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {state.isListening ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Voice
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Voice
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={actions.checkBiomniAvailability}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Check Status
            </Button>

            <Button
              variant="outline"
              onClick={() => actions.sendMessage('Hello Biomni!')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Test Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            assistant-ui Features
          </CardTitle>
          <p className="text-gray-600">
            Advanced features powered by the assistant-ui library.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">💾 Persistent Memory</h4>
              <p className="text-sm text-gray-600">
                Chat history is automatically saved and restored across sessions using localStorage and database storage.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">⚡ Real-time Streaming</h4>
              <p className="text-sm text-gray-600">
                Responses stream in real-time for a more engaging and responsive chat experience.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">🔧 Tool Integration</h4>
              <p className="text-sm text-gray-600">
                Seamless integration with Biomni's 150+ tools and 59 databases for advanced research capabilities.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">🎨 Customizable UI</h4>
              <p className="text-sm text-gray-600">
                Fully customizable interface with shadcn/ui components and modern design patterns.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">♿ Accessibility</h4>
              <p className="text-sm text-gray-600">
                Built-in accessibility features including screen reader support and keyboard navigation.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">📱 Responsive Design</h4>
              <p className="text-sm text-gray-600">
                Optimized for all devices with responsive design and mobile-friendly interface.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            How to Use
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Start a Conversation</h4>
                <p className="text-sm text-gray-600">
                  Click on the Biomni assistant in the bottom-right corner to start chatting. You can ask about protocols, equipment, compliance, or any laboratory research topic.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Try Advanced Features</h4>
                <p className="text-sm text-gray-600">
                  Use the demo features above to test Biomni's capabilities. Click on any feature to send a pre-written message to the assistant.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Explore Tools</h4>
                <p className="text-sm text-gray-600">
                  Biomni can execute tools and perform complex analyses. Try asking it to design protocols, analyze data, or review literature.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Manage History</h4>
                <p className="text-sm text-gray-600">
                  Your conversations are automatically saved. Use the quick actions to export, import, or manage your chat history.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
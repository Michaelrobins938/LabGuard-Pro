'use client'

import { useState } from 'react'
import { EnhancedBiomniAssistant } from '@/components/ai-assistant/EnhancedBiomniAssistant'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Beaker, Microscope, Dna, TestTube, Brain, Sparkles } from 'lucide-react'

export default function BiomniDemoPage() {
  const [currentState, setCurrentState] = useState('idle')

  const states = [
    { key: 'idle', label: 'Idle', icon: Beaker },
    { key: 'thinking', label: 'Thinking', icon: Brain },
    { key: 'speaking', label: 'Speaking', icon: Microscope },
    { key: 'excited', label: 'Excited', icon: Sparkles },
    { key: 'concerned', label: 'Concerned', icon: TestTube },
    { key: 'analyzing', label: 'Analyzing', icon: Dna },
    { key: 'discovering', label: 'Discovering', icon: Beaker },
    { key: 'helpful', label: 'Helpful', icon: Microscope }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧬 Biomni AI Assistant Demo
          </h1>
          <p className="text-xl text-gray-300">
            Experience the future of laboratory AI assistance
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Beaker className="w-5 h-5 text-blue-400" />
                <span>Microbiology Themed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Designed specifically for laboratory environments with DNA helix animations and petri dish styling.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>Interactive States</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Multiple expressive states that respond to user interactions and lab context.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span>Smart Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Proactive recommendations for equipment calibration, compliance, and lab optimization.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Microscope className="w-5 h-5 text-green-400" />
                <span>Stanford AI Powered</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Built on Stanford's cutting-edge Biomni research platform for advanced laboratory intelligence.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Dna className="w-5 h-5 text-pink-400" />
                <span>Real-time Monitoring</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Continuously monitors lab equipment, compliance status, and provides timely alerts.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <TestTube className="w-5 h-5 text-cyan-400" />
                <span>Voice Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Voice commands and speech synthesis for hands-free laboratory operations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* State Tester */}
        <Card className="glass-card border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white">Test Avatar States</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {states.map((state) => {
                const IconComponent = state.icon
                return (
                  <Button
                    key={state.key}
                    onClick={() => setCurrentState(state.key)}
                    variant={currentState === state.key ? "default" : "outline"}
                    className="flex items-center space-x-2 h-12"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{state.label}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Interactive Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">
              Click the Biomni avatar in the bottom right corner to interact with it. Try asking about:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Equipment Management</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• "Show me equipment that needs calibration"</li>
                  <li>• "Check equipment status"</li>
                  <li>• "Schedule maintenance"</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Compliance & Analytics</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• "Generate compliance report"</li>
                  <li>• "Check audit status"</li>
                  <li>• "Analyze lab performance"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biomni Assistant - Always visible */}
              <EnhancedBiomniAssistant />
    </div>
  )
} 
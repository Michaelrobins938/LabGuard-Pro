'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Beaker, 
  Search, 
  Lightbulb, 
  Zap, 
  TrendingUp, 
  Eye, 
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Cpu
} from 'lucide-react'
import { ProtocolGenerator } from '@/components/biomni/ProtocolGenerator'
import { BiomniInsights } from '@/components/dashboard/BiomniInsights'
import { openRouterClient } from '@/lib/ai/openrouter-client'

interface BiomniStats {
  totalQueries: number
  protocolsGenerated: number
  insightsGenerated: number
  totalCost: number
  averageConfidence: number
  modelsUsed: string[]
}

export default function BiomniDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [openRouterStatus, setOpenRouterStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')
  const [stats, setStats] = useState<BiomniStats>({
    totalQueries: 0,
    protocolsGenerated: 0,
    insightsGenerated: 0,
    totalCost: 0,
    averageConfidence: 0,
    modelsUsed: []
  })

  // Check OpenRouter status on component mount
  useState(() => {
    checkOpenRouterStatus()
  })

  const checkOpenRouterStatus = async () => {
    try {
      const isAvailable = await openRouterClient.checkAvailability()
      setOpenRouterStatus(isAvailable ? 'available' : 'unavailable')
    } catch (error) {
      setOpenRouterStatus('unavailable')
    }
  }

  const handleProtocolGenerated = (protocol: any) => {
    setStats(prev => ({
      ...prev,
      protocolsGenerated: prev.protocolsGenerated + 1,
      totalQueries: prev.totalQueries + 1,
      totalCost: prev.totalCost + protocol.cost,
      modelsUsed: [...new Set([...prev.modelsUsed, protocol.model])]
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100'
      case 'unavailable':
        return 'text-red-600 bg-red-100'
      case 'checking':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />
      case 'unavailable':
        return <AlertTriangle className="w-4 h-4" />
      case 'checking':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🧬 Biomni AI Laboratory</h1>
          <p className="text-gray-600 mt-2">
            Stanford's cutting-edge AI platform for laboratory research and compliance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={getStatusColor(openRouterStatus)}>
            {getStatusIcon(openRouterStatus)}
            <span className="ml-1">
              {openRouterStatus === 'available' ? 'OpenRouter Connected' :
               openRouterStatus === 'unavailable' ? 'OpenRouter Unavailable' :
               'Checking Connection...'}
            </span>
          </Badge>
          <Button variant="outline" onClick={checkOpenRouterStatus}>
            <Zap className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalQueries}</p>
                <p className="text-sm text-gray-600">Total Queries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Beaker className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.protocolsGenerated}</p>
                <p className="text-sm text-gray-600">Protocols Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.insightsGenerated}</p>
                <p className="text-sm text-gray-600">AI Insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">${stats.totalCost.toFixed(3)}</p>
                <p className="text-sm text-gray-600">Total Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="protocols" className="flex items-center space-x-2">
            <Beaker className="w-4 h-4" />
            <span>Protocol Generator</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>AI Insights</span>
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center space-x-2">
            <Cpu className="w-4 h-4" />
            <span>Models</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Biomni Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Biomni Capabilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">150+</div>
                    <div className="text-sm text-blue-800">Biomedical Tools</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">59</div>
                    <div className="text-sm text-green-800">Scientific Databases</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">105</div>
                    <div className="text-sm text-purple-800">Software Packages</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">4</div>
                    <div className="text-sm text-orange-800">AI Models</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Available Tools:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">DNA/RNA Analysis</Badge>
                    <Badge variant="outline">Protein Structure</Badge>
                    <Badge variant="outline">CRISPR Design</Badge>
                    <Badge variant="outline">Cell Culture</Badge>
                    <Badge variant="outline">Drug Discovery</Badge>
                    <Badge variant="outline">Protocol Generation</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OpenRouter Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>OpenRouter Models</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      name: 'Claude 3.5 Sonnet',
                      provider: 'Anthropic',
                      cost: '$3/1M tokens',
                      bestFor: 'Protocol generation, Analysis'
                    },
                    {
                      name: 'Claude 3 Opus',
                      provider: 'Anthropic',
                      cost: '$15/1M tokens',
                      bestFor: 'Advanced research'
                    },
                    {
                      name: 'GPT-4o',
                      provider: 'OpenAI',
                      cost: '$5/1M tokens',
                      bestFor: 'General tasks'
                    },
                    {
                      name: 'Gemini Pro',
                      provider: 'Google',
                      cost: '$3.5/1M tokens',
                      bestFor: 'Technical tasks'
                    }
                  ].map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-sm text-gray-500">{model.provider}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{model.cost}</div>
                        <div className="text-xs text-gray-500">{model.bestFor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => setActiveTab('protocols')}
                >
                  <Beaker className="w-6 h-6" />
                  <span>Generate Protocol</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => setActiveTab('insights')}
                >
                  <Brain className="w-6 h-6" />
                  <span>View AI Insights</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col space-y-2"
                  onClick={() => setActiveTab('models')}
                >
                  <Cpu className="w-6 h-6" />
                  <span>Model Comparison</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Protocols Tab */}
        <TabsContent value="protocols">
          <ProtocolGenerator onProtocolGenerated={handleProtocolGenerated} />
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights">
          <BiomniInsights />
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Capabilities Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Model</th>
                      <th className="text-left p-2">Max Tokens</th>
                      <th className="text-left p-2">Cost/1M</th>
                      <th className="text-left p-2">Best For</th>
                      <th className="text-left p-2">Strengths</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(openRouterClient.getRecommendedModels()).map(([task, model]) => {
                      const capabilities = openRouterClient.getModelCapabilities(model)
                      return (
                        <tr key={model} className="border-b">
                          <td className="p-2 font-medium">{model}</td>
                          <td className="p-2">{capabilities.maxTokens.toLocaleString()}</td>
                          <td className="p-2">${openRouterClient.calculateCost(1000000, model).toFixed(2)}</td>
                          <td className="p-2">{task.replace('_', ' ')}</td>
                          <td className="p-2">{capabilities.strengths.join(', ')}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, TrendingUp, AlertCircle, Lightbulb, Zap, Clock, CheckCircle, Eye } from 'lucide-react'
import { openRouterClient } from '@/lib/ai/openrouter-client'

interface BiomniInsight {
  id: string
  type: 'optimization' | 'prediction' | 'recommendation' | 'alert' | 'discovery'
  title: string
  description: string
  confidence: number
  equipmentId?: string
  equipmentName?: string
  createdAt: string
  model: string
  cost: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'calibration' | 'compliance' | 'equipment' | 'research' | 'workflow'
}

interface LabMetrics {
  totalEquipment: number
  compliantEquipment: number
  overdueCalibrations: number
  complianceScore: number
  recentAlerts: number
  aiRecommendations: number
}

export function BiomniInsights() {
  const [insights, setInsights] = useState<BiomniInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [labMetrics, setLabMetrics] = useState<LabMetrics>({
    totalEquipment: 0,
    compliantEquipment: 0,
    overdueCalibrations: 0,
    complianceScore: 0,
    recentAlerts: 0,
    aiRecommendations: 0
  })
  const [openRouterAvailable, setOpenRouterAvailable] = useState(false)

  useEffect(() => {
    initializeInsights()
  }, [])

  const initializeInsights = async () => {
    try {
      // Check OpenRouter availability
      const isAvailable = await openRouterClient.checkAvailability()
      setOpenRouterAvailable(isAvailable)

      if (isAvailable) {
        await generateAIInsights()
      } else {
        // Fallback to mock data
        setInsights(generateMockInsights())
      }

      // Set mock lab metrics
      setLabMetrics({
        totalEquipment: 47,
        compliantEquipment: 44,
        overdueCalibrations: 3,
        complianceScore: 93.6,
        recentAlerts: 2,
        aiRecommendations: 8
      })

    } catch (error) {
      console.error('Failed to initialize insights:', error)
      setInsights(generateMockInsights())
    } finally {
      setLoading(false)
    }
  }

  const generateAIInsights = async () => {
    try {
      // Generate insights using OpenRouter
      const labData = {
        equipmentCount: labMetrics.totalEquipment,
        complianceRate: labMetrics.complianceScore,
        overdueCalibrations: labMetrics.overdueCalibrations,
        recentAlerts: labMetrics.recentAlerts
      }

      const response = await openRouterClient.analyzeLabData(
        labData,
        'equipment',
        'Laboratory equipment optimization and compliance analysis'
      )

      // Parse AI response and create insights
      const aiInsights: BiomniInsight[] = [
        {
          id: 'ai-1',
          type: 'optimization',
          title: 'Equipment Calibration Optimization',
          description: response.choices[0].message.content.substring(0, 200) + '...',
          confidence: 0.92,
          equipmentName: 'Multiple Equipment',
          createdAt: new Date().toISOString(),
          model: response.model,
          cost: openRouterClient.calculateCost(response.usage.total_tokens, response.model),
          priority: 'high',
          category: 'calibration'
        }
      ]

      setInsights(aiInsights)
    } catch (error) {
      console.error('Failed to generate AI insights:', error)
      setInsights(generateMockInsights())
    }
  }

  const generateMockInsights = (): BiomniInsight[] => {
    return [
      {
        id: '1',
        type: 'optimization',
        title: 'Calibration Schedule Optimization',
        description: 'AI analysis suggests optimizing calibration intervals for 3 pieces of equipment, potentially saving 15 hours per month.',
        confidence: 0.89,
        equipmentName: 'Analytical Balance PB-220',
        createdAt: new Date().toISOString(),
        model: 'anthropic/claude-3.5-sonnet',
        cost: 0.0002,
        priority: 'high',
        category: 'calibration'
      },
      {
        id: '2',
        type: 'prediction',
        title: 'Equipment Failure Prediction',
        description: 'Based on performance trends, Centrifuge CF-16 may require maintenance within 30 days.',
        confidence: 0.76,
        equipmentName: 'Centrifuge CF-16',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        model: 'anthropic/claude-3.5-sonnet',
        cost: 0.0001,
        priority: 'medium',
        category: 'equipment'
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Compliance Enhancement',
        description: 'Implement automated QC checks for PCR protocols to improve compliance rate from 93.6% to 98.2%.',
        confidence: 0.94,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        model: 'openai/gpt-4o',
        cost: 0.0003,
        priority: 'high',
        category: 'compliance'
      },
      {
        id: '4',
        type: 'discovery',
        title: 'Research Protocol Optimization',
        description: 'AI analysis of recent experiments suggests 23% efficiency improvement potential through protocol optimization.',
        confidence: 0.87,
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        model: 'anthropic/claude-3-opus',
        cost: 0.0008,
        priority: 'medium',
        category: 'research'
      },
      {
        id: '5',
        type: 'alert',
        title: 'Temperature Variance Detected',
        description: 'Incubator IC-200 showing temperature variance beyond acceptable limits. Immediate attention recommended.',
        confidence: 0.98,
        equipmentName: 'Incubator IC-200',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        model: 'anthropic/claude-3.5-sonnet',
        cost: 0.0001,
        priority: 'critical',
        category: 'equipment'
      }
    ]
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="w-4 h-4 text-blue-500" />
      case 'prediction':
        return <Brain className="w-4 h-4 text-purple-500" />
      case 'recommendation':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'discovery':
        return <Eye className="w-4 h-4 text-green-500" />
      default:
        return <Brain className="w-4 h-4 text-gray-500" />
    }
  }

  const getInsightBadge = (type: string) => {
    const badgeStyles: Record<string, string> = {
      optimization: 'bg-blue-100 text-blue-800',
      prediction: 'bg-purple-100 text-purple-800',
      recommendation: 'bg-yellow-100 text-yellow-800',
      alert: 'bg-red-100 text-red-800',
      discovery: 'bg-green-100 text-green-800'
    }
    
    return (
      <Badge className={badgeStyles[type] || 'bg-gray-100 text-gray-800'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityStyles: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={priorityStyles[priority] || 'bg-gray-100 text-gray-800'}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const handleRefreshInsights = async () => {
    setLoading(true)
    await generateAIInsights()
    setLoading(false)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Biomni AI Insights</span>
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              OpenRouter
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Biomni AI Insights</span>
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              {openRouterAvailable ? 'OpenRouter Connected' : 'Demo Mode'}
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefreshInsights}>
            <Brain className="w-4 h-4 mr-2" />
            Refresh AI Analysis
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          AI-powered insights and recommendations for your laboratory using {openRouterAvailable ? 'OpenRouter' : 'demo'} models
        </p>
      </CardHeader>
      
      <CardContent>
        {/* Lab Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{labMetrics.totalEquipment}</div>
            <div className="text-xs text-blue-800">Total Equipment</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{labMetrics.complianceScore}%</div>
            <div className="text-xs text-green-800">Compliance Rate</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{labMetrics.overdueCalibrations}</div>
            <div className="text-xs text-yellow-800">Overdue</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{labMetrics.aiRecommendations}</div>
            <div className="text-xs text-purple-800">AI Insights</div>
          </div>
        </div>

        {/* Insights List */}
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.slice(0, 5).map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        {getInsightBadge(insight.type)}
                        {getPriorityBadge(insight.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {insight.equipmentName && (
                          <span className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {insight.equipmentName}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Brain className="w-3 h-3 mr-1" />
                          {insight.model}
                        </span>
                        <span className="flex items-center">
                          <Zap className="w-3 h-3 mr-1" />
                          ${insight.cost.toFixed(4)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(insight.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {(insight.confidence * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                </div>
              </div>
            ))}
            
            {insights.length > 5 && (
              <Button variant="link" className="w-full text-sm">
                View all {insights.length} insights →
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No AI insights available</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={handleRefreshInsights}>
              Generate Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
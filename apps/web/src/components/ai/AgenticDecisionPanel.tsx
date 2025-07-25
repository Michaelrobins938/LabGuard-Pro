'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  Lightbulb,
  Settings,
  Play,
  Pause
} from 'lucide-react'

interface AgenticAction {
  id: string
  type: 'AUTOMATED_CALIBRATION' | 'PREDICTIVE_MAINTENANCE' | 'COMPLIANCE_CHECK' | 'PROTOCOL_OPTIMIZATION' | 'RISK_ASSESSMENT'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  action: string
  parameters: Record<string, any>
  confidence: number
  estimatedImpact: string
  requiresApproval: boolean
  automated: boolean
}

interface BiomniDecision {
  id: string
  analysis: string
  recommendations: string[]
  actions: AgenticAction[]
  confidence: number
  reasoning: string
  alternatives: string[]
}

export function AgenticDecisionPanel() {
  const [decision, setDecision] = useState<BiomniDecision | null>(null)
  const [loading, setLoading] = useState(false)
  const [executingAction, setExecutingAction] = useState<string | null>(null)
  const [autoMode, setAutoMode] = useState(false)

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'AUTOMATED_CALIBRATION':
        return <Settings className="w-4 h-4" />
      case 'PREDICTIVE_MAINTENANCE':
        return <TrendingUp className="w-4 h-4" />
      case 'COMPLIANCE_CHECK':
        return <Shield className="w-4 h-4" />
      case 'PROTOCOL_OPTIMIZATION':
        return <Target className="w-4 h-4" />
      case 'RISK_ASSESSMENT':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH':
        return 'text-red-600'
      case 'MEDIUM':
        return 'text-orange-600'
      case 'LOW':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const makeAgenticDecision = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/biomni/agentic-decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context: {
            laboratoryId: 'lab-001',
            userId: 'user-001',
            currentEquipment: [
              { id: 'eq-001', type: 'Centrifuge', status: 'active', lastCalibration: '2024-01-15' },
              { id: 'eq-002', type: 'Spectrophotometer', status: 'maintenance', lastCalibration: '2024-01-10' },
              { id: 'eq-003', type: 'PCR Machine', status: 'active', lastCalibration: '2024-01-20' }
            ],
            recentCalibrations: [
              { equipmentId: 'eq-001', date: '2024-01-15', status: 'PASS', technician: 'Dr. Smith' },
              { equipmentId: 'eq-002', date: '2024-01-10', status: 'FAIL', technician: 'Dr. Johnson' }
            ],
            complianceStatus: {
              overall: 98.5,
              critical: 100,
              warnings: 2,
              issues: 0
            },
            activeProtocols: [
              { id: 'proto-001', name: 'PCR Amplification', status: 'active', efficiency: 94.2 },
              { id: 'proto-002', name: 'Cell Culture', status: 'active', efficiency: 96.8 }
            ],
            pendingTasks: [
              { id: 'task-001', type: 'calibration', equipmentId: 'eq-003', dueDate: '2024-02-01' },
              { id: 'task-002', type: 'maintenance', equipmentId: 'eq-002', dueDate: '2024-01-25' }
            ],
            riskFactors: [
              { factor: 'Equipment aging', risk: 'medium', impact: 'performance degradation' },
              { factor: 'Staff training gaps', risk: 'low', impact: 'protocol deviations' }
            ],
            performanceMetrics: {
              averageCalibrationTime: '2.3 hours',
              successRate: 99.2,
              efficiency: 94.8,
              complianceRate: 98.5
            }
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        setDecision(result)
      } else {
        console.error('Failed to make agentic decision')
      }
    } catch (error) {
      console.error('Agentic decision error:', error)
    } finally {
      setLoading(false)
    }
  }

  const executeAction = async (action: AgenticAction) => {
    setExecutingAction(action.id)
    
    try {
      const response = await fetch('/api/biomni/autonomous-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          context: {
            laboratoryId: 'lab-001',
            userId: 'user-001'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Action executed:', result)
        
        // Refresh decision after action execution
        setTimeout(() => {
          makeAgenticDecision()
        }, 2000)
      } else {
        console.error('Failed to execute action')
      }
    } catch (error) {
      console.error('Action execution error:', error)
    } finally {
      setExecutingAction(null)
    }
  }

  const executeAllAutomatedActions = async () => {
    if (!decision) return
    
    const automatedActions = decision.actions.filter(action => action.automated)
    
    for (const action of automatedActions) {
      await executeAction(action)
    }
  }

  useEffect(() => {
    // Make initial decision
    makeAgenticDecision()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agentic Decision Engine</h2>
          <p className="text-gray-600">AI-powered autonomous decision-making for laboratory optimization</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={autoMode ? "default" : "outline"}
            onClick={() => setAutoMode(!autoMode)}
            className="flex items-center space-x-2"
          >
            {autoMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{autoMode ? 'Auto Mode' : 'Manual Mode'}</span>
          </Button>
          <Button
            onClick={makeAgenticDecision}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>{loading ? 'Analyzing...' : 'Make Decision'}</span>
          </Button>
        </div>
      </div>

      {/* Decision Analysis */}
      {decision && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI Analysis</span>
                <Badge className="ml-auto">
                  {Math.round(decision.confidence * 100)}% Confidence
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Analysis</h4>
                <p className="text-gray-600 text-sm">{decision.analysis}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {decision.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Reasoning</h4>
                <p className="text-gray-600 text-sm">{decision.reasoning}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Recommended Actions</span>
                {autoMode && (
                  <Button
                    size="sm"
                    onClick={executeAllAutomatedActions}
                    className="ml-auto"
                  >
                    Execute All Automated
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {decision.actions.map((action) => (
                  <div key={action.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getActionIcon(action.type)}
                        <div>
                          <h4 className="font-medium text-gray-900">{action.description}</h4>
                          <p className="text-sm text-gray-600">{action.action}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(action.priority)}>
                        {action.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className={`font-medium ${getImpactColor(action.estimatedImpact)}`}>
                          Impact: {action.estimatedImpact}
                        </span>
                        <span className="text-gray-600">
                          Confidence: {Math.round(action.confidence * 100)}%
                        </span>
                      </div>
                      
                      {action.automated ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Automated
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Manual Approval
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {action.automated ? (
                        <Button
                          size="sm"
                          onClick={() => executeAction(action)}
                          disabled={executingAction === action.id}
                          className="flex-1"
                        >
                          {executingAction === action.id ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Executing...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Execute Now
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Requires Approval
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alternatives */}
      {decision && decision.alternatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alternative Approaches</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {decision.alternatives.map((alt, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{alt}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Auto Mode Status */}
      {autoMode && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-medium">Auto Mode Active</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              The system will automatically execute approved actions and continuously monitor laboratory conditions.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
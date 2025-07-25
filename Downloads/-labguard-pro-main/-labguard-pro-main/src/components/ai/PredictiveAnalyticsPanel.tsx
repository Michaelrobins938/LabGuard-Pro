'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Target,
  BarChart3,
  Calendar,
  Activity,
  Zap,
  Brain,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface Prediction {
  type: string
  target: string
  probability: number
  timeframe: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  confidence: number
  factors: string[]
  recommendations: string[]
}

interface PredictiveAnalysis {
  predictions: Prediction[]
  trends: string[]
  anomalies: string[]
  riskAssessment: string
  actionPlan: string[]
}

export function PredictiveAnalyticsPanel() {
  const [analysis, setAnalysis] = useState<PredictiveAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [timeframe, setTimeframe] = useState('6 months')
  const [confidence, setConfidence] = useState(0.85)

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'MEDIUM':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'LOW':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'EQUIPMENT_FAILURE':
        return <AlertTriangle className="w-4 h-4" />
      case 'CALIBRATION_SCHEDULE':
        return <Clock className="w-4 h-4" />
      case 'RESOURCE_CONSUMPTION':
        return <BarChart3 className="w-4 h-4" />
      case 'PERFORMANCE_TREND':
        return <TrendingUp className="w-4 h-4" />
      case 'RISK_FACTOR':
        return <Target className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  const performPredictiveAnalysis = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/biomni/predictive-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            equipmentHistory: [
              { equipmentId: 'eq-001', type: 'Centrifuge', failures: 2, lastMaintenance: '2024-01-01', usageHours: 1200 },
              { equipmentId: 'eq-002', type: 'Spectrophotometer', failures: 1, lastMaintenance: '2024-01-15', usageHours: 800 },
              { equipmentId: 'eq-003', type: 'PCR Machine', failures: 0, lastMaintenance: '2024-01-10', usageHours: 600 }
            ],
            calibrationHistory: [
              { equipmentId: 'eq-001', frequency: 'monthly', lastCalibration: '2024-01-15', nextDue: '2024-02-15' },
              { equipmentId: 'eq-002', frequency: 'quarterly', lastCalibration: '2024-01-10', nextDue: '2024-04-10' },
              { equipmentId: 'eq-003', frequency: 'monthly', lastCalibration: '2024-01-20', nextDue: '2024-02-20' }
            ],
            performanceMetrics: {
              averageCalibrationTime: '2.3 hours',
              successRate: 99.2,
              efficiency: 94.8,
              downtime: '1.2%'
            },
            resourceConsumption: {
              reagents: { monthly: 150, trend: 'increasing' },
              energy: { monthly: 2400, trend: 'stable' },
              maintenance: { monthly: 800, trend: 'decreasing' }
            }
          },
          timeframe,
          confidence,
          context: {
            laboratoryId: 'lab-001',
            userId: 'user-001'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysis(result)
      } else {
        console.error('Failed to perform predictive analysis')
      }
    } catch (error) {
      console.error('Predictive analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    performPredictiveAnalysis()
  }, [timeframe, confidence])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Predictive Analytics</h2>
          <p className="text-gray-600">AI-powered predictions for equipment, maintenance, and resource optimization</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1 month">1 Month</option>
            <option value="3 months">3 Months</option>
            <option value="6 months">6 Months</option>
            <option value="1 year">1 Year</option>
          </select>
          <Button
            onClick={performPredictiveAnalysis}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>{loading ? 'Analyzing...' : 'Refresh Analysis'}</span>
          </Button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Predictions</span>
                <Badge className="ml-auto">
                  {analysis.predictions.length} Predictions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.predictions.map((prediction, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getPredictionIcon(prediction.type)}
                        <div>
                          <h4 className="font-medium text-gray-900">{prediction.target}</h4>
                          <p className="text-sm text-gray-600">{prediction.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Badge className={getImpactColor(prediction.impact)}>
                        {prediction.impact}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Probability:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={prediction.probability * 100} className="flex-1" />
                          <span className="font-medium">{Math.round(prediction.probability * 100)}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Confidence:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={prediction.confidence * 100} className="flex-1" />
                          <span className="font-medium">{Math.round(prediction.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-600">Timeframe:</span>
                      <span className="font-medium ml-2">{prediction.timeframe}</span>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm text-gray-900 mb-2">Contributing Factors:</h5>
                      <ul className="space-y-1">
                        {prediction.factors.map((factor, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm text-gray-900 mb-2">Recommendations:</h5>
                      <ul className="space-y-1">
                        {prediction.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trends and Anomalies */}
          <div className="space-y-6">
            {/* Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Identified Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.trends.map((trend, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{trend}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Anomalies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Detected Anomalies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.anomalies.length > 0 ? (
                    analysis.anomalies.map((anomaly, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{anomaly}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>No anomalies detected</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Risk Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{analysis.riskAssessment}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Action Plan */}
      {analysis && analysis.actionPlan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Recommended Action Plan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.actionPlan.map((action, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{action}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confidence Level */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Confidence Level</span>
                <span>{Math.round(confidence * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <p className="text-sm text-gray-600">
              Higher confidence levels provide more reliable predictions but may take longer to compute.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
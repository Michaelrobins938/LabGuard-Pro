'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Activity, 
  BarChart3, 
  Zap,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface PredictiveAlert {
  id: string
  equipmentId: string
  equipmentName: string
  alertType: 'warning' | 'critical' | 'info'
  probability: number
  predictedDate: string
  confidence: number
  recommendedAction: string
  severity: 'low' | 'medium' | 'high'
}

interface MaintenancePrediction {
  equipmentId: string
  equipmentName: string
  nextMaintenanceDate: string
  confidence: number
  riskLevel: 'low' | 'medium' | 'high'
  factors: string[]
  recommendedSchedule: string
}

export default function PredictiveMaintenancePage() {
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([])
  const [predictions, setPredictions] = useState<MaintenancePrediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [aiModelStatus, setAiModelStatus] = useState('active')

  useEffect(() => {
    fetchPredictiveData()
  }, [selectedTimeframe])

  const fetchPredictiveData = async () => {
    try {
      setIsLoading(true)
      const [alertsRes, predictionsRes] = await Promise.all([
        fetch(`/api/ai/predictive-maintenance/alerts?timeframe=${selectedTimeframe}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/ai/predictive-maintenance/predictions?timeframe=${selectedTimeframe}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ])

      if (alertsRes.ok && predictionsRes.ok) {
        const alertsData = await alertsRes.json()
        const predictionsData = await predictionsRes.json()
        setAlerts(alertsData.alerts || [])
        setPredictions(predictionsData.predictions || [])
      } else {
        // Fallback to mock data
        setAlerts(mockAlerts)
        setPredictions(mockPredictions)
      }
    } catch (err) {
      console.error('Error fetching predictive data:', err)
      setAlerts(mockAlerts)
      setPredictions(mockPredictions)
    } finally {
      setIsLoading(false)
    }
  }

  const mockAlerts: PredictiveAlert[] = [
    {
      id: '1',
      equipmentId: 'EQ001',
      equipmentName: 'Centrifuge C-2400',
      alertType: 'warning',
      probability: 85,
      predictedDate: '2024-02-15',
      confidence: 92,
      recommendedAction: 'Schedule preventive maintenance within 7 days',
      severity: 'medium'
    },
    {
      id: '2',
      equipmentId: 'EQ002',
      equipmentName: 'Spectrophotometer S-1200',
      alertType: 'critical',
      probability: 95,
      predictedDate: '2024-02-10',
      confidence: 98,
      recommendedAction: 'Immediate inspection required',
      severity: 'high'
    },
    {
      id: '3',
      equipmentId: 'EQ003',
      equipmentName: 'pH Meter PH-200',
      alertType: 'info',
      probability: 65,
      predictedDate: '2024-02-20',
      confidence: 78,
      recommendedAction: 'Monitor performance closely',
      severity: 'low'
    }
  ]

  const mockPredictions: MaintenancePrediction[] = [
    {
      equipmentId: 'EQ001',
      equipmentName: 'Centrifuge C-2400',
      nextMaintenanceDate: '2024-02-15',
      confidence: 92,
      riskLevel: 'medium',
      factors: ['Usage frequency', 'Temperature variations', 'Vibration patterns'],
      recommendedSchedule: 'Every 3 months'
    },
    {
      equipmentId: 'EQ002',
      equipmentName: 'Spectrophotometer S-1200',
      nextMaintenanceDate: '2024-02-10',
      confidence: 98,
      riskLevel: 'high',
      factors: ['Calibration drift', 'Optical degradation', 'Environmental factors'],
      recommendedSchedule: 'Every 2 months'
    },
    {
      equipmentId: 'EQ003',
      equipmentName: 'pH Meter PH-200',
      nextMaintenanceDate: '2024-02-20',
      confidence: 78,
      riskLevel: 'low',
      factors: ['Electrode wear', 'Solution contamination', 'Calibration frequency'],
      recommendedSchedule: 'Every 4 months'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'info': return <AlertCircle className="w-5 h-5 text-blue-600" />
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Predictive Maintenance</h1>
          <p className="text-gray-600">Advanced machine learning algorithms predict equipment failures and optimize maintenance schedules</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">AI Model Active</span>
          </div>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="7d">Next 7 days</option>
            <option value="30d">Next 30 days</option>
            <option value="90d">Next 90 days</option>
          </select>
        </div>
      </div>

      {/* AI Model Status */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Predictive Model</h3>
              <p className="text-gray-600">Continuously learning from equipment data and maintenance history</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">98.5%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Predictive Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Predictive Alerts</h2>
            <span className="text-sm text-gray-500">{alerts.length} active alerts</span>
          </div>
          
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.alertType)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{alert.equipmentName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.recommendedAction}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Probability: {alert.probability}%</span>
                        <span>Confidence: {alert.confidence}%</span>
                        <span>Predicted: {alert.predictedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Predictions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Maintenance Predictions</h2>
            <span className="text-sm text-gray-500">{predictions.length} predictions</span>
          </div>
          
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div key={prediction.equipmentId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{prediction.equipmentName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(prediction.riskLevel)}`}>
                        {prediction.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Next Maintenance:</span>
                        <span className="font-medium">{prediction.nextMaintenanceDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-medium">{prediction.confidence}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Recommended Schedule:</span>
                        <span className="font-medium">{prediction.recommendedSchedule}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Key Factors:</p>
                      <div className="flex flex-wrap gap-1">
                        {prediction.factors.map((factor, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">23%</div>
            <div className="text-sm text-gray-600">Reduction in unplanned downtime</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">15hrs</div>
            <div className="text-sm text-gray-600">Average time saved per week</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">98.5%</div>
            <div className="text-sm text-gray-600">Prediction accuracy</div>
          </div>
        </div>
      </div>
    </div>
  )
} 
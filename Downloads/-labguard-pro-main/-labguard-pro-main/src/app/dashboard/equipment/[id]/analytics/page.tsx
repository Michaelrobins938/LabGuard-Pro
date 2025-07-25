'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Gauge,
  Thermometer,
  Zap,
  Shield,
  Info,
  Download,
  RefreshCw,
  AlertCircle,
  LineChart,
  PieChart,
  BarChart,
  Activity as ActivityIcon
} from 'lucide-react'

interface Equipment {
  id: string
  name: string
  model: string
  serialNumber: string
  manufacturer: string
  equipmentType: string
  location: string
  status: string
}

interface PerformanceMetrics {
  uptime: number
  accuracy: number
  precision: number
  reliability: number
  efficiency: number
  healthScore: number
  lastCalibration: string
  nextCalibration: string
  totalCalibrations: number
  totalMaintenance: number
  averageResponseTime: number
  errorRate: number
}

interface CostAnalysis {
  purchaseCost: number
  maintenanceCost: number
  calibrationCost: number
  operationalCost: number
  totalCost: number
  costPerHour: number
  costPerUse: number
  roi: number
}

interface TrendData {
  date: string
  uptime: number
  accuracy: number
  healthScore: number
  cost: number
}

interface PredictiveInsights {
  nextMaintenanceDate: string
  maintenanceProbability: number
  failureRisk: number
  recommendedActions: string[]
  estimatedCost: number
}

export default function EquipmentAnalyticsPage() {
  const params = useParams()
  const equipmentId = params.id as string
  
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis | null>(null)
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')

  useEffect(() => {
    // Mock data for beta testing
    setTimeout(() => {
      setEquipment({
        id: equipmentId,
        name: 'Analytical Balance',
        model: 'AB-2000',
        serialNumber: 'SN-2024-001',
        manufacturer: 'Precision Instruments',
        equipmentType: 'BALANCE',
        location: 'Lab A - Room 101',
        status: 'ACTIVE'
      })

      setPerformanceMetrics({
        uptime: 98.5,
        accuracy: 99.2,
        precision: 0.05,
        reliability: 97.8,
        efficiency: 94.3,
        healthScore: 95,
        lastCalibration: '2024-01-15T10:30:00Z',
        nextCalibration: '2024-04-15T10:30:00Z',
        totalCalibrations: 4,
        totalMaintenance: 5,
        averageResponseTime: 2.3,
        errorRate: 0.8
      })

      setCostAnalysis({
        purchaseCost: 8500,
        maintenanceCost: 2440,
        calibrationCost: 1800,
        operationalCost: 3200,
        totalCost: 15940,
        costPerHour: 12.5,
        costPerUse: 8.2,
        roi: 156.8
      })

      setTrendData([
        { date: '2024-01', uptime: 98.2, accuracy: 99.1, healthScore: 94, cost: 450 },
        { date: '2024-02', uptime: 98.8, accuracy: 99.3, healthScore: 95, cost: 120 },
        { date: '2024-03', uptime: 99.1, accuracy: 99.5, healthScore: 96, cost: 120 },
        { date: '2024-04', uptime: 98.5, accuracy: 99.2, healthScore: 95, cost: 150 },
        { date: '2024-05', uptime: 98.9, accuracy: 99.4, healthScore: 96, cost: 120 },
        { date: '2024-06', uptime: 99.2, accuracy: 99.6, healthScore: 97, cost: 120 }
      ])

      setPredictiveInsights({
        nextMaintenanceDate: '2024-04-10T14:30:00Z',
        maintenanceProbability: 85,
        failureRisk: 12,
        recommendedActions: [
          'Schedule preventive maintenance within 30 days',
          'Monitor calibration drift more closely',
          'Consider replacing display module in next 6 months',
          'Review power supply stability'
        ],
        estimatedCost: 350
      })

      setLoading(false)
    }, 1000)
  }, [equipmentId])

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 75) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getRiskColor = (risk: number) => {
    if (risk <= 10) return 'text-green-600'
    if (risk <= 25) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Equipment Not Found</h2>
          <p className="text-gray-600">The requested equipment could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Equipment Analytics</h1>
              <p className="text-gray-600 mt-2">
                {equipment.name} - {equipment.model} ({equipment.serialNumber})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Health Score and Key Metrics */}
        {performanceMetrics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Health Score */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Health Score</h3>
                <Gauge className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getHealthScoreColor(performanceMetrics.healthScore)}`}>
                  {performanceMetrics.healthScore}%
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getHealthScoreBg(performanceMetrics.healthScore)} ${getHealthScoreColor(performanceMetrics.healthScore)}`}>
                  {performanceMetrics.healthScore >= 90 ? 'Excellent' : performanceMetrics.healthScore >= 75 ? 'Good' : 'Needs Attention'}
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="text-sm font-semibold text-gray-900">{performanceMetrics.uptime}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Accuracy</span>
                  <span className="text-sm font-semibold text-gray-900">{performanceMetrics.accuracy}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Precision</span>
                  <span className="text-sm font-semibold text-gray-900">±{performanceMetrics.precision}mg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reliability</span>
                  <span className="text-sm font-semibold text-gray-900">{performanceMetrics.reliability}%</span>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Calibrations</span>
                  <span className="text-sm font-semibold text-gray-900">{performanceMetrics.totalCalibrations}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Maintenance</span>
                  <span className="text-sm font-semibold text-gray-900">{performanceMetrics.totalMaintenance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                  <span className="text-sm font-semibold text-gray-900">{performanceMetrics.averageResponseTime}s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Error Rate</span>
                  <span className="text-sm font-semibold text-gray-900">{performanceMetrics.errorRate}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cost Analysis */}
        {costAnalysis && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(costAnalysis.purchaseCost)}</div>
                  <div className="text-sm text-gray-600">Purchase Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{formatCurrency(costAnalysis.maintenanceCost)}</div>
                  <div className="text-sm text-gray-600">Maintenance Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(costAnalysis.calibrationCost)}</div>
                  <div className="text-sm text-gray-600">Calibration Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(costAnalysis.totalCost)}</div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{formatCurrency(costAnalysis.costPerHour)}</div>
                  <div className="text-sm text-gray-600">Cost per Hour</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{formatCurrency(costAnalysis.costPerUse)}</div>
                  <div className="text-sm text-gray-600">Cost per Use</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">{costAnalysis.roi}%</div>
                  <div className="text-sm text-gray-600">ROI</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Trends */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Uptime Trend */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Uptime Trend</h4>
                <div className="space-y-2">
                  {trendData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{data.date}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${data.uptime}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{data.uptime}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Score Trend */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Health Score Trend</h4>
                <div className="space-y-2">
                  {trendData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{data.date}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getHealthScoreColor(data.healthScore)}`}
                            style={{ width: `${data.healthScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{data.healthScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Predictive Insights */}
        {predictiveInsights && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Insights</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Maintenance Predictions</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Next Maintenance</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatDate(predictiveInsights.nextMaintenanceDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Maintenance Probability</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {predictiveInsights.maintenanceProbability}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Failure Risk</span>
                      <span className={`text-sm font-semibold ${getRiskColor(predictiveInsights.failureRisk)}`}>
                        {predictiveInsights.failureRisk}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Estimated Cost</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(predictiveInsights.estimatedCost)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Recommended Actions</h4>
                  <div className="space-y-2">
                    {predictiveInsights.recommendedActions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span className="text-sm text-gray-900">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ActivityIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">{performanceMetrics?.efficiency}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">{performanceMetrics?.accuracy}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ROI</p>
                <p className="text-2xl font-bold text-gray-900">{costAnalysis?.roi}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{performanceMetrics?.uptime}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
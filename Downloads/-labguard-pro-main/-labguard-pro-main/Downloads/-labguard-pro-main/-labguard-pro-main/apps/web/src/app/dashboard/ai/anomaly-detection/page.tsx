'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Activity, 
  BarChart3, 
  Zap,
  Eye,
  EyeOff,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'

interface Anomaly {
  id: string
  equipmentId: string
  equipmentName: string
  anomalyType: 'performance' | 'calibration' | 'usage' | 'environmental'
  severity: 'low' | 'medium' | 'high' | 'critical'
  detectedAt: string
  description: string
  confidence: number
  baselineValue: number
  currentValue: number
  deviation: number
  status: 'active' | 'resolved' | 'investigating'
}

interface AnomalyStats {
  totalAnomalies: number
  activeAnomalies: number
  resolvedAnomalies: number
  averageConfidence: number
  topAnomalyType: string
  detectionRate: number
}

export default function AnomalyDetectionPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [stats, setStats] = useState<AnomalyStats>({
    totalAnomalies: 0,
    activeAnomalies: 0,
    resolvedAnomalies: 0,
    averageConfidence: 0,
    topAnomalyType: '',
    detectionRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showResolved, setShowResolved] = useState(false)

  useEffect(() => {
    fetchAnomalyData()
  }, [])

  const fetchAnomalyData = async () => {
    try {
      setIsLoading(true)
      const [anomaliesRes, statsRes] = await Promise.all([
        fetch('/api/ai/anomaly-detection/anomalies', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/ai/anomaly-detection/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ])

      if (anomaliesRes.ok && statsRes.ok) {
        const anomaliesData = await anomaliesRes.json()
        const statsData = await statsRes.json()
        setAnomalies(anomaliesData.anomalies || [])
        setStats(statsData.stats || mockStats)
      } else {
        setAnomalies(mockAnomalies)
        setStats(mockStats)
      }
    } catch (err) {
      console.error('Error fetching anomaly data:', err)
      setAnomalies(mockAnomalies)
      setStats(mockStats)
    } finally {
      setIsLoading(false)
    }
  }

  const mockAnomalies: Anomaly[] = [
    {
      id: '1',
      equipmentId: 'EQ001',
      equipmentName: 'Centrifuge C-2400',
      anomalyType: 'performance',
      severity: 'high',
      detectedAt: '2024-02-08T10:30:00Z',
      description: 'Unusual vibration patterns detected during operation',
      confidence: 94,
      baselineValue: 0.15,
      currentValue: 0.45,
      deviation: 200,
      status: 'active'
    },
    {
      id: '2',
      equipmentId: 'EQ002',
      equipmentName: 'Spectrophotometer S-1200',
      anomalyType: 'calibration',
      severity: 'critical',
      detectedAt: '2024-02-08T09:15:00Z',
      description: 'Calibration drift exceeds acceptable thresholds',
      confidence: 98,
      baselineValue: 0.02,
      currentValue: 0.08,
      deviation: 300,
      status: 'investigating'
    },
    {
      id: '3',
      equipmentId: 'EQ003',
      equipmentName: 'pH Meter PH-200',
      anomalyType: 'environmental',
      severity: 'medium',
      detectedAt: '2024-02-08T08:45:00Z',
      description: 'Temperature fluctuations affecting measurement accuracy',
      confidence: 87,
      baselineValue: 22.5,
      currentValue: 26.8,
      deviation: 19,
      status: 'active'
    },
    {
      id: '4',
      equipmentId: 'EQ004',
      equipmentName: 'Microscope M-500',
      anomalyType: 'usage',
      severity: 'low',
      detectedAt: '2024-02-07T16:20:00Z',
      description: 'Unusual usage patterns detected',
      confidence: 76,
      baselineValue: 4.2,
      currentValue: 8.7,
      deviation: 107,
      status: 'resolved'
    }
  ]

  const mockStats: AnomalyStats = {
    totalAnomalies: 24,
    activeAnomalies: 3,
    resolvedAnomalies: 21,
    averageConfidence: 89.5,
    topAnomalyType: 'Performance',
    detectionRate: 96.2
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-100 border-green-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100'
      case 'investigating': return 'text-yellow-600 bg-yellow-100'
      case 'resolved': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAnomalyTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <Activity className="w-4 h-4" />
      case 'calibration': return <BarChart3 className="w-4 h-4" />
      case 'usage': return <TrendingUp className="w-4 h-4" />
      case 'environmental': return <Eye className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const filteredAnomalies = anomalies.filter(anomaly => {
    if (selectedFilter !== 'all' && anomaly.anomalyType !== selectedFilter) return false
    if (!showResolved && anomaly.status === 'resolved') return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Anomaly Detection</h1>
          <p className="text-gray-600">Advanced machine learning detects unusual patterns in equipment behavior and data</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAnomalyData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Anomalies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAnomalies}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Anomalies</p>
              <p className="text-2xl font-bold text-red-600">{stats.activeAnomalies}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Detection Rate</p>
              <p className="text-2xl font-bold text-green-600">{stats.detectionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-purple-600">{stats.averageConfidence}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Anomaly Detection</h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              <option value="performance">Performance</option>
              <option value="calibration">Calibration</option>
              <option value="usage">Usage</option>
              <option value="environmental">Environmental</option>
            </select>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Show Resolved</span>
            </label>
          </div>
        </div>

        {/* Anomalies List */}
        <div className="space-y-4">
          {filteredAnomalies.map((anomaly) => (
            <div key={anomaly.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getAnomalyTypeIcon(anomaly.anomalyType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900">{anomaly.equipmentName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(anomaly.severity)}`}>
                        {anomaly.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(anomaly.status)}`}>
                        {anomaly.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{anomaly.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Confidence:</span> {anomaly.confidence}%
                      </div>
                      <div>
                        <span className="font-medium">Deviation:</span> {anomaly.deviation}%
                      </div>
                      <div>
                        <span className="font-medium">Baseline:</span> {anomaly.baselineValue}
                      </div>
                      <div>
                        <span className="font-medium">Current:</span> {anomaly.currentValue}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Detected: {new Date(anomaly.detectedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Model Status */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Anomaly Detection Model</h3>
              <p className="text-gray-600">Continuously monitoring equipment behavior and detecting unusual patterns</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">96.2%</div>
            <div className="text-sm text-gray-600">Detection Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
} 
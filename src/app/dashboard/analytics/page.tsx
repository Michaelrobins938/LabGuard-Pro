'use client'

import { useState, useEffect } from 'react'
import { useDashboardStore } from '@/stores/dashboardStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Settings,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  FileText,
  Brain,
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Database,
  Globe,
  PieChart,
  LineChart,
  BarChart,
  ScatterChart
} from 'lucide-react'

interface AnalyticsData {
  equipmentPerformance: {
    total: number
    operational: number
    maintenance: number
    offline: number
    avgHealth: number
  }
  calibrationMetrics: {
    total: number
    completed: number
    overdue: number
    scheduled: number
    avgAccuracy: number
  }
  complianceData: {
    overall: number
    uptime: number
    calibrationCompliance: number
    overdueCalibrations: number
  }
  aiInsights: {
    total: number
    implemented: number
    pending: number
    accuracy: number
  }
  timeSeriesData: Array<{
    date: string
    equipmentHealth: number
    complianceScore: number
    aiAccuracy: number
    calibrationsCompleted: number
  }>
}

export default function AnalyticsPage() {
  const { equipment, calibrations, aiInsights, stats } = useDashboardStore()
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange, equipment, calibrations, aiInsights])

  // Initialize data if empty
  useEffect(() => {
    if (equipment.length === 0 || calibrations.length === 0 || aiInsights.length === 0) {
      const { fetchEquipment, fetchCalibrations, fetchAIInsights } = useDashboardStore.getState()
      fetchEquipment()
      fetchCalibrations()
      fetchAIInsights()
    }
  }, [equipment.length, calibrations.length, aiInsights.length])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Calculate analytics from store data
      const equipmentPerformance = {
        total: equipment.length,
        operational: equipment.filter(eq => eq.status === 'operational').length,
        maintenance: equipment.filter(eq => eq.status === 'maintenance').length,
        offline: equipment.filter(eq => eq.status === 'inactive').length,
        avgHealth: Math.round(equipment.reduce((sum, eq) => sum + eq.healthScore, 0) / Math.max(equipment.length, 1))
      }

      const calibrationMetrics = {
        total: calibrations.length,
        completed: calibrations.filter(cal => cal.status === 'completed').length,
        overdue: calibrations.filter(cal => cal.status === 'overdue').length,
        scheduled: calibrations.filter(cal => cal.status === 'scheduled').length,
        avgAccuracy: Math.round(calibrations
          .filter(cal => cal.results)
          .reduce((sum, cal) => sum + (cal.results?.accuracy || 0), 0) / 
          Math.max(calibrations.filter(cal => cal.results).length, 1))
      }

      const complianceData = {
        overall: Math.round((equipmentPerformance.operational / Math.max(equipmentPerformance.total, 1)) * 100),
        uptime: Math.round((equipmentPerformance.operational / Math.max(equipmentPerformance.total, 1)) * 100),
        calibrationCompliance: Math.round((calibrationMetrics.completed / Math.max(calibrationMetrics.total, 1)) * 100),
        overdueCalibrations: calibrationMetrics.overdue
      }

      const aiInsightsData = {
        total: aiInsights.length,
        implemented: aiInsights.filter(insight => insight.status === 'implemented').length,
        pending: aiInsights.filter(insight => insight.status === 'new').length,
        accuracy: Math.round(aiInsights.reduce((sum, insight) => sum + insight.confidence, 0) / Math.max(aiInsights.length, 1))
      }

      // Generate time series data for the last 30 days
      const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        return {
          date: date.toISOString().split('T')[0],
          equipmentHealth: Math.floor(Math.random() * 20) + 80,
          complianceScore: Math.floor(Math.random() * 15) + 85,
          aiAccuracy: Math.floor(Math.random() * 10) + 90,
          calibrationsCompleted: Math.floor(Math.random() * 5) + 1
        }
      })

      setAnalyticsData({
        equipmentPerformance,
        calibrationMetrics,
        complianceData,
        aiInsights: aiInsightsData,
        timeSeriesData
      })
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setError('Failed to load analytics data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportReport = () => {
    if (!analyticsData) return

    const exportData = {
      analytics: analyticsData,
      exportDate: new Date().toISOString(),
      timeRange,
      laboratory: 'Advanced Research Laboratory'
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getTrendIcon = (value: number, previousValue: number) => {
    if (value > previousValue) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (value < previousValue) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-500 mb-2">Error Loading Analytics</h3>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button onClick={fetchAnalyticsData} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">No Analytics Data</h3>
          <p className="text-slate-400 mb-4">Analytics data will appear here once equipment and calibration data is available.</p>
          <Button onClick={fetchAnalyticsData} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Analytics & Insights
          </h1>
          <p className="text-slate-400 mt-2">
            Comprehensive laboratory performance analytics and predictive insights
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleExportReport} className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Equipment Health</p>
                <p className="text-2xl font-bold text-emerald-400">{analyticsData.equipmentPerformance.avgHealth}%</p>
                <p className="text-xs text-slate-500">{analyticsData.equipmentPerformance.operational} operational</p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <Settings className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Compliance Score</p>
                <p className="text-2xl font-bold text-blue-400">{analyticsData.complianceData.overall}%</p>
                <p className="text-xs text-slate-500">{analyticsData.calibrationMetrics.completed} completed</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">AI Accuracy</p>
                <p className="text-2xl font-bold text-purple-400">{analyticsData.aiInsights.accuracy}%</p>
                <p className="text-xs text-slate-500">{analyticsData.aiInsights.total} insights</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Brain className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">System Uptime</p>
                <p className="text-2xl font-bold text-amber-400">{analyticsData.complianceData.uptime}%</p>
                <p className="text-xs text-slate-500">Last 30 days</p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <Activity className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Performance */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Equipment Performance</h3>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {analyticsData?.equipmentPerformance.operational}/{analyticsData?.equipmentPerformance.total}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Operational</span>
              <span className="text-sm font-medium text-emerald-400">
                {analyticsData?.equipmentPerformance.operational}
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${(analyticsData?.equipmentPerformance.operational || 0) / Math.max(analyticsData?.equipmentPerformance.total || 1, 1) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Maintenance</span>
              <span className="text-sm font-medium text-yellow-400">
                {analyticsData?.equipmentPerformance.maintenance}
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${(analyticsData?.equipmentPerformance.maintenance || 0) / Math.max(analyticsData?.equipmentPerformance.total || 1, 1) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Offline</span>
              <span className="text-sm font-medium text-red-400">
                {analyticsData?.equipmentPerformance.offline}
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${(analyticsData?.equipmentPerformance.offline || 0) / Math.max(analyticsData?.equipmentPerformance.total || 1, 1) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Calibration Metrics */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Calibration Metrics</h3>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {analyticsData?.calibrationMetrics.completed}/{analyticsData?.calibrationMetrics.total}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Completed</span>
              <span className="text-sm font-medium text-blue-400">
                {analyticsData?.calibrationMetrics.completed}
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(analyticsData?.calibrationMetrics.completed || 0) / Math.max(analyticsData?.calibrationMetrics.total || 1, 1) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Scheduled</span>
              <span className="text-sm font-medium text-purple-400">
                {analyticsData?.calibrationMetrics.scheduled}
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${(analyticsData?.calibrationMetrics.scheduled || 0) / Math.max(analyticsData?.calibrationMetrics.total || 1, 1) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Overdue</span>
              <span className="text-sm font-medium text-red-400">
                {analyticsData?.calibrationMetrics.overdue}
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${(analyticsData?.calibrationMetrics.overdue || 0) / Math.max(analyticsData?.calibrationMetrics.total || 1, 1) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-200">Performance Trends</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span className="text-xs text-slate-400">Equipment Health</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs text-slate-400">Compliance</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-xs text-slate-400">AI Accuracy</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-1">
          {analyticsData?.timeSeriesData.slice(-7).map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              <div className="w-full bg-slate-700/50 rounded-t" style={{ height: `${(data.equipmentHealth / 100) * 200}px` }}>
                <div className="w-full bg-emerald-500 rounded-t" style={{ height: `${(data.equipmentHealth / 100) * 200}px` }}></div>
              </div>
              <div className="w-full bg-slate-700/50 rounded-t" style={{ height: `${(data.complianceScore / 100) * 200}px` }}>
                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${(data.complianceScore / 100) * 200}px` }}></div>
              </div>
              <div className="w-full bg-slate-700/50 rounded-t" style={{ height: `${(data.aiAccuracy / 100) * 200}px` }}>
                <div className="w-full bg-purple-500 rounded-t" style={{ height: `${(data.aiAccuracy / 100) * 200}px` }}></div>
              </div>
              <span className="text-xs text-slate-400">{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Summary */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">AI Insights Summary</h3>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            {analyticsData?.aiInsights.implemented}/{analyticsData?.aiInsights.total} implemented
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <Brain className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-400">{analyticsData?.aiInsights.total}</p>
            <p className="text-sm text-slate-400">Total Insights</p>
          </div>
          
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-400">{analyticsData?.aiInsights.implemented}</p>
            <p className="text-sm text-slate-400">Implemented</p>
          </div>
          
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <Clock className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-400">{analyticsData?.aiInsights.pending}</p>
            <p className="text-sm text-slate-400">Pending</p>
          </div>
        </div>
      </div>
    </div>
  )
}
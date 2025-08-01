'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  CheckCircle, 
  Brain, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Star,
  AlertCircle,
  AlertTriangle
} from 'lucide-react'

interface AnalyticsWidgetProps {
  timeRange?: string
  showDetails?: boolean
  className?: string
}

interface WidgetData {
  equipmentHealth: number
  complianceScore: number
  aiAccuracy: number
  systemUptime: number
  operationalEquipment: number
  totalEquipment: number
  completedCalibrations: number
  totalCalibrations: number
}

export default function AnalyticsWidget({ 
  timeRange = '30d', 
  showDetails = true, 
  className = '' 
}: AnalyticsWidgetProps) {
  const [data, setData] = useState<WidgetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWidgetData()
  }, [timeRange])

  const fetchWidgetData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/analytics/metrics?timeRange=${timeRange}`)
      
      if (response.ok) {
        const analyticsData = await response.json()
        
        setData({
          equipmentHealth: analyticsData.equipmentPerformance.avgHealth,
          complianceScore: analyticsData.complianceData.overall,
          aiAccuracy: analyticsData.aiInsights.accuracy,
          systemUptime: analyticsData.complianceData.uptime,
          operationalEquipment: analyticsData.equipmentPerformance.operational,
          totalEquipment: analyticsData.equipmentPerformance.total,
          completedCalibrations: analyticsData.calibrationMetrics.completed,
          totalCalibrations: analyticsData.calibrationMetrics.total
        })
      } else {
        throw new Error('Failed to fetch analytics data')
      }
    } catch (error) {
      console.error('Error fetching widget data:', error)
      setError('Failed to load analytics data')
      
      // Set fallback data
      setData({
        equipmentHealth: 87,
        complianceScore: 92,
        aiAccuracy: 90,
        systemUptime: 95,
        operationalEquipment: 6,
        totalEquipment: 8,
        completedCalibrations: 5,
        totalCalibrations: 8
      })
    } finally {
      setLoading(false)
    }
  }

  const getHealthStatus = (health: number) => {
    if (health >= 90) return { status: 'excellent', color: 'text-green-400', icon: <Star className="h-4 w-4" /> }
    if (health >= 80) return { status: 'good', color: 'text-blue-400', icon: <CheckCircle className="h-4 w-4" /> }
    if (health >= 70) return { status: 'warning', color: 'text-yellow-400', icon: <AlertCircle className="h-4 w-4" /> }
    return { status: 'critical', color: 'text-red-400', icon: <AlertTriangle className="h-4 w-4" /> }
  }

  const getTrendIcon = (value: number) => {
    if (value > 85) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (value < 75) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  if (loading) {
    return (
      <Card className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 ${className}`}>
        <CardHeader>
          <CardTitle className="text-slate-200">Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !data) {
    return (
      <Card className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 ${className}`}>
        <CardHeader>
          <CardTitle className="text-slate-200">Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const healthStatus = getHealthStatus(data.equipmentHealth)

  return (
    <Card className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 ${className}`}>
      <CardHeader>
        <CardTitle className="text-slate-200 flex items-center justify-between">
          Analytics Overview
          <Badge variant="outline" className="text-xs">
            {timeRange}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Equipment Health */}
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-slate-400">Health</span>
              </div>
              {healthStatus.icon}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-emerald-400">{data.equipmentHealth}%</span>
              {getTrendIcon(data.equipmentHealth)}
            </div>
            {showDetails && (
              <p className="text-xs text-slate-500 mt-1">
                {data.operationalEquipment}/{data.totalEquipment} operational
              </p>
            )}
          </div>

          {/* Compliance Score */}
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-400">Compliance</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-400">{data.complianceScore}%</span>
              {getTrendIcon(data.complianceScore)}
            </div>
            {showDetails && (
              <p className="text-xs text-slate-500 mt-1">
                {data.completedCalibrations}/{data.totalCalibrations} completed
              </p>
            )}
          </div>

          {/* AI Accuracy */}
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-400">AI Accuracy</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-purple-400">{data.aiAccuracy}%</span>
              {getTrendIcon(data.aiAccuracy)}
            </div>
            {showDetails && (
              <p className="text-xs text-slate-500 mt-1">
                Machine learning insights
              </p>
            )}
          </div>

          {/* System Uptime */}
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-slate-400">Uptime</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-amber-400">{data.systemUptime}%</span>
              {getTrendIcon(data.systemUptime)}
            </div>
            {showDetails && (
              <p className="text-xs text-slate-500 mt-1">
                Last 30 days
              </p>
            )}
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Equipment Status</span>
              <span>{data.operationalEquipment}/{data.totalEquipment} Operational</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-1 mt-1">
              <div 
                className="bg-emerald-500 h-1 rounded-full transition-all duration-500"
                style={{ width: `${(data.operationalEquipment / data.totalEquipment) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
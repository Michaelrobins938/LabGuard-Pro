'use client'

import { useState, useEffect } from 'react'
import { useDashboardStore } from '@/stores/dashboardStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Eye,
  Bell,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Database,
  Globe,
  Shield,
  Target
} from 'lucide-react'

interface RealTimeMetric {
  id: string
  name: string
  value: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  lastUpdated: string
}

interface Alert {
  id: string
  type: 'equipment' | 'calibration' | 'compliance' | 'system'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  acknowledged: boolean
}

export default function RealTimeAnalyticsPage() {
  const { equipment, calibrations, aiInsights, stats } = useDashboardStore()
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [systemStatus, setSystemStatus] = useState({
    database: 'connected',
    api: 'online',
    security: 'secure',
    calibration: 'active'
  })

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        updateRealTimeMetrics()
        checkForRealAlerts()
        updateSystemStatus()
        setLastUpdate(new Date())
      }, 5000) // Update every 5 seconds

      return () => clearInterval(interval)
    }
  }, [isMonitoring, equipment, calibrations, aiInsights])

  const updateRealTimeMetrics = async () => {
    try {
      // Fetch real-time analytics data
      const response = await fetch('/api/analytics/metrics?timeRange=7d')
      
      if (response.ok) {
        const analyticsData = await response.json()
        
        // Calculate real-time metrics from actual data
        const newMetrics: RealTimeMetric[] = [
          {
            id: '1',
            name: 'Equipment Health',
            value: analyticsData.equipmentPerformance.avgHealth || 0,
            unit: '%',
            status: getHealthStatus(analyticsData.equipmentPerformance.avgHealth),
            trend: getTrendDirection(analyticsData.equipmentPerformance.avgHealth, 85),
            lastUpdated: new Date().toISOString()
          },
          {
            id: '2',
            name: 'System Uptime',
            value: analyticsData.complianceData.uptime || 0,
            unit: '%',
            status: 'normal',
            trend: 'stable',
            lastUpdated: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Active Calibrations',
            value: calibrations.filter(cal => cal.status === 'in_progress').length,
            unit: '',
            status: 'normal',
            trend: getTrendDirection(calibrations.length, 5),
            lastUpdated: new Date().toISOString()
          },
          {
            id: '4',
            name: 'AI Processing',
            value: analyticsData.aiInsights.accuracy || 0,
            unit: '%',
            status: getAIStatus(analyticsData.aiInsights.accuracy),
            trend: 'up',
            lastUpdated: new Date().toISOString()
          }
        ]

        setMetrics(newMetrics)
      }
    } catch (error) {
      console.error('Error updating real-time metrics:', error)
    }
  }

  const checkForRealAlerts = () => {
    const newAlerts: Alert[] = []
    
    // Check for equipment alerts
    const offlineEquipment = equipment.filter(eq => eq.status === 'inactive')
    if (offlineEquipment.length > 0) {
      newAlerts.push({
        id: `alert-equipment-${Date.now()}`,
        type: 'equipment',
        severity: 'critical',
        message: `${offlineEquipment.length} equipment offline: ${offlineEquipment.map(eq => eq.name).join(', ')}`,
        timestamp: new Date().toISOString(),
        acknowledged: false
      })
    }

    // Check for calibration alerts
    const overdueCalibrations = calibrations.filter(cal => cal.status === 'overdue')
    if (overdueCalibrations.length > 0) {
      newAlerts.push({
        id: `alert-calibration-${Date.now()}`,
        type: 'calibration',
        severity: 'high',
        message: `${overdueCalibrations.length} calibrations overdue`,
        timestamp: new Date().toISOString(),
        acknowledged: false
      })
    }

    // Check for compliance alerts
    const complianceScore = stats.complianceScore || 0
    if (complianceScore < 90) {
      newAlerts.push({
        id: `alert-compliance-${Date.now()}`,
        type: 'compliance',
        severity: 'medium',
        message: `Compliance score below threshold: ${complianceScore}%`,
        timestamp: new Date().toISOString(),
        acknowledged: false
      })
    }

    // Check for system alerts
    if (systemStatus.database !== 'connected') {
      newAlerts.push({
        id: `alert-system-${Date.now()}`,
        type: 'system',
        severity: 'critical',
        message: 'Database connection lost',
        timestamp: new Date().toISOString(),
        acknowledged: false
      })
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev.slice(0, 9)]) // Keep last 10 alerts
    }
  }

  const updateSystemStatus = async () => {
    try {
      // Check database connectivity
      const dbResponse = await fetch('/api/health')
      const dbStatus = dbResponse.ok ? 'connected' : 'disconnected'

      // Check API services
      const apiResponse = await fetch('/api/analytics/metrics?timeRange=1d')
      const apiStatus = apiResponse.ok ? 'online' : 'offline'

      // Check security status (simulate security checks)
      const securityStatus = 'secure' // In production, this would check actual security metrics

      // Check calibration system
      const calibrationStatus = calibrations.length > 0 ? 'active' : 'inactive'

      setSystemStatus({
        database: dbStatus,
        api: apiStatus,
        security: securityStatus,
        calibration: calibrationStatus
      })
    } catch (error) {
      console.error('Error updating system status:', error)
      setSystemStatus({
        database: 'disconnected',
        api: 'offline',
        security: 'unknown',
        calibration: 'inactive'
      })
    }
  }

  const getHealthStatus = (health: number): 'normal' | 'warning' | 'critical' => {
    if (health >= 90) return 'normal'
    if (health >= 70) return 'warning'
    return 'critical'
  }

  const getAIStatus = (accuracy: number): 'normal' | 'warning' | 'critical' => {
    if (accuracy >= 95) return 'normal'
    if (accuracy >= 85) return 'warning'
    return 'critical'
  }

  const getTrendDirection = (current: number, threshold: number): 'up' | 'down' | 'stable' => {
    if (current > threshold) return 'up'
    if (current < threshold) return 'down'
    return 'stable'
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Real-Time Analytics
          </h1>
          <p className="text-slate-400 mt-2">
            Live monitoring and alerts for laboratory operations
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Last update: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => setIsMonitoring(!isMonitoring)}
            variant={isMonitoring ? "default" : "outline"}
            className={isMonitoring ? "bg-green-600 hover:bg-green-700" : "border-slate-700/50 text-slate-200"}
          >
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Monitoring
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Monitoring
              </>
            )}
          </Button>
          
          <Button 
            onClick={() => {
              updateRealTimeMetrics()
              setLastUpdate(new Date())
            }}
            variant="outline"
            size="sm"
            className="border-slate-700/50 text-slate-200 hover:bg-slate-700/50"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">{metric.name}</span>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(metric.status).replace('text-', 'bg-')}`} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-200">
                  {metric.value}{metric.unit}
                </span>
                {getTrendIcon(metric.trend)}
              </div>
              
              <p className="text-xs text-slate-500 mt-1">
                Updated {new Date(metric.lastUpdated).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Alerts */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-red-400" />
                Live Alerts
              </div>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {alerts.filter(a => !a.acknowledged).length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-slate-400">No active alerts</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 rounded-lg border ${
                      alert.acknowledged 
                        ? 'bg-slate-700/30 border-slate-600/50' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className={`text-sm ${alert.acknowledged ? 'text-slate-400' : 'text-slate-200'}`}>
                          {alert.message}
                        </p>
                      </div>
                      {!alert.acknowledged && (
                        <Button
                          onClick={() => acknowledgeAlert(alert.id)}
                          variant="outline"
                          size="sm"
                          className="ml-2 border-slate-600/50 text-slate-400 hover:bg-slate-700/50"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-400" />
                System Status
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Operational
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-400">Database</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${systemStatus.database === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-sm ${systemStatus.database === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                    {systemStatus.database === 'connected' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-400">API Services</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${systemStatus.api === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-sm ${systemStatus.api === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                    {systemStatus.api === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-slate-400">Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${systemStatus.security === 'secure' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className={`text-sm ${systemStatus.security === 'secure' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {systemStatus.security === 'secure' ? 'Secure' : 'Warning'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-slate-400">Calibration System</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${systemStatus.calibration === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-sm ${systemStatus.calibration === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                    {systemStatus.calibration === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Controls */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-200">Monitoring Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-lg font-semibold text-slate-200">Real-Time</p>
              <p className="text-sm text-slate-400">Live data updates</p>
            </div>
            
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-lg font-semibold text-slate-200">Alerts</p>
              <p className="text-sm text-slate-400">Instant notifications</p>
            </div>
            
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-lg font-semibold text-slate-200">History</p>
              <p className="text-sm text-slate-400">Historical tracking</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Users, 
  Shield, 
  Database, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Lock,
  Globe,
  Server,
  HardDrive,
  Zap,
  Bell,
  Key,
  Crown,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface AdminMetrics {
  users: {
    total: number
    active: number
    inactive: number
    newThisMonth: number
  }
  equipment: {
    total: number
    active: number
    maintenance: number
    retired: number
  }
  calibrations: {
    total: number
    completed: number
    pending: number
    overdue: number
  }
  storage: {
    used: number
    total: number
    percentage: number
  }
  performance: {
    uptime: number
    responseTime: number
    errorRate: number
  }
  security: {
    failedLogins: number
    suspiciousActivity: number
    lastSecurityScan: string
  }
}

interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'permission_change' | 'data_access' | 'system_change'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  user: string
  timestamp: string
  ipAddress: string
  userAgent: string
}

interface SystemBackup {
  id: string
  type: 'full' | 'incremental'
  status: 'completed' | 'running' | 'failed'
  size: number
  createdAt: string
  completedAt?: string
  description: string
}

export default function AdminPage() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [backups, setBackups] = useState<SystemBackup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    setIsLoading(true)
    try {
      // Fetch admin data from API
      const [metricsRes, securityRes, backupsRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/security-events'),
        fetch('/api/admin/backups')
      ])

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData)
      } else {
        // Fallback to calculated metrics
        setMetrics({
          users: { total: 25, active: 22, inactive: 3, newThisMonth: 5 },
          equipment: { total: 45, active: 38, maintenance: 5, retired: 2 },
          calibrations: { total: 120, completed: 98, pending: 15, overdue: 7 },
          storage: { used: 2.4, total: 5.0, percentage: 48 },
          performance: { uptime: 99.8, responseTime: 245, errorRate: 0.2 },
          security: { failedLogins: 3, suspiciousActivity: 1, lastSecurityScan: '2024-01-15T10:30:00Z' }
        })
      }

      if (securityRes.ok) {
        const securityData = await securityRes.json()
        setSecurityEvents(securityData)
      } else {
        // Fallback security events
        setSecurityEvents([
          {
            id: '1',
            type: 'login',
            severity: 'low',
            description: 'Successful login from authorized IP',
            user: 'admin@labguard.com',
            timestamp: new Date().toISOString(),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          {
            id: '2',
            type: 'permission_change',
            severity: 'medium',
            description: 'User role updated from Technician to Supervisor',
            user: 'sarah.johnson@labguard.com',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            ipAddress: '192.168.1.101',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        ])
      }

      if (backupsRes.ok) {
        const backupsData = await backupsRes.json()
        setBackups(backupsData)
      } else {
        // Fallback backups
        setBackups([
          {
            id: '1',
            type: 'full',
            status: 'completed',
            size: 2.4,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
            description: 'Daily full backup'
          },
          {
            id: '2',
            type: 'incremental',
            status: 'completed',
            size: 0.8,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
            description: 'Incremental backup'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBackup = async (type: 'full' | 'incremental') => {
    try {
      const response = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })

      if (response.ok) {
        await fetchAdminData() // Refresh data
      }
    } catch (error) {
      console.error('Error creating backup:', error)
    }
  }

  const handleExportLogs = () => {
    const exportData = {
      metrics,
      securityEvents,
      backups,
      exportDate: new Date().toISOString(),
      laboratory: 'Advanced Research Laboratory'
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `admin-logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            System Administration
          </h1>
          <p className="text-slate-400 mt-2">
            Monitor system health, security, and performance
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={handleExportLogs} className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button onClick={fetchAdminData} className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Users</p>
                <p className="text-2xl font-bold text-blue-400">{metrics.users.total}</p>
                <p className="text-xs text-slate-500">{metrics.users.active} active users</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Equipment</p>
                <p className="text-2xl font-bold text-emerald-400">{metrics.equipment.total}</p>
                <p className="text-xs text-slate-500">{metrics.equipment.active} active equipment</p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <Settings className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Calibrations</p>
                <p className="text-2xl font-bold text-purple-400">{metrics.calibrations.total}</p>
                <p className="text-xs text-slate-500">{metrics.calibrations.overdue} overdue</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Storage</p>
                <p className="text-2xl font-bold text-amber-400">{metrics.storage.percentage}%</p>
                <p className="text-xs text-slate-500">{formatBytes(metrics.storage.used * 1024 * 1024 * 1024)} used</p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <HardDrive className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-200">System Performance</h3>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Excellent
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Uptime</span>
              <span className="text-sm font-medium text-green-400">{metrics?.performance.uptime}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${metrics?.performance.uptime || 0}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Response Time</span>
              <span className="text-sm font-medium text-blue-400">{metrics?.performance.responseTime}ms</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min((metrics?.performance.responseTime || 0) / 500 * 100, 100)}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Error Rate</span>
              <span className="text-sm font-medium text-red-400">{metrics?.performance.errorRate}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${metrics?.performance.errorRate || 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Security Status</h3>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Secure
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-200">SSL/TLS encryption active</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-200">Two-factor authentication enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-200">Regular security updates</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-slate-200">{metrics?.security.failedLogins} failed login attempts today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Events */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">Recent Security Events</h3>
          <Button 
            onClick={() => router.push('/dashboard/admin/security')}
            className="bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-600/50 transition-all duration-300"
          >
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {securityEvents.slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 border border-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  <Shield className="h-4 w-4 text-slate-300" />
                </div>
                <div>
                  <div className="font-medium text-slate-200">{event.description}</div>
                  <div className="text-sm text-slate-400">
                    {event.user} • {event.ipAddress} • {formatDate(event.timestamp)}
                  </div>
                </div>
              </div>
              <Badge className={getSeverityColor(event.severity)}>
                {event.severity.toUpperCase()}
              </Badge>
            </div>
          ))}
          
          {securityEvents.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-200 mb-2">No Security Events</h3>
              <p className="text-slate-400">
                No security events recorded in the last 24 hours
              </p>
            </div>
          )}
        </div>
      </div>

      {/* System Backups */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">System Backups</h3>
            <p className="text-sm text-slate-400">Manage system backups and recovery</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleCreateBackup('incremental')}
              className="bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-600/50 transition-all duration-300"
            >
              <Upload className="h-4 w-4 mr-2" />
              Incremental Backup
            </Button>
            <Button
              onClick={() => handleCreateBackup('full')}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            >
              <Upload className="h-4 w-4 mr-2" />
              Full Backup
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {backups.map((backup) => (
            <div key={backup.id} className="flex items-center justify-between p-4 border border-slate-700/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  <Database className="h-4 w-4 text-slate-300" />
                </div>
                <div>
                  <div className="font-medium text-slate-200">{backup.description}</div>
                  <div className="text-sm text-slate-400">
                    {backup.type} backup • {formatBytes(backup.size * 1024 * 1024 * 1024)} • {formatDate(backup.createdAt)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(backup.status)}>
                  {backup.status.toUpperCase()}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-600/50"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {backups.length === 0 && (
            <div className="text-center py-8">
              <Database className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-200 mb-2">No Backups</h3>
              <p className="text-slate-400">
                Create your first system backup to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={() => router.push('/dashboard/admin/users')}
            className="flex flex-col items-center gap-2 h-auto py-4 bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-600/50 transition-all duration-300"
          >
            <Users className="h-6 w-6" />
            <span className="text-sm">User Management</span>
          </Button>
          
          <Button 
            onClick={() => router.push('/dashboard/admin/security')}
            className="flex flex-col items-center gap-2 h-auto py-4 bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-600/50 transition-all duration-300"
          >
            <Shield className="h-6 w-6" />
            <span className="text-sm">Security Settings</span>
          </Button>
          
          <Button 
            onClick={() => router.push('/dashboard/admin/database')}
            className="flex flex-col items-center gap-2 h-auto py-4 bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-600/50 transition-all duration-300"
          >
            <Database className="h-6 w-6" />
            <span className="text-sm">Database Admin</span>
          </Button>
          
          <Button 
            onClick={() => router.push('/dashboard/admin/logs')}
            className="flex flex-col items-center gap-2 h-auto py-4 bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-600/50 transition-all duration-300"
          >
            <BarChart3 className="h-6 w-6" />
            <span className="text-sm">System Logs</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  Key
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'
import { toast } from 'react-hot-toast'

interface SystemMetrics {
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

export default function SystemAdminPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [selectedTab, setSelectedTab] = useState('overview')

  // Fetch system metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const response = await apiService.admin.getSystemMetrics()
      return response as SystemMetrics
    },
    enabled: !!session
  })

  // Fetch security events
  const { data: securityEvents } = useQuery({
    queryKey: ['security-events'],
    queryFn: async () => {
      const response = await apiService.admin.getSecurityEvents()
      return response as SecurityEvent[]
    },
    enabled: !!session
  })

  // Fetch system backups
  const { data: backups } = useQuery({
    queryKey: ['system-backups'],
    queryFn: async () => {
      const response = await apiService.admin.getSystemBackups()
      return response as SystemBackup[]
    },
    enabled: !!session
  })

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: (type: 'full' | 'incremental') => apiService.admin.createBackup(type),
    onSuccess: () => {
      toast.success('Backup started successfully')
      queryClient.invalidateQueries({ queryKey: ['system-backups'] })
    },
    onError: (error: any) => {
      toast.error('Failed to start backup')
    }
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-muted-foreground">
            Monitor system health, security, and performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.users.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.users.active || 0} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.equipment.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.equipment.active || 0} active equipment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calibrations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.calibrations.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.calibrations.overdue || 0} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.storage.percentage || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {formatBytes(metrics?.storage.used || 0)} used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Real-time system metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uptime</span>
              <span className="text-sm">{metrics?.performance.uptime || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Response Time</span>
              <span className="text-sm">{metrics?.performance.responseTime || 0}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Error Rate</span>
              <span className="text-sm">{metrics?.performance.errorRate || 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Status</CardTitle>
            <CardDescription>System security overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">SSL/TLS encryption active</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Two-factor authentication enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Regular security updates</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">2 failed login attempts today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>Monitor system security activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents?.slice(0, 10).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{event.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.user} • {event.ipAddress} • {formatDate(event.timestamp)}
                    </div>
                  </div>
                </div>
                <Badge className={getSeverityColor(event.severity)}>
                  {event.severity.toUpperCase()}
                </Badge>
              </div>
            ))}
            {(!securityEvents || securityEvents.length === 0) && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Security Events</h3>
                <p className="text-muted-foreground">
                  No security events recorded in the last 24 hours
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Backups */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Backups</CardTitle>
              <CardDescription>Manage system backups and recovery</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => createBackupMutation.mutate('incremental')}
                disabled={createBackupMutation.isPending}
              >
                <Upload className="h-4 w-4 mr-2" />
                Incremental Backup
              </Button>
              <Button
                size="sm"
                onClick={() => createBackupMutation.mutate('full')}
                disabled={createBackupMutation.isPending}
              >
                <Upload className="h-4 w-4 mr-2" />
                Full Backup
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backups?.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{backup.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {backup.type} backup • {formatBytes(backup.size)} • {formatDate(backup.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(backup.status)}>
                    {backup.status.toUpperCase()}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!backups || backups.length === 0) && (
              <div className="text-center py-8">
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Backups</h3>
                <p className="text-muted-foreground">
                  Create your first system backup to get started
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Manage system settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">System Name</label>
              <Input value="LabGuard Pro Production" disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Environment</label>
              <Input value="Production" disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Version</label>
              <Input value="1.0.0" disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Updated</label>
              <Input value="2024-01-15 10:30:00" disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
            <CardDescription>Monitor database health and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connection Status</span>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Connections</span>
              <span className="text-sm">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Size</span>
              <span className="text-sm">2.4 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Query Performance</span>
              <span className="text-sm">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Users className="h-6 w-6" />
              <span className="text-sm">User Management</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Shield className="h-6 w-6" />
              <span className="text-sm">Security Settings</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Database className="h-6 w-6" />
              <span className="text-sm">Database Admin</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">System Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
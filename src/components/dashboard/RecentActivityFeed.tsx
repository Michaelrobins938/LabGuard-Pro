'use client'

import { useState, useEffect } from 'react'
import { useDashboardStore } from '@/stores/dashboardStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Activity, Clock, User, Settings, AlertTriangle, CheckCircle,
  Calendar, FileText, Download, RefreshCw, Eye, Filter,
  TrendingUp, TrendingDown, Zap, Shield, Database, FlaskConical,
  Microscope, TestTube, Beaker, Bell, Star, Clock3, Wrench, Brain
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'calibration' | 'maintenance' | 'alert' | 'user' | 'system' | 'ai' | 'compliance'
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
    role: string
  }
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  equipment?: {
    name: string
    type: string
    id: string
  }
  metadata?: {
    duration?: string
    cost?: number
    impact?: string
    category?: string
  }
}

interface ActivityStats {
  total: number
  today: number
  thisWeek: number
  pending: number
  completed: number
  critical: number
}

export default function RecentActivityFeed() {
  const { equipment, calibrations, aiInsights, notifications, user } = useDashboardStore()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null)

  useEffect(() => {
    fetchActivityData()
  }, [equipment, calibrations, aiInsights, notifications])

  const fetchActivityData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/activity/recent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          laboratory: user?.laboratory?.id,
          limit: 50,
          includeEquipment: true,
          includeUsers: true
        })
      })

      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities)
        setStats(data.stats)
      } else {
        // Fallback to calculated data from store
        const calculatedActivities = calculateActivitiesFromStore()
        const calculatedStats = calculateActivityStats(calculatedActivities)
        setActivities(calculatedActivities)
        setStats(calculatedStats)
      }
    } catch (error) {
      console.error('Error fetching activity data:', error)
      const fallbackActivities = calculateActivitiesFromStore()
      const fallbackStats = calculateActivityStats(fallbackActivities)
      setActivities(fallbackActivities)
      setStats(fallbackStats)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateActivitiesFromStore = (): ActivityItem[] => {
    const activities: ActivityItem[] = []

    // Add calibration activities
    calibrations.forEach(calibration => {
      activities.push({
        id: `calibration-${calibration.id}`,
        type: 'calibration',
        title: `Calibration ${calibration.status === 'completed' ? 'Completed' : calibration.status === 'overdue' ? 'Overdue' : 'Scheduled'}`,
        description: `${calibration.equipmentName} - ${calibration.type}`,
        timestamp: calibration.dueDate,
        user: {
          name: calibration.assignedTechnician || 'System',
          role: 'Technician'
        },
        priority: calibration.priority as 'low' | 'medium' | 'high' | 'critical',
        status: calibration.status === 'completed' ? 'completed' : calibration.status === 'overdue' ? 'failed' : 'pending',
        equipment: {
          name: calibration.equipmentName,
          type: calibration.equipmentType,
          id: calibration.equipmentId
        },
        metadata: {
          duration: calibration.duration,
          cost: calibration.cost,
          impact: calibration.impact
        }
      })
    })

    // Add equipment maintenance activities
    equipment.forEach(eq => {
      if (eq.status === 'maintenance') {
        activities.push({
          id: `maintenance-${eq.id}`,
          type: 'maintenance',
          title: 'Equipment Maintenance Required',
          description: `${eq.name} - ${eq.location}`,
          timestamp: new Date().toISOString(),
          user: {
            name: eq.assignedTechnician || 'System',
            role: 'Technician'
          },
          priority: 'high',
          status: 'in_progress',
          equipment: {
            name: eq.name,
            type: eq.type,
            id: eq.id
          },
          metadata: {
            category: 'Preventive Maintenance'
          }
        })
      }
    })

    // Add AI insights activities
    aiInsights.forEach(insight => {
      activities.push({
        id: `ai-${insight.id}`,
        type: 'ai',
        title: `AI Insight: ${insight.type}`,
        description: insight.description,
        timestamp: insight.timestamp,
        user: {
          name: 'AI Assistant',
          role: 'AI'
        },
        priority: insight.priority as 'low' | 'medium' | 'high' | 'critical',
        status: insight.status === 'implemented' ? 'completed' : 'pending',
        metadata: {
          category: insight.category,
          impact: insight.impact
        }
      })
    })

    // Add notification activities
    notifications.forEach(notification => {
      activities.push({
        id: `notification-${notification.id}`,
        type: notification.type as 'alert' | 'system',
        title: notification.title,
        description: notification.message,
        timestamp: notification.timestamp,
        user: {
          name: notification.sender || 'System',
          role: 'System'
        },
        priority: notification.priority as 'low' | 'medium' | 'high' | 'critical',
        status: notification.read ? 'completed' : 'pending'
      })
    })

    // Sort by timestamp (newest first)
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const calculateActivityStats = (activities: ActivityItem[]): ActivityStats => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    return {
      total: activities.length,
      today: activities.filter(a => new Date(a.timestamp) >= today).length,
      thisWeek: activities.filter(a => new Date(a.timestamp) >= weekAgo).length,
      pending: activities.filter(a => a.status === 'pending' || a.status === 'in_progress').length,
      completed: activities.filter(a => a.status === 'completed').length,
      critical: activities.filter(a => a.priority === 'critical').length
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'calibration':
        return <Settings className="h-4 w-4" />
      case 'maintenance':
        return <Wrench className="h-4 w-4" />
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />
      case 'user':
        return <User className="h-4 w-4" />
      case 'system':
        return <Database className="h-4 w-4" />
      case 'ai':
        return <Brain className="h-4 w-4" />
      case 'compliance':
        return <Shield className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 border-red-500/30 text-red-400'
      case 'high':
        return 'bg-orange-500/20 border-orange-500/30 text-orange-400'
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
      case 'low':
        return 'bg-green-500/20 border-green-500/30 text-green-400'
      default:
        return 'bg-slate-500/20 border-slate-500/30 text-slate-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 border-green-500/30 text-green-400'
      case 'in_progress':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400'
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
      case 'failed':
        return 'bg-red-500/20 border-red-500/30 text-red-400'
      default:
        return 'bg-slate-500/20 border-slate-500/30 text-slate-400'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleExport = () => {
    const exportData = {
      activities: activities,
      stats: stats,
      exportDate: new Date().toISOString(),
      laboratory: user?.laboratory?.name || 'Advanced Research Laboratory',
      timeRange: 'recent',
      totalActivities: activities.length
    }
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `activity-feed-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true
    return activity.type === filter
  })

  const professionalStyles = "bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Recent Activity Feed
          </h2>
          <p className="text-slate-400 mt-1">
            Real-time updates from your laboratory operations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={fetchActivityData}
            disabled={isLoading}
            className={professionalStyles}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExport}
            className={professionalStyles}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Activities</p>
                <p className="text-2xl font-bold text-blue-400">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Today</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.today}</p>
              </div>
              <Clock className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
              </div>
              <Clock3 className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Critical</p>
                <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Activities</option>
          <option value="calibration">Calibrations</option>
          <option value="maintenance">Maintenance</option>
          <option value="alert">Alerts</option>
          <option value="ai">AI Insights</option>
          <option value="system">System</option>
          <option value="compliance">Compliance</option>
        </select>
        <span className="text-slate-400 text-sm">
          {filteredActivities.length} activities
        </span>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No activities found</p>
          </div>
        ) : (
          filteredActivities.slice(0, 20).map((activity) => (
            <div
              key={activity.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedActivity(activity)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-200 truncate">
                      {activity.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(activity.priority)}>
                        {activity.priority}
                      </Badge>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4">
                      {activity.user && (
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={activity.user.avatar} />
                            <AvatarFallback className="text-xs">
                              {activity.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-slate-400">
                            {activity.user.name} • {activity.user.role}
                          </span>
                        </div>
                      )}
                      {activity.equipment && (
                        <div className="flex items-center space-x-1">
                          <FlaskConical className="h-3 w-3 text-slate-500" />
                          <span className="text-xs text-slate-400">
                            {activity.equipment.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  {activity.metadata && (
                    <div className="flex items-center space-x-4 mt-2">
                      {activity.metadata.duration && (
                        <span className="text-xs text-slate-500">
                          Duration: {activity.metadata.duration}
                        </span>
                      )}
                      {activity.metadata.cost && (
                        <span className="text-xs text-slate-500">
                          Cost: ${activity.metadata.cost}
                        </span>
                      )}
                      {activity.metadata.impact && (
                        <span className="text-xs text-slate-500">
                          Impact: {activity.metadata.impact}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length > 20 && (
        <div className="text-center">
          <Button
            className={professionalStyles}
            onClick={() => {/* Load more logic */}}
          >
            Load More Activities
          </Button>
        </div>
      )}
    </div>
  )
}
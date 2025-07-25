'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Settings, 
  Check, 
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  Zap,
  Download
} from 'lucide-react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  channels: ('email' | 'sms' | 'in_app')[]
  status: 'pending' | 'sent' | 'failed'
  createdAt: string
  readAt?: string
  metadata?: Record<string, any>
}

interface NotificationPreferences {
  email: boolean
  sms: boolean
  inApp: boolean
  calibrationDue: boolean
  complianceFailure: boolean
  paymentFailed: boolean
  trialEnding: boolean
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    sms: false,
    inApp: true,
    calibrationDue: true,
    complianceFailure: true,
    paymentFailed: true,
    trialEnding: true
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (session?.user?.id) {
      loadNotifications()
    }
  }, [session])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      
      // Mock notifications data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'calibration_due',
          title: 'Calibration Due',
          message: 'Analytical Balance PB-220 calibration due in 2 days',
          priority: 'high',
          channels: ['email', 'in_app'],
          status: 'sent',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          metadata: {
            equipmentName: 'Analytical Balance PB-220',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            daysRemaining: 2
          }
        },
        {
          id: '2',
          type: 'calibration_completed',
          title: 'Calibration Completed',
          message: 'Centrifuge CF-16 calibration completed successfully',
          priority: 'medium',
          channels: ['email', 'in_app'],
          status: 'sent',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          readAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          metadata: {
            equipmentName: 'Centrifuge CF-16',
            complianceScore: 98.5,
            technicianName: 'Dr. Sarah Johnson'
          }
        },
        {
          id: '3',
          type: 'equipment_alert',
          title: 'Equipment Alert',
          message: 'pH Meter PH-200 temperature variance detected',
          priority: 'critical',
          channels: ['email', 'sms', 'in_app'],
          status: 'sent',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          metadata: {
            equipmentName: 'pH Meter PH-200',
            alertType: 'temperature_variance',
            severity: 'critical',
            description: 'Temperature reading outside acceptable range'
          }
        },
        {
          id: '4',
          type: 'payment_failed',
          title: 'Payment Failed',
          message: 'We were unable to process your payment for LabGuard Pro',
          priority: 'high',
          channels: ['email', 'in_app'],
          status: 'sent',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          metadata: {
            amount: 299.00,
            reason: 'Insufficient funds',
            dueDate: new Date().toISOString()
          }
        },
        {
          id: '5',
          type: 'trial_ending',
          title: 'Trial Ending Soon',
          message: 'Your LabGuard Pro trial ends in 3 days',
          priority: 'medium',
          channels: ['email', 'in_app'],
          status: 'sent',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          metadata: {
            trialEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            equipmentCount: 5,
            complianceChecks: 23,
            aiQueries: 12
          }
        }
      ]

      setNotifications(mockNotifications)
    } catch (err) {
      setError('Failed to load notifications')
      console.error('Notifications error:', err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      // Call API to mark as read
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, readAt: new Date().toISOString() }
              : notification
          )
        )
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      // Call API to delete notification
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'calibration_due':
      case 'calibration_completed':
        return <CheckCircle className="h-4 w-4" />
      case 'equipment_alert':
        return <AlertTriangle className="h-4 w-4" />
      case 'payment_failed':
        return <AlertTriangle className="h-4 w-4" />
      case 'trial_ending':
        return <Clock className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3" />
      case 'sms': return <MessageSquare className="h-3 w-3" />
      case 'in_app': return <Bell className="h-3 w-3" />
      default: return <Bell className="h-3 w-3" />
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !notification.readAt
    if (activeTab === 'critical') return notification.priority === 'critical'
    return notification.type === activeTab
  })

  const unreadCount = notifications.filter(n => !n.readAt).length
  const criticalCount = notifications.filter(n => n.priority === 'critical').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading notifications...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your notifications and preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={loadNotifications} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">
              All time notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">
              High priority alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => 
                new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            View and manage your notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="calibration_due">Calibrations</TabsTrigger>
              <TabsTrigger value="equipment_alert">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'all' 
                      ? 'You\'re all caught up!' 
                      : `No ${activeTab} notifications found`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-4 p-4 border rounded-lg ${
                        notification.readAt ? 'bg-muted/50' : 'bg-background'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium">
                              {notification.title}
                            </h4>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            {!notification.readAt && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {notification.channels.map((channel) => (
                              <div key={channel} className="text-muted-foreground">
                                {getChannelIcon(channel)}
                              </div>
                            ))}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>

                        {notification.metadata && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            {notification.type === 'calibration_due' && (
                              <span>Due: {new Date(notification.metadata.dueDate).toLocaleDateString()}</span>
                            )}
                            {notification.type === 'calibration_completed' && (
                              <span>Score: {notification.metadata.complianceScore}%</span>
                            )}
                            {notification.type === 'payment_failed' && (
                              <span>Amount: ${notification.metadata.amount}</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>

                          <div className="flex items-center space-x-2">
                            {!notification.readAt && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Mark Read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Mark All Read</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Notification Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Manage Preferences
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Export Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
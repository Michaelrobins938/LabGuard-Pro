'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Microscope, 
  TrendingUp,
  Calendar,
  FileText,
  Users,
  DollarSign
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DashboardStats {
  totalEquipment: number
  compliantEquipment: number
  overdueCalibrations: number
  dueSoonCalibrations: number
  completedThisMonth: number
  savingsThisMonth: number
  complianceRate: number
  avgCalibrationTime: number
}

interface RecentActivity {
  id: string
  type: 'calibration_completed' | 'calibration_due' | 'equipment_added' | 'alert'
  title: string
  description: string
  timestamp: string
  equipmentName?: string
  status: 'success' | 'warning' | 'error' | 'info'
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    compliantEquipment: 0,
    overdueCalibrations: 0,
    dueSoonCalibrations: 0,
    completedThisMonth: 0,
    savingsThisMonth: 0,
    complianceRate: 0,
    avgCalibrationTime: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - replace with actual API responses
      setStats({
        totalEquipment: 47,
        compliantEquipment: 44,
        overdueCalibrations: 3,
        dueSoonCalibrations: 7,
        completedThisMonth: 23,
        savingsThisMonth: 12500,
        complianceRate: 93.6,
        avgCalibrationTime: 15
      })

      setRecentActivity([
        {
          id: '1',
          type: 'calibration_completed',
          title: 'Calibration Completed',
          description: 'Balance PB-220 calibration completed successfully',
          timestamp: '2 hours ago',
          equipmentName: 'Balance PB-220',
          status: 'success'
        },
        {
          id: '2',
          type: 'calibration_due',
          title: 'Calibration Due Soon',
          description: 'Centrifuge CF-16 calibration due in 3 days',
          timestamp: '4 hours ago',
          equipmentName: 'Centrifuge CF-16',
          status: 'warning'
        },
        {
          id: '3',
          type: 'alert',
          title: 'Temperature Alert',
          description: 'Incubator IC-200 temperature variance detected',
          timestamp: '6 hours ago',
          equipmentName: 'Incubator IC-200',
          status: 'error'
        },
        {
          id: '4',
          type: 'equipment_added',
          title: 'Equipment Added',
          description: 'New spectrophotometer SP-300 added to inventory',
          timestamp: '1 day ago',
          equipmentName: 'Spectrophotometer SP-300',
          status: 'info'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'calibration_completed':
        return <CheckCircle className="w-4 h-4" />
      case 'calibration_due':
        return <Clock className="w-4 h-4" />
      case 'alert':
        return <AlertTriangle className="w-4 h-4" />
      case 'equipment_added':
        return <Microscope className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      case 'info':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name?.split(' ')[0]}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening in {session?.user?.laboratoryName} today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Microscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEquipment}</div>
            <p className="text-xs text-muted-foreground">
              {stats.compliantEquipment} compliant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.complianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueCalibrations}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.savingsThisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From prevented failures
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/equipment/new">
              <Button className="w-full justify-start" variant="outline">
                <Microscope className="w-4 h-4 mr-2" />
                Add Equipment
              </Button>
            </Link>
            <Link href="/dashboard/calibrations/new">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Calibration
              </Button>
            </Link>
            <Link href="/dashboard/reports/compliance">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </Link>
            <Link href="/dashboard/team">
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Manage Team
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link href="/dashboard/notifications">
                <Button variant="ghost" className="w-full">
                  View all notifications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Items */}
      {(stats.overdueCalibrations > 0 || stats.dueSoonCalibrations > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Items Requiring Attention</CardTitle>
            <CardDescription className="text-yellow-700">
              Equipment that needs calibration or maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.overdueCalibrations > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="font-medium text-red-800">
                      {stats.overdueCalibrations} Overdue Calibrations
                    </span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    These items are past their calibration due date
                  </p>
                  <Link href="/dashboard/calibrations/overdue">
                    <Button size="sm" variant="outline" className="mt-2 border-red-300 text-red-700 hover:bg-red-100">
                      View Overdue Items
                    </Button>
                  </Link>
                </div>
              )}
              
              {stats.dueSoonCalibrations > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="font-medium text-yellow-800">
                      {stats.dueSoonCalibrations} Due Within 7 Days
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Schedule these calibrations soon to avoid overdue status
                  </p>
                  <Link href="/dashboard/calibrations?filter=due-soon">
                    <Button size="sm" variant="outline" className="mt-2 border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                      Schedule Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Calibrations Completed</span>
                <span className="font-semibold">{stats.completedThisMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Time per Calibration</span>
                <span className="font-semibold">{stats.avgCalibrationTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cost Savings</span>
                <span className="font-semibold text-green-600">
                  ${stats.savingsThisMonth.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Compliant Equipment</span>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="font-semibold">{stats.compliantEquipment}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Non-Compliant</span>
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                  <span className="font-semibold">{stats.totalEquipment - stats.compliantEquipment}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${stats.complianceRate}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">99.2%</div>
                <div className="text-xs text-gray-500">Uptime This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-xs text-gray-500">AI Checks Performed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4.2min</div>
                <div className="text-xs text-gray-500">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
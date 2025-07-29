'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Zap,
  HardDrive,
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'

interface UsageData {
  currentPeriod: {
    equipment: number
    aiChecks: number
    teamMembers: number
    storage: number
  }
  previousPeriod: {
    equipment: number
    aiChecks: number
    teamMembers: number
    storage: number
  }
  limits: {
    equipment: number
    aiChecks: number
    teamMembers: number
    storage: number
  }
  trends: {
    date: string
    equipment: number
    aiChecks: number
    teamMembers: number
    storage: number
  }[]
  alerts: {
    type: 'warning' | 'critical'
    message: string
    threshold: number
    current: number
  }[]
  topUsers: {
    id: string
    name: string
    email: string
    activity: number
    lastActive: string
  }[]
}

export default function UsagePage() {
  const { data: session } = useSession()
  const [timeRange, setTimeRange] = useState('30d')

  // Fetch usage data
  const { data: usageData, isLoading: usageLoading } = useQuery({
    queryKey: ['usage-analytics', timeRange],
    queryFn: async () => {
      const response = await apiService.billing.getUsageAnalytics(timeRange)
      return response as UsageData
    },
    enabled: !!session
  })

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <BarChart3 className="h-4 w-4 text-gray-600" />
  }

  const getTrendText = (current: number, previous: number) => {
    const diff = current - previous
    const percentage = previous > 0 ? (diff / previous) * 100 : 0
    if (diff > 0) return `+${formatNumber(diff)} (+${percentage.toFixed(1)}%)`
    if (diff < 0) return `${formatNumber(diff)} (${percentage.toFixed(1)}%)`
    return 'No change'
  }

  if (usageLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Usage Analytics</h1>
          <p className="text-muted-foreground">
            Monitor your platform usage and resource consumption
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Usage Alerts */}
      {usageData?.alerts && usageData.alerts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {usageData.alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900">{alert.message}</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Current: {formatNumber(alert.current)} / Limit: {formatNumber(alert.threshold)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(usageData?.currentPeriod.equipment || 0)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              {getTrendIcon(usageData?.currentPeriod.equipment || 0, usageData?.previousPeriod.equipment || 0)}
              {getTrendText(usageData?.currentPeriod.equipment || 0, usageData?.previousPeriod.equipment || 0)}
            </div>
            {usageData?.limits.equipment !== -1 && (
              <div className="mt-2">
                <Progress 
                  value={getUsagePercentage(usageData?.currentPeriod.equipment || 0, usageData?.limits.equipment || 0)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formatNumber(usageData?.currentPeriod.equipment || 0)} / {formatNumber(usageData?.limits.equipment || 0)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Checks</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(usageData?.currentPeriod.aiChecks || 0)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              {getTrendIcon(usageData?.currentPeriod.aiChecks || 0, usageData?.previousPeriod.aiChecks || 0)}
              {getTrendText(usageData?.currentPeriod.aiChecks || 0, usageData?.previousPeriod.aiChecks || 0)}
            </div>
            {usageData?.limits.aiChecks !== -1 && (
              <div className="mt-2">
                <Progress 
                  value={getUsagePercentage(usageData?.currentPeriod.aiChecks || 0, usageData?.limits.aiChecks || 0)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formatNumber(usageData?.currentPeriod.aiChecks || 0)} / {formatNumber(usageData?.limits.aiChecks || 0)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(usageData?.currentPeriod.teamMembers || 0)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              {getTrendIcon(usageData?.currentPeriod.teamMembers || 0, usageData?.previousPeriod.teamMembers || 0)}
              {getTrendText(usageData?.currentPeriod.teamMembers || 0, usageData?.previousPeriod.teamMembers || 0)}
            </div>
            {usageData?.limits.teamMembers !== -1 && (
              <div className="mt-2">
                <Progress 
                  value={getUsagePercentage(usageData?.currentPeriod.teamMembers || 0, usageData?.limits.teamMembers || 0)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formatNumber(usageData?.currentPeriod.teamMembers || 0)} / {formatNumber(usageData?.limits.teamMembers || 0)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(usageData?.currentPeriod.storage || 0)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              {getTrendIcon(usageData?.currentPeriod.storage || 0, usageData?.previousPeriod.storage || 0)}
              {getTrendText(usageData?.currentPeriod.storage || 0, usageData?.previousPeriod.storage || 0)}
            </div>
            {usageData?.limits.storage !== -1 && (
              <div className="mt-2">
                <Progress 
                  value={getUsagePercentage(usageData?.currentPeriod.storage || 0, usageData?.limits.storage || 0)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formatBytes(usageData?.currentPeriod.storage || 0)} / {formatBytes(usageData?.limits.storage || 0)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usage Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Trends</CardTitle>
          <CardDescription>
            {timeRange === '7d' ? '7-day' : timeRange === '30d' ? '30-day' : timeRange === '90d' ? '90-day' : '1-year'} usage trends for your laboratory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Usage trends chart will be implemented here</p>
              <p className="text-sm">Shows daily/weekly usage patterns over time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Users */}
      {usageData?.topUsers && usageData.topUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Active Users</CardTitle>
            <CardDescription>
              Users with the highest activity in the current period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageData.topUsers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatNumber(user.activity)} activities</div>
                    <div className="text-sm text-muted-foreground">
                      Last active: {new Date(user.lastActive).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Breakdown</CardTitle>
          <CardDescription>
            Detailed breakdown of your current usage against plan limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageData && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Equipment Items</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(usageData.currentPeriod.equipment)} / {usageData.limits.equipment === -1 ? 'Unlimited' : formatNumber(usageData.limits.equipment)}
                    </span>
                  </div>
                  {usageData.limits.equipment !== -1 && (
                    <Progress 
                      value={getUsagePercentage(usageData.currentPeriod.equipment, usageData.limits.equipment)} 
                      className="h-2"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">AI Compliance Checks</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(usageData.currentPeriod.aiChecks)} / {usageData.limits.aiChecks === -1 ? 'Unlimited' : formatNumber(usageData.limits.aiChecks)}
                    </span>
                  </div>
                  {usageData.limits.aiChecks !== -1 && (
                    <Progress 
                      value={getUsagePercentage(usageData.currentPeriod.aiChecks, usageData.limits.aiChecks)} 
                      className="h-2"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Team Members</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(usageData.currentPeriod.teamMembers)} / {usageData.limits.teamMembers === -1 ? 'Unlimited' : formatNumber(usageData.limits.teamMembers)}
                    </span>
                  </div>
                  {usageData.limits.teamMembers !== -1 && (
                    <Progress 
                      value={getUsagePercentage(usageData.currentPeriod.teamMembers, usageData.limits.teamMembers)} 
                      className="h-2"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Storage</span>
                    <span className="text-sm text-muted-foreground">
                      {formatBytes(usageData.currentPeriod.storage)} / {usageData.limits.storage === -1 ? 'Unlimited' : formatBytes(usageData.limits.storage)}
                    </span>
                  </div>
                  {usageData.limits.storage !== -1 && (
                    <Progress 
                      value={getUsagePercentage(usageData.currentPeriod.storage, usageData.limits.storage)} 
                      className="h-2"
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
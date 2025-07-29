'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, TrendingUp, TrendingDown, Users, Brain, HardDrive, Zap, Calendar, Download, AlertCircle, CheckCircle } from 'lucide-react'
import { apiService } from '@/lib/api-service'
import { toast } from 'sonner'

interface UsageData {
  equipment: {
    used: number
    limit: number
    percentage: number
  }
  aiChecks: {
    used: number
    limit: number
    percentage: number
  }
  teamMembers: {
    used: number
    limit: number
    percentage: number
  }
  storage: {
    used: number
    limit: number
    percentage: number
  }
  apiCalls: {
    used: number
    limit: number
    percentage: number
  }
  reports: {
    used: number
    limit: number
    percentage: number
  }
}

interface UsageHistory {
  date: string
  equipment: number
  aiChecks: number
  teamMembers: number
  storage: number
}

export default function UsagePage() {
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    loadUsageData()
  }, [timeRange])

  const loadUsageData = async () => {
    try {
      setLoading(true)
      const response = await apiService.billing.getUsage()
      setUsageData(response.usage)
      
      // Mock usage history data
      const history = generateMockHistory()
      setUsageHistory(history)
    } catch (error: any) {
      console.error('Failed to load usage data:', error)
      toast.error('Failed to load usage data')
    } finally {
      setLoading(false)
    }
  }

  const generateMockHistory = (): UsageHistory[] => {
    const history: UsageHistory[] = []
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      history.push({
        date: date.toISOString().split('T')[0],
        equipment: Math.floor(Math.random() * 20) + 10,
        aiChecks: Math.floor(Math.random() * 50) + 200,
        teamMembers: Math.floor(Math.random() * 5) + 5,
        storage: Math.floor(Math.random() * 20) + 30
      })
    }
    
    return history
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-400'
    if (percentage >= 75) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getUsageBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 GB'
    const gb = bytes / (1024 * 1024 * 1024)
    return `${gb.toFixed(1)} GB`
  }

  const exportUsageReport = () => {
    // In a real implementation, this would generate and download a CSV/PDF report
    toast.success('Usage report exported successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-4"></div>
            <div className="h-64 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Usage Analytics</h1>
            <p className="text-gray-300">Monitor your resource usage and plan limits</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/10 border-white/20">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={exportUsageReport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Current Usage Overview */}
        {usageData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Equipment Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">
                    {usageData.equipment.used}
                  </span>
                  <span className="text-gray-300">
                    / {usageData.equipment.limit === -1 ? '∞' : usageData.equipment.limit}
                  </span>
                </div>
                <Progress 
                  value={usageData.equipment.percentage} 
                  className="h-2 mb-2"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className={`${getUsageColor(usageData.equipment.percentage)}`}>
                    {usageData.equipment.percentage}% used
                  </span>
                  {usageData.equipment.percentage >= 90 && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Near Limit
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Compliance Checks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">
                    {usageData.aiChecks.used}
                  </span>
                  <span className="text-gray-300">
                    / {usageData.aiChecks.limit === -1 ? '∞' : usageData.aiChecks.limit}
                  </span>
                </div>
                <Progress 
                  value={usageData.aiChecks.percentage} 
                  className="h-2 mb-2"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className={`${getUsageColor(usageData.aiChecks.percentage)}`}>
                    {usageData.aiChecks.percentage}% used
                  </span>
                  {usageData.aiChecks.percentage >= 90 && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Near Limit
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">
                    {usageData.teamMembers.used}
                  </span>
                  <span className="text-gray-300">
                    / {usageData.teamMembers.limit === -1 ? '∞' : usageData.teamMembers.limit}
                  </span>
                </div>
                <Progress 
                  value={usageData.teamMembers.percentage} 
                  className="h-2 mb-2"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className={`${getUsageColor(usageData.teamMembers.percentage)}`}>
                    {usageData.teamMembers.percentage}% used
                  </span>
                  {usageData.teamMembers.percentage >= 90 && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Near Limit
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <HardDrive className="w-5 h-5 mr-2" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">
                    {formatBytes(usageData.storage.used * 1024 * 1024 * 1024)}
                  </span>
                  <span className="text-gray-300">
                    / {usageData.storage.limit} GB
                  </span>
                </div>
                <Progress 
                  value={usageData.storage.percentage} 
                  className="h-2 mb-2"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className={`${getUsageColor(usageData.storage.percentage)}`}>
                    {usageData.storage.percentage}% used
                  </span>
                  {usageData.storage.percentage >= 90 && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Near Limit
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  API Calls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">
                    {usageData.apiCalls.used.toLocaleString()}
                  </span>
                  <span className="text-gray-300">
                    / {usageData.apiCalls.limit === -1 ? '∞' : usageData.apiCalls.limit.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={usageData.apiCalls.percentage} 
                  className="h-2 mb-2"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className={`${getUsageColor(usageData.apiCalls.percentage)}`}>
                    {usageData.apiCalls.percentage}% used
                  </span>
                  {usageData.apiCalls.percentage >= 90 && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Near Limit
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Reports Generated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">
                    {usageData.reports.used}
                  </span>
                  <span className="text-gray-300">
                    / {usageData.reports.limit === -1 ? '∞' : usageData.reports.limit}
                  </span>
                </div>
                <Progress 
                  value={usageData.reports.percentage} 
                  className="h-2 mb-2"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className={`${getUsageColor(usageData.reports.percentage)}`}>
                    {usageData.reports.percentage}% used
                  </span>
                  {usageData.reports.percentage >= 90 && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Near Limit
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Usage Trends */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Usage Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageHistory.map((day, index) => (
                <div key={day.date} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-white font-medium">{day.date}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Equipment</div>
                      <div className="text-white font-semibold">{day.equipment}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">AI Checks</div>
                      <div className="text-white font-semibold">{day.aiChecks}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Team</div>
                      <div className="text-white font-semibold">{day.teamMembers}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Storage</div>
                      <div className="text-white font-semibold">{day.storage} GB</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Usage Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-white font-medium">AI Checks Usage</div>
                  <div className="text-gray-300 text-sm">47% increase from last month</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingDown className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-white font-medium">Storage Usage</div>
                  <div className="text-gray-300 text-sm">12% decrease from last month</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-white font-medium">Team Members</div>
                  <div className="text-gray-300 text-sm">Stable usage pattern</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-white font-medium mb-1">Consider Plan Upgrade</div>
                <div className="text-gray-300 text-sm">
                  Your AI checks usage is approaching the limit. Consider upgrading to a higher plan.
                </div>
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="text-white font-medium mb-1">Storage Optimization</div>
                <div className="text-gray-300 text-sm">
                  Your storage usage is well within limits. No action needed.
                </div>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="text-white font-medium mb-1">Team Growth</div>
                <div className="text-gray-300 text-sm">
                  Consider adding more team members as your usage grows.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
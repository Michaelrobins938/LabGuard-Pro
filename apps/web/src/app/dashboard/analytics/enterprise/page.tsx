'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  BarChart3, 
  PieChart, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter
} from 'lucide-react'

interface EnterpriseMetrics {
  totalRevenue: number
  monthlyGrowth: number
  activeUsers: number
  userGrowth: number
  systemUptime: number
  performanceScore: number
  dataProcessed: number
  storageUsed: number
}

interface RevenueData {
  month: string
  revenue: number
  growth: number
}

interface UserEngagement {
  metric: string
  value: number
  change: number
  trend: 'up' | 'down'
}

interface SystemPerformance {
  metric: string
  value: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
  lastUpdated: string
}

interface PredictiveInsight {
  id: string
  type: 'revenue' | 'usage' | 'performance' | 'user'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  date: string
}

export default function EnterpriseAnalytics() {
  const [metrics, setMetrics] = useState<EnterpriseMetrics | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [userEngagement, setUserEngagement] = useState<UserEngagement[]>([])
  const [systemPerformance, setSystemPerformance] = useState<SystemPerformance[]>([])
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([])
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for fallback
  const mockMetrics: EnterpriseMetrics = {
    totalRevenue: 284750,
    monthlyGrowth: 12.5,
    activeUsers: 1247,
    userGrowth: 8.3,
    systemUptime: 99.8,
    performanceScore: 94.2,
    dataProcessed: 2.4,
    storageUsed: 67.3
  }

  const mockRevenueData: RevenueData[] = [
    { month: 'Jan', revenue: 185000, growth: 8.2 },
    { month: 'Feb', revenue: 198000, growth: 7.0 },
    { month: 'Mar', revenue: 212000, growth: 7.1 },
    { month: 'Apr', revenue: 225000, growth: 6.1 },
    { month: 'May', revenue: 238000, growth: 5.8 },
    { month: 'Jun', revenue: 252000, growth: 5.9 },
    { month: 'Jul', revenue: 265000, growth: 5.2 },
    { month: 'Aug', revenue: 278000, growth: 4.9 },
    { month: 'Sep', revenue: 284750, growth: 2.4 }
  ]

  const mockUserEngagement: UserEngagement[] = [
    { metric: 'Daily Active Users', value: 1247, change: 8.3, trend: 'up' },
    { metric: 'Session Duration', value: 24, change: -2.1, trend: 'down' },
    { metric: 'Feature Adoption', value: 78, change: 12.5, trend: 'up' },
    { metric: 'User Retention', value: 92, change: 3.2, trend: 'up' },
    { metric: 'Support Tickets', value: 156, change: -15.4, trend: 'down' },
    { metric: 'API Usage', value: 2.4, change: 18.7, trend: 'up' }
  ]

  const mockSystemPerformance: SystemPerformance[] = [
    { metric: 'System Uptime', value: 99.8, status: 'excellent', lastUpdated: '2 minutes ago' },
    { metric: 'Response Time', value: 245, status: 'good', lastUpdated: '1 minute ago' },
    { metric: 'Database Performance', value: 94.2, status: 'excellent', lastUpdated: '30 seconds ago' },
    { metric: 'Storage Usage', value: 67.3, status: 'good', lastUpdated: '5 minutes ago' },
    { metric: 'Memory Usage', value: 78.9, status: 'warning', lastUpdated: '1 minute ago' },
    { metric: 'CPU Usage', value: 45.2, status: 'good', lastUpdated: '2 minutes ago' }
  ]

  const mockPredictiveInsights: PredictiveInsight[] = [
    {
      id: '1',
      type: 'revenue',
      title: 'Revenue Growth Prediction',
      description: 'Based on current trends, revenue is expected to grow 15% in Q4',
      confidence: 87,
      impact: 'high',
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'usage',
      title: 'Storage Capacity Alert',
      description: 'Storage usage will reach 85% within 30 days at current growth rate',
      confidence: 92,
      impact: 'medium',
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'performance',
      title: 'Performance Optimization',
      description: 'Database queries can be optimized to improve response time by 20%',
      confidence: 78,
      impact: 'medium',
      date: '2024-01-13'
    },
    {
      id: '4',
      type: 'user',
      title: 'User Churn Risk',
      description: '15% of inactive users are at risk of churning in the next 30 days',
      confidence: 85,
      impact: 'high',
      date: '2024-01-12'
    }
  ]

  const fetchEnterpriseData = async () => {
    try {
      setIsLoading(true)
      
      const [metricsRes, revenueRes, engagementRes, performanceRes, insightsRes] = await Promise.all([
        fetch(`/api/analytics/enterprise/metrics?timeRange=${timeRange}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/analytics/enterprise/revenue?timeRange=${timeRange}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/analytics/enterprise/engagement?timeRange=${timeRange}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/analytics/enterprise/performance?timeRange=${timeRange}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/analytics/enterprise/insights?timeRange=${timeRange}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ])

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData)
      } else {
        setMetrics(mockMetrics)
      }

      if (revenueRes.ok) {
        const revenueData = await revenueRes.json()
        setRevenueData(revenueData)
      } else {
        setRevenueData(mockRevenueData)
      }

      if (engagementRes.ok) {
        const engagementData = await engagementRes.json()
        setUserEngagement(engagementData)
      } else {
        setUserEngagement(mockUserEngagement)
      }

      if (performanceRes.ok) {
        const performanceData = await performanceRes.json()
        setSystemPerformance(performanceData)
      } else {
        setSystemPerformance(mockSystemPerformance)
      }

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json()
        setPredictiveInsights(insightsData)
      } else {
        setPredictiveInsights(mockPredictiveInsights)
      }
    } catch (err) {
      console.error('Error fetching enterprise analytics:', err)
      setMetrics(mockMetrics)
      setRevenueData(mockRevenueData)
      setUserEngagement(mockUserEngagement)
      setSystemPerformance(mockSystemPerformance)
      setPredictiveInsights(mockPredictiveInsights)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEnterpriseData()
  }, [timeRange])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExportReport = async (type: string) => {
    try {
      const response = await fetch(`/api/analytics/enterprise/export?type=${type}&timeRange=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `enterprise-analytics-${type}-${timeRange}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to export report')
      }
    } catch (err) {
      console.error('Error exporting report:', err)
      alert('Failed to export report')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enterprise Analytics</h1>
              <p className="text-gray-600 mt-2">Comprehensive business intelligence and performance insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={() => handleExportReport('comprehensive')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${metrics.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 ml-1">+{metrics.monthlyGrowth}%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.activeUsers.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 ml-1">+{metrics.userGrowth}%</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.systemUptime}%</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 ml-1">Excellent</span>
                  </div>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Performance Score</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.performanceScore}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 ml-1">+2.1%</span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Analytics */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{item.month}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold text-gray-900">${item.revenue.toLocaleString()}</span>
                      <div className="flex items-center">
                        {item.growth >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm ml-1 ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Engagement */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Engagement</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {userEngagement.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{item.metric}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                      <div className="flex items-center">
                        {item.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm ml-1 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">System Performance</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemPerformance.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{item.metric}</span>
                    <span className={`text-sm font-semibold ${getStatusColor(item.status)}`}>
                      {item.value}{item.metric.includes('Usage') || item.metric.includes('Uptime') ? '%' : 'ms'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.status === 'excellent' ? 'bg-green-500' :
                        item.status === 'good' ? 'bg-blue-500' :
                        item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(item.value, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Updated {item.lastUpdated}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Predictive Insights */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Predictive Insights</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {predictiveInsights.map((insight) => (
                <div key={insight.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                      {insight.impact} impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Confidence:</span>
                      <span className="text-sm font-semibold text-gray-900">{insight.confidence}%</span>
                    </div>
                    <span className="text-xs text-gray-500">{insight.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
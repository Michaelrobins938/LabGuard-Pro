'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

interface AnalyticsData {
  equipmentMetrics: {
    total: number
    active: number
    maintenance: number
    calibration: number
  }
  complianceMetrics: {
    compliant: number
    nonCompliant: number
    pending: number
  }
  performanceMetrics: {
    uptime: number
    efficiency: number
    accuracy: number
  }
  trends: Array<{
    date: string
    calibrations: number
    maintenance: number
    alerts: number
  }>
  topEquipment: Array<{
    name: string
    usage: number
    status: string
  }>
  complianceByCategory: Array<{
    category: string
    compliant: number
    total: number
  }>
}

export function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<AnalyticsData | null>(null)

  // Mock data - replace with actual API calls
  const mockData: AnalyticsData = {
    equipmentMetrics: {
      total: 156,
      active: 142,
      maintenance: 8,
      calibration: 6
    },
    complianceMetrics: {
      compliant: 89,
      nonCompliant: 12,
      pending: 5
    },
    performanceMetrics: {
      uptime: 98.5,
      efficiency: 94.2,
      accuracy: 99.1
    },
    trends: [
      { date: '2024-01-01', calibrations: 12, maintenance: 8, alerts: 3 },
      { date: '2024-01-02', calibrations: 15, maintenance: 6, alerts: 2 },
      { date: '2024-01-03', calibrations: 18, maintenance: 9, alerts: 4 },
      { date: '2024-01-04', calibrations: 14, maintenance: 7, alerts: 1 },
      { date: '2024-01-05', calibrations: 16, maintenance: 5, alerts: 3 },
      { date: '2024-01-06', calibrations: 13, maintenance: 8, alerts: 2 },
      { date: '2024-01-07', calibrations: 17, maintenance: 6, alerts: 5 }
    ],
    topEquipment: [
      { name: 'Microscope XR-2000', usage: 85, status: 'active' },
      { name: 'Centrifuge CF-500', usage: 78, status: 'active' },
      { name: 'Spectrophotometer SP-100', usage: 72, status: 'maintenance' },
      { name: 'Incubator IN-300', usage: 68, status: 'active' },
      { name: 'Autoclave AC-150', usage: 65, status: 'calibration' }
    ],
    complianceByCategory: [
      { category: 'Safety Equipment', compliant: 45, total: 50 },
      { category: 'Measurement Devices', compliant: 38, total: 42 },
      { category: 'Environmental Controls', compliant: 32, total: 35 },
      { category: 'Data Systems', compliant: 28, total: 29 }
    ]
  }

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // Fetch analytics data from API
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timeRange: selectedTimeRange,
            laboratory: user?.laboratory?.id
          })
        });

        if (response.ok) {
          const analyticsData = await response.json();
          setData(analyticsData);
        } else {
          // Fallback to calculated data from store
          const calculatedData: AnalyticsData = {
            equipmentPerformance: calculateEquipmentPerformance(),
            calibrationMetrics: calculateCalibrationMetrics(),
            complianceTrends: calculateComplianceTrends(),
            aiUsage: calculateAIUsage(),
            costSavings: calculateCostSavings(),
            timeEfficiency: calculateTimeEfficiency()
          };
          setData(calculatedData);
        }
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        // Fallback to calculated data from store
        const calculatedData: AnalyticsData = {
          equipmentPerformance: calculateEquipmentPerformance(),
          calibrationMetrics: calculateCalibrationMetrics(),
          complianceTrends: calculateComplianceTrends(),
          aiUsage: calculateAIUsage(),
          costSavings: calculateCostSavings(),
          timeEfficiency: calculateTimeEfficiency()
        };
        setData(calculatedData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [selectedTimeRange, equipment, calibrations, aiInsights, user]);

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setData(mockData)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    // Export analytics data to various formats
    const exportData = {
      analytics: data,
      exportDate: new Date().toISOString(),
      laboratory: 'Advanced Research Laboratory',
      timeRange: timeRange,
      format: 'json',
      reportType: 'advanced-analytics'
    };
    
    // Create downloadable file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `advanced-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'maintenance': return 'text-yellow-600'
      case 'calibration': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'maintenance': return <AlertTriangle className="w-4 h-4" />
      case 'calibration': return <Clock className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <p className="text-gray-600">Real-time insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.equipmentMetrics.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.equipmentMetrics.active} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((data.complianceMetrics.compliant / (data.complianceMetrics.compliant + data.complianceMetrics.nonCompliant + data.complianceMetrics.pending)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {data.complianceMetrics.compliant} compliant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.performanceMetrics.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.performanceMetrics.accuracy}%</div>
            <p className="text-xs text-muted-foreground">
              +0.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calibrations" stroke="#8884d8" name="Calibrations" />
                <Line type="monotone" dataKey="maintenance" stroke="#82ca9d" name="Maintenance" />
                <Line type="monotone" dataKey="alerts" stroke="#ffc658" name="Alerts" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compliance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={data.complianceByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, compliant, total }) => `${category}: ${Math.round((compliant / total) * 100)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="compliant"
                >
                  {data.complianceByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Equipment */}
      <Card>
        <CardHeader>
          <CardTitle>Top Equipment by Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topEquipment.map((equipment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(equipment.status)}
                    <span className={`font-medium ${getStatusColor(equipment.status)}`}>
                      {equipment.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{equipment.usage}%</div>
                    <div className="text-sm text-gray-500">usage</div>
                  </div>
                  <Badge variant="outline">{equipment.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
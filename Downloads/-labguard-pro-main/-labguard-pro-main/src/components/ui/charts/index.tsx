'use client'

import { useState, useEffect } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, ScatterChart, Scatter, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, RadarArea
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp, TrendingDown, Activity, BarChart3, PieChart as PieChartIcon,
  Download, RefreshCw, Eye, Settings, Calendar, Filter
} from 'lucide-react'

// Chart color schemes matching the landing page aesthetic
export const chartColors = {
  primary: '#3B82F6', // blue-500
  secondary: '#8B5CF6', // violet-500
  success: '#10B981', // emerald-500
  warning: '#F59E0B', // amber-500
  danger: '#EF4444', // red-500
  info: '#06B6D4', // cyan-500
  gradient: {
    from: '#3B82F6',
    to: '#8B5CF6'
  }
}

export const chartGradients = [
  { from: '#3B82F6', to: '#8B5CF6' },
  { from: '#10B981', to: '#06B6D4' },
  { from: '#F59E0B', to: '#EF4444' },
  { from: '#8B5CF6', to: '#EC4899' },
  { from: '#06B6D4', to: '#3B82F6' }
]

// Enhanced Tooltip component with premium styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-xl">
        <p className="text-slate-300 font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Enhanced Legend component
const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-slate-300">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// Performance Line Chart
export function PerformanceLineChart({ data, title, subtitle, height = 300 }: {
  data: any[]
  title: string
  subtitle?: string
  height?: number
}) {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-700/50 border border-slate-600/50 text-slate-200 rounded-lg px-3 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button
              size="sm"
              className="bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-600/50"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColors.primary}
              strokeWidth={2}
              dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: chartColors.primary, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Equipment Status Bar Chart
export function EquipmentStatusChart({ data, title, subtitle }: {
  data: any[]
  title: string
  subtitle?: string
}) {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-500 to-emerald-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          <Badge className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="operational"
              fill={chartColors.success}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="maintenance"
              fill={chartColors.warning}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="offline"
              fill={chartColors.danger}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Calibration Compliance Pie Chart
export function CompliancePieChart({ data, title, subtitle }: {
  data: any[]
  title: string
  subtitle?: string
}) {
  const COLORS = [chartColors.success, chartColors.warning, chartColors.danger, chartColors.info]

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-amber-500/20 border-amber-500/30 text-amber-400">
              <PieChartIcon className="h-3 w-3 mr-1" />
              {data.reduce((sum, item) => sum + item.value, 0)} Total
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// AI Insights Radar Chart
export function AIInsightsRadarChart({ data, title, subtitle }: {
  data: any[]
  title: string
  subtitle?: string
}) {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          <Badge className="bg-purple-500/20 border-purple-500/30 text-purple-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" />
            <PolarRadiusAxis stroke="#9CA3AF" />
            <Radar
              name="Performance"
              dataKey="A"
              stroke={chartColors.primary}
              fill={chartColors.primary}
              fillOpacity={0.3}
            />
            <Radar
              name="Efficiency"
              dataKey="B"
              stroke={chartColors.secondary}
              fill={chartColors.secondary}
              fillOpacity={0.3}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Activity Timeline Area Chart
export function ActivityTimelineChart({ data, title, subtitle }: {
  data: any[]
  title: string
  subtitle?: string
}) {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-cyan-500/20 border-cyan-500/30 text-cyan-400">
              <Calendar className="h-3 w-3 mr-1" />
              Timeline
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Area
              type="monotone"
              dataKey="calibrations"
              stackId="1"
              stroke={chartColors.primary}
              fill={chartColors.primary}
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="maintenance"
              stackId="1"
              stroke={chartColors.warning}
              fill={chartColors.warning}
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="inspections"
              stackId="1"
              stroke={chartColors.success}
              fill={chartColors.success}
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Multi-metric Composed Chart
export function MultiMetricChart({ data, title, subtitle }: {
  data: any[]
  title: string
  subtitle?: string
}) {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-indigo-500/20 border-indigo-500/30 text-indigo-400">
              <BarChart3 className="h-3 w-3 mr-1" />
              Multi-Metric
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Bar
              dataKey="equipment"
              fill={chartColors.primary}
              radius={[4, 4, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke={chartColors.success}
              strokeWidth={2}
            />
            <Scatter
              dataKey="anomalies"
              fill={chartColors.danger}
              stroke={chartColors.danger}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Chart wrapper with common functionality
export function ChartWrapper({ children, title, subtitle, actions }: {
  children: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

// Export all chart components
export {
  PerformanceLineChart,
  EquipmentStatusChart,
  CompliancePieChart,
  AIInsightsRadarChart,
  ActivityTimelineChart,
  MultiMetricChart,
  ChartWrapper
}
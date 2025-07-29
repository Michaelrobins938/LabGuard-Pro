'use client'

import React, { useState } from 'react'
import {
  VictoryChart,
  VictoryLine,
  VictoryArea,
  VictoryBar,
  VictoryPie,
  VictoryScatter,
  VictoryAxis,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryLegend,
  VictoryLabel,
  VictoryGroup,
  VictoryStack
} from 'victory'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity,
  Calendar,
  Target
} from 'lucide-react'

// Sample data for laboratory analytics
const calibrationData = [
  { x: 'Jan', y: 85, label: '85%' },
  { x: 'Feb', y: 88, label: '88%' },
  { x: 'Mar', y: 92, label: '92%' },
  { x: 'Apr', y: 89, label: '89%' },
  { x: 'May', y: 94, label: '94%' },
  { x: 'Jun', y: 91, label: '91%' },
  { x: 'Jul', y: 96, label: '96%' },
  { x: 'Aug', y: 93, label: '93%' }
]

const equipmentStatusData = [
  { x: 'Operational', y: 142, fill: '#10B981' },
  { x: 'Maintenance', y: 8, fill: '#F59E0B' },
  { x: 'Calibration', y: 12, fill: '#3B82F6' },
  { x: 'Offline', y: 3, fill: '#EF4444' }
]

const complianceTrendData = [
  { x: 1, y: 95, type: 'Compliance' },
  { x: 2, y: 96, type: 'Compliance' },
  { x: 3, y: 97, type: 'Compliance' },
  { x: 4, y: 98, type: 'Compliance' },
  { x: 5, y: 98.5, type: 'Compliance' },
  { x: 1, y: 85, type: 'Target' },
  { x: 2, y: 85, type: 'Target' },
  { x: 3, y: 85, type: 'Target' },
  { x: 4, y: 85, type: 'Target' },
  { x: 5, y: 85, type: 'Target' }
]

const qcPerformanceData = [
  { x: 'QC1', y: 98.5, label: '98.5%' },
  { x: 'QC2', y: 97.2, label: '97.2%' },
  { x: 'QC3', y: 99.1, label: '99.1%' },
  { x: 'QC4', y: 96.8, label: '96.8%' },
  { x: 'QC5', y: 98.9, label: '98.9%' }
]

const scatterData = [
  { x: 1, y: 2, size: 3, label: 'Sample A' },
  { x: 2, y: 3, size: 4, label: 'Sample B' },
  { x: 3, y: 5, size: 2, label: 'Sample C' },
  { x: 4, y: 4, size: 5, label: 'Sample D' },
  { x: 5, y: 6, size: 3, label: 'Sample E' }
]

const stackedData = [
  { x: 'Jan', y: 20, type: 'Passed' },
  { x: 'Feb', y: 25, type: 'Passed' },
  { x: 'Mar', y: 30, type: 'Passed' },
  { x: 'Apr', y: 28, type: 'Passed' },
  { x: 'May', y: 35, type: 'Passed' },
  { x: 'Jun', y: 32, type: 'Passed' },
  { x: 'Jan', y: 5, type: 'Failed' },
  { x: 'Feb', y: 3, type: 'Failed' },
  { x: 'Mar', y: 2, type: 'Failed' },
  { x: 'Apr', y: 4, type: 'Failed' },
  { x: 'May', y: 1, type: 'Failed' },
  { x: 'Jun', y: 3, type: 'Failed' }
]

export function VictoryCharts() {
  const [selectedChart, setSelectedChart] = useState('line')
  const [timeRange, setTimeRange] = useState('6months')

  const renderChart = () => {
    switch (selectedChart) {
      case 'line':
        return (
          <VictoryChart
            theme={VictoryTheme.material}
            height={300}
            containerComponent={
              <VictoryVoronoiContainer
                labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                labelComponent={<VictoryTooltip style={{ fontSize: 10 }} />}
              />
            }
          >
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `${t}%`}
              style={{
                axis: { stroke: '#cbd5e1' },
                grid: { stroke: '#e2e8f0', strokeDasharray: '4,4' },
                tickLabels: { fontSize: 10, fill: '#64748b' }
              }}
            />
            <VictoryAxis
              style={{
                axis: { stroke: '#cbd5e1' },
                tickLabels: { fontSize: 10, fill: '#64748b' }
              }}
            />
            <VictoryLine
              data={calibrationData}
              style={{
                data: { 
                  stroke: '#3b82f6', 
                  strokeWidth: 3,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round'
                }
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
            <VictoryScatter
              data={calibrationData}
              size={4}
              style={{
                data: { fill: '#3b82f6' }
              }}
            />
          </VictoryChart>
        )

      case 'area':
        return (
          <VictoryChart
            theme={VictoryTheme.material}
            height={300}
            containerComponent={
              <VictoryVoronoiContainer
                labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                labelComponent={<VictoryTooltip style={{ fontSize: 10 }} />}
              />
            }
          >
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `${t}%`}
              style={{
                axis: { stroke: '#cbd5e1' },
                grid: { stroke: '#e2e8f0', strokeDasharray: '4,4' },
                tickLabels: { fontSize: 10, fill: '#64748b' }
              }}
            />
            <VictoryAxis
              style={{
                axis: { stroke: '#cbd5e1' },
                tickLabels: { fontSize: 10, fill: '#64748b' }
              }}
            />
            <VictoryArea
              data={calibrationData}
              style={{
                data: { 
                  fill: 'url(#gradient)',
                  fillOpacity: 0.6,
                  stroke: '#3b82f6',
                  strokeWidth: 2
                }
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </VictoryChart>
        )

      case 'bar':
        return (
          <VictoryChart
            theme={VictoryTheme.material}
            height={300}
            domainPadding={20}
          >
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `${t}%`}
              style={{
                axis: { stroke: '#cbd5e1' },
                grid: { stroke: '#e2e8f0', strokeDasharray: '4,4' },
                tickLabels: { fontSize: 10, fill: '#64748b' }
              }}
            />
            <VictoryAxis
              style={{
                axis: { stroke: '#cbd5e1' },
                tickLabels: { fontSize: 10, fill: '#64748b' }
              }}
            />
            <VictoryBar
              data={qcPerformanceData}
              style={{
                data: {
                  fill: ({ datum }) => datum.y > 98 ? '#10b981' : datum.y > 95 ? '#f59e0b' : '#ef4444',
                  fillOpacity: 0.8
                }
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          </VictoryChart>
        )

      case 'pie':
        return (
          <VictoryPie
            data={equipmentStatusData}
            colorScale={equipmentStatusData.map(d => d.fill)}
            height={300}
            labelRadius={({ innerRadius }: { innerRadius: number }) => innerRadius + 35}
            style={{
              labels: { fontSize: 10, fill: '#374151' }
            }}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 }
            }}
            containerComponent={
              <VictoryTooltip
                style={{ fontSize: 10 }}
                flyoutStyle={{
                  stroke: '#cbd5e1',
                  fill: 'white'
                }}
              />
            }
          />
        )

      case 'scatter':
        return (
          <VictoryChart
            theme={VictoryTheme.material}
            height={300}
            containerComponent={
              <VictoryVoronoiContainer
                labels={({ datum }) => `${datum.label}: (${datum.x}, ${datum.y})`}
                labelComponent={<VictoryTooltip style={{ fontSize: 10 }} />}
              />
            }
          >
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: '#cbd5e1' },
                grid: { stroke: '#e2e8f0', strokeDasharray: '4,4' },
                tickLabels: { fontSize: 10, fill: '#64748b' }
              }}
            />
            <VictoryAxis
              style={{
                axis: { stroke: '#cbd5e1' },
                tickLabels: { fontSize: 10, fill: '#64748b' }
              }}
            />
            <VictoryScatter
              data={scatterData}
              size={({ datum }) => datum.size * 2}
              style={{
                data: { fill: '#3b82f6', fillOpacity: 0.7 }
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          </VictoryChart>
        )

      case 'stacked':
        return (
          <VictoryChart
            theme={VictoryTheme.material}
            height={300}
            domainPadding={20}
          >
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: '#cbd5e1' },
                grid: { stroke: '#e2e8f0', strokeDasharray: '4,4' },
                tickLabels: { fontSize: 10, fill: '#64748b' }
              }}
            />
            <VictoryAxis
              style={{
                axis: { stroke: '#cbd5e1' },
                tickLabels: { fontSize: 10, fill: '#64748b' }
              }}
            />
            <VictoryStack
              colorScale={['#10b981', '#ef4444']}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            >
              <VictoryBar
                data={stackedData.filter(d => d.type === 'Passed')}
                style={{
                  data: { fillOpacity: 0.8 }
                }}
              />
              <VictoryBar
                data={stackedData.filter(d => d.type === 'Failed')}
                style={{
                  data: { fillOpacity: 0.8 }
                }}
              />
            </VictoryStack>
            <VictoryLegend
              x={125}
              y={50}
              title="Test Results"
              centerTitle
              orientation="horizontal"
              gutter={20}
              style={{ border: { stroke: '#cbd5e1' }, title: { fontSize: 12 } }}
              data={[
                { name: 'Passed', symbol: { fill: '#10b981' } },
                { name: 'Failed', symbol: { fill: '#ef4444' } }
              ]}
            />
          </VictoryChart>
        )

      case 'grouped':
        return (
          <VictoryChart
            theme={VictoryTheme.material}
            height={300}
            domainPadding={20}
          >
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `${t}%`}
              style={{
                axis: { stroke: '#cbd5e1' },
                grid: { stroke: '#e2e8f0', strokeDasharray: '4,4' },
                tickLabels: { fontSize: 10, fill: '#64748b' }
              }}
            />
            <VictoryAxis
              style={{
                axis: { stroke: '#cbd5e1' },
                tickLabels: { fontSize: 10, fill: '#64748b' }
              }}
            />
            <VictoryGroup offset={20} colorScale={['#3b82f6', '#10b981']}>
              <VictoryBar
                data={complianceTrendData.filter(d => d.type === 'Compliance')}
                style={{
                  data: { fillOpacity: 0.8 }
                }}
              />
              <VictoryBar
                data={complianceTrendData.filter(d => d.type === 'Target')}
                style={{
                  data: { fillOpacity: 0.8 }
                }}
              />
            </VictoryGroup>
            <VictoryLegend
              x={125}
              y={50}
              title="Compliance vs Target"
              centerTitle
              orientation="horizontal"
              gutter={20}
              style={{ border: { stroke: '#cbd5e1' }, title: { fontSize: 12 } }}
              data={[
                { name: 'Compliance', symbol: { fill: '#3b82f6' } },
                { name: 'Target', symbol: { fill: '#10b981' } }
              ]}
            />
          </VictoryChart>
        )

      default:
        return null
    }
  }

  const getChartTitle = () => {
    switch (selectedChart) {
      case 'line': return 'Calibration Accuracy Trend'
      case 'area': return 'Compliance Rate Over Time'
      case 'bar': return 'QC Performance by Test'
      case 'pie': return 'Equipment Status Distribution'
      case 'scatter': return 'Sample Analysis Results'
      case 'stacked': return 'Test Results by Month'
      case 'grouped': return 'Compliance vs Target'
      default: return 'Analytics Chart'
    }
  }

  const getChartIcon = () => {
    switch (selectedChart) {
      case 'line': return <TrendingUp className="w-5 h-5" />
      case 'area': return <Activity className="w-5 h-5" />
      case 'bar': return <BarChart3 className="w-5 h-5" />
      case 'pie': return <PieChart className="w-5 h-5" />
      case 'scatter': return <Target className="w-5 h-5" />
      case 'stacked': return <BarChart3 className="w-5 h-5" />
      case 'grouped': return <BarChart3 className="w-5 h-5" />
      default: return <Activity className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Victory Charts Demo</h2>
          <p className="text-muted-foreground">
            Interactive charts for laboratory analytics and compliance monitoring
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Victory v37.3.6
        </Badge>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Chart Type:</span>
          <Select value={selectedChart} onValueChange={setSelectedChart}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="scatter">Scatter Plot</SelectItem>
              <SelectItem value="stacked">Stacked Bar</SelectItem>
              <SelectItem value="grouped">Grouped Bar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Time Range:</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getChartIcon()}
            <span>{getChartTitle()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            {renderChart()}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Victory Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Interactive tooltips</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Smooth animations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Responsive design</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Custom themes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Multiple chart types</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <p>• Use VictoryTheme.material for consistent styling</p>
              <p>• Add VictoryTooltip for interactive data points</p>
              <p>• Use VictoryVoronoiContainer for better hover detection</p>
              <p>• Customize colors with fill and stroke properties</p>
              <p>• Add animations with animate prop for better UX</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
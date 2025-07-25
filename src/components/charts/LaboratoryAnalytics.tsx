'use client'

import React, { useState, useEffect } from 'react'
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
  VictoryStack,
  VictoryCandlestick,
  VictoryErrorBar
} from 'victory'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Microscope,
  Beaker,
  Dna
} from 'lucide-react'

interface LaboratoryData {
  calibrations: Array<{
    date: string
    accuracy: number
    precision: number
    equipment: string
    status: 'PASS' | 'FAIL' | 'WARNING'
  }>
  qcResults: Array<{
    test: string
    mean: number
    sd: number
    cv: number
    target: number
    tolerance: number
  }>
  equipmentStatus: Array<{
    equipment: string
    status: 'OPERATIONAL' | 'MAINTENANCE' | 'CALIBRATION' | 'OFFLINE'
    lastCalibration: string
    nextCalibration: string
    uptime: number
  }>
  complianceMetrics: Array<{
    month: string
    overall: number
    equipment: number
    personnel: number
    procedures: number
    documentation: number
  }>
}

// Sample laboratory data
const sampleData: LaboratoryData = {
  calibrations: [
    { date: '2024-01-01', accuracy: 98.5, precision: 0.15, equipment: 'Spectrophotometer A', status: 'PASS' },
    { date: '2024-01-02', accuracy: 97.2, precision: 0.18, equipment: 'Centrifuge B', status: 'PASS' },
    { date: '2024-01-03', accuracy: 95.8, precision: 0.22, equipment: 'pH Meter C', status: 'WARNING' },
    { date: '2024-01-04', accuracy: 99.1, precision: 0.12, equipment: 'Balance D', status: 'PASS' },
    { date: '2024-01-05', accuracy: 94.3, precision: 0.25, equipment: 'Thermometer E', status: 'FAIL' },
    { date: '2024-01-06', accuracy: 98.7, precision: 0.14, equipment: 'Spectrophotometer A', status: 'PASS' },
    { date: '2024-01-07', accuracy: 96.9, precision: 0.19, equipment: 'Centrifuge B', status: 'PASS' },
  ],
  qcResults: [
    { test: 'Glucose', mean: 100.2, sd: 2.1, cv: 2.1, target: 100.0, tolerance: 5.0 },
    { test: 'Cholesterol', mean: 200.5, sd: 4.2, cv: 2.1, target: 200.0, tolerance: 10.0 },
    { test: 'Creatinine', mean: 1.05, sd: 0.03, cv: 2.9, target: 1.00, tolerance: 0.1 },
    { test: 'Sodium', mean: 140.8, sd: 1.8, cv: 1.3, target: 140.0, tolerance: 4.0 },
    { test: 'Potassium', mean: 4.2, sd: 0.12, cv: 2.9, target: 4.0, tolerance: 0.3 },
  ],
  equipmentStatus: [
    { equipment: 'Spectrophotometer A', status: 'OPERATIONAL', lastCalibration: '2024-01-01', nextCalibration: '2024-02-01', uptime: 98.5 },
    { equipment: 'Centrifuge B', status: 'OPERATIONAL', lastCalibration: '2024-01-02', nextCalibration: '2024-02-02', uptime: 97.2 },
    { equipment: 'pH Meter C', status: 'CALIBRATION', lastCalibration: '2024-01-03', nextCalibration: '2024-02-03', uptime: 95.8 },
    { equipment: 'Balance D', status: 'OPERATIONAL', lastCalibration: '2024-01-04', nextCalibration: '2024-02-04', uptime: 99.1 },
    { equipment: 'Thermometer E', status: 'MAINTENANCE', lastCalibration: '2024-01-05', nextCalibration: '2024-02-05', uptime: 94.3 },
  ],
  complianceMetrics: [
    { month: 'Jan', overall: 98.5, equipment: 99.2, personnel: 97.8, procedures: 98.9, documentation: 98.1 },
    { month: 'Feb', overall: 98.8, equipment: 99.5, personnel: 98.1, procedures: 99.2, documentation: 98.4 },
    { month: 'Mar', overall: 99.1, equipment: 99.8, personnel: 98.5, procedures: 99.5, documentation: 98.7 },
    { month: 'Apr', overall: 99.3, equipment: 99.9, personnel: 98.8, procedures: 99.7, documentation: 98.9 },
    { month: 'May', overall: 99.5, equipment: 99.9, personnel: 99.1, procedures: 99.8, documentation: 99.1 },
    { month: 'Jun', overall: 99.7, equipment: 99.9, personnel: 99.3, procedures: 99.9, documentation: 99.3 },
  ]
}

export function LaboratoryAnalytics() {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('6months')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
      case 'OPERATIONAL':
        return '#10B981'
      case 'WARNING':
      case 'CALIBRATION':
        return '#F59E0B'
      case 'FAIL':
      case 'MAINTENANCE':
      case 'OFFLINE':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
      case 'OPERATIONAL':
        return <CheckCircle className="w-4 h-4" />
      case 'WARNING':
      case 'CALIBRATION':
        return <Clock className="w-4 h-4" />
      case 'FAIL':
      case 'MAINTENANCE':
      case 'OFFLINE':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Laboratory Analytics</h2>
          <p className="text-muted-foreground">
            Advanced data visualization for laboratory compliance and quality control
          </p>
        </div>
        <div className="flex items-center space-x-4">
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
          <Badge variant="outline" className="text-sm">
            Real-time Data
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="calibrations" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Calibrations
          </TabsTrigger>
          <TabsTrigger value="qc" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            QC Results
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Microscope className="h-4 w-4" />
            Equipment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Compliance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Compliance Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VictoryChart
                theme={VictoryTheme.material}
                height={300}
                containerComponent={
                  <VictoryVoronoiContainer
                    labels={({ datum }) => `${datum.month}: ${datum.overall}%`}
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
                <VictoryGroup colorScale={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']}>
                  <VictoryLine
                    data={sampleData.complianceMetrics}
                    y="overall"
                    style={{
                      data: { strokeWidth: 3 }
                    }}
                    animate={{
                      duration: 2000,
                      onLoad: { duration: 1000 }
                    }}
                  />
                  <VictoryLine
                    data={sampleData.complianceMetrics}
                    y="equipment"
                    style={{
                      data: { strokeWidth: 2, strokeDasharray: '5,5' }
                    }}
                  />
                  <VictoryLine
                    data={sampleData.complianceMetrics}
                    y="personnel"
                    style={{
                      data: { strokeWidth: 2, strokeDasharray: '5,5' }
                    }}
                  />
                  <VictoryLine
                    data={sampleData.complianceMetrics}
                    y="procedures"
                    style={{
                      data: { strokeWidth: 2, strokeDasharray: '5,5' }
                    }}
                  />
                  <VictoryLine
                    data={sampleData.complianceMetrics}
                    y="documentation"
                    style={{
                      data: { strokeWidth: 2, strokeDasharray: '5,5' }
                    }}
                  />
                </VictoryGroup>
                <VictoryLegend
                  x={125}
                  y={50}
                  title="Compliance Areas"
                  centerTitle
                  orientation="horizontal"
                  gutter={20}
                  style={{ border: { stroke: '#cbd5e1' }, title: { fontSize: 12 } }}
                  data={[
                    { name: 'Overall', symbol: { fill: '#3b82f6' } },
                    { name: 'Equipment', symbol: { fill: '#10b981' } },
                    { name: 'Personnel', symbol: { fill: '#f59e0b' } },
                    { name: 'Procedures', symbol: { fill: '#8b5cf6' } },
                    { name: 'Documentation', symbol: { fill: '#ef4444' } }
                  ]}
                />
              </VictoryChart>
            </CardContent>
          </Card>

          {/* Equipment Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Equipment Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VictoryPie
                  data={sampleData.equipmentStatus}
                  x="equipment"
                  y="uptime"
                  colorScale={sampleData.equipmentStatus.map(d => getStatusColor(d.status))}
                  height={250}
                  labelRadius={({ innerRadius }: { innerRadius: number }) => innerRadius + 25}
                  style={{
                    labels: { fontSize: 8, fill: '#374151' }
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>QC Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VictoryChart
                  theme={VictoryTheme.material}
                  height={250}
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
                      tickLabels: { fontSize: 8, fill: '#64748b' }
                    }}
                  />
                  <VictoryBar
                    data={sampleData.qcResults}
                    x="test"
                    y="cv"
                    style={{
                      data: {
                        fill: ({ datum }) => datum.cv < 2 ? '#10b981' : datum.cv < 5 ? '#f59e0b' : '#ef4444',
                        fillOpacity: 0.8
                      }
                    }}
                    animate={{
                      duration: 2000,
                      onLoad: { duration: 1000 }
                    }}
                  />
                </VictoryChart>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calibrations" className="space-y-6">
          {/* Calibration Accuracy Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Calibration Accuracy Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VictoryChart
                theme={VictoryTheme.material}
                height={300}
                containerComponent={
                  <VictoryVoronoiContainer
                    labels={({ datum }) => `${datum.equipment}: ${datum.accuracy}%`}
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
                    tickLabels: { fontSize: 8, fill: '#64748b' }
                  }}
                />
                <VictoryScatter
                  data={sampleData.calibrations}
                  x="date"
                  y="accuracy"
                  size={({ datum }) => datum.status === 'FAIL' ? 8 : 4}
                  style={{
                    data: {
                      fill: ({ datum }) => getStatusColor(datum.status),
                      fillOpacity: 0.8
                    }
                  }}
                  animate={{
                    duration: 2000,
                    onLoad: { duration: 1000 }
                  }}
                />
                <VictoryLine
                  data={sampleData.calibrations}
                  x="date"
                  y="accuracy"
                  style={{
                    data: {
                      stroke: '#3b82f6',
                      strokeWidth: 2,
                      strokeDasharray: '5,5'
                    }
                  }}
                />
              </VictoryChart>
            </CardContent>
          </Card>

          {/* Calibration Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['PASS', 'WARNING', 'FAIL'].map((status) => {
              const count = sampleData.calibrations.filter(c => c.status === status).length
              const percentage = (count / sampleData.calibrations.length) * 100
              
              return (
                <Card key={status}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        <span className="text-sm font-medium">{status}</span>
                      </div>
                      <Badge variant="outline" style={{ color: getStatusColor(status) }}>
                        {percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-xs text-muted-foreground">calibrations</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="qc" className="space-y-6">
          {/* QC Results with Error Bars */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>QC Results with Precision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                <VictoryBar
                  data={sampleData.qcResults}
                  x="test"
                  y="mean"
                  style={{
                    data: {
                      fill: '#3b82f6',
                      fillOpacity: 0.8
                    }
                  }}
                  animate={{
                    duration: 2000,
                    onLoad: { duration: 1000 }
                  }}
                />
                <VictoryErrorBar
                  data={sampleData.qcResults}
                  x="test"
                  y="mean"
                  errorX={0}
                  errorY="sd"
                  style={{
                    data: {
                      stroke: '#ef4444',
                      strokeWidth: 2
                    }
                  }}
                />
              </VictoryChart>
            </CardContent>
          </Card>

          {/* QC Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>QC Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Test</th>
                      <th className="text-left p-2">Mean</th>
                      <th className="text-left p-2">SD</th>
                      <th className="text-left p-2">CV (%)</th>
                      <th className="text-left p-2">Target</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.qcResults.map((qc, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{qc.test}</td>
                        <td className="p-2">{qc.mean}</td>
                        <td className="p-2">{qc.sd}</td>
                        <td className="p-2">{qc.cv}</td>
                        <td className="p-2">{qc.target}</td>
                        <td className="p-2">
                          <Badge 
                            variant="outline" 
                            style={{ 
                              color: qc.cv < 2 ? '#10b981' : qc.cv < 5 ? '#f59e0b' : '#ef4444' 
                            }}
                          >
                            {qc.cv < 2 ? 'Excellent' : qc.cv < 5 ? 'Good' : 'Poor'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          {/* Equipment Uptime */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Microscope className="w-5 h-5" />
                <span>Equipment Uptime</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                    tickLabels: { fontSize: 8, fill: '#64748b' }
                  }}
                />
                <VictoryBar
                  data={sampleData.equipmentStatus}
                  x="equipment"
                  y="uptime"
                  style={{
                    data: {
                      fill: ({ datum }) => getStatusColor(datum.status),
                      fillOpacity: 0.8
                    }
                  }}
                  animate={{
                    duration: 2000,
                    onLoad: { duration: 1000 }
                  }}
                />
              </VictoryChart>
            </CardContent>
          </Card>

          {/* Equipment Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleData.equipmentStatus.map((equipment, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{equipment.equipment}</h4>
                    <Badge variant="outline" style={{ color: getStatusColor(equipment.status) }}>
                      {equipment.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Uptime: {equipment.uptime}%</div>
                    <div>Last Cal: {equipment.lastCalibration}</div>
                    <div>Next Cal: {equipment.nextCalibration}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
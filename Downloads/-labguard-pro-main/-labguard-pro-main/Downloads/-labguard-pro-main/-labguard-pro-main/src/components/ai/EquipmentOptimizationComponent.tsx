'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Settings, 
  Upload, 
  Play, 
  Download, 
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Brain,
  Eye,
  Activity,
  Clock,
  Zap,
  Gauge,
  Wrench
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface EquipmentOptimizationResult {
  id: string
  equipmentId: string
  optimizationType: string
  results: {
    efficiency: number
    recommendations: string[]
    maintenanceSchedule: string[]
    performanceMetrics: {
      uptime: number
      accuracy: number
      throughput: number
      energyEfficiency: number
    }
    costSavings: {
      estimated: number
      breakdown: string[]
    }
    alerts: string[]
  }
  metadata: {
    analysisDate: Date
    dataPoints: number
    timeRange: string
  }
}

const optimizationTypes = [
  { value: 'CALIBRATION', label: 'Calibration Schedule', icon: <Gauge className="w-4 h-4" /> },
  { value: 'MAINTENANCE', label: 'Maintenance Planning', icon: <Wrench className="w-4 h-4" /> },
  { value: 'USAGE', label: 'Usage Optimization', icon: <Activity className="w-4 h-4" /> },
  { value: 'PERFORMANCE', label: 'Performance Analysis', icon: <TrendingUp className="w-4 h-4" /> }
]

export function EquipmentOptimizationComponent() {
  const { data: session } = useSession()
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState<EquipmentOptimizationResult | null>(null)
  const [error, setError] = useState('')

  // Form state
  const [equipmentId, setEquipmentId] = useState('')
  const [optimizationType, setOptimizationType] = useState('')
  const [usageData, setUsageData] = useState('')

  const handleOptimizeEquipment = async () => {
    if (!equipmentId || !optimizationType || !usageData) {
      setError('Please fill in all required fields')
      return
    }

    setIsOptimizing(true)
    setError('')

    try {
      const response = await fetch('/api/biomni/equipment/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.id}`
        },
        body: JSON.stringify({
          equipmentId,
          usageData: JSON.parse(usageData)
        })
      })

      if (response.ok) {
        const result = await response.json()
        setOptimizationResult(result)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Equipment optimization failed')
      }
    } catch (error) {
      setError('Failed to optimize equipment. Please try again.')
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleExportResults = () => {
    if (!optimizationResult) return

    const resultsText = `
# Equipment Optimization Report

## Equipment Details
- **Equipment ID:** ${optimizationResult.equipmentId}
- **Optimization Type:** ${optimizationResult.optimizationType}
- **Analysis Date:** ${new Date(optimizationResult.metadata.analysisDate).toLocaleDateString()}
- **Data Points:** ${optimizationResult.metadata.dataPoints}
- **Time Range:** ${optimizationResult.metadata.timeRange}

## Performance Metrics
- **Efficiency:** ${optimizationResult.results.efficiency}%
- **Uptime:** ${optimizationResult.results.performanceMetrics.uptime}%
- **Accuracy:** ${optimizationResult.results.performanceMetrics.accuracy}%
- **Throughput:** ${optimizationResult.results.performanceMetrics.throughput}%
- **Energy Efficiency:** ${optimizationResult.results.performanceMetrics.energyEfficiency}%

## Recommendations
${optimizationResult.results.recommendations.map(rec => `- ${rec}`).join('\n')}

## Maintenance Schedule
${optimizationResult.results.maintenanceSchedule.map(schedule => `- ${schedule}`).join('\n')}

## Cost Savings
- **Estimated Savings:** $${optimizationResult.results.costSavings.estimated}
- **Breakdown:**
${optimizationResult.results.costSavings.breakdown.map(item => `  - ${item}`).join('\n')}

## Alerts
${optimizationResult.results.alerts.length > 0 
  ? optimizationResult.results.alerts.map(alert => `- ${alert}`).join('\n')
  : 'No alerts'
}
    `.trim()

    const blob = new Blob([resultsText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `equipment_optimization_${optimizationResult.equipmentId}_${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600'
    if (efficiency >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipment Optimization</h2>
          <p className="text-gray-600 mt-1">
            Optimize equipment usage and calibration with AI
          </p>
        </div>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          <Brain className="w-4 h-4 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Equipment Details</span>
            </CardTitle>
            <CardDescription>
              Enter equipment information and usage data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="equipment-id">Equipment ID *</Label>
              <Input
                id="equipment-id"
                placeholder="e.g., MIC-001, PCR-002, SEQ-003"
                value={equipmentId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEquipmentId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="optimization-type">Optimization Type *</Label>
              <Select value={optimizationType} onValueChange={setOptimizationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select optimization type" />
                </SelectTrigger>
                <SelectContent>
                  {optimizationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        {type.icon}
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usage-data">Usage Data (JSON) *</Label>
              <Textarea
                id="usage-data"
                placeholder='{"uptime": 85, "accuracy": 92, "maintenance_history": [...]}'
                rows={6}
                value={usageData}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUsageData(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Data</span>
              </Button>
              <Button 
                onClick={handleOptimizeEquipment}
                disabled={!equipmentId || !optimizationType || !usageData || isOptimizing}
                className="flex items-center space-x-2"
              >
                {isOptimizing ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>Optimize Equipment</span>
                  </>
                )}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Optimization Preview</span>
            </CardTitle>
            <CardDescription>
              Preview the optimization results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {optimizationResult ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Equipment {optimizationResult.equipmentId}</h3>
                  <p className="text-sm text-gray-600">
                    {optimizationResult.optimizationType} optimization completed
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{optimizationResult.optimizationType}</Badge>
                    <Badge className={getEfficiencyColor(optimizationResult.results.efficiency)}>
                      {optimizationResult.results.efficiency}% Efficient
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${getEfficiencyColor(optimizationResult.results.efficiency)}`}>
                      {optimizationResult.results.efficiency}%
                    </div>
                    <div className="text-sm text-gray-600">Efficiency</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${optimizationResult.results.costSavings.estimated}
                    </div>
                    <div className="text-sm text-gray-600">Est. Savings</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                      <div className="flex justify-between">
                        <span>Uptime:</span>
                        <span className="font-medium">{optimizationResult.results.performanceMetrics.uptime}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accuracy:</span>
                        <span className="font-medium">{optimizationResult.results.performanceMetrics.accuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Throughput:</span>
                        <span className="font-medium">{optimizationResult.results.performanceMetrics.throughput}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Energy:</span>
                        <span className="font-medium">{optimizationResult.results.performanceMetrics.energyEfficiency}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm">Top Recommendations</h4>
                    <div className="space-y-1 mt-1">
                      {optimizationResult.results.recommendations.slice(0, 2).map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleExportResults}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-2" />
                  <p>No optimization results yet</p>
                  <p className="text-sm">Enter equipment data and click optimize</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      {optimizationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Detailed Optimization</span>
            </CardTitle>
            <CardDescription>
              Comprehensive optimization analysis and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recommendations" className="space-y-4">
              <TabsList>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="savings">Cost Savings</TabsTrigger>
              </TabsList>

              <TabsContent value="recommendations" className="space-y-4">
                <div className="space-y-4">
                  {optimizationResult.results.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Recommendation {index + 1}</h4>
                        <p className="text-sm text-gray-600">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="maintenance" className="space-y-4">
                <div className="space-y-4">
                  {optimizationResult.results.maintenanceSchedule.map((schedule, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <Wrench className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Maintenance Task {index + 1}</h4>
                        <p className="text-sm text-gray-600">{schedule}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Uptime:</span>
                        <span className="text-sm font-medium">{optimizationResult.results.performanceMetrics.uptime}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Accuracy:</span>
                        <span className="text-sm font-medium">{optimizationResult.results.performanceMetrics.accuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Throughput:</span>
                        <span className="text-sm font-medium">{optimizationResult.results.performanceMetrics.throughput}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Energy Efficiency:</span>
                        <span className="text-sm font-medium">{optimizationResult.results.performanceMetrics.energyEfficiency}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Alerts</h4>
                    <div className="space-y-2">
                      {optimizationResult.results.alerts.length > 0 ? (
                        optimizationResult.results.alerts.map((alert, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                            <span>{alert}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>No alerts</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="savings" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Estimated Cost Savings</h4>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      ${optimizationResult.results.costSavings.estimated}
                    </div>
                    <p className="text-sm text-green-700">
                      Based on current usage patterns and optimization recommendations
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Savings Breakdown</h4>
                    <div className="space-y-2">
                      {optimizationResult.results.costSavings.breakdown.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
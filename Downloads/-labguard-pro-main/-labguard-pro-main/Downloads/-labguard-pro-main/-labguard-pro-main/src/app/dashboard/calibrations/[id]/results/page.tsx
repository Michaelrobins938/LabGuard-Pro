'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  AlertTriangle, 
  Brain, 
  Download, 
  Share2, 
  FileText,
  TrendingUp,
  Target,
  Shield,
  Activity,
  Clock,
  User,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  AlertCircle,
  Lightbulb,
  Sparkles,
  Award,
  Zap
} from 'lucide-react'
import { format } from 'date-fns'

interface CalibrationResult {
  id: string
  equipmentId: string
  equipmentName: string
  equipmentModel: string
  calibrationType: string
  status: 'completed' | 'failed' | 'passed_with_conditions'
  completionDate: string
  performedBy: string
  totalDuration: number
  steps: CalibrationStep[]
  aiAnalysis: AiAnalysis
  complianceScore: number
  recommendations: string[]
  nextCalibrationDate: string
}

interface CalibrationStep {
  id: string
  title: string
  status: 'completed' | 'failed'
  duration: number
  measurements: Measurement[]
  aiValidation: AiValidation
}

interface Measurement {
  id: string
  parameter: string
  expectedValue: string
  actualValue: string
  unit: string
  tolerance: string
  status: 'pass' | 'fail'
  deviation: number
}

interface AiValidation {
  status: 'passed' | 'failed' | 'passed_with_conditions'
  confidence: number
  insights: string[]
  recommendations: string[]
  issues: string[]
}

interface AiAnalysis {
  overallStatus: 'excellent' | 'good' | 'acceptable' | 'needs_attention' | 'failed'
  complianceScore: number
  performanceMetrics: {
    accuracy: number
    precision: number
    linearity: number
    stability: number
  }
  keyFindings: string[]
  riskAssessment: {
    level: 'low' | 'medium' | 'high'
    factors: string[]
  }
  recommendations: string[]
  nextSteps: string[]
}

export default function CalibrationResultsPage() {
  const params = useParams()
  const router = useRouter()
  const calibrationId = params.id as string
  
  const [result, setResult] = useState<CalibrationResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState(false)

  useEffect(() => {
    fetchCalibrationResults()
  }, [calibrationId])

  const fetchCalibrationResults = async () => {
    try {
      // Mock data - replace with API call
      const mockResult: CalibrationResult = {
        id: calibrationId,
        equipmentId: 'eq-001',
        equipmentName: 'Centrifuge #1',
        equipmentModel: 'Eppendorf 5810R',
        calibrationType: 'ROUTINE',
        status: 'completed',
        completionDate: '2024-02-15T14:30:00Z',
        performedBy: 'Dr. Sarah Johnson',
        totalDuration: 120,
        nextCalibrationDate: '2024-05-15T10:00:00Z',
        complianceScore: 95,
        recommendations: [
          'Equipment is performing within acceptable parameters',
          'Continue with normal operation',
          'Monitor rotor condition for wear',
          'Schedule next calibration in 3 months'
        ],
        steps: [
          {
            id: 'step-1',
            title: 'Pre-calibration Inspection',
            status: 'completed',
            duration: 15,
            measurements: [
              {
                id: 'meas-1',
                parameter: 'Visual Inspection',
                expectedValue: 'No visible damage',
                actualValue: 'No visible damage',
                unit: 'Pass/Fail',
                tolerance: 'Pass',
                status: 'pass',
                deviation: 0
              }
            ],
            aiValidation: {
              status: 'passed',
              confidence: 0.95,
              insights: ['Equipment shows normal wear patterns', 'No safety concerns detected'],
              recommendations: ['Proceed with calibration', 'Monitor rotor condition'],
              issues: []
            }
          },
          {
            id: 'step-2',
            title: 'Speed Calibration',
            status: 'completed',
            duration: 30,
            measurements: [
              {
                id: 'meas-2',
                parameter: '1000 RPM',
                expectedValue: '1000 ± 50',
                actualValue: '995',
                unit: 'RPM',
                tolerance: '±50',
                status: 'pass',
                deviation: -5
              },
              {
                id: 'meas-3',
                parameter: '5000 RPM',
                expectedValue: '5000 ± 100',
                actualValue: '4980',
                unit: 'RPM',
                tolerance: '±100',
                status: 'pass',
                deviation: -20
              }
            ],
            aiValidation: {
              status: 'passed',
              confidence: 0.92,
              insights: ['Speed accuracy is within acceptable limits', 'Minor deviations are normal'],
              recommendations: ['Continue with normal operation', 'Monitor for drift over time'],
              issues: []
            }
          },
          {
            id: 'step-3',
            title: 'Temperature Calibration',
            status: 'completed',
            duration: 45,
            measurements: [
              {
                id: 'meas-4',
                parameter: 'Temperature Stability',
                expectedValue: '±0.5°C',
                actualValue: '±0.3°C',
                unit: '°C',
                tolerance: '±0.5',
                status: 'pass',
                deviation: -0.2
              }
            ],
            aiValidation: {
              status: 'passed',
              confidence: 0.98,
              insights: ['Temperature control is excellent', 'Stability exceeds requirements'],
              recommendations: ['No action required', 'System performing optimally'],
              issues: []
            }
          },
          {
            id: 'step-4',
            title: 'Final Validation',
            status: 'completed',
            duration: 20,
            measurements: [
              {
                id: 'meas-5',
                parameter: 'Overall Performance',
                expectedValue: 'Pass',
                actualValue: 'Pass',
                unit: 'Pass/Fail',
                tolerance: 'Pass',
                status: 'pass',
                deviation: 0
              }
            ],
            aiValidation: {
              status: 'passed',
              confidence: 0.96,
              insights: ['All systems operational', 'Calibration successful'],
              recommendations: ['Equipment ready for use', 'Update calibration records'],
              issues: []
            }
          }
        ],
        aiAnalysis: {
          overallStatus: 'excellent',
          complianceScore: 95,
          performanceMetrics: {
            accuracy: 98.5,
            precision: 97.2,
            linearity: 99.1,
            stability: 96.8
          },
          keyFindings: [
            'Equipment meets all calibration requirements',
            'Performance exceeds minimum standards',
            'No corrective actions required',
            'Equipment is suitable for continued use'
          ],
          riskAssessment: {
            level: 'low',
            factors: [
              'All measurements within tolerance',
              'No safety concerns identified',
              'Equipment in good condition'
            ]
          },
          recommendations: [
            'Continue with normal operation',
            'Schedule next calibration in 3 months',
            'Monitor for any performance changes',
            'Maintain regular maintenance schedule'
          ],
          nextSteps: [
            'Update equipment calibration records',
            'Notify relevant personnel of completion',
            'Schedule next calibration',
            'Monitor equipment performance'
          ]
        }
      }
      
      setResult(mockResult)
    } catch (error) {
      console.error('Failed to fetch calibration results:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    setGeneratingReport(true)
    
    try {
      const response = await fetch(`/api/calibrations/${calibrationId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `calibration-report-${calibrationId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to download report:', error)
    } finally {
      setGeneratingReport(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'passed':
      case 'excellent':
        return 'text-green-400'
      case 'failed':
        return 'text-red-400'
      case 'passed_with_conditions':
      case 'good':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusBadge = (status: string) => {
    const badgeStyles: Record<string, string> = {
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      passed: 'bg-green-500/20 text-green-400 border-green-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
      excellent: 'bg-green-500/20 text-green-400 border-green-500/30',
      good: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      acceptable: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      needs_attention: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    }
    
    return badgeStyles[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading calibration results...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Results Not Found</h2>
        <p className="text-gray-400">The calibration results could not be found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calibration Results</h1>
          <p className="text-gray-400 mt-2">
            {result.equipmentName} - {result.calibrationType} Calibration
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusBadge(result.status)}>
            {result.status.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Brain className="w-3 h-3 mr-1" />
            AI Enhanced
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Compliance Score</p>
                <p className="text-2xl font-bold text-white">{result.complianceScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-2xl font-bold text-white">{result.totalDuration} min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Performed By</p>
                <p className="text-lg font-medium text-white">{result.performedBy}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Next Due</p>
                <p className="text-lg font-medium text-white">
                  {format(new Date(result.nextCalibrationDate), 'MMM dd')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Analysis Summary */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Analysis Summary</span>
                <Badge className={getStatusBadge(result.aiAnalysis.overallStatus)}>
                  {result.aiAnalysis.overallStatus.replace('_', ' ')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div>
                <h4 className="font-medium text-white mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {result.aiAnalysis.performanceMetrics.accuracy}%
                    </div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {result.aiAnalysis.performanceMetrics.precision}%
                    </div>
                    <div className="text-sm text-gray-400">Precision</div>
                  </div>
                  <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">
                      {result.aiAnalysis.performanceMetrics.linearity}%
                    </div>
                    <div className="text-sm text-gray-400">Linearity</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">
                      {result.aiAnalysis.performanceMetrics.stability}%
                    </div>
                    <div className="text-sm text-gray-400">Stability</div>
                  </div>
                </div>
              </div>

              {/* Key Findings */}
              <div>
                <h4 className="font-medium text-white mb-3 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                  Key Findings
                </h4>
                <div className="space-y-2">
                  {result.aiAnalysis.keyFindings.map((finding, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-500/10 rounded">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-300">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Assessment */}
              <div>
                <h4 className="font-medium text-white mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-red-400" />
                  Risk Assessment
                </h4>
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-300">Risk Level</span>
                    <Badge 
                      variant="outline" 
                      className={
                        result.aiAnalysis.riskAssessment.level === 'low' ? 'border-green-500 text-green-400' :
                        result.aiAnalysis.riskAssessment.level === 'medium' ? 'border-yellow-500 text-yellow-400' :
                        'border-red-500 text-red-400'
                      }
                    >
                      {result.aiAnalysis.riskAssessment.level.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {result.aiAnalysis.riskAssessment.factors.map((factor, index) => (
                      <div key={index} className="text-xs text-red-200">• {factor}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Steps */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <span>Calibration Steps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.steps.map((step, index) => (
                  <div key={step.id} className="border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white">Step {index + 1}</span>
                        <h4 className="font-medium text-gray-200">{step.title}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusBadge(step.status)}>
                          {step.status}
                        </Badge>
                        <span className="text-xs text-gray-400">{step.duration} min</span>
                      </div>
                    </div>

                    {/* Measurements */}
                    <div className="space-y-2 mb-3">
                      {step.measurements.map((measurement) => (
                        <div key={measurement.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <span className="text-sm text-gray-300">{measurement.parameter}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400">{measurement.actualValue}</span>
                            <Badge 
                              variant="outline" 
                              className={
                                measurement.status === 'pass' ? 'border-green-500 text-green-400' :
                                'border-red-500 text-red-400'
                              }
                            >
                              {measurement.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Validation */}
                    {step.aiValidation && (
                      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-purple-300">AI Validation</span>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusBadge(step.aiValidation.status)}>
                              {step.aiValidation.status}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {Math.round(step.aiValidation.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                        {step.aiValidation.insights.length > 0 && (
                          <div className="text-xs text-purple-200">
                            {step.aiValidation.insights[0]}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recommendations */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-green-400" />
                <span>Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.aiAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-green-500/10 rounded">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-300">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span>Next Steps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.aiAnalysis.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-blue-500/10 rounded">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={handleDownloadReport}
                disabled={generatingReport}
                className="w-full"
              >
                {generatingReport ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                View Certificate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
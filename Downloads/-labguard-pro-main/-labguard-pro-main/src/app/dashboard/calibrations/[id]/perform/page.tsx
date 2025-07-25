'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Brain, 
  Sparkles,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Save,
  Upload,
  Camera,
  FileText,
  Target,
  Zap,
  Lightbulb,
  Shield,
  Activity
} from 'lucide-react'
import { format } from 'date-fns'

interface CalibrationStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  duration: number // minutes
  criticalPoints: string[]
  safetyNotes: string[]
  measurements: Measurement[]
  aiValidation: AiValidation | null
}

interface Measurement {
  id: string
  parameter: string
  expectedValue: string
  actualValue: string
  unit: string
  tolerance: string
  status: 'pending' | 'pass' | 'fail'
  notes: string
}

interface AiValidation {
  status: 'pending' | 'validating' | 'passed' | 'failed'
  confidence: number
  insights: string[]
  recommendations: string[]
  issues: string[]
}

interface CalibrationData {
  id: string
  equipmentId: string
  equipmentName: string
  equipmentModel: string
  calibrationType: string
  scheduledDate: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'failed'
  progress: number
  currentStep: number
  totalSteps: number
  steps: CalibrationStep[]
  assignedTo: string
  description: string
  aiOptimization: boolean
}

export default function PerformCalibrationPage() {
  const params = useParams()
  const router = useRouter()
  const calibrationId = params.id as string
  
  const [calibration, setCalibration] = useState<CalibrationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [stepData, setStepData] = useState<any>({})
  const [aiValidating, setAiValidating] = useState(false)

  useEffect(() => {
    fetchCalibrationData()
  }, [calibrationId])

  const fetchCalibrationData = async () => {
    try {
      // Mock data - replace with API call
      const mockCalibration: CalibrationData = {
        id: calibrationId,
        equipmentId: 'eq-001',
        equipmentName: 'Centrifuge #1',
        equipmentModel: 'Eppendorf 5810R',
        calibrationType: 'ROUTINE',
        scheduledDate: '2024-02-15T10:00:00Z',
        status: 'in-progress',
        progress: 25,
        currentStep: 1,
        totalSteps: 4,
        assignedTo: 'Dr. Sarah Johnson',
        description: 'Routine calibration of centrifuge for optimal performance',
        aiOptimization: true,
        steps: [
          {
            id: 'step-1',
            title: 'Pre-calibration Inspection',
            description: 'Inspect equipment for any visible damage or wear',
            status: 'completed',
            duration: 15,
            criticalPoints: [
              'Check for any loose parts or damage',
              'Verify power supply and connections',
              'Inspect rotor for wear or damage'
            ],
            safetyNotes: [
              'Ensure equipment is powered off before inspection',
              'Wear appropriate PPE during inspection'
            ],
            measurements: [
              {
                id: 'meas-1',
                parameter: 'Visual Inspection',
                expectedValue: 'No visible damage',
                actualValue: 'No visible damage',
                unit: 'Pass/Fail',
                tolerance: 'Pass',
                status: 'pass',
                notes: 'Equipment appears in good condition'
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
            description: 'Calibrate centrifuge speed settings',
            status: 'in-progress',
            duration: 30,
            criticalPoints: [
              'Use calibrated tachometer',
              'Test multiple speed settings',
              'Record all measurements accurately'
            ],
            safetyNotes: [
              'Ensure rotor is properly balanced',
              'Start with lowest speed setting',
              'Monitor for unusual vibrations'
            ],
            measurements: [
              {
                id: 'meas-2',
                parameter: '1000 RPM',
                expectedValue: '1000 ± 50',
                actualValue: '995',
                unit: 'RPM',
                tolerance: '±50',
                status: 'pass',
                notes: 'Within acceptable range'
              },
              {
                id: 'meas-3',
                parameter: '5000 RPM',
                expectedValue: '5000 ± 100',
                actualValue: '4980',
                unit: 'RPM',
                tolerance: '±100',
                status: 'pass',
                notes: 'Within acceptable range'
              }
            ],
            aiValidation: null
          },
          {
            id: 'step-3',
            title: 'Temperature Calibration',
            description: 'Calibrate temperature control system',
            status: 'pending',
            duration: 45,
            criticalPoints: [
              'Use calibrated thermometer',
              'Test temperature stability',
              'Verify temperature uniformity'
            ],
            safetyNotes: [
              'Allow sufficient warm-up time',
              'Monitor for temperature fluctuations',
              'Check for proper ventilation'
            ],
            measurements: [],
            aiValidation: null
          },
          {
            id: 'step-4',
            title: 'Final Validation',
            description: 'Perform final validation tests',
            status: 'pending',
            duration: 20,
            criticalPoints: [
              'Run complete test cycle',
              'Verify all systems operational',
              'Document all results'
            ],
            safetyNotes: [
              'Follow manufacturer guidelines',
              'Ensure proper documentation',
              'Update calibration records'
            ],
            measurements: [],
            aiValidation: null
          }
        ]
      }
      
      setCalibration(mockCalibration)
      setCurrentStepIndex(mockCalibration.currentStep - 1)
    } catch (error) {
      console.error('Failed to fetch calibration data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStepComplete = async (stepIndex: number) => {
    if (!calibration) return

    const updatedSteps = [...calibration.steps]
    updatedSteps[stepIndex].status = 'completed'
    
    // Update progress
    const completedSteps = updatedSteps.filter(step => step.status === 'completed').length
    const newProgress = (completedSteps / updatedSteps.length) * 100
    
    setCalibration({
      ...calibration,
      steps: updatedSteps,
      progress: newProgress,
      currentStep: stepIndex + 2
    })

    // Move to next step
    if (stepIndex < updatedSteps.length - 1) {
      setCurrentStepIndex(stepIndex + 1)
      updatedSteps[stepIndex + 1].status = 'in-progress'
    }

    // AI validation for completed step
    if (calibration.aiOptimization) {
      await validateStepWithAI(updatedSteps[stepIndex])
    }
  }

  const validateStepWithAI = async (step: CalibrationStep) => {
    setAiValidating(true)
    
    try {
      const response = await fetch('/api/biomni/validate-calibration-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stepId: step.id,
          stepTitle: step.title,
          measurements: step.measurements,
          equipmentId: calibration?.equipmentId,
          equipmentType: calibration?.equipmentModel
        })
      })

      if (response.ok) {
        const validation = await response.json()
        
        // Update step with AI validation
        const updatedSteps = calibration?.steps.map(s => 
          s.id === step.id ? { ...s, aiValidation: validation } : s
        )
        
        setCalibration(prev => prev ? { ...prev, steps: updatedSteps || [] } : null)
      }
    } catch (error) {
      console.error('AI validation failed:', error)
    } finally {
      setAiValidating(false)
    }
  }

  const handleMeasurementUpdate = (stepIndex: number, measurementIndex: number, value: string) => {
    if (!calibration) return

    const updatedSteps = [...calibration.steps]
    const step = updatedSteps[stepIndex]
    const measurement = step.measurements[measurementIndex]
    
    measurement.actualValue = value
    measurement.status = 'pending' // Reset status for re-validation
    
    setCalibration({
      ...calibration,
      steps: updatedSteps
    })
  }

  const handleCalibrationComplete = async () => {
    if (!calibration) return

    try {
      const response = await fetch(`/api/calibrations/${calibrationId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          finalResults: calibration.steps,
          completionTime: new Date().toISOString()
        })
      })

      if (response.ok) {
        router.push(`/dashboard/calibrations/${calibrationId}/results`)
      }
    } catch (error) {
      console.error('Failed to complete calibration:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading calibration workflow...</p>
        </div>
      </div>
    )
  }

  if (!calibration) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Calibration Not Found</h2>
        <p className="text-gray-400">The requested calibration could not be found.</p>
      </div>
    )
  }

  const currentStep = calibration.steps[currentStepIndex]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Perform Calibration</h1>
          <p className="text-gray-400 mt-2">
            {calibration.equipmentName} - {calibration.calibrationType} Calibration
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Activity className="w-3 h-3 mr-1" />
            Step {currentStepIndex + 1} of {calibration.steps.length}
          </Badge>
          {calibration.aiOptimization && (
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Brain className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Progress</span>
              <span className="text-sm text-gray-400">{Math.round(calibration.progress)}%</span>
            </div>
            <Progress value={calibration.progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Started: {format(new Date(calibration.scheduledDate), 'MMM dd, HH:mm')}</span>
              <span>Assigned to: {calibration.assignedTo}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Step */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span>{currentStep.title}</span>
                <Badge 
                  variant="outline" 
                  className={
                    currentStep.status === 'completed' ? 'border-green-500 text-green-400' :
                    currentStep.status === 'in-progress' ? 'border-blue-500 text-blue-400' :
                    'border-gray-500 text-gray-400'
                  }
                >
                  {currentStep.status.replace('-', ' ')}
                </Badge>
              </CardTitle>
              <CardDescription>{currentStep.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Critical Points */}
              <div>
                <h4 className="font-medium text-white mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                  Critical Points
                </h4>
                <ul className="space-y-2">
                  {currentStep.criticalPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety Notes */}
              <div>
                <h4 className="font-medium text-white mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-red-400" />
                  Safety Notes
                </h4>
                <ul className="space-y-2">
                  {currentStep.safetyNotes.map((note, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-300">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Measurements */}
              <div>
                <h4 className="font-medium text-white mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-green-400" />
                  Measurements
                </h4>
                <div className="space-y-3">
                  {currentStep.measurements.map((measurement, index) => (
                    <div key={measurement.id} className="p-3 border border-white/10 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <Label className="text-xs text-gray-400">Parameter</Label>
                          <p className="text-sm font-medium">{measurement.parameter}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400">Expected</Label>
                          <p className="text-sm">{measurement.expectedValue}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400">Actual</Label>
                          <Input
                            value={measurement.actualValue}
                            onChange={(e) => handleMeasurementUpdate(currentStepIndex, index, e.target.value)}
                            className="h-8 text-sm"
                            placeholder="Enter value"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400">Status</Label>
                          <Badge 
                            variant="outline" 
                            className={
                              measurement.status === 'pass' ? 'border-green-500 text-green-400' :
                              measurement.status === 'fail' ? 'border-red-500 text-red-400' :
                              'border-gray-500 text-gray-400'
                            }
                          >
                            {measurement.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label className="text-xs text-gray-400">Notes</Label>
                        <Textarea
                          value={measurement.notes}
                          onChange={(e) => {
                            const updatedSteps = [...calibration.steps]
                            updatedSteps[currentStepIndex].measurements[index].notes = e.target.value
                            setCalibration({ ...calibration, steps: updatedSteps })
                          }}
                          className="h-16 text-sm"
                          placeholder="Add notes about this measurement..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Validation */}
              {currentStep.aiValidation && (
                <div>
                  <h4 className="font-medium text-white mb-3 flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-purple-400" />
                    AI Validation
                    {aiValidating && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400 ml-2"></div>
                    )}
                  </h4>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant="outline" 
                        className={
                          currentStep.aiValidation.status === 'passed' ? 'border-green-500 text-green-400' :
                          currentStep.aiValidation.status === 'failed' ? 'border-red-500 text-red-400' :
                          'border-purple-500 text-purple-400'
                        }
                      >
                        {currentStep.aiValidation.status}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        Confidence: {Math.round(currentStep.aiValidation.confidence * 100)}%
                      </span>
                    </div>
                    
                    {currentStep.aiValidation.insights.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-purple-300 mb-1">Insights</h5>
                        <ul className="space-y-1">
                          {currentStep.aiValidation.insights.map((insight, index) => (
                            <li key={index} className="text-xs text-purple-200">• {insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {currentStep.aiValidation.recommendations.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-green-300 mb-1">Recommendations</h5>
                        <ul className="space-y-1">
                          {currentStep.aiValidation.recommendations.map((rec, index) => (
                            <li key={index} className="text-xs text-green-200">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {currentStep.aiValidation.issues.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-red-300 mb-1">Issues</h5>
                        <ul className="space-y-1">
                          {currentStep.aiValidation.issues.map((issue, index) => (
                            <li key={index} className="text-xs text-red-200">• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button 
                  onClick={() => handleStepComplete(currentStepIndex)}
                  disabled={currentStep.status === 'completed'}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Step
                </Button>
                
                {currentStepIndex < calibration.steps.length - 1 && (
                  <Button 
                    onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                    variant="outline"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Next Step
                  </Button>
                )}
                
                {currentStepIndex === calibration.steps.length - 1 && calibration.progress === 100 && (
                  <Button 
                    onClick={handleCalibrationComplete}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Complete Calibration
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Navigation */}
        <div className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Workflow Steps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {calibration.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      index === currentStepIndex
                        ? 'bg-blue-500/20 border-blue-500/30'
                        : step.status === 'completed'
                        ? 'bg-green-500/10 border-green-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => setCurrentStepIndex(index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Step {index + 1}</span>
                      <Badge 
                        variant="outline" 
                        className={
                          step.status === 'completed' ? 'border-green-500 text-green-400' :
                          step.status === 'in-progress' ? 'border-blue-500 text-blue-400' :
                          'border-gray-500 text-gray-400'
                        }
                      >
                        {step.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-medium text-gray-200 mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-400">{step.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{step.duration} min</span>
                      {step.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Camera className="w-4 h-4 mr-2" />
                Capture Photo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Save className="w-4 h-4 mr-2" />
                Save Progress
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Step
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
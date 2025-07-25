'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  Clock, 
  Play, 
  SkipForward, 
  RefreshCw,
  AlertTriangle,
  Info,
  Users,
  Database,
  Settings,
  BookOpen,
  Download,
  Upload,
  Zap,
  Target,
  Award
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'completed' | 'skipped'
  estimatedTime: number
  isRequired: boolean
  tutorialId?: string
}

interface Tutorial {
  id: string
  title: string
  description: string
  duration: number
  category: string
  videoUrl?: string
  steps: string[]
}

interface OnboardingProgress {
  completedSteps: number
  totalSteps: number
  percentage: number
  currentStep: string
  estimatedTimeRemaining: number
}

export default function OnboardingPage() {
  const { data: session } = useSession()
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([])
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [progress, setProgress] = useState<OnboardingProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('progress')

  useEffect(() => {
    if (session?.user?.id) {
      loadOnboardingData()
    }
  }, [session])

  const loadOnboardingData = async () => {
    try {
      setLoading(true)
      const laboratoryId = session?.user?.laboratoryId || 'demo-lab'

      // Load onboarding progress
      const progressResponse = await fetch(`/api/onboarding/progress/${laboratoryId}`)
      if (progressResponse.ok) {
        const progressData = await progressResponse.json()
        setProgress(progressData.data)
      }

      // Mock onboarding steps
      const mockSteps: OnboardingStep[] = [
        {
          id: 'profile-setup',
          title: 'Complete Your Profile',
          description: 'Add your laboratory information and contact details',
          status: 'completed',
          estimatedTime: 5,
          isRequired: true
        },
        {
          id: 'team-invite',
          title: 'Invite Team Members',
          description: 'Add colleagues who will use LabGuard Pro',
          status: 'completed',
          estimatedTime: 10,
          isRequired: false
        },
        {
          id: 'equipment-import',
          title: 'Import Equipment',
          description: 'Add your laboratory equipment for tracking',
          status: 'pending',
          estimatedTime: 15,
          isRequired: true,
          tutorialId: 'equipment-import'
        },
        {
          id: 'calibration-setup',
          title: 'Set Up Calibration Schedule',
          description: 'Configure calibration reminders and workflows',
          status: 'pending',
          estimatedTime: 20,
          isRequired: true,
          tutorialId: 'calibration-setup'
        },
        {
          id: 'ai-features',
          title: 'Explore AI Features',
          description: 'Learn about Biomni AI and advanced features',
          status: 'pending',
          estimatedTime: 30,
          isRequired: false,
          tutorialId: 'ai-introduction'
        },
        {
          id: 'compliance-setup',
          title: 'Configure Compliance Rules',
          description: 'Set up your laboratory compliance requirements',
          status: 'pending',
          estimatedTime: 25,
          isRequired: true
        },
        {
          id: 'first-calibration',
          title: 'Complete First Calibration',
          description: 'Perform your first equipment calibration',
          status: 'pending',
          estimatedTime: 45,
          isRequired: true,
          tutorialId: 'calibration-workflow'
        }
      ]

      setOnboardingSteps(mockSteps)

      // Mock tutorials
      const mockTutorials: Tutorial[] = [
        {
          id: 'equipment-import',
          title: 'Importing Equipment',
          description: 'Learn how to add and manage your laboratory equipment',
          duration: 5,
          category: 'Equipment Management',
          steps: [
            'Navigate to Equipment section',
            'Click "Add Equipment"',
            'Fill in equipment details',
            'Set calibration schedule',
            'Save and verify'
          ]
        },
        {
          id: 'calibration-setup',
          title: 'Calibration Setup',
          description: 'Configure calibration schedules and workflows',
          duration: 8,
          category: 'Calibration',
          steps: [
            'Access calibration settings',
            'Define calibration intervals',
            'Set up notification preferences',
            'Configure compliance rules',
            'Test the workflow'
          ]
        },
        {
          id: 'ai-introduction',
          title: 'AI Features Overview',
          description: 'Discover the power of Biomni AI in LabGuard Pro',
          duration: 12,
          category: 'AI Features',
          steps: [
            'Explore AI dashboard',
            'Try visual analysis',
            'Generate protocols',
            'Review AI insights',
            'Customize AI settings'
          ]
        },
        {
          id: 'calibration-workflow',
          title: 'Calibration Workflow',
          description: 'Step-by-step guide to performing calibrations',
          duration: 15,
          category: 'Calibration',
          steps: [
            'Select equipment to calibrate',
            'Prepare calibration standards',
            'Follow calibration procedure',
            'Record measurements',
            'Submit for AI validation',
            'Review and approve results'
          ]
        }
      ]

      setTutorials(mockTutorials)

    } catch (err) {
      setError('Failed to load onboarding data')
      console.error('Onboarding error:', err)
    } finally {
      setLoading(false)
    }
  }

  const completeStep = async (stepId: string) => {
    try {
      const response = await fetch('/api/onboarding/complete-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stepId,
          laboratoryId: session?.user?.laboratoryId || 'demo-lab'
        })
      })

      if (response.ok) {
        setOnboardingSteps(prev => 
          prev.map(step => 
            step.id === stepId 
              ? { ...step, status: 'completed' }
              : step
          )
        )
        
        // Update progress
        if (progress) {
          const newCompletedSteps = progress.completedSteps + 1
          setProgress({
            ...progress,
            completedSteps: newCompletedSteps,
            percentage: (newCompletedSteps / progress.totalSteps) * 100
          })
        }
      }
    } catch (error) {
      console.error('Failed to complete step:', error)
    }
  }

  const skipStep = async (stepId: string) => {
    try {
      const response = await fetch('/api/onboarding/skip-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stepId,
          laboratoryId: session?.user?.laboratoryId || 'demo-lab'
        })
      })

      if (response.ok) {
        setOnboardingSteps(prev => 
          prev.map(step => 
            step.id === stepId 
              ? { ...step, status: 'skipped' }
              : step
          )
        )
      }
    } catch (error) {
      console.error('Failed to skip step:', error)
    }
  }

  const importSampleData = async () => {
    try {
      const response = await fetch('/api/onboarding/import-sample-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          laboratoryId: session?.user?.laboratoryId || 'demo-lab'
        })
      })

      if (response.ok) {
        // Update steps to show sample data imported
        setOnboardingSteps(prev => 
          prev.map(step => 
            step.id === 'equipment-import' 
              ? { ...step, status: 'completed' }
              : step
          )
        )
      }
    } catch (error) {
      console.error('Failed to import sample data:', error)
    }
  }

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'skipped':
        return <SkipForward className="h-5 w-5 text-gray-400" />
      default:
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'skipped':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading onboarding data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to LabGuard Pro</h1>
          <p className="text-muted-foreground">
            Let's get your laboratory set up for success
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={loadOnboardingData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      {progress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Onboarding Progress</span>
            </CardTitle>
            <CardDescription>
              {progress.completedSteps} of {progress.totalSteps} steps completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress.percentage)}%
                </span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {progress.completedSteps}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {progress.totalSteps - progress.completedSteps}
                  </div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(progress.estimatedTimeRemaining)}m
                  </div>
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
        </TabsList>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Steps</CardTitle>
              <CardDescription>
                Complete these steps to set up your laboratory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-start space-x-4 p-4 border rounded-lg ${
                      step.status === 'completed' ? 'bg-green-50' : 
                      step.status === 'skipped' ? 'bg-gray-50' : 'bg-background'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getStepStatusIcon(step.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium">
                            {index + 1}. {step.title}
                          </h4>
                          {step.isRequired && (
                            <Badge variant="destructive">Required</Badge>
                          )}
                          <Badge className={getStepStatusColor(step.status)}>
                            {step.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {step.estimatedTime}m
                          </span>
                          {step.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => completeStep(step.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                              {!step.isRequired && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => skipStep(step.id)}
                                >
                                  <SkipForward className="h-4 w-4 mr-1" />
                                  Skip
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-1">
                        {step.description}
                      </p>

                      {step.tutorialId && (
                        <div className="mt-2">
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Watch Tutorial
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Video Tutorials</span>
              </CardTitle>
              <CardDescription>
                Learn how to use LabGuard Pro effectively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorials.map((tutorial) => (
                  <Card key={tutorial.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{tutorial.title}</CardTitle>
                      <CardDescription>{tutorial.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Duration</span>
                          <span className="text-sm text-muted-foreground">
                            {tutorial.duration} minutes
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-sm font-medium">Steps:</span>
                          <ol className="text-sm text-muted-foreground space-y-1">
                            {tutorial.steps.map((step, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-xs bg-muted rounded-full w-5 h-5 flex items-center justify-center mt-0.5">
                                  {index + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Watch Tutorial
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Start Tab */}
        <TabsContent value="quick-start" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Quick Start</span>
              </CardTitle>
              <CardDescription>
                Get up and running quickly with these shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span>Import Sample Data</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Import sample equipment and calibration data to see how LabGuard Pro works
                    </p>
                    <Button onClick={importSampleData} className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Sample Data
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Invite Team Members</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your laboratory team members to collaborate on equipment management
                    </p>
                    <Button className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Invite Team
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Configure Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set up your laboratory preferences and compliance requirements
                    </p>
                    <Button className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>Complete First Calibration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Perform your first equipment calibration to see AI validation in action
                    </p>
                    <Button className="w-full">
                      <Award className="h-4 w-4 mr-2" />
                      Start Calibration
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Info className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              View Docs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Skip Onboarding</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <SkipForward className="h-4 w-4 mr-2" />
              Skip Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
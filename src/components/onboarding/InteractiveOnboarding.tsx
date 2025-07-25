'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Circle, ArrowRight, ArrowLeft, SkipForward } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
  required: boolean
  completed: boolean
}

export function InteractiveOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to LabGuard Pro',
      description: 'Let\'s get your laboratory set up for success',
      component: WelcomeStep,
      required: true,
      completed: false
    },
    {
      id: 'lab-setup',
      title: 'Laboratory Information',
      description: 'Configure your laboratory details and branding',
      component: LabSetupStep,
      required: true,
      completed: false
    },
    {
      id: 'team-invite',
      title: 'Invite Your Team',
      description: 'Add team members and assign roles',
      component: TeamInviteStep,
      required: false,
      completed: false
    },
    {
      id: 'equipment-import',
      title: 'Add Equipment',
      description: 'Import or manually add your laboratory equipment',
      component: EquipmentImportStep,
      required: true,
      completed: false
    },
    {
      id: 'first-calibration',
      title: 'Schedule First Calibration',
      description: 'Let\'s schedule your first equipment calibration',
      component: FirstCalibrationStep,
      required: true,
      completed: false
    },
    {
      id: 'ai-setup',
      title: 'AI Compliance Setup',
      description: 'Configure AI compliance templates for your lab',
      component: AISetupStep,
      required: false,
      completed: false
    }
  ])

  useEffect(() => {
    const completedSteps = onboardingSteps.filter(step => step.completed).length
    const totalSteps = onboardingSteps.length
    setProgress((completedSteps / totalSteps) * 100)
  }, [onboardingSteps])

  const completeStep = (stepId: string) => {
    setOnboardingSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    )
    
    // Track completion for customer success
    trackOnboardingProgress(stepId, true)
  }

  const skipStep = (stepId: string) => {
    if (!onboardingSteps[currentStep].required) {
      setCurrentStep(prev => prev + 1)
      trackOnboardingProgress(stepId, false)
    }
  }

  const trackOnboardingProgress = async (stepId: string, completed: boolean) => {
    try {
      await fetch('/api/onboarding/complete-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, completed })
      })
    } catch (error) {
      console.error('Failed to track onboarding progress:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Getting Started</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
          </div>
          
          <Progress value={progress} className="mb-4" />
          
          {/* Step indicators */}
          <div className="flex justify-between">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-green-500 text-white' :
                  index === currentStep ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <span className="text-xs mt-1 text-center max-w-20">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              {onboardingSteps[currentStep].title}
            </CardTitle>
            <p className="text-gray-600">
              {onboardingSteps[currentStep].description}
            </p>
          </CardHeader>
          <CardContent>
            {/* Render current step component */}
            <div className="mb-8">
              {React.createElement(onboardingSteps[currentStep].component, {
                onComplete: () => completeStep(onboardingSteps[currentStep].id),
                onSkip: () => skipStep(onboardingSteps[currentStep].id)
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="space-x-2">
                {!onboardingSteps[currentStep].required && (
                  <Button
                    variant="ghost"
                    onClick={() => skipStep(onboardingSteps[currentStep].id)}
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip
                  </Button>
                )}
                
                <Button
                  onClick={() => setCurrentStep(prev => 
                    Math.min(onboardingSteps.length - 1, prev + 1)
                  )}
                  disabled={!onboardingSteps[currentStep].completed}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            Need help getting started?
          </p>
          <div className="space-x-4">
            <Button variant="link" size="sm">
              📚 View Documentation
            </Button>
            <Button variant="link" size="sm">
              💬 Contact Support
            </Button>
            <Button variant="link" size="sm">
              🎥 Watch Tutorial
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step Components
function WelcomeStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Welcome to LabGuard Pro!</h3>
        <p className="text-gray-600 mb-6">
          We're excited to help you automate your laboratory compliance. 
          This setup will take about 5-10 minutes to complete.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl mb-2">⚡</div>
          <h4 className="font-semibold">Quick Setup</h4>
          <p className="text-sm text-gray-600">Get started in minutes</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl mb-2">🛡️</div>
          <h4 className="font-semibold">Compliance Ready</h4>
          <p className="text-sm text-gray-600">Meet all requirements</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl mb-2">🤖</div>
          <h4 className="font-semibold">AI Powered</h4>
          <p className="text-sm text-gray-600">Advanced automation</p>
        </div>
      </div>

      <Button onClick={onComplete} className="w-full">
        Get Started
      </Button>
    </div>
  )
}

function LabSetupStep({ onComplete }: { onComplete: () => void }) {
  const [labName, setLabName] = useState('')
  const [labType, setLabType] = useState('')
  const [location, setLocation] = useState('')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Laboratory Name</label>
          <input
            type="text"
            value={labName}
            onChange={(e) => setLabName(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Enter laboratory name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Laboratory Type</label>
          <select
            value={labType}
            onChange={(e) => setLabType(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select type</option>
            <option value="clinical">Clinical Laboratory</option>
            <option value="research">Research Laboratory</option>
            <option value="industrial">Industrial Laboratory</option>
            <option value="academic">Academic Laboratory</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="City, State"
        />
      </div>

      <Button 
        onClick={onComplete} 
        className="w-full"
        disabled={!labName || !labType || !location}
      >
        Continue
      </Button>
    </div>
  )
}

function TeamInviteStep({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Invite Your Team</h3>
        <p className="text-gray-600 mb-6">
          Add team members to collaborate on compliance tasks. 
          You can skip this and add them later.
        </p>
      </div>

      <div className="space-y-4">
        <Button variant="outline" className="w-full">
          + Add Team Member
        </Button>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onSkip} className="flex-1">
          Skip for Now
        </Button>
        <Button onClick={onComplete} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  )
}

function EquipmentImportStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Add Your Equipment</h3>
        <p className="text-gray-600 mb-6">
          Import your equipment inventory or add them manually.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" className="h-32 flex flex-col items-center justify-center">
          <div className="text-3xl mb-2">📁</div>
          <div className="font-semibold">Import CSV</div>
          <div className="text-sm text-gray-500">Upload equipment list</div>
        </Button>
        <Button variant="outline" className="h-32 flex flex-col items-center justify-center">
          <div className="text-3xl mb-2">➕</div>
          <div className="font-semibold">Add Manually</div>
          <div className="text-sm text-gray-500">Enter equipment details</div>
        </Button>
      </div>

      <Button onClick={onComplete} className="w-full">
        Continue
      </Button>
    </div>
  )
}

function FirstCalibrationStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Schedule Your First Calibration</h3>
        <p className="text-gray-600 mb-6">
          Let's set up your first equipment calibration to get started.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Recommended First Steps:</h4>
          <ul className="text-sm space-y-1">
            <li>• Schedule analytical balance calibration</li>
            <li>• Set up pipette verification</li>
            <li>• Configure temperature monitoring</li>
          </ul>
        </div>
      </div>

      <Button onClick={onComplete} className="w-full">
        Schedule Calibration
      </Button>
    </div>
  )
}

function AISetupStep({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Configure AI Compliance</h3>
        <p className="text-gray-600 mb-6">
          Set up AI-powered compliance templates for your laboratory.
          You can configure this later in settings.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold mb-2">AI Features Available:</h4>
          <ul className="text-sm space-y-1">
            <li>• Automated compliance checking</li>
            <li>• Intelligent calibration validation</li>
            <li>• Predictive maintenance alerts</li>
          </ul>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onSkip} className="flex-1">
          Configure Later
        </Button>
        <Button onClick={onComplete} className="flex-1">
          Set Up AI
        </Button>
      </div>
    </div>
  )
} 
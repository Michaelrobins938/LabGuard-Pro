'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  FileText, 
  Beaker, 
  TestTube, 
  Microscope, 
  Settings, 
  Play,
  Download,
  Save,
  Brain,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles,
  Zap,
  Target,
  Gauge,
  Thermometer,
  Droplets
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

interface ProtocolStep {
  id: string
  title: string
  description: string
  duration: number
  temperature?: number
  equipment: string[]
  reagents: string[]
  safetyNotes: string[]
  criticalPoints: string[]
  tips: string[]
}

interface GeneratedProtocol {
  id: string
  title: string
  description: string
  category: string
  steps: ProtocolStep[]
  equipment: string[]
  reagents: string[]
  safetyNotes: string[]
  estimatedDuration: number
  difficulty: string
  aiGenerated: boolean
}

interface WizardStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  current: boolean
}

const wizardSteps: WizardStep[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Protocol title and description',
    icon: <FileText className="w-5 h-5" />,
    completed: false,
    current: true
  },
  {
    id: 'category',
    title: 'Protocol Category',
    description: 'Select experiment type',
    icon: <Beaker className="w-5 h-5" />,
    completed: false,
    current: false
  },
  {
    id: 'equipment',
    title: 'Equipment & Reagents',
    description: 'Available resources',
    icon: <Settings className="w-5 h-5" />,
    completed: false,
    current: false
  },
  {
    id: 'parameters',
    title: 'Parameters',
    description: 'Temperature, time, conditions',
    icon: <Thermometer className="w-5 h-5" />,
    completed: false,
    current: false
  },
  {
    id: 'safety',
    title: 'Safety & Compliance',
    description: 'Safety requirements',
    icon: <AlertCircle className="w-5 h-5" />,
    completed: false,
    current: false
  },
  {
    id: 'generate',
    title: 'Generate Protocol',
    description: 'AI creates your protocol',
    icon: <Brain className="w-5 h-5" />,
    completed: false,
    current: false
  }
]

const protocolCategories = [
  { value: 'CELL_CULTURE', label: 'Cell Culture', icon: <Beaker className="w-4 h-4" />, color: 'bg-green-500' },
  { value: 'PCR', label: 'PCR', icon: <TestTube className="w-4 h-4" />, color: 'bg-blue-500' },
  { value: 'SEQUENCING', label: 'Sequencing', icon: <Settings className="w-4 h-4" />, color: 'bg-purple-500' },
  { value: 'MICROSCOPY', label: 'Microscopy', icon: <Microscope className="w-4 h-4" />, color: 'bg-orange-500' },
  { value: 'FLOW_CYTOMETRY', label: 'Flow Cytometry', icon: <Gauge className="w-4 h-4" />, color: 'bg-red-500' },
  { value: 'CUSTOM', label: 'Custom', icon: <FileText className="w-4 h-4" />, color: 'bg-gray-500' }
]

export function ProtocolWizard() {
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProtocol, setGeneratedProtocol] = useState<GeneratedProtocol | null>(null)
  const [error, setError] = useState('')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [equipment, setEquipment] = useState<string[]>([])
  const [reagents, setReagents] = useState<string[]>([])
  const [temperature, setTemperature] = useState('')
  const [duration, setDuration] = useState('')
  const [safetyLevel, setSafetyLevel] = useState('')

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      updateWizardSteps(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      updateWizardSteps(currentStep - 1)
    }
  }

  const updateWizardSteps = (activeStep: number) => {
    wizardSteps.forEach((step, index) => {
      step.current = index === activeStep
      step.completed = index < activeStep
    })
  }

  const handleGenerateProtocol = async () => {
    if (!title || !description || !category) {
      setError('Please fill in all required fields')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      // Simulate protocol generation
      await simulateProtocolGeneration()
    } catch (error) {
      setError('Protocol generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const simulateProtocolGeneration = async () => {
    // Simulate AI protocol generation with progress
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockProtocol: GeneratedProtocol = {
      id: Date.now().toString(),
      title,
      description,
      category,
      steps: [
        {
          id: '1',
          title: 'Prepare Equipment',
          description: 'Sterilize all equipment and prepare workspace',
          duration: 15,
          equipment: ['Autoclave', 'Sterile hood', 'Pipettes'],
          reagents: ['70% ethanol', 'Sterile water'],
          safetyNotes: ['Wear gloves', 'Use sterile technique'],
          criticalPoints: ['Ensure all equipment is sterile'],
          tips: ['Work quickly to minimize contamination risk']
        },
        {
          id: '2',
          title: 'Sample Preparation',
          description: 'Prepare samples according to protocol specifications',
          duration: 30,
          temperature: 37,
          equipment: ['Incubator', 'Centrifuge', 'Microscope'],
          reagents: ['Growth medium', 'Antibiotics'],
          safetyNotes: ['Handle samples carefully', 'Maintain sterile conditions'],
          criticalPoints: ['Maintain optimal temperature', 'Monitor pH levels'],
          tips: ['Check sample quality under microscope']
        }
      ],
      equipment: ['Autoclave', 'Sterile hood', 'Incubator', 'Centrifuge', 'Microscope'],
      reagents: ['Growth medium', 'Antibiotics', '70% ethanol', 'Sterile water'],
      safetyNotes: ['Wear appropriate PPE', 'Follow sterile technique', 'Dispose of waste properly'],
      estimatedDuration: 120,
      difficulty: 'INTERMEDIATE',
      aiGenerated: true
    }

    setGeneratedProtocol(mockProtocol)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="protocol-title">Protocol Title *</Label>
              <Input
                id="protocol-title"
                placeholder="e.g., Cell Culture Protocol for HEK293 Cells"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protocol-description">Description *</Label>
              <Textarea
                id="protocol-description"
                placeholder="Describe the experimental protocol, objectives, and expected outcomes..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <Label>Select Protocol Category *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {protocolCategories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={category === cat.value ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => setCategory(cat.value)}
                >
                  <div className={`w-8 h-8 rounded-full ${cat.color} flex items-center justify-center text-white`}>
                    {cat.icon}
                  </div>
                  <span className="font-medium">{cat.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Available Equipment</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Autoclave', 'Sterile hood', 'Incubator', 'Centrifuge', 'Microscope', 'Pipettes'].map((item) => (
                  <Button
                    key={item}
                    variant={equipment.includes(item) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (equipment.includes(item)) {
                        setEquipment(equipment.filter(e => e !== item))
                      } else {
                        setEquipment([...equipment, item])
                      }
                    }}
                  >
                    {equipment.includes(item) ? <CheckCircle className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Available Reagents</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Growth medium', 'Antibiotics', '70% ethanol', 'Sterile water', 'Trypsin', 'PBS'].map((item) => (
                  <Button
                    key={item}
                    variant={reagents.includes(item) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (reagents.includes(item)) {
                        setReagents(reagents.filter(r => r !== item))
                      } else {
                        setReagents([...reagents, item])
                      }
                    }}
                  >
                    {reagents.includes(item) ? <CheckCircle className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  placeholder="37"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="120"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Safety Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map((level) => (
                  <Button
                    key={level}
                    variant={safetyLevel === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSafetyLevel(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Based on your selections, this protocol requires BSL-2 safety measures. Ensure you have proper PPE and follow all safety protocols.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>Safety Requirements</Label>
              <div className="space-y-2">
                {['Wear lab coat and gloves', 'Use sterile technique', 'Work in biosafety cabinet', 'Dispose of waste properly'].map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ready to Generate Protocol</h3>
                <p className="text-sm text-gray-600">AI will create a comprehensive protocol based on your inputs</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <span className="font-medium">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Equipment:</span>
                  <span className="font-medium">{equipment.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Reagents:</span>
                  <span className="font-medium">{reagents.length} items</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Protocol Generation Wizard</h2>
          <p className="text-gray-600 mt-1">
            Step-by-step protocol creation with AI assistance
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Brain className="w-4 h-4 mr-1" />
          AI Wizard
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wizard Steps */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {wizardSteps.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wizardSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      step.current ? 'bg-blue-50 border border-blue-200' : 
                      step.completed ? 'bg-green-50 border border-green-200' : 
                      'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.current ? 'bg-blue-500 text-white' :
                      step.completed ? 'bg-green-500 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {step.completed ? <CheckCircle className="w-4 h-4" /> : step.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        step.current ? 'text-blue-900' :
                        step.completed ? 'text-green-900' :
                        'text-gray-600'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {wizardSteps[currentStep].icon}
                <span>{wizardSteps[currentStep].title}</span>
              </CardTitle>
              <CardDescription>
                {wizardSteps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderStepContent()}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep === wizardSteps.length - 1 ? (
                  <Button
                    onClick={handleGenerateProtocol}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Generate Protocol
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generated Protocol Display */}
      {generatedProtocol && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Generated Protocol</span>
            </CardTitle>
            <CardDescription>
              Your AI-generated protocol is ready
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{generatedProtocol.title}</h3>
                <Badge variant="outline">{generatedProtocol.difficulty}</Badge>
              </div>
              <p className="text-gray-600">{generatedProtocol.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Equipment Required</h4>
                  <div className="space-y-1">
                    {generatedProtocol.equipment.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Reagents Required</h4>
                  <div className="space-y-1">
                    {generatedProtocol.reagents.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Safety Notes</h4>
                  <div className="space-y-1">
                    {generatedProtocol.safetyNotes.map((note, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <AlertCircle className="w-3 h-3 text-orange-500" />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Protocol
                </Button>
                <Button variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  Save to Library
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
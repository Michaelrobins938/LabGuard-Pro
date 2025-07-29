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
  Copy,
  Save,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  Brain,
  Eye
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

interface ProtocolStep {
  id: string
  order: number
  title: string
  description: string
  duration: number
  equipment: string[]
  reagents: string[]
  safetyNotes: string[]
  criticalPoints: string[]
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

const protocolCategories = [
  { value: 'CELL_CULTURE', label: 'Cell Culture', icon: <Beaker className="w-4 h-4" /> },
  { value: 'PCR', label: 'PCR', icon: <TestTube className="w-4 h-4" /> },
  { value: 'SEQUENCING', label: 'Sequencing', icon: <Settings className="w-4 h-4" /> },
  { value: 'MICROSCOPY', label: 'Microscopy', icon: <Microscope className="w-4 h-4" /> },
  { value: 'FLOW_CYTOMETRY', label: 'Flow Cytometry', icon: <Settings className="w-4 h-4" /> },
  { value: 'CUSTOM', label: 'Custom', icon: <FileText className="w-4 h-4" /> }
]

const difficultyLevels = [
  { value: 'BEGINNER', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { value: 'INTERMEDIATE', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ADVANCED', label: 'Advanced', color: 'bg-red-100 text-red-800' }
]

export function ProtocolGenerationComponent() {
  const { data: session } = useSession()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProtocol, setGeneratedProtocol] = useState<GeneratedProtocol | null>(null)
  const [error, setError] = useState('')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [equipment, setEquipment] = useState('')
  const [requirements, setRequirements] = useState('')

  const handleGenerateProtocol = async () => {
    if (!title || !description || !category) {
      setError('Please fill in all required fields')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const equipmentList = equipment.split(',').map(item => item.trim()).filter(Boolean)
      const requirementsList = requirements.split(',').map(item => item.trim()).filter(Boolean)

      const response = await fetch('/api/biomni/protocols/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.id}`
        },
        body: JSON.stringify({
          title,
          description,
          category,
          equipment: equipmentList,
          requirements: requirementsList
        })
      })

      if (response.ok) {
        const result = await response.json()
        setGeneratedProtocol(result)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Protocol generation failed')
      }
    } catch (error) {
      setError('Failed to generate protocol. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveProtocol = async () => {
    // Implementation for saving protocol to database
    console.log('Saving protocol:', generatedProtocol)
  }

  const handleExportProtocol = () => {
    if (!generatedProtocol) return

    const protocolText = `
# ${generatedProtocol.title}

## Description
${generatedProtocol.description}

## Category
${generatedProtocol.category}

## Estimated Duration
${generatedProtocol.estimatedDuration} minutes

## Difficulty
${generatedProtocol.difficulty}

## Equipment Required
${generatedProtocol.equipment.join(', ')}

## Reagents Required
${generatedProtocol.reagents.join(', ')}

## Safety Notes
${generatedProtocol.safetyNotes.join('\n')}

## Protocol Steps
${generatedProtocol.steps.map(step => `
### Step ${step.order}: ${step.title}
**Duration:** ${step.duration} minutes

**Description:** ${step.description}

**Equipment:** ${step.equipment.join(', ')}

**Reagents:** ${step.reagents.join(', ')}

**Safety Notes:** ${step.safetyNotes.join(', ')}

**Critical Points:** ${step.criticalPoints.join(', ')}
`).join('\n')}
    `.trim()

    const blob = new Blob([protocolText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${generatedProtocol.title.replace(/\s+/g, '_')}_protocol.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getDifficultyColor = (difficulty: string) => {
    const level = difficultyLevels.find(d => d.value === difficulty)
    return level?.color || 'bg-gray-100 text-gray-800'
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Protocol Generation</h2>
          <p className="text-gray-600 mt-1">
            Generate experimental protocols with AI assistance
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Brain className="w-4 h-4 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Protocol Details</span>
            </CardTitle>
            <CardDescription>
              Describe the experimental protocol you want to generate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="protocol-title">Protocol Title *</Label>
              <Input
                id="protocol-title"
                placeholder="e.g., Cell Culture Protocol for HEK293 Cells"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protocol-category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select protocol category" />
                </SelectTrigger>
                <SelectContent>
                  {protocolCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center space-x-2">
                        {cat.icon}
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div className="space-y-2">
              <Label htmlFor="equipment">Available Equipment</Label>
              <Input
                id="equipment"
                placeholder="e.g., centrifuge, microscope, pipettes (comma-separated)"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Special Requirements</Label>
              <Input
                id="requirements"
                placeholder="e.g., sterile conditions, specific temperature, safety measures (comma-separated)"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGenerateProtocol}
              disabled={!title || !description || !category || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Generating Protocol...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Protocol
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Protocol Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Protocol Preview</span>
            </CardTitle>
            <CardDescription>
              Preview the generated protocol
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedProtocol ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{generatedProtocol.title}</h3>
                  <p className="text-sm text-gray-600">{generatedProtocol.description}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{generatedProtocol.category}</Badge>
                    <Badge className={getDifficultyColor(generatedProtocol.difficulty)}>
                      {generatedProtocol.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(generatedProtocol.estimatedDuration)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Equipment Required</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {generatedProtocol.equipment.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm">Reagents Required</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {generatedProtocol.reagents.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm">Safety Notes</h4>
                    <div className="space-y-1 mt-1">
                      {generatedProtocol.safetyNotes.map((note, index) => (
                        <div key={index} className="flex items-start space-x-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                          <span>{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleSaveProtocol}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportProtocol}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2" />
                  <p>No protocol generated yet</p>
                  <p className="text-sm">Fill in the form and click generate</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Protocol Steps */}
      {generatedProtocol && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Protocol Steps</span>
            </CardTitle>
            <CardDescription>
              Detailed step-by-step instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="steps" className="space-y-4">
              <TabsList>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
              </TabsList>

              <TabsContent value="steps" className="space-y-4">
                <div className="space-y-4">
                  {generatedProtocol.steps.map((step) => (
                    <div key={step.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Step {step.order}: {step.title}</h4>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(step.duration)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600">{step.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Equipment:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {step.equipment.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Reagents:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {step.reagents.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {step.safetyNotes.length > 0 && (
                        <div>
                          <span className="font-medium text-sm">Safety Notes:</span>
                          <div className="space-y-1 mt-1">
                            {step.safetyNotes.map((note, index) => (
                              <div key={index} className="flex items-start space-x-2 text-sm">
                                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                                <span>{note}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.criticalPoints.length > 0 && (
                        <div>
                          <span className="font-medium text-sm">Critical Points:</span>
                          <div className="space-y-1 mt-1">
                            {step.criticalPoints.map((point, index) => (
                              <div key={index} className="flex items-start space-x-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Total Duration</h4>
                      <p className="text-sm text-gray-600">
                        {formatDuration(generatedProtocol.estimatedDuration)}
                      </p>
                    </div>
                    <div className="text-right">
                      <h4 className="font-semibold">Difficulty</h4>
                      <Badge className={getDifficultyColor(generatedProtocol.difficulty)}>
                        {generatedProtocol.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {generatedProtocol.steps.map((step) => (
                      <div key={step.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                          {step.order}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium">{step.title}</h5>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">
                            {formatDuration(step.duration)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="safety" className="space-y-4">
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This protocol has been generated with AI assistance. Please review all safety notes and ensure compliance with your laboratory's safety protocols.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <h4 className="font-semibold mb-2">General Safety Notes</h4>
                    <div className="space-y-2">
                      {generatedProtocol.safetyNotes.map((note, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-orange-50 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                          <span className="text-sm">{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Equipment Safety</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedProtocol.equipment.map((item, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <h5 className="font-medium text-sm">{item}</h5>
                          <p className="text-xs text-gray-600 mt-1">
                            Ensure proper calibration and safety checks before use
                          </p>
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
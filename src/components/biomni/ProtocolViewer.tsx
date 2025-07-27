'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Beaker, 
  ShieldCheck, 
  Download,
  Save,
  Play,
  Pause,
  RotateCcw,
  Star,
  Users,
  DollarSign,
  Timer,
  Microscope,
  Thermometer,
  AlertCircle,
  Info,
  TrendingUp,
  BookOpen
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ProtocolViewerProps {
  protocol: {
    id: string
    name: string
    description: string
    objective: string
    sampleType: string
    techniques: string[]
    steps: ProtocolStep[]
    reagents: Reagent[]
    equipment: Equipment[]
    safetyConsiderations: SafetyConsideration[]
    expectedResults: ExpectedResult[]
    qualityControls: QualityControl[]
    troubleshooting: TroubleshootingItem[]
    estimatedTime: string
    estimatedCost: string
    confidence: number
    toolsUsed: string[]
    databasesQueried: string[]
    warnings: string[]
    recommendations: string[]
  }
  onValidate?: () => void
  onSave?: () => void
  onExecute?: () => void
  onExport?: (format: 'pdf' | 'docx' | 'json') => void
  validationStatus?: 'pending' | 'validating' | 'validated' | 'failed'
  executionStatus?: 'not_started' | 'in_progress' | 'paused' | 'completed' | 'failed'
  currentStep?: number
}

interface ProtocolStep {
  id: number
  title: string
  description: string
  duration: string
  temperature?: string
  notes?: string
  criticalPoints?: string[]
  materials?: string[]
}

interface Reagent {
  name: string
  description: string
  amount: string
  concentration: string
  supplier?: string
  catalogNumber?: string
  storageConditions: string
  hazards?: string[]
}

interface Equipment {
  name: string
  model?: string
  specifications: string
  purpose: string
  calibrationRequired?: boolean
}

interface SafetyConsideration {
  category: string
  description: string
  ppe: string
  precautions: string[]
  emergencyProcedures?: string
}

interface ExpectedResult {
  parameter: string
  expectedValue: string
  acceptanceRange: string
  interpretation: string
}

interface QualityControl {
  type: string
  description: string
  frequency: string
  acceptanceCriteria: string
}

interface TroubleshootingItem {
  problem: string
  possibleCauses: string[]
  solutions: string[]
}

export function ProtocolViewer({ 
  protocol, 
  onValidate, 
  onSave, 
  onExecute, 
  onExport,
  validationStatus = 'pending',
  executionStatus = 'not_started',
  currentStep = 0
}: ProtocolViewerProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [favorited, setFavorited] = useState(false)
  const [notes, setNotes] = useState('')

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800'
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getValidationIcon = () => {
    switch (validationStatus) {
      case 'validated':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'validating':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getExecutionProgress = () => {
    if (executionStatus === 'not_started') return 0
    if (executionStatus === 'completed') return 100
    return Math.round((currentStep / protocol.steps.length) * 100)
  }

  const handleValidation = async () => {
    if (onValidate) {
      try {
        await onValidate()
        toast({
          title: "Validation Complete",
          description: "Protocol has been validated successfully",
          variant: "default"
        })
      } catch (error) {
        toast({
          title: "Validation Failed",
          description: "Protocol validation encountered an error",
          variant: "destructive"
        })
      }
    }
  }

  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave()
        toast({
          title: "Protocol Saved",
          description: "Protocol has been saved to your library",
          variant: "default"
        })
      } catch (error) {
        toast({
          title: "Save Failed",
          description: "Failed to save protocol",
          variant: "destructive"
        })
      }
    }
  }

  const handleExecute = async () => {
    if (onExecute) {
      try {
        await onExecute()
        toast({
          title: "Execution Started",
          description: "Protocol execution has been initiated",
          variant: "default"
        })
      } catch (error) {
        toast({
          title: "Execution Failed",
          description: "Failed to start protocol execution",
          variant: "destructive"
        })
      }
    }
  }

  const handleExport = async (format: 'pdf' | 'docx' | 'json') => {
    if (onExport) {
      try {
        await onExport(format)
        toast({
          title: "Export Complete",
          description: `Protocol exported as ${format.toUpperCase()}`,
          variant: "default"
        })
      } catch (error) {
        toast({
          title: "Export Failed",
          description: `Failed to export protocol as ${format.toUpperCase()}`,
          variant: "destructive"
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Protocol Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <CardTitle className="text-xl">{protocol.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFavorited(!favorited)}
                  className={favorited ? "text-yellow-500" : "text-gray-400"}
                >
                  <Star className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
                </Button>
              </div>
              <p className="text-gray-600 mb-3">{protocol.description}</p>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{protocol.sampleType}</Badge>
                <Badge className={getConfidenceBadge(protocol.confidence)}>
                  {Math.round(protocol.confidence * 100)}% Confidence
                </Badge>
                {getValidationIcon()}
                <span className="text-sm text-gray-500 capitalize">{validationStatus}</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleValidation}>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  {validationStatus === 'validating' ? 'Validating...' : 'Validate'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" onClick={handleExecute}>
                  <Play className="w-4 h-4 mr-2" />
                  Execute
                </Button>
              </div>
              
              <div className="flex space-x-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport('pdf')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport('docx')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  DOCX
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport('json')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  JSON
                </Button>
              </div>
            </div>
          </div>
          
          {/* Protocol Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{protocol.steps.length}</div>
              <div className="text-sm text-gray-600">Steps</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center">
                <Timer className="w-5 h-5 mr-1" />
                {protocol.estimatedTime}
              </div>
              <div className="text-sm text-gray-600">Est. Time</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5 mr-1" />
                {protocol.estimatedCost}
              </div>
              <div className="text-sm text-gray-600">Est. Cost</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{protocol.techniques.length}</div>
              <div className="text-sm text-gray-600">Techniques</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{protocol.warnings.length}</div>
              <div className="text-sm text-gray-600">Warnings</div>
            </div>
          </div>

          {/* Execution Progress */}
          {executionStatus !== 'not_started' && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Execution Progress</span>
                <span className="text-sm text-gray-500">{getExecutionProgress()}%</span>
              </div>
              <Progress value={getExecutionProgress()} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Step {currentStep} of {protocol.steps.length}</span>
                <span className="capitalize">{executionStatus.replace('_', ' ')}</span>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Protocol Details */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="qc">Quality</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Beaker className="w-5 h-5" />
                  <span>Objective</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{protocol.objective}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Microscope className="w-5 h-5" />
                  <span>Techniques</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {protocol.techniques.map((technique, index) => (
                    <Badge key={index} variant="outline">
                      {technique}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Expected Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {protocol.expectedResults?.map((result, index) => (
                  <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800">{result.parameter}</h4>
                    <p className="text-sm text-green-700 mt-1">{result.expectedValue}</p>
                    <p className="text-xs text-green-600 mt-1">Range: {result.acceptanceRange}</p>
                    <p className="text-sm text-green-600 mt-1">{result.interpretation}</p>
                  </div>
                )) || (
                  <p className="text-gray-500">No expected results specified</p>
                )}
              </div>
            </CardContent>
          </Card>

          {protocol.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>AI Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {protocol.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="steps" className="space-y-4">
          {protocol.steps.map((step, index) => (
            <Card 
              key={step.id} 
              className={`${
                executionStatus === 'in_progress' && currentStep === index 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : ''
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    executionStatus === 'in_progress' && currentStep === index
                      ? 'bg-blue-600 text-white'
                      : currentStep > index && executionStatus !== 'not_started'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {executionStatus !== 'not_started' && currentStep > index ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{step.title}</h4>
                    <p className="text-gray-600 mt-1">{step.description}</p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{step.duration}</span>
                      </div>
                      {step.temperature && (
                        <div className="flex items-center space-x-1">
                          <Thermometer className="w-4 h-4" />
                          <span>{step.temperature}</span>
                        </div>
                      )}
                    </div>

                    {step.criticalPoints && step.criticalPoints.length > 0 && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">Critical Points</span>
                        </div>
                        <ul className="text-sm text-yellow-700 list-disc list-inside">
                          {step.criticalPoints.map((point, pointIndex) => (
                            <li key={pointIndex}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {step.materials && step.materials.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm font-medium">Materials needed:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {step.materials.map((material, matIndex) => (
                            <Badge key={matIndex} variant="outline" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.notes && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                        <span className="text-sm font-medium text-blue-800">Notes:</span>
                        <p className="text-sm text-blue-700 mt-1">{step.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Required Reagents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {protocol.reagents?.map((reagent, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{reagent.name}</h4>
                        <div className="text-right text-sm">
                          <div className="font-medium">{reagent.amount}</div>
                          <div className="text-gray-500">{reagent.concentration}</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{reagent.description}</p>
                      <div className="text-xs text-gray-500">
                        <div>Storage: {reagent.storageConditions}</div>
                        {reagent.supplier && (
                          <div>Supplier: {reagent.supplier}</div>
                        )}
                        {reagent.catalogNumber && (
                          <div>Cat#: {reagent.catalogNumber}</div>
                        )}
                      </div>
                      {reagent.hazards && reagent.hazards.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {reagent.hazards.map((hazard, hazIndex) => (
                            <Badge key={hazIndex} variant="destructive" className="text-xs">
                              {hazard}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )) || (
                    <p className="text-gray-500">No reagents specified</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Required Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {protocol.equipment?.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Beaker className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        {item.model && (
                          <p className="text-sm text-gray-600">Model: {item.model}</p>
                        )}
                        <p className="text-sm text-gray-600">{item.specifications}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.purpose}</p>
                        {item.calibrationRequired && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Calibration Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500">No equipment specified</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <span>Safety Considerations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {protocol.safetyConsiderations?.map((safety, index) => (
                  <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">{safety.category}</h4>
                    <p className="text-sm text-red-700 mb-3">{safety.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-red-800 mb-1">Required PPE:</h5>
                        <p className="text-sm text-red-700">{safety.ppe}</p>
                      </div>
                      
                      {safety.precautions.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-red-800 mb-1">Precautions:</h5>
                          <ul className="text-sm text-red-700 list-disc list-inside">
                            {safety.precautions.map((precaution, precIndex) => (
                              <li key={precIndex}>{precaution}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {safety.emergencyProcedures && (
                      <div className="mt-3 p-2 bg-red-100 rounded">
                        <h5 className="text-sm font-medium text-red-900 mb-1">Emergency Procedures:</h5>
                        <p className="text-sm text-red-800">{safety.emergencyProcedures}</p>
                      </div>
                    )}
                  </div>
                )) || (
                  <p className="text-gray-500">No specific safety considerations provided</p>
                )}
              </div>
            </CardContent>
          </Card>

          {protocol.warnings.length > 0 && (
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-yellow-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Warnings & Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {protocol.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-yellow-800">{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="qc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Measures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {protocol.qualityControls?.map((qc, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{qc.type}</h4>
                      <Badge variant="outline">{qc.frequency}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{qc.description}</p>
                    <div className="text-sm">
                      <span className="font-medium">Acceptance Criteria: </span>
                      <span className="text-gray-700">{qc.acceptanceCriteria}</span>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500">No quality control measures specified</p>
                )}
              </div>
            </CardContent>
          </Card>

          {protocol.troubleshooting && protocol.troubleshooting.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {protocol.troubleshooting.map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">Problem: {item.problem}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium mb-1">Possible Causes:</h5>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {item.possibleCauses.map((cause, causeIndex) => (
                              <li key={causeIndex}>{cause}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-1">Solutions:</h5>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {item.solutions.map((solution, solIndex) => (
                              <li key={solIndex}>{solution}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>AI Tools Used</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {protocol.toolsUsed.map((tool, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      {tool.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Databases Queried</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {protocol.databasesQueried.map((db, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                      {db}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Protocol Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Protocol ID:</span>
                  <p className="text-gray-600">{protocol.id}</p>
                </div>
                <div>
                  <span className="font-medium">Sample Type:</span>
                  <p className="text-gray-600">{protocol.sampleType}</p>
                </div>
                <div>
                  <span className="font-medium">Confidence:</span>
                  <p className={getConfidenceColor(protocol.confidence)}>
                    {Math.round(protocol.confidence * 100)}%
                  </p>
                </div>
                <div>
                  <span className="font-medium">Generated:</span>
                  <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Validation Status */}
      {validationStatus === 'validated' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Protocol Validated</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              This protocol has been validated against laboratory standards and safety requirements.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ProtocolViewer 
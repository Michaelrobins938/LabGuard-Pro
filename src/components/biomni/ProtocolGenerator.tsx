'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Beaker, Database, Cpu, Plus, X, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ProtocolGeneratorProps {
  onProtocolGenerated: (protocol: any) => void
  onValidationComplete?: (validation: any) => void
}

interface GeneratedProtocol {
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

export function ProtocolGenerator({ onProtocolGenerated, onValidationComplete }: ProtocolGeneratorProps) {
  const [objective, setObjective] = useState('')
  const [sampleType, setSampleType] = useState('')
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([])
  const [customTechnique, setCustomTechnique] = useState('')
  const [constraints, setConstraints] = useState<string[]>([])
  const [newConstraint, setNewConstraint] = useState('')
  const [safetyRequirements, setSafetyRequirements] = useState<string[]>([])
  const [newSafetyReq, setNewSafetyReq] = useState('')
  const [availableEquipment, setAvailableEquipment] = useState<string[]>([])
  const [newEquipment, setNewEquipment] = useState('')
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>([])
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)

  const availableTechniques = [
    'PCR Amplification',
    'DNA Extraction',
    'RNA Extraction',
    'Protein Purification',
    'Cell Culture',
    'Western Blot',
    'ELISA',
    'Flow Cytometry',
    'Microscopy',
    'Chromatography',
    'Mass Spectrometry',
    'Spectrophotometry',
    'Electrophoresis',
    'Immunofluorescence',
    'qPCR',
    'Northern Blot',
    'Southern Blot',
    'In Situ Hybridization',
    'Cell Transfection',
    'Protein Crystallization'
  ]

  const availableTools = [
    'protocol_design',
    'method_validation',
    'safety_assessment',
    'equipment_optimization',
    'quality_control',
    'reagent_optimization',
    'troubleshooting_guide',
    'cost_analysis',
    'time_optimization',
    'literature_review'
  ]

  const availableDatabases = [
    'Protocols.io',
    'Nature Protocols',
    'JoVE',
    'Cold Spring Harbor Protocols',
    'PubMed',
    'Springer Protocols',
    'Bio-protocol',
    'Protocol Exchange',
    'MethodsX',
    'Current Protocols'
  ]

  const sampleTypes = [
    'Bacterial Culture',
    'Cell Line',
    'Primary Cells',
    'Tissue Sample',
    'Blood Sample',
    'Plasma/Serum',
    'Urine Sample',
    'Plant Material',
    'Soil Sample',
    'Water Sample',
    'Food Sample',
    'Environmental Sample'
  ]

  const handleAddTechnique = () => {
    if (customTechnique.trim() && !selectedTechniques.includes(customTechnique.trim())) {
      setSelectedTechniques([...selectedTechniques, customTechnique.trim()])
      setCustomTechnique('')
    }
  }

  const handleRemoveTechnique = (technique: string) => {
    setSelectedTechniques(selectedTechniques.filter(t => t !== technique))
  }

  const handleAddConstraint = () => {
    if (newConstraint.trim() && !constraints.includes(newConstraint.trim())) {
      setConstraints([...constraints, newConstraint.trim()])
      setNewConstraint('')
    }
  }

  const handleRemoveConstraint = (constraint: string) => {
    setConstraints(constraints.filter(c => c !== constraint))
  }

  const handleAddSafetyReq = () => {
    if (newSafetyReq.trim() && !safetyRequirements.includes(newSafetyReq.trim())) {
      setSafetyRequirements([...safetyRequirements, newSafetyReq.trim()])
      setNewSafetyReq('')
    }
  }

  const handleRemoveSafetyReq = (req: string) => {
    setSafetyRequirements(safetyRequirements.filter(r => r !== req))
  }

  const handleAddEquipment = () => {
    if (newEquipment.trim() && !availableEquipment.includes(newEquipment.trim())) {
      setAvailableEquipment([...availableEquipment, newEquipment.trim()])
      setNewEquipment('')
    }
  }

  const handleRemoveEquipment = (equipment: string) => {
    setAvailableEquipment(availableEquipment.filter(e => e !== equipment))
  }

  const validateInputs = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!objective.trim()) {
      errors.push('Objective is required')
    }

    if (!sampleType) {
      errors.push('Sample type must be selected')
    }

    if (selectedTechniques.length === 0) {
      errors.push('At least one technique must be selected')
    }

    if (objective.trim().length < 20) {
      errors.push('Objective should be more detailed (at least 20 characters)')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const handleGenerateProtocol = async () => {
    const validation = validateInputs()
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/biomni/generate-protocol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          objective,
          sampleType,
          techniques: selectedTechniques,
          constraints,
          safetyRequirements,
          equipmentAvailable: availableEquipment,
          tools: selectedTools,
          databases: selectedDatabases,
          priority,
          context: 'laboratory_protocol_generation'
        })
      })

      if (!response.ok) {
        throw new Error(`Protocol generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      // Transform the response into our protocol format
      const protocol: GeneratedProtocol = {
        id: result.id || `protocol_${Date.now()}`,
        name: result.protocol?.name || 'AI-Generated Protocol',
        description: result.protocol?.description || result.summary || 'Generated experimental protocol',
        objective,
        sampleType,
        techniques: selectedTechniques,
        steps: result.protocol?.steps || [],
        reagents: result.protocol?.reagents || [],
        equipment: result.protocol?.equipment || [],
        safetyConsiderations: result.protocol?.safetyConsiderations || [],
        expectedResults: result.protocol?.expectedResults || [],
        qualityControls: result.protocol?.qualityControls || [],
        troubleshooting: result.protocol?.troubleshooting || [],
        estimatedTime: result.protocol?.estimatedTime || 'Not specified',
        estimatedCost: result.protocol?.estimatedCost || 'Not specified',
        confidence: result.confidence || 0.8,
        toolsUsed: result.toolsUsed || [],
        databasesQueried: result.databasesQueried || [],
        warnings: result.warnings || [],
        recommendations: result.recommendations || []
      }

      onProtocolGenerated(protocol)
      
      toast({
        title: "Protocol Generated Successfully",
        description: `Generated protocol with ${protocol.confidence * 100}% confidence`,
        variant: "default"
      })

    } catch (error) {
      console.error('Protocol generation failed:', error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Failed to generate protocol',
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleValidateProtocol = async () => {
    const validation = validateInputs()
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      })
      return
    }

    setValidating(true)
    
    try {
      const response = await fetch('/api/biomni/validate-protocol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          objective,
          sampleType,
          techniques: selectedTechniques,
          constraints,
          safetyRequirements,
          equipmentAvailable: availableEquipment
        })
      })

      if (!response.ok) {
        throw new Error(`Protocol validation failed: ${response.statusText}`)
      }

      const validationResult = await response.json()
      
      if (onValidationComplete) {
        onValidationComplete(validationResult)
      }

      toast({
        title: "Validation Complete",
        description: `Protocol feasibility: ${validationResult.feasibility || 'Unknown'}`,
        variant: "default"
      })

    } catch (error) {
      console.error('Protocol validation failed:', error)
      toast({
        title: "Validation Failed",
        description: error instanceof Error ? error.message : 'Failed to validate protocol',
        variant: "destructive"
      })
    } finally {
      setValidating(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Beaker className="w-6 h-6 text-blue-600" />
          <span>AI Protocol Generator</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Generate detailed experimental protocols using Stanford's Biomni AI system
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Objective */}
        <div className="space-y-2">
          <Label htmlFor="objective" className="text-sm font-medium">
            Experimental Objective *
          </Label>
          <Textarea
            id="objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Describe your experimental goal in detail. Example: Isolate and purify protein X from E. coli, including expression optimization and purification steps with >95% purity"
            rows={4}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Be specific about your goals, expected outcomes, and quality requirements
          </p>
        </div>

        {/* Sample Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sample Type *</Label>
          <Select value={sampleType} onValueChange={setSampleType}>
            <SelectTrigger>
              <SelectValue placeholder="Select sample type" />
            </SelectTrigger>
            <SelectContent>
              {sampleTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Techniques */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Techniques Required *
          </Label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableTechniques.map((technique) => (
              <div key={technique} className="flex items-center space-x-2">
                <Checkbox
                  id={technique}
                  checked={selectedTechniques.includes(technique)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTechniques([...selectedTechniques, technique])
                    } else {
                      handleRemoveTechnique(technique)
                    }
                  }}
                />
                <Label htmlFor={technique} className="text-sm">
                  {technique}
                </Label>
              </div>
            ))}
          </div>

          {/* Custom Technique */}
          <div className="flex space-x-2">
            <Input
              value={customTechnique}
              onChange={(e) => setCustomTechnique(e.target.value)}
              placeholder="Add custom technique"
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddTechnique}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected Techniques */}
          {selectedTechniques.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTechniques.map((technique) => (
                <Badge 
                  key={technique} 
                  variant="secondary" 
                  className="flex items-center space-x-1"
                >
                  <span>{technique}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => handleRemoveTechnique(technique)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Constraints */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Constraints & Limitations</Label>
          
          <div className="flex space-x-2">
            <Input
              value={newConstraint}
              onChange={(e) => setNewConstraint(e.target.value)}
              placeholder="Add constraint (e.g., no organic solvents, budget <$500)"
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddConstraint()}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddConstraint}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {constraints.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {constraints.map((constraint) => (
                <Badge 
                  key={constraint} 
                  variant="outline" 
                  className="flex items-center space-x-1"
                >
                  <span>{constraint}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => handleRemoveConstraint(constraint)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Safety Requirements */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Safety Requirements</Label>
          
          <div className="flex space-x-2">
            <Input
              value={newSafetyReq}
              onChange={(e) => setNewSafetyReq(e.target.value)}
              placeholder="Add safety requirement (e.g., BSL-2 facility required)"
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSafetyReq()}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddSafetyReq}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {safetyRequirements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {safetyRequirements.map((req) => (
                <Badge 
                  key={req} 
                  variant="outline" 
                  className="flex items-center space-x-1 border-red-200 text-red-700"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{req}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => handleRemoveSafetyReq(req)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Available Equipment */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Available Equipment</Label>
          
          <div className="flex space-x-2">
            <Input
              value={newEquipment}
              onChange={(e) => setNewEquipment(e.target.value)}
              placeholder="Add available equipment (e.g., HPLC, centrifuge)"
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddEquipment()}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddEquipment}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {availableEquipment.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableEquipment.map((equipment) => (
                <Badge 
                  key={equipment} 
                  variant="outline" 
                  className="flex items-center space-x-1 border-green-200 text-green-700"
                >
                  <span>{equipment}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => handleRemoveEquipment(equipment)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* AI Tools Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <Cpu className="w-4 h-4" />
            <span>AI Tools (Optional)</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {availableTools.map((tool) => (
              <div key={tool} className="flex items-center space-x-2">
                <Checkbox
                  id={tool}
                  checked={selectedTools.includes(tool)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTools([...selectedTools, tool])
                    } else {
                      setSelectedTools(selectedTools.filter(t => t !== tool))
                    }
                  }}
                />
                <Label htmlFor={tool} className="text-sm capitalize">
                  {tool.replace(/_/g, ' ')}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Database Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Knowledge Databases (Optional)</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {availableDatabases.map((db) => (
              <div key={db} className="flex items-center space-x-2">
                <Checkbox
                  id={db}
                  checked={selectedDatabases.includes(db)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedDatabases([...selectedDatabases, db])
                    } else {
                      setSelectedDatabases(selectedDatabases.filter(d => d !== db))
                    }
                  }}
                />
                <Label htmlFor={db} className="text-sm">
                  {db}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Priority Level</Label>
          <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - Standard processing</SelectItem>
              <SelectItem value="medium">Medium - Priority processing</SelectItem>
              <SelectItem value="high">High - Fast processing</SelectItem>
              <SelectItem value="critical">Critical - Immediate processing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button 
            onClick={handleValidateProtocol}
            variant="outline"
            disabled={loading || validating || !objective.trim() || !sampleType}
            className="flex-1"
          >
            {validating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Validate Feasibility
              </>
            )}
          </Button>

          <Button 
            onClick={handleGenerateProtocol}
            disabled={loading || validating || !objective.trim() || !sampleType || selectedTechniques.length === 0}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Protocol...
              </>
            ) : (
              <>
                <Beaker className="w-4 h-4 mr-2" />
                Generate Protocol with AI
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Tips for better protocols:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Be specific about your experimental objectives and quality requirements</li>
            <li>Include any time or budget constraints that may affect the protocol design</li>
            <li>Select relevant databases for domain-specific protocol recommendations</li>
            <li>Use validation to check protocol feasibility before full generation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProtocolGenerator 
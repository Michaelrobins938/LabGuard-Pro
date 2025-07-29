'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, AlertTriangle, Clock, User, TestTube, Thermometer } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PCRRunParameters {
  testType: string
  protocolVersion: string
  operatorId: string
  sampleVolume: string
  primerLot: string
  masterMixLot: string
  thermalProfile: string
  sampleCount: number
  controlsIncluded: string[]
  additionalControls: string
}

interface ValidationResult {
  status: 'PASS' | 'FAIL' | 'PENDING'
  discrepancies: string[]
  correctiveActions: string[]
  approvalCode?: string
  escalationTriggers: string[]
  optimizationSuggestions: string[]
}

export function PCRVerificationSystem() {
  const [parameters, setParameters] = useState<PCRRunParameters>({
    testType: '',
    protocolVersion: '',
    operatorId: '',
    sampleVolume: '',
    primerLot: '',
    masterMixLot: '',
    thermalProfile: '',
    sampleCount: 0,
    controlsIncluded: [],
    additionalControls: ''
  })

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [protocols, setProtocols] = useState<any[]>([])
  const [operators, setOperators] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Load available protocols and operators
    loadProtocols()
    loadOperators()
  }, [])

  const loadProtocols = async () => {
    try {
      const response = await fetch('/api/protocols')
      const data = await response.json()
      setProtocols(data.protocols || [])
    } catch (error) {
      console.error('Failed to load protocols:', error)
    }
  }

  const loadOperators = async () => {
    try {
      const response = await fetch('/api/operators')
      const data = await response.json()
      setOperators(data.operators || [])
    } catch (error) {
      console.error('Failed to load operators:', error)
    }
  }

  const validatePCRRun = async () => {
    setIsValidating(true)
    
    try {
      const response = await fetch('/api/compliance/pcr-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...parameters,
          timestamp: new Date().toISOString()
        }),
      })

      const result = await response.json()
      setValidationResult(result)

      if (result.status === 'PASS') {
        toast({
          title: 'PCR Run Approved',
          description: `Approval Code: ${result.approvalCode}`,
          variant: 'default',
        })
      } else {
        toast({
          title: 'PCR Run Validation Failed',
          description: `${result.discrepancies.length} discrepancies found`,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Validation failed:', error)
      toast({
        title: 'Validation Error',
        description: 'Failed to validate PCR run parameters',
        variant: 'destructive',
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleParameterChange = (field: keyof PCRRunParameters, value: any) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'FAIL':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'FAIL':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            PCR Run Setup Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testType">Test Type</Label>
              <Select value={parameters.testType} onValueChange={(value) => handleParameterChange('testType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="covid-19-rt-pcr">COVID-19 RT-PCR</SelectItem>
                  <SelectItem value="flu-a-b">Flu A/B</SelectItem>
                  <SelectItem value="rsv">RSV</SelectItem>
                  <SelectItem value="hiv-viral-load">HIV Viral Load</SelectItem>
                  <SelectItem value="hepatitis-c">Hepatitis C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="protocolVersion">Protocol Version</Label>
              <Select value={parameters.protocolVersion} onValueChange={(value) => handleParameterChange('protocolVersion', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select protocol version" />
                </SelectTrigger>
                <SelectContent>
                  {protocols.map((protocol) => (
                    <SelectItem key={protocol.id} value={protocol.version}>
                      {protocol.name} v{protocol.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatorId">Operator ID</Label>
              <Select value={parameters.operatorId} onValueChange={(value) => handleParameterChange('operatorId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((operator) => (
                    <SelectItem key={operator.id} value={operator.id}>
                      {operator.name} ({operator.certification})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sampleVolume">Sample Volume (μL)</Label>
              <Input
                id="sampleVolume"
                type="number"
                value={parameters.sampleVolume}
                onChange={(e) => handleParameterChange('sampleVolume', e.target.value)}
                placeholder="Enter sample volume"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primerLot">Primer/Probe Lot</Label>
              <Input
                id="primerLot"
                value={parameters.primerLot}
                onChange={(e) => handleParameterChange('primerLot', e.target.value)}
                placeholder="Enter primer lot number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="masterMixLot">Master Mix Lot</Label>
              <Input
                id="masterMixLot"
                value={parameters.masterMixLot}
                onChange={(e) => handleParameterChange('masterMixLot', e.target.value)}
                placeholder="Enter master mix lot number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thermalProfile">Thermal Profile</Label>
              <Select value={parameters.thermalProfile} onValueChange={(value) => handleParameterChange('thermalProfile', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select thermal profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard-40-cycle">Standard 40-Cycle</SelectItem>
                  <SelectItem value="rapid-30-cycle">Rapid 30-Cycle</SelectItem>
                  <SelectItem value="high-sensitivity-45-cycle">High Sensitivity 45-Cycle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sampleCount">Sample Count</Label>
              <Input
                id="sampleCount"
                type="number"
                value={parameters.sampleCount}
                onChange={(e) => handleParameterChange('sampleCount', parseInt(e.target.value))}
                placeholder="Number of samples"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Controls Included</Label>
            <div className="flex flex-wrap gap-2">
              {['NTC', 'PTC', 'LPC', 'HPC'].map((control) => (
                <Button
                  key={control}
                  variant={parameters.controlsIncluded.includes(control) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const updated = parameters.controlsIncluded.includes(control)
                      ? parameters.controlsIncluded.filter(c => c !== control)
                      : [...parameters.controlsIncluded, control]
                    handleParameterChange('controlsIncluded', updated)
                  }}
                >
                  {control}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalControls">Additional Controls</Label>
            <Textarea
              id="additionalControls"
              value={parameters.additionalControls}
              onChange={(e) => handleParameterChange('additionalControls', e.target.value)}
              placeholder="Enter any additional controls or notes"
            />
          </div>

          <Button 
            onClick={validatePCRRun} 
            disabled={isValidating}
            className="w-full"
          >
            {isValidating ? 'Validating...' : 'Validate PCR Run Setup'}
          </Button>
        </CardContent>
      </Card>

      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(validationResult.status)}
              Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge className={getStatusColor(validationResult.status)}>
              {validationResult.status}
            </Badge>

            {validationResult.status === 'PASS' && validationResult.approvalCode && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Approval Code:</strong> {validationResult.approvalCode}
                </AlertDescription>
              </Alert>
            )}

            {validationResult.discrepancies.length > 0 && (
              <div className="space-y-2">
                <Label>Discrepancies Found:</Label>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                  {validationResult.discrepancies.map((discrepancy, index) => (
                    <li key={index}>{discrepancy}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.correctiveActions.length > 0 && (
              <div className="space-y-2">
                <Label>Corrective Actions Required:</Label>
                <ul className="list-disc list-inside space-y-1 text-sm text-orange-600">
                  {validationResult.correctiveActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.escalationTriggers.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Escalation Triggers:
                </Label>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                  {validationResult.escalationTriggers.map((trigger, index) => (
                    <li key={index}>{trigger}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.optimizationSuggestions.length > 0 && (
              <div className="space-y-2">
                <Label>Optimization Suggestions:</Label>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-600">
                  {validationResult.optimizationSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
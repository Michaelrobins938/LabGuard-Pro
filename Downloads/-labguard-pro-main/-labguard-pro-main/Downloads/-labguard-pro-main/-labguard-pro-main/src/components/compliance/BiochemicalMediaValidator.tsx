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
import { CheckCircle, XCircle, AlertTriangle, Clock, Thermometer, Eye, Calendar } from 'lucide-react'

interface MediaParameters {
  testType: string
  lotNumber: string
  expirationDate: string
  currentDate: string
  tempLog: string
  visualNotes: string
  techId: string
  storageRequirements: string
  visualStandards: string
  qcFrequency: string
  sterilityMarkers: string
}

interface ValidationResult {
  status: 'APPROVE' | 'CONDITIONAL' | 'REJECT'
  reasoning: string
  actionsRequired: string[]
  documentation: string[]
  nextReviewDate?: string
  temperatureExcursion?: boolean
  visualContamination?: boolean
  qcOverdue?: boolean
  recallStatus?: string
}

export function BiochemicalMediaValidator() {
  const [parameters, setParameters] = useState<MediaParameters>({
    testType: '',
    lotNumber: '',
    expirationDate: '',
    currentDate: new Date().toISOString().split('T')[0],
    tempLog: '',
    visualNotes: '',
    techId: '',
    storageRequirements: '',
    visualStandards: '',
    qcFrequency: '',
    sterilityMarkers: ''
  })

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [testTypes, setTestTypes] = useState<any[]>([])

  useEffect(() => {
    loadTestTypes()
  }, [])

  const loadTestTypes = async () => {
    try {
      const response = await fetch('/api/test-types')
      const data = await response.json()
      setTestTypes(data.testTypes || [])
    } catch (error) {
      console.error('Failed to load test types:', error)
    }
  }

  const validateMedia = async () => {
    setIsValidating(true)
    
    try {
      const response = await fetch('/api/compliance/media-validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameters),
      })

      const result = await response.json()
      setValidationResult(result)
    } catch (error) {
      console.error('Validation failed:', error)
    } finally {
      setIsValidating(false)
    }
  }

  const handleParameterChange = (field: keyof MediaParameters, value: any) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVE':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'CONDITIONAL':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'REJECT':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'CONDITIONAL':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'REJECT':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const calculateDaysUntilExpiration = () => {
    const expDate = new Date(parameters.expirationDate)
    const currentDate = new Date(parameters.currentDate)
    const diffTime = expDate.getTime() - currentDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilExpiration = calculateDaysUntilExpiration()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Biochemical Media Safety Inspector
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
                  <SelectItem value="catalase">Catalase Test</SelectItem>
                  <SelectItem value="coagulase">Coagulase Test</SelectItem>
                  <SelectItem value="urease">Urease Test</SelectItem>
                  <SelectItem value="oxidase">Oxidase Test</SelectItem>
                  <SelectItem value="indole">Indole Test</SelectItem>
                  <SelectItem value="citrate">Citrate Utilization</SelectItem>
                  <SelectItem value="mrp">MR-VP Test</SelectItem>
                  <SelectItem value="tsi">TSI Agar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lotNumber">Media Lot Number</Label>
              <Input
                id="lotNumber"
                value={parameters.lotNumber}
                onChange={(e) => handleParameterChange('lotNumber', e.target.value)}
                placeholder="Enter lot number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                id="expirationDate"
                type="date"
                value={parameters.expirationDate}
                onChange={(e) => handleParameterChange('expirationDate', e.target.value)}
              />
              {daysUntilExpiration !== 0 && (
                <div className="text-sm">
                  {daysUntilExpiration > 0 ? (
                    <span className="text-green-600">
                      {daysUntilExpiration} days until expiration
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Expired {Math.abs(daysUntilExpiration)} days ago
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentDate">Current Date</Label>
              <Input
                id="currentDate"
                type="date"
                value={parameters.currentDate}
                onChange={(e) => handleParameterChange('currentDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="techId">Technician ID</Label>
              <Input
                id="techId"
                value={parameters.techId}
                onChange={(e) => handleParameterChange('techId', e.target.value)}
                placeholder="Enter technician ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageRequirements">Storage Requirements</Label>
              <Select value={parameters.storageRequirements} onValueChange={(value) => handleParameterChange('storageRequirements', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select storage requirements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-8c">2-8°C (Refrigerated)</SelectItem>
                  <SelectItem value="room-temp">Room Temperature (20-25°C)</SelectItem>
                  <SelectItem value="frozen">-20°C (Frozen)</SelectItem>
                  <SelectItem value="ultra-cold">-80°C (Ultra-cold)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tempLog">Temperature Log</Label>
            <Textarea
              id="tempLog"
              value={parameters.tempLog}
              onChange={(e) => handleParameterChange('tempLog', e.target.value)}
              placeholder="Enter temperature monitoring data (e.g., '2-8°C maintained for 30 days')"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visualNotes">Visual Inspection Notes</Label>
            <Textarea
              id="visualNotes"
              value={parameters.visualNotes}
              onChange={(e) => handleParameterChange('visualNotes', e.target.value)}
              placeholder="Describe visual appearance, any contamination, color changes, etc."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visualStandards">Visual Standards</Label>
              <Select value={parameters.visualStandards} onValueChange={(value) => handleParameterChange('visualStandards', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visual standards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear-yellow">Clear Yellow</SelectItem>
                  <SelectItem value="clear-pink">Clear Pink</SelectItem>
                  <SelectItem value="opaque-white">Opaque White</SelectItem>
                  <SelectItem value="clear-colorless">Clear Colorless</SelectItem>
                  <SelectItem value="red-pink">Red/Pink</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qcFrequency">QC Frequency</Label>
              <Select value={parameters.qcFrequency} onValueChange={(value) => handleParameterChange('qcFrequency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select QC frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="lot">Per Lot</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sterilityMarkers">Sterility Indicators</Label>
            <Textarea
              id="sterilityMarkers"
              value={parameters.sterilityMarkers}
              onChange={(e) => handleParameterChange('sterilityMarkers', e.target.value)}
              placeholder="Describe sterility indicators, growth patterns, etc."
              rows={2}
            />
          </div>

          <Button 
            onClick={validateMedia} 
            disabled={isValidating}
            className="w-full"
          >
            {isValidating ? 'Validating Media...' : 'Validate Media Safety'}
          </Button>
        </CardContent>
      </Card>

      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(validationResult.status)}
              Media Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge className={getStatusColor(validationResult.status)}>
              {validationResult.status}
            </Badge>

            <div className="space-y-2">
              <Label>Reasoning:</Label>
              <p className="text-sm text-gray-700">{validationResult.reasoning}</p>
            </div>

            {validationResult.actionsRequired.length > 0 && (
              <div className="space-y-2">
                <Label>Actions Required:</Label>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {validationResult.actionsRequired.map((action, index) => (
                    <li key={index} className="text-orange-600">{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.documentation.length > 0 && (
              <div className="space-y-2">
                <Label>Required Documentation:</Label>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {validationResult.documentation.map((doc, index) => (
                    <li key={index} className="text-blue-600">{doc}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.nextReviewDate && (
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  <strong>Next Review Date:</strong> {validationResult.nextReviewDate}
                </AlertDescription>
              </Alert>
            )}

            {validationResult.temperatureExcursion && (
              <Alert>
                <Thermometer className="h-4 w-4" />
                <AlertDescription>
                  Temperature excursion detected. Stability testing recommended.
                </AlertDescription>
              </Alert>
            )}

            {validationResult.visualContamination && (
              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  Visual contamination detected. Media must be discarded.
                </AlertDescription>
              </Alert>
            )}

            {validationResult.qcOverdue && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Quality control testing overdue. Perform QC before use.
                </AlertDescription>
              </Alert>
            )}

            {validationResult.recallStatus && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recall Status:</strong> {validationResult.recallStatus}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
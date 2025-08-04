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
import { CheckCircle, XCircle, AlertTriangle, Clock, Shield, Users, FileText, Calendar } from 'lucide-react'

interface IncidentDetails {
  incidentType: string
  incidentDateTime: string
  incidentLocation: string
  personnelList: string
  reporterId: string
  severityLevel: string
  immediateActions: string
  ppeDeployed: string
  containmentSteps: string
  notificationLog: string
  deconProcedure: string
  medicalAssessment: string
  responseTimeLimit: string
  notificationTimeframe: string
  rcaTimeframe: string
  applicableCapStandard: string
  internalSopNumber: string
  oshaStandards: string
  localRequirements: string
}

interface ComplianceResult {
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL_COMPLIANCE'
  criticalDeviations: string[]
  majorDeviations: string[]
  minorDeviations: string[]
  correctiveActions: string[]
  trainingNeeds: string[]
  followUpSchedule: string[]
  auditTrail: string[]
  complianceScore: number
  recommendations: string[]
}

export function CAPSafetyIncidentVerifier() {
  const [incidentDetails, setIncidentDetails] = useState<IncidentDetails>({
    incidentType: '',
    incidentDateTime: new Date().toISOString().slice(0, 16),
    incidentLocation: '',
    personnelList: '',
    reporterId: '',
    severityLevel: '',
    immediateActions: '',
    ppeDeployed: '',
    containmentSteps: '',
    notificationLog: '',
    deconProcedure: '',
    medicalAssessment: '',
    responseTimeLimit: '15',
    notificationTimeframe: '30',
    rcaTimeframe: '24',
    applicableCapStandard: '',
    internalSopNumber: '',
    oshaStandards: '',
    localRequirements: ''
  })

  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const verifyCompliance = async () => {
    setIsVerifying(true)
    
    try {
      const response = await fetch('/api/compliance/cap-incident-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incidentDetails),
      })

      const result = await response.json()
      setComplianceResult(result)
    } catch (error) {
      // Compliance verification failed
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDetailChange = (field: keyof IncidentDetails, value: any) => {
    setIncidentDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'PARTIAL_COMPLIANCE':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'NON_COMPLIANT':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PARTIAL_COMPLIANCE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'NON_COMPLIANT':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getComplianceScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            CAP Safety Incident Response Validator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="incidentType">Incident Type</Label>
              <Select value={incidentDetails.incidentType} onValueChange={(value) => handleDetailChange('incidentType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chemical-spill">Chemical Spill</SelectItem>
                  <SelectItem value="biological-exposure">Biological Exposure</SelectItem>
                  <SelectItem value="equipment-failure">Equipment Failure</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                  <SelectItem value="electrical-shock">Electrical Shock</SelectItem>
                  <SelectItem value="needlestick">Needlestick Injury</SelectItem>
                  <SelectItem value="slip-fall">Slip and Fall</SelectItem>
                  <SelectItem value="gas-leak">Gas Leak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incidentDateTime">Incident Date/Time</Label>
              <Input
                id="incidentDateTime"
                type="datetime-local"
                value={incidentDetails.incidentDateTime}
                onChange={(e) => handleDetailChange('incidentDateTime', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="incidentLocation">Incident Location</Label>
              <Input
                id="incidentLocation"
                value={incidentDetails.incidentLocation}
                onChange={(e) => handleDetailChange('incidentLocation', e.target.value)}
                placeholder="Enter incident location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="severityLevel">Severity Level</Label>
              <Select value={incidentDetails.severityLevel} onValueChange={(value) => handleDetailChange('severityLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reporterId">Incident Reporter ID</Label>
              <Input
                id="reporterId"
                value={incidentDetails.reporterId}
                onChange={(e) => handleDetailChange('reporterId', e.target.value)}
                placeholder="Enter reporter ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responseTimeLimit">Response Time Limit (minutes)</Label>
              <Input
                id="responseTimeLimit"
                type="number"
                value={incidentDetails.responseTimeLimit}
                onChange={(e) => handleDetailChange('responseTimeLimit', e.target.value)}
                placeholder="15"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personnelList">Personnel Involved</Label>
            <Textarea
              id="personnelList"
              value={incidentDetails.personnelList}
              onChange={(e) => handleDetailChange('personnelList', e.target.value)}
              placeholder="List all personnel involved in the incident"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="immediateActions">Immediate Actions Taken</Label>
            <Textarea
              id="immediateActions"
              value={incidentDetails.immediateActions}
              onChange={(e) => handleDetailChange('immediateActions', e.target.value)}
              placeholder="Describe immediate actions taken to secure safety"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ppeDeployed">PPE Used</Label>
              <Textarea
                id="ppeDeployed"
                value={incidentDetails.ppeDeployed}
                onChange={(e) => handleDetailChange('ppeDeployed', e.target.value)}
                placeholder="List PPE used during response"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="containmentSteps">Containment Measures</Label>
              <Textarea
                id="containmentSteps"
                value={incidentDetails.containmentSteps}
                onChange={(e) => handleDetailChange('containmentSteps', e.target.value)}
                placeholder="Describe containment measures taken"
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationLog">Notification Timeline</Label>
            <Textarea
              id="notificationLog"
              value={incidentDetails.notificationLog}
              onChange={(e) => handleDetailChange('notificationLog', e.target.value)}
              placeholder="Document notification timeline and contacts"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deconProcedure">Decontamination Protocol</Label>
              <Textarea
                id="deconProcedure"
                value={incidentDetails.deconProcedure}
                onChange={(e) => handleDetailChange('deconProcedure', e.target.value)}
                placeholder="Describe decontamination procedures used"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalAssessment">Medical Evaluation</Label>
              <Textarea
                id="medicalAssessment"
                value={incidentDetails.medicalAssessment}
                onChange={(e) => handleDetailChange('medicalAssessment', e.target.value)}
                placeholder="Document medical evaluations performed"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicableCapStandard">Applicable CAP Standard</Label>
              <Input
                id="applicableCapStandard"
                value={incidentDetails.applicableCapStandard}
                onChange={(e) => handleDetailChange('applicableCapStandard', e.target.value)}
                placeholder="e.g., CAP.ALL.2250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="internalSopNumber">Internal SOP Number</Label>
              <Input
                id="internalSopNumber"
                value={incidentDetails.internalSopNumber}
                onChange={(e) => handleDetailChange('internalSopNumber', e.target.value)}
                placeholder="e.g., SOP-EMG-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oshaStandards">OSHA Standards</Label>
              <Input
                id="oshaStandards"
                value={incidentDetails.oshaStandards}
                onChange={(e) => handleDetailChange('oshaStandards', e.target.value)}
                placeholder="e.g., 29 CFR 1910.1200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="localRequirements">Local Requirements</Label>
              <Input
                id="localRequirements"
                value={incidentDetails.localRequirements}
                onChange={(e) => handleDetailChange('localRequirements', e.target.value)}
                placeholder="Local regulatory requirements"
              />
            </div>
          </div>

          <Button 
            onClick={verifyCompliance} 
            disabled={isVerifying}
            className="w-full"
          >
            {isVerifying ? 'Verifying Compliance...' : 'Verify CAP Compliance'}
          </Button>
        </CardContent>
      </Card>

      {complianceResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(complianceResult.status)}
              Compliance Verification Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(complianceResult.status)}>
                {complianceResult.status.replace('_', ' ')}
              </Badge>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getComplianceScoreColor(complianceResult.complianceScore)}`}>
                  {complianceResult.complianceScore}%
                </div>
                <div className="text-sm text-gray-500">Compliance Score</div>
              </div>
            </div>

            {complianceResult.criticalDeviations.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Critical Deviations (Auto-fail):
                </Label>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                  {complianceResult.criticalDeviations.map((deviation, index) => (
                    <li key={index}>{deviation}</li>
                  ))}
                </ul>
              </div>
            )}

            {complianceResult.majorDeviations.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-4 w-4" />
                  Major Deviations (Corrective action required):
                </Label>
                <ul className="list-disc list-inside space-y-1 text-sm text-orange-600">
                  {complianceResult.majorDeviations.map((deviation, index) => (
                    <li key={index}>{deviation}</li>
                  ))}
                </ul>
              </div>
            )}

            {complianceResult.minorDeviations.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-yellow-600">
                  <Clock className="h-4 w-4" />
                  Minor Deviations (Monitor closely):
                </Label>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-600">
                  {complianceResult.minorDeviations.map((deviation, index) => (
                    <li key={index}>{deviation}</li>
                  ))}
                </ul>
              </div>
            )}

            {complianceResult.correctiveActions.length > 0 && (
              <div className="space-y-2">
                <Label>Corrective Actions Required:</Label>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {complianceResult.correctiveActions.map((action, index) => (
                    <li key={index} className="text-blue-600">{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {complianceResult.trainingNeeds.length > 0 && (
              <div className="space-y-2">
                <Label>Training Needs Identified:</Label>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {complianceResult.trainingNeeds.map((training, index) => (
                    <li key={index} className="text-purple-600">{training}</li>
                  ))}
                </ul>
              </div>
            )}

            {complianceResult.followUpSchedule.length > 0 && (
              <div className="space-y-2">
                <Label>Follow-up Schedule:</Label>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {complianceResult.followUpSchedule.map((schedule, index) => (
                    <li key={index} className="text-green-600">{schedule}</li>
                  ))}
                </ul>
              </div>
            )}

            {complianceResult.auditTrail.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Audit Trail Requirements:
                </Label>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {complianceResult.auditTrail.map((requirement, index) => (
                    <li key={index} className="text-gray-600">{requirement}</li>
                  ))}
                </ul>
              </div>
            )}

            {complianceResult.recommendations.length > 0 && (
              <div className="space-y-2">
                <Label>Recommendations:</Label>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {complianceResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-indigo-600">{recommendation}</li>
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
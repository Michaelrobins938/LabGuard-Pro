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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Package, 
  Shield, 
  Thermometer, 
  Users, 
  FileText, 
  Eye,
  Droplets,
  Split
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SampleData {
  sampleId: string
  sampleType: string
  collectionDateTime: string
  receivedDateTime: string
  testRequested: string
  transportConditions: string
  containerStatus: string
  volumeAdequate: boolean
  visualAppearance: string
  hemolysisGrade: string
  lipemiaStatus: string
  icterusGrade: string
  transportDuration: string
  storageTemp: string
  anticoagulant: string
  collectionMethod: string
  fastingStatus: string
  operator: string
  validationResults: any
}

interface ValidationResult {
  status: 'ACCEPTED' | 'REJECTED' | 'CONDITIONAL'
  qualityAssessment: string
  testingLimitations: string[]
  correctiveActions: string[]
  sampleIntegrity: string
  complianceLevel: string
  safetyStatus: string
}

export function SampleHandlingSystem() {
  const [activeTab, setActiveTab] = useState('pre-analytical')
  const [sampleData, setSampleData] = useState<SampleData>({
    sampleId: '',
    sampleType: '',
    collectionDateTime: '',
    receivedDateTime: '',
    testRequested: '',
    transportConditions: '',
    containerStatus: '',
    volumeAdequate: true,
    visualAppearance: '',
    hemolysisGrade: '',
    lipemiaStatus: '',
    icterusGrade: '',
    transportDuration: '',
    storageTemp: '',
    anticoagulant: '',
    collectionMethod: '',
    fastingStatus: '',
    operator: '',
    validationResults: null
  })
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const { toast } = useToast()

  const validateSample = async () => {
    setIsValidating(true)
    
    try {
      const response = await fetch('/api/compliance/sample-handling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sampleData,
          sampleHandlingType: activeTab,
          timestamp: new Date().toISOString()
        }),
      })

      const result = await response.json()
      setValidationResult(result)

      if (result.status === 'ACCEPTED') {
        toast({
          title: 'Sample Validated',
          description: 'Sample meets all quality requirements',
          variant: 'default',
        })
      } else {
        toast({
          title: 'Sample Issues Detected',
          description: `${result.correctiveActions.length} corrective actions required`,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Validation failed:', error)
      toast({
        title: 'Validation Error',
        description: 'Failed to validate sample handling',
        variant: 'destructive',
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleDataChange = (field: string, value: any) => {
    setSampleData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
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
            <Package className="h-5 w-5" />
            Sample Handling & Integrity Validation System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="pre-analytical" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Pre-Analytical
              </TabsTrigger>
              <TabsTrigger value="chain-custody" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Chain of Custody
              </TabsTrigger>
              <TabsTrigger value="storage-monitoring" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Storage
              </TabsTrigger>
              <TabsTrigger value="biohazard" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Biohazard
              </TabsTrigger>
              <TabsTrigger value="thaw-protocol" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Thaw Protocol
              </TabsTrigger>
              <TabsTrigger value="aliquoting" className="flex items-center gap-2">
                <Split className="h-4 w-4" />
                Aliquoting
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pre-analytical" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sampleId">Sample ID</Label>
                  <Input
                    id="sampleId"
                    value={sampleData.sampleId}
                    onChange={(e) => handleDataChange('sampleId', e.target.value)}
                    placeholder="Enter sample ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sampleType">Sample Type</Label>
                  <Select onValueChange={(value) => handleDataChange('sampleType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sample type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood">Blood</SelectItem>
                      <SelectItem value="urine">Urine</SelectItem>
                      <SelectItem value="serum">Serum</SelectItem>
                      <SelectItem value="plasma">Plasma</SelectItem>
                      <SelectItem value="cerebrospinal-fluid">Cerebrospinal Fluid</SelectItem>
                      <SelectItem value="tissue">Tissue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectionDateTime">Collection Date/Time</Label>
                  <Input
                    id="collectionDateTime"
                    type="datetime-local"
                    value={sampleData.collectionDateTime}
                    onChange={(e) => handleDataChange('collectionDateTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receivedDateTime">Received Date/Time</Label>
                  <Input
                    id="receivedDateTime"
                    type="datetime-local"
                    value={sampleData.receivedDateTime}
                    onChange={(e) => handleDataChange('receivedDateTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Visual Inspection</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="containerStatus">Container Integrity</Label>
                    <Select onValueChange={(value) => handleDataChange('containerStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select container status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intact">Intact</SelectItem>
                        <SelectItem value="cracked">Cracked</SelectItem>
                        <SelectItem value="leaking">Leaking</SelectItem>
                        <SelectItem value="contaminated">Contaminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volumeAdequate">Volume Adequate</Label>
                    <Select onValueChange={(value) => handleDataChange('volumeAdequate', value === 'true')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Is volume adequate?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visualAppearance">Visual Appearance</Label>
                    <Input
                      id="visualAppearance"
                      value={sampleData.visualAppearance}
                      onChange={(e) => handleDataChange('visualAppearance', e.target.value)}
                      placeholder="Describe visual appearance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hemolysisGrade">Hemolysis Grade</Label>
                    <Select onValueChange={(value) => handleDataChange('hemolysisGrade', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hemolysis grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Pre-Analytical Variables</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transportConditions">Transport Conditions</Label>
                    <Select onValueChange={(value) => handleDataChange('transportConditions', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport conditions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ambient">Ambient</SelectItem>
                        <SelectItem value="refrigerated">Refrigerated</SelectItem>
                        <SelectItem value="frozen">Frozen</SelectItem>
                        <SelectItem value="ice-pack">Ice Pack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anticoagulant">Anticoagulant</Label>
                    <Select onValueChange={(value) => handleDataChange('anticoagulant', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select anticoagulant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="heparin">Heparin</SelectItem>
                        <SelectItem value="edta">EDTA</SelectItem>
                        <SelectItem value="citrate">Citrate</SelectItem>
                        <SelectItem value="oxalate">Oxalate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collectionMethod">Collection Method</Label>
                    <Select onValueChange={(value) => handleDataChange('collectionMethod', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select collection method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venipuncture">Venipuncture</SelectItem>
                        <SelectItem value="fingerstick">Fingerstick</SelectItem>
                        <SelectItem value="catheter">Catheter</SelectItem>
                        <SelectItem value="midstream">Midstream</SelectItem>
                        <SelectItem value="catheterized">Catheterized</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fastingStatus">Fasting Status</Label>
                    <Select onValueChange={(value) => handleDataChange('fastingStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fasting status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fasting">Fasting</SelectItem>
                        <SelectItem value="non-fasting">Non-fasting</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chain-custody" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caseNumber">Case Number</Label>
                  <Input
                    id="caseNumber"
                    value={sampleData.sampleId}
                    onChange={(e) => handleDataChange('sampleId', e.target.value)}
                    placeholder="Enter case number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectingOfficer">Collecting Officer</Label>
                  <Input
                    id="collectingOfficer"
                    value={sampleData.operator}
                    onChange={(e) => handleDataChange('operator', e.target.value)}
                    placeholder="Enter collecting officer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evidenceType">Evidence Type</Label>
                  <Select onValueChange={(value) => handleDataChange('sampleType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select evidence type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood">Blood</SelectItem>
                      <SelectItem value="urine">Urine</SelectItem>
                      <SelectItem value="hair">Hair</SelectItem>
                      <SelectItem value="tissue">Tissue</SelectItem>
                      <SelectItem value="swab">Swab</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectionDateTime">Collection Date/Time</Label>
                  <Input
                    id="collectionDateTime"
                    type="datetime-local"
                    value={sampleData.collectionDateTime}
                    onChange={(e) => handleDataChange('collectionDateTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Custody Transfer Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transferFrom">Transfer From</Label>
                    <Input
                      id="transferFrom"
                      placeholder="Enter transfer from"
                      onChange={(e) => handleDataChange('transportConditions', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transferTo">Transfer To</Label>
                    <Input
                      id="transferTo"
                      placeholder="Enter transfer to"
                      onChange={(e) => handleDataChange('collectionMethod', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transferPurpose">Transfer Purpose</Label>
                    <Input
                      id="transferPurpose"
                      placeholder="Enter transfer purpose"
                      onChange={(e) => handleDataChange('anticoagulant', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transferCondition">Condition at Transfer</Label>
                    <Select onValueChange={(value) => handleDataChange('containerStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intact">Intact</SelectItem>
                        <SelectItem value="sealed">Sealed</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                        <SelectItem value="compromised">Compromised</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="storage-monitoring" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sampleList">Sample IDs</Label>
                  <Textarea
                    id="sampleList"
                    placeholder="Enter sample IDs (comma-separated)"
                    onChange={(e) => handleDataChange('sampleId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageLocation">Storage Location</Label>
                  <Input
                    id="storageLocation"
                    placeholder="Enter storage location"
                    onChange={(e) => handleDataChange('sampleType', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageTemp">Storage Temperature (°C)</Label>
                  <Input
                    id="storageTemp"
                    type="number"
                    step="0.1"
                    placeholder="-80"
                    onChange={(e) => handleDataChange('storageTemp', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageDuration">Storage Duration (hours)</Label>
                  <Input
                    id="storageDuration"
                    type="number"
                    placeholder="24"
                    onChange={(e) => handleDataChange('transportDuration', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Temperature Monitoring</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentTemp">Current Temperature (°C)</Label>
                    <Input
                      id="currentTemp"
                      type="number"
                      step="0.1"
                      placeholder="-79.5"
                      onChange={(e) => handleDataChange('visualAppearance', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempRange24h">Temperature Range 24h (°C)</Label>
                    <Input
                      id="tempRange24h"
                      placeholder="0.5"
                      onChange={(e) => handleDataChange('hemolysisGrade', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alarmEvents">Alarm Events</Label>
                    <Input
                      id="alarmEvents"
                      placeholder="Number of alarm events"
                      onChange={(e) => handleDataChange('lipemiaStatus', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="biohazard" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bslLevel">Biosafety Level</Label>
                  <Select onValueChange={(value) => handleDataChange('sampleType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select BSL level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bsl-1">BSL-1</SelectItem>
                      <SelectItem value="bsl-2">BSL-2</SelectItem>
                      <SelectItem value="bsl-3">BSL-3</SelectItem>
                      <SelectItem value="bsl-4">BSL-4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suspectedPathogen">Suspected Pathogen</Label>
                  <Input
                    id="suspectedPathogen"
                    placeholder="Enter suspected pathogen"
                    onChange={(e) => handleDataChange('testRequested', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specimenSource">Specimen Source</Label>
                  <Input
                    id="specimenSource"
                    placeholder="Enter specimen source"
                    onChange={(e) => handleDataChange('collectionMethod', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="handlerName">Handler Name</Label>
                  <Input
                    id="handlerName"
                    value={sampleData.operator}
                    onChange={(e) => handleDataChange('operator', e.target.value)}
                    placeholder="Enter handler name"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Safety Equipment Verification</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bscCertification">BSC Certification</Label>
                    <Select onValueChange={(value) => handleDataChange('containerStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select BSC status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="certified">Certified</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="not-certified">Not Certified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="airflowVelocity">Hood Airflow (fpm)</Label>
                    <Input
                      id="airflowVelocity"
                      type="number"
                      step="0.1"
                      placeholder="100"
                      onChange={(e) => handleDataChange('transportConditions', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hepaStatus">HEPA Filtration</Label>
                    <Select onValueChange={(value) => handleDataChange('anticoagulant', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select HEPA status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="functional">Functional</SelectItem>
                        <SelectItem value="needs-replacement">Needs Replacement</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pressureDifferential">Pressure Differential (Pa)</Label>
                    <Input
                      id="pressureDifferential"
                      type="number"
                      step="0.1"
                      placeholder="-25"
                      onChange={(e) => handleDataChange('fastingStatus', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="thaw-protocol" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sampleIds">Sample IDs</Label>
                  <Textarea
                    id="sampleIds"
                    placeholder="Enter sample IDs (comma-separated)"
                    onChange={(e) => handleDataChange('sampleId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frozenTemp">Frozen Temperature (°C)</Label>
                  <Input
                    id="frozenTemp"
                    type="number"
                    step="0.1"
                    placeholder="-80"
                    onChange={(e) => handleDataChange('storageTemp', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freezeDuration">Freeze Duration (days)</Label>
                  <Input
                    id="freezeDuration"
                    type="number"
                    placeholder="30"
                    onChange={(e) => handleDataChange('transportDuration', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thawMethod">Thaw Method</Label>
                  <Select onValueChange={(value) => handleDataChange('collectionMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select thaw method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="refrigerator">Refrigerator (2-8°C)</SelectItem>
                      <SelectItem value="room-temperature">Room Temperature</SelectItem>
                      <SelectItem value="water-bath">Water Bath (37°C)</SelectItem>
                      <SelectItem value="microwave">Microwave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Freeze/Thaw Cycle Tracking</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cycleCount">Previous Freeze/Thaw Cycles</Label>
                    <Input
                      id="cycleCount"
                      type="number"
                      placeholder="2"
                      onChange={(e) => handleDataChange('visualAppearance', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxCycles">Maximum Cycles Allowed</Label>
                    <Input
                      id="maxCycles"
                      type="number"
                      placeholder="3"
                      onChange={(e) => handleDataChange('hemolysisGrade', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initialFreezeDate">Initial Freeze Date</Label>
                    <Input
                      id="initialFreezeDate"
                      type="date"
                      onChange={(e) => handleDataChange('lipemiaStatus', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="aliquoting" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentSampleId">Parent Sample ID</Label>
                  <Input
                    id="parentSampleId"
                    value={sampleData.sampleId}
                    onChange={(e) => handleDataChange('sampleId', e.target.value)}
                    placeholder="Enter parent sample ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aliquotCount">Aliquot Count</Label>
                  <Input
                    id="aliquotCount"
                    type="number"
                    placeholder="5"
                    onChange={(e) => handleDataChange('transportDuration', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aliquotVolume">Aliquot Volume Each (μL)</Label>
                  <Input
                    id="aliquotVolume"
                    type="number"
                    step="0.1"
                    placeholder="100"
                    onChange={(e) => handleDataChange('storageTemp', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remainingVolume">Remaining Volume (μL)</Label>
                  <Input
                    id="remainingVolume"
                    type="number"
                    step="0.1"
                    placeholder="200"
                    onChange={(e) => handleDataChange('collectionMethod', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Volume Calculations</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="originalVolume">Original Sample Volume (μL)</Label>
                    <Input
                      id="originalVolume"
                      type="number"
                      step="0.1"
                      placeholder="700"
                      onChange={(e) => handleDataChange('visualAppearance', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalRequired">Total Volume Required (μL)</Label>
                    <Input
                      id="totalRequired"
                      type="number"
                      step="0.1"
                      placeholder="500"
                      onChange={(e) => handleDataChange('hemolysisGrade', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadVolume">Dead Volume Allowance (μL)</Label>
                    <Input
                      id="deadVolume"
                      type="number"
                      step="0.1"
                      placeholder="50"
                      onChange={(e) => handleDataChange('lipemiaStatus', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Quality Assurance</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volumeVerification">Volume Accuracy Check</Label>
                    <Select onValueChange={(value) => handleDataChange('containerStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select verification status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passed">Passed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="labelPosition">Label Placement Correct</Label>
                    <Select onValueChange={(value) => handleDataChange('anticoagulant', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select label status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="correct">Correct</SelectItem>
                        <SelectItem value="incorrect">Incorrect</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={validateSample} 
            disabled={isValidating}
            className="w-full mt-6"
          >
            {isValidating ? 'Validating...' : 'Validate Sample Handling'}
          </Button>
        </CardContent>
      </Card>

      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(validationResult.status)}
              Sample Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge className={getStatusColor(validationResult.status)}>
              {validationResult.status}
            </Badge>

            <div className="space-y-2">
              <Label>Quality Assessment</Label>
              <p className="text-sm text-gray-600">{validationResult.qualityAssessment}</p>
            </div>

            <div className="space-y-2">
              <Label>Sample Integrity</Label>
              <p className="text-sm text-gray-600">{validationResult.sampleIntegrity}</p>
            </div>

            <div className="space-y-2">
              <Label>Compliance Level</Label>
              <p className="text-sm text-gray-600">{validationResult.complianceLevel}</p>
            </div>

            <div className="space-y-2">
              <Label>Safety Status</Label>
              <p className="text-sm text-gray-600">{validationResult.safetyStatus}</p>
            </div>

            {validationResult.testingLimitations.length > 0 && (
              <div className="space-y-2">
                <Label>Testing Limitations:</Label>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-600">
                  {validationResult.testingLimitations.map((limitation, index) => (
                    <li key={index}>{limitation}</li>
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
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
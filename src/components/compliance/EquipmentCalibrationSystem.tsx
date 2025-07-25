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
  Scale, 
  Droplets, 
  RotateCcw, 
  Thermometer, 
  Zap, 
  Eye,
  Settings,
  Shield
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CalibrationData {
  equipmentId: string
  equipmentType: string
  modelSerial: string
  lastCalibration: string
  nextCalibration: string
  operator: string
  environmentalConditions: {
    temperature: string
    humidity: string
    vibration: string
  }
  performanceData: any
  validationResults: any
}

interface ValidationResult {
  status: 'PASS' | 'FAIL' | 'CONDITIONAL'
  performanceSummary: string
  correctiveActions: string[]
  nextVerification: string
  complianceLevel: string
  safetyStatus: string
}

export function EquipmentCalibrationSystem() {
  const [activeTab, setActiveTab] = useState('balance')
  const [calibrationData, setCalibrationData] = useState<CalibrationData>({
    equipmentId: '',
    equipmentType: '',
    modelSerial: '',
    lastCalibration: '',
    nextCalibration: '',
    operator: '',
    environmentalConditions: {
      temperature: '',
      humidity: '',
      vibration: ''
    },
    performanceData: {},
    validationResults: null
  })
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const { toast } = useToast()

  const validateCalibration = async () => {
    setIsValidating(true)
    
    try {
      const response = await fetch('/api/compliance/equipment-calibration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...calibrationData,
          equipmentType: activeTab,
          timestamp: new Date().toISOString()
        }),
      })

      const result = await response.json()
      setValidationResult(result)

      if (result.status === 'PASS') {
        toast({
          title: 'Calibration Validated',
          description: 'Equipment calibration meets all requirements',
          variant: 'default',
        })
      } else {
        toast({
          title: 'Calibration Issues Detected',
          description: `${result.correctiveActions.length} corrective actions required`,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Validation failed:', error)
      toast({
        title: 'Validation Error',
        description: 'Failed to validate equipment calibration',
        variant: 'destructive',
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleDataChange = (field: string, value: any) => {
    setCalibrationData(prev => ({
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
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
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
            <Settings className="h-5 w-5" />
            Equipment Calibration Validation System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="balance" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Balance
              </TabsTrigger>
              <TabsTrigger value="pipette" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Pipette
              </TabsTrigger>
              <TabsTrigger value="centrifuge" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Centrifuge
              </TabsTrigger>
              <TabsTrigger value="incubator" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Incubator
              </TabsTrigger>
              <TabsTrigger value="autoclave" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Autoclave
              </TabsTrigger>
              <TabsTrigger value="spectrophotometer" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Spectrophotometer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="balance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipmentId">Equipment ID</Label>
                  <Input
                    id="equipmentId"
                    value={calibrationData.equipmentId}
                    onChange={(e) => handleDataChange('equipmentId', e.target.value)}
                    placeholder="Enter equipment ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelSerial">Model/Serial</Label>
                  <Input
                    id="modelSerial"
                    value={calibrationData.modelSerial}
                    onChange={(e) => handleDataChange('modelSerial', e.target.value)}
                    placeholder="Enter model and serial number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastCalibration">Last Calibration Date</Label>
                  <Input
                    id="lastCalibration"
                    type="date"
                    value={calibrationData.lastCalibration}
                    onChange={(e) => handleDataChange('lastCalibration', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operator">Operator</Label>
                  <Input
                    id="operator"
                    value={calibrationData.operator}
                    onChange={(e) => handleDataChange('operator', e.target.value)}
                    placeholder="Enter operator name"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Performance Data</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linearity">Linearity Check (R²)</Label>
                    <Input
                      id="linearity"
                      type="number"
                      step="0.0001"
                      placeholder="0.9999"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        linearity: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repeatability">Repeatability SD (mg)</Label>
                    <Input
                      id="repeatability"
                      type="number"
                      step="0.01"
                      placeholder="0.05"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        repeatability: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accuracy">Accuracy Deviation (mg)</Label>
                    <Input
                      id="accuracy"
                      type="number"
                      step="0.01"
                      placeholder="0.08"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        accuracy: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Environmental Conditions</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder="22.5"
                      onChange={(e) => handleDataChange('environmentalConditions', {
                        ...calibrationData.environmentalConditions,
                        temperature: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity (%)</Label>
                    <Input
                      id="humidity"
                      type="number"
                      step="1"
                      placeholder="45"
                      onChange={(e) => handleDataChange('environmentalConditions', {
                        ...calibrationData.environmentalConditions,
                        humidity: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vibration">Vibration Level</Label>
                    <Select onValueChange={(value) => handleDataChange('environmentalConditions', {
                      ...calibrationData.environmentalConditions,
                      vibration: value
                    })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vibration level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pipette" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pipetteId">Pipette ID</Label>
                  <Input
                    id="pipetteId"
                    value={calibrationData.equipmentId}
                    onChange={(e) => handleDataChange('equipmentId', e.target.value)}
                    placeholder="Enter pipette ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volumeRange">Volume Range (μL)</Label>
                  <Input
                    id="volumeRange"
                    value={calibrationData.modelSerial}
                    onChange={(e) => handleDataChange('modelSerial', e.target.value)}
                    placeholder="e.g., 10-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testVolume">Test Volume (μL)</Label>
                  <Input
                    id="testVolume"
                    type="number"
                    step="0.1"
                    placeholder="50"
                    onChange={(e) => handleDataChange('performanceData', {
                      ...calibrationData.performanceData,
                      testVolume: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterTemp">Water Temperature (°C)</Label>
                  <Input
                    id="waterTemp"
                    type="number"
                    step="0.1"
                    placeholder="20.0"
                    onChange={(e) => handleDataChange('performanceData', {
                      ...calibrationData.performanceData,
                      waterTemp: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Performance Measurements</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meanVolume">Mean Volume (μL)</Label>
                    <Input
                      id="meanVolume"
                      type="number"
                      step="0.01"
                      placeholder="49.95"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        meanVolume: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standardDev">Standard Deviation</Label>
                    <Input
                      id="standardDev"
                      type="number"
                      step="0.001"
                      placeholder="0.025"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        standardDev: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvPercent">CV (%)</Label>
                    <Input
                      id="cvPercent"
                      type="number"
                      step="0.01"
                      placeholder="0.05"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        cvPercent: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="centrifuge" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="centrifugeModel">Centrifuge Model</Label>
                  <Input
                    id="centrifugeModel"
                    value={calibrationData.modelSerial}
                    onChange={(e) => handleDataChange('modelSerial', e.target.value)}
                    placeholder="Enter centrifuge model"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rotorId">Rotor ID</Label>
                  <Input
                    id="rotorId"
                    value={calibrationData.equipmentId}
                    onChange={(e) => handleDataChange('equipmentId', e.target.value)}
                    placeholder="Enter rotor ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSpeed">Max Speed (RPM)</Label>
                  <Input
                    id="maxSpeed"
                    type="number"
                    placeholder="15000"
                    onChange={(e) => handleDataChange('performanceData', {
                      ...calibrationData.performanceData,
                      maxSpeed: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testSpeed">Test Speed (RPM)</Label>
                  <Input
                    id="testSpeed"
                    type="number"
                    placeholder="10000"
                    onChange={(e) => handleDataChange('performanceData', {
                      ...calibrationData.performanceData,
                      testSpeed: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Performance Measurements</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="measuredSpeed">Measured Speed (RPM)</Label>
                    <Input
                      id="measuredSpeed"
                      type="number"
                      placeholder="10005"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        measuredSpeed: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calculatedRCF">Calculated RCF</Label>
                    <Input
                      id="calculatedRCF"
                      type="number"
                      step="0.1"
                      placeholder="11200.5"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        calculatedRCF: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempIncrease">Temperature Rise (°C)</Label>
                    <Input
                      id="tempIncrease"
                      type="number"
                      step="0.1"
                      placeholder="5.2"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        tempIncrease: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="incubator" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incubatorId">Incubator ID</Label>
                  <Input
                    id="incubatorId"
                    value={calibrationData.equipmentId}
                    onChange={(e) => handleDataChange('equipmentId', e.target.value)}
                    placeholder="Enter incubator ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetTemp">Target Temperature (°C)</Label>
                  <Input
                    id="targetTemp"
                    type="number"
                    step="0.1"
                    placeholder="37.0"
                    onChange={(e) => handleDataChange('performanceData', {
                      ...calibrationData.performanceData,
                      targetTemp: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mappingDuration">Mapping Duration (hours)</Label>
                  <Input
                    id="mappingDuration"
                    type="number"
                    placeholder="24"
                    onChange={(e) => handleDataChange('performanceData', {
                      ...calibrationData.performanceData,
                      mappingDuration: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probePositions">Number of Probe Positions</Label>
                  <Input
                    id="probePositions"
                    type="number"
                    placeholder="9"
                    onChange={(e) => handleDataChange('performanceData', {
                      ...calibrationData.performanceData,
                      probePositions: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Temperature Data</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meanTemp">Mean Temperature (°C)</Label>
                    <Input
                      id="meanTemp"
                      type="number"
                      step="0.01"
                      placeholder="37.02"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        meanTemp: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempRange">Temperature Range (°C)</Label>
                    <Input
                      id="tempRange"
                      type="number"
                      step="0.01"
                      placeholder="0.8"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        tempRange: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uniformityIndex">Uniformity Index</Label>
                    <Input
                      id="uniformityIndex"
                      type="number"
                      step="0.01"
                      placeholder="0.4"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        uniformityIndex: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="autoclave" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="autoclaveId">Autoclave ID</Label>
                  <Input
                    id="autoclaveId"
                    value={calibrationData.equipmentId}
                    onChange={(e) => handleDataChange('equipmentId', e.target.value)}
                    placeholder="Enter autoclave ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cycleType">Cycle Type</Label>
                  <Select onValueChange={(value) => handleDataChange('performanceData', {
                    ...calibrationData.performanceData,
                    cycleType: value
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cycle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gravity">Gravity</SelectItem>
                      <SelectItem value="pre-vacuum">Pre-vacuum</SelectItem>
                      <SelectItem value="liquid">Liquid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempSetting">Temperature Setting (°C)</Label>
                  <Input
                    id="tempSetting"
                    type="number"
                    placeholder="121"
                    onChange={(e) => handleDataChange('performanceData', {
                      ...calibrationData.performanceData,
                      tempSetting: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exposureTime">Exposure Time (minutes)</Label>
                  <Input
                    id="exposureTime"
                    type="number"
                    placeholder="15"
                    onChange={(e) => handleDataChange('performanceData', {
                      ...calibrationData.performanceData,
                      exposureTime: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Physical Parameters</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="actualTemp">Achieved Temperature (°C)</Label>
                    <Input
                      id="actualTemp"
                      type="number"
                      step="0.1"
                      placeholder="121.5"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        actualTemp: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actualPressure">Achieved Pressure (psi)</Label>
                    <Input
                      id="actualPressure"
                      type="number"
                      step="0.1"
                      placeholder="15.5"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        actualPressure: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actualExposure">Actual Exposure (minutes)</Label>
                    <Input
                      id="actualExposure"
                      type="number"
                      step="0.1"
                      placeholder="15.2"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        actualExposure: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Biological Indicators</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="biType">BI Type</Label>
                    <Input
                      id="biType"
                      placeholder="Geobacillus stearothermophilus"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        biType: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biResults">BI Results</Label>
                    <Select onValueChange={(value) => handleDataChange('performanceData', {
                      ...calibrationData.performanceData,
                      biResults: value
                    })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select BI results" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="negative">Negative (No Growth)</SelectItem>
                        <SelectItem value="positive">Positive (Growth)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="spectrophotometer" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instrumentModel">Instrument Model</Label>
                  <Input
                    id="instrumentModel"
                    value={calibrationData.modelSerial}
                    onChange={(e) => handleDataChange('modelSerial', e.target.value)}
                    placeholder="Enter instrument model"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={calibrationData.equipmentId}
                    onChange={(e) => handleDataChange('equipmentId', e.target.value)}
                    placeholder="Enter serial number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wavelengthRange">Wavelength Range (nm)</Label>
                  <Input
                    id="wavelengthRange"
                    placeholder="190-900"
                    onChange={(e) => handleDataChange('performanceData', {
                      ...calibrationData.performanceData,
                      wavelengthRange: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operator">Operator</Label>
                  <Input
                    id="operator"
                    value={calibrationData.operator}
                    onChange={(e) => handleDataChange('operator', e.target.value)}
                    placeholder="Enter operator name"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Wavelength Accuracy</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wavelengthStandard">Reference Material</Label>
                    <Input
                      id="wavelengthStandard"
                      placeholder="Holmium oxide"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        wavelengthStandard: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedPeaks">Expected Peaks (nm)</Label>
                    <Input
                      id="expectedPeaks"
                      placeholder="361.5, 536.2, 640.5"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        expectedPeaks: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wavelengthError">Wavelength Error (nm)</Label>
                    <Input
                      id="wavelengthError"
                      type="number"
                      step="0.1"
                      placeholder="0.5"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        wavelengthError: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Photometric Accuracy</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedAbs">Expected Absorbance</Label>
                    <Input
                      id="expectedAbs"
                      type="number"
                      step="0.001"
                      placeholder="0.500"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        expectedAbs: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="measuredAbs">Measured Absorbance</Label>
                    <Input
                      id="measuredAbs"
                      type="number"
                      step="0.001"
                      placeholder="0.498"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        measuredAbs: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photometricError">Photometric Error</Label>
                    <Input
                      id="photometricError"
                      type="number"
                      step="0.001"
                      placeholder="0.002"
                      onChange={(e) => handleDataChange('performanceData', {
                        ...calibrationData.performanceData,
                        photometricError: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={validateCalibration} 
            disabled={isValidating}
            className="w-full mt-6"
          >
            {isValidating ? 'Validating...' : 'Validate Equipment Calibration'}
          </Button>
        </CardContent>
      </Card>

      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(validationResult.status)}
              Calibration Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge className={getStatusColor(validationResult.status)}>
              {validationResult.status}
            </Badge>

            <div className="space-y-2">
              <Label>Performance Summary</Label>
              <p className="text-sm text-gray-600">{validationResult.performanceSummary}</p>
            </div>

            <div className="space-y-2">
              <Label>Compliance Level</Label>
              <p className="text-sm text-gray-600">{validationResult.complianceLevel}</p>
            </div>

            <div className="space-y-2">
              <Label>Safety Status</Label>
              <p className="text-sm text-gray-600">{validationResult.safetyStatus}</p>
            </div>

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

            <div className="space-y-2">
              <Label>Next Verification Due</Label>
              <p className="text-sm text-gray-600">{validationResult.nextVerification}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
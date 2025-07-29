'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  TrendingUp,
  Activity,
  Shield,
  BarChart3,
  AlertCircle,
  Users
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ValidationResult {
  status: 'pass' | 'fail' | 'warning';
  message: string;
  correctiveActions: string[];
  complianceLevel: number;
  timestamp: string;
  details: Record<string, any>;
}

const ResultValidationSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('critical-value');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, ValidationResult>>({});

  const handleValidation = async (toolType: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/compliance/result-validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolType, data }),
      });

      if (!response.ok) throw new Error('Validation failed');
      
      const result = await response.json();
      setResults(prev => ({ ...prev, [toolType]: result }));
      
      toast({
        title: result.status === 'pass' ? 'Validation Passed' : 'Validation Issues Found',
        description: result.message,
        variant: result.status === 'pass' ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Validation Error',
        description: 'Failed to perform validation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const CriticalValueAlert = () => {
    const [formData, setFormData] = useState({
      testName: '',
      result: '',
      unit: '',
      criticalLow: '',
      criticalHigh: '',
      patientId: '',
      orderingPhysician: '',
      notificationMethod: 'phone',
      escalationTime: '15',
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Critical Value Alert System
          </CardTitle>
          <CardDescription>
            Validate critical value detection, notification protocols, and escalation procedures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Test Name</Label>
              <Input
                value={formData.testName}
                onChange={(e) => setFormData(prev => ({ ...prev, testName: e.target.value }))}
                placeholder="e.g., Potassium, Troponin"
              />
            </div>
            <div>
              <Label>Result Value</Label>
              <Input
                value={formData.result}
                onChange={(e) => setFormData(prev => ({ ...prev, result: e.target.value }))}
                placeholder="e.g., 2.1"
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Input
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="e.g., mmol/L"
              />
            </div>
            <div>
              <Label>Critical Low</Label>
              <Input
                value={formData.criticalLow}
                onChange={(e) => setFormData(prev => ({ ...prev, criticalLow: e.target.value }))}
                placeholder="e.g., 3.5"
              />
            </div>
            <div>
              <Label>Critical High</Label>
              <Input
                value={formData.criticalHigh}
                onChange={(e) => setFormData(prev => ({ ...prev, criticalHigh: e.target.value }))}
                placeholder="e.g., 6.0"
              />
            </div>
            <div>
              <Label>Patient ID</Label>
              <Input
                value={formData.patientId}
                onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                placeholder="e.g., P12345"
              />
            </div>
            <div>
              <Label>Ordering Physician</Label>
              <Input
                value={formData.orderingPhysician}
                onChange={(e) => setFormData(prev => ({ ...prev, orderingPhysician: e.target.value }))}
                placeholder="e.g., Dr. Smith"
              />
            </div>
            <div>
              <Label>Notification Method</Label>
              <Select value={formData.notificationMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, notificationMethod: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="pager">Pager</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Escalation Time (minutes)</Label>
              <Input
                value={formData.escalationTime}
                onChange={(e) => setFormData(prev => ({ ...prev, escalationTime: e.target.value }))}
                placeholder="15"
              />
            </div>
          </div>
          
          <Button 
            onClick={() => handleValidation('critical-value', formData)}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Validating...' : 'Validate Critical Value Alert'}
          </Button>

          {results['critical-value'] && (
            <Alert variant={results['critical-value'].status === 'pass' ? 'default' : 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">{results['critical-value'].message}</div>
                <div className="mt-2">
                  <strong>Compliance Level:</strong> {results['critical-value'].complianceLevel}%
                </div>
                {results['critical-value'].correctiveActions.length > 0 && (
                  <div className="mt-2">
                    <strong>Corrective Actions:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {results['critical-value'].correctiveActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  const QCEvaluation = () => {
    const [formData, setFormData] = useState({
      qcLevel: 'level1',
      analyte: '',
      targetValue: '',
      observedValue: '',
      standardDeviation: '',
      westgardRules: ['1-2s', '1-3s'],
      lotNumber: '',
      expirationDate: '',
      frequency: 'daily',
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            QC Evaluation System
          </CardTitle>
          <CardDescription>
            Validate quality control performance, Westgard rules, and statistical analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>QC Level</Label>
              <Select value={formData.qcLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, qcLevel: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="level1">Level 1 (Low)</SelectItem>
                  <SelectItem value="level2">Level 2 (Normal)</SelectItem>
                  <SelectItem value="level3">Level 3 (High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Analyte</Label>
              <Input
                value={formData.analyte}
                onChange={(e) => setFormData(prev => ({ ...prev, analyte: e.target.value }))}
                placeholder="e.g., Glucose, Hemoglobin"
              />
            </div>
            <div>
              <Label>Target Value</Label>
              <Input
                value={formData.targetValue}
                onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))}
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <Label>Observed Value</Label>
              <Input
                value={formData.observedValue}
                onChange={(e) => setFormData(prev => ({ ...prev, observedValue: e.target.value }))}
                placeholder="e.g., 98"
              />
            </div>
            <div>
              <Label>Standard Deviation</Label>
              <Input
                value={formData.standardDeviation}
                onChange={(e) => setFormData(prev => ({ ...prev, standardDeviation: e.target.value }))}
                placeholder="e.g., 2.5"
              />
            </div>
            <div>
              <Label>Lot Number</Label>
              <Input
                value={formData.lotNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, lotNumber: e.target.value }))}
                placeholder="e.g., QC2024001"
              />
            </div>
            <div>
              <Label>Expiration Date</Label>
              <Input
                value={formData.expirationDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                placeholder="2024-12-31"
                type="date"
              />
            </div>
            <div>
              <Label>Frequency</Label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={() => handleValidation('qc-evaluation', formData)}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Validating...' : 'Validate QC Evaluation'}
          </Button>

          {results['qc-evaluation'] && (
            <Alert variant={results['qc-evaluation'].status === 'pass' ? 'default' : 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">{results['qc-evaluation'].message}</div>
                <div className="mt-2">
                  <strong>Compliance Level:</strong> {results['qc-evaluation'].complianceLevel}%
                </div>
                {results['qc-evaluation'].correctiveActions.length > 0 && (
                  <div className="mt-2">
                    <strong>Corrective Actions:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {results['qc-evaluation'].correctiveActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  const ReferenceIntervalValidation = () => {
    const [formData, setFormData] = useState({
      analyte: '',
      patientAge: '',
      patientGender: 'male',
      patientPopulation: 'adult',
      result: '',
      unit: '',
      referenceLow: '',
      referenceHigh: '',
      clinicalSignificance: '',
      method: '',
      instrument: '',
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Reference Interval Validation
          </CardTitle>
          <CardDescription>
            Validate reference interval appropriateness, population-specific ranges, and clinical interpretation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Analyte</Label>
              <Input
                value={formData.analyte}
                onChange={(e) => setFormData(prev => ({ ...prev, analyte: e.target.value }))}
                placeholder="e.g., Creatinine, Hemoglobin"
              />
            </div>
            <div>
              <Label>Patient Age</Label>
              <Input
                value={formData.patientAge}
                onChange={(e) => setFormData(prev => ({ ...prev, patientAge: e.target.value }))}
                placeholder="e.g., 45"
              />
            </div>
            <div>
              <Label>Patient Gender</Label>
              <Select value={formData.patientGender} onValueChange={(value) => setFormData(prev => ({ ...prev, patientGender: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Patient Population</Label>
              <Select value={formData.patientPopulation} onValueChange={(value) => setFormData(prev => ({ ...prev, patientPopulation: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pediatric">Pediatric</SelectItem>
                  <SelectItem value="adult">Adult</SelectItem>
                  <SelectItem value="geriatric">Geriatric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Result Value</Label>
              <Input
                value={formData.result}
                onChange={(e) => setFormData(prev => ({ ...prev, result: e.target.value }))}
                placeholder="e.g., 1.2"
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Input
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="e.g., mg/dL"
              />
            </div>
            <div>
              <Label>Reference Low</Label>
              <Input
                value={formData.referenceLow}
                onChange={(e) => setFormData(prev => ({ ...prev, referenceLow: e.target.value }))}
                placeholder="e.g., 0.6"
              />
            </div>
            <div>
              <Label>Reference High</Label>
              <Input
                value={formData.referenceHigh}
                onChange={(e) => setFormData(prev => ({ ...prev, referenceHigh: e.target.value }))}
                placeholder="e.g., 1.3"
              />
            </div>
            <div>
              <Label>Method</Label>
              <Input
                value={formData.method}
                onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                placeholder="e.g., Jaffe, Enzymatic"
              />
            </div>
            <div>
              <Label>Instrument</Label>
              <Input
                value={formData.instrument}
                onChange={(e) => setFormData(prev => ({ ...prev, instrument: e.target.value }))}
                placeholder="e.g., Cobas c501"
              />
            </div>
          </div>
          
          <div>
            <Label>Clinical Significance</Label>
            <Textarea
              value={formData.clinicalSignificance}
              onChange={(e) => setFormData(prev => ({ ...prev, clinicalSignificance: e.target.value }))}
              placeholder="Describe clinical significance of the result..."
            />
          </div>
          
          <Button 
            onClick={() => handleValidation('reference-interval', formData)}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Validating...' : 'Validate Reference Interval'}
          </Button>

          {results['reference-interval'] && (
            <Alert variant={results['reference-interval'].status === 'pass' ? 'default' : 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">{results['reference-interval'].message}</div>
                <div className="mt-2">
                  <strong>Compliance Level:</strong> {results['reference-interval'].complianceLevel}%
                </div>
                {results['reference-interval'].correctiveActions.length > 0 && (
                  <div className="mt-2">
                    <strong>Corrective Actions:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {results['reference-interval'].correctiveActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  const InterLaboratoryComparison = () => {
    const [formData, setFormData] = useState({
      programName: '',
      analyte: '',
      labResult: '',
      peerGroupMean: '',
      peerGroupSD: '',
      zScore: '',
      acceptabilityCriteria: '',
      method: '',
      instrument: '',
      participationDate: '',
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Inter-Laboratory Comparison
          </CardTitle>
          <CardDescription>
            Validate proficiency testing performance, peer group comparison, and method validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Program Name</Label>
              <Input
                value={formData.programName}
                onChange={(e) => setFormData(prev => ({ ...prev, programName: e.target.value }))}
                placeholder="e.g., CAP, CLIA"
              />
            </div>
            <div>
              <Label>Analyte</Label>
              <Input
                value={formData.analyte}
                onChange={(e) => setFormData(prev => ({ ...prev, analyte: e.target.value }))}
                placeholder="e.g., Glucose, Sodium"
              />
            </div>
            <div>
              <Label>Lab Result</Label>
              <Input
                value={formData.labResult}
                onChange={(e) => setFormData(prev => ({ ...prev, labResult: e.target.value }))}
                placeholder="e.g., 95"
              />
            </div>
            <div>
              <Label>Peer Group Mean</Label>
              <Input
                value={formData.peerGroupMean}
                onChange={(e) => setFormData(prev => ({ ...prev, peerGroupMean: e.target.value }))}
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <Label>Peer Group SD</Label>
              <Input
                value={formData.peerGroupSD}
                onChange={(e) => setFormData(prev => ({ ...prev, peerGroupSD: e.target.value }))}
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <Label>Z-Score</Label>
              <Input
                value={formData.zScore}
                onChange={(e) => setFormData(prev => ({ ...prev, zScore: e.target.value }))}
                placeholder="e.g., -1.0"
              />
            </div>
            <div>
              <Label>Acceptability Criteria</Label>
              <Input
                value={formData.acceptabilityCriteria}
                onChange={(e) => setFormData(prev => ({ ...prev, acceptabilityCriteria: e.target.value }))}
                placeholder="e.g., ±2.0"
              />
            </div>
            <div>
              <Label>Method</Label>
              <Input
                value={formData.method}
                onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                placeholder="e.g., Hexokinase"
              />
            </div>
            <div>
              <Label>Instrument</Label>
              <Input
                value={formData.instrument}
                onChange={(e) => setFormData(prev => ({ ...prev, instrument: e.target.value }))}
                placeholder="e.g., Cobas c501"
              />
            </div>
            <div>
              <Label>Participation Date</Label>
              <Input
                value={formData.participationDate}
                onChange={(e) => setFormData(prev => ({ ...prev, participationDate: e.target.value }))}
                placeholder="2024-01-15"
                type="date"
              />
            </div>
          </div>
          
          <Button 
            onClick={() => handleValidation('inter-laboratory', formData)}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Validating...' : 'Validate Inter-Laboratory Comparison'}
          </Button>

          {results['inter-laboratory'] && (
            <Alert variant={results['inter-laboratory'].status === 'pass' ? 'default' : 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">{results['inter-laboratory'].message}</div>
                <div className="mt-2">
                  <strong>Compliance Level:</strong> {results['inter-laboratory'].complianceLevel}%
                </div>
                {results['inter-laboratory'].correctiveActions.length > 0 && (
                  <div className="mt-2">
                    <strong>Corrective Actions:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {results['inter-laboratory'].correctiveActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  const DeltaCheck = () => {
    const [formData, setFormData] = useState({
      analyte: '',
      currentResult: '',
      previousResult: '',
      timeInterval: '',
      deltaThreshold: '',
      clinicalSignificance: '',
      patientId: '',
      specimenType: '',
      method: '',
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            Delta Check System
          </CardTitle>
          <CardDescription>
            Validate result consistency, change detection, and clinical significance assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Analyte</Label>
              <Input
                value={formData.analyte}
                onChange={(e) => setFormData(prev => ({ ...prev, analyte: e.target.value }))}
                placeholder="e.g., Creatinine, Hemoglobin"
              />
            </div>
            <div>
              <Label>Current Result</Label>
              <Input
                value={formData.currentResult}
                onChange={(e) => setFormData(prev => ({ ...prev, currentResult: e.target.value }))}
                placeholder="e.g., 1.5"
              />
            </div>
            <div>
              <Label>Previous Result</Label>
              <Input
                value={formData.previousResult}
                onChange={(e) => setFormData(prev => ({ ...prev, previousResult: e.target.value }))}
                placeholder="e.g., 1.2"
              />
            </div>
            <div>
              <Label>Time Interval (days)</Label>
              <Input
                value={formData.timeInterval}
                onChange={(e) => setFormData(prev => ({ ...prev, timeInterval: e.target.value }))}
                placeholder="e.g., 7"
              />
            </div>
            <div>
              <Label>Delta Threshold (%)</Label>
              <Input
                value={formData.deltaThreshold}
                onChange={(e) => setFormData(prev => ({ ...prev, deltaThreshold: e.target.value }))}
                placeholder="e.g., 25"
              />
            </div>
            <div>
              <Label>Patient ID</Label>
              <Input
                value={formData.patientId}
                onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                placeholder="e.g., P12345"
              />
            </div>
            <div>
              <Label>Specimen Type</Label>
              <Input
                value={formData.specimenType}
                onChange={(e) => setFormData(prev => ({ ...prev, specimenType: e.target.value }))}
                placeholder="e.g., Serum, Plasma"
              />
            </div>
            <div>
              <Label>Method</Label>
              <Input
                value={formData.method}
                onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                placeholder="e.g., Jaffe, Enzymatic"
              />
            </div>
          </div>
          
          <div>
            <Label>Clinical Significance</Label>
            <Textarea
              value={formData.clinicalSignificance}
              onChange={(e) => setFormData(prev => ({ ...prev, clinicalSignificance: e.target.value }))}
              placeholder="Describe clinical significance of the change..."
            />
          </div>
          
          <Button 
            onClick={() => handleValidation('delta-check', formData)}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Validating...' : 'Validate Delta Check'}
          </Button>

          {results['delta-check'] && (
            <Alert variant={results['delta-check'].status === 'pass' ? 'default' : 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">{results['delta-check'].message}</div>
                <div className="mt-2">
                  <strong>Compliance Level:</strong> {results['delta-check'].complianceLevel}%
                </div>
                {results['delta-check'].correctiveActions.length > 0 && (
                  <div className="mt-2">
                    <strong>Corrective Actions:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {results['delta-check'].correctiveActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Result Validation System</h1>
          <p className="text-muted-foreground">
            Comprehensive validation tools for laboratory result quality and compliance
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          5 Tools Available
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="critical-value" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Critical Values
          </TabsTrigger>
          <TabsTrigger value="qc-evaluation" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            QC Evaluation
          </TabsTrigger>
          <TabsTrigger value="reference-interval" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Reference Intervals
          </TabsTrigger>
          <TabsTrigger value="inter-laboratory" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Inter-Lab Comparison
          </TabsTrigger>
          <TabsTrigger value="delta-check" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Delta Check
          </TabsTrigger>
        </TabsList>

        <TabsContent value="critical-value">
          <CriticalValueAlert />
        </TabsContent>

        <TabsContent value="qc-evaluation">
          <QCEvaluation />
        </TabsContent>

        <TabsContent value="reference-interval">
          <ReferenceIntervalValidation />
        </TabsContent>

        <TabsContent value="inter-laboratory">
          <InterLaboratoryComparison />
        </TabsContent>

        <TabsContent value="delta-check">
          <DeltaCheck />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultValidationSystem; 
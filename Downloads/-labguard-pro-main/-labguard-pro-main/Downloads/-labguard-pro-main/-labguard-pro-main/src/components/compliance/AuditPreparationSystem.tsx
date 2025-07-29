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
  FileText, 
  Users, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  ClipboardList,
  Building,
  UserCheck,
  Database,
  Calendar
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

const AuditPreparationSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cap-inspection');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, ValidationResult>>({});

  const handleValidation = async (toolType: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/compliance/audit-preparation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolType, data }),
      });

      if (!response.ok) throw new Error('Validation failed');
      
      const result = await response.json();
      setResults(prev => ({ ...prev, [toolType]: result }));
      
      toast({
        title: result.status === 'pass' ? 'Audit Preparation Passed' : 'Audit Issues Found',
        description: result.message,
        variant: result.status === 'pass' ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Validation Error',
        description: 'Failed to perform audit preparation validation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const CAPInspectionReadiness = () => {
    const [formData, setFormData] = useState({
      inspectionDate: '',
      inspectorName: '',
      checklistVersion: '',
      documentReview: 'complete',
      personnelTraining: 'complete',
      equipmentCalibration: 'complete',
      qualityControl: 'complete',
      proficiencyTesting: 'complete',
      correctiveActions: 'complete',
      riskAssessment: 'complete',
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" />
            CAP Inspection Readiness
          </CardTitle>
          <CardDescription>
            Validate CAP inspection preparation, documentation completeness, and compliance readiness
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Inspection Date</Label>
              <Input
                value={formData.inspectionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, inspectionDate: e.target.value }))}
                type="date"
              />
            </div>
            <div>
              <Label>Inspector Name</Label>
              <Input
                value={formData.inspectorName}
                onChange={(e) => setFormData(prev => ({ ...prev, inspectorName: e.target.value }))}
                placeholder="e.g., Dr. Smith"
              />
            </div>
            <div>
              <Label>Checklist Version</Label>
              <Input
                value={formData.checklistVersion}
                onChange={(e) => setFormData(prev => ({ ...prev, checklistVersion: e.target.value }))}
                placeholder="e.g., 2024.1"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Readiness Assessment</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Document Review</Label>
                <Select value={formData.documentReview} onValueChange={(value) => setFormData(prev => ({ ...prev, documentReview: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Personnel Training</Label>
                <Select value={formData.personnelTraining} onValueChange={(value) => setFormData(prev => ({ ...prev, personnelTraining: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Equipment Calibration</Label>
                <Select value={formData.equipmentCalibration} onValueChange={(value) => setFormData(prev => ({ ...prev, equipmentCalibration: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quality Control</Label>
                <Select value={formData.qualityControl} onValueChange={(value) => setFormData(prev => ({ ...prev, qualityControl: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Proficiency Testing</Label>
                <Select value={formData.proficiencyTesting} onValueChange={(value) => setFormData(prev => ({ ...prev, proficiencyTesting: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Corrective Actions</Label>
                <Select value={formData.correctiveActions} onValueChange={(value) => setFormData(prev => ({ ...prev, correctiveActions: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => handleValidation('cap-inspection', formData)}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Validating...' : 'Validate CAP Inspection Readiness'}
          </Button>

          {results['cap-inspection'] && (
            <Alert variant={results['cap-inspection'].status === 'pass' ? 'default' : 'destructive'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">{results['cap-inspection'].message}</div>
                <div className="mt-2">
                  <strong>Compliance Level:</strong> {results['cap-inspection'].complianceLevel}%
                </div>
                {results['cap-inspection'].correctiveActions.length > 0 && (
                  <div className="mt-2">
                    <strong>Corrective Actions:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {results['cap-inspection'].correctiveActions.map((action, index) => (
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

  const QMSAudit = () => {
    const [formData, setFormData] = useState({
      auditDate: '',
      auditorName: '',
      scope: '',
      managementReview: 'complete',
      documentControl: 'complete',
      processControl: 'complete',
      resourceManagement: 'complete',
      measurementAnalysis: 'complete',
      improvement: 'complete',
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            QMS Audit Preparation
          </CardTitle>
          <CardDescription>
            Validate Quality Management System audit preparation and ISO compliance readiness
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Audit Date</Label>
              <Input
                value={formData.auditDate}
                onChange={(e) => setFormData(prev => ({ ...prev, auditDate: e.target.value }))}
                type="date"
              />
            </div>
            <div>
              <Label>Auditor Name</Label>
              <Input
                value={formData.auditorName}
                onChange={(e) => setFormData(prev => ({ ...prev, auditorName: e.target.value }))}
                placeholder="e.g., John Doe"
              />
            </div>
            <div>
              <Label>Audit Scope</Label>
              <Input
                value={formData.scope}
                onChange={(e) => setFormData(prev => ({ ...prev, scope: e.target.value }))}
                placeholder="e.g., Core Laboratory"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>QMS Elements Assessment</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Management Review</Label>
                <Select value={formData.managementReview} onValueChange={(value) => setFormData(prev => ({ ...prev, managementReview: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Document Control</Label>
                <Select value={formData.documentControl} onValueChange={(value) => setFormData(prev => ({ ...prev, documentControl: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Process Control</Label>
                <Select value={formData.processControl} onValueChange={(value) => setFormData(prev => ({ ...prev, processControl: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Resource Management</Label>
                <Select value={formData.resourceManagement} onValueChange={(value) => setFormData(prev => ({ ...prev, resourceManagement: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Measurement & Analysis</Label>
                <Select value={formData.measurementAnalysis} onValueChange={(value) => setFormData(prev => ({ ...prev, measurementAnalysis: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Improvement</Label>
                <Select value={formData.improvement} onValueChange={(value) => setFormData(prev => ({ ...prev, improvement: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => handleValidation('qms-audit', formData)}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Validating...' : 'Validate QMS Audit Preparation'}
          </Button>

          {results['qms-audit'] && (
            <Alert variant={results['qms-audit'].status === 'pass' ? 'default' : 'destructive'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">{results['qms-audit'].message}</div>
                <div className="mt-2">
                  <strong>Compliance Level:</strong> {results['qms-audit'].complianceLevel}%
                </div>
                {results['qms-audit'].correctiveActions.length > 0 && (
                  <div className="mt-2">
                    <strong>Corrective Actions:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {results['qms-audit'].correctiveActions.map((action, index) => (
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

  const DocumentControlAudit = () => {
    const [formData, setFormData] = useState({
      auditDate: '',
      auditorName: '',
      documentTypes: '',
      versionControl: 'complete',
      approvalProcess: 'complete',
      distributionControl: 'complete',
      changeControl: 'complete',
      retentionPolicy: 'complete',
      accessibility: 'complete',
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            Document Control Audit
          </CardTitle>
          <CardDescription>
            Validate document control system, version management, and approval processes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Audit Date</Label>
              <Input
                value={formData.auditDate}
                onChange={(e) => setFormData(prev => ({ ...prev, auditDate: e.target.value }))}
                type="date"
              />
            </div>
            <div>
              <Label>Auditor Name</Label>
              <Input
                value={formData.auditorName}
                onChange={(e) => setFormData(prev => ({ ...prev, auditorName: e.target.value }))}
                placeholder="e.g., Jane Smith"
              />
            </div>
            <div>
              <Label>Document Types</Label>
              <Input
                value={formData.documentTypes}
                onChange={(e) => setFormData(prev => ({ ...prev, documentTypes: e.target.value }))}
                placeholder="e.g., SOPs, Policies, Forms"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Document Control Assessment</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Version Control</Label>
                <Select value={formData.versionControl} onValueChange={(value) => setFormData(prev => ({ ...prev, versionControl: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Approval Process</Label>
                <Select value={formData.approvalProcess} onValueChange={(value) => setFormData(prev => ({ ...prev, approvalProcess: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Distribution Control</Label>
                <Select value={formData.distributionControl} onValueChange={(value) => setFormData(prev => ({ ...prev, distributionControl: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Change Control</Label>
                <Select value={formData.changeControl} onValueChange={(value) => setFormData(prev => ({ ...prev, changeControl: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Retention Policy</Label>
                <Select value={formData.retentionPolicy} onValueChange={(value) => setFormData(prev => ({ ...prev, retentionPolicy: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Accessibility</Label>
                <Select value={formData.accessibility} onValueChange={(value) => setFormData(prev => ({ ...prev, accessibility: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => handleValidation('document-control', formData)}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Validating...' : 'Validate Document Control Audit'}
          </Button>

          {results['document-control'] && (
            <Alert variant={results['document-control'].status === 'pass' ? 'default' : 'destructive'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">{results['document-control'].message}</div>
                <div className="mt-2">
                  <strong>Compliance Level:</strong> {results['document-control'].complianceLevel}%
                </div>
                {results['document-control'].correctiveActions.length > 0 && (
                  <div className="mt-2">
                    <strong>Corrective Actions:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {results['document-control'].correctiveActions.map((action, index) => (
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

  const PersonnelCompetencyAssessment = () => {
    const [formData, setFormData] = useState({
      assessmentDate: '',
      assessorName: '',
      employeeName: '',
      position: '',
      trainingRecords: 'complete',
      competencyTesting: 'complete',
      performanceEvaluation: 'complete',
      continuingEducation: 'complete',
      certificationStatus: 'complete',
      supervisionLevel: 'complete',
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-orange-500" />
            Personnel Competency Assessment
          </CardTitle>
          <CardDescription>
            Validate personnel competency, training records, and performance evaluation systems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Assessment Date</Label>
              <Input
                value={formData.assessmentDate}
                onChange={(e) => setFormData(prev => ({ ...prev, assessmentDate: e.target.value }))}
                type="date"
              />
            </div>
            <div>
              <Label>Assessor Name</Label>
              <Input
                value={formData.assessorName}
                onChange={(e) => setFormData(prev => ({ ...prev, assessorName: e.target.value }))}
                placeholder="e.g., Dr. Johnson"
              />
            </div>
            <div>
              <Label>Employee Name</Label>
              <Input
                value={formData.employeeName}
                onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                placeholder="e.g., Sarah Wilson"
              />
            </div>
            <div>
              <Label>Position</Label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="e.g., Medical Technologist"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Competency Assessment</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Training Records</Label>
                <Select value={formData.trainingRecords} onValueChange={(value) => setFormData(prev => ({ ...prev, trainingRecords: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Competency Testing</Label>
                <Select value={formData.competencyTesting} onValueChange={(value) => setFormData(prev => ({ ...prev, competencyTesting: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Performance Evaluation</Label>
                <Select value={formData.performanceEvaluation} onValueChange={(value) => setFormData(prev => ({ ...prev, performanceEvaluation: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Continuing Education</Label>
                <Select value={formData.continuingEducation} onValueChange={(value) => setFormData(prev => ({ ...prev, continuingEducation: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Certification Status</Label>
                <Select value={formData.certificationStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, certificationStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Supervision Level</Label>
                <Select value={formData.supervisionLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, supervisionLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => handleValidation('personnel-competency', formData)}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Validating...' : 'Validate Personnel Competency Assessment'}
          </Button>

          {results['personnel-competency'] && (
            <Alert variant={results['personnel-competency'].status === 'pass' ? 'default' : 'destructive'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">{results['personnel-competency'].message}</div>
                <div className="mt-2">
                  <strong>Compliance Level:</strong> {results['personnel-competency'].complianceLevel}%
                </div>
                {results['personnel-competency'].correctiveActions.length > 0 && (
                  <div className="mt-2">
                    <strong>Corrective Actions:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {results['personnel-competency'].correctiveActions.map((action, index) => (
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

  const LISValidationAudit = () => {
    const [formData, setFormData] = useState({
      auditDate: '',
      auditorName: '',
      systemName: '',
      dataIntegrity: 'complete',
      systemValidation: 'complete',
      userAccess: 'complete',
      backupRecovery: 'complete',
      securityControls: 'complete',
      changeManagement: 'complete',
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-500" />
            LIS Validation Audit
          </CardTitle>
          <CardDescription>
            Validate Laboratory Information System validation, data integrity, and security controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Audit Date</Label>
              <Input
                value={formData.auditDate}
                onChange={(e) => setFormData(prev => ({ ...prev, auditDate: e.target.value }))}
                type="date"
              />
            </div>
            <div>
              <Label>Auditor Name</Label>
              <Input
                value={formData.auditorName}
                onChange={(e) => setFormData(prev => ({ ...prev, auditorName: e.target.value }))}
                placeholder="e.g., IT Specialist"
              />
            </div>
            <div>
              <Label>System Name</Label>
              <Input
                value={formData.systemName}
                onChange={(e) => setFormData(prev => ({ ...prev, systemName: e.target.value }))}
                placeholder="e.g., Epic Beaker, Cerner"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>LIS Validation Assessment</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data Integrity</Label>
                <Select value={formData.dataIntegrity} onValueChange={(value) => setFormData(prev => ({ ...prev, dataIntegrity: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>System Validation</Label>
                <Select value={formData.systemValidation} onValueChange={(value) => setFormData(prev => ({ ...prev, systemValidation: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>User Access</Label>
                <Select value={formData.userAccess} onValueChange={(value) => setFormData(prev => ({ ...prev, userAccess: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Backup & Recovery</Label>
                <Select value={formData.backupRecovery} onValueChange={(value) => setFormData(prev => ({ ...prev, backupRecovery: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Security Controls</Label>
                <Select value={formData.securityControls} onValueChange={(value) => setFormData(prev => ({ ...prev, securityControls: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Change Management</Label>
                <Select value={formData.changeManagement} onValueChange={(value) => setFormData(prev => ({ ...prev, changeManagement: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => handleValidation('lis-validation', formData)}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Validating...' : 'Validate LIS Validation Audit'}
          </Button>

          {results['lis-validation'] && (
            <Alert variant={results['lis-validation'].status === 'pass' ? 'default' : 'destructive'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">{results['lis-validation'].message}</div>
                <div className="mt-2">
                  <strong>Compliance Level:</strong> {results['lis-validation'].complianceLevel}%
                </div>
                {results['lis-validation'].correctiveActions.length > 0 && (
                  <div className="mt-2">
                    <strong>Corrective Actions:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {results['lis-validation'].correctiveActions.map((action, index) => (
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
          <h1 className="text-3xl font-bold">Audit Preparation System</h1>
          <p className="text-muted-foreground">
            Comprehensive audit preparation tools for laboratory compliance and quality assurance
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          5 Tools Available
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cap-inspection" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            CAP Inspection
          </TabsTrigger>
          <TabsTrigger value="qms-audit" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            QMS Audit
          </TabsTrigger>
          <TabsTrigger value="document-control" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Document Control
          </TabsTrigger>
          <TabsTrigger value="personnel-competency" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Personnel
          </TabsTrigger>
          <TabsTrigger value="lis-validation" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            LIS Validation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cap-inspection">
          <CAPInspectionReadiness />
        </TabsContent>

        <TabsContent value="qms-audit">
          <QMSAudit />
        </TabsContent>

        <TabsContent value="document-control">
          <DocumentControlAudit />
        </TabsContent>

        <TabsContent value="personnel-competency">
          <PersonnelCompetencyAssessment />
        </TabsContent>

        <TabsContent value="lis-validation">
          <LISValidationAudit />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditPreparationSystem; 
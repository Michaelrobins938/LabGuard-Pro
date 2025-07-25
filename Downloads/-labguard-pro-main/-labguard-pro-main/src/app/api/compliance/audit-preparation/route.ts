import { NextRequest, NextResponse } from 'next/server';

interface ValidationResult {
  status: 'pass' | 'fail' | 'warning';
  message: string;
  correctiveActions: string[];
  complianceLevel: number;
  timestamp: string;
  details: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const { toolType, data } = await request.json();

    let result: ValidationResult;

    switch (toolType) {
      case 'cap-inspection':
        result = validateCAPInspection(data);
        break;
      case 'qms-audit':
        result = validateQMSAudit(data);
        break;
      case 'document-control':
        result = validateDocumentControl(data);
        break;
      case 'personnel-competency':
        result = validatePersonnelCompetency(data);
        break;
      case 'lis-validation':
        result = validateLISValidation(data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid tool type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Audit preparation error:', error);
    return NextResponse.json(
      { error: 'Validation failed' },
      { status: 500 }
    );
  }
}

function validateCAPInspection(data: Record<string, any>): ValidationResult {
  const {
    inspectionDate,
    inspectorName,
    checklistVersion,
    documentReview,
    personnelTraining,
    equipmentCalibration,
    qualityControl,
    proficiencyTesting,
    correctiveActionsStatus,
    riskAssessment
  } = data;

  const issues: string[] = [];
  const correctiveActions: string[] = [];
  let complianceScore = 100;

  // Validate required fields
  if (!inspectionDate || !inspectorName) {
    issues.push('Missing required inspection information');
    correctiveActions.push('Complete inspection date and inspector information');
    complianceScore -= 20;
  }

  // Validate checklist version
  if (!checklistVersion) {
    issues.push('CAP checklist version not specified');
    correctiveActions.push('Ensure latest CAP checklist version is available');
    complianceScore -= 10;
  }

  // Assess readiness areas
  const readinessAreas = [
    { name: 'Document Review', status: documentReview },
    { name: 'Personnel Training', status: personnelTraining },
    { name: 'Equipment Calibration', status: equipmentCalibration },
    { name: 'Quality Control', status: qualityControl },
    { name: 'Proficiency Testing', status: proficiencyTesting },
    { name: 'Corrective Actions', status: correctiveActionsStatus },
    { name: 'Risk Assessment', status: riskAssessment }
  ];

  readinessAreas.forEach(area => {
    if (area.status === 'pending') {
      issues.push(`${area.name} is pending completion`);
      correctiveActions.push(`Complete ${area.name.toLowerCase()} before inspection`);
      complianceScore -= 15;
    } else if (area.status === 'in-progress') {
      issues.push(`${area.name} is in progress`);
      correctiveActions.push(`Finalize ${area.name.toLowerCase()} preparation`);
      complianceScore -= 8;
    }
  });

  // Check inspection date proximity
  if (inspectionDate) {
    const inspectionDateObj = new Date(inspectionDate);
    const today = new Date();
    const daysUntilInspection = Math.ceil((inspectionDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilInspection < 7) {
      issues.push('Inspection is less than 7 days away');
      correctiveActions.push('Accelerate preparation activities for imminent inspection');
      complianceScore -= 10;
    }
  }

  const status = complianceScore >= 90 ? 'pass' : complianceScore >= 70 ? 'warning' : 'fail';

  return {
    status,
    message: issues.length === 0 
      ? 'CAP inspection readiness validation passed' 
      : `CAP inspection preparation issues detected: ${issues.length} problems found`,
    correctiveActions,
    complianceLevel: Math.max(0, complianceScore),
    timestamp: new Date().toISOString(),
    details: {
      inspectionDate: inspectionDate,
      daysUntilInspection: inspectionDate ? Math.ceil((new Date(inspectionDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null,
      readinessAreas: readinessAreas.map(area => ({ name: area.name, status: area.status })),
      checklistVersion: checklistVersion
    }
  };
}

function validateQMSAudit(data: Record<string, any>): ValidationResult {
  const {
    auditDate,
    auditorName,
    scope,
    managementReview,
    documentControl,
    processControl,
    resourceManagement,
    measurementAnalysis,
    improvement
  } = data;

  const issues: string[] = [];
  const correctiveActions: string[] = [];
  let complianceScore = 100;

  // Validate required fields
  if (!auditDate || !auditorName || !scope) {
    issues.push('Missing required audit information');
    correctiveActions.push('Complete audit date, auditor name, and scope information');
    complianceScore -= 20;
  }

  // Assess QMS elements
  const qmsElements = [
    { name: 'Management Review', status: managementReview },
    { name: 'Document Control', status: documentControl },
    { name: 'Process Control', status: processControl },
    { name: 'Resource Management', status: resourceManagement },
    { name: 'Measurement & Analysis', status: measurementAnalysis },
    { name: 'Improvement', status: improvement }
  ];

  qmsElements.forEach(element => {
    if (element.status === 'pending') {
      issues.push(`${element.name} is pending completion`);
      correctiveActions.push(`Complete ${element.name.toLowerCase()} preparation`);
      complianceScore -= 15;
    } else if (element.status === 'in-progress') {
      issues.push(`${element.name} is in progress`);
      correctiveActions.push(`Finalize ${element.name.toLowerCase()} preparation`);
      complianceScore -= 8;
    }
  });

  // Check audit date proximity
  if (auditDate) {
    const auditDateObj = new Date(auditDate);
    const today = new Date();
    const daysUntilAudit = Math.ceil((auditDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilAudit < 14) {
      issues.push('QMS audit is less than 14 days away');
      correctiveActions.push('Accelerate QMS preparation activities');
      complianceScore -= 10;
    }
  }

  const status = complianceScore >= 90 ? 'pass' : complianceScore >= 70 ? 'warning' : 'fail';

  return {
    status,
    message: issues.length === 0 
      ? 'QMS audit preparation validation passed' 
      : `QMS audit preparation issues detected: ${issues.length} problems found`,
    correctiveActions,
    complianceLevel: Math.max(0, complianceScore),
    timestamp: new Date().toISOString(),
    details: {
      auditDate: auditDate,
      daysUntilAudit: auditDate ? Math.ceil((new Date(auditDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null,
      qmsElements: qmsElements.map(element => ({ name: element.name, status: element.status })),
      scope: scope
    }
  };
}

function validateDocumentControl(data: Record<string, any>): ValidationResult {
  const {
    auditDate,
    auditorName,
    documentTypes,
    versionControl,
    approvalProcess,
    distributionControl,
    changeControl,
    retentionPolicy,
    accessibility
  } = data;

  const issues: string[] = [];
  const correctiveActions: string[] = [];
  let complianceScore = 100;

  // Validate required fields
  if (!auditDate || !auditorName) {
    issues.push('Missing required audit information');
    correctiveActions.push('Complete audit date and auditor information');
    complianceScore -= 15;
  }

  // Assess document control elements
  const documentElements = [
    { name: 'Version Control', status: versionControl },
    { name: 'Approval Process', status: approvalProcess },
    { name: 'Distribution Control', status: distributionControl },
    { name: 'Change Control', status: changeControl },
    { name: 'Retention Policy', status: retentionPolicy },
    { name: 'Accessibility', status: accessibility }
  ];

  documentElements.forEach(element => {
    if (element.status === 'pending') {
      issues.push(`${element.name} is pending completion`);
      correctiveActions.push(`Implement ${element.name.toLowerCase()} procedures`);
      complianceScore -= 15;
    } else if (element.status === 'in-progress') {
      issues.push(`${element.name} is in progress`);
      correctiveActions.push(`Finalize ${element.name.toLowerCase()} implementation`);
      complianceScore -= 8;
    }
  });

  // Validate document types
  if (!documentTypes) {
    issues.push('Document types not specified');
    correctiveActions.push('Define scope of document types for audit');
    complianceScore -= 10;
  }

  const status = complianceScore >= 90 ? 'pass' : complianceScore >= 70 ? 'warning' : 'fail';

  return {
    status,
    message: issues.length === 0 
      ? 'Document control audit preparation validation passed' 
      : `Document control audit preparation issues detected: ${issues.length} problems found`,
    correctiveActions,
    complianceLevel: Math.max(0, complianceScore),
    timestamp: new Date().toISOString(),
    details: {
      auditDate: auditDate,
      documentElements: documentElements.map(element => ({ name: element.name, status: element.status })),
      documentTypes: documentTypes
    }
  };
}

function validatePersonnelCompetency(data: Record<string, any>): ValidationResult {
  const {
    assessmentDate,
    assessorName,
    employeeName,
    position,
    trainingRecords,
    competencyTesting,
    performanceEvaluation,
    continuingEducation,
    certificationStatus,
    supervisionLevel
  } = data;

  const issues: string[] = [];
  const correctiveActions: string[] = [];
  let complianceScore = 100;

  // Validate required fields
  if (!assessmentDate || !assessorName || !employeeName || !position) {
    issues.push('Missing required assessment information');
    correctiveActions.push('Complete assessment date, assessor, employee, and position information');
    complianceScore -= 20;
  }

  // Assess competency elements
  const competencyElements = [
    { name: 'Training Records', status: trainingRecords },
    { name: 'Competency Testing', status: competencyTesting },
    { name: 'Performance Evaluation', status: performanceEvaluation },
    { name: 'Continuing Education', status: continuingEducation },
    { name: 'Certification Status', status: certificationStatus },
    { name: 'Supervision Level', status: supervisionLevel }
  ];

  competencyElements.forEach(element => {
    if (element.status === 'pending') {
      issues.push(`${element.name} is pending completion`);
      correctiveActions.push(`Complete ${element.name.toLowerCase()} for employee`);
      complianceScore -= 15;
    } else if (element.status === 'in-progress') {
      issues.push(`${element.name} is in progress`);
      correctiveActions.push(`Finalize ${element.name.toLowerCase()} assessment`);
      complianceScore -= 8;
    }
  });

  // Check assessment date
  if (assessmentDate) {
    const assessmentDateObj = new Date(assessmentDate);
    const today = new Date();
    const daysSinceAssessment = Math.ceil((today.getTime() - assessmentDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceAssessment > 365) {
      issues.push('Competency assessment is over 1 year old');
      correctiveActions.push('Schedule updated competency assessment');
      complianceScore -= 15;
    }
  }

  const status = complianceScore >= 90 ? 'pass' : complianceScore >= 70 ? 'warning' : 'fail';

  return {
    status,
    message: issues.length === 0 
      ? 'Personnel competency assessment validation passed' 
      : `Personnel competency assessment issues detected: ${issues.length} problems found`,
    correctiveActions,
    complianceLevel: Math.max(0, complianceScore),
    timestamp: new Date().toISOString(),
    details: {
      assessmentDate: assessmentDate,
      daysSinceAssessment: assessmentDate ? Math.ceil((new Date().getTime() - new Date(assessmentDate).getTime()) / (1000 * 60 * 60 * 24)) : null,
      competencyElements: competencyElements.map(element => ({ name: element.name, status: element.status })),
      employee: { name: employeeName, position: position }
    }
  };
}

function validateLISValidation(data: Record<string, any>): ValidationResult {
  const {
    auditDate,
    auditorName,
    systemName,
    dataIntegrity,
    systemValidation,
    userAccess,
    backupRecovery,
    securityControls,
    changeManagement
  } = data;

  const issues: string[] = [];
  const correctiveActions: string[] = [];
  let complianceScore = 100;

  // Validate required fields
  if (!auditDate || !auditorName || !systemName) {
    issues.push('Missing required LIS audit information');
    correctiveActions.push('Complete audit date, auditor, and system name information');
    complianceScore -= 20;
  }

  // Assess LIS validation elements
  const lisElements = [
    { name: 'Data Integrity', status: dataIntegrity },
    { name: 'System Validation', status: systemValidation },
    { name: 'User Access', status: userAccess },
    { name: 'Backup & Recovery', status: backupRecovery },
    { name: 'Security Controls', status: securityControls },
    { name: 'Change Management', status: changeManagement }
  ];

  lisElements.forEach(element => {
    if (element.status === 'pending') {
      issues.push(`${element.name} is pending completion`);
      correctiveActions.push(`Complete ${element.name.toLowerCase()} validation`);
      complianceScore -= 15;
    } else if (element.status === 'in-progress') {
      issues.push(`${element.name} is in progress`);
      correctiveActions.push(`Finalize ${element.name.toLowerCase()} validation`);
      complianceScore -= 8;
    }
  });

  // Check audit date proximity
  if (auditDate) {
    const auditDateObj = new Date(auditDate);
    const today = new Date();
    const daysUntilAudit = Math.ceil((auditDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilAudit < 7) {
      issues.push('LIS validation audit is less than 7 days away');
      correctiveActions.push('Accelerate LIS validation preparation');
      complianceScore -= 10;
    }
  }

  const status = complianceScore >= 90 ? 'pass' : complianceScore >= 70 ? 'warning' : 'fail';

  return {
    status,
    message: issues.length === 0 
      ? 'LIS validation audit preparation validation passed' 
      : `LIS validation audit preparation issues detected: ${issues.length} problems found`,
    correctiveActions,
    complianceLevel: Math.max(0, complianceScore),
    timestamp: new Date().toISOString(),
    details: {
      auditDate: auditDate,
      daysUntilAudit: auditDate ? Math.ceil((new Date(auditDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null,
      lisElements: lisElements.map(element => ({ name: element.name, status: element.status })),
      systemName: systemName
    }
  };
} 
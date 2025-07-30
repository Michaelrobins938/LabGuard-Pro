import { NextRequest, NextResponse } from 'next/server';

type AuditType = 'CAP' | 'CLIA' | 'QMS';

interface AuditRequest {
  auditType: AuditType;
  laboratoryId: string;
  testMenu: string[];
  lastInspectionDate: string;
  currentProcedures: string[];
}

interface AuditResponse {
  checklist: string[];
  requiredDocuments: string[];
  riskAreas: string[];
  recommendations: string[];
  estimatedScore: number;
}

export async function POST(request: NextRequest): Promise<NextResponse<AuditResponse | { error: string }>> {
  try {
    const body: AuditRequest = await request.json();

    // Input validation
    if (!body.auditType || !body.laboratoryId || !body.testMenu) {
      return NextResponse.json(
        { error: 'Missing required fields: auditType, laboratoryId, testMenu' },
        { status: 400 }
      );
    }

    const checklist: string[] = [];
    const requiredDocuments: string[] = [];
    const riskAreas: string[] = [];
    const recommendations: string[] = [];

    // Calculate days since last inspection
    const lastInspection = new Date(body.lastInspectionDate);
    const today = new Date();
    const daysSinceInspection = Math.ceil((today.getTime() - lastInspection.getTime()) / (1000 * 60 * 60 * 24));

    let estimatedScore = 95; // Start with high score

    // Audit type specific requirements
    if (body.auditType === 'CAP') {
      checklist.push(
        'Verify laboratory director qualifications',
        'Review technical supervisor credentials',
        'Check proficiency testing participation and results',
        'Validate method verification/validation studies',
        'Review quality control procedures and records',
        'Verify personnel competency assessments',
        'Check critical value notification procedures',
        'Review patient test management system',
        'Validate reference laboratory selection criteria',
        'Check laboratory safety program'
      );

      requiredDocuments.push(
        'Laboratory director CV and licenses',
        'Technical supervisor qualifications',
        'Proficiency testing certificates (last 2 years)',
        'Method verification protocols and data',
        'Quality control logs and trend analysis',
        'Personnel training and competency records',
        'Critical value notification logs',
        'Procedure manuals (current versions)',
        'Safety manual and training records',
        'Instrument maintenance logs'
      );

    } else if (body.auditType === 'CLIA') {
      checklist.push(
        'Verify CLIA certificate validity',
        'Review personnel qualifications',
        'Check quality control requirements',
        'Validate proficiency testing compliance',
        'Review patient test management',
        'Check quality assurance program',
        'Verify equipment maintenance',
        'Review corrective action procedures'
      );

      requiredDocuments.push(
        'Current CLIA certificate',
        'Personnel qualification documents',
        'Quality control records',
        'Proficiency testing results',
        'Quality assurance plan',
        'Equipment maintenance logs',
        'Corrective action reports'
      );

    } else if (body.auditType === 'QMS') {
      checklist.push(
        'Review quality management system documentation',
        'Check document control procedures',
        'Validate management review process',
        'Review internal audit program',
        'Check corrective and preventive actions',
        'Verify customer satisfaction monitoring',
        'Review risk management procedures',
        'Check continual improvement processes'
      );

      requiredDocuments.push(
        'Quality manual',
        'Document control procedures',
        'Management review minutes',
        'Internal audit reports',
        'CAPA (Corrective and Preventive Action) records',
        'Customer feedback records',
        'Risk assessment documents',
        'Improvement project documentation'
      );
    }

    // Assess risk areas based on time since last inspection
    if (daysSinceInspection > 730) { // > 2 years
      riskAreas.push('Extended time since last inspection - increased scrutiny expected');
      estimatedScore -= 10;
    } else if (daysSinceInspection > 365) { // > 1 year
      riskAreas.push('Annual inspection cycle - standard review expected');
      estimatedScore -= 5;
    }

    // Assess test menu complexity
    if (body.testMenu.length > 50) {
      riskAreas.push('Large test menu - comprehensive validation required');
      estimatedScore -= 5;
    }

    // Check for high-risk tests
    const highRiskTests = ['molecular', 'cytogenetics', 'flow cytometry', 'blood bank'];
    const hasHighRiskTests = body.testMenu.some(test => 
      highRiskTests.some(risk => test.toLowerCase().includes(risk))
    );

    if (hasHighRiskTests) {
      riskAreas.push('High-complexity testing - enhanced documentation required');
      recommendations.push('Review specialized test validation documentation');
      estimatedScore -= 5;
    }

    // Check procedure documentation
    if (body.currentProcedures.length < body.testMenu.length * 0.8) {
      riskAreas.push('Insufficient procedure documentation for test menu');
      recommendations.push('Update and standardize all procedure documents');
      estimatedScore -= 10;
    }

    // General recommendations
    recommendations.push(
      'Schedule pre-audit internal review 30 days before inspection',
      'Ensure all staff are aware of their roles during the audit',
      'Prepare a dedicated space for auditor document review',
      'Assign a liaison to accompany auditors throughout the process',
      'Review and practice responses to common audit questions'
    );

    // Specific recommendations based on audit type
    if (body.auditType === 'CAP') {
      recommendations.push(
        'Review latest CAP checklist for any new requirements',
        'Ensure compliance with CAP 15189 standards if applicable',
        'Prepare evidence of continuous quality improvement'
      );
    }

    // Final score adjustment
    if (riskAreas.length === 0) {
      estimatedScore = Math.min(100, estimatedScore + 5);
    }

    const response: AuditResponse = {
      checklist,
      requiredDocuments,
      riskAreas,
      recommendations,
      estimatedScore: Math.max(60, estimatedScore) // Minimum score of 60
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Audit Preparation API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
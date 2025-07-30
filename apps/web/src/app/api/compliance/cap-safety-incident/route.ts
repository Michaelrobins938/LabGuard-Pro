import { NextRequest, NextResponse } from 'next/server';

interface IncidentRequest {
  incidentType: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  involvedPersonnel: string[];
  immediateActions: string[];
  timestamp: string;
}

interface IncidentResponse {
  isCompliant: boolean;
  requiredActions: string[];
  reportingRequirements: string[];
  followUpSteps: string[];
  riskLevel: string;
  estimatedResolutionTime: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<IncidentResponse | { error: string }>> {
  try {
    const body: IncidentRequest = await request.json();

    // Input validation
    if (!body.incidentType || !body.description || !body.severity) {
      return NextResponse.json(
        { error: 'Missing required fields: incidentType, description, severity' },
        { status: 400 }
      );
    }

    const requiredActions: string[] = [];
    const reportingRequirements: string[] = [];
    const followUpSteps: string[] = [];
    let riskLevel: string;
    let estimatedResolutionTime: string;

    // Determine risk level and actions based on severity
    switch (body.severity) {
      case 'Critical':
        riskLevel = 'IMMEDIATE ACTION REQUIRED';
        estimatedResolutionTime = '24 hours';
        requiredActions.push(
          'Immediately notify laboratory director',
          'Implement emergency containment measures',
          'Document all immediate actions taken',
          'Notify regulatory agencies within 24 hours if required'
        );
        reportingRequirements.push(
          'Complete incident report within 2 hours',
          'Notify CAP within 24 hours for patient safety events',
          'Report to OSHA if workplace injury involved',
          'Notify institutional risk management immediately'
        );
        break;

      case 'High':
        riskLevel = 'HIGH PRIORITY';
        estimatedResolutionTime = '72 hours';
        requiredActions.push(
          'Notify laboratory supervisor immediately',
          'Secure the incident area',
          'Begin preliminary investigation',
          'Implement temporary corrective measures'
        );
        reportingRequirements.push(
          'Complete incident report within 8 hours',
          'Report to CAP within 72 hours if applicable',
          'Notify safety officer within 24 hours'
        );
        break;

      case 'Medium':
        riskLevel = 'MODERATE PRIORITY';
        estimatedResolutionTime = '1 week';
        requiredActions.push(
          'Notify section supervisor',
          'Document incident details',
          'Begin risk assessment',
          'Implement initial preventive measures'
        );
        reportingRequirements.push(
          'Complete incident report within 24 hours',
          'Review with quality assurance team'
        );
        break;

      case 'Low':
        riskLevel = 'ROUTINE FOLLOW-UP';
        estimatedResolutionTime = '2 weeks';
        requiredActions.push(
          'Document incident in log',
          'Assess for trends or patterns',
          'Consider process improvements'
        );
        reportingRequirements.push(
          'Include in monthly safety report',
          'Document lessons learned'
        );
        break;
    }

    // Incident type specific requirements
    const incidentType = body.incidentType.toLowerCase();

    if (incidentType.includes('exposure') || incidentType.includes('biohazard')) {
      requiredActions.push(
        'Assess exposure risk to personnel',
        'Provide immediate medical evaluation if needed',
        'Review biosafety protocols',
        'Check PPE usage and effectiveness'
      );
      followUpSteps.push(
        'Conduct exposure assessment',
        'Review and update biosafety procedures',
        'Provide additional safety training if needed',
        'Monitor exposed personnel for symptoms'
      );
    } else if (incidentType.includes('chemical') || incidentType.includes('spill')) {
      requiredActions.push(
        'Secure chemical spill area',
        'Check ventilation systems',
        'Review SDS (Safety Data Sheets)',
        'Assess environmental impact'
      );
      followUpSteps.push(
        'Review chemical storage procedures',
        'Update spill response protocols',
        'Conduct environmental monitoring if needed',
        'Review chemical inventory management'
      );
    } else if (incidentType.includes('equipment') || incidentType.includes('instrument')) {
      requiredActions.push(
        'Take equipment out of service if unsafe',
        'Tag equipment as "Do Not Use"',
        'Review maintenance records',
        'Assess impact on test results'
      );
      followUpSteps.push(
        'Conduct equipment investigation',
        'Review preventive maintenance schedule',
        'Update equipment procedures if needed',
        'Consider equipment replacement if warranted'
      );
    } else if (incidentType.includes('patient') || incidentType.includes('specimen')) {
      requiredActions.push(
        'Assess patient safety impact',
        'Review specimen handling procedures',
        'Check patient identification protocols',
        'Evaluate need for repeat testing'
      );
      followUpSteps.push(
        'Review pre-analytical procedures',
        'Update specimen handling protocols',
        'Provide additional staff training',
        'Implement additional quality checks'
      );
    }

    // Universal follow-up steps
    followUpSteps.push(
      'Conduct root cause analysis',
      'Develop corrective action plan',
      'Monitor effectiveness of implemented changes',
      'Update relevant procedures and training materials',
      'Schedule follow-up review meeting',
      'Document lessons learned and share with team'
    );

    // CAP-specific requirements
    reportingRequirements.push(
      'Ensure compliance with CAP Patient Safety Standards',
      'Document in laboratory\'s safety management system',
      'Include in annual safety program review'
    );

    // Check if immediate actions were taken
    const hasImmediateActions = body.immediateActions && body.immediateActions.length > 0;
    
    const response: IncidentResponse = {
      isCompliant: hasImmediateActions && body.severity !== 'Critical', // Critical incidents always need review
      requiredActions,
      reportingRequirements,
      followUpSteps,
      riskLevel,
      estimatedResolutionTime
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('CAP Safety Incident API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
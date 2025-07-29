import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      incidentType,
      incidentDateTime,
      incidentLocation,
      personnelList,
      reporterId,
      severityLevel,
      immediateActions,
      ppeDeployed,
      containmentSteps,
      notificationLog,
      deconProcedure,
      medicalAssessment,
      responseTimeLimit,
      notificationTimeframe,
      rcaTimeframe,
      applicableCapStandard,
      internalSopNumber,
      oshaStandards,
      localRequirements
    } = body

    // Validate required fields
    if (!incidentType || !incidentDateTime || !incidentLocation || !reporterId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Perform compliance checks
    const timelineCompliance = checkTimelineCompliance(incidentDateTime, responseTimeLimit, notificationTimeframe)
    const documentationCompliance = checkDocumentationCompliance(immediateActions, ppeDeployed, containmentSteps)
    const safetyCompliance = checkSafetyCompliance(incidentType, ppeDeployed, containmentSteps)
    const regulatoryCompliance = checkRegulatoryCompliance(applicableCapStandard, oshaStandards, localRequirements)
    const medicalCompliance = checkMedicalCompliance(medicalAssessment, severityLevel)

    // Calculate compliance score
    const complianceScore = calculateComplianceScore(
      timelineCompliance,
      documentationCompliance,
      safetyCompliance,
      regulatoryCompliance,
      medicalCompliance
    )

    // Determine overall status
    let status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL_COMPLIANCE' = 'COMPLIANT'
    
    if (complianceScore < 70) {
      status = 'NON_COMPLIANT'
    } else if (complianceScore < 90) {
      status = 'PARTIAL_COMPLIANCE'
    }

    // Generate corrective actions and recommendations
    const correctiveActions = generateCorrectiveActions(
      timelineCompliance,
      documentationCompliance,
      safetyCompliance,
      regulatoryCompliance,
      medicalCompliance
    )

    const trainingNeeds = identifyTrainingNeeds(
      timelineCompliance,
      documentationCompliance,
      safetyCompliance,
      regulatoryCompliance,
      medicalCompliance
    )

    const followUpSchedule = generateFollowUpSchedule(severityLevel, complianceScore)

    // Log incident verification
    await logIncidentVerification({
      incidentType,
      severityLevel,
      status,
      complianceScore,
      reporterId,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      status,
      criticalDeviations: getCriticalDeviations(
        timelineCompliance,
        documentationCompliance,
        safetyCompliance,
        regulatoryCompliance,
        medicalCompliance
      ),
      majorDeviations: getMajorDeviations(
        timelineCompliance,
        documentationCompliance,
        safetyCompliance,
        regulatoryCompliance,
        medicalCompliance
      ),
      minorDeviations: getMinorDeviations(
        timelineCompliance,
        documentationCompliance,
        safetyCompliance,
        regulatoryCompliance,
        medicalCompliance
      ),
      correctiveActions,
      trainingNeeds,
      followUpSchedule,
      auditTrail: generateAuditTrail(incidentType, severityLevel),
      complianceScore,
      recommendations: generateRecommendations(complianceScore, incidentType)
    })

  } catch (error) {
    console.error('CAP incident verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function checkTimelineCompliance(incidentDateTime: string, responseTimeLimit: string, notificationTimeframe: string) {
  const incidentTime = new Date(incidentDateTime)
  const now = new Date()
  const responseTimeMinutes = parseInt(responseTimeLimit) || 15
  const notificationTimeMinutes = parseInt(notificationTimeframe) || 30

  const timeSinceIncident = (now.getTime() - incidentTime.getTime()) / (1000 * 60)

  return {
    responseTimeCompliant: timeSinceIncident <= responseTimeMinutes,
    notificationTimeCompliant: timeSinceIncident <= notificationTimeMinutes,
    responseTimeMinutes: Math.round(timeSinceIncident),
    requiredResponseTime: responseTimeMinutes,
    requiredNotificationTime: notificationTimeMinutes
  }
}

function checkDocumentationCompliance(immediateActions: string, ppeDeployed: string, containmentSteps: string) {
  const requiredFields = [
    { field: immediateActions, name: 'Immediate Actions' },
    { field: ppeDeployed, name: 'PPE Used' },
    { field: containmentSteps, name: 'Containment Steps' }
  ]

  const missingFields = requiredFields.filter(item => !item.field || item.field.trim() === '')

  return {
    complete: missingFields.length === 0,
    missingFields: missingFields.map(item => item.name),
    documentationQuality: calculateDocumentationQuality(immediateActions, ppeDeployed, containmentSteps)
  }
}

function checkSafetyCompliance(incidentType: string, ppeDeployed: string, containmentSteps: string) {
  const ppeRequirements = getPPERequirements(incidentType)
  const containmentRequirements = getContainmentRequirements(incidentType)

  const ppeCompliant = checkPPECompliance(ppeDeployed, ppeRequirements)
  const containmentCompliant = checkContainmentCompliance(containmentSteps, containmentRequirements)

  return {
    ppeCompliant,
    containmentCompliant,
    overallCompliant: ppeCompliant && containmentCompliant,
    ppeRequirements,
    containmentRequirements
  }
}

function checkRegulatoryCompliance(capStandard: string, oshaStandards: string, localRequirements: string) {
  const capCompliant = capStandard && capStandard.trim() !== ''
  const oshaCompliant = oshaStandards && oshaStandards.trim() !== ''
  const localCompliant = localRequirements && localRequirements.trim() !== ''

  return {
    capCompliant,
    oshaCompliant,
    localCompliant,
    overallCompliant: capCompliant && oshaCompliant && localCompliant
  }
}

function checkMedicalCompliance(medicalAssessment: string, severityLevel: string) {
  const requiresMedical = ['major', 'critical'].includes(severityLevel)
  const medicalCompleted = medicalAssessment && medicalAssessment.trim() !== ''

  return {
    requiresMedical,
    medicalCompleted,
    compliant: !requiresMedical || medicalCompleted
  }
}

function calculateComplianceScore(
  timeline: any,
  documentation: any,
  safety: any,
  regulatory: any,
  medical: any
) {
  let score = 100

  // Timeline compliance (30% weight)
  if (!timeline.responseTimeCompliant) score -= 15
  if (!timeline.notificationTimeCompliant) score -= 15

  // Documentation compliance (25% weight)
  if (!documentation.complete) score -= 25

  // Safety compliance (25% weight)
  if (!safety.overallCompliant) score -= 25

  // Regulatory compliance (15% weight)
  if (!regulatory.overallCompliant) score -= 15

  // Medical compliance (5% weight)
  if (!medical.compliant) score -= 5

  return Math.max(0, score)
}

function getCriticalDeviations(timeline: any, documentation: any, safety: any, regulatory: any, medical: any) {
  const deviations: string[] = []

  if (!timeline.responseTimeCompliant) {
    deviations.push('Response time exceeded required limit')
  }

  if (!safety.ppeCompliant) {
    deviations.push('Inadequate PPE used for incident type')
  }

  if (!safety.containmentCompliant) {
    deviations.push('Inadequate containment measures implemented')
  }

  return deviations
}

function getMajorDeviations(timeline: any, documentation: any, safety: any, regulatory: any, medical: any) {
  const deviations: string[] = []

  if (!timeline.notificationTimeCompliant) {
    deviations.push('Notification timeline not met')
  }

  if (!documentation.complete) {
    deviations.push(`Missing documentation: ${documentation.missingFields.join(', ')}`)
  }

  if (!regulatory.overallCompliant) {
    deviations.push('Regulatory standards not fully addressed')
  }

  return deviations
}

function getMinorDeviations(timeline: any, documentation: any, safety: any, regulatory: any, medical: any) {
  const deviations: string[] = []

  if (documentation.documentationQuality < 0.8) {
    deviations.push('Documentation quality could be improved')
  }

  if (!medical.compliant) {
    deviations.push('Medical evaluation not completed when required')
  }

  return deviations
}

function generateCorrectiveActions(timeline: any, documentation: any, safety: any, regulatory: any, medical: any) {
  const actions: string[] = []

  if (!timeline.responseTimeCompliant) {
    actions.push('Implement faster response protocols')
    actions.push('Provide additional training on emergency response')
  }

  if (!documentation.complete) {
    actions.push('Complete missing documentation immediately')
    actions.push('Establish documentation templates for future incidents')
  }

  if (!safety.overallCompliant) {
    actions.push('Review and update safety protocols')
    actions.push('Ensure proper PPE is readily available')
  }

  if (!regulatory.overallCompliant) {
    actions.push('Update incident response procedures to include all regulatory requirements')
  }

  return actions
}

function identifyTrainingNeeds(timeline: any, documentation: any, safety: any, regulatory: any, medical: any) {
  const needs: string[] = []

  if (!timeline.responseTimeCompliant) {
    needs.push('Emergency response training')
    needs.push('Incident notification procedures')
  }

  if (!documentation.complete) {
    needs.push('Incident documentation training')
    needs.push('Report writing skills')
  }

  if (!safety.overallCompliant) {
    needs.push('PPE selection and use training')
    needs.push('Containment procedure training')
  }

  return needs
}

function generateFollowUpSchedule(severityLevel: string, complianceScore: number) {
  const schedules: string[] = []

  if (severityLevel === 'critical') {
    schedules.push('Immediate supervisor review required')
    schedules.push('Follow-up inspection within 24 hours')
  }

  if (complianceScore < 90) {
    schedules.push('Root cause analysis within 48 hours')
    schedules.push('Corrective action plan review within 1 week')
  }

  schedules.push('Incident review meeting within 1 week')
  schedules.push('Updated procedures implementation within 2 weeks')

  return schedules
}

function generateAuditTrail(incidentType: string, severityLevel: string) {
  const trail = [
    'Complete timeline documentation',
    'Personnel training verification',
    'Equipment functionality confirmation',
    'Environmental monitoring data',
    'Supervisor review and sign-off'
  ]

  if (severityLevel === 'critical') {
    trail.push('Regulatory notification records')
    trail.push('External investigation documentation')
  }

  return trail
}

function generateRecommendations(complianceScore: number, incidentType: string) {
  const recommendations: string[] = []

  if (complianceScore < 90) {
    recommendations.push('Conduct comprehensive incident response training')
    recommendations.push('Review and update incident response procedures')
  }

  if (complianceScore < 80) {
    recommendations.push('Implement automated incident reporting system')
    recommendations.push('Establish incident response team')
  }

  recommendations.push('Regular incident response drills')
  recommendations.push('Continuous improvement program for safety protocols')

  return recommendations
}

function getPPERequirements(incidentType: string) {
  const requirements: { [key: string]: string[] } = {
    'chemical-spill': ['Gloves', 'Safety goggles', 'Lab coat', 'Respirator'],
    'biological-exposure': ['Gloves', 'Face shield', 'Lab coat', 'Respirator'],
    'equipment-failure': ['Safety glasses', 'Gloves'],
    'fire': ['Fire-resistant clothing', 'Respirator'],
    'electrical-shock': ['Insulated gloves', 'Safety glasses'],
    'needlestick': ['Gloves', 'Safety glasses'],
    'slip-fall': ['Appropriate footwear'],
    'gas-leak': ['Respirator', 'Safety goggles', 'Lab coat']
  }

  return requirements[incidentType] || ['Gloves', 'Safety glasses']
}

function getContainmentRequirements(incidentType: string) {
  const requirements: { [key: string]: string[] } = {
    'chemical-spill': ['Absorbent materials', 'Neutralizing agents', 'Containment barriers'],
    'biological-exposure': ['Disinfectants', 'Containment barriers', 'Decontamination area'],
    'equipment-failure': ['Equipment shutdown', 'Area isolation'],
    'fire': ['Fire extinguishers', 'Evacuation procedures'],
    'electrical-shock': ['Power shutdown', 'Area isolation'],
    'needlestick': ['Sharps container', 'Medical evaluation'],
    'slip-fall': ['Area marking', 'Medical evaluation'],
    'gas-leak': ['Ventilation', 'Area evacuation', 'Gas detection']
  }

  return requirements[incidentType] || ['Area isolation']
}

function checkPPECompliance(ppeDeployed: string, requirements: string[]) {
  if (!ppeDeployed) return false
  
  const deployedPPE = ppeDeployed.toLowerCase()
  return requirements.every(req => deployedPPE.includes(req.toLowerCase()))
}

function checkContainmentCompliance(containmentSteps: string, requirements: string[]) {
  if (!containmentSteps) return false
  
  const steps = containmentSteps.toLowerCase()
  return requirements.every(req => steps.includes(req.toLowerCase()))
}

function calculateDocumentationQuality(immediateActions: string, ppeDeployed: string, containmentSteps: string) {
  let quality = 0
  let totalFields = 0

  if (immediateActions) {
    quality += Math.min(immediateActions.length / 50, 1) // Minimum 50 characters for good quality
    totalFields++
  }

  if (ppeDeployed) {
    quality += Math.min(ppeDeployed.length / 30, 1) // Minimum 30 characters for good quality
    totalFields++
  }

  if (containmentSteps) {
    quality += Math.min(containmentSteps.length / 100, 1) // Minimum 100 characters for good quality
    totalFields++
  }

  return totalFields > 0 ? quality / totalFields : 0
}

async function logIncidentVerification(data: any) {
  try {
    // Log to database or external system
    console.log('CAP Incident Verification Log:', data)
  } catch (error) {
    console.error('Failed to log incident verification:', error)
  }
} 
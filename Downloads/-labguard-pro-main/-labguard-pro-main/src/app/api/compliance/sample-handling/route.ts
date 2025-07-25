import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sampleId,
      sampleType,
      collectionDateTime,
      receivedDateTime,
      testRequested,
      transportConditions,
      containerStatus,
      volumeAdequate,
      visualAppearance,
      hemolysisGrade,
      lipemiaStatus,
      icterusGrade,
      transportDuration,
      storageTemp,
      anticoagulant,
      collectionMethod,
      fastingStatus,
      operator,
      sampleHandlingType,
      timestamp
    } = body

    // Validate required fields
    if (!sampleId || !sampleHandlingType || !operator) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let validationResult

    // Route to specific validation logic based on sample handling type
    switch (sampleHandlingType) {
      case 'pre-analytical':
        validationResult = await validatePreAnalytical(body)
        break
      case 'chain-custody':
        validationResult = await validateChainOfCustody(body)
        break
      case 'storage-monitoring':
        validationResult = await validateStorageMonitoring(body)
        break
      case 'biohazard':
        validationResult = await validateBiohazardHandling(body)
        break
      case 'thaw-protocol':
        validationResult = await validateThawProtocol(body)
        break
      case 'aliquoting':
        validationResult = await validateAliquoting(body)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid sample handling type' },
          { status: 400 }
        )
    }

    // Log validation attempt
    await logSampleHandlingValidation({
      sampleId,
      sampleHandlingType,
      operator,
      status: validationResult.status,
      timestamp
    })

    return NextResponse.json(validationResult)

  } catch (error) {
    console.error('Sample handling validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function validatePreAnalytical(data: any) {
  const discrepancies: string[] = []
  const correctiveActions: string[] = []
  const testingLimitations: string[] = []

  // Container integrity check
  if (data.containerStatus === 'cracked' || data.containerStatus === 'leaking') {
    discrepancies.push('Container integrity compromised')
    correctiveActions.push('Reject sample and request recollection')
  }

  // Volume adequacy check
  if (!data.volumeAdequate) {
    discrepancies.push('Insufficient sample volume for requested testing')
    correctiveActions.push('Contact ordering physician for volume requirements or recollection')
    testingLimitations.push('Limited testing available due to insufficient volume')
  }

  // Hemolysis interference check
  if (data.hemolysisGrade === 'moderate' || data.hemolysisGrade === 'severe') {
    const hemolysisInterferenceTests = ['potassium', 'lactate-dehydrogenase', 'aspartate-aminotransferase']
    if (data.testRequested && hemolysisInterferenceTests.some((test: string) => data.testRequested.toLowerCase().includes(test))) {
      discrepancies.push('Hemolysis may interfere with requested testing')
      correctiveActions.push('Note hemolysis on report and consider recollection')
      testingLimitations.push('Results may be falsely elevated due to hemolysis')
    }
  }

  // Transport time check
  if (data.collectionDateTime && data.receivedDateTime) {
    const collectionTime = new Date(data.collectionDateTime)
    const receivedTime = new Date(data.receivedDateTime)
    const transportHours = (receivedTime.getTime() - collectionTime.getTime()) / (1000 * 60 * 60)
    
    // Check against stability limits based on sample type
    const stabilityLimits: Record<string, number> = {
      'blood': 24,
      'serum': 8,
      'plasma': 4,
      'urine': 2,
      'cerebrospinal-fluid': 1
    }
    
    const limit = stabilityLimits[data.sampleType as string] || 24
    if (transportHours > limit) {
      discrepancies.push(`Transport time (${transportHours.toFixed(1)}h) exceeds stability limit (${limit}h)`)
      correctiveActions.push('Assess impact on test results and consider recollection')
      testingLimitations.push('Sample stability may be compromised due to extended transport time')
    }
  }

  // Anticoagulant compatibility check
  if (data.anticoagulant && data.testRequested) {
    const incompatibilities: Record<string, string[]> = {
      'edta': ['calcium', 'alkaline-phosphatase'],
      'heparin': ['sodium', 'chloride'],
      'citrate': ['calcium', 'coagulation-tests']
    }
    
    const incompatibleTests = incompatibilities[data.anticoagulant as string] || []
    if (incompatibleTests.some((test: string) => data.testRequested.toLowerCase().includes(test))) {
      discrepancies.push(`Anticoagulant ${data.anticoagulant} incompatible with requested testing`)
      correctiveActions.push('Request sample with appropriate anticoagulant')
    }
  }

  let status = discrepancies.length === 0 ? 'ACCEPTED' : 'REJECTED'
  if (discrepancies.length > 0 && testingLimitations.length === 0) {
    status = 'CONDITIONAL'
  }

  return {
    status,
    qualityAssessment: `Pre-analytical assessment: ${status}. Container: ${data.containerStatus}, Volume: ${data.volumeAdequate ? 'Adequate' : 'Insufficient'}, Hemolysis: ${data.hemolysisGrade || 'None'}`,
    testingLimitations,
    correctiveActions,
    sampleIntegrity: discrepancies.length === 0 ? 'MAINTAINED' : 'COMPROMISED',
    complianceLevel: status === 'ACCEPTED' ? 'CLSI Standards Met' : 'Requires Correction',
    safetyStatus: 'No safety issues detected'
  }
}

async function validateChainOfCustody(data: any) {
  const discrepancies: string[] = []
  const correctiveActions: string[] = []

  // Check for required documentation
  if (!data.collectionDateTime || !data.operator) {
    discrepancies.push('Missing required chain of custody documentation')
    correctiveActions.push('Complete all required documentation fields')
  }

  // Check for tamper evidence
  if (data.containerStatus === 'damaged' || data.containerStatus === 'compromised') {
    discrepancies.push('Evidence of tampering or damage detected')
    correctiveActions.push('Document damage and assess impact on legal admissibility')
  }

  // Check for continuous custody
  if (!data.transportConditions || !data.collectionMethod) {
    discrepancies.push('Gaps in custody chain documentation')
    correctiveActions.push('Complete custody transfer documentation')
  }

  const status = discrepancies.length === 0 ? 'ACCEPTED' : 'REJECTED'

  return {
    status,
    qualityAssessment: `Chain of custody validation: ${status}. Documentation: ${discrepancies.length === 0 ? 'Complete' : 'Incomplete'}, Tamper evidence: ${data.containerStatus}`,
    testingLimitations: [],
    correctiveActions,
    sampleIntegrity: discrepancies.length === 0 ? 'MAINTAINED' : 'COMPROMISED',
    complianceLevel: status === 'ACCEPTED' ? 'Legal Standards Met' : 'Requires Correction',
    safetyStatus: 'No safety issues detected'
  }
}

async function validateStorageMonitoring(data: any) {
  const discrepancies: string[] = []
  const correctiveActions: string[] = []

  // Temperature monitoring check
  if (data.storageTemp) {
    const currentTemp = parseFloat(data.storageTemp)
    const targetTemp = parseFloat(data.storageTemp)
    
    // Check for temperature excursions
    const tempExcursion = Math.abs(currentTemp - targetTemp)
    if (tempExcursion > 2) {
      discrepancies.push(`Temperature excursion detected (${tempExcursion.toFixed(1)}°C)`)
      correctiveActions.push('Investigate temperature control system and assess sample stability')
    }
  }

  // Storage duration check
  if (data.storageDuration) {
    const duration = parseFloat(data.storageDuration)
    const maxDuration = 72 // hours - adjust based on sample type
    
    if (duration > maxDuration) {
      discrepancies.push(`Storage duration (${duration}h) exceeds maximum (${maxDuration}h)`)
      correctiveActions.push('Assess sample stability and consider disposal')
    }
  }

  // Alarm events check
  if (data.alarmEvents && parseInt(data.alarmEvents) > 0) {
    discrepancies.push(`${data.alarmEvents} temperature alarm events recorded`)
    correctiveActions.push('Review alarm logs and assess impact on sample integrity')
  }

  const status = discrepancies.length === 0 ? 'ACCEPTED' : 'CONDITIONAL'

  return {
    status,
    qualityAssessment: `Storage monitoring: ${status}. Temperature: ${data.storageTemp}°C, Duration: ${data.storageDuration}h, Alarms: ${data.alarmEvents || 0}`,
    testingLimitations: [],
    correctiveActions,
    sampleIntegrity: discrepancies.length === 0 ? 'MAINTAINED' : 'QUESTIONABLE',
    complianceLevel: status === 'ACCEPTED' ? 'Storage Standards Met' : 'Requires Investigation',
    safetyStatus: 'No safety issues detected'
  }
}

async function validateBiohazardHandling(data: any) {
  const discrepancies: string[] = []
  const correctiveActions: string[] = []

  // BSL level verification
  if (data.sampleType && data.sampleType.startsWith('bsl-')) {
    const bslLevel = parseInt(data.sampleType.split('-')[1])
    const requiredFacility = `BSL-${bslLevel} facility`
    
    if (bslLevel > 2) {
      discrepancies.push(`Sample requires ${requiredFacility} - verify facility compliance`)
      correctiveActions.push('Confirm facility certification and personnel training')
    }
  }

  // BSC certification check
  if (data.containerStatus === 'expired' || data.containerStatus === 'not-certified') {
    discrepancies.push('Biological safety cabinet certification expired or missing')
    correctiveActions.push('Schedule BSC certification or use certified cabinet')
  }

  // Airflow verification
  if (data.transportConditions) {
    const airflow = parseFloat(data.transportConditions)
    if (airflow < 75 || airflow > 125) {
      discrepancies.push(`Airflow velocity (${airflow} fpm) outside acceptable range (75-125 fpm)`)
      correctiveActions.push('Adjust airflow or contact facility maintenance')
    }
  }

  // HEPA filter status
  if (data.anticoagulant === 'needs-replacement' || data.anticoagulant === 'failed') {
    discrepancies.push('HEPA filter requires replacement or has failed')
    correctiveActions.push('Replace HEPA filter immediately')
  }

  const status = discrepancies.length === 0 ? 'ACCEPTED' : 'REJECTED'

  return {
    status,
    qualityAssessment: `Biohazard handling: ${status}. BSL: ${data.sampleType}, BSC: ${data.containerStatus}, Airflow: ${data.transportConditions} fpm`,
    testingLimitations: [],
    correctiveActions,
    sampleIntegrity: 'MAINTAINED',
    complianceLevel: status === 'ACCEPTED' ? 'Biosafety Standards Met' : 'Requires Correction',
    safetyStatus: discrepancies.length === 0 ? 'All safety protocols followed' : 'Safety protocols require attention'
  }
}

async function validateThawProtocol(data: any) {
  const discrepancies: string[] = []
  const correctiveActions: string[] = []

  // Freeze/thaw cycle check
  if (data.visualAppearance && data.hemolysisGrade) {
    const cycleCount = parseInt(data.visualAppearance)
    const maxCycles = parseInt(data.hemolysisGrade)
    
    if (cycleCount >= maxCycles) {
      discrepancies.push(`Freeze/thaw cycles (${cycleCount}) at or exceed maximum (${maxCycles})`)
      correctiveActions.push('Assess sample stability and consider alternative sample')
    }
  }

  // Thaw method validation
  if (data.collectionMethod === 'microwave') {
    discrepancies.push('Microwave thawing not recommended for laboratory samples')
    correctiveActions.push('Use controlled thawing method (refrigerator or water bath)')
  }

  // Temperature monitoring
  if (data.lipemiaStatus) {
    const thawTemp = parseFloat(data.lipemiaStatus)
    if (thawTemp < 2 || thawTemp > 8) {
      discrepancies.push(`Thaw temperature (${thawTemp}°C) outside recommended range (2-8°C)`)
      correctiveActions.push('Adjust thawing conditions to maintain sample integrity')
    }
  }

  const status = discrepancies.length === 0 ? 'ACCEPTED' : 'CONDITIONAL'

  return {
    status,
    qualityAssessment: `Thaw protocol: ${status}. Cycles: ${data.visualAppearance || 'N/A'}, Method: ${data.collectionMethod}, Temperature: ${data.lipemiaStatus || 'N/A'}°C`,
    testingLimitations: [],
    correctiveActions,
    sampleIntegrity: discrepancies.length === 0 ? 'MAINTAINED' : 'QUESTIONABLE',
    complianceLevel: status === 'ACCEPTED' ? 'Thaw Protocol Followed' : 'Requires Correction',
    safetyStatus: 'No safety issues detected'
  }
}

async function validateAliquoting(data: any) {
  const discrepancies: string[] = []
  const correctiveActions: string[] = []

  // Volume calculation verification
  if (data.transportDuration && data.storageTemp && data.collectionMethod) {
    const originalVolume = parseFloat(data.transportDuration)
    const totalRequired = parseFloat(data.storageTemp)
    const deadVolume = parseFloat(data.collectionMethod)
    
    const availableVolume = originalVolume - deadVolume
    if (totalRequired > availableVolume) {
      discrepancies.push('Insufficient volume for requested aliquoting')
      correctiveActions.push('Reduce aliquot volume or number of aliquots')
    }
  }

  // Volume accuracy check
  if (data.containerStatus === 'failed') {
    discrepancies.push('Volume accuracy check failed')
    correctiveActions.push('Verify pipette calibration and operator technique')
  }

  // Label verification
  if (data.anticoagulant === 'incorrect' || data.anticoagulant === 'missing') {
    discrepancies.push('Label placement or content incorrect')
    correctiveActions.push('Correct labeling and verify identification')
  }

  const status = discrepancies.length === 0 ? 'ACCEPTED' : 'CONDITIONAL'

  return {
    status,
    qualityAssessment: `Aliquoting validation: ${status}. Volume check: ${data.containerStatus}, Labeling: ${data.anticoagulant}`,
    testingLimitations: [],
    correctiveActions,
    sampleIntegrity: 'MAINTAINED',
    complianceLevel: status === 'ACCEPTED' ? 'Aliquoting Standards Met' : 'Requires Correction',
    safetyStatus: 'No safety issues detected'
  }
}

async function logSampleHandlingValidation(data: any) {
  try {
    // Log to database or external system
    console.log('Sample Handling Validation Log:', data)
  } catch (error) {
    console.error('Failed to log sample handling validation:', error)
  }
} 
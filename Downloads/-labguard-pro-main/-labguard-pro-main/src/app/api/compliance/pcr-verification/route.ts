import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      testType,
      protocolVersion,
      operatorId,
      sampleVolume,
      primerLot,
      masterMixLot,
      thermalProfile,
      sampleCount,
      controlsIncluded,
      additionalControls,
      timestamp
    } = body

    // Validate required fields
    if (!testType || !protocolVersion || !operatorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Simulate protocol validation against database
    const protocol = await validateProtocol(testType, protocolVersion)
    const operator = await validateOperator(operatorId, testType)
    const reagentValidation = await validateReagents(primerLot, masterMixLot)
    const controlValidation = validateControls(controlsIncluded, testType)

    // Determine validation status
    const discrepancies: string[] = []
    const correctiveActions: string[] = []
    const escalationTriggers: string[] = []
    const optimizationSuggestions: string[] = []

    // Protocol validation
    if (!protocol.valid) {
      discrepancies.push(`Protocol ${protocolVersion} not found or invalid for ${testType}`)
      correctiveActions.push('Select valid protocol version from approved list')
    }

    // Operator validation
    if (!operator.certified) {
      discrepancies.push(`Operator ${operatorId} not certified for ${testType}`)
      correctiveActions.push('Ensure operator has proper certification for this test type')
      escalationTriggers.push('Operator certification issue detected')
    }

    // Reagent validation
    if (reagentValidation.expired) {
      discrepancies.push(`Reagent lot ${reagentValidation.expiredLot} is expired`)
      correctiveActions.push('Replace expired reagents with valid lots')
      escalationTriggers.push('Expired reagents detected')
    }

    if (reagentValidation.recalled) {
      discrepancies.push(`Reagent lot ${reagentValidation.recalledLot} is on recall list`)
      correctiveActions.push('Immediately discard recalled reagents and obtain replacement')
      escalationTriggers.push('Recalled reagents detected')
    }

    // Sample volume validation
    const expectedVolume = protocol.expectedSampleVolume
    if (sampleVolume && expectedVolume && Math.abs(parseFloat(sampleVolume) - expectedVolume) > 0.1) {
      discrepancies.push(`Sample volume ${sampleVolume}μL differs from expected ${expectedVolume}μL`)
      correctiveActions.push('Adjust sample volume to match protocol requirements')
      optimizationSuggestions.push('Consider using automated pipetting for consistent volumes')
    }

    // Control validation
    if (!controlValidation.valid) {
      discrepancies.push(`Missing required controls: ${controlValidation.missing.join(', ')}`)
      correctiveActions.push('Include all required controls before proceeding')
    }

    // Thermal profile validation
    if (thermalProfile && protocol.thermalProfile && thermalProfile !== protocol.thermalProfile) {
      discrepancies.push(`Thermal profile ${thermalProfile} does not match protocol ${protocol.thermalProfile}`)
      correctiveActions.push('Use thermal profile specified in validated protocol')
    }

    // Sample count validation
    if (sampleCount > protocol.maxSamples) {
      discrepancies.push(`Sample count ${sampleCount} exceeds maximum ${protocol.maxSamples}`)
      correctiveActions.push('Reduce sample count or split into multiple runs')
    }

    // Determine overall status
    const status = discrepancies.length === 0 ? 'PASS' : 'FAIL'
    const approvalCode = status === 'PASS' ? generateApprovalCode() : undefined

    // Log validation attempt
    await logValidationAttempt({
      testType,
      protocolVersion,
      operatorId,
      status,
      discrepancies: discrepancies.length,
      timestamp
    })

    return NextResponse.json({
      status,
      discrepancies,
      correctiveActions,
      escalationTriggers,
      optimizationSuggestions,
      approvalCode,
      protocol: protocol.valid ? {
        name: protocol.name,
        version: protocol.version,
        expectedSampleVolume: protocol.expectedSampleVolume,
        thermalProfile: protocol.thermalProfile,
        maxSamples: protocol.maxSamples
      } : null,
      operator: operator.certified ? {
        id: operator.id,
        name: operator.name,
        certification: operator.certification,
        expiryDate: operator.expiryDate
      } : null,
      reagents: {
        primerLot: reagentValidation.primerValid ? 'Valid' : 'Invalid',
        masterMixLot: reagentValidation.masterMixValid ? 'Valid' : 'Invalid'
      }
    })

  } catch (error) {
    console.error('PCR verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function validateProtocol(testType: string, version: string) {
  // Simulate database lookup
  const protocols: Record<string, Record<string, any>> = {
    'covid-19-rt-pcr': {
      'v2.1': {
        valid: true,
        name: 'COVID-19 RT-PCR Protocol',
        version: 'v2.1',
        expectedSampleVolume: 5.0,
        thermalProfile: 'standard-40-cycle',
        maxSamples: 96
      }
    },
    'flu-a-b': {
      'v1.5': {
        valid: true,
        name: 'Influenza A/B RT-PCR Protocol',
        version: 'v1.5',
        expectedSampleVolume: 3.0,
        thermalProfile: 'rapid-30-cycle',
        maxSamples: 48
      }
    }
  }

  return protocols[testType]?.[version] || { valid: false }
}

async function validateOperator(operatorId: string, testType: string) {
  // Simulate database lookup
  const operators: Record<string, any> = {
    'TECH001': {
      certified: true,
      id: 'TECH001',
      name: 'Dr. Sarah Johnson',
      certification: 'Molecular Biology Specialist',
      expiryDate: '2025-12-31'
    },
    'TECH002': {
      certified: false,
      id: 'TECH002',
      name: 'Mike Chen',
      certification: 'General Laboratory Technician',
      expiryDate: '2023-06-15'
    }
  }

  return operators[operatorId] || { certified: false }
}

async function validateReagents(primerLot: string, masterMixLot: string) {
  // Simulate reagent validation
  const expiredLots = ['LOT2023001', 'LOT2023002']
  const recalledLots = ['LOT2024001']

  return {
    expired: expiredLots.includes(primerLot) || expiredLots.includes(masterMixLot),
    expiredLot: expiredLots.includes(primerLot) ? primerLot : expiredLots.includes(masterMixLot) ? masterMixLot : null,
    recalled: recalledLots.includes(primerLot) || recalledLots.includes(masterMixLot),
    recalledLot: recalledLots.includes(primerLot) ? primerLot : recalledLots.includes(masterMixLot) ? masterMixLot : null,
    primerValid: !expiredLots.includes(primerLot) && !recalledLots.includes(primerLot),
    masterMixValid: !expiredLots.includes(masterMixLot) && !recalledLots.includes(masterMixLot)
  }
}

function validateControls(controlsIncluded: string[], testType: string) {
  const requiredControls = ['NTC', 'PTC']
  const missing = requiredControls.filter(control => !controlsIncluded.includes(control))

  return {
    valid: missing.length === 0,
    missing
  }
}

function generateApprovalCode() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `PCR-${timestamp}-${random}`.toUpperCase()
}

async function logValidationAttempt(data: any) {
  try {
    // Log to database or external system
    console.log('PCR Validation Log:', data)
  } catch (error) {
    console.error('Failed to log validation attempt:', error)
  }
} 
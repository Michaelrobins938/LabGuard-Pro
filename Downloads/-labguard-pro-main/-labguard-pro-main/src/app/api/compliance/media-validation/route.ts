import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      testType,
      lotNumber,
      expirationDate,
      currentDate,
      tempLog,
      visualNotes,
      techId,
      storageRequirements,
      visualStandards,
      qcFrequency,
      sterilityMarkers
    } = body

    // Validate required fields
    if (!testType || !lotNumber || !expirationDate || !currentDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Perform validation checks
    const expirationCheck = checkExpiration(expirationDate, currentDate)
    const storageValidation = validateStorage(tempLog, storageRequirements)
    const visualAssessment = assessVisualContamination(visualNotes, visualStandards)
    const qcValidation = validateQC(qcFrequency, lotNumber)
    const recallStatus = checkRecallStatus(lotNumber)

    // Determine overall status
    let status: 'APPROVE' | 'CONDITIONAL' | 'REJECT' = 'APPROVE'
    const actionsRequired: string[] = []
    const documentation: string[] = []
    let nextReviewDate: string | undefined

    // Critical failures
    if (expirationCheck.expired) {
      status = 'REJECT'
      actionsRequired.push('Discard expired media immediately')
      actionsRequired.push('Order replacement media')
    }

    if (visualAssessment.contaminated) {
      status = 'REJECT'
      actionsRequired.push('Discard contaminated media')
      actionsRequired.push('Document contamination in incident log')
    }

    if (recallStatus.recalled) {
      status = 'REJECT'
      actionsRequired.push('Return recalled media to manufacturer')
      actionsRequired.push('Obtain replacement from approved supplier')
    }

    // Conditional approvals
    if (expirationCheck.nearExpiration && status !== 'REJECT') {
      status = 'CONDITIONAL'
      actionsRequired.push('Use media within 7 days')
      actionsRequired.push('Order replacement media')
      nextReviewDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }

    if (storageValidation.temperatureExcursion && status !== 'REJECT') {
      status = 'CONDITIONAL'
      actionsRequired.push('Perform stability testing before use')
      actionsRequired.push('Monitor results closely')
    }

    if (qcValidation.overdue && status !== 'REJECT') {
      status = 'CONDITIONAL'
      actionsRequired.push('Perform QC testing before use')
      actionsRequired.push('Document QC results')
    }

    // Documentation requirements
    documentation.push('Media inspection log entry')
    documentation.push('Temperature monitoring records')
    documentation.push('QC testing documentation')
    if (status === 'REJECT') {
      documentation.push('Disposal documentation')
      documentation.push('Incident report (if applicable)')
    }

    // Log validation attempt
    await logMediaValidation({
      testType,
      lotNumber,
      status,
      techId,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      status,
      reasoning: generateReasoning(status, expirationCheck, storageValidation, visualAssessment, qcValidation, recallStatus),
      actionsRequired,
      documentation,
      nextReviewDate,
      temperatureExcursion: storageValidation.temperatureExcursion,
      visualContamination: visualAssessment.contaminated,
      qcOverdue: qcValidation.overdue,
      recallStatus: recallStatus.recalled ? recallStatus.reason : undefined,
      details: {
        expiration: {
          expired: expirationCheck.expired,
          daysUntilExpiration: expirationCheck.daysUntilExpiration,
          nearExpiration: expirationCheck.nearExpiration
        },
        storage: {
          temperatureExcursion: storageValidation.temperatureExcursion,
          temperatureRange: storageValidation.temperatureRange,
          compliance: storageValidation.compliant
        },
        visual: {
          contaminated: visualAssessment.contaminated,
          issues: visualAssessment.issues
        },
        qc: {
          overdue: qcValidation.overdue,
          lastQC: qcValidation.lastQC,
          nextQC: qcValidation.nextQC
        },
        recall: {
          recalled: recallStatus.recalled,
          reason: recallStatus.reason
        }
      }
    })

  } catch (error) {
    console.error('Media validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function checkExpiration(expirationDate: string, currentDate: string) {
  const expDate = new Date(expirationDate)
  const currDate = new Date(currentDate)
  const diffTime = expDate.getTime() - currDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return {
    expired: diffDays < 0,
    daysUntilExpiration: diffDays,
    nearExpiration: diffDays >= 0 && diffDays <= 7
  }
}

function validateStorage(tempLog: string, requirements: string) {
  // Simulate temperature validation
  const temperatureRanges = {
    '2-8c': { min: 2, max: 8 },
    'room-temp': { min: 20, max: 25 },
    'frozen': { min: -25, max: -15 },
    'ultra-cold': { min: -85, max: -75 }
  }

  const range = temperatureRanges[requirements as keyof typeof temperatureRanges] || { min: 2, max: 8 }
  
  // Simulate temperature excursion detection
  const hasExcursion = tempLog.toLowerCase().includes('excursion') || 
                      tempLog.toLowerCase().includes('out of range') ||
                      tempLog.toLowerCase().includes('temperature deviation')

  return {
    temperatureExcursion: hasExcursion,
    temperatureRange: `${range.min}°C to ${range.max}°C`,
    compliant: !hasExcursion
  }
}

function assessVisualContamination(notes: string, standards: string) {
  const contaminationKeywords = [
    'cloudy', 'turbid', 'precipitate', 'particles', 'discolored',
    'mold', 'fungus', 'growth', 'contamination', 'foreign material'
  ]

  const issues = contaminationKeywords.filter(keyword => 
    notes.toLowerCase().includes(keyword)
  )

  return {
    contaminated: issues.length > 0,
    issues
  }
}

function validateQC(frequency: string, lotNumber: string) {
  // Simulate QC validation
  const qcSchedule = {
    'daily': 1,
    'weekly': 7,
    'monthly': 30,
    'lot': 0,
    'quarterly': 90
  }

  const daysSinceLastQC = Math.floor(Math.random() * 45) // Simulate random QC timing
  const requiredDays = qcSchedule[frequency as keyof typeof qcSchedule] || 30

  return {
    overdue: daysSinceLastQC > requiredDays,
    lastQC: new Date(Date.now() - daysSinceLastQC * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextQC: new Date(Date.now() + (requiredDays - daysSinceLastQC) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
}

function checkRecallStatus(lotNumber: string) {
  // Simulate recall check
  const recalledLots = ['LOT2024001', 'LOT2024002', 'LOT2024003']
  
  return {
    recalled: recalledLots.includes(lotNumber),
    reason: recalledLots.includes(lotNumber) ? 'Manufacturer recall due to quality issues' : undefined
  }
}

function generateReasoning(
  status: string,
  expiration: any,
  storage: any,
  visual: any,
  qc: any,
  recall: any
) {
  if (status === 'REJECT') {
    const reasons: string[] = []
    if (expiration.expired) reasons.push('Media is expired')
    if (visual.contaminated) reasons.push('Visual contamination detected')
    if (recall.recalled) reasons.push('Media is on recall list')
    return `Media rejected: ${reasons.join(', ')}`
  }

  if (status === 'CONDITIONAL') {
    const reasons: string[] = []
    if (expiration.nearExpiration) reasons.push('Media expires soon')
    if (storage.temperatureExcursion) reasons.push('Temperature excursion detected')
    if (qc.overdue) reasons.push('QC testing overdue')
    return `Media approved with conditions: ${reasons.join(', ')}`
  }

  return 'Media meets all safety and quality requirements for use'
}

async function logMediaValidation(data: any) {
  try {
    // Log to database or external system
    console.log('Media Validation Log:', data)
  } catch (error) {
    console.error('Failed to log media validation:', error)
  }
} 
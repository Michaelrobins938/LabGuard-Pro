import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mediaId, validationType, data } = body

    // Mock validation logic
    const validationResult = {
      isValid: Math.random() > 0.3,
      confidence: Math.random() * 0.3 + 0.7,
      issues: [] as string[],
      recommendations: [] as string[]
    }

    // Simulate validation issues
    if (Math.random() > 0.7) {
      validationResult.issues.push('Media is expired')
    }
    if (Math.random() > 0.8) {
      validationResult.issues.push('Visual contamination detected')
    }
    if (Math.random() > 0.9) {
      validationResult.issues.push('Media is on recall list')
    }

    // Generate recommendations
    if (validationResult.issues.length > 0) {
      validationResult.recommendations.push('Media expires soon')
      validationResult.recommendations.push('Temperature excursion detected')
      validationResult.recommendations.push('QC testing overdue')
    }

    return NextResponse.json({
      success: true,
      validation: validationResult,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error validating media:', error)
    return NextResponse.json(
      { error: 'Failed to validate media' },
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
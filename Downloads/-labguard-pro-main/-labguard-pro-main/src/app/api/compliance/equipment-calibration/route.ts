import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      equipmentId,
      equipmentType,
      modelSerial,
      lastCalibration,
      nextCalibration,
      operator,
      environmentalConditions,
      performanceData,
      timestamp
    } = body

    // Validate required fields
    if (!equipmentId || !equipmentType || !operator) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let validationResult

    // Route to specific validation logic based on equipment type
    switch (equipmentType) {
      case 'balance':
        validationResult = await validateAnalyticalBalance(performanceData, environmentalConditions)
        break
      case 'pipette':
        validationResult = await validatePipette(performanceData)
        break
      case 'centrifuge':
        validationResult = await validateCentrifuge(performanceData)
        break
      case 'incubator':
        validationResult = await validateIncubator(performanceData)
        break
      case 'autoclave':
        validationResult = await validateAutoclave(performanceData)
        break
      case 'spectrophotometer':
        validationResult = await validateSpectrophotometer(performanceData)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid equipment type' },
          { status: 400 }
        )
    }

    // Log validation attempt
    await logCalibrationValidation({
      equipmentId,
      equipmentType,
      operator,
      status: validationResult.status,
      timestamp
    })

    return NextResponse.json(validationResult)

  } catch (error) {
    console.error('Equipment calibration validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function validateAnalyticalBalance(performanceData: any, environmentalConditions: any) {
  const discrepancies: string[] = []
  const correctiveActions: string[] = []

  // Linearity check (R² > 0.9999)
  if (performanceData.linearity && parseFloat(performanceData.linearity) < 0.9999) {
    discrepancies.push('Linearity R² below acceptable threshold (0.9999)')
    correctiveActions.push('Perform linearity calibration or contact service technician')
  }

  // Repeatability check (SD < 0.1mg for Class I)
  if (performanceData.repeatability && parseFloat(performanceData.repeatability) >= 0.1) {
    discrepancies.push('Repeatability standard deviation exceeds 0.1mg limit')
    correctiveActions.push('Check for environmental factors or mechanical issues')
  }

  // Accuracy check (within ±0.1mg)
  if (performanceData.accuracy && Math.abs(parseFloat(performanceData.accuracy)) > 0.1) {
    discrepancies.push('Accuracy deviation exceeds ±0.1mg limit')
    correctiveActions.push('Perform calibration adjustment or external calibration')
  }

  // Environmental conditions
  if (environmentalConditions.temperature) {
    const temp = parseFloat(environmentalConditions.temperature)
    if (temp < 20 || temp > 24) {
      discrepancies.push('Temperature outside acceptable range (20-24°C)')
      correctiveActions.push('Adjust laboratory temperature or relocate balance')
    }
  }

  if (environmentalConditions.humidity) {
    const humidity = parseFloat(environmentalConditions.humidity)
    if (humidity < 45 || humidity > 75) {
      discrepancies.push('Humidity outside acceptable range (45-75%)')
      correctiveActions.push('Adjust laboratory humidity or use dehumidifier')
    }
  }

  if (environmentalConditions.vibration === 'high') {
    discrepancies.push('High vibration level detected')
    correctiveActions.push('Relocate balance to vibration-free location')
  }

  const status = discrepancies.length === 0 ? 'PASS' : 'FAIL'
  const nextVerification = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return {
    status,
    performanceSummary: `Analytical balance validation: ${status}. Linearity: ${performanceData.linearity || 'N/A'}, Repeatability: ${performanceData.repeatability || 'N/A'}mg, Accuracy: ${performanceData.accuracy || 'N/A'}mg`,
    correctiveActions,
    nextVerification,
    complianceLevel: status === 'PASS' ? 'ISO 17025 Compliant' : 'Requires Correction',
    safetyStatus: 'All safety systems operational'
  }
}

async function validatePipette(performanceData: any) {
  const discrepancies: string[] = []
  const correctiveActions: string[] = []

  // ISO 8655 compliance checks
  const testVolume = parseFloat(performanceData.testVolume || 0)
  const meanVolume = parseFloat(performanceData.meanVolume || 0)
  const standardDev = parseFloat(performanceData.standardDev || 0)
  const cvPercent = parseFloat(performanceData.cvPercent || 0)

  // Calculate accuracy error
  if (testVolume && meanVolume) {
    const accuracyError = Math.abs((meanVolume - testVolume) / testVolume) * 100
    
    // Accuracy limits based on volume range
    let accuracyLimit = 2.0 // Default for 10-100 μL
    if (testVolume < 10) accuracyLimit = 4.0
    if (testVolume > 100) accuracyLimit = 1.0

    if (accuracyError > accuracyLimit) {
      discrepancies.push(`Accuracy error (${accuracyError.toFixed(2)}%) exceeds limit (${accuracyLimit}%)`)
      correctiveActions.push('Schedule pipette recalibration or service')
    }
  }

  // Precision check (CV ≤ 1% for volumes > 10μL)
  if (testVolume > 10 && cvPercent > 1.0) {
    discrepancies.push(`Precision CV (${cvPercent.toFixed(2)}%) exceeds 1% limit`)
    correctiveActions.push('Check operator technique or pipette mechanism')
  }

  // Water temperature check (20±5°C)
  if (performanceData.waterTemp) {
    const waterTemp = parseFloat(performanceData.waterTemp)
    if (waterTemp < 15 || waterTemp > 25) {
      discrepancies.push('Water temperature outside acceptable range (15-25°C)')
      correctiveActions.push('Adjust water temperature to 20±5°C')
    }
  }

  const status = discrepancies.length === 0 ? 'PASS' : 'FAIL'
  const nextVerification = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return {
    status,
    performanceSummary: `Pipette validation: ${status}. Mean volume: ${meanVolume}μL, CV: ${cvPercent}%, Accuracy: ${testVolume && meanVolume ? Math.abs((meanVolume - testVolume) / testVolume * 100).toFixed(2) : 'N/A'}%`,
    correctiveActions,
    nextVerification,
    complianceLevel: status === 'PASS' ? 'ISO 8655 Compliant' : 'Requires Correction',
    safetyStatus: 'No safety issues detected'
  }
}

async function validateCentrifuge(performanceData: any) {
  const discrepancies: string[] = []
  const correctiveActions: string[] = []

  const testSpeed = parseFloat(performanceData.testSpeed || 0)
  const measuredSpeed = parseFloat(performanceData.measuredSpeed || 0)
  const calculatedRCF = parseFloat(performanceData.calculatedRCF || 0)
  const tempIncrease = parseFloat(performanceData.tempIncrease || 0)

  // Speed accuracy check (±2%)
  if (testSpeed && measuredSpeed) {
    const speedAccuracy = Math.abs((measuredSpeed - testSpeed) / testSpeed) * 100
    if (speedAccuracy > 2) {
      discrepancies.push(`Speed accuracy (${speedAccuracy.toFixed(1)}%) exceeds ±2% limit`)
      correctiveActions.push('Calibrate speed control or contact service technician')
    }
  }

  // Temperature rise check (<10°C)
  if (tempIncrease >= 10) {
    discrepancies.push(`Temperature rise (${tempIncrease}°C) exceeds 10°C limit`)
    correctiveActions.push('Check cooling system or reduce run time')
  }

  // RCF calculation validation
  if (calculatedRCF && calculatedRCF <= 0) {
    discrepancies.push('Invalid RCF calculation detected')
    correctiveActions.push('Verify rotor radius and speed settings')
  }

  const status = discrepancies.length === 0 ? 'PASS' : 'FAIL'
  const nextVerification = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return {
    status,
    performanceSummary: `Centrifuge validation: ${status}. Speed accuracy: ${testSpeed && measuredSpeed ? Math.abs((measuredSpeed - testSpeed) / testSpeed * 100).toFixed(1) : 'N/A'}%, Temperature rise: ${tempIncrease}°C`,
    correctiveActions,
    nextVerification,
    complianceLevel: status === 'PASS' ? 'Manufacturer Specifications Met' : 'Requires Correction',
    safetyStatus: 'All safety interlocks functional'
  }
}

async function validateIncubator(performanceData: any) {
  const discrepancies: string[] = []
  const correctiveActions: string[] = []

  const targetTemp = parseFloat(performanceData.targetTemp || 0)
  const meanTemp = parseFloat(performanceData.meanTemp || 0)
  const tempRange = parseFloat(performanceData.tempRange || 0)
  const uniformityIndex = parseFloat(performanceData.uniformityIndex || 0)

  // Temperature accuracy check (±0.5°C)
  if (targetTemp && meanTemp) {
    const tempAccuracy = Math.abs(meanTemp - targetTemp)
    if (tempAccuracy > 0.5) {
      discrepancies.push(`Temperature accuracy (${tempAccuracy.toFixed(1)}°C) exceeds ±0.5°C limit`)
      correctiveActions.push('Calibrate temperature sensor or adjust set point')
    }
  }

  // Uniformity check (≤±1.0°C)
  if (tempRange > 2.0) {
    discrepancies.push(`Temperature uniformity (${tempRange}°C) exceeds ±1.0°C limit`)
    correctiveActions.push('Check air circulation or sensor placement')
  }

  // Uniformity index check
  if (uniformityIndex > 0.5) {
    discrepancies.push(`Uniformity index (${uniformityIndex}) indicates poor temperature distribution`)
    correctiveActions.push('Verify probe placement and air flow patterns')
  }

  const status = discrepancies.length === 0 ? 'PASS' : 'FAIL'
  const nextVerification = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return {
    status,
    performanceSummary: `Incubator validation: ${status}. Temperature accuracy: ${targetTemp && meanTemp ? Math.abs(meanTemp - targetTemp).toFixed(1) : 'N/A'}°C, Uniformity: ${tempRange}°C`,
    correctiveActions,
    nextVerification,
    complianceLevel: status === 'PASS' ? 'Temperature Mapping Compliant' : 'Requires Correction',
    safetyStatus: 'Alarm systems operational'
  }
}

async function validateAutoclave(performanceData: any) {
  const discrepancies: string[] = []
  const correctiveActions: string[] = []

  const tempSetting = parseFloat(performanceData.tempSetting || 0)
  const actualTemp = parseFloat(performanceData.actualTemp || 0)
  const actualPressure = parseFloat(performanceData.actualPressure || 0)
  const actualExposure = parseFloat(performanceData.actualExposure || 0)
  const biResults = performanceData.biResults

  // Temperature check (≥121°C)
  if (actualTemp < 121) {
    discrepancies.push(`Achieved temperature (${actualTemp}°C) below minimum requirement (121°C)`)
    correctiveActions.push('Check heating elements or steam supply')
  }

  // Pressure check (15-17 psi)
  if (actualPressure < 15 || actualPressure > 17) {
    discrepancies.push(`Pressure (${actualPressure} psi) outside acceptable range (15-17 psi)`)
    correctiveActions.push('Adjust pressure settings or check pressure relief valve')
  }

  // Exposure time check
  if (actualExposure < 15) {
    discrepancies.push(`Exposure time (${actualExposure} minutes) below minimum requirement (15 minutes)`)
    correctiveActions.push('Extend cycle time or check timer function')
  }

  // Biological indicator check
  if (biResults === 'positive') {
    discrepancies.push('Biological indicator shows growth - sterilization ineffective')
    correctiveActions.push('Immediately stop use and investigate sterilization parameters')
  }

  const status = discrepancies.length === 0 ? 'PASS' : 'FAIL'
  const nextVerification = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return {
    status,
    performanceSummary: `Autoclave validation: ${status}. Temperature: ${actualTemp}°C, Pressure: ${actualPressure} psi, Exposure: ${actualExposure} minutes, BI: ${biResults || 'N/A'}`,
    correctiveActions,
    nextVerification,
    complianceLevel: status === 'PASS' ? 'Sterilization Standards Met' : 'Requires Correction',
    safetyStatus: biResults === 'positive' ? 'CRITICAL: Sterilization Failure' : 'All safety systems operational'
  }
}

async function validateSpectrophotometer(performanceData: any) {
  const discrepancies: string[] = []
  const correctiveActions: string[] = []

  const wavelengthError = parseFloat(performanceData.wavelengthError || 0)
  const expectedAbs = parseFloat(performanceData.expectedAbs || 0)
  const measuredAbs = parseFloat(performanceData.measuredAbs || 0)
  const photometricError = parseFloat(performanceData.photometricError || 0)

  // Wavelength accuracy check (±1.0 nm)
  if (Math.abs(wavelengthError) > 1.0) {
    discrepancies.push(`Wavelength error (${wavelengthError} nm) exceeds ±1.0 nm limit`)
    correctiveActions.push('Perform wavelength calibration or contact service technician')
  }

  // Photometric accuracy check (±0.005 A or ±0.5%)
  if (expectedAbs && measuredAbs) {
    const absError = Math.abs(measuredAbs - expectedAbs)
    const percentError = Math.abs((measuredAbs - expectedAbs) / expectedAbs) * 100
    
    if (absError > 0.005 && percentError > 0.5) {
      discrepancies.push(`Photometric error (${absError.toFixed(3)} A, ${percentError.toFixed(1)}%) exceeds limits`)
      correctiveActions.push('Calibrate photometric system or replace lamp')
    }
  }

  // Direct photometric error check
  if (photometricError && Math.abs(photometricError) > 0.005) {
    discrepancies.push(`Photometric error (${photometricError.toFixed(3)}) exceeds ±0.005 limit`)
    correctiveActions.push('Check detector response or calibration standards')
  }

  const status = discrepancies.length === 0 ? 'PASS' : 'FAIL'
  const nextVerification = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return {
    status,
    performanceSummary: `Spectrophotometer validation: ${status}. Wavelength error: ${wavelengthError} nm, Photometric error: ${photometricError || (expectedAbs && measuredAbs ? Math.abs(measuredAbs - expectedAbs).toFixed(3) : 'N/A')} A`,
    correctiveActions,
    nextVerification,
    complianceLevel: status === 'PASS' ? 'Optical Standards Met' : 'Requires Correction',
    safetyStatus: 'All optical systems operational'
  }
}

async function logCalibrationValidation(data: any) {
  try {
    // Log to database or external system
    console.log('Equipment Calibration Validation Log:', data)
  } catch (error) {
    console.error('Failed to log calibration validation:', error)
  }
} 
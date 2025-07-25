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
      case 'critical-value':
        result = validateCriticalValue(data);
        break;
      case 'qc-evaluation':
        result = validateQCEvaluation(data);
        break;
      case 'reference-interval':
        result = validateReferenceInterval(data);
        break;
      case 'inter-laboratory':
        result = validateInterLaboratory(data);
        break;
      case 'delta-check':
        result = validateDeltaCheck(data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid tool type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Result validation error:', error);
    return NextResponse.json(
      { error: 'Validation failed' },
      { status: 500 }
    );
  }
}

function validateCriticalValue(data: Record<string, any>): ValidationResult {
  const {
    testName,
    result,
    unit,
    criticalLow,
    criticalHigh,
    patientId,
    orderingPhysician,
    notificationMethod,
    escalationTime
  } = data;

  const issues: string[] = [];
  const correctiveActions: string[] = [];
  let complianceScore = 100;

  // Validate required fields
  if (!testName || !result || !criticalLow || !criticalHigh) {
    issues.push('Missing required critical value parameters');
    correctiveActions.push('Complete all required fields for critical value assessment');
    complianceScore -= 30;
  }

  // Check if result is actually critical
  const resultNum = parseFloat(result);
  const lowNum = parseFloat(criticalLow);
  const highNum = parseFloat(criticalHigh);

  if (!isNaN(resultNum) && !isNaN(lowNum) && !isNaN(highNum)) {
    const isCritical = resultNum < lowNum || resultNum > highNum;
    
    if (isCritical) {
      // Validate notification protocol
      if (!notificationMethod) {
        issues.push('Notification method not specified for critical value');
        correctiveActions.push('Establish immediate notification protocol for critical values');
        complianceScore -= 20;
      }

      if (!escalationTime || parseInt(escalationTime) > 30) {
        issues.push('Escalation time exceeds recommended 30-minute limit');
        correctiveActions.push('Implement escalation protocol within 30 minutes for critical values');
        complianceScore -= 15;
      }

      if (!orderingPhysician) {
        issues.push('Ordering physician not identified for critical value notification');
        correctiveActions.push('Document ordering physician for all critical value notifications');
        complianceScore -= 10;
      }
    }
  }

  // Validate patient identification
  if (!patientId) {
    issues.push('Patient identification missing');
    correctiveActions.push('Ensure patient ID is documented for all critical value alerts');
    complianceScore -= 15;
  }

  // Validate units
  if (!unit) {
    issues.push('Units not specified for test result');
    correctiveActions.push('Always include units with test results');
    complianceScore -= 10;
  }

  const status = complianceScore >= 90 ? 'pass' : complianceScore >= 70 ? 'warning' : 'fail';

  return {
    status,
    message: issues.length === 0 
      ? 'Critical value alert system validation passed' 
      : `Critical value validation issues detected: ${issues.length} problems found`,
    correctiveActions,
    complianceLevel: Math.max(0, complianceScore),
    timestamp: new Date().toISOString(),
    details: {
      isCritical: resultNum < lowNum || resultNum > highNum,
      notificationProtocol: notificationMethod,
      escalationTime: parseInt(escalationTime),
      patientIdentified: !!patientId,
      physicianIdentified: !!orderingPhysician
    }
  };
}

function validateQCEvaluation(data: Record<string, any>): ValidationResult {
  const {
    qcLevel,
    analyte,
    targetValue,
    observedValue,
    standardDeviation,
    lotNumber,
    expirationDate,
    frequency
  } = data;

  const issues: string[] = [];
  const correctiveActions: string[] = [];
  let complianceScore = 100;

  // Validate required fields
  if (!analyte || !targetValue || !observedValue) {
    issues.push('Missing required QC parameters');
    correctiveActions.push('Complete all required QC evaluation fields');
    complianceScore -= 25;
  }

  // Validate QC material
  if (!lotNumber) {
    issues.push('QC lot number not documented');
    correctiveActions.push('Document QC lot number for traceability');
    complianceScore -= 15;
  }

  if (!expirationDate) {
    issues.push('QC expiration date not documented');
    correctiveActions.push('Document QC expiration date and monitor for expired materials');
    complianceScore -= 15;
  }

  // Check expiration
  if (expirationDate) {
    const expDate = new Date(expirationDate);
    const today = new Date();
    if (expDate < today) {
      issues.push('QC material is expired');
      correctiveActions.push('Replace expired QC material immediately');
      complianceScore -= 30;
    }
  }

  // Validate QC performance
  const target = parseFloat(targetValue);
  const observed = parseFloat(observedValue);
  const sd = parseFloat(standardDeviation);

  if (!isNaN(target) && !isNaN(observed) && !isNaN(sd)) {
    const zScore = Math.abs((observed - target) / sd);
    
    if (zScore > 3) {
      issues.push('QC result exceeds 3SD limit');
      correctiveActions.push('Investigate QC failure and take corrective action');
      complianceScore -= 25;
    } else if (zScore > 2) {
      issues.push('QC result exceeds 2SD warning limit');
      correctiveActions.push('Monitor QC trends and investigate if pattern continues');
      complianceScore -= 10;
    }
  }

  // Validate frequency
  if (!frequency) {
    issues.push('QC frequency not specified');
    correctiveActions.push('Establish appropriate QC frequency for analyte');
    complianceScore -= 10;
  }

  const status = complianceScore >= 90 ? 'pass' : complianceScore >= 70 ? 'warning' : 'fail';

  return {
    status,
    message: issues.length === 0 
      ? 'QC evaluation validation passed' 
      : `QC evaluation issues detected: ${issues.length} problems found`,
    correctiveActions,
    complianceLevel: Math.max(0, complianceScore),
    timestamp: new Date().toISOString(),
    details: {
      qcLevel,
      zScore: !isNaN(target) && !isNaN(observed) && !isNaN(sd) ? Math.abs((observed - target) / sd) : null,
      isExpired: expirationDate ? new Date(expirationDate) < new Date() : false,
      frequency,
      lotNumber: !!lotNumber
    }
  };
}

function validateReferenceInterval(data: Record<string, any>): ValidationResult {
  const {
    analyte,
    patientAge,
    patientGender,
    patientPopulation,
    result,
    unit,
    referenceLow,
    referenceHigh,
    clinicalSignificance,
    method,
    instrument
  } = data;

  const issues: string[] = [];
  const correctiveActions: string[] = [];
  let complianceScore = 100;

  // Validate required fields
  if (!analyte || !result || !referenceLow || !referenceHigh) {
    issues.push('Missing required reference interval parameters');
    correctiveActions.push('Complete all required reference interval fields');
    complianceScore -= 25;
  }

  // Validate patient demographics
  if (!patientAge) {
    issues.push('Patient age not documented');
    correctiveActions.push('Document patient age for appropriate reference interval selection');
    complianceScore -= 15;
  }

  if (!patientGender) {
    issues.push('Patient gender not documented');
    correctiveActions.push('Document patient gender for gender-specific reference intervals');
    complianceScore -= 10;
  }

  if (!patientPopulation) {
    issues.push('Patient population not specified');
    correctiveActions.push('Specify patient population (pediatric, adult, geriatric)');
    complianceScore -= 10;
  }

  // Validate reference interval appropriateness
  const resultNum = parseFloat(result);
  const lowNum = parseFloat(referenceLow);
  const highNum = parseFloat(referenceHigh);

  if (!isNaN(resultNum) && !isNaN(lowNum) && !isNaN(highNum)) {
    if (lowNum >= highNum) {
      issues.push('Invalid reference interval (low >= high)');
      correctiveActions.push('Verify reference interval values are correctly ordered');
      complianceScore -= 20;
    }

    if (resultNum < lowNum || resultNum > highNum) {
      issues.push('Result outside reference interval');
      // This is not necessarily an error, but should be noted
      complianceScore -= 5;
    }
  }

  // Validate method and instrument
  if (!method) {
    issues.push('Analytical method not documented');
    correctiveActions.push('Document analytical method for reference interval validation');
    complianceScore -= 10;
  }

  if (!instrument) {
    issues.push('Instrument not documented');
    correctiveActions.push('Document instrument used for result generation');
    complianceScore -= 10;
  }

  // Validate units
  if (!unit) {
    issues.push('Units not specified');
    correctiveActions.push('Always include units with reference intervals');
    complianceScore -= 10;
  }

  // Validate clinical significance documentation
  if (!clinicalSignificance) {
    issues.push('Clinical significance not documented');
    correctiveActions.push('Document clinical significance for abnormal results');
    complianceScore -= 10;
  }

  const status = complianceScore >= 90 ? 'pass' : complianceScore >= 70 ? 'warning' : 'fail';

  return {
    status,
    message: issues.length === 0 
      ? 'Reference interval validation passed' 
      : `Reference interval issues detected: ${issues.length} problems found`,
    correctiveActions,
    complianceLevel: Math.max(0, complianceScore),
    timestamp: new Date().toISOString(),
    details: {
      isAbnormal: !isNaN(resultNum) && !isNaN(lowNum) && !isNaN(highNum) ? (resultNum < lowNum || resultNum > highNum) : null,
      patientDemographics: { age: patientAge, gender: patientGender, population: patientPopulation },
      methodDocumented: !!method,
      instrumentDocumented: !!instrument,
      clinicalSignificanceDocumented: !!clinicalSignificance
    }
  };
}

function validateInterLaboratory(data: Record<string, any>): ValidationResult {
  const {
    programName,
    analyte,
    labResult,
    peerGroupMean,
    peerGroupSD,
    zScore,
    acceptabilityCriteria,
    method,
    instrument,
    participationDate
  } = data;

  const issues: string[] = [];
  const correctiveActions: string[] = [];
  let complianceScore = 100;

  // Validate required fields
  if (!programName || !analyte || !labResult) {
    issues.push('Missing required inter-laboratory comparison parameters');
    correctiveActions.push('Complete all required proficiency testing fields');
    complianceScore -= 25;
  }

  // Validate program participation
  if (!participationDate) {
    issues.push('Participation date not documented');
    correctiveActions.push('Document participation date for proficiency testing');
    complianceScore -= 10;
  }

  // Validate statistical parameters
  const labResultNum = parseFloat(labResult);
  const meanNum = parseFloat(peerGroupMean);
  const sdNum = parseFloat(peerGroupSD);
  const zScoreNum = parseFloat(zScore);

  if (!isNaN(labResultNum) && !isNaN(meanNum) && !isNaN(sdNum)) {
    // Calculate expected z-score
    const expectedZScore = (labResultNum - meanNum) / sdNum;
    
    if (!isNaN(zScoreNum) && Math.abs(zScoreNum - expectedZScore) > 0.1) {
      issues.push('Z-score calculation discrepancy detected');
      correctiveActions.push('Verify z-score calculation and statistical analysis');
      complianceScore -= 15;
    }

    // Check acceptability
    if (!isNaN(zScoreNum)) {
      const acceptability = parseFloat(acceptabilityCriteria?.replace('±', '') || '2.0');
      
      if (Math.abs(zScoreNum) > acceptability) {
        issues.push('Z-score exceeds acceptability criteria');
        correctiveActions.push('Investigate method performance and take corrective action');
        complianceScore -= 25;
      }
    }
  }

  // Validate method and instrument documentation
  if (!method) {
    issues.push('Analytical method not documented');
    correctiveActions.push('Document analytical method for proficiency testing');
    complianceScore -= 10;
  }

  if (!instrument) {
    issues.push('Instrument not documented');
    correctiveActions.push('Document instrument used for proficiency testing');
    complianceScore -= 10;
  }

  // Validate acceptability criteria
  if (!acceptabilityCriteria) {
    issues.push('Acceptability criteria not specified');
    correctiveActions.push('Specify acceptability criteria for proficiency testing');
    complianceScore -= 10;
  }

  const status = complianceScore >= 90 ? 'pass' : complianceScore >= 70 ? 'warning' : 'fail';

  return {
    status,
    message: issues.length === 0 
      ? 'Inter-laboratory comparison validation passed' 
      : `Inter-laboratory comparison issues detected: ${issues.length} problems found`,
    correctiveActions,
    complianceLevel: Math.max(0, complianceScore),
    timestamp: new Date().toISOString(),
    details: {
      zScore: zScoreNum,
      isAcceptable: !isNaN(zScoreNum) ? Math.abs(zScoreNum) <= parseFloat(acceptabilityCriteria?.replace('±', '') || '2.0') : null,
      programName,
      participationDate: !!participationDate,
      methodDocumented: !!method,
      instrumentDocumented: !!instrument
    }
  };
}

function validateDeltaCheck(data: Record<string, any>): ValidationResult {
  const {
    analyte,
    currentResult,
    previousResult,
    timeInterval,
    deltaThreshold,
    clinicalSignificance,
    patientId,
    specimenType,
    method
  } = data;

  const issues: string[] = [];
  const correctiveActions: string[] = [];
  let complianceScore = 100;

  // Validate required fields
  if (!analyte || !currentResult || !previousResult) {
    issues.push('Missing required delta check parameters');
    correctiveActions.push('Complete all required delta check fields');
    complianceScore -= 25;
  }

  // Validate patient identification
  if (!patientId) {
    issues.push('Patient identification missing');
    correctiveActions.push('Document patient ID for delta check analysis');
    complianceScore -= 15;
  }

  // Validate time interval
  if (!timeInterval) {
    issues.push('Time interval not documented');
    correctiveActions.push('Document time interval between results for delta check');
    complianceScore -= 10;
  }

  // Calculate delta check
  const current = parseFloat(currentResult);
  const previous = parseFloat(previousResult);
  const threshold = parseFloat(deltaThreshold);

  if (!isNaN(current) && !isNaN(previous) && !isNaN(threshold)) {
    const deltaPercent = Math.abs((current - previous) / previous) * 100;
    
    if (deltaPercent > threshold) {
      issues.push('Delta check exceeds threshold limit');
      correctiveActions.push('Investigate significant result change and verify clinical correlation');
      complianceScore -= 20;
    }
  }

  // Validate specimen type
  if (!specimenType) {
    issues.push('Specimen type not documented');
    correctiveActions.push('Document specimen type for delta check analysis');
    complianceScore -= 10;
  }

  // Validate method
  if (!method) {
    issues.push('Analytical method not documented');
    correctiveActions.push('Document analytical method for delta check');
    complianceScore -= 10;
  }

  // Validate clinical significance documentation
  if (!clinicalSignificance) {
    issues.push('Clinical significance not documented for delta check');
    correctiveActions.push('Document clinical significance of result changes');
    complianceScore -= 10;
  }

  const status = complianceScore >= 90 ? 'pass' : complianceScore >= 70 ? 'warning' : 'fail';

  return {
    status,
    message: issues.length === 0 
      ? 'Delta check validation passed' 
      : `Delta check issues detected: ${issues.length} problems found`,
    correctiveActions,
    complianceLevel: Math.max(0, complianceScore),
    timestamp: new Date().toISOString(),
    details: {
      deltaPercent: !isNaN(current) && !isNaN(previous) ? Math.abs((current - previous) / previous) * 100 : null,
      exceedsThreshold: !isNaN(current) && !isNaN(previous) && !isNaN(threshold) ? Math.abs((current - previous) / previous) * 100 > threshold : null,
      timeInterval: parseInt(timeInterval),
      patientIdentified: !!patientId,
      specimenTypeDocumented: !!specimenType,
      methodDocumented: !!method,
      clinicalSignificanceDocumented: !!clinicalSignificance
    }
  };
} 
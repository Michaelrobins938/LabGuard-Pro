import { NextRequest, NextResponse } from 'next/server';

interface ReferenceRange {
  low: number;
  high: number;
}

interface CriticalValues {
  low: number;
  high: number;
}

interface QualityControl {
  passed: boolean;
  details: string;
}

interface ResultRequest {
  testType: string;
  result: string;
  referenceRange: ReferenceRange;
  criticalValues: CriticalValues;
  qualityControl: QualityControl;
}

interface ResultResponse {
  isValid: boolean;
  criticalAlerts: string[];
  qcEvaluation: string;
  recommendations: string[];
}

export async function POST(request: NextRequest): Promise<NextResponse<ResultResponse | { error: string }>> {
  try {
    const body: ResultRequest = await request.json();

    // Input validation
    if (!body.testType || !body.result || !body.referenceRange) {
      return NextResponse.json(
        { error: 'Missing required fields: testType, result, referenceRange' },
        { status: 400 }
      );
    }

    const criticalAlerts: string[] = [];
    const recommendations: string[] = [];

    // Parse result value
    const resultValue = parseFloat(body.result);
    const isNumericResult = !isNaN(resultValue);

    // Check for critical values
    if (isNumericResult && body.criticalValues) {
      if (resultValue <= body.criticalValues.low) {
        criticalAlerts.push(`CRITICAL LOW: ${body.result} is at or below critical low value (${body.criticalValues.low})`);
        criticalAlerts.push('Immediate physician notification required');
      } else if (resultValue >= body.criticalValues.high) {
        criticalAlerts.push(`CRITICAL HIGH: ${body.result} is at or above critical high value (${body.criticalValues.high})`);
        criticalAlerts.push('Immediate physician notification required');
      }
    }

    // Evaluate quality control
    let qcEvaluation: string;
    if (!body.qualityControl.passed) {
      qcEvaluation = `QC FAILED: ${body.qualityControl.details}. Results may not be reliable.`;
      criticalAlerts.push('Quality control failure detected - results should not be reported');
    } else {
      qcEvaluation = `QC PASSED: ${body.qualityControl.details}`;
    }

    // Check reference range
    if (isNumericResult) {
      if (resultValue < body.referenceRange.low) {
        recommendations.push(`Result below reference range (${body.referenceRange.low}-${body.referenceRange.high})`);
      } else if (resultValue > body.referenceRange.high) {
        recommendations.push(`Result above reference range (${body.referenceRange.low}-${body.referenceRange.high})`);
      } else {
        recommendations.push('Result within normal reference range');
      }
    }

    // Test-specific validations
    const testType = body.testType.toLowerCase();
    if (testType.includes('glucose')) {
      if (isNumericResult) {
        if (resultValue < 70) {
          criticalAlerts.push('Hypoglycemia alert - consider immediate treatment');
        } else if (resultValue > 400) {
          criticalAlerts.push('Severe hyperglycemia alert - critical intervention needed');
        }
      }
      recommendations.push('Verify patient fasting status if applicable');
    } else if (testType.includes('potassium') || testType.includes('k+')) {
      if (isNumericResult) {
        if (resultValue < 3.0) {
          criticalAlerts.push('Severe hypokalemia - cardiac monitoring recommended');
        } else if (resultValue > 5.5) {
          criticalAlerts.push('Severe hyperkalemia - immediate intervention required');
        }
      }
      recommendations.push('Check for hemolysis if elevated');
    } else if (testType.includes('hemoglobin') || testType.includes('hgb')) {
      if (isNumericResult) {
        if (resultValue < 7.0) {
          criticalAlerts.push('Severe anemia - consider transfusion');
        } else if (resultValue > 18.0) {
          criticalAlerts.push('Polycythemia alert - further evaluation needed');
        }
      }
    }

    // General recommendations
    recommendations.push('Verify patient identification before reporting');
    recommendations.push('Document any technical comments or observations');
    
    if (criticalAlerts.length > 0) {
      recommendations.push('Follow critical value notification protocol');
      recommendations.push('Document notification time and recipient');
    }

    const response: ResultResponse = {
      isValid: body.qualityControl.passed && criticalAlerts.length === 0,
      criticalAlerts,
      qcEvaluation,
      recommendations
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Result Validation API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
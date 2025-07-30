import { NextRequest, NextResponse } from 'next/server';

interface Reagent {
  name: string;
  lotNumber: string;
  expirationDate: string;
  concentration: string;
}

interface TemperatureSettings {
  denaturation: string;
  annealing: string;
  extension: string;
}

interface QualityControl {
  positiveControl: string;
  negativeControl: string;
  internalControl: string;
}

interface PCRRequest {
  protocolName: string;
  reagents: Reagent[];
  temperatureSettings: TemperatureSettings;
  cycleCount: number;
  qualityControl: QualityControl;
}

interface PCRResponse {
  isValid: boolean;
  violations: string[];
  recommendations: string[];
  complianceScore: number;
}

export async function POST(request: NextRequest): Promise<NextResponse<PCRResponse | { error: string }>> {
  try {
    const body: PCRRequest = await request.json();

    // Input validation
    if (!body.protocolName || !body.reagents || !body.temperatureSettings) {
      return NextResponse.json(
        { error: 'Missing required fields: protocolName, reagents, temperatureSettings' },
        { status: 400 }
      );
    }

    const violations: string[] = [];
    const recommendations: string[] = [];
    let complianceScore = 100;

    // Validate reagents
    body.reagents.forEach((reagent, index) => {
      if (!reagent.name || !reagent.lotNumber || !reagent.expirationDate) {
        violations.push(`Reagent ${index + 1}: Missing required information`);
        complianceScore -= 10;
      }

      // Check expiration dates
      const expDate = new Date(reagent.expirationDate);
      const today = new Date();
      if (expDate <= today) {
        violations.push(`Reagent ${reagent.name}: Expired (${reagent.expirationDate})`);
        complianceScore -= 15;
      } else if ((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 30) {
        recommendations.push(`Reagent ${reagent.name}: Expires within 30 days`);
        complianceScore -= 5;
      }
    });

    // Validate temperature settings
    const denaturingTemp = parseInt(body.temperatureSettings.denaturation);
    const annealingTemp = parseInt(body.temperatureSettings.annealing);
    const extensionTemp = parseInt(body.temperatureSettings.extension);

    if (denaturingTemp < 90 || denaturingTemp > 98) {
      violations.push('Denaturation temperature should be between 90-98°C');
      complianceScore -= 10;
    }

    if (annealingTemp < 50 || annealingTemp > 65) {
      recommendations.push('Consider optimizing annealing temperature (50-65°C range)');
      complianceScore -= 5;
    }

    if (extensionTemp < 68 || extensionTemp > 75) {
      violations.push('Extension temperature should be between 68-75°C');
      complianceScore -= 10;
    }

    // Validate cycle count
    if (body.cycleCount < 25 || body.cycleCount > 45) {
      recommendations.push('Cycle count outside typical range (25-45 cycles)');
      complianceScore -= 5;
    }

    // Validate quality controls
    if (!body.qualityControl.positiveControl) {
      violations.push('Positive control is required');
      complianceScore -= 15;
    }

    if (!body.qualityControl.negativeControl) {
      violations.push('Negative control is required');
      complianceScore -= 15;
    }

    if (!body.qualityControl.internalControl) {
      recommendations.push('Consider adding internal control for better validation');
      complianceScore -= 5;
    }

    // Add general recommendations
    if (violations.length === 0) {
      recommendations.push('Protocol meets basic compliance requirements');
      recommendations.push('Consider documenting temperature calibration records');
      recommendations.push('Ensure proper staff training on protocol execution');
    }

    const response: PCRResponse = {
      isValid: violations.length === 0,
      violations,
      recommendations,
      complianceScore: Math.max(0, complianceScore)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('PCR Verification API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
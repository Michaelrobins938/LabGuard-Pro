import { NextRequest, NextResponse } from 'next/server';

interface StorageConditions {
  temperature: string;
  humidity: string;
}

interface QualityControl {
  sterilityTest: boolean;
  performanceTest: boolean;
  pH: number;
}

interface MediaRequest {
  mediaType: string;
  lotNumber: string;
  expirationDate: string;
  storageConditions: StorageConditions;
  qualityControl: QualityControl;
}

interface MediaResponse {
  isValid: boolean;
  safetyAlerts: string[];
  expirationWarnings: string[];
  recommendations: string[];
}

export async function POST(request: NextRequest): Promise<NextResponse<MediaResponse | { error: string }>> {
  try {
    const body: MediaRequest = await request.json();

    // Input validation
    if (!body.mediaType || !body.lotNumber || !body.expirationDate) {
      return NextResponse.json(
        { error: 'Missing required fields: mediaType, lotNumber, expirationDate' },
        { status: 400 }
      );
    }

    const safetyAlerts: string[] = [];
    const expirationWarnings: string[] = [];
    const recommendations: string[] = [];

    // Check expiration date
    const expDate = new Date(body.expirationDate);
    const today = new Date();
    const daysToExpiration = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (expDate <= today) {
      safetyAlerts.push(`EXPIRED MEDIA: ${body.mediaType} expired on ${body.expirationDate}`);
    } else if (daysToExpiration <= 7) {
      expirationWarnings.push(`Media expires in ${daysToExpiration} days`);
    } else if (daysToExpiration <= 30) {
      expirationWarnings.push(`Media expires within 30 days (${body.expirationDate})`);
    }

    // Validate storage conditions
    const temp = parseInt(body.storageConditions.temperature);
    const humidity = parseInt(body.storageConditions.humidity);

    if (temp < 2 || temp > 8) {
      safetyAlerts.push(`Storage temperature ${temp}°C is outside recommended range (2-8°C)`);
    }

    if (humidity > 70) {
      safetyAlerts.push(`High humidity (${humidity}%) may compromise media integrity`);
    }

    // Validate quality control
    if (!body.qualityControl.sterilityTest) {
      safetyAlerts.push('Sterility testing not performed - media may be contaminated');
    }

    if (!body.qualityControl.performanceTest) {
      recommendations.push('Performance testing recommended to verify media functionality');
    }

    // Validate pH
    const pH = body.qualityControl.pH;
    if (pH < 6.8 || pH > 7.4) {
      safetyAlerts.push(`pH ${pH} is outside acceptable range (6.8-7.4)`);
    }

    // Media-specific recommendations
    const mediaType = body.mediaType.toLowerCase();
    if (mediaType.includes('blood')) {
      recommendations.push('Verify blood agar plates show proper hemolysis patterns');
      recommendations.push('Check for proper red blood cell concentration');
    } else if (mediaType.includes('chocolate')) {
      recommendations.push('Ensure chocolate agar shows proper brown coloration');
      recommendations.push('Verify fastidious organism growth capability');
    } else if (mediaType.includes('macconkey')) {
      recommendations.push('Confirm lactose fermentation differentiation capability');
      recommendations.push('Verify crystal violet concentration for gram-positive inhibition');
    }

    // General recommendations
    recommendations.push('Document all quality control results');
    recommendations.push('Maintain temperature logs for storage conditions');
    recommendations.push('Rotate stock using FIFO (First In, First Out) method');

    const response: MediaResponse = {
      isValid: safetyAlerts.length === 0,
      safetyAlerts,
      expirationWarnings,
      recommendations
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Media Validation API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
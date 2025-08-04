import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock alerts for development/testing
    const alerts = [
      {
        id: 'equipment-1',
        priority: 'medium' as const,
        message: 'Freezer #3 temperature: -75°C (warning)',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'equipment' as const
      },
      {
        id: 'outbreak-1',
        priority: 'high' as const,
        message: 'High positivity rate detected: 8.2% in the last 24 hours',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        type: 'outbreak' as const
      },
      {
        id: 'integration-1',
        priority: 'low' as const,
        message: 'NEDSS integration sync completed successfully',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        type: 'integration' as const
      }
    ];

    return NextResponse.json({
      success: true,
      data: alerts
    });

  } catch (error) {
    console.error('Error fetching public health alerts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
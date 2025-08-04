import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for development/testing
    const metrics = {
      totalSamplesThisWeek: 47,
      positiveSamplesThisWeek: 3,
      positivityRate: 0.064, // 6.4%
      activeClusters: 1,
      equipmentAlertsActive: 2,
      pendingReports: 0,
      lastSyncTime: '2 hours ago'
    };

    return NextResponse.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    console.error('Error fetching public health metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
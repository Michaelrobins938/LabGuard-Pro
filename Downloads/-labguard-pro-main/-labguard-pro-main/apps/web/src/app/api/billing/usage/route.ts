import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock usage data for now
    const usageData = {
      aiQueries: { used: 1247, limit: 2000, percentage: 62 },
      storage: { used: 78.5, limit: 100, percentage: 78 },
      apiCalls: { used: 45892, limit: 50000, percentage: 92 },
      teamMembers: { used: 12, limit: 15, percentage: 80 }
    };

    return NextResponse.json({
      success: true,
      data: usageData
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
} 
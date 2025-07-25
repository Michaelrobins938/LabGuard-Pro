import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock subscription data for now
    const subscriptionData = {
      plan: 'Enterprise',
      status: 'active',
      currentPeriodEnd: '2024-12-15T00:00:00Z',
      cancelAtPeriodEnd: false,
      monthlyCost: 2499,
      features: {
        aiQueries: 2000,
        storage: 100,
        apiCalls: 50000,
        teamMembers: 15,
        prioritySupport: true,
        customIntegrations: true
      }
    };

    return NextResponse.json({
      success: true,
      data: subscriptionData
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    );
  }
} 
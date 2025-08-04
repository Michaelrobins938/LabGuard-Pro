import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countyCode = searchParams.get('countyCode');
    const timeRange = searchParams.get('timeRange');

    // Build query parameters
    const params = new URLSearchParams();
    if (countyCode) params.append('countyCode', countyCode);
    if (timeRange) params.append('timeRange', timeRange);

    // Forward the request to the backend
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/api/surveillance/analytics/summary?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch analytics summary' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Analytics summary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
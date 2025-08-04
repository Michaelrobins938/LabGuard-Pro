import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const timeRange = searchParams.get('timeRange') || '30d';
    const countyCode = searchParams.get('countyCode') || '';
    
    const params = new URLSearchParams({
      format,
      timeRange,
      ...(countyCode && { countyCode })
    });
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/surveillance/analytics/export?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to export analytics data' },
        { status: response.status }
      );
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/json');
    headers.set('Content-Disposition', `attachment; filename="surveillance-analytics-${timeRange}-${countyCode || 'all'}.${format}"`);

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error in analytics export proxy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startDate, endDate } = body;

    // Validate date parameters
    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start date and end date are required' }, { status: 400 });
    }

    // Simulate LabWare data sync
    const mockData = generateMockLabWareData(startDate, endDate);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      data: {
        samplesProcessed: mockData.length,
        newSamples: mockData.length,
        updatedSamples: 0,
        syncTime: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error syncing LabWare data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock data generator for development/testing
function generateMockLabWareData(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const samples: any[] = [];

  const counties = ['TARRANT', 'DALLAS', 'DENTON', 'COLLIN', 'PARKER', 'JOHNSON'];
  const results = ['positive', 'negative', 'negative', 'negative', 'negative', 'negative', 'negative', 'negative', 'negative', 'negative'];

  for (let i = 0; i < 25; i++) {
    const collectionDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const county = counties[Math.floor(Math.random() * counties.length)];
    const result = results[Math.floor(Math.random() * results.length)];
    
    samples.push({
      poolId: `POOL_${String(i + 1).padStart(4, '0')}`,
      collectedDate: collectionDate.toISOString(),
      county,
      result,
      location: {
        latitude: 32.7767 + (Math.random() - 0.5) * 0.1,
        longitude: -96.7970 + (Math.random() - 0.5) * 0.1
      }
    });
  }

  return samples;
} 
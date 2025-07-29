import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simulate database lookup for available protocols
    const protocols = [
      {
        id: 'covid-19-v2.1',
        name: 'COVID-19 RT-PCR Protocol',
        version: 'v2.1',
        testType: 'covid-19-rt-pcr',
        expectedSampleVolume: 5.0,
        thermalProfile: 'standard-40-cycle',
        maxSamples: 96,
        lastUpdated: '2024-01-15',
        status: 'active'
      },
      {
        id: 'flu-a-b-v1.5',
        name: 'Influenza A/B RT-PCR Protocol',
        version: 'v1.5',
        testType: 'flu-a-b',
        expectedSampleVolume: 3.0,
        thermalProfile: 'rapid-30-cycle',
        maxSamples: 48,
        lastUpdated: '2024-01-10',
        status: 'active'
      },
      {
        id: 'rsv-v1.2',
        name: 'RSV RT-PCR Protocol',
        version: 'v1.2',
        testType: 'rsv',
        expectedSampleVolume: 4.0,
        thermalProfile: 'standard-40-cycle',
        maxSamples: 72,
        lastUpdated: '2024-01-05',
        status: 'active'
      },
      {
        id: 'hiv-viral-load-v2.0',
        name: 'HIV Viral Load Protocol',
        version: 'v2.0',
        testType: 'hiv-viral-load',
        expectedSampleVolume: 6.0,
        thermalProfile: 'high-sensitivity-45-cycle',
        maxSamples: 24,
        lastUpdated: '2023-12-20',
        status: 'active'
      },
      {
        id: 'hepatitis-c-v1.8',
        name: 'Hepatitis C RT-PCR Protocol',
        version: 'v1.8',
        testType: 'hepatitis-c',
        expectedSampleVolume: 4.5,
        thermalProfile: 'standard-40-cycle',
        maxSamples: 36,
        lastUpdated: '2023-12-15',
        status: 'active'
      }
    ]

    return NextResponse.json({ protocols })
  } catch (error) {
    console.error('Failed to fetch protocols:', error)
    return NextResponse.json(
      { error: 'Failed to fetch protocols' },
      { status: 500 }
    )
  }
} 
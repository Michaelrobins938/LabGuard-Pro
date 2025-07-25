import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simulate database lookup for available operators
    const operators = [
      {
        id: 'TECH001',
        name: 'Dr. Sarah Johnson',
        certification: 'Molecular Biology Specialist',
        expiryDate: '2025-12-31',
        status: 'active',
        authorizedTests: ['covid-19-rt-pcr', 'flu-a-b', 'rsv', 'hiv-viral-load', 'hepatitis-c'],
        trainingCompleted: true,
        lastCompetencyCheck: '2024-01-10'
      },
      {
        id: 'TECH002',
        name: 'Mike Chen',
        certification: 'General Laboratory Technician',
        expiryDate: '2023-06-15',
        status: 'expired',
        authorizedTests: ['covid-19-rt-pcr', 'flu-a-b'],
        trainingCompleted: false,
        lastCompetencyCheck: '2023-05-20'
      },
      {
        id: 'TECH003',
        name: 'Dr. Emily Rodriguez',
        certification: 'Clinical Laboratory Scientist',
        expiryDate: '2026-03-20',
        status: 'active',
        authorizedTests: ['covid-19-rt-pcr', 'flu-a-b', 'rsv', 'hiv-viral-load', 'hepatitis-c'],
        trainingCompleted: true,
        lastCompetencyCheck: '2024-01-05'
      },
      {
        id: 'TECH004',
        name: 'Alex Thompson',
        certification: 'Medical Laboratory Technician',
        expiryDate: '2025-08-10',
        status: 'active',
        authorizedTests: ['covid-19-rt-pcr', 'flu-a-b', 'rsv'],
        trainingCompleted: true,
        lastCompetencyCheck: '2023-12-15'
      },
      {
        id: 'TECH005',
        name: 'Dr. James Wilson',
        certification: 'Molecular Diagnostics Specialist',
        expiryDate: '2026-01-30',
        status: 'active',
        authorizedTests: ['covid-19-rt-pcr', 'flu-a-b', 'rsv', 'hiv-viral-load', 'hepatitis-c'],
        trainingCompleted: true,
        lastCompetencyCheck: '2024-01-12'
      }
    ]

    return NextResponse.json({ operators })
  } catch (error) {
    console.error('Failed to fetch operators:', error)
    return NextResponse.json(
      { error: 'Failed to fetch operators' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/ai/nlp-reports/reports`, {
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      // Return mock data if backend is not available
      return NextResponse.json({
        reports: [
          {
            id: '1',
            title: 'Q1 2024 Compliance Summary',
            type: 'compliance',
            status: 'completed',
            createdAt: '2024-02-08T09:00:00Z',
            completedAt: '2024-02-08T09:15:00Z',
            summary: 'Comprehensive analysis of Q1 2024 compliance data shows 98.5% adherence to regulatory standards with 3 minor deviations identified.',
            keyInsights: [
              'Equipment calibration compliance improved by 15%',
              'Documentation quality scores increased by 22%',
              'Three minor deviations require corrective action'
            ],
            recommendations: [
              'Implement automated calibration reminders',
              'Enhance documentation training program',
              'Schedule follow-up audit for identified deviations'
            ],
            confidence: 94,
            wordCount: 2500,
            processingTime: 15
          }
        ]
      })
    }
  } catch (error) {
    console.error('Error in NLP reports API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NLP reports' },
      { status: 500 }
    )
  }
} 
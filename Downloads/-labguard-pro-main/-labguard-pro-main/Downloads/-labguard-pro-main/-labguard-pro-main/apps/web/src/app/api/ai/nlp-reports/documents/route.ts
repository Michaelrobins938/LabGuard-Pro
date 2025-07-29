import { NextRequest, NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/ai/nlp-reports/documents`, {
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
        documents: [
          {
            id: '1',
            filename: 'calibration_procedure_2024.pdf',
            uploadDate: '2024-02-08T08:30:00Z',
            analysisType: 'calibration',
            status: 'completed',
            extractedData: {
              equipmentType: 'Centrifuge',
              model: 'C-2400',
              calibrationDate: '2024-02-08',
              technician: 'Dr. Sarah Johnson',
              results: 'PASS',
              nextCalibration: '2024-05-08'
            },
            insights: [
              'Calibration procedure follows ISO 17025 standards',
              'All measurement points within acceptable limits',
              'Documentation complete and accurate'
            ],
            complianceScore: 98,
            riskLevel: 'low'
          }
        ]
      })
    }
  } catch (error) {
    console.error('Error in NLP documents API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NLP documents' },
      { status: 500 }
    )
  }
} 
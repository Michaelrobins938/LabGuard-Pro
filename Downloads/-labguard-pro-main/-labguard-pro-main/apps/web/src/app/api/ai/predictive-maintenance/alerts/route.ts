import { NextRequest, NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30d'
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/ai/predictive-maintenance/alerts?timeframe=${timeframe}`, {
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
        alerts: [
          {
            id: '1',
            equipmentId: 'EQ001',
            equipmentName: 'Centrifuge C-2400',
            alertType: 'warning',
            probability: 85,
            predictedDate: '2024-02-15',
            confidence: 92,
            recommendedAction: 'Schedule preventive maintenance within 7 days',
            severity: 'medium'
          },
          {
            id: '2',
            equipmentId: 'EQ002',
            equipmentName: 'Spectrophotometer S-1200',
            alertType: 'critical',
            probability: 95,
            predictedDate: '2024-02-10',
            confidence: 98,
            recommendedAction: 'Immediate inspection required',
            severity: 'high'
          }
        ]
      })
    }
  } catch (error) {
    console.error('Error in predictive maintenance alerts API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch predictive alerts' },
      { status: 500 }
    )
  }
} 
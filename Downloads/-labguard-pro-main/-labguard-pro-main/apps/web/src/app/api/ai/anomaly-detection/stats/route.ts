import { NextRequest, NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/ai/anomaly-detection/stats`, {
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
        stats: {
          totalAnomalies: 24,
          activeAnomalies: 3,
          resolvedAnomalies: 21,
          averageConfidence: 89.5,
          topAnomalyType: 'Performance',
          detectionRate: 96.2
        }
      })
    }
  } catch (error) {
    console.error('Error in anomaly detection stats API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch anomaly stats' },
      { status: 500 }
    )
  }
} 
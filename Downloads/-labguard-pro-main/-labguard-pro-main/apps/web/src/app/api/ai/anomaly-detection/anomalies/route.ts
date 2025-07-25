import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/ai/anomaly-detection/anomalies`, {
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
        anomalies: [
          {
            id: '1',
            equipmentId: 'EQ001',
            equipmentName: 'Centrifuge C-2400',
            anomalyType: 'performance',
            severity: 'high',
            detectedAt: '2024-02-08T10:30:00Z',
            description: 'Unusual vibration patterns detected during operation',
            confidence: 94,
            baselineValue: 0.15,
            currentValue: 0.45,
            deviation: 200,
            status: 'active'
          },
          {
            id: '2',
            equipmentId: 'EQ002',
            equipmentName: 'Spectrophotometer S-1200',
            anomalyType: 'calibration',
            severity: 'critical',
            detectedAt: '2024-02-08T09:15:00Z',
            description: 'Calibration drift exceeds acceptable thresholds',
            confidence: 98,
            baselineValue: 0.02,
            currentValue: 0.08,
            deviation: 300,
            status: 'investigating'
          }
        ]
      })
    }
  } catch (error) {
    console.error('Error in anomaly detection API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch anomalies' },
      { status: 500 }
    )
  }
} 
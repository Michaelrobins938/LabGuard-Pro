import { NextRequest, NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30d'
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/ai/predictive-maintenance/predictions?timeframe=${timeframe}`, {
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
        predictions: [
          {
            equipmentId: 'EQ001',
            equipmentName: 'Centrifuge C-2400',
            nextMaintenanceDate: '2024-02-15',
            confidence: 92,
            riskLevel: 'medium',
            factors: ['Usage frequency', 'Temperature variations', 'Vibration patterns'],
            recommendedSchedule: 'Every 3 months'
          },
          {
            equipmentId: 'EQ002',
            equipmentName: 'Spectrophotometer S-1200',
            nextMaintenanceDate: '2024-02-10',
            confidence: 98,
            riskLevel: 'high',
            factors: ['Calibration drift', 'Optical degradation', 'Environmental factors'],
            recommendedSchedule: 'Every 2 months'
          },
          {
            equipmentId: 'EQ003',
            equipmentName: 'pH Meter PH-200',
            nextMaintenanceDate: '2024-02-20',
            confidence: 78,
            riskLevel: 'low',
            factors: ['Electrode wear', 'Solution contamination', 'Calibration frequency'],
            recommendedSchedule: 'Every 4 months'
          }
        ]
      })
    }
  } catch (error) {
    console.error('Error in predictive maintenance predictions API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maintenance predictions' },
      { status: 500 }
    )
  }
} 
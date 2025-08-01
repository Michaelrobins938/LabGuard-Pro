import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface EquipmentStats {
  total: number
  active: number
  inactive: number
  maintenance: number
  calibrationDue: number
  byType: Record<string, number>
  byStatus: Record<string, number>
}

export async function GET(request: NextRequest) {
  try {
    // Mock equipment stats data
    // In production, this would fetch from your database
    const equipmentStats: EquipmentStats = {
      total: 24,
      active: 22,
      inactive: 1,
      maintenance: 1,
      calibrationDue: 3,
      byType: {
        'PCR Machine': 4,
        'Centrifuge': 6,
        'Microscope': 8,
        'Incubator': 3,
        'Spectrophotometer': 2,
        'Other': 1
      },
      byStatus: {
        'active': 22,
        'inactive': 1,
        'maintenance': 1,
        'calibration_due': 3
      }
    }

    return NextResponse.json(equipmentStats)
  } catch (error) {
    console.error('Error fetching equipment stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch equipment stats' },
      { status: 500 }
    )
  }
} 
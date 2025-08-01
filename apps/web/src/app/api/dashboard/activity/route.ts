import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface RecentActivity {
  id: string
  type: string
  description: string
  userId: string
  userName: string
  timestamp: string
  metadata?: any
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Mock recent activity data
    // In production, this would fetch from your database
    const recentActivity: RecentActivity[] = [
      {
        id: '1',
        type: 'calibration',
        description: 'PCR Machine calibration completed',
        userId: 'user1',
        userName: 'Dr. Smith',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        metadata: { equipmentId: 'eq1', equipmentName: 'PCR Machine' }
      },
      {
        id: '2',
        type: 'maintenance',
        description: 'Centrifuge maintenance scheduled',
        userId: 'user2',
        userName: 'Dr. Johnson',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        metadata: { equipmentId: 'eq2', equipmentName: 'Centrifuge' }
      },
      {
        id: '3',
        type: 'ai_assistant',
        description: 'Protocol design completed',
        userId: 'user1',
        userName: 'Dr. Smith',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        metadata: { protocolType: 'PCR', complexity: 'medium' }
      },
      {
        id: '4',
        type: 'compliance',
        description: 'Safety audit completed',
        userId: 'user3',
        userName: 'Dr. Williams',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        metadata: { auditType: 'safety', score: 98 }
      }
    ]

    return NextResponse.json(recentActivity.slice(0, limit))
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'calibration' | 'equipment' | 'compliance' | 'system' | 'team'
  isRead: boolean
  createdAt: string
  data?: any
}

export async function GET(request: NextRequest) {
  try {
    // Mock notifications data
    // In production, this would fetch from your database
    const notifications: Notification[] = [
      {
        id: '1',
        title: 'Calibration Due',
        message: 'PCR Machine calibration is due in 3 days',
        type: 'warning',
        category: 'calibration',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        data: { equipmentId: 'eq1', equipmentName: 'PCR Machine' }
      },
      {
        id: '2',
        title: 'Maintenance Completed',
        message: 'Centrifuge maintenance has been completed successfully',
        type: 'success',
        category: 'equipment',
        isRead: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        data: { equipmentId: 'eq2', equipmentName: 'Centrifuge' }
      },
      {
        id: '3',
        title: 'System Update',
        message: 'New features have been added to the analytics dashboard',
        type: 'info',
        category: 'system',
        isRead: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        data: { version: '2.1.0', features: ['Enhanced Analytics', 'AI Improvements'] }
      }
    ]

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
} 
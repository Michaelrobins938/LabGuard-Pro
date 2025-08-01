import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface UsageEvent {
  id: string
  userId: string
  eventType: string
  timestamp: string
  metadata: any
}

interface UsageTracking {
  id: string
  userId: string
  date: string
  totalUsage: number
  limit: number
  usageType: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, eventType, metadata } = body

    // For now, use mock data instead of Prisma
    // TODO: Replace with real database queries when Prisma is properly configured
    const mockUsageEvent: UsageEvent = {
      id: Date.now().toString(),
      userId,
      eventType,
      timestamp: new Date().toISOString(),
      metadata
    }

    // Mock usage tracking data
    const mockUsageTracking: UsageTracking = {
      id: Date.now().toString(),
      userId,
      date: new Date().toISOString().split('T')[0],
      totalUsage: Math.floor(Math.random() * 100) + 50,
      limit: 1000,
      usageType: 'api_calls'
    }

    return NextResponse.json({
      success: true,
      event: mockUsageEvent,
      tracking: mockUsageTracking
    })
  } catch (error) {
    console.error('Error creating usage event:', error)
    return NextResponse.json(
      { error: 'Failed to create usage event' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // For now, use mock data instead of Prisma
    // TODO: Replace with real database queries when Prisma is properly configured
    const mockEvents: UsageEvent[] = Array.from({ length: 10 }, (_, i) => ({
      id: `event-${i + 1}`,
      userId,
      eventType: ['api_call', 'data_export', 'report_generation'][Math.floor(Math.random() * 3)],
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        endpoint: '/api/analytics/metrics',
        responseTime: Math.floor(Math.random() * 1000) + 100
      }
    }))

    const mockTracking: UsageTracking = {
      id: 'tracking-1',
      userId,
      date: new Date().toISOString().split('T')[0],
      totalUsage: Math.floor(Math.random() * 100) + 50,
      limit: 1000,
      usageType: 'api_calls'
    }

    return NextResponse.json({
      events: mockEvents,
      tracking: mockTracking,
      total: mockEvents.length
    })
  } catch (error) {
    console.error('Error fetching usage events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage events' },
      { status: 500 }
    )
  }
}
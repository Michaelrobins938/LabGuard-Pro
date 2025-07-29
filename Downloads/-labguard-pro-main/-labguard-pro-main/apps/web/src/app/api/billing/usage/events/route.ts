import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { events } = body

    if (!events || !Array.isArray(events)) {
      return NextResponse.json({ error: 'Events array is required' }, { status: 400 })
    }

    const processedEvents = []

    for (const event of events) {
      try {
        // Create usage event record
        const usageEvent = await prisma.usageEvent.create({
          data: {
            type: event.type,
            value: event.value,
            metadata: event.metadata || {},
            timestamp: new Date(event.timestamp),
            laboratoryId: event.metadata?.laboratoryId || 'default'
          }
        })

        // Update usage tracking based on event type
        await updateUsageTracking(event)

        processedEvents.push(usageEvent)
      } catch (error) {
        console.error('Failed to process usage event:', error)
        // Continue processing other events
      }
    }

    return NextResponse.json({
      success: true,
      processedEvents: processedEvents.length,
      totalEvents: events.length
    })
  } catch (error: any) {
    console.error('Usage events API error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to process usage events'
    }, { status: 500 })
  }
}

async function updateUsageTracking(event: any) {
  const { type, value, metadata } = event
  const laboratoryId = metadata?.laboratoryId || 'default'

  // Get current usage tracking record
  const currentUsage = await prisma.usageTracking.findFirst({
    where: { laboratoryId },
    orderBy: { createdAt: 'desc' }
  })

  if (!currentUsage) {
    console.warn('No usage tracking record found for laboratory:', laboratoryId)
    return
  }

  // Update usage based on event type
  const updates: any = {}

  switch (type) {
    case 'equipment_added':
      updates.equipmentCount = currentUsage.equipmentCount + value
      break
    case 'equipment_removed':
      updates.equipmentCount = Math.max(0, currentUsage.equipmentCount - value)
      break
    case 'ai_check_performed':
      updates.aiChecksUsed = currentUsage.aiChecksUsed + value
      break
    case 'team_member_added':
      updates.teamMembersCount = currentUsage.teamMembersCount + value
      break
    case 'team_member_removed':
      updates.teamMembersCount = Math.max(0, currentUsage.teamMembersCount - value)
      break
    case 'storage_used':
      updates.storageUsed = currentUsage.storageUsed + value
      break
    case 'api_call_made':
      // Track API calls separately or increment a counter
      break
    case 'report_generated':
      // Track report generation
      break
  }

  if (Object.keys(updates).length > 0) {
    await prisma.usageTracking.update({
      where: { id: currentUsage.id },
      data: updates
    })
  }
}
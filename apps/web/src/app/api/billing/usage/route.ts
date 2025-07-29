import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would fetch usage data from your database
    // For now, we'll return mock usage data for demonstration
    const usage = {
      equipment: {
        used: 15,
        limit: 50,
        percentage: 30
      },
      aiChecks: {
        used: 234,
        limit: 500,
        percentage: 47
      },
      teamMembers: {
        used: 7,
        limit: 10,
        percentage: 70
      },
      storage: {
        used: 45, // GB
        limit: 100, // GB
        percentage: 45
      },
      apiCalls: {
        used: 12500,
        limit: 50000,
        percentage: 25
      },
      reports: {
        used: 23,
        limit: 100,
        percentage: 23
      }
    }

    return NextResponse.json({
      usage,
      success: true
    })
  } catch (error: any) {
    console.error('Usage fetch error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch usage data' 
    }, { status: 500 })
  }
} 
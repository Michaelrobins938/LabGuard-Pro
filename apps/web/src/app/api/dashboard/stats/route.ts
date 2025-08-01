import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface DashboardStats {
  totalEquipment: number
  activeEquipment: number
  calibrationDue: number
  complianceScore: number
  totalUsers: number
  recentActivity: number
  aiAssistanceSessions: number
  alerts: number
}

export async function GET(request: NextRequest) {
  try {
    // Mock dashboard stats data
    // In production, this would fetch from your database
    const dashboardStats: DashboardStats = {
      totalEquipment: 24,
      activeEquipment: 22,
      calibrationDue: 3,
      complianceScore: 98.5,
      totalUsers: 15,
      recentActivity: 47,
      aiAssistanceSessions: 156,
      alerts: 2
    }

    return NextResponse.json(dashboardStats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface EnterpriseMetrics {
  totalRevenue: number
  monthlyRecurringRevenue: number
  customerCount: number
  churnRate: number
  averageRevenuePerUser: number
  conversionRate: number
  systemUptime: number
  activeUsers: number
  featureUsage: {
    equipment: number
    analytics: number
    compliance: number
    ai: number
  }
  performanceMetrics: {
    responseTime: number
    errorRate: number
    throughput: number
  }
}

export async function GET(request: NextRequest) {
  try {
    // Mock enterprise metrics data
    // In production, this would fetch from your database
    const enterpriseMetrics: EnterpriseMetrics = {
      totalRevenue: 2450000,
      monthlyRecurringRevenue: 185000,
      customerCount: 1247,
      churnRate: 2.3,
      averageRevenuePerUser: 185,
      conversionRate: 15.7,
      systemUptime: 99.9,
      activeUsers: 892,
      featureUsage: {
        equipment: 78,
        analytics: 65,
        compliance: 89,
        ai: 92
      },
      performanceMetrics: {
        responseTime: 245,
        errorRate: 0.1,
        throughput: 1250
      }
    }

    return NextResponse.json(enterpriseMetrics)
  } catch (error) {
    console.error('Error fetching enterprise metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enterprise metrics' },
      { status: 500 }
    )
  }
} 
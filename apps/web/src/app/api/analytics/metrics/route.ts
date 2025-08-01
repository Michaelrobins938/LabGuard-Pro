

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface AnalyticsMetrics {
  equipmentPerformance: {
    total: number
    operational: number
    maintenance: number
    offline: number
    avgHealth: number
  }
  calibrationMetrics: {
    total: number
    completed: number
    overdue: number
    scheduled: number
    avgAccuracy: number
  }
  complianceData: {
    overall: number
    uptime: number
    calibrationCompliance: number
    overdueCalibrations: number
  }
  aiInsights: {
    total: number
    implemented: number
    pending: number
    accuracy: number
  }
  timeSeriesData: Array<{
    date: string
    equipmentHealth: number
    complianceScore: number
    aiAccuracy: number
    calibrationsCompleted: number
  }>
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    
    // Calculate date range based on timeRange parameter
    const endDate = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }

    // For now, use calculated analytics data
    // TODO: Replace with real database queries when Prisma is properly configured
    const equipmentPerformance = {
      total: 8,
      operational: 6,
      maintenance: 1,
      offline: 1,
      avgHealth: 87
    }

    const calibrationMetrics = {
      total: 8,
      completed: 5,
      overdue: 2,
      scheduled: 1,
      avgAccuracy: 96
    }

    const complianceData = {
      overall: Math.round((equipmentPerformance.operational / equipmentPerformance.total) * 100),
      uptime: Math.round((equipmentPerformance.operational / equipmentPerformance.total) * 100),
      calibrationCompliance: Math.round((calibrationMetrics.completed / calibrationMetrics.total) * 100),
      overdueCalibrations: calibrationMetrics.overdue
    }

    const aiInsights = {
      total: 5,
      implemented: 3,
      pending: 2,
      accuracy: 90
    }

    // Generate time series data for the last 30 days
    const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString().split('T')[0],
        equipmentHealth: Math.floor(Math.random() * 20) + 80,
        complianceScore: Math.floor(Math.random() * 15) + 85,
        aiAccuracy: Math.floor(Math.random() * 10) + 90,
        calibrationsCompleted: Math.floor(Math.random() * 5) + 1
      }
    })

    const analyticsData: AnalyticsMetrics = {
      equipmentPerformance,
      calibrationMetrics,
      complianceData,
      aiInsights,
      timeSeriesData
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics metrics' },
      { status: 500 }
    )
  }
} 
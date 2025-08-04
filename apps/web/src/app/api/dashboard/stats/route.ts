import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    const { searchParams } = new URL(request.url);
    const laboratoryId = searchParams.get('laboratoryId');
    
    if (!laboratoryId) {
      return NextResponse.json({ error: 'Laboratory ID required' }, { status: 400 });
    }

    // Real database queries for production West Nile virus laboratory data
    const [
      totalEquipment,
      activeEquipment,
      calibrationsDue,
      recentActivity,
      alerts,
      users,
      aiSessions
    ] = await Promise.all([
      // PCR machines, centrifuges, extraction systems, etc.
      prisma.equipment.count({
        where: { 
          laboratoryId,
          deletedAt: null
        }
      }),
      
      // Currently operational equipment
      prisma.equipment.count({
        where: { 
          laboratoryId,
          status: 'ACTIVE',
          deletedAt: null
        }
      }),
      
      // Equipment needing calibration within 30 days
      prisma.equipment.count({
        where: {
          laboratoryId,
          deletedAt: null,
          OR: [
            { nextCalibrationAt: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } },
            { nextCalibrationAt: null }
          ]
        }
      }),
      
      // Recent activities in the last 7 days
      prisma.auditLog.count({
        where: {
          laboratoryId,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      }),
      
      // Active alerts (calibration overdue, equipment issues, QC failures)
      prisma.notification.count({
        where: {
          laboratoryId,
          isRead: false,
          type: { in: ['CALIBRATION_OVERDUE', 'MAINTENANCE_DUE', 'SYSTEM_ALERT'] }
        }
      }),
      
      // Active laboratory users
      prisma.user.count({
        where: {
          laboratoryId,
          isActive: true,
          deletedAt: null
        }
      }),
      
      // AI assistance usage in the last 30 days
      prisma.biomniQuery.count({
        where: {
          laboratoryId,
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      })
    ]);

    // Calculate compliance score based on calibration status and QC performance
    const overdueCalibrations = await prisma.equipment.count({
      where: {
        laboratoryId,
        deletedAt: null,
        nextCalibrationAt: { lt: new Date() }
      }
    });

    const recentQCFailures = await prisma.calibrationRecord.count({
      where: {
        laboratoryId,
        result: 'FAIL',
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    });

    // West Nile virus specific compliance calculation
    const complianceScore = Math.max(0, 100 - (overdueCalibrations * 5) - (recentQCFailures * 3));

    const dashboardStats: DashboardStats = {
      totalEquipment,
      activeEquipment,
      calibrationDue: calibrationsDue,
      complianceScore,
      totalUsers: users,
      recentActivity,
      aiAssistanceSessions: aiSessions,
      alerts
    };

    return NextResponse.json(dashboardStats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 
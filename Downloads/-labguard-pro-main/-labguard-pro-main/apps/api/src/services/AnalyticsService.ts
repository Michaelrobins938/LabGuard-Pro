import { PrismaClient } from '@prisma/client';

export class AnalyticsService {
  private prisma: PrismaClient;
  
  constructor() {
    this.prisma = new PrismaClient();
  }
  
  async getLabMetrics(laboratoryId: string) {
    try {
      const [
        totalEquipment,
        totalUsers,
        totalCalibrations,
        recentQueries
      ] = await Promise.all([
        this.prisma.equipment.count({ where: { laboratoryId } }),
        this.prisma.user.count({ where: { laboratoryId } }),
        this.prisma.calibrationRecord.count({ where: { equipment: { laboratoryId } } }),
        this.prisma.biomniQuery.count({ 
          where: { 
            user: { laboratoryId },
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        })
      ]);
      
      return {
        equipment: totalEquipment,
        users: totalUsers,
        calibrations: totalCalibrations,
        aiQueries: recentQueries,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error getting lab metrics:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
  
  async getEquipmentAnalytics(laboratoryId: string) {
    try {
      const equipment = await this.prisma.equipment.findMany({
        where: { laboratoryId },
        include: {
          calibrationRecords: {
            orderBy: { performedAt: 'desc' },
            take: 1
          }
        }
      });
      
      const equipmentStats = {
        total: equipment.length,
        byStatus: {
          active: equipment.filter(e => e.status === 'ACTIVE').length,
          inactive: equipment.filter(e => e.status === 'INACTIVE').length,
          maintenance: equipment.filter(e => e.status === 'MAINTENANCE').length
        },
        byManufacturer: equipment.reduce((acc, e) => {
          acc[e.manufacturer] = (acc[e.manufacturer] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        needsCalibration: equipment.filter(e => {
          const lastCalibration = e.calibrationRecords[0];
          if (!lastCalibration) return true;
          const daysSinceCalibration = (Date.now() - lastCalibration.performedAt!.getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceCalibration > 365; // More than 1 year
        }).length
      };
      
      return equipmentStats;
    } catch (error) {
      console.error('Error getting equipment analytics:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
  
  async getCalibrationAnalytics(laboratoryId: string) {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const calibrations = await this.prisma.calibrationRecord.findMany({
        where: {
          equipment: { laboratoryId },
          performedAt: { gte: thirtyDaysAgo }
        },
        include: {
          equipment: {
            select: { name: true, manufacturer: true }
          }
        }
      });
      
      const calibrationStats = {
        total: calibrations.length,
        byMonth: calibrations.reduce((acc, cal) => {
          const month = cal.performedAt!.toISOString().slice(0, 7); // YYYY-MM
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byManufacturer: calibrations.reduce((acc, cal) => {
          acc[cal.equipment.manufacturer] = (acc[cal.equipment.manufacturer] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        averageCalibrationTime: calibrations.length > 0 
          ? calibrations.reduce((sum, cal) => sum + (cal.performedAt!.getTime() - cal.createdAt.getTime()), 0) / calibrations.length / (1000 * 60 * 60 * 24) // Days
          : 0
      };
      
      return calibrationStats;
    } catch (error) {
      console.error('Error getting calibration analytics:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
  
  async getAIUsageAnalytics(laboratoryId: string) {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const queries = await this.prisma.biomniQuery.findMany({
        where: {
          user: { laboratoryId },
          createdAt: { gte: thirtyDaysAgo }
        }
      });
      
      const aiStats = {
        totalQueries: queries.length,
        byDay: queries.reduce((acc, query) => {
          const day = query.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        averageQueriesPerDay: queries.length / 30
      };
      
      // Find the day with most queries
      const mostActiveDay = Object.entries(aiStats.byDay).reduce((max, [day, count]) => 
        count > max.count ? { day, count } : max, { day: '', count: 0 }
      );
      
      return {
        ...aiStats,
        mostActiveDay
      };
    } catch (error) {
      console.error('Error getting AI usage analytics:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
} 
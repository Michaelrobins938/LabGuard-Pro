import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AnalyticsService } from '../services/AnalyticsService';

export class ReportsController {
  static async getComplianceSummary(req: Request, res: Response) {
    const prisma = new PrismaClient(); // Create instance inside method
    try {
      const { laboratoryId } = req.user!;
      
      const [
        totalEquipment,
        activeEquipment,
        totalCalibrations,
        completedCalibrations,
        overdueCalibrations
      ] = await Promise.all([
        prisma.equipment.count({ where: { laboratoryId } }),
        prisma.equipment.count({ where: { laboratoryId, status: 'ACTIVE' } }),
        prisma.calibrationRecord.count({ where: { equipment: { laboratoryId } } }),
        prisma.calibrationRecord.count({ where: { equipment: { laboratoryId }, status: 'COMPLETED' } }),
        prisma.calibrationRecord.count({ where: { equipment: { laboratoryId }, status: 'OVERDUE' } })
      ]);
      
      const complianceScore = totalCalibrations > 0 
        ? Math.round((completedCalibrations / totalCalibrations) * 100)
        : 100;
      
      res.json({
        equipment: {
          total: totalEquipment,
          active: activeEquipment,
          inactive: totalEquipment - activeEquipment
        },
        calibrations: {
          total: totalCalibrations,
          completed: completedCalibrations,
          overdue: overdueCalibrations,
          compliance_score: complianceScore
        }
      });
      
    } catch (error: any) {
      console.error('Error getting compliance summary:', error);
      res.status(500).json({ error: 'Failed to get compliance summary' });
    } finally {
      await prisma.$disconnect(); // Always disconnect
    }
  }
  
  static async getEquipmentStatusReport(req: Request, res: Response) {
    const prisma = new PrismaClient(); // Create instance inside method
    try {
      const { laboratoryId } = req.user!;
      
      const equipment = await prisma.equipment.findMany({
        where: { laboratoryId },
        include: {
          calibrationRecords: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });
      
      const equipmentStatus = equipment.map((eq) => {
        const lastCalibration = eq.calibrationRecords[0];
        
        return {
          id: eq.id,
          name: eq.name,
          model: eq.model,
          serialNumber: eq.serialNumber,
          status: eq.status,
          lastCalibration: lastCalibration?.performedAt || null,
          nextCalibration: lastCalibration?.dueDate || null,
          complianceScore: lastCalibration?.result === 'PASS' ? 100 : 
                          lastCalibration?.result === 'FAIL' ? 0 : 50
        };
      });
      
      res.json(equipmentStatus);
      
    } catch (error: any) {
      console.error('Error getting equipment status:', error);
      res.status(500).json({ error: 'Failed to get equipment status' });
    } finally {
      await prisma.$disconnect(); // Always disconnect
    }
  }
  
  // Analytics methods
  static async getAnalytics(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user!;
      const analyticsService = new AnalyticsService();
      
      const metrics = await analyticsService.getLabMetrics(laboratoryId);
      res.json(metrics);
    } catch (error: any) {
      console.error('Error getting analytics:', error);
      res.status(500).json({ error: 'Failed to get analytics' });
    }
  }
  
  static async getEquipmentAnalytics(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user!;
      const analyticsService = new AnalyticsService();
      
      const equipmentStats = await analyticsService.getEquipmentAnalytics(laboratoryId);
      res.json(equipmentStats);
    } catch (error: any) {
      console.error('Error getting equipment analytics:', error);
      res.status(500).json({ error: 'Failed to get equipment analytics' });
    }
  }
  
  static async getCalibrationAnalytics(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user!;
      const analyticsService = new AnalyticsService();
      
      const calibrationStats = await analyticsService.getCalibrationAnalytics(laboratoryId);
      res.json(calibrationStats);
    } catch (error: any) {
      console.error('Error getting calibration analytics:', error);
      res.status(500).json({ error: 'Failed to get calibration analytics' });
    }
  }
  
  static async getAIUsageAnalytics(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user!;
      const analyticsService = new AnalyticsService();
      
      const aiStats = await analyticsService.getAIUsageAnalytics(laboratoryId);
      res.json(aiStats);
    } catch (error: any) {
      console.error('Error getting AI usage analytics:', error);
      res.status(500).json({ error: 'Failed to get AI usage analytics' });
    }
  }
} 
import { Request, Response } from 'express'
import { PrismaClient } from '@labguard/database'
import { z } from 'zod'
import { logger } from '../utils/logger'
import { biomniQCService, QCPredictionRequest, QCResult } from '../services/BiomniQCService'

const prisma = new PrismaClient()

// Validation schemas
const qcPredictionSchema = z.object({
  testType: z.enum(['WestNile', 'COVID', 'Influenza', 'PCR', 'Serology']),
  controlValues: z.array(z.number()),
  reagentLot: z.string(),
  environmentalData: z.array(z.object({
    temperature: z.number(),
    humidity: z.number(),
    timestamp: z.string().datetime()
  })),
  historicalQC: z.array(z.object({
    id: z.string(),
    testType: z.string(),
    controlValue: z.number(),
    expectedRange: z.object({
      min: z.number(),
      max: z.number()
    }),
    timestamp: z.string().datetime(),
    status: z.enum(['PASS', 'FAIL', 'WARNING']),
    equipmentId: z.string(),
    technicianId: z.string()
  }))
})

const clientNotificationSchema = z.object({
  testType: z.string(),
  originalETA: z.string().datetime(),
  newETA: z.string().datetime(),
  reason: z.enum(['QC_FAILURE', 'INSTRUMENT_DOWN', 'REAGENT_ISSUE']),
  clientInfo: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    organization: z.string(),
    urgency: z.enum(['ROUTINE', 'URGENT', 'STAT'])
  })
})

const qaReportSchema = z.object({
  incidentType: z.literal('QC_FAILURE'),
  testDetails: z.any(),
  qcValues: z.array(z.any()),
  correctiveActions: z.array(z.string()),
  rootCauseAnalysis: z.string()
})

const rerunOptimizationSchema = z.object({
  originalTestRun: z.any(),
  rerunSchedule: z.string().datetime(),
  clientUrgency: z.enum(['ROUTINE', 'URGENT', 'STAT'])
})

export class QCIntelligenceController {

  /**
   * Predict QC failure using Biomni AI
   */
  async predictQCFailure(req: Request, res: Response) {
    try {
      const { equipmentId } = req.params
      const { laboratoryId, id: userId } = req.user as any
      const validation = qcPredictionSchema.safeParse(req.body)

      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid input data', 
          details: validation.error 
        })
      }

      const data = validation.data

      // Get equipment details
      const equipment = await prisma.equipment.findFirst({
        where: {
          id: equipmentId,
          laboratoryId: laboratoryId
        }
      })

      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' })
      }

      // Prepare request for Biomni QC service
      const qcRequest: QCPredictionRequest = {
        testType: data.testType,
        controlValues: data.controlValues,
        reagentLot: data.reagentLot,
        environmentalData: data.environmentalData.map(env => ({
          ...env,
          timestamp: new Date(env.timestamp)
        })),
        historicalQC: data.historicalQC.map(qc => ({
          ...qc,
          timestamp: new Date(qc.timestamp)
        })),
        equipmentId,
        laboratoryId
      }

      // Get prediction from Biomni
      const prediction = await biomniQCService.predictQCFailure(qcRequest)

      // Create alert if risk is high or critical
      if (prediction.failureRisk === 'HIGH' || prediction.failureRisk === 'CRITICAL') {
        await prisma.notification.create({
          data: {
            type: 'QC_FAILURE_RISK',
            title: `${data.testType} QC Failure Risk Detected`,
            message: `High risk of QC failure predicted for ${data.testType} testing on ${equipment.name}. Confidence: ${prediction.confidenceScore}%`,
            priority: prediction.failureRisk === 'CRITICAL' ? 'URGENT' : 'HIGH',
            userId: userId,
            laboratoryId: laboratoryId,
            metadata: {
              equipmentId,
              testType: data.testType,
              riskLevel: prediction.failureRisk,
              confidence: prediction.confidenceScore,
              predictedFailureTime: prediction.predictedFailureTime,
              recommendedActions: prediction.recommendedActions
            }
          }
        })
      }

      // Log the prediction
      await prisma.auditLog.create({
        data: {
          action: 'QC_FAILURE_PREDICTION',
          entityType: 'EQUIPMENT',
          entityId: equipmentId,
          userId: userId,
          laboratoryId: laboratoryId,
          details: {
            testType: data.testType,
            prediction: prediction,
            timestamp: new Date()
          }
        }
      })

      logger.info('QC failure prediction completed', {
        equipmentId,
        testType: data.testType,
        risk: prediction.failureRisk,
        confidence: prediction.confidenceScore
      })

      res.json({
        success: true,
        prediction,
        equipment: {
          id: equipment.id,
          name: equipment.name,
          model: equipment.model
        }
      })

    } catch (error) {
      logger.error('QC failure prediction failed:', error)
      res.status(500).json({ 
        error: 'Failed to predict QC failure',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Generate client notification for QC delays
   */
  async generateClientNotification(req: Request, res: Response) {
    try {
      const { laboratoryId, id: userId } = req.user as any
      const validation = clientNotificationSchema.safeParse(req.body)

      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid input data', 
          details: validation.error 
        })
      }

      const data = validation.data

      // Generate notification using Biomni
      const notification = await biomniQCService.generateClientNotification({
        testType: data.testType,
        originalETA: new Date(data.originalETA),
        newETA: new Date(data.newETA),
        reason: data.reason,
        clientInfo: data.clientInfo
      })

      // Store notification template for future use
      await prisma.notification.create({
        data: {
          type: 'CLIENT_DELAY_NOTIFICATION',
          title: `Test Delay Notification - ${data.testType}`,
          message: `Generated notification for ${data.clientInfo.name} regarding ${data.testType} test delay`,
          priority: data.clientInfo.urgency === 'STAT' ? 'URGENT' : 'NORMAL',
          userId: userId,
          laboratoryId: laboratoryId,
          metadata: {
            clientInfo: data.clientInfo,
            notification: notification,
            generatedAt: new Date()
          }
        }
      })

      logger.info('Client notification generated', {
        testType: data.testType,
        clientId: data.clientInfo.id,
        urgency: data.clientInfo.urgency
      })

      res.json({
        success: true,
        notification,
        clientInfo: data.clientInfo
      })

    } catch (error) {
      logger.error('Client notification generation failed:', error)
      res.status(500).json({ 
        error: 'Failed to generate client notification',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Generate QA report for QC failures
   */
  async generateQAReport(req: Request, res: Response) {
    try {
      const { laboratoryId, id: userId } = req.user as any
      const validation = qaReportSchema.safeParse(req.body)

      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid input data', 
          details: validation.error 
        })
      }

      const data = validation.data

      // Generate QA report using Biomni
      const qaReport = await biomniQCService.generateQAReport({
        incidentType: data.incidentType,
        testDetails: data.testDetails,
        qcValues: data.qcValues,
        correctiveActions: data.correctiveActions,
        rootCauseAnalysis: data.rootCauseAnalysis
      })

      // Store QA report
      const report = await prisma.report.create({
        data: {
          title: `QA Report - ${data.incidentType}`,
          description: `Automated QA report for ${data.incidentType} incident`,
          type: 'QA_INCIDENT',
          createdById: userId,
          laboratoryId: laboratoryId,
          status: 'DRAFT',
          findings: qaReport.reportText,
          recommendations: qaReport.recommendations.join('\n'),
          attachments: JSON.stringify({
            followUpActions: qaReport.followUpActions,
            regulatoryNotifications: qaReport.regulatoryNotifications
          })
        }
      })

      logger.info('QA report generated', {
        reportId: report.id,
        incidentType: data.incidentType
      })

      res.json({
        success: true,
        report: {
          id: report.id,
          title: report.title,
          status: report.status
        },
        qaReport
      })

    } catch (error) {
      logger.error('QA report generation failed:', error)
      res.status(500).json({ 
        error: 'Failed to generate QA report',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Optimize rerun scheduling
   */
  async optimizeRerunScheduling(req: Request, res: Response) {
    try {
      const { laboratoryId, id: userId } = req.user as any
      const validation = rerunOptimizationSchema.safeParse(req.body)

      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid input data', 
          details: validation.error 
        })
      }

      const data = validation.data

      // Get optimization from Biomni
      const optimization = await biomniQCService.optimizeRerunScheduling({
        originalTestRun: data.originalTestRun,
        rerunSchedule: new Date(data.rerunSchedule),
        clientUrgency: data.clientUrgency
      })

      // Create optimized calibration record
      const optimizedCalibration = await prisma.calibrationRecord.create({
        data: {
          equipmentId: data.originalTestRun.equipmentId,
          userId: userId,
          laboratoryId: laboratoryId,
          calibrationDate: optimization.optimalRunTime,
          dueDate: new Date(optimization.optimalRunTime.getTime() + 24 * 60 * 60 * 1000), // 24 hours later
          status: 'SCHEDULED',
          notes: `Optimized rerun scheduling - Batch: ${optimization.batchOptimization.join(', ')}`,
          metadata: {
            optimization: optimization,
            originalTestRun: data.originalTestRun,
            clientUrgency: data.clientUrgency
          }
        }
      })

      logger.info('Rerun scheduling optimized', {
        calibrationId: optimizedCalibration.id,
        optimalRunTime: optimization.optimalRunTime,
        batchOptimization: optimization.batchOptimization
      })

      res.json({
        success: true,
        optimization,
        calibration: {
          id: optimizedCalibration.id,
          scheduledDate: optimizedCalibration.calibrationDate,
          status: optimizedCalibration.status
        }
      })

    } catch (error) {
      logger.error('Rerun optimization failed:', error)
      res.status(500).json({ 
        error: 'Failed to optimize rerun scheduling',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Get QC monitoring dashboard data
   */
  async getQCMonitoringData(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any

      // Get recent QC data
      const recentQC = await prisma.calibrationRecord.findMany({
        where: {
          laboratoryId: laboratoryId,
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        include: {
          equipment: true,
          performedBy: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      })

      // Get equipment with upcoming calibrations
      const equipmentWithUpcomingCalibrations = await prisma.equipment.findMany({
        where: {
          laboratoryId: laboratoryId,
          status: 'ACTIVE'
        },
        include: {
          calibrationRecords: {
            where: {
              status: 'SCHEDULED'
            },
            orderBy: {
              calibrationDate: 'asc'
            },
            take: 1
          }
        }
      })

      // Calculate QC metrics
      const qcMetrics = {
        totalTests: recentQC.length,
        passedTests: recentQC.filter(qc => qc.result === 'PASS').length,
        failedTests: recentQC.filter(qc => qc.result === 'FAIL').length,
        warningTests: recentQC.filter(qc => qc.result === 'WARNING').length,
        passRate: recentQC.length > 0 ? 
          (recentQC.filter(qc => qc.result === 'PASS').length / recentQC.length) * 100 : 0,
        upcomingCalibrations: equipmentWithUpcomingCalibrations.filter(eq => eq.calibrationRecords.length > 0).length
      }

      res.json({
        success: true,
        qcMetrics,
        recentQC: recentQC.map(qc => ({
          id: qc.id,
          equipmentName: qc.equipment.name,
          equipmentModel: qc.equipment.model,
          result: qc.result,
          performedAt: qc.performedDate,
          performedBy: qc.performedBy?.name,
          complianceScore: qc.complianceScore
        })),
        upcomingCalibrations: equipmentWithUpcomingCalibrations
          .filter(eq => eq.calibrationRecords.length > 0)
          .map(eq => ({
            equipmentId: eq.id,
            equipmentName: eq.name,
            equipmentModel: eq.model,
            nextCalibration: eq.calibrationRecords[0].calibrationDate
          }))
      })

    } catch (error) {
      logger.error('Failed to get QC monitoring data:', error)
      res.status(500).json({ 
        error: 'Failed to get QC monitoring data',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Handle QC failure cascade
   */
  async handleQCFailureCascade(req: Request, res: Response) {
    try {
      const { testRunId } = req.params
      const { laboratoryId, id: userId } = req.user as any

      // Get test run details
      const testRun = await prisma.calibrationRecord.findFirst({
        where: {
          id: testRunId,
          laboratory: {
            id: laboratoryId
          }
        },
        include: {
          equipment: true
        }
      })

      if (!testRun) {
        return res.status(404).json({ error: 'Test run not found' })
      }

      // Get affected clients (simplified - in real implementation, you'd have a clients table)
      const affectedClients = [
        {
          id: 'client-1',
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@clinic.com',
          phone: '555-0123',
          organization: 'Downtown Medical Clinic',
          urgency: 'URGENT' as const
        }
      ]

      // Generate notifications for all affected clients
      const notifications = []
      for (const client of affectedClients) {
        const notification = await biomniQCService.generateClientNotification({
          testType: 'West Nile Virus',
          originalETA: testRun.calibrationDate,
          newETA: new Date(testRun.calibrationDate.getTime() + 24 * 60 * 60 * 1000), // 24 hours later
          reason: 'QC_FAILURE',
          clientInfo: client
        })

        notifications.push({
          client,
          notification
        })
      }

      // Optimize rerun scheduling
      const optimization = await biomniQCService.optimizeRerunScheduling({
        originalTestRun: testRun,
        rerunSchedule: new Date(),
        clientUrgency: 'URGENT'
      })

      // Generate QA report
      const qaReport = await biomniQCService.generateQAReport({
        incidentType: 'QC_FAILURE',
        testDetails: testRun,
        qcValues: [],
        correctiveActions: ['Reagent replacement', 'Equipment recalibration'],
        rootCauseAnalysis: 'Reagent lot expiration causing QC failure'
      })

      logger.info('QC failure cascade handled', {
        testRunId,
        affectedClients: affectedClients.length,
        optimization: optimization.optimalRunTime
      })

      res.json({
        success: true,
        testRun: {
          id: testRun.id,
          equipmentName: testRun.equipment.name,
          status: 'FAILED'
        },
        notifications,
        optimization,
        qaReport: {
          reportText: qaReport.reportText,
          recommendations: qaReport.recommendations
        }
      })

    } catch (error) {
      logger.error('QC failure cascade handling failed:', error)
      res.status(500).json({ 
        error: 'Failed to handle QC failure cascade',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

export const qcIntelligenceController = new QCIntelligenceController() 
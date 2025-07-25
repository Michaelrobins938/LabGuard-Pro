import { Request, Response } from 'express'
import { PrismaClient } from '@labguard/database'
import { z } from 'zod'
import { logger } from '../utils/logger'
import { aiService } from '../utils/ai.service'

const prisma = new PrismaClient()

// Validation schemas
const createCalibrationSchema = z.object({
  equipmentId: z.string().cuid(),
  calibrationType: z.enum(['INITIAL', 'PERIODIC', 'AFTER_REPAIR', 'VERIFICATION', 'INTERIM_CHECK']),
  scheduledDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  templateId: z.string().cuid().optional(),
  notes: z.string().optional(),
  assignedToId: z.string().cuid().optional()
})

const updateCalibrationSchema = z.object({
  performedDate: z.string().datetime().optional(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED', 'FAILED']).optional(),
  measurements: z.record(z.any()).optional(),
  environmentalConditions: z.record(z.any()).optional(),
  standardsUsed: z.record(z.any()).optional(),
  complianceStatus: z.enum(['COMPLIANT', 'NON_COMPLIANT', 'CONDITIONAL', 'PENDING', 'UNDER_REVIEW']).optional(),
  complianceScore: z.number().min(0).max(100).optional(),
  deviations: z.array(z.any()).optional(),
  correctiveActions: z.array(z.any()).optional(),
  certificate: z.string().optional(),
  notes: z.string().optional(),
  aiAnalysis: z.record(z.any()).optional()
})

const aiValidationSchema = z.object({
  measurements: z.record(z.any()),
  environmentalConditions: z.record(z.any()),
  standardsUsed: z.record(z.any()),
  templateId: z.string().cuid()
})

export class CalibrationController {
  /**
   * Get all calibrations for a laboratory
   */
  async getCalibrations(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const { status, equipmentId, page = 1, limit = 20 } = req.query

      const where: any = {
        equipment: {
          laboratoryId: laboratoryId
        },
        deletedAt: null
      }

      if (status) {
        where.status = status
      }

      if (equipmentId) {
        where.equipmentId = equipmentId
      }

      const [calibrations, total] = await Promise.all([
        prisma.calibrationRecord.findMany({
          where,
          include: {
            equipment: {
              select: {
                id: true,
                name: true,
                model: true,
                serialNumber: true,
                equipmentType: true,
                location: true
              }
            },
            performedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            template: {
              select: {
                id: true,
                name: true,
                category: true
              }
            }
          },
          orderBy: {
            scheduledDate: 'desc'
          },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit)
        }),
        prisma.calibrationRecord.count({ where })
      ])

      res.json({
        calibrations,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })

    } catch (error) {
      logger.error('Failed to get calibrations:', error)
      res.status(500).json({ error: 'Failed to retrieve calibrations' })
    }
  }

  /**
   * Get a single calibration by ID
   */
  async getCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any

      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id,
          equipment: {
            laboratoryId: laboratoryId
          },
          deletedAt: null
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true,
              equipmentType: true,
              location: true,
              specifications: true
            }
          },
          performedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          template: {
            select: {
              id: true,
              name: true,
              category: true,
              description: true
            }
          }
        }
      })

      if (!calibration) {
        return res.status(404).json({ error: 'Calibration not found' })
      }

      res.json(calibration)

    } catch (error) {
      logger.error('Failed to get calibration:', error)
      res.status(500).json({ error: 'Failed to retrieve calibration' })
    }
  }

  /**
   * Create a new calibration record
   */
  async createCalibration(req: Request, res: Response) {
    try {
      const { laboratoryId, id: userId } = req.user as any
      const validation = createCalibrationSchema.safeParse(req.body)

      if (!validation.success) {
        return res.status(400).json({ error: 'Invalid input data', details: validation.error })
      }

      const data = validation.data

      // Verify equipment belongs to laboratory
      const equipment = await prisma.equipment.findFirst({
        where: {
          id: data.equipmentId,
          laboratoryId: laboratoryId
        }
      })

      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' })
      }

      // Create calibration record
      const calibration = await prisma.calibrationRecord.create({
        data: {
          equipmentId: data.equipmentId,
          calibrationType: data.calibrationType,
          scheduledDate: new Date(data.scheduledDate),
          dueDate: new Date(data.dueDate),
          templateId: data.templateId,
          notes: data.notes,
          performedById: data.assignedToId || userId,
          status: 'SCHEDULED'
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true
            }
          },
          performedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      logger.info(`Created calibration ${calibration.id} for equipment ${data.equipmentId}`)
      res.status(201).json(calibration)

    } catch (error) {
      logger.error('Failed to create calibration:', error)
      res.status(500).json({ error: 'Failed to create calibration' })
    }
  }

  /**
   * Update calibration record
   */
  async updateCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any
      const validation = updateCalibrationSchema.safeParse(req.body)

      if (!validation.success) {
        return res.status(400).json({ error: 'Invalid input data', details: validation.error })
      }

      const data = validation.data

      // Verify calibration belongs to laboratory
      const existingCalibration = await prisma.calibrationRecord.findFirst({
        where: {
          id,
          equipment: {
            laboratoryId: laboratoryId
          }
        }
      })

      if (!existingCalibration) {
        return res.status(404).json({ error: 'Calibration not found' })
      }

      // Update calibration
      const calibration = await prisma.calibrationRecord.update({
        where: { id },
        data: {
          ...data,
          performedDate: data.performedDate ? new Date(data.performedDate) : undefined,
          updatedAt: new Date()
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true
            }
          },
          performedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      logger.info(`Updated calibration ${id}`)
      res.json(calibration)

    } catch (error) {
      logger.error('Failed to update calibration:', error)
      res.status(500).json({ error: 'Failed to update calibration' })
    }
  }

  /**
   * Start calibration workflow
   */
  async startCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any

      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id,
          equipment: {
            laboratoryId: laboratoryId
          }
        },
        include: {
          equipment: true,
          template: true
        }
      })

      if (!calibration) {
        return res.status(404).json({ error: 'Calibration not found' })
      }

      if (calibration.status !== 'SCHEDULED') {
        return res.status(400).json({ error: 'Calibration cannot be started - invalid status' })
      }

      // Update status to IN_PROGRESS
      const updatedCalibration = await prisma.calibrationRecord.update({
        where: { id },
        data: {
          status: 'IN_PROGRESS',
          performedDate: new Date(),
          updatedAt: new Date()
        },
        include: {
          equipment: true,
          template: true
        }
      })

      logger.info(`Started calibration ${id}`)
      res.json(updatedCalibration)

    } catch (error) {
      logger.error('Failed to start calibration:', error)
      res.status(500).json({ error: 'Failed to start calibration' })
    }
  }

  /**
   * Complete calibration workflow
   */
  async completeCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId, id: userId } = req.user as any
      const validation = updateCalibrationSchema.safeParse(req.body)

      if (!validation.success) {
        return res.status(400).json({ error: 'Invalid input data', details: validation.error })
      }

      const data = validation.data

      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id,
          equipment: {
            laboratoryId: laboratoryId
          }
        },
        include: {
          equipment: true,
          template: true
        }
      })

      if (!calibration) {
        return res.status(404).json({ error: 'Calibration not found' })
      }

      if (calibration.status !== 'IN_PROGRESS') {
        return res.status(400).json({ error: 'Calibration cannot be completed - invalid status' })
      }

      // Update calibration with completion data
      const updatedCalibration = await prisma.calibrationRecord.update({
        where: { id },
        data: {
          ...data,
          status: 'COMPLETED',
          performedDate: new Date(),
          performedById: userId,
          updatedAt: new Date()
        },
        include: {
          equipment: true,
          performedBy: true,
          template: true
        }
      })

      logger.info(`Completed calibration ${id}`)
      res.json(updatedCalibration)

    } catch (error) {
      logger.error('Failed to complete calibration:', error)
      res.status(500).json({ error: 'Failed to complete calibration' })
    }
  }

  /**
   * Run AI validation for calibration
   */
  async validateCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId, id: userId } = req.user as any
      const validation = aiValidationSchema.safeParse(req.body)

      if (!validation.success) {
        return res.status(400).json({ error: 'Invalid input data', details: validation.error })
      }

      const data = validation.data

      // Get calibration record
      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id,
          equipment: {
            laboratoryId: laboratoryId
          }
        },
        include: {
          equipment: true,
          template: true
        }
      })

      if (!calibration) {
        return res.status(404).json({ error: 'Calibration not found' })
      }

      // Run AI validation
      const aiResult = await aiService.validateCalibration({
        equipmentId: calibration.equipmentId,
        templateId: data.templateId,
        measurements: data.measurements,
        environmentalConditions: data.environmentalConditions,
        standardsUsed: data.standardsUsed,
        userId,
        laboratoryId
      })

      // Update calibration with AI results
      const updatedCalibration = await prisma.calibrationRecord.update({
        where: { id },
        data: {
          complianceStatus: aiResult.status,
          complianceScore: aiResult.complianceScore,
          deviations: aiResult.deviations,
          correctiveActions: aiResult.correctiveActions,
          aiAnalysis: {
            status: aiResult.status,
            complianceScore: aiResult.complianceScore,
            performanceSummary: aiResult.performanceSummary,
            correctiveActions: aiResult.correctiveActions,
            nextVerificationDue: aiResult.nextVerificationDue,
            deviations: aiResult.deviations,
            recommendations: aiResult.recommendations,
            confidence: aiResult.confidence
          },
          updatedAt: new Date()
        },
        include: {
          equipment: true,
          performedBy: true,
          template: true
        }
      })

      logger.info(`AI validation completed for calibration ${id}: ${aiResult.status}`)
      res.json({
        calibration: updatedCalibration,
        aiResult
      })

    } catch (error) {
      logger.error('Failed to validate calibration:', error)
      res.status(500).json({ error: 'Failed to validate calibration' })
    }
  }

  /**
   * Get due calibrations
   */
  async getDueCalibrations(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const { days = 30 } = req.query

      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + Number(days))

      const calibrations = await prisma.calibrationRecord.findMany({
        where: {
          equipment: {
            laboratoryId: laboratoryId
          },
          dueDate: {
            lte: dueDate
          },
          status: {
            in: ['SCHEDULED', 'IN_PROGRESS']
          },
          deletedAt: null
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true,
              equipmentType: true,
              location: true
            }
          },
          performedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          dueDate: 'asc'
        }
      })

      res.json(calibrations)

    } catch (error) {
      logger.error('Failed to get due calibrations:', error)
      res.status(500).json({ error: 'Failed to retrieve due calibrations' })
    }
  }

  /**
   * Get overdue calibrations
   */
  async getOverdueCalibrations(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any

      const calibrations = await prisma.calibrationRecord.findMany({
        where: {
          equipment: {
            laboratoryId: laboratoryId
          },
          dueDate: {
            lt: new Date()
          },
          status: {
            in: ['SCHEDULED', 'IN_PROGRESS']
          },
          deletedAt: null
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true,
              equipmentType: true,
              location: true
            }
          },
          performedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          dueDate: 'asc'
        }
      })

      res.json(calibrations)

    } catch (error) {
      logger.error('Failed to get overdue calibrations:', error)
      res.status(500).json({ error: 'Failed to retrieve overdue calibrations' })
    }
  }

  /**
   * Reschedule calibration
   */
  async rescheduleCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any
      const { scheduledDate, dueDate, notes } = req.body

      if (!scheduledDate || !dueDate) {
        return res.status(400).json({ error: 'Scheduled date and due date are required' })
      }

      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id,
          equipment: {
            laboratoryId: laboratoryId
          }
        }
      })

      if (!calibration) {
        return res.status(404).json({ error: 'Calibration not found' })
      }

      const updatedCalibration = await prisma.calibrationRecord.update({
        where: { id },
        data: {
          scheduledDate: new Date(scheduledDate),
          dueDate: new Date(dueDate),
          notes: notes || calibration.notes,
          status: 'SCHEDULED',
          updatedAt: new Date()
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true
            }
          },
          performedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      logger.info(`Rescheduled calibration ${id}`)
      res.json(updatedCalibration)

    } catch (error) {
      logger.error('Failed to reschedule calibration:', error)
      res.status(500).json({ error: 'Failed to reschedule calibration' })
    }
  }

  /**
   * Cancel calibration
   */
  async cancelCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any
      const { reason } = req.body

      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id,
          equipment: {
            laboratoryId: laboratoryId
          }
        }
      })

      if (!calibration) {
        return res.status(404).json({ error: 'Calibration not found' })
      }

      if (calibration.status === 'COMPLETED') {
        return res.status(400).json({ error: 'Cannot cancel completed calibration' })
      }

      const updatedCalibration = await prisma.calibrationRecord.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          notes: reason ? `${calibration.notes || ''}\nCancelled: ${reason}` : calibration.notes,
          updatedAt: new Date()
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true
            }
          },
          performedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      logger.info(`Cancelled calibration ${id}`)
      res.json(updatedCalibration)

    } catch (error) {
      logger.error('Failed to cancel calibration:', error)
      res.status(500).json({ error: 'Failed to cancel calibration' })
    }
  }

  /**
   * Delete calibration (soft delete)
   */
  async deleteCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any

      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id,
          equipment: {
            laboratoryId: laboratoryId
          }
        }
      })

      if (!calibration) {
        return res.status(404).json({ error: 'Calibration not found' })
      }

      await prisma.calibrationRecord.update({
        where: { id },
        data: {
          deletedAt: new Date()
        }
      })

      logger.info(`Deleted calibration ${id}`)
      res.json({ message: 'Calibration deleted successfully' })

    } catch (error) {
      logger.error('Failed to delete calibration:', error)
      res.status(500).json({ error: 'Failed to delete calibration' })
    }
  }

  /**
   * Get calibration statistics
   */
  async getCalibrationStats(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const { period = 'month' } = req.query

      const now = new Date()
      const startDate = new Date()

      switch (period) {
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3)
          break
        default:
          startDate.setMonth(now.getMonth() - 1)
      }

      const [total, completed, overdue, inProgress] = await Promise.all([
        prisma.calibrationRecord.count({
          where: {
            equipment: { laboratoryId },
            createdAt: { gte: startDate },
            deletedAt: null
          }
        }),
        prisma.calibrationRecord.count({
          where: {
            equipment: { laboratoryId },
            status: 'COMPLETED',
            performedDate: { gte: startDate },
            deletedAt: null
          }
        }),
        prisma.calibrationRecord.count({
          where: {
            equipment: { laboratoryId },
            dueDate: { lt: now },
            status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
            deletedAt: null
          }
        }),
        prisma.calibrationRecord.count({
          where: {
            equipment: { laboratoryId },
            status: 'IN_PROGRESS',
            deletedAt: null
          }
        })
      ])

      const complianceRate = total > 0 ? (completed / total) * 100 : 0

      res.json({
        period,
        total,
        completed,
        overdue,
        inProgress,
        complianceRate: Math.round(complianceRate * 100) / 100
      })

    } catch (error) {
      logger.error('Failed to get calibration stats:', error)
      res.status(500).json({ error: 'Failed to retrieve calibration statistics' })
    }
  }
}

export const calibrationController = new CalibrationController() 
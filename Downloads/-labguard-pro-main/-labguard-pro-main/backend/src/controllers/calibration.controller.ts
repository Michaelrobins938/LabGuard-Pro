import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { logger } from '../utils/logger'
import { ApiError } from '../utils/errors'
import { aiService } from '../utils/ai.service'

const prisma = new PrismaClient()

// Validation schemas
const createCalibrationSchema = z.object({
  equipmentId: z.string().cuid(),
  calibrationDate: z.date(),
  dueDate: z.date(),
  scheduledDate: z.date().optional(),
  method: z.string().optional(),
  standardUsed: z.string().optional(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  pressure: z.number().optional(),
  templateId: z.string().cuid().optional(),
  notes: z.string().optional()
})

const updateCalibrationSchema = z.object({
  equipmentId: z.string().cuid().optional(),
  calibrationDate: z.date().optional(),
  dueDate: z.date().optional(),
  scheduledDate: z.date().optional(),
  method: z.string().optional(),
  standardUsed: z.string().optional(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  pressure: z.number().optional(),
  templateId: z.string().cuid().optional(),
  notes: z.string().optional()
})

const completeCalibrationSchema = z.object({
  result: z.enum(['PASS', 'FAIL', 'CONDITIONAL']),
  complianceStatus: z.string().optional(),
  accuracy: z.number().optional(),
  precision: z.number().optional(),
  linearity: z.number().optional(),
  repeatability: z.number().optional(),
  sensitivity: z.number().optional(),
  isCompliant: z.boolean().optional(),
  complianceScore: z.number().optional(),
  validationNotes: z.string().optional(),
  notes: z.string().optional(),
  deviations: z.any().optional(),
  correctiveActions: z.any().optional()
})

const validateCalibrationSchema = z.object({
  measurements: z.record(z.any()),
  environmentalConditions: z.record(z.any()),
  standardsUsed: z.record(z.any())
})

const rescheduleCalibrationSchema = z.object({
  scheduledDate: z.date(),
  dueDate: z.date(),
  notes: z.string().optional()
})

const cancelCalibrationSchema = z.object({
  notes: z.string().optional()
})

export class CalibrationController {
  /**
   * Get all calibrations with pagination and filtering
   */
  async getCalibrations(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const { page = 1, limit = 20, status, equipmentId } = req.query

      const where: any = {
        laboratoryId: laboratoryId,
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
                equipmentType: true
              }
            },
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            template: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
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
      throw new ApiError(500, 'Failed to get calibrations')
    }
  }

  /**
   * Get calibration statistics
   */
  async getCalibrationStats(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any

      const [total, pending, inProgress, completed, overdue] = await Promise.all([
        prisma.calibrationRecord.count({
          where: {
            laboratoryId: laboratoryId,
            deletedAt: null
          }
        }),
        prisma.calibrationRecord.count({
          where: {
            laboratoryId: laboratoryId,
            status: 'PENDING',
            deletedAt: null
          }
        }),
        prisma.calibrationRecord.count({
          where: {
            laboratoryId: laboratoryId,
            status: 'IN_PROGRESS',
            deletedAt: null
          }
        }),
        prisma.calibrationRecord.count({
          where: {
            laboratoryId: laboratoryId,
            status: 'COMPLETED',
            deletedAt: null
          }
        }),
        prisma.calibrationRecord.count({
          where: {
            laboratoryId: laboratoryId,
            status: 'OVERDUE',
            deletedAt: null
          }
        })
      ])

      res.json({
        total,
        pending,
        inProgress,
        completed,
        overdue
      })
    } catch (error) {
      logger.error('Failed to get calibration stats:', error)
      throw new ApiError(500, 'Failed to get calibration statistics')
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
          laboratoryId: laboratoryId,
          dueDate: {
            lte: dueDate
          },
          status: { in: ['PENDING', 'IN_PROGRESS'] },
          deletedAt: null
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true
            }
          }
        },
        orderBy: { dueDate: 'asc' }
      })

      res.json(calibrations)
    } catch (error) {
      logger.error('Failed to get due calibrations:', error)
      throw new ApiError(500, 'Failed to get due calibrations')
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
          laboratoryId: laboratoryId,
          dueDate: {
            lt: new Date()
          },
          status: { in: ['PENDING', 'IN_PROGRESS'] },
          deletedAt: null
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true
            }
          }
        },
        orderBy: { dueDate: 'asc' }
      })

      res.json(calibrations)
    } catch (error) {
      logger.error('Failed to get overdue calibrations:', error)
      throw new ApiError(500, 'Failed to get overdue calibrations')
    }
  }

  /**
   * Get single calibration
   */
  async getCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any

      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id: id,
          laboratoryId: laboratoryId
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true,
              equipmentType: true
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          template: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      })

      if (!calibration) {
        throw new ApiError(404, 'Calibration not found')
      }

      res.json(calibration)
    } catch (error) {
      logger.error('Failed to get calibration:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to get calibration')
    }
  }

  /**
   * Create new calibration
   */
  async createCalibration(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const validatedData = createCalibrationSchema.parse(req.body)

      // Verify equipment belongs to laboratory
      const equipment = await prisma.equipment.findFirst({
        where: {
          id: validatedData.equipmentId,
          laboratoryId: laboratoryId
        }
      })

      if (!equipment) {
        throw new ApiError(404, 'Equipment not found')
      }

      // Verify template if provided
      if (validatedData.templateId) {
        const template = await prisma.complianceTemplate.findFirst({
          where: {
            id: validatedData.templateId,
            laboratoryId: laboratoryId
          }
        })

        if (!template) {
          throw new ApiError(404, 'Template not found')
        }
      }

      const calibration = await prisma.calibrationRecord.create({
        data: {
          equipmentId: validatedData.equipmentId,
          userId: (req.user as any).userId,
          laboratoryId: laboratoryId,
          calibrationDate: validatedData.calibrationDate,
          dueDate: validatedData.dueDate,
          scheduledDate: validatedData.scheduledDate,
          method: validatedData.method,
          standardUsed: validatedData.standardUsed,
          temperature: validatedData.temperature,
          humidity: validatedData.humidity,
          pressure: validatedData.pressure,
          templateId: validatedData.templateId,
          notes: validatedData.notes
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true
            }
          }
        }
      })

      logger.info('Calibration created', {
        calibrationId: calibration.id,
        equipmentId: validatedData.equipmentId,
        laboratoryId: laboratoryId
      })

      res.status(201).json({
        message: 'Calibration created successfully',
        calibration
      })
    } catch (error) {
      logger.error('Failed to create calibration:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to create calibration')
    }
  }

  /**
   * Update calibration
   */
  async updateCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any
      const validatedData = updateCalibrationSchema.parse(req.body)

      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id: id,
          laboratoryId: laboratoryId
        }
      })

      if (!calibration) {
        throw new ApiError(404, 'Calibration not found')
      }

      // Verify equipment if being updated
      if (validatedData.equipmentId) {
        const equipment = await prisma.equipment.findFirst({
          where: {
            id: validatedData.equipmentId,
            laboratoryId: laboratoryId
          }
        })

        if (!equipment) {
          throw new ApiError(404, 'Equipment not found')
        }
      }

      // Verify template if being updated
      if (validatedData.templateId) {
        const template = await prisma.complianceTemplate.findFirst({
          where: {
            id: validatedData.templateId,
            laboratoryId: laboratoryId
          }
        })

        if (!template) {
          throw new ApiError(404, 'Template not found')
        }
      }

      const updatedCalibration = await prisma.calibrationRecord.update({
        where: { id: id },
        data: {
          equipmentId: validatedData.equipmentId,
          calibrationDate: validatedData.calibrationDate,
          dueDate: validatedData.dueDate,
          scheduledDate: validatedData.scheduledDate,
          method: validatedData.method,
          standardUsed: validatedData.standardUsed,
          temperature: validatedData.temperature,
          humidity: validatedData.humidity,
          pressure: validatedData.pressure,
          templateId: validatedData.templateId,
          notes: validatedData.notes
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true
            }
          }
        }
      })

      logger.info('Calibration updated', {
        calibrationId: id,
        laboratoryId: laboratoryId
      })

      res.json({
        message: 'Calibration updated successfully',
        calibration: updatedCalibration
      })
    } catch (error) {
      logger.error('Failed to update calibration:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to update calibration')
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
          id: id,
          laboratoryId: laboratoryId,
          status: { in: ['PENDING'] }
        }
      })

      if (!calibration) {
        throw new ApiError(404, 'Calibration not found or cannot be started')
      }

      const updatedCalibration = await prisma.calibrationRecord.update({
        where: { id: id },
        data: {
          status: 'IN_PROGRESS',
          performedDate: new Date()
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true
            }
          }
        }
      })

      logger.info('Calibration started', {
        calibrationId: id,
        laboratoryId: laboratoryId
      })

      res.json({
        message: 'Calibration started successfully',
        calibration: updatedCalibration
      })
    } catch (error) {
      logger.error('Failed to start calibration:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to start calibration')
    }
  }

  /**
   * Complete calibration workflow
   */
  async completeCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any
      const validatedData = completeCalibrationSchema.parse(req.body)

      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id: id,
          laboratoryId: laboratoryId,
          status: { in: ['IN_PROGRESS'] }
        }
      })

      if (!calibration) {
        throw new ApiError(404, 'Calibration not found or cannot be completed')
      }

      const updatedCalibration = await prisma.calibrationRecord.update({
        where: { id: id },
        data: {
          status: 'COMPLETED',
          result: validatedData.result,
          complianceStatus: validatedData.complianceStatus,
          accuracy: validatedData.accuracy,
          precision: validatedData.precision,
          linearity: validatedData.linearity,
          repeatability: validatedData.repeatability,
          sensitivity: validatedData.sensitivity,
          isCompliant: validatedData.isCompliant,
          complianceScore: validatedData.complianceScore,
          validationNotes: validatedData.validationNotes,
          notes: validatedData.notes,
          deviations: validatedData.deviations,
          correctiveActions: validatedData.correctiveActions
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true
            }
          }
        }
      })

      // Update equipment last calibration date
      await prisma.equipment.update({
        where: { id: calibration.equipmentId },
        data: {
          lastCalibratedAt: new Date()
        }
      })

      logger.info('Calibration completed', {
        calibrationId: id,
        result: validatedData.result,
        laboratoryId: laboratoryId
      })

      res.json({
        message: 'Calibration completed successfully',
        calibration: updatedCalibration
      })
    } catch (error) {
      logger.error('Failed to complete calibration:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to complete calibration')
    }
  }

  /**
   * Run AI validation
   */
  async validateCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any
      const validatedData = validateCalibrationSchema.parse(req.body)

      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id: id,
          laboratoryId: laboratoryId
        },
        include: {
          equipment: true,
          template: true
        }
      })

      if (!calibration) {
        throw new ApiError(404, 'Calibration not found')
      }

      // Call AI validation service
      const aiValidation = await aiService.validateCalibration({
        equipmentId: calibration.equipmentId,
        templateId: calibration.templateId || '',
        measurements: validatedData.measurements,
        environmentalConditions: validatedData.environmentalConditions,
        standardsUsed: validatedData.standardsUsed,
        userId: (req.user as any).userId,
        laboratoryId: laboratoryId
      })

      // Update calibration with AI validation results
      const updatedCalibration = await prisma.calibrationRecord.update({
        where: { id: id },
        data: {
          aiValidation: JSON.parse(JSON.stringify(aiValidation)),
          aiValidationResult: JSON.parse(JSON.stringify(aiValidation)),
          complianceScore: aiValidation.complianceScore,
          isCompliant: aiValidation.status === 'PASS',
          validationNotes: aiValidation.performanceSummary,
          deviations: aiValidation.deviations,
          correctiveActions: aiValidation.correctiveActions
        }
      })

      logger.info('Calibration validated with AI', {
        calibrationId: id,
        complianceScore: aiValidation.complianceScore,
        laboratoryId: laboratoryId
      })

      res.json({
        message: 'Calibration validated successfully',
        calibration: updatedCalibration,
        aiValidation: aiValidation
      })
    } catch (error) {
      logger.error('Failed to validate calibration:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to validate calibration')
    }
  }

  /**
   * Reschedule calibration
   */
  async rescheduleCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any
      const validatedData = rescheduleCalibrationSchema.parse(req.body)

      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id: id,
          laboratoryId: laboratoryId,
          status: { in: ['PENDING', 'IN_PROGRESS'] }
        }
      })

      if (!calibration) {
        throw new ApiError(404, 'Calibration not found or cannot be rescheduled')
      }

      const updatedCalibration = await prisma.calibrationRecord.update({
        where: { id: id },
        data: {
          scheduledDate: validatedData.scheduledDate,
          dueDate: validatedData.dueDate,
          notes: validatedData.notes
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true
            }
          }
        }
      })

      logger.info('Calibration rescheduled', {
        calibrationId: id,
        newScheduledDate: validatedData.scheduledDate,
        laboratoryId: laboratoryId
      })

      res.json({
        message: 'Calibration rescheduled successfully',
        calibration: updatedCalibration
      })
    } catch (error) {
      logger.error('Failed to reschedule calibration:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to reschedule calibration')
    }
  }

  /**
   * Cancel calibration
   */
  async cancelCalibration(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user as any
      const validatedData = cancelCalibrationSchema.parse(req.body)

      const calibration = await prisma.calibrationRecord.findFirst({
        where: {
          id: id,
          laboratoryId: laboratoryId,
          status: { in: ['PENDING', 'IN_PROGRESS'] }
        }
      })

      if (!calibration) {
        throw new ApiError(404, 'Calibration not found or cannot be cancelled')
      }

      const updatedCalibration = await prisma.calibrationRecord.update({
        where: { id: id },
        data: {
          status: 'CANCELLED',
          notes: validatedData.notes
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              model: true,
              serialNumber: true
            }
          }
        }
      })

      logger.info('Calibration cancelled', {
        calibrationId: id,
        laboratoryId: laboratoryId
      })

      res.json({
        message: 'Calibration cancelled successfully',
        calibration: updatedCalibration
      })
    } catch (error) {
      logger.error('Failed to cancel calibration:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to cancel calibration')
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
          id: id,
          laboratoryId: laboratoryId
        }
      })

      if (!calibration) {
        throw new ApiError(404, 'Calibration not found')
      }

      await prisma.calibrationRecord.update({
        where: { id: id },
        data: {
          deletedAt: new Date()
        }
      })

      logger.info('Calibration deleted', {
        calibrationId: id,
        laboratoryId: laboratoryId
      })

      res.json({ message: 'Calibration deleted successfully' })
    } catch (error) {
      logger.error('Failed to delete calibration:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to delete calibration')
    }
  }
}

export const calibrationController = new CalibrationController() 
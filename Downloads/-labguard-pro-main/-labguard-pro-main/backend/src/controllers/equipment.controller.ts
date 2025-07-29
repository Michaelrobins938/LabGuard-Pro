import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { logger } from '../utils/logger'
import { ApiError } from '../utils/errors'

const prisma = new PrismaClient()

// Validation schemas
const equipmentCreateSchema = z.object({
  name: z.string().min(1),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  equipmentType: z.enum(['ANALYZER', 'SPECTROMETER', 'MICROSCOPE', 'CENTRIFUGE', 'INCUBATOR', 'REFRIGERATOR', 'FREEZER', 'AUTOCLAVE', 'BALANCE', 'PH_METER', 'THERMOMETER', 'OTHER']),
  location: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED']).optional(),
  accuracy: z.number().optional(),
  precision: z.number().optional(),
  specifications: z.any().optional(),
  notes: z.string().optional(),
  installDate: z.date().optional(),
  assignedToId: z.string().cuid().optional()
})

const equipmentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  equipmentType: z.enum(['ANALYZER', 'SPECTROMETER', 'MICROSCOPE', 'CENTRIFUGE', 'INCUBATOR', 'REFRIGERATOR', 'FREEZER', 'AUTOCLAVE', 'BALANCE', 'PH_METER', 'THERMOMETER', 'OTHER']).optional(),
  location: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED']).optional(),
  accuracy: z.number().optional(),
  precision: z.number().optional(),
  specifications: z.any().optional(),
  notes: z.string().optional(),
  installDate: z.date().optional(),
  assignedToId: z.string().cuid().optional()
})

export class EquipmentController {
  /**
   * Get all equipment with pagination and filtering
   */
  async getEquipment(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user!
      const { page = 1, limit = 20, status, type, search } = req.query

      const where: any = {
        laboratoryId: laboratoryId,
        deletedAt: null
      }

      if (status) {
        where.status = status
      }

      if (type) {
        where.equipmentType = type
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { model: { contains: search as string, mode: 'insensitive' } },
          { serialNumber: { contains: search as string, mode: 'insensitive' } },
          { manufacturer: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      const [equipment, total] = await Promise.all([
        prisma.equipment.findMany({
          where,
          include: {
            assignedTo: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            maintenanceRecords: {
              orderBy: { maintenanceDate: 'desc' },
              take: 5
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit)
        }),
        prisma.equipment.count({ where })
      ])

      res.json({
        equipment,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      logger.error('Failed to get equipment:', error)
      throw new ApiError(500, 'Failed to get equipment')
    }
  }

  async getEquipmentById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user!

      const equipment = await prisma.equipment.findFirst({
        where: {
          id: id,
          laboratoryId: laboratoryId,
          deletedAt: null
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          calibrationRecords: {
            where: { deletedAt: null },
            orderBy: { calibrationDate: 'desc' },
            take: 10
          },
          maintenanceRecords: {
            orderBy: { maintenanceDate: 'desc' },
            take: 10
          }
        }
      })

      if (!equipment) {
        throw new ApiError(404, 'Equipment not found')
      }

      res.json(equipment)
    } catch (error) {
      logger.error('Failed to get equipment by ID:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to get equipment')
    }
  }

  async createEquipment(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user!
      const validatedData = equipmentCreateSchema.parse(req.body)

      const equipment = await prisma.equipment.create({
        data: {
          name: validatedData.name,
          model: validatedData.model,
          serialNumber: validatedData.serialNumber,
          manufacturer: validatedData.manufacturer,
          equipmentType: validatedData.equipmentType,
          location: validatedData.location,
          status: validatedData.status || 'ACTIVE',
          accuracy: validatedData.accuracy,
          precision: validatedData.precision,
          specifications: validatedData.specifications,
          notes: validatedData.notes,
          installDate: validatedData.installDate,
          laboratoryId: laboratoryId,
          assignedToId: validatedData.assignedToId
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })

      logger.info('Equipment created', {
        equipmentId: equipment.id,
        name: equipment.name,
        laboratoryId: laboratoryId
      })

      res.status(201).json({
        message: 'Equipment created successfully',
        equipment
      })
    } catch (error) {
      logger.error('Failed to create equipment:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to create equipment')
    }
  }

  async updateEquipment(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user!
      const validatedData = equipmentUpdateSchema.parse(req.body)

      const equipment = await prisma.equipment.findFirst({
        where: {
          id: id,
          laboratoryId: laboratoryId,
          deletedAt: null
        }
      })

      if (!equipment) {
        throw new ApiError(404, 'Equipment not found')
      }

      // Verify assigned user belongs to laboratory if being updated
      if (validatedData.assignedToId) {
        const assignedUser = await prisma.user.findFirst({
          where: {
            id: validatedData.assignedToId,
            laboratoryId: laboratoryId
          }
        })

        if (!assignedUser) {
          throw new ApiError(404, 'Assigned user not found')
        }
      }

      const updatedEquipment = await prisma.equipment.update({
        where: { id: id },
        data: {
          name: validatedData.name,
          model: validatedData.model,
          serialNumber: validatedData.serialNumber,
          manufacturer: validatedData.manufacturer,
          equipmentType: validatedData.equipmentType,
          location: validatedData.location,
          status: validatedData.status,
          accuracy: validatedData.accuracy,
          precision: validatedData.precision,
          specifications: validatedData.specifications,
          notes: validatedData.notes,
          installDate: validatedData.installDate,
          assignedToId: validatedData.assignedToId
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })

      logger.info('Equipment updated', {
        equipmentId: id,
        laboratoryId: laboratoryId
      })

      res.json({
        message: 'Equipment updated successfully',
        equipment: updatedEquipment
      })
    } catch (error) {
      logger.error('Failed to update equipment:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to update equipment')
    }
  }

  async deleteEquipment(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user!

      const equipment = await prisma.equipment.findFirst({
        where: {
          id: id,
          laboratoryId: laboratoryId,
          deletedAt: null
        }
      })

      if (!equipment) {
        throw new ApiError(404, 'Equipment not found')
      }

      await prisma.equipment.update({
        where: { id: id },
        data: {
          deletedAt: new Date()
        }
      })

      logger.info('Equipment deleted', {
        equipmentId: id,
        laboratoryId: laboratoryId
      })

      res.json({ message: 'Equipment deleted successfully' })
    } catch (error) {
      logger.error('Failed to delete equipment:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to delete equipment')
    }
  }

  async getEquipmentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { laboratoryId } = req.user!

      const equipment = await prisma.equipment.findFirst({
        where: {
          id: id,
          laboratoryId: laboratoryId,
          deletedAt: null
        },
        include: {
          calibrationRecords: {
            where: { deletedAt: null },
            orderBy: { calibrationDate: 'desc' },
            take: 1
          },
          maintenanceRecords: {
            orderBy: { maintenanceDate: 'desc' },
            take: 1
          }
        }
      })

      if (!equipment) {
        throw new ApiError(404, 'Equipment not found')
      }

      const lastCalibration = equipment.calibrationRecords[0]
      const lastMaintenance = equipment.maintenanceRecords[0]

      const status = {
        equipment,
        lastCalibration,
        lastMaintenance,
        isCalibrationDue: equipment.nextCalibrationAt ? new Date() > equipment.nextCalibrationAt : false,
        daysUntilCalibration: equipment.nextCalibrationAt ? Math.ceil((equipment.nextCalibrationAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null
      }

      res.json(status)
    } catch (error) {
      logger.error('Failed to get equipment status:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to get equipment status')
    }
  }
}

export const equipmentController = new EquipmentController() 
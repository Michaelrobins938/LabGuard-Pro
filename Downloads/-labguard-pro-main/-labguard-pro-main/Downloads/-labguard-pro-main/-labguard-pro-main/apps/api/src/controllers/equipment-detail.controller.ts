import { Request, Response } from 'express'
import { PrismaClient } from '@labguard/database'

const prisma = new PrismaClient()

export const equipmentDetailController = {
  // Equipment Overview
  async getEquipmentOverview(req: Request, res: Response) {
    try {
      const { id } = req.params
      
      const equipment = await prisma.equipment.findUnique({
        where: { id },
        include: {
          laboratory: true,
          createdBy: true,
          calibrationRecords: {
            orderBy: { performedDate: 'desc' },
            take: 5,
            include: { performedBy: true }
          },
          maintenanceRecords: {
            orderBy: { performedDate: 'desc' },
            take: 5,
            include: { performedBy: true }
          },
          equipmentPhotos: {
            orderBy: { createdAt: 'desc' },
            take: 6
          },
          performanceLogs: {
            orderBy: { timestamp: 'desc' },
            take: 10
          },
          _count: {
            select: {
              calibrationRecords: true,
              maintenanceRecords: true,
              equipmentPhotos: true,
              equipmentDocuments: true,
              performanceLogs: true
            }
          }
        }
      })

      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' })
      }

      // Calculate health score
      const healthScore = calculateHealthScore(equipment)

      // Get recent activity
      const recentActivity = await getRecentActivity(equipment.id)

      res.json({
        equipment,
        healthScore,
        recentActivity
      })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch equipment overview' })
    }
  },

  // Equipment Analytics
  async getEquipmentAnalytics(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { period = '30d' } = req.query

      const equipment = await prisma.equipment.findUnique({
        where: { id },
        include: {
          calibrationRecords: {
            where: {
              performedDate: {
                gte: getDateFromPeriod(period as string)
              }
            },
            orderBy: { performedDate: 'asc' }
          },
          maintenanceRecords: {
            where: {
              performedDate: {
                gte: getDateFromPeriod(period as string)
              }
            },
            orderBy: { performedDate: 'asc' }
          },
          performanceLogs: {
            where: {
              timestamp: {
                gte: getDateFromPeriod(period as string)
              }
            },
            orderBy: { timestamp: 'asc' }
          }
        }
      })

      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' })
      }

      // Calculate analytics
      const analytics = {
        uptime: calculateUptime(equipment),
        performance: calculatePerformanceMetrics(equipment),
        costs: calculateCostAnalysis(equipment),
        trends: calculateTrends(equipment),
        predictions: generatePredictions(equipment)
      }

      res.json(analytics)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch equipment analytics' })
    }
  },

  // Equipment Maintenance
  async getEquipmentMaintenance(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { page = 1, limit = 10 } = req.query

      const equipment = await prisma.equipment.findUnique({
        where: { id },
        include: {
          maintenanceRecords: {
            orderBy: { performedDate: 'desc' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            include: { performedBy: true }
          },
          _count: {
            select: { maintenanceRecords: true }
          }
        }
      })

      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' })
      }

      const total = equipment._count.maintenanceRecords

      res.json({
        equipment,
        maintenanceRecords: equipment.maintenanceRecords,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch maintenance records' })
    }
  },

  // Equipment Documents
  async getEquipmentDocuments(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { category, search } = req.query

      const where: any = { equipmentId: id }
      if (category) where.category = category
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      const documents = await prisma.equipmentDocument.findMany({
        where,
        include: { uploadedBy: true },
        orderBy: { createdAt: 'desc' }
      })

      res.json(documents)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch documents' })
    }
  },

  async uploadDocument(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { title, description, category, version } = req.body
      const file = req.file

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const document = await prisma.equipmentDocument.create({
        data: {
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: file.path,
          title,
          description,
          category: category as any,
          version: version || '1.0',
          equipmentId: id,
          uploadedById: req.user?.id || ''
        },
        include: { uploadedBy: true }
      })

      res.json(document)
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload document' })
    }
  },

  // Equipment Photos
  async getEquipmentPhotos(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { category } = req.query

      const where: any = { equipmentId: id }
      if (category) where.category = category

      const photos = await prisma.equipmentPhoto.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })

      res.json(photos)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch photos' })
    }
  },

  async uploadPhoto(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { caption, category } = req.body
      const file = req.file

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const photo = await prisma.equipmentPhoto.create({
        data: {
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: file.path,
          caption,
          category: category as any,
          equipmentId: id
        }
      })

      res.json(photo)
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload photo' })
    }
  },

  // Equipment Settings
  async getEquipmentSettings(req: Request, res: Response) {
    try {
      const { id } = req.params

      const equipment = await prisma.equipment.findUnique({
        where: { id },
        include: {
          equipmentRelations: {
            include: {
              targetEquipment: true
            }
          }
        }
      })

      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' })
      }

      res.json(equipment)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch equipment settings' })
    }
  },

  async updateEquipmentSettings(req: Request, res: Response) {
    try {
      const { id } = req.params
      const updateData = req.body

      const equipment = await prisma.equipment.update({
        where: { id },
        data: updateData,
        include: {
          equipmentRelations: {
            include: {
              targetEquipment: true
            }
          }
        }
      })

      res.json(equipment)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update equipment settings' })
    }
  },

  // QR Code Generation
  async generateQRCode(req: Request, res: Response) {
    try {
      const { id } = req.params

      const equipment = await prisma.equipment.findUnique({
        where: { id }
      })

      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' })
      }

      // Generate QR code data
      const qrData = {
        id: equipment.id,
        name: equipment.name,
        serialNumber: equipment.serialNumber,
        type: equipment.equipmentType
      }

      // In a real implementation, you would generate an actual QR code
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`

      // Update equipment with QR code
      await prisma.equipment.update({
        where: { id },
        data: { qrCode: qrCodeUrl }
      })

      res.json({ qrCodeUrl })
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate QR code' })
    }
  },

  // Performance Logging
  async logPerformance(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { metric, value, unit, status, notes } = req.body

      const performanceLog = await prisma.performanceLog.create({
        data: {
          equipmentId: id,
          timestamp: new Date(),
          metric,
          value: parseFloat(value),
          unit,
          status: status as any,
          notes,
          recordedById: req.user?.id
        }
      })

      res.json(performanceLog)
    } catch (error) {
      res.status(500).json({ error: 'Failed to log performance' })
    }
  },

  // Equipment Relations
  async getEquipmentRelations(req: Request, res: Response) {
    try {
      const { id } = req.params

      const relations = await prisma.equipmentRelation.findMany({
        where: {
          OR: [
            { sourceEquipmentId: id },
            { targetEquipmentId: id }
          ]
        },
        include: {
          sourceEquipment: true,
          targetEquipment: true
        }
      })

      res.json(relations)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch equipment relations' })
    }
  },

  async createEquipmentRelation(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { targetEquipmentId, type, description } = req.body

      const relation = await prisma.equipmentRelation.create({
        data: {
          sourceEquipmentId: id,
          targetEquipmentId,
          type: type as any,
          description
        },
        include: {
          sourceEquipment: true,
          targetEquipment: true
        }
      })

      res.json(relation)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create equipment relation' })
    }
  }
}

// Helper functions
function calculateHealthScore(equipment: any): number {
  let score = 100

  // Deduct points for overdue calibrations
  const overdueCalibrations = equipment.calibrationRecords.filter(
    (cal: any) => cal.status === 'OVERDUE'
  ).length
  score -= overdueCalibrations * 10

  // Deduct points for overdue maintenance
  const overdueMaintenance = equipment.maintenanceRecords.filter(
    (main: any) => main.status === 'OVERDUE'
  ).length
  score -= overdueMaintenance * 15

  // Deduct points for poor performance
  const poorPerformance = equipment.performanceLogs.filter(
    (log: any) => log.status === 'POOR' || log.status === 'FAILED'
  ).length
  score -= poorPerformance * 5

  return Math.max(0, score)
}

async function getRecentActivity(equipmentId: string) {
  const activities = []

  // Get recent calibrations
  const calibrations = await prisma.calibrationRecord.findMany({
    where: { equipmentId },
    orderBy: { performedDate: 'desc' },
    take: 5,
    include: { performedBy: true }
  })

  // Get recent maintenance
  const maintenance = await prisma.maintenanceRecord.findMany({
    where: { equipmentId },
    orderBy: { performedDate: 'desc' },
    take: 5,
    include: { performedBy: true }
  })

  // Get recent performance logs
  const performance = await prisma.performanceLog.findMany({
    where: { equipmentId },
    orderBy: { timestamp: 'desc' },
    take: 5
  })

  activities.push(...calibrations.map(c => ({ ...c, type: 'calibration' })))
  activities.push(...maintenance.map(m => ({ ...m, type: 'maintenance' })))
  activities.push(...performance.map(p => ({ ...p, type: 'performance' })))

  return activities.sort((a, b) => {
    const dateA = a.performedDate || a.timestamp
    const dateB = b.performedDate || b.timestamp
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  }).slice(0, 10)
}

function getDateFromPeriod(period: string): Date {
  const now = new Date()
  switch (period) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

function calculateUptime(equipment: any): number {
  // Mock calculation - in real app this would use actual downtime data
  return 98.5
}

function calculatePerformanceMetrics(equipment: any): any {
  const logs = equipment.performanceLogs
  if (logs.length === 0) return {}

  const metrics = {}
  const metricGroups = {}

  logs.forEach((log: any) => {
    if (!metrics[log.metric]) {
      metrics[log.metric] = []
    }
    metrics[log.metric].push(log.value)
  })

  Object.keys(metrics).forEach(metric => {
    const values = metrics[metric]
    metricGroups[metric] = {
      average: values.reduce((a: number, b: number) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      trend: calculateTrend(values)
    }
  })

  return metricGroups
}

function calculateCostAnalysis(equipment: any): any {
  // Mock cost analysis
  return {
    purchaseCost: equipment.purchasePrice || 0,
    maintenanceCost: 1500,
    calibrationCost: 800,
    operatingCost: 2400,
    totalCost: (equipment.purchasePrice || 0) + 4700,
    costPerYear: 4700,
    roi: 85.2
  }
}

function calculateTrends(equipment: any): any {
  // Mock trend analysis
  return {
    performance: 'stable',
    reliability: 'improving',
    efficiency: 'stable',
    maintenance: 'decreasing'
  }
}

function generatePredictions(equipment: any): any {
  // Mock predictions
  return {
    nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    nextCalibration: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    estimatedLifespan: '5-7 years',
    replacementRecommendation: '2026-2027'
  }
}

function calculateTrend(values: number[]): string {
  if (values.length < 2) return 'stable'
  
  const recent = values.slice(-5)
  const older = values.slice(0, -5)
  
  if (recent.length === 0 || older.length === 0) return 'stable'
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
  
  const change = ((recentAvg - olderAvg) / olderAvg) * 100
  
  if (change > 5) return 'increasing'
  if (change < -5) return 'decreasing'
  return 'stable'
} 
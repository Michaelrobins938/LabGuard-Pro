import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.middleware'
import PDFDocument from 'pdfkit'
import { AuditLogService } from '../services/AuditLogService'

const router = express.Router()
const prisma = new PrismaClient()
const auditLog = new AuditLogService(prisma)

// Get all reports
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, equipmentId } = req.query
    const userId = (req as any).user.userId

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    // Build where clause
    const where: any = {
      laboratoryId: user.laboratoryId
    }

    if (type) where.type = type
    if (status) where.status = status
    if (equipmentId) where.equipmentId = equipmentId

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    // Get reports with pagination - temporarily disabled
    const reports: any[] = []
    const total = 0

    res.json({
      reports,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Reports fetch error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Get single report
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    // Temporarily disabled
    const report = null

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    res.json({ report })
  } catch (error) {
    console.error('Report fetch error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Create new report
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const {
      title,
      description,
      type,
      equipmentId,
      findings,
      recommendations,
      attachments
    } = req.body

    // Validate required fields
    if (!title || !description || !type) {
      return res.status(400).json({ error: 'Title, description, and type are required' })
    }

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    const report = await prisma.report.create({
      data: {
        title,
        description,
        type,
        equipmentId,
        findings,
        recommendations,
        status: 'DRAFT',
        laboratoryId: user.laboratoryId,
        createdById: userId,
        attachments
      }
    })

    await auditLog.log({
      action: 'REPORT_CREATED',
      entity: 'Report',
      laboratoryId: user.laboratoryId,
      userId,
      entityId: report.id,
      details: { title }
    })

    res.status(201).json({
      message: 'Report created successfully',
      report
    })
  } catch (error) {
    console.error('Report creation error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Update report
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId
    const {
      title,
      description,
      findings,
      recommendations,
      status,
      attachments
    } = req.body

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    // Check if report exists and belongs to user's laboratory
    const existingReport = await prisma.report.findFirst({
      where: {
        id,
        laboratoryId: user.laboratoryId
      }
    })

    if (!existingReport) {
      return res.status(404).json({ error: 'Report not found' })
    }

    // Update report
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        title,
        description,
        findings,
        recommendations,
        status,
        attachments: attachments ?? existingReport.attachments,
        updatedAt: new Date()
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            serialNumber: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    await auditLog.log({
      action: 'REPORT_UPDATED',
      entity: 'Report',
      laboratoryId: user.laboratoryId,
      userId,
      entityId: updatedReport.id,
      details: { status }
    })

    res.json({
      message: 'Report updated successfully',
      report: updatedReport
    })
  } catch (error) {
    console.error('Report update error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete report
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    const existingReport = await prisma.report.findFirst({
      where: { id, laboratoryId: user.laboratoryId }
    })
    if (!existingReport) return res.status(404).json({ error: 'Report not found' })

    await prisma.report.update({ where: { id }, data: { deletedAt: new Date(), status: 'DELETED' as any } })

    await auditLog.log({
      action: 'REPORT_DELETED',
      entity: 'Report',
      laboratoryId: user.laboratoryId,
      userId,
      entityId: id
    })

    res.json({ message: 'Report deleted successfully' })
  } catch (error) {
    console.error('Report deletion error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Generate report PDF
router.post('/:id/generate-pdf', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    const report = await prisma.report.findFirst({
      where: { id, laboratoryId: user.laboratoryId },
      include: { equipment: true, laboratory: true, createdBy: true }
    })

    if (!report) return res.status(404).json({ error: 'Report not found' })

    // Generate PDF in-memory
    const doc = new PDFDocument()
    const buffers: Buffer[] = []
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers)
      res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdfBuffer.length })
      res.send(pdfBuffer)
    })

    doc.fontSize(20).text(report.title, { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).text(`Report ID: ${report.id}`)
    doc.text(`Type: ${report.type}`)
    doc.text(`Status: ${report.status}`)
    doc.text(`Laboratory: ${report.laboratory.name}`)
    if (report.equipment) doc.text(`Equipment: ${report.equipment.name} (${report.equipment.serialNumber})`)
    doc.moveDown()
    doc.text('Description:', { underline: true })
    doc.text(report.description || '—')
    doc.moveDown()
    doc.text('Findings:', { underline: true })
    doc.text(report.findings || '—')
    doc.moveDown()
    doc.text('Recommendations:', { underline: true })
    doc.text(report.recommendations || '—')
    doc.end()

    await auditLog.log({
      action: 'REPORT_PDF_GENERATED',
      entity: 'Report',
      laboratoryId: user.laboratoryId,
      userId,
      entityId: id
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Get report statistics
router.get('/stats/overview', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    // Get report statistics - temporarily disabled
    const [
      totalReports,
      draftReports,
      completedReports,
      pendingReports,
      reportsByType
    ] = [0, 0, 0, 0, []]

    res.json({
      stats: {
        total: totalReports,
        draft: draftReports,
        completed: completedReports,
        pending: pendingReports,
        byType: (reportsByType as any).map((item: any) => ({
          type: item.type,
          count: item._count?.type ?? 0
        }))
      }
    })
  } catch (error) {
    console.error('Report stats error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router 
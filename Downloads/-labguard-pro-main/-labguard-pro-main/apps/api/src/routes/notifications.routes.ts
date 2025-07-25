import express from 'express'
import { z } from 'zod'
import { notificationService } from '../services/NotificationService'
import { authMiddleware } from '../middleware/auth.middleware'
import { logger } from '../utils/logger'

const router = express.Router()

// Validation schemas
const sendNotificationSchema = z.object({
  type: z.enum(['calibration_due', 'calibration_completed', 'equipment_alert', 'compliance_failure', 'payment_failed', 'trial_ending', 'subscription_expired']),
  title: z.string().min(1),
  message: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  channels: z.array(z.enum(['email', 'sms', 'in_app'])).min(1),
  metadata: z.record(z.any()).optional()
})

const complianceFailureSchema = z.object({
  equipmentName: z.string(),
  failureReason: z.string()
})

const paymentFailureSchema = z.object({
  amount: z.number().positive(),
  reason: z.string()
})

/**
 * @route GET /api/notifications
 * @desc Get user notifications
 * @access Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user?.id
    const { limit = 50 } = req.query

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required'
      })
    }

    const notifications = await notificationService.getUserNotifications(
      userId,
      parseInt(limit as string)
    )

    res.json({
      success: true,
      data: notifications
    })
  } catch (error) {
    logger.error('Failed to get notifications:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve notifications'
    })
  }
})

/**
 * @route POST /api/notifications
 * @desc Send a notification
 * @access Private
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, title, message, priority, channels, metadata } = sendNotificationSchema.parse(req.body)
    const userId = (req as any).user?.id
    const laboratoryId = (req as any).user?.laboratoryId

    if (!userId || !laboratoryId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and Laboratory ID required'
      })
    }

    await notificationService.sendNotification({
      userId,
      laboratoryId,
      type,
      title,
      message,
      priority,
      metadata,
      channels
    })

    res.json({
      success: true,
      message: 'Notification sent successfully'
    })
  } catch (error) {
    logger.error('Failed to send notification:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send notification'
    })
  }
})

/**
 * @route POST /api/notifications/compliance-failure
 * @desc Send compliance failure notification
 * @access Private
 */
router.post('/compliance-failure', authMiddleware, async (req, res) => {
  try {
    const { equipmentName, failureReason } = complianceFailureSchema.parse(req.body)
    const userId = (req as any).user?.id
    const laboratoryId = (req as any).user?.laboratoryId

    if (!userId || !laboratoryId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and Laboratory ID required'
      })
    }

    await notificationService.sendComplianceFailureNotification(
      userId,
      laboratoryId,
      equipmentName,
      failureReason
    )

    res.json({
      success: true,
      message: 'Compliance failure notification sent'
    })
  } catch (error) {
    logger.error('Failed to send compliance failure notification:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send notification'
    })
  }
})

/**
 * @route POST /api/notifications/payment-failure
 * @desc Send payment failure notification
 * @access Private
 */
router.post('/payment-failure', authMiddleware, async (req, res) => {
  try {
    const { amount, reason } = paymentFailureSchema.parse(req.body)
    const userId = (req as any).user?.id
    const laboratoryId = (req as any).user?.laboratoryId

    if (!userId || !laboratoryId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and Laboratory ID required'
      })
    }

    await notificationService.sendPaymentFailureNotification(
      userId,
      laboratoryId,
      amount,
      reason
    )

    res.json({
      success: true,
      message: 'Payment failure notification sent'
    })
  } catch (error) {
    logger.error('Failed to send payment failure notification:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send notification'
    })
  }
})

/**
 * @route PUT /api/notifications/:id/read
 * @desc Mark notification as read
 * @access Private
 */
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required'
      })
    }

    // Verify user owns this notification
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()

    const notification = await prisma.notification.findFirst({
      where: { id, userId }
    })

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      })
    }

    await notificationService.markAsRead(id)

    res.json({
      success: true,
      message: 'Notification marked as read'
    })
  } catch (error) {
    logger.error('Failed to mark notification as read:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read'
    })
  }
})

/**
 * @route DELETE /api/notifications/:id
 * @desc Delete notification
 * @access Private
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required'
      })
    }

    // Verify user owns this notification
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()

    const notification = await prisma.notification.findFirst({
      where: { id, userId }
    })

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      })
    }

    await notificationService.deleteNotification(id)

    res.json({
      success: true,
      message: 'Notification deleted'
    })
  } catch (error) {
    logger.error('Failed to delete notification:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification'
    })
  }
})

/**
 * @route POST /api/notifications/send-calibration-due
 * @desc Send calibration due notifications (admin only)
 * @access Private
 */
router.post('/send-calibration-due', authMiddleware, async (req, res) => {
  try {
    const userRole = (req as any).user?.role

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      })
    }

    await notificationService.sendCalibrationDueNotifications()

    res.json({
      success: true,
      message: 'Calibration due notifications sent'
    })
  } catch (error) {
    logger.error('Failed to send calibration due notifications:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send notifications'
    })
  }
})

/**
 * @route POST /api/notifications/send-trial-ending
 * @desc Send trial ending notifications (admin only)
 * @access Private
 */
router.post('/send-trial-ending', authMiddleware, async (req, res) => {
  try {
    const userRole = (req as any).user?.role

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      })
    }

    await notificationService.sendTrialEndingNotifications()

    res.json({
      success: true,
      message: 'Trial ending notifications sent'
    })
  } catch (error) {
    logger.error('Failed to send trial ending notifications:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send notifications'
    })
  }
})

/**
 * @route GET /api/notifications/unread-count
 * @desc Get unread notification count
 * @access Private
 */
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required'
      })
    }

    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()

    const count = await prisma.notification.count({
      where: {
        userId,
        readAt: null
      }
    })

    res.json({
      success: true,
      data: { count }
    })
  } catch (error) {
    logger.error('Failed to get unread count:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get unread count'
    })
  }
})

export default router 
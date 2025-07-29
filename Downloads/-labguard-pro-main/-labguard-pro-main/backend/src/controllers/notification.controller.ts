import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'
import twilio from 'twilio'
import { z } from 'zod'
import { logger } from '../utils/logger'
import { ApiError } from '../utils/errors'

const prisma = new PrismaClient()

// Email transporter
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,
  port: parseInt(process.env.SMTP_PORT as string ?? '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string,
  },
})

// Twilio client
const twilioClient = twilio(
  (process.env.TWILIO_ACCOUNT_SID as string) ?? '',
  (process.env.TWILIO_AUTH_TOKEN as string) ?? ''
)

// Validation schemas
const createNotificationSchema = z.object({
  userId: z.string().cuid(),
  type: z.enum(['CALIBRATION_DUE', 'CALIBRATION_OVERDUE', 'MAINTENANCE_DUE', 'SYSTEM_ALERT', 'USER_INVITE', 'SUBSCRIPTION_UPDATE']),
  title: z.string().min(1),
  message: z.string().min(1),
  metadata: z.record(z.any()).optional()
})

const sendNotificationSchema = z.object({
  notificationId: z.string().cuid(),
  channels: z.array(z.enum(['email', 'sms', 'push'])).min(1)
})

export class NotificationController {
  /**
   * Create a new notification
   */
  async createNotification(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const validatedData = createNotificationSchema.parse(req.body)

      // Verify user belongs to laboratory
      const user = await prisma.user.findFirst({
        where: {
          id: validatedData.userId,
          laboratoryId: laboratoryId
        }
      })

      if (!user) {
        throw new ApiError(404, 'User not found')
      }

      const notification = await prisma.notification.create({
        data: {
          userId: validatedData.userId,
          laboratoryId: (req.user as any).laboratoryId,
          type: validatedData.type,
          title: validatedData.title,
          message: validatedData.message,
          metadata: validatedData.metadata
        }
      })

      logger.info('Notification created', {
        notificationId: notification.id,
        userId: validatedData.userId,
        type: validatedData.type
      })

      res.status(201).json({
        message: 'Notification created successfully',
        notification
      })

    } catch (error) {
      logger.error('Failed to create notification:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to create notification')
    }
  }

  /**
   * Send notification through specified channels
   */
  async sendNotification(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const validatedData = sendNotificationSchema.parse(req.body)

      const notification = await prisma.notification.findFirst({
        where: {
          id: validatedData.notificationId,
          user: { laboratoryId: laboratoryId }
        },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      })

      if (!notification) {
        throw new ApiError(404, 'Notification not found')
      }

      const results = await Promise.allSettled(
        validatedData.channels.map(channel => this.sendToChannel(channel, notification))
      )

      const successCount = results.filter(r => r.status === 'fulfilled').length
      const failureCount = results.filter(r => r.status === 'rejected').length

      logger.info('Notification sent', {
        notificationId: notification.id,
        channels: validatedData.channels,
        successCount,
        failureCount
      })

      res.json({
        message: 'Notification sent',
        results: {
          successCount,
          failureCount,
          details: results.map((result, index) => ({
            channel: validatedData.channels[index],
            success: result.status === 'fulfilled',
            error: result.status === 'rejected' ? (result as any).reason : null
          }))
        }
      })

    } catch (error) {
      logger.error('Failed to send notification:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to send notification')
    }
  }

  /**
   * Get notifications for user
   */
  async getNotifications(req: Request, res: Response) {
    try {
      const { userId } = req.user as any
      const { page = 1, limit = 20, unreadOnly = false } = req.query

      const where: any = { userId }
      if (unreadOnly === 'true') {
        where.isRead = false
      }

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit)
        }),
        prisma.notification.count({ where })
      ])

      res.json({
        notifications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })

    } catch (error) {
      logger.error('Failed to get notifications:', error)
      throw new ApiError(500, 'Failed to get notifications')
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const { userId } = req.user as any
      const { notificationId } = req.params

      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId: userId
        }
      })

      if (!notification) {
        throw new ApiError(404, 'Notification not found')
      }

      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      })

      res.json({ message: 'Notification marked as read' })

    } catch (error) {
      logger.error('Failed to mark notification as read:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to mark notification as read')
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(req: Request, res: Response) {
    try {
      const { userId } = req.user as any

      await prisma.notification.updateMany({
        where: {
          userId: userId,
          isRead: false
        },
        data: { isRead: true }
      })

      res.json({ message: 'All notifications marked as read' })

    } catch (error) {
      logger.error('Failed to mark all notifications as read:', error)
      throw new ApiError(500, 'Failed to mark all notifications as read')
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(req: Request, res: Response) {
    try {
      const { userId } = req.user as any
      const { notificationId } = req.params

      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId: userId
        }
      })

      if (!notification) {
        throw new ApiError(404, 'Notification not found')
      }

      await prisma.notification.delete({
        where: { id: notificationId }
      })

      res.json({ message: 'Notification deleted' })

    } catch (error) {
      logger.error('Failed to delete notification:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to delete notification')
    }
  }

  /**
   * Send notification to specific channel
   */
  private async sendToChannel(channel: string, notification: any) {
    switch (channel) {
      case 'email':
        return this.sendEmail(notification)
      case 'sms':
        return this.sendSMS(notification)
      case 'push':
        return this.sendPushNotification(notification)
      default:
        throw new Error(`Unsupported channel: ${channel}`)
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(notification: any) {
    const { user } = notification
    
    const emailContent = this.generateEmailContent(notification)
    
    await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@labguard.com',
      to: user.email,
      subject: notification.title,
      html: emailContent.html,
      text: emailContent.text
    })

    logger.info('Email sent', {
      notificationId: notification.id,
      to: user.email
    })
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(notification: any) {
    const { user } = notification
    
    if (!user.phone) {
      throw new Error('User phone number not available')
    }

    await twilioClient.messages.create({
      body: `${notification.title}: ${notification.message}`,
      from: (process.env.TWILIO_PHONE_NUMBER as string) ?? '',
      to: user.phone
    })

    logger.info('SMS sent', {
      notificationId: notification.id,
      to: user.phone
    })
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(notification: any) {
    // Implementation would depend on your push notification service
    // (Firebase, OneSignal, etc.)
    logger.info('Push notification sent', {
      notificationId: notification.id
    })
  }

  /**
   * Generate email content
   */
  private generateEmailContent(notification: any) {
    const { user } = notification
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${notification.title}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">${notification.title}</h2>
            <p>${notification.message}</p>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              This notification was sent to ${user.firstName} ${user.lastName} (${user.email})
            </p>
          </div>
        </body>
      </html>
    `

    const text = `
      ${notification.title}
      
      ${notification.message}
      
      This notification was sent to ${user.firstName} ${user.lastName} (${user.email})
    `

    return { html, text }
  }
}

export const notificationController = new NotificationController() 
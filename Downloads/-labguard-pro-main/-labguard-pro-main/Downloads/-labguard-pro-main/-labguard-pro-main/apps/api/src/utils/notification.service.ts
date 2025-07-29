import { PrismaClient } from '@labguard/database'
import { logger } from './logger'
import nodemailer from 'nodemailer'
import twilio from 'twilio'

const prisma = new PrismaClient()

interface NotificationData {
  id: string
  type: string
  title: string
  message: string
  priority: string
  userId: string
  templateId?: string
  metadata?: any
}

interface UserData {
  id: string
  name?: string
  email: string
  phone?: string
  notificationPreference?: {
    emailEnabled: boolean
    smsEnabled: boolean
    inAppEnabled: boolean
    browserEnabled: boolean
    quietHoursStart?: string
    quietHoursEnd?: string
    timezone: string
  }
}

export class NotificationService {
  private emailTransporter: nodemailer.Transporter
  private twilioClient: twilio.Twilio

  constructor() {
    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    // Initialize Twilio client
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      )
    }
  }

  // Process notification delivery
  async processNotification(notificationId: string): Promise<void> {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
        include: {
          user: {
            include: {
              notificationPreference: true
            }
          }
        }
      })

      if (!notification) {
        throw new Error(`Notification ${notificationId} not found`)
      }

      const user = notification.user
      const preferences = user.notificationPreference

      // Check if user has preferences, create defaults if not
      if (!preferences) {
        await prisma.notificationPreference.create({
          data: {
            userId: user.id,
            emailEnabled: true,
            smsEnabled: false,
            inAppEnabled: true,
            browserEnabled: true,
            frequency: 'IMMEDIATE',
            emergencyOverride: true
          }
        })
      }

      // Check quiet hours
      if (this.isInQuietHours(preferences)) {
        if (notification.priority !== 'CRITICAL' || !preferences?.emergencyOverride) {
          logger.info(`Notification ${notificationId} suppressed due to quiet hours`)
          return
        }
      }

      const deliveryPromises: Promise<void>[] = []

      // Email delivery
      if (preferences?.emailEnabled && user.email) {
        deliveryPromises.push(this.sendEmail(notification, user))
      }

      // SMS delivery
      if (preferences?.smsEnabled && user.phone) {
        deliveryPromises.push(this.sendSMS(notification, user))
      }

      // In-app notification (always enabled)
      deliveryPromises.push(this.updateInAppNotification(notification))

      // Browser notification
      if (preferences?.browserEnabled) {
        deliveryPromises.push(this.sendBrowserNotification(notification, user))
      }

      await Promise.allSettled(deliveryPromises)

      // Update notification status
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          sentAt: new Date(),
          deliveryStatus: 'SENT'
        }
      })

      // Create history record
      await prisma.notificationHistory.create({
        data: {
          notificationId,
          action: 'SENT',
          metadata: { channels: preferences ? Object.keys(preferences).filter(k => k.endsWith('Enabled') && preferences[k as keyof typeof preferences]) : ['in_app'] }
        }
      })

    } catch (error) {
      logger.error(`Error processing notification ${notificationId}:`, error)
      
      // Update notification status to failed
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          failedAt: new Date(),
          deliveryStatus: 'FAILED'
        }
      })

      // Create history record
      await prisma.notificationHistory.create({
        data: {
          notificationId,
          action: 'FAILED',
          metadata: { error: error.message }
        }
      })
    }
  }

  // Send email notification
  private async sendEmail(notification: any, user: UserData): Promise<void> {
    try {
      let template = null
      if (notification.templateId) {
        template = await prisma.notificationTemplate.findUnique({
          where: { id: notification.templateId }
        })
      }

      const subject = template?.subject || notification.title
      const htmlBody = template?.htmlBody || this.renderEmailTemplate(notification)
      const textBody = template?.body || notification.message

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@labguardpro.com',
        to: user.email,
        subject,
        text: textBody,
        html: htmlBody
      }

      const result = await this.emailTransporter.sendMail(mailOptions)

      logger.info(`Email sent to ${user.email} for notification ${notification.id}`)

      // Create history record
      await prisma.notificationHistory.create({
        data: {
          notificationId: notification.id,
          action: 'DELIVERED',
          metadata: { channel: 'email', messageId: result.messageId }
        }
      })

    } catch (error) {
      logger.error(`Error sending email to ${user.email}:`, error)
      throw error
    }
  }

  // Send SMS notification
  private async sendSMS(notification: any, user: UserData): Promise<void> {
    try {
      if (!this.twilioClient || !user.phone) {
        throw new Error('SMS not configured or user has no phone number')
      }

      let template = null
      if (notification.templateId) {
        template = await prisma.notificationTemplate.findUnique({
          where: { id: notification.templateId }
        })
      }

      const message = template?.smsBody || notification.message

      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phone
      })

      logger.info(`SMS sent to ${user.phone} for notification ${notification.id}`)

      // Create history record
      await prisma.notificationHistory.create({
        data: {
          notificationId: notification.id,
          action: 'DELIVERED',
          metadata: { channel: 'sms', messageId: result.sid }
        }
      })

    } catch (error) {
      logger.error(`Error sending SMS to ${user.phone}:`, error)
      throw error
    }
  }

  // Update in-app notification
  private async updateInAppNotification(notification: any): Promise<void> {
    try {
      // In-app notifications are already stored in the database
      // This method can be used for real-time updates via WebSocket
      logger.info(`In-app notification updated for ${notification.id}`)

      // Create history record
      await prisma.notificationHistory.create({
        data: {
          notificationId: notification.id,
          action: 'DELIVERED',
          metadata: { channel: 'in_app' }
        }
      })

    } catch (error) {
      logger.error(`Error updating in-app notification ${notification.id}:`, error)
      throw error
    }
  }

  // Send browser notification (placeholder for WebSocket implementation)
  private async sendBrowserNotification(notification: any, user: UserData): Promise<void> {
    try {
      // This would typically be handled by WebSocket connections
      // For now, we'll just log it
      logger.info(`Browser notification queued for ${user.id} - ${notification.title}`)

      // Create history record
      await prisma.notificationHistory.create({
        data: {
          notificationId: notification.id,
          action: 'SENT',
          metadata: { channel: 'browser' }
        }
      })

    } catch (error) {
      logger.error(`Error sending browser notification for ${notification.id}:`, error)
      throw error
    }
  }

  // Render email template
  private renderEmailTemplate(notification: any): string {
    const template = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>LabGuard Pro Notification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .priority-high { border-left: 4px solid #dc2626; }
            .priority-critical { border-left: 4px solid #dc2626; background: #fef2f2; }
            .priority-normal { border-left: 4px solid #2563eb; }
            .priority-low { border-left: 4px solid #059669; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>LabGuard Pro</h1>
            </div>
            <div class="content priority-${notification.priority.toLowerCase()}">
              <h2>${notification.title}</h2>
              <p>${notification.message}</p>
              <p><strong>Type:</strong> ${notification.type}</p>
              <p><strong>Priority:</strong> ${notification.priority}</p>
              <p><strong>Time:</strong> ${new Date(notification.createdAt).toLocaleString()}</p>
            </div>
            <div class="footer">
              <p>This is an automated notification from LabGuard Pro</p>
              <p>© ${new Date().getFullYear()} LabGuard Pro. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    return template
  }

  // Check if current time is in quiet hours
  private isInQuietHours(preferences: any): boolean {
    if (!preferences?.quietHoursStart || !preferences?.quietHoursEnd) {
      return false
    }

    const now = new Date()
    const userTimezone = preferences.timezone || 'UTC'
    
    // Convert current time to user's timezone
    const userTime = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }))
    const currentTime = userTime.getHours() * 60 + userTime.getMinutes()

    const [startHour, startMinute] = preferences.quietHoursStart.split(':').map(Number)
    const [endHour, endMinute] = preferences.quietHoursEnd.split(':').map(Number)
    
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime
    }
  }

  // Create notification from template
  async createNotificationFromTemplate(
    templateId: string,
    userId: string,
    variables: Record<string, any> = {}
  ): Promise<string> {
    try {
      const template = await prisma.notificationTemplate.findUnique({
        where: { id: templateId }
      })

      if (!template) {
        throw new Error(`Template ${templateId} not found`)
      }

      // Replace variables in template
      const title = this.replaceVariables(template.subject, variables)
      const message = this.replaceVariables(template.body, variables)
      const htmlBody = this.replaceVariables(template.htmlBody, variables)
      const smsBody = template.smsBody ? this.replaceVariables(template.smsBody, variables) : null

      const notification = await prisma.notification.create({
        data: {
          type: template.type,
          title,
          message,
          templateId,
          userId,
          metadata: { variables }
        }
      })

      // Process the notification
      await this.processNotification(notification.id)

      return notification.id
    } catch (error) {
      logger.error(`Error creating notification from template ${templateId}:`, error)
      throw error
    }
  }

  // Replace variables in template
  private replaceVariables(text: string, variables: Record<string, any>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match
    })
  }

  // Schedule notification for later delivery
  async scheduleNotification(
    type: string,
    title: string,
    message: string,
    userId: string,
    scheduledFor: Date,
    priority: string = 'NORMAL'
  ): Promise<string> {
    try {
      const notification = await prisma.notification.create({
        data: {
          type,
          title,
          message,
          priority,
          scheduledFor,
          userId,
          deliveryStatus: 'PENDING'
        }
      })

      // Schedule the notification for processing
      // This would typically use a job queue like Bull
      setTimeout(() => {
        this.processNotification(notification.id)
      }, scheduledFor.getTime() - Date.now())

      return notification.id
    } catch (error) {
      logger.error('Error scheduling notification:', error)
      throw error
    }
  }

  // Bulk send notifications
  async sendBulkNotifications(
    notifications: Array<{
      type: string
      title: string
      message: string
      userId: string
      priority?: string
    }>
  ): Promise<string[]> {
    try {
      const createdNotifications = await prisma.notification.createMany({
        data: notifications.map(n => ({
          type: n.type,
          title: n.title,
          message: n.message,
          priority: n.priority || 'NORMAL',
          userId: n.userId,
          deliveryStatus: 'PENDING'
        }))
      })

      // Process all notifications
      const notificationIds = await prisma.notification.findMany({
        where: {
          userId: { in: notifications.map(n => n.userId) },
          title: { in: notifications.map(n => n.title) },
          createdAt: { gte: new Date(Date.now() - 1000) } // Get recently created
        },
        select: { id: true }
      })

      // Process notifications in parallel
      await Promise.allSettled(
        notificationIds.map(n => this.processNotification(n.id))
      )

      return notificationIds.map(n => n.id)
    } catch (error) {
      logger.error('Error sending bulk notifications:', error)
      throw error
    }
  }
}

export const notificationService = new NotificationService() 
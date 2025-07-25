import nodemailer from 'nodemailer'
import { PrismaClient } from '@labguard/database'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

export interface NotificationTemplate {
  id: string
  name: string
  type: 'email' | 'sms' | 'in_app'
  subject?: string
  body: string
  variables: string[]
}

export interface NotificationData {
  userId: string
  laboratoryId: string
  type: 'calibration_due' | 'calibration_completed' | 'equipment_alert' | 'compliance_failure' | 'payment_failed' | 'trial_ending' | 'subscription_expired'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  metadata?: Record<string, any>
  channels: ('email' | 'sms' | 'in_app')[]
}

export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export interface SMSConfig {
  provider: 'twilio' | 'aws_sns' | 'custom'
  accountSid?: string
  authToken?: string
  fromNumber?: string
  region?: string
  accessKeyId?: string
  secretAccessKey?: string
}

export class NotificationService {
  private emailTransporter: nodemailer.Transporter
  private smsConfig: SMSConfig
  private templates: Map<string, NotificationTemplate>

  constructor() {
    this.initializeEmailTransporter()
    this.initializeSMSConfig()
    this.loadTemplates()
  }

  /**
   * Initialize email transporter
   */
  private initializeEmailTransporter(): void {
    this.emailTransporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!
      }
    })
  }

  /**
   * Initialize SMS configuration
   */
  private initializeSMSConfig(): void {
    this.smsConfig = {
      provider: (process.env.SMS_PROVIDER as 'twilio' | 'aws_sns' | 'custom') || 'twilio',
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_FROM_NUMBER,
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  }

  /**
   * Load notification templates
   */
  private loadTemplates(): void {
    this.templates = new Map([
      ['calibration_due', {
        id: 'calibration_due',
        name: 'Calibration Due',
        type: 'email',
        subject: 'Equipment Calibration Due - LabGuard Pro',
        body: `Dear {{userName}},

This is a reminder that the following equipment requires calibration:

Equipment: {{equipmentName}}
Due Date: {{dueDate}}
Days Remaining: {{daysRemaining}}

Please schedule the calibration as soon as possible to maintain compliance.

Best regards,
LabGuard Pro Team`,
        variables: ['userName', 'equipmentName', 'dueDate', 'daysRemaining']
      }],
      ['calibration_completed', {
        id: 'calibration_completed',
        name: 'Calibration Completed',
        type: 'email',
        subject: 'Calibration Completed Successfully - LabGuard Pro',
        body: `Dear {{userName}},

The calibration for {{equipmentName}} has been completed successfully.

Calibration Details:
- Date: {{calibrationDate}}
- Technician: {{technicianName}}
- Status: {{status}}
- Compliance Score: {{complianceScore}}%

The equipment is now ready for use.

Best regards,
LabGuard Pro Team`,
        variables: ['userName', 'equipmentName', 'calibrationDate', 'technicianName', 'status', 'complianceScore']
      }],
      ['equipment_alert', {
        id: 'equipment_alert',
        name: 'Equipment Alert',
        type: 'email',
        subject: 'Equipment Alert - LabGuard Pro',
        body: `Dear {{userName}},

An alert has been triggered for {{equipmentName}}:

Alert Type: {{alertType}}
Severity: {{severity}}
Description: {{description}}
Timestamp: {{timestamp}}

Please review and take appropriate action.

Best regards,
LabGuard Pro Team`,
        variables: ['userName', 'equipmentName', 'alertType', 'severity', 'description', 'timestamp']
      }],
      ['payment_failed', {
        id: 'payment_failed',
        name: 'Payment Failed',
        type: 'email',
        subject: 'Payment Failed - LabGuard Pro',
        body: `Dear {{userName}},

We were unable to process your payment for LabGuard Pro.

Amount: {{amount}}
Due Date: {{dueDate}}
Reason: {{reason}}

Please update your payment method to avoid service interruption.

Best regards,
LabGuard Pro Team`,
        variables: ['userName', 'amount', 'dueDate', 'reason']
      }],
      ['trial_ending', {
        id: 'trial_ending',
        name: 'Trial Ending',
        type: 'email',
        subject: 'Your LabGuard Pro Trial is Ending Soon',
        body: `Dear {{userName}},

Your LabGuard Pro trial will end on {{trialEndDate}}.

To continue using our services, please upgrade to a paid plan.

Current Usage:
- Equipment Items: {{equipmentCount}}
- Compliance Checks: {{complianceChecks}}
- AI Queries: {{aiQueries}}

Upgrade now to maintain uninterrupted access.

Best regards,
LabGuard Pro Team`,
        variables: ['userName', 'trialEndDate', 'equipmentCount', 'complianceChecks', 'aiQueries']
      }]
    ])
  }

  /**
   * Send notification
   */
  async sendNotification(data: NotificationData): Promise<void> {
    try {
      // Create notification record
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          laboratoryId: data.laboratoryId,
          type: data.type,
          title: data.title,
          message: data.message,
          priority: data.priority,
          metadata: data.metadata,
          channels: data.channels,
          status: 'pending'
        }
      })

      // Send to each channel
      const promises = data.channels.map(channel => {
        switch (channel) {
          case 'email':
            return this.sendEmail(data)
          case 'sms':
            return this.sendSMS(data)
          case 'in_app':
            return this.sendInAppNotification(data)
          default:
            return Promise.resolve()
        }
      })

      await Promise.all(promises)

      // Update notification status
      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: 'sent', sentAt: new Date() }
      })

      logger.info(`Notification sent successfully: ${notification.id}`)
    } catch (error) {
      logger.error('Failed to send notification:', error)
      throw error
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(data: NotificationData): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { email: true, name: true }
      })

      if (!user?.email) {
        throw new Error('User email not found')
      }

      const template = this.templates.get(data.type)
      if (!template) {
        throw new Error(`Template not found for type: ${data.type}`)
      }

      const emailContent = this.processTemplate(template, {
        userName: user.name || 'User',
        ...data.metadata
      })

      await this.emailTransporter.sendMail({
        from: process.env.FROM_EMAIL || 'noreply@labguardpro.com',
        to: user.email,
        subject: template.subject || data.title,
        html: emailContent,
        text: this.stripHtml(emailContent)
      })

      logger.info(`Email sent to ${user.email}: ${data.type}`)
    } catch (error) {
      logger.error('Failed to send email:', error)
      throw error
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(data: NotificationData): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { phone: true }
      })

      if (!user?.phone) {
        throw new Error('User phone number not found')
      }

      switch (this.smsConfig.provider) {
        case 'twilio':
          await this.sendTwilioSMS(user.phone, data.message)
          break
        case 'aws_sns':
          await this.sendAWSSNS(user.phone, data.message)
          break
        default:
          throw new Error(`SMS provider not supported: ${this.smsConfig.provider}`)
      }

      logger.info(`SMS sent to ${user.phone}: ${data.type}`)
    } catch (error) {
      logger.error('Failed to send SMS:', error)
      throw error
    }
  }

  /**
   * Send Twilio SMS
   */
  private async sendTwilioSMS(to: string, message: string): Promise<void> {
    if (!this.smsConfig.accountSid || !this.smsConfig.authToken || !this.smsConfig.fromNumber) {
      throw new Error('Twilio configuration incomplete')
    }

    const twilio = require('twilio')(this.smsConfig.accountSid, this.smsConfig.authToken)
    
    await twilio.messages.create({
      body: message,
      from: this.smsConfig.fromNumber,
      to: to
    })
  }

  /**
   * Send AWS SNS SMS
   */
  private async sendAWSSNS(to: string, message: string): Promise<void> {
    if (!this.smsConfig.accessKeyId || !this.smsConfig.secretAccessKey || !this.smsConfig.region) {
      throw new Error('AWS SNS configuration incomplete')
    }

    const AWS = require('aws-sdk')
    const sns = new AWS.SNS({
      region: this.smsConfig.region,
      accessKeyId: this.smsConfig.accessKeyId,
      secretAccessKey: this.smsConfig.secretAccessKey
    })

    await sns.publish({
      Message: message,
      PhoneNumber: to
    }).promise()
  }

  /**
   * Send in-app notification
   */
  private async sendInAppNotification(data: NotificationData): Promise<void> {
    // In-app notifications are stored in the database and retrieved by the frontend
    // This method just ensures the notification is properly recorded
    logger.info(`In-app notification created: ${data.type}`)
  }

  /**
   * Process template with variables
   */
  private processTemplate(template: NotificationTemplate, variables: Record<string, any>): string {
    let content = template.body

    template.variables.forEach(variable => {
      const value = variables[variable] || `{{${variable}}}`
      content = content.replace(new RegExp(`{{${variable}}}`, 'g'), value)
    })

    return content
  }

  /**
   * Strip HTML tags for plain text
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '')
  }

  /**
   * Send calibration due notifications
   */
  async sendCalibrationDueNotifications(): Promise<void> {
    try {
      const dueCalibrations = await prisma.calibrationRecord.findMany({
        where: {
          dueDate: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
          },
          status: 'pending'
        },
        include: {
          equipment: {
            select: { name: true }
          },
          user: {
            select: { id: true, email: true, name: true }
          }
        }
      })

      for (const calibration of dueCalibrations) {
        const daysRemaining = Math.ceil((calibration.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

        await this.sendNotification({
          userId: calibration.userId,
          laboratoryId: calibration.equipment.laboratoryId,
          type: 'calibration_due',
          title: 'Calibration Due',
          message: `Equipment ${calibration.equipment.name} requires calibration`,
          priority: daysRemaining <= 1 ? 'critical' : daysRemaining <= 3 ? 'high' : 'medium',
          metadata: {
            equipmentName: calibration.equipment.name,
            dueDate: calibration.dueDate.toLocaleDateString(),
            daysRemaining
          },
          channels: ['email', 'in_app']
        })
      }

      logger.info(`Sent ${dueCalibrations.length} calibration due notifications`)
    } catch (error) {
      logger.error('Failed to send calibration due notifications:', error)
      throw error
    }
  }

  /**
   * Send compliance failure notifications
   */
  async sendComplianceFailureNotification(
    userId: string,
    laboratoryId: string,
    equipmentName: string,
    failureReason: string
  ): Promise<void> {
    await this.sendNotification({
      userId,
      laboratoryId,
      type: 'compliance_failure',
      title: 'Compliance Failure',
      message: `Compliance failure detected for ${equipmentName}`,
      priority: 'critical',
      metadata: {
        equipmentName,
        failureReason,
        timestamp: new Date().toISOString()
      },
      channels: ['email', 'sms', 'in_app']
    })
  }

  /**
   * Send payment failure notifications
   */
  async sendPaymentFailureNotification(
    userId: string,
    laboratoryId: string,
    amount: number,
    reason: string
  ): Promise<void> {
    await this.sendNotification({
      userId,
      laboratoryId,
      type: 'payment_failed',
      title: 'Payment Failed',
      message: 'Payment processing failed',
      priority: 'high',
      metadata: {
        amount: `$${amount.toFixed(2)}`,
        reason,
        dueDate: new Date().toLocaleDateString()
      },
      channels: ['email', 'in_app']
    })
  }

  /**
   * Send trial ending notifications
   */
  async sendTrialEndingNotifications(): Promise<void> {
    try {
      const laboratories = await prisma.laboratory.findMany({
        where: {
          trialEndsAt: {
            lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
          },
          trialEndsAt: {
            gte: new Date()
          }
        },
        include: {
          users: {
            where: { role: 'admin' },
            select: { id: true, email: true, name: true }
          }
        }
      })

      for (const laboratory of laboratories) {
        const adminUser = laboratory.users[0]
        if (!adminUser) continue

        const usage = await this.getLaboratoryUsage(laboratory.id)
        const daysRemaining = Math.ceil((laboratory.trialEndsAt!.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

        await this.sendNotification({
          userId: adminUser.id,
          laboratoryId: laboratory.id,
          type: 'trial_ending',
          title: 'Trial Ending Soon',
          message: `Your LabGuard Pro trial ends in ${daysRemaining} days`,
          priority: 'high',
          metadata: {
            trialEndDate: laboratory.trialEndsAt!.toLocaleDateString(),
            equipmentCount: usage.equipmentItems,
            complianceChecks: usage.complianceChecks,
            aiQueries: usage.aiQueries
          },
          channels: ['email', 'in_app']
        })
      }

      logger.info(`Sent ${laboratories.length} trial ending notifications`)
    } catch (error) {
      logger.error('Failed to send trial ending notifications:', error)
      throw error
    }
  }

  /**
   * Get laboratory usage statistics
   */
  private async getLaboratoryUsage(laboratoryId: string): Promise<{
    equipmentItems: number
    complianceChecks: number
    aiQueries: number
  }> {
    const [equipmentItems, complianceChecks, aiQueries] = await Promise.all([
      prisma.equipment.count({ where: { laboratoryId } }),
      prisma.calibrationRecord.count({ 
        where: { 
          equipment: { laboratoryId },
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.usageRecord.aggregate({
        where: {
          laboratoryId,
          type: 'aiQueries',
          recordedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        },
        _sum: { quantity: true }
      })
    ])

    return {
      equipmentItems,
      complianceChecks,
      aiQueries: aiQueries._sum.quantity || 0
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, limit: number = 50): Promise<any[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() }
    })
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await prisma.notification.delete({
      where: { id: notificationId }
    })
  }
}

export const notificationService = new NotificationService() 
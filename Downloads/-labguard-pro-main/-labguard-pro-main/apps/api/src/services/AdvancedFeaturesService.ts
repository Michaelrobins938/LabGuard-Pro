import { PrismaClient } from '@labguard/database';
import { createLogger } from '../utils/logger';
import * as nodemailer from 'nodemailer';
import * as twilio from 'twilio';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import * as createCsvWriter from 'csv-writer';

const prisma = new PrismaClient();
const logger = createLogger('AdvancedFeaturesService');

export interface NotificationConfig {
  email: boolean;
  sms: boolean;
  push: boolean;
  webhook: boolean;
  recipients: string[];
  template: string;
  variables: Record<string, any>;
}

export interface AnalyticsData {
  equipmentCount: number;
  calibrationCount: number;
  complianceRate: number;
  averageResponseTime: number;
  userActivity: any[];
  equipmentUtilization: any[];
  costAnalysis: any[];
  riskAssessment: any[];
}

export interface BulkOperation {
  id: string;
  type: 'IMPORT' | 'EXPORT' | 'UPDATE' | 'DELETE';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  totalItems: number;
  processedItems: number;
  errors: string[];
  result: any;
  createdAt: Date;
  completedAt?: Date;
}

export interface LIMSIntegration {
  id: string;
  name: string;
  type: 'SAMPLE_TRACKING' | 'INVENTORY_MANAGEMENT' | 'QUALITY_CONTROL' | 'REPORTING';
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  config: Record<string, any>;
  lastSync: Date;
  syncInterval: number; // in minutes
}

class AdvancedFeaturesService {
  private emailTransporter: nodemailer.Transporter;
  private twilioClient: twilio.Twilio;

  constructor() {
    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Initialize Twilio client
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  /**
   * Send real-time notifications
   */
  async sendNotification(config: NotificationConfig): Promise<void> {
    try {
      const { email, sms, push, webhook, recipients, template, variables } = config;

      const promises: Promise<any>[] = [];

      if (email) {
        promises.push(this.sendEmailNotification(recipients, template, variables));
      }

      if (sms) {
        promises.push(this.sendSMSNotification(recipients, template, variables));
      }

      if (push) {
        promises.push(this.sendPushNotification(recipients, template, variables));
      }

      if (webhook) {
        promises.push(this.sendWebhookNotification(recipients, template, variables));
      }

      await Promise.all(promises);

      logger.info(`Sent notifications to ${recipients.length} recipients`);
    } catch (error) {
      logger.error('Failed to send notifications:', error);
      throw error;
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(
    recipients: string[],
    template: string,
    variables: Record<string, any>
  ): Promise<void> {
    try {
      const emailContent = await this.renderEmailTemplate(template, variables);

      for (const recipient of recipients) {
        await this.emailTransporter.sendMail({
          from: process.env.SMTP_FROM,
          to: recipient,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        });
      }

      logger.info(`Sent email notifications to ${recipients.length} recipients`);
    } catch (error) {
      logger.error('Failed to send email notifications:', error);
      throw error;
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(
    recipients: string[],
    template: string,
    variables: Record<string, any>
  ): Promise<void> {
    try {
      const smsContent = await this.renderSMSTemplate(template, variables);

      for (const recipient of recipients) {
        await this.twilioClient.messages.create({
          body: smsContent,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: recipient
        });
      }

      logger.info(`Sent SMS notifications to ${recipients.length} recipients`);
    } catch (error) {
      logger.error('Failed to send SMS notifications:', error);
      throw error;
    }
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(
    recipients: string[],
    template: string,
    variables: Record<string, any>
  ): Promise<void> {
    try {
      const pushContent = await this.renderPushTemplate(template, variables);

      // This would integrate with your push notification service
      // For now, we'll just log the notification
      logger.info(`Push notification content: ${JSON.stringify(pushContent)}`);
      logger.info(`Would send push notifications to ${recipients.length} recipients`);
    } catch (error) {
      logger.error('Failed to send push notifications:', error);
      throw error;
    }
  }

  /**
   * Send webhook notification
   */
  private async sendWebhookNotification(
    recipients: string[],
    template: string,
    variables: Record<string, any>
  ): Promise<void> {
    try {
      const webhookContent = await this.renderWebhookTemplate(template, variables);

      for (const webhookUrl of recipients) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.WEBHOOK_SECRET}`
          },
          body: JSON.stringify(webhookContent)
        });
      }

      logger.info(`Sent webhook notifications to ${recipients.length} endpoints`);
    } catch (error) {
      logger.error('Failed to send webhook notifications:', error);
      throw error;
    }
  }

  /**
   * Generate analytics data
   */
  async generateAnalytics(laboratoryId: string, dateRange?: { start: Date; end: Date }): Promise<AnalyticsData> {
    try {
      const where: any = { laboratoryId };
      if (dateRange) {
        where.createdAt = {
          gte: dateRange.start,
          lte: dateRange.end
        };
      }

      // Get equipment count
      const equipmentCount = await prisma.equipment.count({ where });

      // Get calibration count
      const calibrationCount = await prisma.calibrationRecord.count({ where });

      // Calculate compliance rate
      const totalCalibrations = await prisma.calibrationRecord.count({ where });
      const compliantCalibrations = await prisma.calibrationRecord.count({
        where: { ...where, status: 'COMPLIANT' }
      });
      const complianceRate = totalCalibrations > 0 ? (compliantCalibrations / totalCalibrations) * 100 : 0;

      // Get user activity
      const userActivity = await prisma.user.findMany({
        where,
        include: {
          _count: {
            select: {
              calibrationRecords: true,
              equipment: true
            }
          }
        },
        orderBy: { lastLoginAt: 'desc' },
        take: 10
      });

      // Get equipment utilization
      const equipmentUtilization = await prisma.equipment.findMany({
        where,
        include: {
          _count: {
            select: {
              calibrationRecords: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: 10
      });

      // Calculate average response time (mock data)
      const averageResponseTime = 2.5; // seconds

      // Generate cost analysis
      const costAnalysis = await this.generateCostAnalysis(laboratoryId, dateRange);

      // Generate risk assessment
      const riskAssessment = await this.generateRiskAssessment(laboratoryId, dateRange);

      return {
        equipmentCount,
        calibrationCount,
        complianceRate,
        averageResponseTime,
        userActivity,
        equipmentUtilization,
        costAnalysis,
        riskAssessment
      };
    } catch (error) {
      logger.error('Failed to generate analytics:', error);
      throw error;
    }
  }

  /**
   * Generate cost analysis
   */
  private async generateCostAnalysis(laboratoryId: string, dateRange?: { start: Date; end: Date }): Promise<any[]> {
    try {
      const where: any = { laboratoryId };
      if (dateRange) {
        where.createdAt = {
          gte: dateRange.start,
          lte: dateRange.end
        };
      }

      // Get equipment costs
      const equipmentCosts = await prisma.equipment.findMany({
        where,
        select: {
          id: true,
          name: true,
          purchaseCost: true,
          maintenanceCost: true,
          calibrationCost: true
        }
      });

      // Calculate total costs
      const totalPurchaseCost = equipmentCosts.reduce((sum, eq) => sum + (eq.purchaseCost || 0), 0);
      const totalMaintenanceCost = equipmentCosts.reduce((sum, eq) => sum + (eq.maintenanceCost || 0), 0);
      const totalCalibrationCost = equipmentCosts.reduce((sum, eq) => sum + (eq.calibrationCost || 0), 0);

      return [
        {
          category: 'Equipment Purchase',
          amount: totalPurchaseCost,
          percentage: 40
        },
        {
          category: 'Maintenance',
          amount: totalMaintenanceCost,
          percentage: 30
        },
        {
          category: 'Calibration',
          amount: totalCalibrationCost,
          percentage: 20
        },
        {
          category: 'Other',
          amount: totalPurchaseCost * 0.1,
          percentage: 10
        }
      ];
    } catch (error) {
      logger.error('Failed to generate cost analysis:', error);
      return [];
    }
  }

  /**
   * Generate risk assessment
   */
  private async generateRiskAssessment(laboratoryId: string, dateRange?: { start: Date; end: Date }): Promise<any[]> {
    try {
      const where: any = { laboratoryId };
      if (dateRange) {
        where.createdAt = {
          gte: dateRange.start,
          lte: dateRange.end
        };
      }

      // Get overdue calibrations
      const overdueCalibrations = await prisma.calibrationRecord.count({
        where: {
          ...where,
          dueDate: { lt: new Date() },
          status: { not: 'COMPLETED' }
        }
      });

      // Get equipment with issues
      const equipmentWithIssues = await prisma.equipment.count({
        where: {
          ...where,
          status: { in: ['MAINTENANCE', 'OUT_OF_SERVICE'] }
        }
      });

      // Get compliance violations
      const complianceViolations = await prisma.calibrationRecord.count({
        where: {
          ...where,
          status: 'NON_COMPLIANT'
        }
      });

      return [
        {
          risk: 'Overdue Calibrations',
          level: overdueCalibrations > 5 ? 'HIGH' : overdueCalibrations > 2 ? 'MEDIUM' : 'LOW',
          count: overdueCalibrations,
          impact: 'Regulatory non-compliance'
        },
        {
          risk: 'Equipment Issues',
          level: equipmentWithIssues > 3 ? 'HIGH' : equipmentWithIssues > 1 ? 'MEDIUM' : 'LOW',
          count: equipmentWithIssues,
          impact: 'Operational disruption'
        },
        {
          risk: 'Compliance Violations',
          level: complianceViolations > 2 ? 'HIGH' : complianceViolations > 0 ? 'MEDIUM' : 'LOW',
          count: complianceViolations,
          impact: 'Regulatory penalties'
        }
      ];
    } catch (error) {
      logger.error('Failed to generate risk assessment:', error);
      return [];
    }
  }

  /**
   * Execute bulk operation
   */
  async executeBulkOperation(
    type: string,
    data: any[],
    options: Record<string, any> = {}
  ): Promise<BulkOperation> {
    try {
      const operation: BulkOperation = {
        id: `bulk_${Date.now()}`,
        type: type as any,
        status: 'PENDING',
        progress: 0,
        totalItems: data.length,
        processedItems: 0,
        errors: [],
        result: {},
        createdAt: new Date()
      };

      // Store operation in database
      await prisma.bulkOperation.create({
        data: {
          id: operation.id,
          type: operation.type,
          status: operation.status,
          progress: operation.progress,
          totalItems: operation.totalItems,
          processedItems: operation.processedItems,
          errors: operation.errors,
          result: operation.result,
          createdAt: operation.createdAt
        }
      });

      // Execute operation based on type
      switch (type) {
        case 'IMPORT':
          await this.executeBulkImport(operation, data, options);
          break;
        case 'EXPORT':
          await this.executeBulkExport(operation, data, options);
          break;
        case 'UPDATE':
          await this.executeBulkUpdate(operation, data, options);
          break;
        case 'DELETE':
          await this.executeBulkDelete(operation, data, options);
          break;
        default:
          throw new Error(`Unknown bulk operation type: ${type}`);
      }

      return operation;
    } catch (error) {
      logger.error('Failed to execute bulk operation:', error);
      throw error;
    }
  }

  /**
   * Execute bulk import
   */
  private async executeBulkImport(operation: BulkOperation, data: any[], options: any): Promise<void> {
    try {
      operation.status = 'PROCESSING';

      for (let i = 0; i < data.length; i++) {
        try {
          const item = data[i];

          switch (options.entityType) {
            case 'equipment':
              await prisma.equipment.create({ data: item });
              break;
            case 'calibrations':
              await prisma.calibrationRecord.create({ data: item });
              break;
            case 'users':
              await prisma.user.create({ data: item });
              break;
            default:
              throw new Error(`Unknown entity type: ${options.entityType}`);
          }

          operation.processedItems++;
          operation.progress = (operation.processedItems / operation.totalItems) * 100;
        } catch (error) {
          operation.errors.push(`Item ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      operation.status = operation.errors.length > 0 ? 'FAILED' : 'COMPLETED';
      operation.completedAt = new Date();

      // Update operation in database
      await prisma.bulkOperation.update({
        where: { id: operation.id },
        data: {
          status: operation.status,
          progress: operation.progress,
          processedItems: operation.processedItems,
          errors: operation.errors,
          completedAt: operation.completedAt
        }
      });
    } catch (error) {
      logger.error('Failed to execute bulk import:', error);
      throw error;
    }
  }

  /**
   * Execute bulk export
   */
  private async executeBulkExport(operation: BulkOperation, data: any[], options: any): Promise<void> {
    try {
      operation.status = 'PROCESSING';

      const exportData = await this.generateExportData(options.entityType, options.filters);
      const csvData = await this.convertToCSV(exportData);

      const fileName = `export_${options.entityType}_${Date.now()}.csv`;
      const filePath = path.join(process.cwd(), 'exports', fileName);

      // Ensure exports directory exists
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      fs.writeFileSync(filePath, csvData);

      operation.result = { fileName, filePath, recordCount: exportData.length };
      operation.processedItems = exportData.length;
      operation.progress = 100;
      operation.status = 'COMPLETED';
      operation.completedAt = new Date();

      // Update operation in database
      await prisma.bulkOperation.update({
        where: { id: operation.id },
        data: {
          status: operation.status,
          progress: operation.progress,
          processedItems: operation.processedItems,
          result: operation.result,
          completedAt: operation.completedAt
        }
      });
    } catch (error) {
      logger.error('Failed to execute bulk export:', error);
      throw error;
    }
  }

  /**
   * Execute bulk update
   */
  private async executeBulkUpdate(operation: BulkOperation, data: any[], options: any): Promise<void> {
    try {
      operation.status = 'PROCESSING';

      for (let i = 0; i < data.length; i++) {
        try {
          const item = data[i];

          switch (options.entityType) {
            case 'equipment':
              await prisma.equipment.update({
                where: { id: item.id },
                data: item
              });
              break;
            case 'calibrations':
              await prisma.calibrationRecord.update({
                where: { id: item.id },
                data: item
              });
              break;
            case 'users':
              await prisma.user.update({
                where: { id: item.id },
                data: item
              });
              break;
            default:
              throw new Error(`Unknown entity type: ${options.entityType}`);
          }

          operation.processedItems++;
          operation.progress = (operation.processedItems / operation.totalItems) * 100;
        } catch (error) {
          operation.errors.push(`Item ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      operation.status = operation.errors.length > 0 ? 'FAILED' : 'COMPLETED';
      operation.completedAt = new Date();

      // Update operation in database
      await prisma.bulkOperation.update({
        where: { id: operation.id },
        data: {
          status: operation.status,
          progress: operation.progress,
          processedItems: operation.processedItems,
          errors: operation.errors,
          completedAt: operation.completedAt
        }
      });
    } catch (error) {
      logger.error('Failed to execute bulk update:', error);
      throw error;
    }
  }

  /**
   * Execute bulk delete
   */
  private async executeBulkDelete(operation: BulkOperation, data: any[], options: any): Promise<void> {
    try {
      operation.status = 'PROCESSING';

      for (let i = 0; i < data.length; i++) {
        try {
          const itemId = data[i];

          switch (options.entityType) {
            case 'equipment':
              await prisma.equipment.delete({ where: { id: itemId } });
              break;
            case 'calibrations':
              await prisma.calibrationRecord.delete({ where: { id: itemId } });
              break;
            case 'users':
              await prisma.user.delete({ where: { id: itemId } });
              break;
            default:
              throw new Error(`Unknown entity type: ${options.entityType}`);
          }

          operation.processedItems++;
          operation.progress = (operation.processedItems / operation.totalItems) * 100;
        } catch (error) {
          operation.errors.push(`Item ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      operation.status = operation.errors.length > 0 ? 'FAILED' : 'COMPLETED';
      operation.completedAt = new Date();

      // Update operation in database
      await prisma.bulkOperation.update({
        where: { id: operation.id },
        data: {
          status: operation.status,
          progress: operation.progress,
          processedItems: operation.processedItems,
          errors: operation.errors,
          completedAt: operation.completedAt
        }
      });
    } catch (error) {
      logger.error('Failed to execute bulk delete:', error);
      throw error;
    }
  }

  /**
   * Generate export data
   */
  private async generateExportData(entityType: string, filters: any): Promise<any[]> {
    try {
      const where: any = {};
      if (filters) {
        Object.assign(where, filters);
      }

      switch (entityType) {
        case 'equipment':
          return prisma.equipment.findMany({ where });
        case 'calibrations':
          return prisma.calibrationRecord.findMany({ where });
        case 'users':
          return prisma.user.findMany({ where });
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
    } catch (error) {
      logger.error('Failed to generate export data:', error);
      throw error;
    }
  }

  /**
   * Convert data to CSV
   */
  private async convertToCSV(data: any[]): Promise<string> {
    try {
      if (data.length === 0) {
        return '';
      }

      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];

      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvRows.push(values.join(','));
      }

      return csvRows.join('\n');
    } catch (error) {
      logger.error('Failed to convert to CSV:', error);
      throw error;
    }
  }

  /**
   * Template rendering methods
   */
  private async renderEmailTemplate(template: string, variables: Record<string, any>): Promise<any> {
    // This would use a template engine like Handlebars or EJS
    const subject = `LabGuard Pro - ${template}`;
    const html = `<h1>LabGuard Pro Notification</h1><p>${JSON.stringify(variables)}</p>`;
    const text = `LabGuard Pro Notification: ${JSON.stringify(variables)}`;

    return { subject, html, text };
  }

  private async renderSMSTemplate(template: string, variables: Record<string, any>): Promise<string> {
    return `LabGuard Pro: ${template} - ${JSON.stringify(variables)}`;
  }

  private async renderPushTemplate(template: string, variables: Record<string, any>): Promise<any> {
    return {
      title: `LabGuard Pro - ${template}`,
      body: JSON.stringify(variables),
      data: variables
    };
  }

  private async renderWebhookTemplate(template: string, variables: Record<string, any>): Promise<any> {
    return {
      template,
      variables,
      timestamp: new Date().toISOString(),
      source: 'labguard_pro'
    };
  }
}

export default new AdvancedFeaturesService(); 
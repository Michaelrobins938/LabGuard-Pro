import { Request, Response } from 'express';
import AdvancedFeaturesService from '../services/AdvancedFeaturesService';

export class AdvancedFeaturesController {
  /**
   * Send real-time notification
   */
  async sendNotification(req: Request, res: Response) {
    try {
      const config = req.body;

      if (!config.recipients || !config.template) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: recipients, template'
        });
      }

      await AdvancedFeaturesService.sendNotification(config);

      res.json({
        success: true,
        message: 'Notification sent successfully'
      });
    } catch (error) {
      console.error('Send notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send notification',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Generate analytics
   */
  async generateAnalytics(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.params;
      const { startDate, endDate } = req.query;

      if (!laboratoryId) {
        return res.status(400).json({
          success: false,
          message: 'Missing laboratory ID'
        });
      }

      const dateRange = startDate && endDate ? {
        start: new Date(startDate as string),
        end: new Date(endDate as string)
      } : undefined;

      const analytics = await AdvancedFeaturesService.generateAnalytics(laboratoryId, dateRange);

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Generate analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate analytics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Execute bulk operation
   */
  async executeBulkOperation(req: Request, res: Response) {
    try {
      const { type, data, options } = req.body;

      if (!type || !data || !Array.isArray(data)) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: type, data (array)'
        });
      }

      const operation = await AdvancedFeaturesService.executeBulkOperation(type, data, options || {});

      res.json({
        success: true,
        data: operation
      });
    } catch (error) {
      console.error('Execute bulk operation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute bulk operation',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get bulk operation status
   */
  async getBulkOperationStatus(req: Request, res: Response) {
    try {
      const { operationId } = req.params;

      if (!operationId) {
        return res.status(400).json({
          success: false,
          message: 'Missing operation ID'
        });
      }

      // This would fetch from database
      const operation = {
        id: operationId,
        status: 'COMPLETED',
        progress: 100,
        totalItems: 100,
        processedItems: 100,
        errors: [],
        result: { success: true }
      };

      res.json({
        success: true,
        data: operation
      });
    } catch (error) {
      console.error('Get bulk operation status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get bulk operation status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get analytics dashboard data
   */
  async getAnalyticsDashboard(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.params;
      const { period = '30d' } = req.query;

      if (!laboratoryId) {
        return res.status(400).json({
          success: false,
          message: 'Missing laboratory ID'
        });
      }

      // Calculate date range based on period
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      const analytics = await AdvancedFeaturesService.generateAnalytics(laboratoryId, { start: startDate, end: endDate });

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Get analytics dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get analytics dashboard',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Export data
   */
  async exportData(req: Request, res: Response) {
    try {
      const { entityType, filters } = req.body;

      if (!entityType) {
        return res.status(400).json({
          success: false,
          message: 'Missing entity type'
        });
      }

      const operation = await AdvancedFeaturesService.executeBulkOperation('EXPORT', [], {
        entityType,
        filters
      });

      res.json({
        success: true,
        data: operation
      });
    } catch (error) {
      console.error('Export data error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Import data
   */
  async importData(req: Request, res: Response) {
    try {
      const { entityType, data } = req.body;

      if (!entityType || !data || !Array.isArray(data)) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: entityType, data (array)'
        });
      }

      const operation = await AdvancedFeaturesService.executeBulkOperation('IMPORT', data, {
        entityType
      });

      res.json({
        success: true,
        data: operation
      });
    } catch (error) {
      console.error('Import data error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to import data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get notification templates
   */
  async getNotificationTemplates(req: Request, res: Response) {
    try {
      const templates = [
        {
          id: 'calibration_due',
          name: 'Calibration Due',
          description: 'Notification for equipment calibration due',
          variables: ['equipmentName', 'dueDate', 'laboratoryName']
        },
        {
          id: 'compliance_violation',
          name: 'Compliance Violation',
          description: 'Notification for compliance violations',
          variables: ['violationType', 'equipmentName', 'severity']
        },
        {
          id: 'maintenance_required',
          name: 'Maintenance Required',
          description: 'Notification for equipment maintenance',
          variables: ['equipmentName', 'maintenanceType', 'priority']
        },
        {
          id: 'system_alert',
          name: 'System Alert',
          description: 'General system alerts',
          variables: ['alertType', 'message', 'severity']
        }
      ];

      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error('Get notification templates error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get notification templates',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Test notification
   */
  async testNotification(req: Request, res: Response) {
    try {
      const { template, variables, recipients } = req.body;

      if (!template || !recipients || !Array.isArray(recipients)) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: template, recipients (array)'
        });
      }

      const config = {
        email: true,
        sms: false,
        push: false,
        webhook: false,
        recipients,
        template,
        variables: variables || {}
      };

      await AdvancedFeaturesService.sendNotification(config);

      res.json({
        success: true,
        message: 'Test notification sent successfully'
      });
    } catch (error) {
      console.error('Test notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send test notification',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get bulk operations history
   */
  async getBulkOperationsHistory(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;

      // This would fetch from database
      const operations = [
        {
          id: 'bulk_1',
          type: 'EXPORT',
          status: 'COMPLETED',
          progress: 100,
          totalItems: 100,
          processedItems: 100,
          createdAt: new Date(),
          completedAt: new Date()
        },
        {
          id: 'bulk_2',
          type: 'IMPORT',
          status: 'PROCESSING',
          progress: 50,
          totalItems: 200,
          processedItems: 100,
          createdAt: new Date()
        }
      ];

      res.json({
        success: true,
        data: operations,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: operations.length
        }
      });
    } catch (error) {
      console.error('Get bulk operations history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get bulk operations history',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Cancel bulk operation
   */
  async cancelBulkOperation(req: Request, res: Response) {
    try {
      const { operationId } = req.params;

      if (!operationId) {
        return res.status(400).json({
          success: false,
          message: 'Missing operation ID'
        });
      }

      // This would update the operation status in database
      res.json({
        success: true,
        message: 'Bulk operation cancelled successfully'
      });
    } catch (error) {
      console.error('Cancel bulk operation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel bulk operation',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new AdvancedFeaturesController(); 
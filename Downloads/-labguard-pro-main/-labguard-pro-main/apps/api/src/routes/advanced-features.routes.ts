import { Router } from 'express';
import AdvancedFeaturesController from '../controllers/advanced-features.controller';

const router = Router();

// Real-time notifications
router.post('/notifications/send', AdvancedFeaturesController.sendNotification);
router.get('/notifications/templates', AdvancedFeaturesController.getNotificationTemplates);
router.post('/notifications/test', AdvancedFeaturesController.testNotification);

// Analytics
router.get('/analytics/:laboratoryId', AdvancedFeaturesController.generateAnalytics);
router.get('/analytics/:laboratoryId/dashboard', AdvancedFeaturesController.getAnalyticsDashboard);

// Bulk operations
router.post('/bulk-operations', AdvancedFeaturesController.executeBulkOperation);
router.get('/bulk-operations/:operationId', AdvancedFeaturesController.getBulkOperationStatus);
router.delete('/bulk-operations/:operationId', AdvancedFeaturesController.cancelBulkOperation);
router.get('/bulk-operations', AdvancedFeaturesController.getBulkOperationsHistory);

// Data import/export
router.post('/export', AdvancedFeaturesController.exportData);
router.post('/import', AdvancedFeaturesController.importData);

export default router; 
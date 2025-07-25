import { Router } from 'express';
import { ReportsController } from '../controllers/reports.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/compliance-summary', ReportsController.getComplianceSummary);
router.get('/equipment-status', ReportsController.getEquipmentStatusReport);

// Analytics routes
router.get('/analytics', ReportsController.getAnalytics);
router.get('/analytics/equipment', ReportsController.getEquipmentAnalytics);
router.get('/analytics/calibrations', ReportsController.getCalibrationAnalytics);
router.get('/analytics/ai-usage', ReportsController.getAIUsageAnalytics);

export default router; 
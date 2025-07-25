import express from 'express';

const router = express.Router();

// Equipment analytics
router.get('/equipment', (req, res) => {
  res.json({
    totalEquipment: 12,
    activeEquipment: 10,
    inactiveEquipment: 1,
    maintenanceEquipment: 1,
    calibrationDue: 3,
    monthlyTrends: [
      { month: 'Jan', count: 10 },
      { month: 'Feb', count: 11 },
      { month: 'Mar', count: 12 }
    ]
  });
});

// Calibration analytics
router.get('/calibration', (req, res) => {
  res.json({
    totalCalibrations: 45,
    completedCalibrations: 42,
    overdueCalibrations: 3,
    complianceRate: 93.3,
    monthlyCalibrations: [
      { month: 'Jan', count: 15 },
      { month: 'Feb', count: 12 },
      { month: 'Mar', count: 18 }
    ]
  });
});

// Compliance analytics
router.get('/compliance', (req, res) => {
  res.json({
    overallCompliance: 95,
    equipmentCompliance: 92,
    calibrationCompliance: 98,
    documentationCompliance: 96,
    monthlyCompliance: [
      { month: 'Jan', score: 93 },
      { month: 'Feb', score: 94 },
      { month: 'Mar', score: 95 }
    ]
  });
});

// User analytics
router.get('/users', (req, res) => {
  res.json({
    totalUsers: 8,
    activeUsers: 6,
    inactiveUsers: 2,
    userActivity: [
      { user: 'Dr. Sarah Chen', activities: 25 },
      { user: 'Mike Rodriguez', activities: 18 },
      { user: 'Emily Johnson', activities: 12 }
    ]
  });
});

// Custom report
router.post('/custom-report', (req, res) => {
  res.json({
    reportId: 'report_' + Date.now(),
    generatedAt: new Date().toISOString(),
    data: req.body,
    status: 'completed'
  });
});

export default router; 
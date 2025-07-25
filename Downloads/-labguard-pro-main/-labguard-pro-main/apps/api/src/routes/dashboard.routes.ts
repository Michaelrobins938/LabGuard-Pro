import express from 'express';

const router = express.Router();

// Dashboard stats
router.get('/stats', (req, res) => {
  res.json({
    totalEquipment: 12,
    activeEquipment: 10,
    calibrationDue: 3,
    complianceScore: 95,
    totalUsers: 8,
    recentActivity: 15
  });
});

// Recent activity
router.get('/activity', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  res.json([
    {
      id: '1',
      type: 'equipment_calibration',
      description: 'Analytical Balance PB-220 calibrated',
      userId: '1',
      userName: 'Dr. Sarah Chen',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      type: 'equipment_maintenance',
      description: 'Centrifuge CF-16 maintenance completed',
      userId: '2',
      userName: 'Mike Rodriguez',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ].slice(0, limit));
});

// Compliance overview
router.get('/compliance', (req, res) => {
  res.json({
    overallScore: 95,
    equipmentCompliance: 92,
    calibrationCompliance: 98,
    documentationCompliance: 96,
    lastUpdated: new Date().toISOString()
  });
});

// Equipment status
router.get('/equipment-status', (req, res) => {
  res.json({
    active: 10,
    inactive: 1,
    maintenance: 1,
    calibrationDue: 3,
    total: 12
  });
});

// Calibration schedule
router.get('/calibration-schedule', (req, res) => {
  res.json([
    {
      id: '1',
      equipmentName: 'Analytical Balance PB-220',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled'
    },
    {
      id: '2',
      equipmentName: 'pH Meter PH-100',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'urgent'
    }
  ]);
});

export default router; 
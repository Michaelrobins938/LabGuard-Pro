import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateLaboratoryAccess } from '../middleware/laboratory';
import { rateLimiter } from '../middleware/rateLimiter';
import { ComplianceAssistantController } from '../controllers/ComplianceAssistantController';
import { ComplianceDocumentService } from '../services/ComplianceDocumentService';
import { BiomniAIService } from '../services/BiomniAIService';

const router = Router();
const controller = new ComplianceAssistantController();

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const labId = req.user.laboratoryId;
    const uploadPath = path.join(process.env.UPLOAD_PATH || './uploads', 'compliance', labId);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, and text files are allowed.'));
    }
  }
});

// Document Management Routes
router.post('/documents/upload',
  authenticateToken,
  validateLaboratoryAccess,
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 }), // 20 uploads per 15 minutes
  upload.array('documents', 10),
  controller.uploadDocuments
);

router.get('/documents',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getDocuments
);

router.get('/documents/:id',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getDocument
);

router.delete('/documents/:id',
  authenticateToken,
  validateLaboratoryAccess,
  requireRole(['ADMIN', 'MANAGER']),
  controller.deleteDocument
);

router.post('/documents/:id/reanalyze',
  authenticateToken,
  validateLaboratoryAccess,
  requireRole(['ADMIN', 'MANAGER']),
  rateLimiter({ windowMs: 60 * 1000, max: 5 }), // 5 reanalyzes per minute
  controller.reanalyzeDocument
);

// AI Analysis Routes
router.post('/analyze',
  authenticateToken,
  validateLaboratoryAccess,
  rateLimiter({ windowMs: 60 * 1000, max: 10 }), // 10 analyses per minute
  controller.analyzeDocument
);

router.get('/analysis/:documentId/status',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getAnalysisStatus
);

router.get('/analysis/:documentId/results',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getAnalysisResults
);

// Violations Management
router.get('/violations',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getViolations
);

router.get('/violations/:id',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getViolation
);

router.put('/violations/:id/resolve',
  authenticateToken,
  validateLaboratoryAccess,
  requireRole(['ADMIN', 'MANAGER', 'TECHNICIAN']),
  controller.resolveViolation
);

router.put('/violations/:id/status',
  authenticateToken,
  validateLaboratoryAccess,
  requireRole(['ADMIN', 'MANAGER']),
  controller.updateViolationStatus
);

// Recommendations Management
router.get('/recommendations',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getRecommendations
);

router.put('/recommendations/:id/implement',
  authenticateToken,
  validateLaboratoryAccess,
  requireRole(['ADMIN', 'MANAGER']),
  controller.implementRecommendation
);

router.put('/recommendations/:id/status',
  authenticateToken,
  validateLaboratoryAccess,
  requireRole(['ADMIN', 'MANAGER']),
  controller.updateRecommendationStatus
);

// Audit Checklist Routes
router.get('/audit/checklist',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getAuditChecklist
);

router.post('/audit/checklist/generate',
  authenticateToken,
  validateLaboratoryAccess,
  requireRole(['ADMIN', 'MANAGER']),
  rateLimiter({ windowMs: 5 * 60 * 1000, max: 3 }), // 3 generations per 5 minutes
  controller.generateAuditChecklist
);

router.put('/audit/checklist/:id/complete',
  authenticateToken,
  validateLaboratoryAccess,
  controller.completeChecklistItem
);

router.post('/audit/checklist/:id/evidence',
  authenticateToken,
  validateLaboratoryAccess,
  upload.array('evidence', 5),
  controller.uploadChecklistEvidence
);

// Audit Reports
router.get('/audit/reports',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getAuditReports
);

router.post('/audit/reports/generate',
  authenticateToken,
  validateLaboratoryAccess,
  requireRole(['ADMIN', 'MANAGER']),
  rateLimiter({ windowMs: 10 * 60 * 1000, max: 2 }), // 2 reports per 10 minutes
  controller.generateAuditReport
);

router.get('/audit/reports/:id',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getAuditReport
);

router.get('/audit/reports/:id/download',
  authenticateToken,
  validateLaboratoryAccess,
  controller.downloadAuditReport
);

router.put('/audit/reports/:id/approve',
  authenticateToken,
  validateLaboratoryAccess,
  requireRole(['ADMIN', 'MANAGER']),
  controller.approveAuditReport
);

// Daily Compliance Logs
router.get('/daily-logs',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getDailyLogs
);

router.post('/daily-logs',
  authenticateToken,
  validateLaboratoryAccess,
  controller.createDailyLog
);

router.put('/daily-logs/:id',
  authenticateToken,
  validateLaboratoryAccess,
  controller.updateDailyLog
);

router.post('/daily-logs/:id/validate',
  authenticateToken,
  validateLaboratoryAccess,
  rateLimiter({ windowMs: 60 * 1000, max: 20 }), // 20 validations per minute
  controller.validateDailyLog
);

router.put('/daily-logs/:id/review',
  authenticateToken,
  validateLaboratoryAccess,
  requireRole(['ADMIN', 'MANAGER']),
  controller.reviewDailyLog
);

// Analytics & Dashboard
router.get('/analytics/overview',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getComplianceOverview
);

router.get('/analytics/trends',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getComplianceTrends
);

router.get('/analytics/violations/summary',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getViolationsSummary
);

router.get('/analytics/recommendations/impact',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getRecommendationsImpact
);

// Real-time Updates
router.get('/live/violations',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getLiveViolations
);

router.get('/live/checklist-progress',
  authenticateToken,
  validateLaboratoryAccess,
  controller.getLiveChecklistProgress
);

export { router as complianceAssistantRoutes }; 
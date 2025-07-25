import { Router } from 'express'
import { qcIntelligenceController } from '../controllers/qc-intelligence.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

/**
 * @route POST /api/qc-intelligence/predict/:equipmentId
 * @desc Predict QC failure using Biomni AI
 * @access Private
 */
router.post('/predict/:equipmentId', qcIntelligenceController.predictQCFailure)

/**
 * @route POST /api/qc-intelligence/notify-client
 * @desc Generate client notification for QC delays
 * @access Private
 */
router.post('/notify-client', qcIntelligenceController.generateClientNotification)

/**
 * @route POST /api/qc-intelligence/generate-qa-report
 * @desc Generate QA report for QC failures
 * @access Private
 */
router.post('/generate-qa-report', qcIntelligenceController.generateQAReport)

/**
 * @route POST /api/qc-intelligence/optimize-rerun
 * @desc Optimize rerun scheduling using AI
 * @access Private
 */
router.post('/optimize-rerun', qcIntelligenceController.optimizeRerunScheduling)

/**
 * @route GET /api/qc-intelligence/monitoring-data
 * @desc Get QC monitoring dashboard data
 * @access Private
 */
router.get('/monitoring-data', qcIntelligenceController.getQCMonitoringData)

/**
 * @route POST /api/qc-intelligence/cascade/:testRunId
 * @desc Handle QC failure cascade
 * @access Private
 */
router.post('/cascade/:testRunId', qcIntelligenceController.handleQCFailureCascade)

export default router 
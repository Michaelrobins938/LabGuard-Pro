import { Router } from 'express'
import { calibrationController } from '../controllers/calibration.controller'

const router = Router()

// Get all calibrations with pagination and filtering
router.get('/', calibrationController.getCalibrations)

// Get calibration statistics
router.get('/stats', calibrationController.getCalibrationStats)

// Get due calibrations
router.get('/due', calibrationController.getDueCalibrations)

// Get overdue calibrations
router.get('/overdue', calibrationController.getOverdueCalibrations)

// Create new calibration
router.post('/', calibrationController.createCalibration)

// Get single calibration
router.get('/:id', calibrationController.getCalibration)

// Update calibration
router.put('/:id', calibrationController.updateCalibration)

// Start calibration workflow
router.post('/:id/start', calibrationController.startCalibration)

// Complete calibration workflow
router.post('/:id/complete', calibrationController.completeCalibration)

// Run AI validation
router.post('/:id/validate', calibrationController.validateCalibration)

// Reschedule calibration
router.put('/:id/reschedule', calibrationController.rescheduleCalibration)

// Cancel calibration
router.put('/:id/cancel', calibrationController.cancelCalibration)

// Delete calibration (soft delete)
router.delete('/:id', calibrationController.deleteCalibration)

export default router 
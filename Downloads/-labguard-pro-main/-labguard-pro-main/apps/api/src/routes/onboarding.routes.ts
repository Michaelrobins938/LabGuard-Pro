import express from 'express'
import { z } from 'zod'
import { onboardingService } from '../services/OnboardingService'
import { authMiddleware } from '../middleware/auth.middleware'
import { logger } from '../utils/logger'

const router = express.Router()

// Validation schemas
const completeStepSchema = z.object({
  stepId: z.string()
})

const skipStepSchema = z.object({
  stepId: z.string()
})

/**
 * @route GET /api/onboarding/progress/:laboratoryId
 * @desc Get onboarding progress for a laboratory
 * @access Private
 */
router.get('/progress/:laboratoryId', authMiddleware, async (req, res) => {
  try {
    const { laboratoryId } = req.params
    const userLaboratoryId = (req as any).user?.laboratoryId

    // Verify user has access to this laboratory
    if (userLaboratoryId !== laboratoryId && (req as any).user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    const progress = await onboardingService.getOnboardingProgress(laboratoryId)

    res.json({
      success: true,
      data: progress
    })
  } catch (error) {
    logger.error('Failed to get onboarding progress:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve onboarding progress'
    })
  }
})

/**
 * @route POST /api/onboarding/initialize
 * @desc Initialize onboarding for a new laboratory
 * @access Private
 */
router.post('/initialize', authMiddleware, async (req, res) => {
  try {
    const laboratoryId = (req as any).user?.laboratoryId
    const userId = (req as any).user?.id

    if (!laboratoryId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Laboratory ID and User ID required'
      })
    }

    const progress = await onboardingService.initializeOnboarding(laboratoryId, userId)

    res.json({
      success: true,
      data: progress
    })
  } catch (error) {
    logger.error('Failed to initialize onboarding:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initialize onboarding'
    })
  }
})

/**
 * @route POST /api/onboarding/complete-step
 * @desc Complete an onboarding step
 * @access Private
 */
router.post('/complete-step', authMiddleware, async (req, res) => {
  try {
    const { stepId } = completeStepSchema.parse(req.body)
    const laboratoryId = (req as any).user?.laboratoryId

    if (!laboratoryId) {
      return res.status(400).json({
        success: false,
        error: 'Laboratory ID required'
      })
    }

    const progress = await onboardingService.completeStep(laboratoryId, stepId)

    res.json({
      success: true,
      data: progress
    })
  } catch (error) {
    logger.error('Failed to complete onboarding step:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete step'
    })
  }
})

/**
 * @route POST /api/onboarding/skip-step
 * @desc Skip an optional onboarding step
 * @access Private
 */
router.post('/skip-step', authMiddleware, async (req, res) => {
  try {
    const { stepId } = skipStepSchema.parse(req.body)
    const laboratoryId = (req as any).user?.laboratoryId

    if (!laboratoryId) {
      return res.status(400).json({
        success: false,
        error: 'Laboratory ID required'
      })
    }

    const progress = await onboardingService.skipStep(laboratoryId, stepId)

    res.json({
      success: true,
      data: progress
    })
  } catch (error) {
    logger.error('Failed to skip onboarding step:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to skip step'
    })
  }
})

/**
 * @route GET /api/onboarding/steps
 * @desc Get all onboarding steps
 * @access Public
 */
router.get('/steps', async (req, res) => {
  try {
    const steps = onboardingService.getOnboardingSteps()

    res.json({
      success: true,
      data: steps
    })
  } catch (error) {
    logger.error('Failed to get onboarding steps:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve onboarding steps'
    })
  }
})

/**
 * @route GET /api/onboarding/tutorials
 * @desc Get all tutorials
 * @access Public
 */
router.get('/tutorials', async (req, res) => {
  try {
    const tutorials = onboardingService.getTutorials()

    res.json({
      success: true,
      data: tutorials
    })
  } catch (error) {
    logger.error('Failed to get tutorials:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tutorials'
    })
  }
})

/**
 * @route GET /api/onboarding/tutorials/:tutorialId
 * @desc Get specific tutorial
 * @access Public
 */
router.get('/tutorials/:tutorialId', async (req, res) => {
  try {
    const { tutorialId } = req.params
    const tutorial = onboardingService.getTutorial(tutorialId)

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        error: 'Tutorial not found'
      })
    }

    res.json({
      success: true,
      data: tutorial
    })
  } catch (error) {
    logger.error('Failed to get tutorial:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tutorial'
    })
  }
})

/**
 * @route POST /api/onboarding/import-sample-data
 * @desc Import sample equipment and calibration data
 * @access Private
 */
router.post('/import-sample-data', authMiddleware, async (req, res) => {
  try {
    const laboratoryId = (req as any).user?.laboratoryId

    if (!laboratoryId) {
      return res.status(400).json({
        success: false,
        error: 'Laboratory ID required'
      })
    }

    // Import sample equipment
    await onboardingService.importSampleEquipment(laboratoryId)

    // Create sample calibrations
    await onboardingService.createSampleCalibrations(laboratoryId)

    res.json({
      success: true,
      message: 'Sample data imported successfully'
    })
  } catch (error) {
    logger.error('Failed to import sample data:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import sample data'
    })
  }
})

/**
 * @route GET /api/onboarding/checklist
 * @desc Get onboarding checklist
 * @access Public
 */
router.get('/checklist', async (req, res) => {
  try {
    const checklist = onboardingService.getOnboardingChecklist()

    res.json({
      success: true,
      data: checklist
    })
  } catch (error) {
    logger.error('Failed to get onboarding checklist:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve onboarding checklist'
    })
  }
})

/**
 * @route POST /api/onboarding/reset
 * @desc Reset onboarding progress
 * @access Private
 */
router.post('/reset', authMiddleware, async (req, res) => {
  try {
    const laboratoryId = (req as any).user?.laboratoryId

    if (!laboratoryId) {
      return res.status(400).json({
        success: false,
        error: 'Laboratory ID required'
      })
    }

    const progress = await onboardingService.resetOnboarding(laboratoryId)

    res.json({
      success: true,
      data: progress,
      message: 'Onboarding progress reset successfully'
    })
  } catch (error) {
    logger.error('Failed to reset onboarding:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reset onboarding'
    })
  }
})

/**
 * @route GET /api/onboarding/status/:laboratoryId
 * @desc Get detailed onboarding status
 * @access Private
 */
router.get('/status/:laboratoryId', authMiddleware, async (req, res) => {
  try {
    const { laboratoryId } = req.params
    const userLaboratoryId = (req as any).user?.laboratoryId

    // Verify user has access to this laboratory
    if (userLaboratoryId !== laboratoryId && (req as any).user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    const progress = await onboardingService.getOnboardingProgress(laboratoryId)
    const steps = onboardingService.getOnboardingSteps()

    // Map steps with completion status
    const stepsWithStatus = steps.map(step => ({
      ...step,
      completed: progress.completedSteps.includes(step.id),
      isCurrent: step.id === progress.currentStep
    }))

    res.json({
      success: true,
      data: {
        progress,
        steps: stepsWithStatus,
        nextStep: steps.find(step => step.id === progress.currentStep),
        estimatedTimeRemaining: calculateEstimatedTimeRemaining(progress, steps)
      }
    })
  } catch (error) {
    logger.error('Failed to get onboarding status:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve onboarding status'
    })
  }
})

/**
 * Calculate estimated time remaining for onboarding
 */
function calculateEstimatedTimeRemaining(progress: any, steps: any[]): number {
  const remainingSteps = steps.filter(step => !progress.completedSteps.includes(step.id))
  const averageTimePerStep = 10 // minutes
  return remainingSteps.length * averageTimePerStep
}

export default router 
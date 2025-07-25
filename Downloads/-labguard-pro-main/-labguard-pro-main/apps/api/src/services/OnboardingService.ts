import { PrismaClient } from '@labguard/database'
import { notificationService } from './NotificationService'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

export interface OnboardingStep {
  id: string
  name: string
  description: string
  type: 'welcome' | 'setup' | 'tutorial' | 'verification'
  required: boolean
  completed: boolean
  order: number
}

export interface OnboardingProgress {
  laboratoryId: string
  currentStep: string
  completedSteps: string[]
  totalSteps: number
  progress: number
  isComplete: boolean
}

export interface TutorialData {
  id: string
  title: string
  description: string
  videoUrl?: string
  steps: string[]
  estimatedTime: number // in minutes
}

export class OnboardingService {
  private readonly onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      name: 'Welcome to LabGuard Pro',
      description: 'Get started with your laboratory compliance automation',
      type: 'welcome',
      required: true,
      completed: false,
      order: 1
    },
    {
      id: 'laboratory-setup',
      name: 'Laboratory Setup',
      description: 'Configure your laboratory information and settings',
      type: 'setup',
      required: true,
      completed: false,
      order: 2
    },
    {
      id: 'equipment-import',
      name: 'Equipment Import',
      description: 'Import your existing equipment inventory',
      type: 'setup',
      required: false,
      completed: false,
      order: 3
    },
    {
      id: 'user-invites',
      name: 'Invite Team Members',
      description: 'Invite your laboratory team to collaborate',
      type: 'setup',
      required: false,
      completed: false,
      order: 4
    },
    {
      id: 'first-calibration',
      name: 'First Calibration',
      description: 'Complete your first equipment calibration',
      type: 'tutorial',
      required: true,
      completed: false,
      order: 5
    },
    {
      id: 'ai-features',
      name: 'AI Features Tour',
      description: 'Learn about Biomni AI-powered features',
      type: 'tutorial',
      required: false,
      completed: false,
      order: 6
    },
    {
      id: 'compliance-check',
      name: 'Compliance Verification',
      description: 'Verify your compliance setup and settings',
      type: 'verification',
      required: true,
      completed: false,
      order: 7
    },
    {
      id: 'go-live',
      name: 'Go Live Checklist',
      description: 'Final verification before going live',
      type: 'verification',
      required: true,
      completed: false,
      order: 8
    }
  ]

  private readonly tutorials: TutorialData[] = [
    {
      id: 'equipment-management',
      title: 'Equipment Management',
      description: 'Learn how to add, edit, and manage your laboratory equipment',
      videoUrl: 'https://example.com/tutorials/equipment-management.mp4',
      steps: [
        'Navigate to Equipment section',
        'Click "Add Equipment"',
        'Fill in equipment details',
        'Set calibration schedule',
        'Save and verify'
      ],
      estimatedTime: 5
    },
    {
      id: 'calibration-workflow',
      title: 'Calibration Workflow',
      description: 'Complete equipment calibration with AI-powered validation',
      videoUrl: 'https://example.com/tutorials/calibration-workflow.mp4',
      steps: [
        'Select equipment for calibration',
        'Enter calibration data',
        'Run AI validation',
        'Review results',
        'Generate compliance report'
      ],
      estimatedTime: 8
    },
    {
      id: 'biomni-ai',
      title: 'Biomni AI Features',
      description: 'Explore advanced AI-powered laboratory analysis',
      videoUrl: 'https://example.com/tutorials/biomni-ai.mp4',
      steps: [
        'Access AI dashboard',
        'Upload sample images',
        'Run visual analysis',
        'Generate protocols',
        'Review AI insights'
      ],
      estimatedTime: 10
    },
    {
      id: 'reports-analytics',
      title: 'Reports & Analytics',
      description: 'Generate compliance reports and view analytics',
      videoUrl: 'https://example.com/tutorials/reports-analytics.mp4',
      steps: [
        'Navigate to Reports section',
        'Select report type',
        'Configure parameters',
        'Generate report',
        'Export or share'
      ],
      estimatedTime: 6
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      description: 'Invite team members and manage roles',
      videoUrl: 'https://example.com/tutorials/team-collaboration.mp4',
      steps: [
        'Go to Team settings',
        'Invite new members',
        'Assign roles',
        'Set permissions',
        'Verify access'
      ],
      estimatedTime: 4
    }
  ]

  /**
   * Initialize onboarding for a new laboratory
   */
  async initializeOnboarding(laboratoryId: string, adminUserId: string): Promise<OnboardingProgress> {
    try {
      // Create onboarding progress record
      const progress = await prisma.onboardingProgress.create({
        data: {
          laboratoryId,
          currentStep: 'welcome',
          completedSteps: [],
          totalSteps: this.onboardingSteps.length,
          progress: 0,
          isComplete: false
        }
      })

      // Send welcome notification
      await notificationService.sendNotification({
        userId: adminUserId,
        laboratoryId,
        type: 'calibration_completed', // Using existing type for welcome
        title: 'Welcome to LabGuard Pro!',
        message: 'Your laboratory compliance automation journey begins now.',
        priority: 'medium',
        metadata: {
          nextStep: 'laboratory-setup',
          estimatedTime: '15 minutes'
        },
        channels: ['email', 'in_app']
      })

      logger.info(`Onboarding initialized for laboratory ${laboratoryId}`)
      return this.formatOnboardingProgress(progress)
    } catch (error) {
      logger.error('Failed to initialize onboarding:', error)
      throw error
    }
  }

  /**
   * Get onboarding progress for a laboratory
   */
  async getOnboardingProgress(laboratoryId: string): Promise<OnboardingProgress> {
    try {
      const progress = await prisma.onboardingProgress.findUnique({
        where: { laboratoryId }
      })

      if (!progress) {
        throw new Error('Onboarding progress not found')
      }

      return this.formatOnboardingProgress(progress)
    } catch (error) {
      logger.error('Failed to get onboarding progress:', error)
      throw error
    }
  }

  /**
   * Complete an onboarding step
   */
  async completeStep(laboratoryId: string, stepId: string): Promise<OnboardingProgress> {
    try {
      const progress = await prisma.onboardingProgress.findUnique({
        where: { laboratoryId }
      })

      if (!progress) {
        throw new Error('Onboarding progress not found')
      }

      // Add step to completed steps if not already there
      const completedSteps = progress.completedSteps.includes(stepId)
        ? progress.completedSteps
        : [...progress.completedSteps, stepId]

      // Calculate new progress
      const newProgress = Math.round((completedSteps.length / this.onboardingSteps.length) * 100)

      // Determine next step
      const currentStepIndex = this.onboardingSteps.findIndex(step => step.id === stepId)
      const nextStep = currentStepIndex < this.onboardingSteps.length - 1
        ? this.onboardingSteps[currentStepIndex + 1].id
        : stepId

      // Check if onboarding is complete
      const isComplete = completedSteps.length === this.onboardingSteps.length

      // Update progress
      const updatedProgress = await prisma.onboardingProgress.update({
        where: { laboratoryId },
        data: {
          completedSteps,
          currentStep: nextStep,
          progress: newProgress,
          isComplete
        }
      })

      // Send completion notification if onboarding is complete
      if (isComplete) {
        await this.sendOnboardingCompleteNotification(laboratoryId)
      }

      logger.info(`Completed onboarding step ${stepId} for laboratory ${laboratoryId}`)
      return this.formatOnboardingProgress(updatedProgress)
    } catch (error) {
      logger.error('Failed to complete onboarding step:', error)
      throw error
    }
  }

  /**
   * Get all onboarding steps
   */
  getOnboardingSteps(): OnboardingStep[] {
    return this.onboardingSteps.sort((a, b) => a.order - b.order)
  }

  /**
   * Get tutorials
   */
  getTutorials(): TutorialData[] {
    return this.tutorials
  }

  /**
   * Get tutorial by ID
   */
  getTutorial(tutorialId: string): TutorialData | null {
    return this.tutorials.find(tutorial => tutorial.id === tutorialId) || null
  }

  /**
   * Import sample equipment data
   */
  async importSampleEquipment(laboratoryId: string): Promise<void> {
    try {
      const sampleEquipment = [
        {
          name: 'Analytical Balance PB-220',
          type: 'BALANCE',
          manufacturer: 'Mettler Toledo',
          model: 'PB-220',
          serialNumber: 'AB-2024-001',
          location: 'Lab A - Bench 1',
          calibrationFrequency: 90, // days
          lastCalibration: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          nextCalibration: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          status: 'ACTIVE'
        },
        {
          name: 'Centrifuge CF-16',
          type: 'CENTRIFUGE',
          manufacturer: 'Eppendorf',
          model: 'CF-16',
          serialNumber: 'CF-2024-002',
          location: 'Lab A - Bench 2',
          calibrationFrequency: 180, // days
          lastCalibration: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
          nextCalibration: new Date(Date.now() + 135 * 24 * 60 * 60 * 1000), // 135 days from now
          status: 'ACTIVE'
        },
        {
          name: 'pH Meter PH-200',
          type: 'PH_METER',
          manufacturer: 'Hanna Instruments',
          model: 'PH-200',
          serialNumber: 'PH-2024-003',
          location: 'Lab A - Bench 3',
          calibrationFrequency: 30, // days
          lastCalibration: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          nextCalibration: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
          status: 'ACTIVE'
        }
      ]

      for (const equipment of sampleEquipment) {
        await prisma.equipment.create({
          data: {
            ...equipment,
            laboratoryId
          }
        })
      }

      logger.info(`Imported ${sampleEquipment.length} sample equipment for laboratory ${laboratoryId}`)
    } catch (error) {
      logger.error('Failed to import sample equipment:', error)
      throw error
    }
  }

  /**
   * Create sample calibration records
   */
  async createSampleCalibrations(laboratoryId: string): Promise<void> {
    try {
      const equipment = await prisma.equipment.findMany({
        where: { laboratoryId },
        select: { id: true, name: true }
      })

      for (const eq of equipment) {
        await prisma.calibrationRecord.create({
          data: {
            equipmentId: eq.id,
            userId: 'system', // Will be replaced with actual user ID
            type: 'ROUTINE',
            status: 'COMPLETED',
            performedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            dueDate: new Date(Date.now() + 83 * 24 * 60 * 60 * 1000), // 83 days from now
            results: {
              accuracy: 'PASS',
              precision: 'PASS',
              linearity: 'PASS',
              overall: 'PASS'
            },
            notes: 'Sample calibration completed successfully'
          }
        })
      }

      logger.info(`Created sample calibrations for laboratory ${laboratoryId}`)
    } catch (error) {
      logger.error('Failed to create sample calibrations:', error)
      throw error
    }
  }

  /**
   * Send onboarding completion notification
   */
  private async sendOnboardingCompleteNotification(laboratoryId: string): Promise<void> {
    try {
      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId },
        include: {
          users: {
            where: { role: 'admin' },
            select: { id: true }
          }
        }
      })

      if (!laboratory?.users[0]) return

      await notificationService.sendNotification({
        userId: laboratory.users[0].id,
        laboratoryId,
        type: 'calibration_completed', // Using existing type
        title: 'Onboarding Complete!',
        message: 'Congratulations! Your laboratory is now ready to use LabGuard Pro.',
        priority: 'high',
        metadata: {
          completionDate: new Date().toISOString(),
          nextSteps: 'Start using AI features and generating reports'
        },
        channels: ['email', 'in_app']
      })
    } catch (error) {
      logger.error('Failed to send onboarding completion notification:', error)
    }
  }

  /**
   * Format onboarding progress
   */
  private formatOnboardingProgress(progress: any): OnboardingProgress {
    return {
      laboratoryId: progress.laboratoryId,
      currentStep: progress.currentStep,
      completedSteps: progress.completedSteps,
      totalSteps: progress.totalSteps,
      progress: progress.progress,
      isComplete: progress.isComplete
    }
  }

  /**
   * Get onboarding checklist
   */
  getOnboardingChecklist(): {
    step: OnboardingStep
    completed: boolean
  }[] {
    return this.onboardingSteps.map(step => ({
      step,
      completed: false // This would be determined by actual progress
    }))
  }

  /**
   * Skip onboarding step
   */
  async skipStep(laboratoryId: string, stepId: string): Promise<OnboardingProgress> {
    try {
      const step = this.onboardingSteps.find(s => s.id === stepId)
      if (!step) {
        throw new Error('Invalid step ID')
      }

      if (step.required) {
        throw new Error('Cannot skip required step')
      }

      return await this.completeStep(laboratoryId, stepId)
    } catch (error) {
      logger.error('Failed to skip onboarding step:', error)
      throw error
    }
  }

  /**
   * Reset onboarding progress
   */
  async resetOnboarding(laboratoryId: string): Promise<OnboardingProgress> {
    try {
      const progress = await prisma.onboardingProgress.update({
        where: { laboratoryId },
        data: {
          currentStep: 'welcome',
          completedSteps: [],
          progress: 0,
          isComplete: false
        }
      })

      logger.info(`Reset onboarding for laboratory ${laboratoryId}`)
      return this.formatOnboardingProgress(progress)
    } catch (error) {
      logger.error('Failed to reset onboarding:', error)
      throw error
    }
  }
}

export const onboardingService = new OnboardingService() 
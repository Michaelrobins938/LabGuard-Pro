import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Validation schemas
const notificationSchema = z.object({
  type: z.enum(['CALIBRATION_DUE', 'CALIBRATION_OVERDUE', 'MAINTENANCE_DUE', 'SYSTEM_ALERT', 'USER_INVITE', 'SUBSCRIPTION_UPDATE']),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  metadata: z.record(z.any()).optional()
}).strict();

const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  reportNotifications: z.boolean().default(true),
  alertNotifications: z.boolean().default(true)
}).strict();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * POST /api/notifications/send
 * Send a notification
 */
router.post('/send', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = notificationSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    // Create notification record
    const notification = await prisma.notification.create({
      data: {
        userId,
        laboratoryId: req.user?.laboratoryId || '',
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata || {}
      }
    });

    // TODO: Implement actual notification sending logic
    // This would integrate with email/SMS/push notification services

    res.json({
      success: true,
      message: 'Notification queued successfully',
      data: notification
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

/**
 * GET /api/notifications/history
 * Get notification history for the user
 */
router.get('/history', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { limit, offset, status } = req.query as {
      limit?: string;
      offset?: string;
      status?: string;
    };
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(status && { status: status as any })
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : 50,
      skip: offset ? parseInt(offset) : 0
    });

    res.json({
      success: true,
      data: notifications,
      count: notifications.length
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch notification history' });
  }
});

/**
 * PUT /api/notifications/preferences
 * Update notification preferences
 */
router.put('/preferences', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = notificationPreferencesSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    // Update user settings (store preferences in settings JSON field)
    await prisma.user.update({
      where: { id: userId },
      data: {
        // Store notification preferences in a custom field or extend the schema
        // For now, we'll store it in the user's metadata or settings
        // TODO: Implement proper notification preferences storage
      }
    });

    console.log('Updated notification preferences for user:', userId, 'with data:', data);

    res.json({
      success: true,
      message: 'Notification preferences updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

/**
 * GET /api/notifications/preferences
 * Get current notification preferences
 */
router.get('/preferences', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({ error: 'Access denied: Authentication required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    console.log('Retrieved user preferences for user:', userId, 'user exists:', !!user);

    res.json({
      success: true,
      data: {} // Return empty object for now since notificationPreferences field doesn't exist
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

export default router; 
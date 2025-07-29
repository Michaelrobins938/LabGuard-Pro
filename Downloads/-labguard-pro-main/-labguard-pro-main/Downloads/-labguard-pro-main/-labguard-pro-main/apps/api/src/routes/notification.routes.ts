import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', NotificationController.getNotifications);
router.get('/count', NotificationController.getNotificationCount);
router.put('/:notificationId/read', NotificationController.markAsRead);
router.put('/mark-all-read', NotificationController.markAllAsRead);

export default router; 
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// TODO: Implement calibration routes
router.get('/', (req, res) => {
  res.json({ message: 'Calibration management - to be implemented' });
});

export default router; 
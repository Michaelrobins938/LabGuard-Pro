import { Router } from 'express';
import { BiomniController } from '../controllers/biomni.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/query', BiomniController.executeQuery);
router.post('/protocol-generation', BiomniController.generateProtocol);

export default router; 
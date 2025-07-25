import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', EquipmentController.getEquipment);
router.post('/', EquipmentController.createEquipment);

export default router; 
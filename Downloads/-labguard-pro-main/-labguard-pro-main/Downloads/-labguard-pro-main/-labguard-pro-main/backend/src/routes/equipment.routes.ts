import { Router } from 'express'
import { equipmentController } from '../controllers/equipment.controller'
import { requireRole } from '../middleware/auth.middleware'

const router = Router()

// Equipment CRUD routes
router.get('/', equipmentController.getEquipment)
router.get('/:id', equipmentController.getEquipmentById)
router.post('/', requireRole(['ADMIN', 'SUPERVISOR']), equipmentController.createEquipment)
router.put('/:id', requireRole(['ADMIN', 'SUPERVISOR']), equipmentController.updateEquipment)
router.delete('/:id', requireRole(['ADMIN']), equipmentController.deleteEquipment)

// Equipment status
router.get('/:id/status', equipmentController.getEquipmentStatus)

export default router 
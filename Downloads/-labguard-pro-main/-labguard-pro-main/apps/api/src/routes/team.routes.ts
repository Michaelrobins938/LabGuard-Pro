import { Router } from 'express';
import { TeamController } from '../controllers/team.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/members', TeamController.getTeamMembers);
router.post('/invite', TeamController.inviteUser);
router.put('/members/:userId/role', TeamController.updateUserRole);

export default router; 
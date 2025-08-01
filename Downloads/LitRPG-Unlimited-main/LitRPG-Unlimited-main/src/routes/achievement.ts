import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/auth';

const router = express.Router();
const achievements: Array<{ user: string; achievement: string }> = [];

router.get('/', (_req: Request, res: Response) => {
    res.json(achievements);
});

router.post('/unlock', verifyToken, (req: Request, res: Response) => {
    const { achievement } = req.body;
    achievements.push({ user: (req as any).user.username, achievement });
    res.sendStatus(201);
});

export default router;

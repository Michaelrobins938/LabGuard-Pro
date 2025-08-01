import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Mock users data - in a real app this would come from a database
const users: { [key: string]: { currency: number } } = {};

router.post('/earn', verifyToken, (req: Request, res: Response) => {
    const { amount } = req.body;
    const user = users[(req as any).user.username];
    if (!user) {
        users[(req as any).user.username] = { currency: 0 };
    }
    users[(req as any).user.username].currency = (users[(req as any).user.username].currency || 0) + amount;
    res.sendStatus(200);
});

router.post('/spend', verifyToken, (req: Request, res: Response) => {
    const { amount } = req.body;
    const user = users[(req as any).user.username];
    if (!user) {
        res.status(400).send('User not found');
        return;
    }
    if (user.currency >= amount) {
        user.currency -= amount;
        res.sendStatus(200);
    } else {
        res.status(400).send('Insufficient funds');
    }
});

router.get('/balance', verifyToken, (req: Request, res: Response) => {
    const user = users[(req as any).user.username];
    if (!user) {
        res.json({ currency: 0 });
        return;
    }
    res.json({ currency: user.currency });
});

export default router;

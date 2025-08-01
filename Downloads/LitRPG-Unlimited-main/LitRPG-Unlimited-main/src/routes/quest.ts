import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/auth';
import { Quests } from '../types/express';

const router = express.Router();
const quests: Quests = {};

router.post('/create', verifyToken, (req: Request, res: Response) => {
    const { name, steps } = req.body;
    quests[name] = { name, steps, completedBy: [] };
    res.sendStatus(201);
});

router.post('/complete', verifyToken, (req: Request, res: Response) => {
    const { name } = req.body;
    const quest = quests[name];
    if (quest) {
        quest.completedBy.push((req as any).user.username);
        res.sendStatus(200);
    } else {
        res.status(404).send('Quest not found');
    }
});

router.get('/:name', (req: Request, res: Response) => {
    const { name } = req.params;
    const quest = quests[name];
    if (quest) {
        res.json(quest);
    } else {
        res.status(404).send('Quest not found');
    }
});

export default router;

import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/auth';
import { Houses } from '../types/express';

const router = express.Router();

const houses: Houses = {
    celestialOrder: { name: 'Celestial Order', points: 0 },
    kitsuneClan: { name: 'Kitsune Clan', points: 0 },
    luminaeSanctum: { name: 'Luminae Sanctum', points: 0 },
    umbralCovenant: { name: 'Umbral Covenant', points: 0 },
};

router.get('/', (_req: Request, res: Response) => {
    res.json(houses);
});

router.post('/addPoints', verifyToken, (req: Request, res: Response) => {
    const { house, points } = req.body;
    if (houses[house as keyof Houses]) {
        houses[house as keyof Houses].points += points;
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

router.get('/leaderboard', (_req: Request, res: Response) => {
    const leaderboard = Object.values(houses).sort((a, b) => b.points - a.points);
    res.json(leaderboard);
});

export default router;

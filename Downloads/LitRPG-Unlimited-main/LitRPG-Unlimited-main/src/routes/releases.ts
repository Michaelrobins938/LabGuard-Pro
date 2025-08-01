import express, { Request, Response } from 'express';
import Release from '../models/Release';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const releases = await Release.find();
        res.json(releases);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
});

export default router;

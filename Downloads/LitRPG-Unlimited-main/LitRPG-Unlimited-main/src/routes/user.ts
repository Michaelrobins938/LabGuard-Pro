import express, { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get all users
router.get('/', authenticate, async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
});

// Get a single user
router.get('/:id', authenticate, getUser, (_req: Request, res: Response) => {
    res.json((res as any).user);
});

// Create a new user
router.post('/', async (req: Request, res: Response) => {
    const user = new User({
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10)
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        const error = err as Error;
        res.status(400).json({ message: error.message });
    }
});

// Middleware to get user by ID
async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            res.status(404).json({ message: 'Cannot find user' });
            return;
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
        return;
    }

    (res as any).user = user;
    next();
}

export default router;

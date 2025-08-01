import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send({ message: 'Access denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
        req.userId = decoded.id;
        next();
    } catch (ex) {
        res.status(400).send({ message: 'Invalid token' });
    }
};

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send({ message: 'Access denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
        req.userId = decoded.id;
        next();
    } catch (ex) {
        res.status(400).send({ message: 'Invalid token' });
    }
};

const generateAuthToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
};

export { authenticate, verifyToken, generateAuthToken };

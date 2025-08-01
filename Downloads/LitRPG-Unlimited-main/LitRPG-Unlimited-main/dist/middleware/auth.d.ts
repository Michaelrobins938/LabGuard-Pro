import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            user?: any;
        }
    }
}
declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const verifyToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const generateAuthToken: (id: string) => string;
export { authenticate, verifyToken, generateAuthToken };
//# sourceMappingURL=auth.d.ts.map
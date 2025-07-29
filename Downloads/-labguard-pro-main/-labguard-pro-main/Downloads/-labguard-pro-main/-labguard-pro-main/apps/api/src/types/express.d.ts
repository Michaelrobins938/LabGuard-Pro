import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        laboratoryId: string;
        role: UserRole;
        email: string;
      };
    }
  }
}

export {}; 
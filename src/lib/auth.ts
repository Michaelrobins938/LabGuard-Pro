import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

export interface JWTPayload {
  userId: string;
  laboratoryId: string;
  role: string;
  email: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(request: NextRequest): Promise<{
  success: boolean;
  user?: JWTPayload;
  error?: string;
}> {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No token provided' };
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);

    if (!user) {
      return { success: false, error: 'Invalid token' };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Authentication failed' };
  }
} 
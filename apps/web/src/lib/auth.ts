import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Only create Prisma client in runtime, not during build
const getPrisma = () => {
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    return null;
  }
  return new PrismaClient();
};
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

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { laboratory: true }
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.hashedPassword)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || `${user.firstName} ${user.lastName}`,
            role: user.role,
            laboratoryId: user.laboratoryId,
            laboratoryName: user.laboratory.name
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.laboratoryId = user.laboratoryId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.laboratoryId = token.laboratoryId as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  secret: process.env.NEXTAUTH_SECRET || JWT_SECRET
}; 
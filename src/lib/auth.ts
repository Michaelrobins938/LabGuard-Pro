import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        try {
          // Mock user for now - in real implementation, this would query the database
          const mockUser = {
            id: 'user-1',
            email: credentials.email,
            name: 'Test User',
            firstName: 'Test',
            lastName: 'User',
            role: 'USER',
            laboratoryId: 'lab-1',
            laboratoryName: 'Test Laboratory',
            emailVerified: true,
            hashedPassword: '$2b$10$mock.hash.for.testing'
          }

          // For now, accept any email/password combination
          // In real implementation, verify against database
          if (credentials.email && credentials.password) {
            return {
              id: mockUser.id,
              email: mockUser.email,
              name: mockUser.name,
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
              role: mockUser.role,
              laboratoryId: mockUser.laboratoryId,
              laboratoryName: mockUser.laboratoryName,
              emailVerified: mockUser.emailVerified
            }
          }

          throw new Error('Invalid credentials')
        } catch (error) {
          console.error('Authentication error:', error)
          throw error
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.laboratoryId = (user as any).laboratoryId
        token.laboratoryName = (user as any).laboratoryName
        token.emailVerified = (user as any).emailVerified
        token.firstName = (user as any).firstName
        token.lastName = (user as any).lastName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.laboratoryId = token.laboratoryId as string
        session.user.laboratoryName = token.laboratoryName as string
        ;(session.user as any).emailVerified = token.emailVerified as boolean
        ;(session.user as any).firstName = token.firstName as string
        ;(session.user as any).lastName = token.lastName as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV === 'production' ? undefined : 'labguard-pro-secret-key-2024-development')
} 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './db';
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

// Database user authentication functions
export async function authenticateUser(email: string, password: string): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        laboratory: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Check if user is active
    if (!user.isActive) {
      return { success: false, error: 'Account is deactivated' };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    
    return {
      success: true,
      user: {
        ...userData,
        laboratoryName: user.laboratory.name
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function createUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  laboratoryId: string;
  role?: string;
  phone?: string;
}): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName}`,
        laboratoryId: userData.laboratoryId,
        role: userData.role as any || 'TECHNICIAN',
        phone: userData.phone,
        emailVerified: false
      },
      include: {
        laboratory: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Return user data (excluding password)
    const { password: _, ...newUser } = user;
    
    return {
      success: true,
      user: {
        ...newUser,
        laboratoryName: user.laboratory.name
      }
    };
  } catch (error) {
    console.error('User creation error:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

// NextAuth configuration with real database integration
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
          // Use real authentication function
          const authResult = await authenticateUser(credentials.email, credentials.password);
          
          if (!authResult.success || !authResult.user) {
            throw new Error(authResult.error || 'Authentication failed');
          }

          const user = authResult.user;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            laboratoryId: user.laboratoryId,
            laboratoryName: user.laboratoryName,
            emailVerified: user.emailVerified,
            phone: user.phone
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
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
        token.phone = (user as any).phone
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
        ;(session.user as any).phone = token.phone as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET || 'labguard-pro-secret-key-2024-development'
} 
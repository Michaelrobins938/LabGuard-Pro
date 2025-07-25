import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AuthService } from './auth-service'

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
          // Find user by email
          const user = await AuthService.findUserByEmail(credentials.email)

          if (!user || !user.hashedPassword) {
            throw new Error('Invalid credentials')
          }

          // Check if account is active
          if (!user.isActive || user.deletedAt) {
            throw new Error('Account is deactivated')
          }

          // Check if laboratory is active
          if (!user.laboratory?.isActive) {
            throw new Error('Laboratory account is deactivated')
          }

          // Check if account is locked
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new Error('Account is temporarily locked due to too many failed login attempts')
          }

          // Verify password
          const isPasswordValid = await AuthService.comparePassword(
            credentials.password,
            user.hashedPassword
          )

          if (!isPasswordValid) {
            // Increment failed login attempts
            await AuthService.incrementFailedLoginAttempts(user.id)
            throw new Error('Invalid credentials')
          }

          // Reset failed login attempts on successful login
          await AuthService.resetFailedLoginAttempts(user.id)

          // Update last login
          await AuthService.updateLastLogin(user.id)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            laboratoryId: user.laboratoryId,
            laboratoryName: user.laboratory.name,
            emailVerified: user.emailVerified
          }
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
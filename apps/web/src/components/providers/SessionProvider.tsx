'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

interface SessionProviderProps {
  children: React.ReactNode
}

// Mock session data for temporary access
const mockSession = {
  data: {
    user: {
      id: 'mock-user-id',
      email: 'demo@labguardpro.com',
      name: 'Demo User',
      role: 'ADMIN',
      laboratoryId: 'demo-lab'
    },
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
  },
  status: 'authenticated' as const
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={mockSession.data}>
      {children}
    </NextAuthSessionProvider>
  )
} 
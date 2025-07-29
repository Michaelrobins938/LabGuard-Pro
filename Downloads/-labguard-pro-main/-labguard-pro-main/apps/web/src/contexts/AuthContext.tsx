'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { apiClient } from '@/lib/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  laboratoryId?: string
  laboratory?: {
    id: string
    name: string
    type?: string
    planType: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  register: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    laboratoryName: string
    laboratoryType?: string
    role?: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing token on mount
  useEffect(() => {
    const token = apiClient.getAuthToken()
    if (token) {
      refreshUser()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true)
      const response = await apiClient.login(credentials)
      
      if (response.success && response.token) {
        apiClient.setAuthToken(response.token)
        if (response.user) {
          setUser(response.user)
          localStorage.setItem('labguard_user', JSON.stringify(response.user))
        }
        return { success: true }
      } else {
        return { success: false, error: response.error || 'Login failed' }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed'
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    laboratoryName: string
    laboratoryType?: string
    role?: string
  }) => {
    try {
      setLoading(true)
      const response = await apiClient.register(userData)
      
      if (response.success && response.token) {
        apiClient.setAuthToken(response.token)
        if (response.user) {
          setUser(response.user)
          localStorage.setItem('labguard_user', JSON.stringify(response.user))
        }
        return { success: true }
      } else {
        return { success: false, error: response.error || 'Registration failed' }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed'
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      apiClient.removeAuthToken()
      setUser(null)
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiClient.getProfile()
      if (response.success && response.user) {
        setUser(response.user)
      } else {
        throw new Error('Failed to get user profile')
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
      apiClient.removeAuthToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
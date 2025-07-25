import { useState, useEffect, createContext, useContext } from 'react'
import { apiService } from '@/lib/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  laboratoryId?: string
  laboratoryName?: string
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
    const token = localStorage.getItem('auth-token')
    if (token) {
      refreshUser()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true)
      const response = await apiService.auth.login(credentials)
      
      if (response.data.token) {
        localStorage.setItem('auth-token', response.data.token)
        setUser(response.data.user)
        return { success: true }
      } else {
        return { success: false, error: 'No token received' }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
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
      const response = await apiService.auth.register(userData)
      
      if (response.data.token) {
        localStorage.setItem('auth-token', response.data.token)
        setUser(response.data.user)
        return { success: true }
      } else {
        return { success: false, error: 'No token received' }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiService.auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth-token')
      setUser(null)
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiService.auth.getProfile()
      setUser(response.data)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      localStorage.removeItem('auth-token')
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
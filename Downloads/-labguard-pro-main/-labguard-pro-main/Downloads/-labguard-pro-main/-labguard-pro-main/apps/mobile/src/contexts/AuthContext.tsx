import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authAPI } from '../services/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  laboratoryId: string
  laboratoryName: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  laboratoryName: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken')
      if (token) {
        // Verify token and get user data
        await refreshUser()
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authAPI.login({ email, password })
      const { token, user: userData } = response.data

      await AsyncStorage.setItem('authToken', token)
      setUser(userData)
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await authAPI.register(userData)
      const { token, user: newUser } = response.data

      await AsyncStorage.setItem('authToken', token)
      setUser(newUser)
    } catch (error: any) {
      console.error('Registration error:', error)
      throw new Error(error.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      await AsyncStorage.removeItem('authToken')
      setUser(null)
    }
  }

  const refreshUser = async () => {
    try {
      const response = await authAPI.refreshToken()
      const { user: userData } = response.data
      setUser(userData)
    } catch (error) {
      console.error('Error refreshing user:', error)
      await AsyncStorage.removeItem('authToken')
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
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
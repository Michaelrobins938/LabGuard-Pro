'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { apiService } from '@/lib/api'
import { toast } from 'sonner'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'calibration' | 'equipment' | 'compliance' | 'system' | 'team'
  isRead: boolean
  createdAt: string
  data?: any
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  refreshNotifications: () => Promise<void>
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [ws, setWs] = useState<WebSocket | null>(null)

  // Fetch notifications on mount
  const fetchNotifications = useCallback(async () => {
    if (!session?.user) return

    try {
      const response = await apiService.notifications.getAll({ limit: 50 })
      const data = response.data
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }, [session?.user])

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await apiService.notifications.markAsRead(id)
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await apiService.notifications.markAllAsRead()
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await apiService.notifications.delete(id)
      setNotifications(prev => prev.filter(notification => notification.id !== id))
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === id)
        return notification && !notification.isRead ? Math.max(0, prev - 1) : prev
      })
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }, [notifications])

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications()
  }, [fetchNotifications])

  // Add notification locally
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
    setUnreadCount(prev => prev + 1)

    // Show toast notification
    const toastType = notification.type === 'error' ? 'error' : 
                     notification.type === 'warning' ? 'warning' : 
                     notification.type === 'success' ? 'success' : 'info'
    
    toast[toastType](notification.title, {
      description: notification.message,
      duration: notification.type === 'error' ? 8000 : 5000,
    })
  }, [])

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!session?.user) return

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
    const websocket = new WebSocket(`${wsUrl}/notifications`)

    websocket.onopen = () => {
      console.log('WebSocket connected for notifications')
      // Send authentication
      websocket.send(JSON.stringify({
        type: 'auth',
        token: localStorage.getItem('auth-token')
      }))
    }

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'notification') {
          addNotification({
            title: data.title,
            message: data.message,
            type: data.notificationType || 'info',
            category: data.category || 'system',
            data: data.data
          })
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    websocket.onclose = () => {
      console.log('WebSocket disconnected')
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (session?.user) {
          setWs(new WebSocket(`${wsUrl}/notifications`))
        }
      }, 5000)
    }

    setWs(websocket)

    return () => {
      websocket.close()
    }
  }, [session?.user, addNotification])

  // Fetch notifications on mount and when session changes
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Set up periodic refresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (session?.user) {
        fetchNotifications()
      }
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [fetchNotifications, session?.user])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    addNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
} 
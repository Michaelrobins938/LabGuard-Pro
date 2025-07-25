'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, CheckCircle, AlertTriangle, Info, X, Eye, EyeOff } from 'lucide-react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  priority: string
  createdAt: string
}

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications?limit=10')
      const data = await response.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.notifications?.filter((n: Notification) => !n.isRead).length || 0)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      })
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAsUnread = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/unread`, {
        method: 'POST'
      })
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: false } : n
        )
      )
      setUnreadCount(prev => prev + 1)
    } catch (error) {
      console.error('Error marking notification as unread:', error)
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'NORMAL':
        return <Info className="w-4 h-4 text-blue-500" />
      case 'LOW':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CALIBRATION_DUE':
      case 'CALIBRATION_OVERDUE':
        return 'bg-orange-100 text-orange-800'
      case 'EQUIPMENT_FAILURE':
        return 'bg-red-100 text-red-800'
      case 'COMPLIANCE_ALERT':
        return 'bg-yellow-100 text-yellow-800'
      case 'SYSTEM_NOTIFICATION':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (!isOpen) return null

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50" ref={dropdownRef}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {unreadCount > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getPriorityIcon(notification.priority)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(notification.type)}`}>
                          {notification.type.replace('_', ' ')}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          {notification.isRead ? (
                            <button
                              onClick={() => markAsUnread(notification.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Mark as unread"
                            >
                              <EyeOff className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Mark as read"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <a 
          href="/dashboard/notifications" 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all notifications
        </a>
      </div>
    </div>
  )
} 
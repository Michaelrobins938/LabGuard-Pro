import { useState, useEffect, useCallback, useRef } from 'react'
import { useDashboardStore } from '@/stores/dashboardStore'

interface RealTimeConfig {
  enabled: boolean
  reconnectInterval: number
  maxReconnectAttempts: number
  heartbeatInterval: number
}

interface WebSocketMessage {
  type: 'equipment_update' | 'calibration_update' | 'ai_insight' | 'notification' | 'system_alert' | 'heartbeat'
  data: any
  timestamp: string
  laboratoryId?: string
}

interface RealTimeStats {
  connected: boolean
  lastMessage: string | null
  messageCount: number
  errorCount: number
  reconnectAttempts: number
  latency: number | null
}

export function useRealTimeData(config: Partial<RealTimeConfig> = {}) {
  const {
    enabled = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 10,
    heartbeatInterval = 30000
  } = config

  const { user, equipment, calibrations, aiInsights, notifications } = useDashboardStore()
  const {
    updateEquipmentStatus,
    updateCalibrationStatus,
    addAIInsight,
    addNotification
  } = useDashboardStore()

  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<RealTimeStats>({
    connected: false,
    lastMessage: null,
    messageCount: 0,
    errorCount: 0,
    reconnectAttempts: 0,
    latency: null
  })

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const lastHeartbeatRef = useRef<number>(Date.now())

  const connect = useCallback(() => {
    if (!enabled || !user?.laboratory?.id) return

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://api.labguard-pro.com/ws'
      const ws = new WebSocket(`${wsUrl}?laboratory=${user.laboratory.id}&token=${localStorage.getItem('labguard_token')}`)
      
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
        setStats(prev => ({
          ...prev,
          connected: true,
          reconnectAttempts: 0
        }))

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'heartbeat',
              timestamp: Date.now()
            }))
            lastHeartbeatRef.current = Date.now()
          }
        }, heartbeatInterval)
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          const receiveTime = Date.now()
          
          setStats(prev => ({
            ...prev,
            lastMessage: new Date().toISOString(),
            messageCount: prev.messageCount + 1,
            latency: message.type === 'heartbeat' ? receiveTime - lastHeartbeatRef.current : prev.latency
          }))

          handleMessage(message)
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
          setStats(prev => ({
            ...prev,
            errorCount: prev.errorCount + 1
          }))
        }
      }

      ws.onerror = (event) => {
        console.error('WebSocket error:', event)
        setError('Connection error occurred')
        setStats(prev => ({
          ...prev,
          errorCount: prev.errorCount + 1
        }))
      }

      ws.onclose = (event) => {
        setIsConnected(false)
        setStats(prev => ({
          ...prev,
          connected: false
        }))

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current)
          heartbeatIntervalRef.current = null
        }

        // Attempt to reconnect if not a clean close
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          setStats(prev => ({
            ...prev,
            reconnectAttempts: reconnectAttemptsRef.current
          }))

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }
    } catch (err) {
      console.error('Error creating WebSocket connection:', err)
      setError('Failed to establish connection')
    }
  }, [enabled, user?.laboratory?.id, reconnectInterval, maxReconnectAttempts, heartbeatInterval])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect')
      wsRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }

    setIsConnected(false)
    setError(null)
    setStats({
      connected: false,
      lastMessage: null,
      messageCount: 0,
      errorCount: 0,
      reconnectAttempts: 0,
      latency: null
    })
  }, [])

  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: new Date().toISOString()
      }
      wsRef.current.send(JSON.stringify(fullMessage))
      return true
    }
    return false
  }, [])

  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'equipment_update':
        if (message.data?.equipmentId && message.data?.status) {
          updateEquipmentStatus(message.data.equipmentId, message.data.status)
        }
        break

      case 'calibration_update':
        if (message.data?.calibrationId && message.data?.status) {
          updateCalibrationStatus(message.data.calibrationId, message.data.status)
        }
        break

      case 'ai_insight':
        if (message.data?.insight) {
          addAIInsight(message.data.insight)
        }
        break

      case 'notification':
        if (message.data?.notification) {
          addNotification(message.data.notification)
        }
        break

      case 'system_alert':
        // Handle system alerts (could trigger notifications, sounds, etc.)
        console.log('System alert received:', message.data)
        break

      case 'heartbeat':
        // Heartbeat response - latency already calculated
        break

      default:
        console.log('Unknown message type:', message.type)
    }
  }, [updateEquipmentStatus, updateCalibrationStatus, addAIInsight, addNotification])

  // Polling fallback when WebSocket is not available
  const startPolling = useCallback(() => {
    if (!enabled || isConnected) return

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/realtime/poll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            laboratory: user?.laboratory?.id,
            lastUpdate: stats.lastMessage
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.updates && data.updates.length > 0) {
            data.updates.forEach((update: WebSocketMessage) => {
              handleMessage(update)
            })
          }
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(pollInterval)
  }, [enabled, isConnected, user?.laboratory?.id, stats.lastMessage, handleMessage])

  // Connection management
  useEffect(() => {
    if (enabled && user?.laboratory?.id) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, user?.laboratory?.id, connect, disconnect])

  // Polling fallback
  useEffect(() => {
    if (!isConnected && enabled) {
      const cleanup = startPolling()
      return cleanup
    }
  }, [isConnected, enabled, startPolling])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    isConnected,
    error,
    stats,
    sendMessage,
    connect,
    disconnect
  }
}

// Hook for specific real-time data subscriptions
export function useEquipmentUpdates() {
  const { equipment } = useDashboardStore()
  const [updates, setUpdates] = useState<any[]>([])

  useEffect(() => {
    // Filter for equipment-specific updates
    // This could be enhanced with more specific filtering logic
  }, [equipment])

  return updates
}

export function useCalibrationUpdates() {
  const { calibrations } = useDashboardStore()
  const [updates, setUpdates] = useState<any[]>([])

  useEffect(() => {
    // Filter for calibration-specific updates
  }, [calibrations])

  return updates
}

export function useAIInsightUpdates() {
  const { aiInsights } = useDashboardStore()
  const [updates, setUpdates] = useState<any[]>([])

  useEffect(() => {
    // Filter for AI insight updates
  }, [aiInsights])

  return updates
}

// Utility hook for real-time notifications
export function useRealTimeNotifications() {
  const { notifications } = useDashboardStore()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length
    setUnreadCount(unread)
  }, [notifications])

  return {
    notifications,
    unreadCount,
    markAsRead: (id: string) => {
      // Implementation for marking notifications as read
    }
  }
}
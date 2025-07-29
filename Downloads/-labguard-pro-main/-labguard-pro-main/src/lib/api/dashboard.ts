import { useDashboardStore } from '@/stores/dashboardStore'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.labguard-pro.com'
const API_TIMEOUT = 30000 // 30 seconds

// Request headers with authentication
const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('labguard_token')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'X-Client-Version': '2.1.0',
    'X-Request-ID': generateRequestId()
  }
}

// Generate unique request ID for tracking
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Enhanced fetch with timeout and error handling
const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

// Dashboard API Service
export class DashboardAPIService {
  // Equipment Management
  static async fetchEquipment(laboratoryId: string): Promise<any[]> {
    try {
      const response = await apiFetch(`/api/equipment?laboratory=${laboratoryId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching equipment:', error)
      throw new Error('Failed to fetch equipment data')
    }
  }

  static async updateEquipmentStatus(equipmentId: string, status: string): Promise<void> {
    try {
      await apiFetch(`/api/equipment/${equipmentId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
    } catch (error) {
      console.error('Error updating equipment status:', error)
      throw new Error('Failed to update equipment status')
    }
  }

  static async addEquipment(equipmentData: any): Promise<any> {
    try {
      const response = await apiFetch('/api/equipment', {
        method: 'POST',
        body: JSON.stringify(equipmentData)
      })
      return await response.json()
    } catch (error) {
      console.error('Error adding equipment:', error)
      throw new Error('Failed to add equipment')
    }
  }

  // Calibration Management
  static async fetchCalibrations(laboratoryId: string): Promise<any[]> {
    try {
      const response = await apiFetch(`/api/calibrations?laboratory=${laboratoryId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching calibrations:', error)
      throw new Error('Failed to fetch calibration data')
    }
  }

  static async updateCalibrationStatus(calibrationId: string, status: string): Promise<void> {
    try {
      await apiFetch(`/api/calibrations/${calibrationId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
    } catch (error) {
      console.error('Error updating calibration status:', error)
      throw new Error('Failed to update calibration status')
    }
  }

  static async scheduleCalibration(calibrationData: any): Promise<any> {
    try {
      const response = await apiFetch('/api/calibrations', {
        method: 'POST',
        body: JSON.stringify(calibrationData)
      })
      return await response.json()
    } catch (error) {
      console.error('Error scheduling calibration:', error)
      throw new Error('Failed to schedule calibration')
    }
  }

  // AI Insights
  static async fetchAIInsights(laboratoryId: string): Promise<any[]> {
    try {
      const response = await apiFetch(`/api/ai/insights?laboratory=${laboratoryId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching AI insights:', error)
      throw new Error('Failed to fetch AI insights')
    }
  }

  static async implementAIInsight(insightId: string, implementationData: any): Promise<void> {
    try {
      await apiFetch(`/api/ai/insights/${insightId}/implement`, {
        method: 'POST',
        body: JSON.stringify(implementationData)
      })
    } catch (error) {
      console.error('Error implementing AI insight:', error)
      throw new Error('Failed to implement AI insight')
    }
  }

  // Notifications
  static async fetchNotifications(laboratoryId: string): Promise<any[]> {
    try {
      const response = await apiFetch(`/api/notifications?laboratory=${laboratoryId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw new Error('Failed to fetch notifications')
    }
  }

  static async markNotificationRead(notificationId: string): Promise<void> {
    try {
      await apiFetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw new Error('Failed to mark notification as read')
    }
  }

  // Analytics and Reports
  static async fetchAnalytics(laboratoryId: string, timeRange: string): Promise<any> {
    try {
      const response = await apiFetch(`/api/analytics?laboratory=${laboratoryId}&timeRange=${timeRange}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching analytics:', error)
      throw new Error('Failed to fetch analytics data')
    }
  }

  static async generateReport(reportData: any): Promise<any> {
    try {
      const response = await apiFetch('/api/reports/generate', {
        method: 'POST',
        body: JSON.stringify(reportData)
      })
      return await response.json()
    } catch (error) {
      console.error('Error generating report:', error)
      throw new Error('Failed to generate report')
    }
  }

  // Real-time Data
  static async fetchRealTimeUpdates(laboratoryId: string, lastUpdate?: string): Promise<any> {
    try {
      const params = new URLSearchParams({ laboratory: laboratoryId })
      if (lastUpdate) params.append('lastUpdate', lastUpdate)

      const response = await apiFetch(`/api/realtime/updates?${params}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching real-time updates:', error)
      throw new Error('Failed to fetch real-time updates')
    }
  }

  // Team Management
  static async fetchTeamMembers(laboratoryId: string): Promise<any[]> {
    try {
      const response = await apiFetch(`/api/team/members?laboratory=${laboratoryId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching team members:', error)
      throw new Error('Failed to fetch team members')
    }
  }

  static async inviteTeamMember(inviteData: any): Promise<any> {
    try {
      const response = await apiFetch('/api/team/invite', {
        method: 'POST',
        body: JSON.stringify(inviteData)
      })
      return await response.json()
    } catch (error) {
      console.error('Error inviting team member:', error)
      throw new Error('Failed to invite team member')
    }
  }

  // System Health and Monitoring
  static async fetchSystemHealth(laboratoryId: string): Promise<any> {
    try {
      const response = await apiFetch(`/api/system/health?laboratory=${laboratoryId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching system health:', error)
      throw new Error('Failed to fetch system health')
    }
  }

  static async fetchSystemMetrics(laboratoryId: string): Promise<any> {
    try {
      const response = await apiFetch(`/api/system/metrics?laboratory=${laboratoryId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching system metrics:', error)
      throw new Error('Failed to fetch system metrics')
    }
  }

  // Compliance and Audit
  static async fetchComplianceStatus(laboratoryId: string): Promise<any> {
    try {
      const response = await apiFetch(`/api/compliance/status?laboratory=${laboratoryId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching compliance status:', error)
      throw new Error('Failed to fetch compliance status')
    }
  }

  static async fetchAuditLogs(laboratoryId: string, filters?: any): Promise<any[]> {
    try {
      const params = new URLSearchParams({ laboratory: laboratoryId })
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value.toString())
        })
      }

      const response = await apiFetch(`/api/audit/logs?${params}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      throw new Error('Failed to fetch audit logs')
    }
  }

  // Bulk Operations
  static async bulkUpdateEquipment(updates: any[]): Promise<any> {
    try {
      const response = await apiFetch('/api/equipment/bulk-update', {
        method: 'PATCH',
        body: JSON.stringify({ updates })
      })
      return await response.json()
    } catch (error) {
      console.error('Error bulk updating equipment:', error)
      throw new Error('Failed to bulk update equipment')
    }
  }

  static async bulkScheduleCalibrations(calibrations: any[]): Promise<any> {
    try {
      const response = await apiFetch('/api/calibrations/bulk-schedule', {
        method: 'POST',
        body: JSON.stringify({ calibrations })
      })
      return await response.json()
    } catch (error) {
      console.error('Error bulk scheduling calibrations:', error)
      throw new Error('Failed to bulk schedule calibrations')
    }
  }

  // Data Export
  static async exportData(exportConfig: any): Promise<Blob> {
    try {
      const response = await apiFetch('/api/export', {
        method: 'POST',
        body: JSON.stringify(exportConfig)
      })
      return await response.blob()
    } catch (error) {
      console.error('Error exporting data:', error)
      throw new Error('Failed to export data')
    }
  }

  // Settings and Configuration
  static async fetchUserSettings(userId: string): Promise<any> {
    try {
      const response = await apiFetch(`/api/users/${userId}/settings`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching user settings:', error)
      throw new Error('Failed to fetch user settings')
    }
  }

  static async updateUserSettings(userId: string, settings: any): Promise<void> {
    try {
      await apiFetch(`/api/users/${userId}/settings`, {
        method: 'PATCH',
        body: JSON.stringify(settings)
      })
    } catch (error) {
      console.error('Error updating user settings:', error)
      throw new Error('Failed to update user settings')
    }
  }

  // Laboratory Configuration
  static async fetchLaboratoryConfig(laboratoryId: string): Promise<any> {
    try {
      const response = await apiFetch(`/api/laboratories/${laboratoryId}/config`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching laboratory config:', error)
      throw new Error('Failed to fetch laboratory configuration')
    }
  }

  static async updateLaboratoryConfig(laboratoryId: string, config: any): Promise<void> {
    try {
      await apiFetch(`/api/laboratories/${laboratoryId}/config`, {
        method: 'PATCH',
        body: JSON.stringify(config)
      })
    } catch (error) {
      console.error('Error updating laboratory config:', error)
      throw new Error('Failed to update laboratory configuration')
    }
  }
}

// React hooks for API integration
export function useDashboardAPI() {
  const { user } = useDashboardStore()

  const fetchEquipment = async () => {
    if (!user?.laboratory?.id) throw new Error('No laboratory ID available')
    return await DashboardAPIService.fetchEquipment(user.laboratory.id)
  }

  const fetchCalibrations = async () => {
    if (!user?.laboratory?.id) throw new Error('No laboratory ID available')
    return await DashboardAPIService.fetchCalibrations(user.laboratory.id)
  }

  const fetchAIInsights = async () => {
    if (!user?.laboratory?.id) throw new Error('No laboratory ID available')
    return await DashboardAPIService.fetchAIInsights(user.laboratory.id)
  }

  const fetchNotifications = async () => {
    if (!user?.laboratory?.id) throw new Error('No laboratory ID available')
    return await DashboardAPIService.fetchNotifications(user.laboratory.id)
  }

  const fetchAnalytics = async (timeRange: string) => {
    if (!user?.laboratory?.id) throw new Error('No laboratory ID available')
    return await DashboardAPIService.fetchAnalytics(user.laboratory.id, timeRange)
  }

  const fetchTeamMembers = async () => {
    if (!user?.laboratory?.id) throw new Error('No laboratory ID available')
    return await DashboardAPIService.fetchTeamMembers(user.laboratory.id)
  }

  const fetchSystemHealth = async () => {
    if (!user?.laboratory?.id) throw new Error('No laboratory ID available')
    return await DashboardAPIService.fetchSystemHealth(user.laboratory.id)
  }

  const fetchComplianceStatus = async () => {
    if (!user?.laboratory?.id) throw new Error('No laboratory ID available')
    return await DashboardAPIService.fetchComplianceStatus(user.laboratory.id)
  }

  return {
    fetchEquipment,
    fetchCalibrations,
    fetchAIInsights,
    fetchNotifications,
    fetchAnalytics,
    fetchTeamMembers,
    fetchSystemHealth,
    fetchComplianceStatus,
    updateEquipmentStatus: DashboardAPIService.updateEquipmentStatus,
    updateCalibrationStatus: DashboardAPIService.updateCalibrationStatus,
    addEquipment: DashboardAPIService.addEquipment,
    scheduleCalibration: DashboardAPIService.scheduleCalibration,
    implementAIInsight: DashboardAPIService.implementAIInsight,
    markNotificationRead: DashboardAPIService.markNotificationRead,
    generateReport: DashboardAPIService.generateReport,
    inviteTeamMember: DashboardAPIService.inviteTeamMember,
    exportData: DashboardAPIService.exportData,
    fetchUserSettings: DashboardAPIService.fetchUserSettings,
    updateUserSettings: DashboardAPIService.updateUserSettings,
    fetchLaboratoryConfig: DashboardAPIService.fetchLaboratoryConfig,
    updateLaboratoryConfig: DashboardAPIService.updateLaboratoryConfig
  }
}

// Error handling utilities
export class DashboardAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string,
    public timestamp?: string
  ) {
    super(message)
    this.name = 'DashboardAPIError'
    this.timestamp = timestamp || new Date().toISOString()
  }
}

// Retry logic for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        throw lastError
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }

  throw lastError!
}
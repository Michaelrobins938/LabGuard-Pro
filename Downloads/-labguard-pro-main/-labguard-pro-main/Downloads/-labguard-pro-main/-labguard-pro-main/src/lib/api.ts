import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// API service functions
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      api.post('/auth/login', credentials),
    register: (userData: {
      email: string
      password: string
      firstName: string
      lastName: string
      laboratoryName: string
    }) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    refreshToken: () => api.post('/auth/refresh'),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (profileData: any) => api.put('/auth/profile', profileData),
    updatePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
      api.put('/auth/password', passwordData),
  },

  // Equipment endpoints
  equipment: {
    getAll: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
      api.get('/equipment', { params }),
    getById: (id: string) => api.get(`/equipment/${id}`),
    create: (equipmentData: any) => api.post('/equipment', equipmentData),
    update: (id: string, equipmentData: any) => api.put(`/equipment/${id}`, equipmentData),
    delete: (id: string) => api.delete(`/equipment/${id}`),
    getStats: () => api.get('/equipment/stats'),
    getCalibrationHistory: (id: string) => api.get(`/equipment/${id}/calibrations`),
  },

  // Calibration endpoints
  calibration: {
    getAll: (params?: { page?: number; limit?: number; status?: string; equipmentId?: string }) =>
      api.get('/calibration', { params }),
    getById: (id: string) => api.get(`/calibration/${id}`),
    create: (calibrationData: any) => api.post('/calibration', calibrationData),
    update: (id: string, calibrationData: any) => api.put(`/calibration/${id}`, calibrationData),
    delete: (id: string) => api.delete(`/calibration/${id}`),
    validate: (validationData: any) => api.post('/calibration/validate', validationData),
    generateReport: (id: string) => api.post(`/calibration/${id}/report`),
    getDue: () => api.get('/calibration/due'),
    getOverdue: () => api.get('/calibration/overdue'),
  },

  // Reports endpoints
  reports: {
    getAll: (params?: { page?: number; limit?: number; type?: string; status?: string }) =>
      api.get('/reports', { params }),
    getById: (id: string) => api.get(`/reports/${id}`),
    generate: (reportData: any) => api.post('/reports/generate', reportData),
    export: (id: string, format: 'pdf' | 'excel' = 'pdf') =>
      api.get(`/reports/${id}/export`, { params: { format } }),
    getTemplates: () => api.get('/reports/templates'),
    getAnalytics: (params?: { startDate?: string; endDate?: string; type?: string }) =>
      api.get('/reports/analytics', { params }),
  },

  // Dashboard endpoints
  dashboard: {
    getStats: () => api.get('/dashboard/stats'),
    getRecentActivity: (limit: number = 10) => api.get('/dashboard/activity', { params: { limit } }),
    getComplianceOverview: () => api.get('/dashboard/compliance'),
    getEquipmentStatus: () => api.get('/dashboard/equipment-status'),
    getCalibrationSchedule: () => api.get('/dashboard/calibration-schedule'),
  },

  // Notifications endpoints
  notifications: {
    getAll: (params?: { page?: number; limit?: number; unread?: boolean }) =>
      api.get('/notifications', { params }),
    getById: (id: string) => api.get(`/notifications/${id}`),
    markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id: string) => api.delete(`/notifications/${id}`),
    getUnreadCount: () => api.get('/notifications/unread-count'),
    updatePreferences: (preferences: any) => api.put('/notifications/preferences', preferences),
  },

  // Team management endpoints
  team: {
    getAll: (params?: { page?: number; limit?: number; role?: string }) =>
      api.get('/team', { params }),
    getById: (id: string) => api.get(`/team/${id}`),
    invite: (inviteData: { email: string; role: string; message?: string }) =>
      api.post('/team/invite', inviteData),
    updateRole: (id: string, role: string) => api.put(`/team/${id}/role`, { role }),
    remove: (id: string) => api.delete(`/team/${id}`),
    getInvitations: () => api.get('/team/invitations'),
    acceptInvitation: (token: string) => api.post('/team/invitations/accept', { token }),
    declineInvitation: (token: string) => api.post('/team/invitations/decline', { token }),
  },

  // Billing endpoints
  billing: {
    getSubscription: () => api.get('/billing/subscription'),
    updateSubscription: (planId: string) => api.put('/billing/subscription', { planId }),
    cancelSubscription: () => api.post('/billing/subscription/cancel'),
    getInvoices: (params?: { page?: number; limit?: number }) =>
      api.get('/billing/invoices', { params }),
    getInvoice: (id: string) => api.get(`/billing/invoices/${id}`),
    downloadInvoice: (id: string) => api.get(`/billing/invoices/${id}/download`),
    getPaymentMethods: () => api.get('/billing/payment-methods'),
    addPaymentMethod: (paymentMethodData: any) =>
      api.post('/billing/payment-methods', paymentMethodData),
    removePaymentMethod: (id: string) => api.delete(`/billing/payment-methods/${id}`),
    getUsage: (params?: { startDate?: string; endDate?: string }) =>
      api.get('/billing/usage', { params }),
  },

  // Settings endpoints
  settings: {
    getLaboratory: () => api.get('/settings/laboratory'),
    updateLaboratory: (laboratoryData: any) => api.put('/settings/laboratory', laboratoryData),
    getBranding: () => api.get('/settings/branding'),
    updateBranding: (brandingData: any) => api.put('/settings/branding', brandingData),
    getIntegrations: () => api.get('/settings/integrations'),
    updateIntegrations: (integrationsData: any) =>
      api.put('/settings/integrations', integrationsData),
    getEmailTemplates: () => api.get('/settings/email-templates'),
    updateEmailTemplate: (id: string, templateData: any) =>
      api.put(`/settings/email-templates/${id}`, templateData),
  },

  // AI/Compliance endpoints
  ai: {
    validateCalibration: (validationData: any) =>
      api.post('/ai/calibration/validate', validationData),
    generateReport: (reportData: any) => api.post('/ai/reports/generate', reportData),
    analyzeCompliance: (complianceData: any) =>
      api.post('/ai/compliance/analyze', complianceData),
    getTemplates: () => api.get('/ai/templates'),
    getUsage: (params?: { startDate?: string; endDate?: string }) =>
      api.get('/ai/usage', { params }),
  },

  // Analytics endpoints
  analytics: {
    getEquipmentAnalytics: (params?: { startDate?: string; endDate?: string }) =>
      api.get('/analytics/equipment', { params }),
    getCalibrationAnalytics: (params?: { startDate?: string; endDate?: string }) =>
      api.get('/analytics/calibration', { params }),
    getComplianceAnalytics: (params?: { startDate?: string; endDate?: string }) =>
      api.get('/analytics/compliance', { params }),
    getUserAnalytics: (params?: { startDate?: string; endDate?: string }) =>
      api.get('/analytics/users', { params }),
    getCustomReport: (reportData: any) => api.post('/analytics/custom-report', reportData),
  },

  // File upload endpoints
  files: {
    upload: (file: File, type: string) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      return api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    delete: (id: string) => api.delete(`/files/${id}`),
    getById: (id: string) => api.get(`/files/${id}`),
  },

  // Audit log endpoints
  audit: {
    getLogs: (params?: { page?: number; limit?: number; action?: string; userId?: string }) =>
      api.get('/audit/logs', { params }),
    exportLogs: (params?: { startDate?: string; endDate?: string; format?: string }) =>
      api.get('/audit/logs/export', { params }),
  },
}

// Utility functions for common API operations
export const apiUtils = {
  // Handle API errors consistently
  handleError: (error: any) => {
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    if (error.message) {
      return error.message
    }
    return 'An unexpected error occurred'
  },

  // Format API response data
  formatResponse: (response: AxiosResponse) => {
    return response.data
  },

  // Check if response is successful
  isSuccess: (response: AxiosResponse) => {
    return response.status >= 200 && response.status < 300
  },

  // Get pagination info from response headers
  getPaginationInfo: (response: AxiosResponse) => {
    const total = response.headers['x-total-count']
    const page = response.headers['x-page']
    const limit = response.headers['x-limit']
    
    return {
      total: total ? parseInt(total) : 0,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    }
  },
}

// Export the axios instance for direct use if needed
export { api }

// Export types for better TypeScript support
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code?: string
  details?: any
} 
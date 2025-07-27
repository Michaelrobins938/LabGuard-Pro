import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export const apiService = {
  // Auth endpoints
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const response = await apiClient.post('/api/auth/login', credentials)
      return response.data
    },
    register: async (userData: any) => {
      const response = await apiClient.post('/api/auth/register', userData)
      return response.data
    },
    logout: async () => {
      const response = await apiClient.post('/api/auth/logout')
      return response.data
    },
    refreshToken: async () => {
      const response = await apiClient.post('/api/auth/refresh')
      return response.data
    },
  },

  // Equipment endpoints moved to later section with more comprehensive implementation

  // Calibration endpoints
  calibration: {
    getAll: async (params?: any) => {
      const response = await apiClient.get('/api/calibrations', { params })
      return response.data
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/api/calibrations/${id}`)
      return response.data
    },
    create: async (data: any) => {
      const response = await apiClient.post('/api/calibrations', data)
      return response.data
    },
    update: async (id: string, data: any) => {
      const response = await apiClient.put(`/api/calibrations/${id}`, data)
      return response.data
    },
    delete: async (id: string) => {
      const response = await apiClient.delete(`/api/calibrations/${id}`)
      return response.data
    },
    performCalibration: async (id: string, data: any) => {
      const response = await apiClient.post(`/api/calibrations/${id}/perform`, data)
      return response.data
    },
  },

  // Reports endpoints
  reports: {
    getAll: async (params?: any) => {
      const response = await apiClient.get('/api/reports', { params })
      return response.data
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/api/reports/${id}`)
      return response.data
    },
    create: async (data: any) => {
      const response = await apiClient.post('/api/reports', data)
      return response.data
    },
    generatePDF: async (id: string) => {
      const response = await apiClient.get(`/api/reports/${id}/pdf`)
      return response.data
    },
  },

  // Team endpoints
  team: {
    getMembers: async (params?: any) => {
      const response = await apiClient.get('/api/team/members', { params })
      return response.data
    },
    inviteMember: async (data: any) => {
      const response = await apiClient.post('/api/team/invite', data)
      return response.data
    },
    updateMember: async (id: string, data: any) => {
      const response = await apiClient.put(`/api/team/members/${id}`, data)
      return response.data
    },
    removeMember: async (id: string) => {
      const response = await apiClient.delete(`/api/team/members/${id}`)
      return response.data
    },
  },

  // Notifications endpoints
  notifications: {
    getAll: async (params?: any) => {
      const response = await apiClient.get('/api/notifications', { params })
      return response.data
    },
    markAsRead: async (id: string) => {
      const response = await apiClient.put(`/api/notifications/${id}/read`)
      return response.data
    },
    markAllAsRead: async () => {
      const response = await apiClient.put('/api/notifications/read-all')
      return response.data
    },
    getPreferences: async () => {
      const response = await apiClient.get('/api/notifications/preferences')
      return response.data
    },
    updatePreferences: async (data: any) => {
      const response = await apiClient.put('/api/notifications/preferences', data)
      return response.data
    },
  },

  // Billing endpoints
  billing: {
    getSubscription: async () => {
      const response = await apiClient.get('/api/billing/subscription')
      return response.data
    },
    getPlans: async () => {
      const response = await apiClient.get('/api/billing/plans')
      return response.data
    },
    createSubscription: async (data: any) => {
      const response = await apiClient.post('/api/billing/subscriptions', data)
      return response.data
    },
    upgradeSubscription: async (planId: string) => {
      const response = await apiClient.put(`/api/billing/subscriptions/${planId}`)
      return response.data
    },
    cancelSubscription: async (id: string) => {
      const response = await apiClient.post(`/api/billing/subscriptions/${id}/cancel`)
      return response.data
    },
    getInvoices: async (params?: any) => {
      const response = await apiClient.get('/api/billing/invoices', { params })
      return response.data
    },
    getInvoice: async (id: string) => {
      const response = await apiClient.get(`/api/billing/invoices/${id}`)
      return response.data
    },
    downloadInvoice: async (id: string) => {
      const response = await apiClient.get(`/api/billing/invoices/${id}/download`)
      return response.data
    },
    getPaymentMethods: async () => {
      const response = await apiClient.get('/api/billing/payment-methods')
      return response.data
    },
    addPaymentMethod: async (data: any) => {
      const response = await apiClient.post('/api/billing/payment-methods', data)
      return response.data
    },
    setDefaultPaymentMethod: async (methodId: string) => {
      const response = await apiClient.put(`/api/billing/payment-methods/${methodId}/default`)
      return response.data
    },
    deletePaymentMethod: async (methodId: string) => {
      const response = await apiClient.delete(`/api/billing/payment-methods/${methodId}`)
      return response.data
    },
    getUsageAnalytics: async (period: string = 'current_month') => {
      const response = await apiClient.get(`/api/billing/usage?period=${period}`)
      return response.data
    },
    getBillingSettings: async () => {
      const response = await apiClient.get('/api/billing/settings')
      return response.data
    },
    updateBillingSettings: async (data: any) => {
      const response = await apiClient.put('/api/billing/settings', data)
      return response.data
    },
  },

  // Search endpoints
  search: {
    globalSearch: async (params: any) => {
      const response = await apiClient.get('/api/search', { params })
      return response.data
    },
    getSavedSearches: async () => {
      const response = await apiClient.get('/api/search/saved')
      return response.data
    },
    saveSearch: async (data: any) => {
      const response = await apiClient.post('/api/search/saved', data)
      return response.data
    },
  },

  // Bulk operations endpoints
  bulkOperations: {
    getBulkOperations: async () => {
      const response = await apiClient.get('/api/bulk-operations')
      return response.data
    },
    getTemplates: async () => {
      const response = await apiClient.get('/api/bulk-operations/templates')
      return response.data
    },
    createBulkOperation: async (data: any) => {
      const response = await apiClient.post('/api/bulk-operations', data)
      return response.data
    },
    executeBulkOperation: async (id: string) => {
      const response = await apiClient.post(`/api/bulk-operations/${id}/execute`)
      return response.data
    },
    cancelBulkOperation: async (id: string) => {
      const response = await apiClient.post(`/api/bulk-operations/${id}/cancel`)
      return response.data
    },
  },

  // Data management endpoints
  dataManagement: {
    exportData: async (type: string, format: string) => {
      const response = await apiClient.post('/api/data-management/export', { type, format })
      return response.data
    },
    importData: async (data: any) => {
      const response = await apiClient.post('/api/data-management/import', data)
      return response.data
    },
    getImportTemplates: async () => {
      const response = await apiClient.get('/api/data-management/templates')
      return response.data
    },
    getExportHistory: async () => {
      const response = await apiClient.get('/api/data-management/exports')
      return response.data
    },
    getImportHistory: async () => {
      const response = await apiClient.get('/api/data-management/imports')
      return response.data
    },
  },

  // API management endpoints
  api: {
    getApiKeys: async () => {
      const response = await apiClient.get('/api/api/keys')
      return response.data
    },
    createApiKey: async (data: any) => {
      const response = await apiClient.post('/api/api/keys', data)
      return response.data
    },
    deleteApiKey: async (id: string) => {
      const response = await apiClient.delete(`/api/api/keys/${id}`)
      return response.data
    },
    revokeApiKey: async (id: string) => {
      const response = await apiClient.post(`/api/api/keys/${id}/revoke`)
      return response.data
    },
    getApiUsage: async () => {
      const response = await apiClient.get('/api/api/usage')
      return response.data
    },
    getApiEndpoints: async () => {
      const response = await apiClient.get('/api/api/endpoints')
      return response.data
    },
  },

  // Automation endpoints
  automation: {
    getWorkflows: async () => {
      const response = await apiClient.get('/api/automation/workflows')
      return response.data
    },
    getTemplates: async () => {
      const response = await apiClient.get('/api/automation/templates')
      return response.data
    },
    createWorkflow: async (data: any) => {
      const response = await apiClient.post('/api/automation/workflows', data)
      return response.data
    },
    updateWorkflow: async (id: string, data: any) => {
      const response = await apiClient.put(`/api/automation/workflows/${id}`, data)
      return response.data
    },
    deleteWorkflow: async (id: string) => {
      const response = await apiClient.delete(`/api/automation/workflows/${id}`)
      return response.data
    },
    executeWorkflow: async (id: string) => {
      const response = await apiClient.post(`/api/automation/workflows/${id}/execute`)
      return response.data
    },
    toggleWorkflow: async (id: string, action: 'start' | 'pause' | 'stop') => {
      const response = await apiClient.post(`/api/automation/workflows/${id}/toggle`, { action })
      return response.data
    },
  },

  // Admin endpoints
  admin: {
    getSystemMetrics: async () => {
      const response = await apiClient.get('/api/admin/system/metrics')
      return response.data
    },
    getSecurityEvents: async () => {
      const response = await apiClient.get('/api/admin/system/security-events')
      return response.data
    },
    getSystemBackups: async () => {
      const response = await apiClient.get('/api/admin/system/backups')
      return response.data
    },
    createBackup: async (type?: 'full' | 'incremental') => {
      const response = await apiClient.post('/api/admin/system/backups', { type })
      return response.data
    },
    getUsers: async () => {
      const response = await apiClient.get('/api/admin/users')
      return response.data
    },
    updateUser: async (id: string, data: any) => {
      const response = await apiClient.put(`/api/admin/users/${id}`, data)
      return response.data
    },
    deleteUser: async (id: string) => {
      const response = await apiClient.delete(`/api/admin/users/${id}`)
      return response.data
    },
  },

  // Analytics endpoints moved to later section with more comprehensive implementation

  // Dashboard endpoints
  dashboard: {
    getStats: async () => {
      const response = await apiClient.get('/api/dashboard/stats')
      return response.data
    },
    getRecentActivity: async (limit: number = 10) => {
      const response = await apiClient.get(`/api/dashboard/activity?limit=${limit}`)
      return response.data
    },
    getComplianceOverview: async () => {
      const response = await apiClient.get('/api/dashboard/compliance-overview')
      return response.data
    },
    getEquipmentStatus: async () => {
      const response = await apiClient.get('/api/dashboard/equipment-status')
      return response.data
    },
    getCalibrationSchedule: async () => {
      const response = await apiClient.get('/api/dashboard/calibration-schedule')
      return response.data
    },
  },

  // Equipment endpoints
  equipment: {
    getAll: async (params?: any) => {
      const response = await apiClient.get('/api/equipment', { params })
      return response.data
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/api/equipment/${id}`)
      return response.data
    },
    create: async (data: any) => {
      const response = await apiClient.post('/api/equipment', data)
      return response.data
    },
    update: async (id: string, data: any) => {
      const response = await apiClient.put(`/api/equipment/${id}`, data)
      return response.data
    },
    delete: async (id: string) => {
      const response = await apiClient.delete(`/api/equipment/${id}`)
      return response.data
    },
    getStats: async () => {
      const response = await apiClient.get('/api/equipment/stats')
      return response.data
    },
    getCalibrationHistory: async (id: string) => {
      const response = await apiClient.get(`/api/equipment/${id}/calibration-history`)
      return response.data
    },
  },

  // Analytics endpoints - comprehensive implementation
  analytics: {
    getEquipmentAnalytics: async (params: any) => {
      const response = await apiClient.get('/api/analytics/equipment', { params })
      return response.data
    },
    getCalibrationAnalytics: async (params: any) => {
      const response = await apiClient.get('/api/analytics/calibration', { params })
      return response.data
    },
    getComplianceAnalytics: async (params: any) => {
      const response = await apiClient.get('/api/analytics/compliance', { params })
      return response.data
    },
    getUserAnalytics: async (params: any) => {
      const response = await apiClient.get('/api/analytics/users', { params })
      return response.data
    },
    getCustomReport: async (reportData: any) => {
      const response = await apiClient.post('/api/analytics/custom-report', reportData)
      return response.data
    },
    // Enterprise analytics methods
    getEnterpriseMetrics: async () => {
      const response = await apiClient.get('/api/analytics/enterprise')
      return response.data
    },
    getRevenueData: async (period: string) => {
      const response = await apiClient.get(`/api/analytics/revenue?period=${period}`)
      return response.data
    },
    getUserEngagement: async () => {
      const response = await apiClient.get('/api/analytics/user-engagement')
      return response.data
    },
    getSystemPerformance: async () => {
      const response = await apiClient.get('/api/analytics/system-performance')
      return response.data
    },
  },

  // Integrations endpoints
  integrations: {
    getLIMSConnections: async () => {
      const response = await apiClient.get('/api/integrations/lims/connections')
      return response.data
    },
    createLIMSConnection: async (data: any) => {
      const response = await apiClient.post('/api/integrations/lims/connections', data)
      return response.data
    },
    syncLIMSData: async (connectionId: string) => {
      const response = await apiClient.post(`/api/integrations/lims/connections/${connectionId}/sync`)
      return response.data
    },
    disconnectLIMS: async (connectionId: string) => {
      const response = await apiClient.delete(`/api/integrations/lims/connections/${connectionId}`)
      return response.data
    },
  },
}

export default apiService 
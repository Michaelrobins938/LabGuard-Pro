import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.labguardpro.com';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  location: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'RETIRED';
  lastCalibration?: string;
  nextCalibration?: string;
  calibrationInterval: number;
  notes?: string;
}

interface CalibrationRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  performedBy: string;
  performedAt: string;
  status: 'PASSED' | 'FAILED' | 'PENDING';
  measurements: Record<string, any>;
  notes?: string;
  aiValidation?: {
    passed: boolean;
    confidence: number;
    recommendations: string[];
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'CALIBRATION_DUE' | 'COMPLIANCE_FAILURE' | 'EQUIPMENT_MAINTENANCE' | 'SYSTEM_ALERT' | 'BILLING';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  isRead: boolean;
  createdAt: string;
  equipmentId?: string;
  action?: string;
}

class ApiService {
  private async getAuthToken(): Promise<string> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return token || '';
    } catch (error) {
      console.error('Error getting auth token:', error);
      return '';
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken();
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...defaultOptions,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Equipment API
  equipmentAPI = {
    getAll: async (params?: { limit?: number; offset?: number; status?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.status) queryParams.append('status', params.status);

      const queryString = queryParams.toString();
      const endpoint = `/equipment${queryString ? `?${queryString}` : ''}`;
      
      return this.makeRequest<Equipment[]>(endpoint);
    },

    getById: async (id: string) => {
      return this.makeRequest<Equipment>(`/equipment/${id}`);
    },

    create: async (equipment: Omit<Equipment, 'id'>) => {
      return this.makeRequest<Equipment>('/equipment', {
        method: 'POST',
        body: JSON.stringify(equipment),
      });
    },

    update: async (id: string, equipment: Partial<Equipment>) => {
      return this.makeRequest<Equipment>(`/equipment/${id}`, {
        method: 'PUT',
        body: JSON.stringify(equipment),
      });
    },

    delete: async (id: string) => {
      return this.makeRequest<void>(`/equipment/${id}`, {
        method: 'DELETE',
      });
    },

    getCalibrationHistory: async (equipmentId: string) => {
      return this.makeRequest<CalibrationRecord[]>(`/equipment/${equipmentId}/calibrations`);
    },

    getMaintenanceHistory: async (equipmentId: string) => {
      return this.makeRequest<any[]>(`/equipment/${equipmentId}/maintenance`);
    },
  };

  // Calibration API
  calibrationAPI = {
    getAll: async (params?: { limit?: number; offset?: number; status?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.status) queryParams.append('status', params.status);

      const queryString = queryParams.toString();
      const endpoint = `/calibrations${queryString ? `?${queryString}` : ''}`;
      
      return this.makeRequest<CalibrationRecord[]>(endpoint);
    },

    getById: async (id: string) => {
      return this.makeRequest<CalibrationRecord>(`/calibrations/${id}`);
    },

    create: async (calibration: Omit<CalibrationRecord, 'id'>) => {
      return this.makeRequest<CalibrationRecord>('/calibrations', {
        method: 'POST',
        body: JSON.stringify(calibration),
      });
    },

    update: async (id: string, calibration: Partial<CalibrationRecord>) => {
      return this.makeRequest<CalibrationRecord>(`/calibrations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(calibration),
      });
    },

    delete: async (id: string) => {
      return this.makeRequest<void>(`/calibrations/${id}`, {
        method: 'DELETE',
      });
    },

    validateWithAI: async (calibrationData: any) => {
      return this.makeRequest<{
        passed: boolean;
        confidence: number;
        recommendations: string[];
        issues: string[];
      }>('/calibrations/validate', {
        method: 'POST',
        body: JSON.stringify(calibrationData),
      });
    },

    getDueCalibrations: async () => {
      return this.makeRequest<Equipment[]>('/calibrations/due');
    },

    getOverdueCalibrations: async () => {
      return this.makeRequest<Equipment[]>('/calibrations/overdue');
    },
  };

  // Notifications API
  notificationsAPI = {
    getAll: async (params?: { limit?: number; offset?: number; unreadOnly?: boolean }) => {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.unreadOnly) queryParams.append('unreadOnly', 'true');

      const queryString = queryParams.toString();
      const endpoint = `/notifications${queryString ? `?${queryString}` : ''}`;
      
      return this.makeRequest<Notification[]>(endpoint);
    },

    getById: async (id: string) => {
      return this.makeRequest<Notification>(`/notifications/${id}`);
    },

    markAsRead: async (id: string) => {
      return this.makeRequest<Notification>(`/notifications/${id}/read`, {
        method: 'PUT',
      });
    },

    markAllAsRead: async () => {
      return this.makeRequest<void>('/notifications/read-all', {
        method: 'PUT',
      });
    },

    delete: async (id: string) => {
      return this.makeRequest<void>(`/notifications/${id}`, {
        method: 'DELETE',
      });
    },

    getUnreadCount: async () => {
      return this.makeRequest<{ count: number }>('/notifications/unread-count');
    },
  };

  // User API
  userAPI = {
    getProfile: async () => {
      return this.makeRequest<{
        id: string;
        name: string;
        email: string;
        role: string;
        laboratoryId: string;
        laboratoryName: string;
      }>('/user/profile');
    },

    updateProfile: async (profile: Partial<{
      name: string;
      email: string;
      preferences: any;
    }>) => {
      return this.makeRequest<any>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
      return this.makeRequest<void>('/user/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    },
  };

  // Laboratory API
  laboratoryAPI = {
    getInfo: async () => {
      return this.makeRequest<{
        id: string;
        name: string;
        type: string;
        address: string;
        contactInfo: any;
        settings: any;
      }>('/laboratory/info');
    },

    getStats: async () => {
      return this.makeRequest<{
        totalEquipment: number;
        activeEquipment: number;
        dueCalibrations: number;
        overdueCalibrations: number;
        complianceRate: number;
      }>('/laboratory/stats');
    },

    getTeam: async () => {
      return this.makeRequest<{
        id: string;
        name: string;
        email: string;
        role: string;
        lastActive: string;
      }[]>('/laboratory/team');
    },
  };

  // Reports API
  reportsAPI = {
    generateComplianceReport: async (params: {
      startDate: string;
      endDate: string;
      equipmentIds?: string[];
    }) => {
      return this.makeRequest<{
        reportId: string;
        downloadUrl: string;
        summary: any;
      }>('/reports/compliance', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },

    generateCalibrationReport: async (params: {
      equipmentId: string;
      startDate: string;
      endDate: string;
    }) => {
      return this.makeRequest<{
        reportId: string;
        downloadUrl: string;
        summary: any;
      }>('/reports/calibration', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },

    getReportHistory: async () => {
      return this.makeRequest<{
        id: string;
        type: string;
        createdAt: string;
        downloadUrl: string;
      }[]>('/reports/history');
    },
  };

  // Settings API
  settingsAPI = {
    getNotificationSettings: async () => {
      return this.makeRequest<{
        emailNotifications: boolean;
        pushNotifications: boolean;
        smsNotifications: boolean;
        calibrationReminders: boolean;
        maintenanceReminders: boolean;
        complianceAlerts: boolean;
      }>('/settings/notifications');
    },

    updateNotificationSettings: async (settings: any) => {
      return this.makeRequest<void>('/settings/notifications', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    },

    getAppSettings: async () => {
      return this.makeRequest<{
        theme: 'light' | 'dark' | 'auto';
        language: string;
        timezone: string;
        dateFormat: string;
        timeFormat: string;
      }>('/settings/app');
    },

    updateAppSettings: async (settings: any) => {
      return this.makeRequest<void>('/settings/app', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    },
  };

  // Sync API
  syncAPI = {
    syncOfflineData: async (data: any[]) => {
      return this.makeRequest<{
        synced: number;
        failed: number;
        errors: string[];
      }>('/sync/offline', {
        method: 'POST',
        body: JSON.stringify({ data }),
      });
    },

    getLastSync: async () => {
      return this.makeRequest<{
        lastSyncAt: string;
        pendingChanges: number;
      }>('/sync/last');
    },
  };
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual APIs for convenience
export const equipmentAPI = apiService.equipmentAPI;
export const calibrationAPI = apiService.calibrationAPI;
export const notificationsAPI = apiService.notificationsAPI;
export const userAPI = apiService.userAPI;
export const laboratoryAPI = apiService.laboratoryAPI;
export const reportsAPI = apiService.reportsAPI;
export const settingsAPI = apiService.settingsAPI;
export const syncAPI = apiService.syncAPI; 
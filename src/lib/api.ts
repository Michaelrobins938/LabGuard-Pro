// src/lib/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'
  : '';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: any;
  token?: string;
  error?: string;
  message?: string;
  details?: string[];
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('labguard_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        console.error(`❌ API Error (${response.status}):`, data);
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
          details: data.details
        };
      }

      console.log(`✅ API Success: ${options.method || 'GET'} ${url}`);
      return {
        success: true,
        ...data
      };

    } catch (error) {
      console.error('❌ Network Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Authentication methods
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    laboratoryName: string;
    role?: string;
  }): Promise<ApiResponse> {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store token if registration successful
    if (response.success && response.token) {
      this.setAuthToken(response.token);
    }

    return response;
  }

  async login(credentials: { 
    email: string; 
    password: string;
  }): Promise<ApiResponse> {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token if login successful
    if (response.success && response.token) {
      this.setAuthToken(response.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/api/auth/logout', {
      method: 'POST',
    });

    // Remove token regardless of response
    this.removeAuthToken();

    return response;
  }

  async getProfile(): Promise<ApiResponse> {
    return this.request('/api/auth/profile');
  }

  async testConnection(): Promise<ApiResponse> {
    return this.request('/api/health');
  }

  // Dashboard methods
  dashboard = {
    getStats: (): Promise<ApiResponse> => this.request('/api/dashboard/stats'),
    getMetrics: (): Promise<ApiResponse> => this.request('/api/dashboard/metrics'),
    getOverview: (): Promise<ApiResponse> => this.request('/api/dashboard/overview'),
    getRecentActivity: (limit: number = 10): Promise<ApiResponse> => 
      this.request(`/api/dashboard/recent-activity?limit=${limit}`),
    getComplianceOverview: (): Promise<ApiResponse> => 
      this.request('/api/dashboard/compliance-overview'),
    getEquipmentStatus: (): Promise<ApiResponse> => 
      this.request('/api/dashboard/equipment-status'),
    getCalibrationSchedule: (): Promise<ApiResponse> => 
      this.request('/api/dashboard/calibration-schedule'),
  };

  // Analytics methods
  analytics = {
    getUsage: (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse> => {
      const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.request(`/api/analytics/usage${queryParams}`);
    },
    getPerformance: (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse> => {
      const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.request(`/api/analytics/performance${queryParams}`);
    },
    getTrends: (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse> => {
      const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.request(`/api/analytics/trends${queryParams}`);
    },
    getInsights: (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse> => {
      const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.request(`/api/analytics/insights${queryParams}`);
    },
    getEquipmentAnalytics: (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse> => {
      const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.request(`/api/analytics/equipment${queryParams}`);
    },
    getCalibrationAnalytics: (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse> => {
      const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.request(`/api/analytics/calibration${queryParams}`);
    },
    getComplianceAnalytics: (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse> => {
      const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.request(`/api/analytics/compliance${queryParams}`);
    },
    getUserAnalytics: (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse> => {
      const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.request(`/api/analytics/users${queryParams}`);
    },
    getCustomReport: (reportData: any): Promise<ApiResponse> => 
      this.request('/api/analytics/custom-report', {
        method: 'POST',
        body: JSON.stringify(reportData),
      }),
  };

  // Equipment methods
  equipment = {
    getAll: (params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<ApiResponse> => {
      const queryParams = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
      return this.request(`/api/equipment${queryParams}`);
    },
    getById: (id: string): Promise<ApiResponse> => this.request(`/api/equipment/${id}`),
    create: (data: any): Promise<ApiResponse> => 
      this.request('/api/equipment', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any): Promise<ApiResponse> => 
      this.request(`/api/equipment/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<ApiResponse> => 
      this.request(`/api/equipment/${id}`, {
        method: 'DELETE',
      }),
    getStats: (): Promise<ApiResponse> => this.request('/api/equipment/stats'),
    getCalibrationHistory: (id: string): Promise<ApiResponse> => 
      this.request(`/api/equipment/${id}/calibration-history`),
  };

  // Auth methods
  auth = {
    login: (credentials: { email: string; password: string }): Promise<ApiResponse> => 
      this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: any): Promise<ApiResponse> => 
      this.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    logout: (): Promise<ApiResponse> => 
      this.request('/api/auth/logout', {
        method: 'POST',
      }),
    getProfile: (): Promise<ApiResponse> => this.request('/api/auth/profile'),
  };

  // Team methods
  team = {
    getAll: (): Promise<ApiResponse> => this.request('/api/team'),
    getInvitations: (): Promise<ApiResponse> => this.request('/api/team/invitations'),
    invite: (inviteData: any): Promise<ApiResponse> => 
      this.request('/api/team/invite', {
        method: 'POST',
        body: JSON.stringify(inviteData),
      }),
    updateRole: (id: string, role: string): Promise<ApiResponse> => 
      this.request(`/api/team/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      }),
    remove: (id: string): Promise<ApiResponse> => 
      this.request(`/api/team/${id}`, {
        method: 'DELETE',
      }),
  };

  // Notifications methods
  notifications = {
    getAll: (params?: { limit?: number }): Promise<ApiResponse> => {
      const queryParams = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
      return this.request(`/api/notifications${queryParams}`);
    },
    markAsRead: (id: string): Promise<ApiResponse> => 
      this.request(`/api/notifications/${id}/read`, {
        method: 'PUT',
      }),
    markAllAsRead: (): Promise<ApiResponse> => 
      this.request('/api/notifications/read-all', {
        method: 'PUT',
      }),
    delete: (id: string): Promise<ApiResponse> => 
      this.request(`/api/notifications/${id}`, {
        method: 'DELETE',
      }),
  };

  // Token management
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('labguard_token', token);
    }
  }

  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('labguard_token');
    }
    return null;
  }

  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('labguard_token');
      localStorage.removeItem('labguard_user');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export const apiService = apiClient; // Alias for backward compatibility

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
  formatResponse: (response: any) => {
    return response.data || response
  },

  // Check if response is successful
  isSuccess: (response: any) => {
    return response.success === true || (response.status >= 200 && response.status < 300)
  },

  // Get pagination info from response headers
  getPaginationInfo: (response: any) => {
    const total = response.headers?.['x-total-count']
    const page = response.headers?.['x-page']
    const limit = response.headers?.['x-limit']
    
    return {
      total: total ? parseInt(total) : 0,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    }
  },
}

export default apiClient; 
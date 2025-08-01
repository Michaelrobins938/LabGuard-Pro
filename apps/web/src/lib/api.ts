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

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse> {
    return this.request('/api/dashboard/stats')
  }

  async getRecentActivity(limit: number = 10): Promise<ApiResponse> {
    return this.request(`/api/dashboard/activity?limit=${limit}`)
  }

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

  async getEquipmentAnalytics(params: any): Promise<ApiResponse> {
    return this.request('/api/analytics/equipment', { method: 'POST', body: JSON.stringify(params) })
  }
  async getCalibrationAnalytics(params: any): Promise<ApiResponse> {
    return this.request('/api/analytics/calibration', { method: 'POST', body: JSON.stringify(params) })
  }
  async getComplianceAnalytics(params: any): Promise<ApiResponse> {
    return this.request('/api/analytics/compliance', { method: 'POST', body: JSON.stringify(params) })
  }
  async getUserAnalytics(params: any): Promise<ApiResponse> {
    return this.request('/api/analytics/users', { method: 'POST', body: JSON.stringify(params) })
  }

  // Equipment methods
  async getEquipmentAll(params?: any): Promise<ApiResponse> {
    return this.request('/api/equipment', { method: 'GET' })
  }

  async getEquipmentById(id: string): Promise<ApiResponse> {
    return this.request(`/api/equipment/${id}`, { method: 'GET' })
  }

  async createEquipment(equipmentData: any): Promise<ApiResponse> {
    return this.request('/api/equipment', { method: 'POST', body: JSON.stringify(equipmentData) })
  }

  async updateEquipment(id: string, equipmentData: any): Promise<ApiResponse> {
    return this.request(`/api/equipment/${id}`, { method: 'PUT', body: JSON.stringify(equipmentData) })
  }

  async deleteEquipment(id: string): Promise<ApiResponse> {
    return this.request(`/api/equipment/${id}`, { method: 'DELETE' })
  }

  async getEquipmentStats(): Promise<ApiResponse> {
    return this.request('/api/equipment/stats', { method: 'GET' })
  }

  async getEquipmentCalibrationHistory(id: string): Promise<ApiResponse> {
    return this.request(`/api/equipment/${id}/calibrations`, { method: 'GET' })
  }

  // Dashboard methods
  async getComplianceOverview(): Promise<ApiResponse> {
    return this.request('/api/dashboard/compliance', { method: 'GET' })
  }

  async getEquipmentStatus(): Promise<ApiResponse> {
    return this.request('/api/dashboard/equipment-status', { method: 'GET' })
  }

  async getCalibrationSchedule(): Promise<ApiResponse> {
    return this.request('/api/dashboard/calibration-schedule', { method: 'GET' })
  }

  // Analytics methods
  async getCustomReport(reportData: any): Promise<ApiResponse> {
    return this.request('/api/analytics/custom-report', { method: 'POST', body: JSON.stringify(reportData) })
  }

  get analytics() {
    return {
      getEquipmentAnalytics: this.getEquipmentAnalytics.bind(this),
      getCalibrationAnalytics: this.getCalibrationAnalytics.bind(this),
      getComplianceAnalytics: this.getComplianceAnalytics.bind(this),
      getUserAnalytics: this.getUserAnalytics.bind(this),
      getCustomReport: this.getCustomReport.bind(this),
    }
  }

  get dashboard() {
    return {
      getStats: this.getDashboardStats.bind(this),
      getRecentActivity: this.getRecentActivity.bind(this),
      getComplianceOverview: this.getComplianceOverview.bind(this),
      getEquipmentStatus: this.getEquipmentStatus.bind(this),
      getCalibrationSchedule: this.getCalibrationSchedule.bind(this),
    }
  }

  get equipment() {
    return {
      getAll: this.getEquipmentAll.bind(this),
      getById: this.getEquipmentById.bind(this),
      create: this.createEquipment.bind(this),
      update: this.updateEquipment.bind(this),
      delete: this.deleteEquipment.bind(this),
      getStats: this.getEquipmentStats.bind(this),
      getCalibrationHistory: this.getEquipmentCalibrationHistory.bind(this),
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export const apiService = apiClient; // Alias for compatibility
export default apiClient;

// API utilities
export const apiUtils = {
  getAuthHeaders: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('labguard_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  
  setAuthToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('labguard_token', token);
    }
  },
  
  getAuthToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('labguard_token');
    }
    return null;
  },
  
  removeAuthToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('labguard_token');
      localStorage.removeItem('labguard_user');
    }
  },
  
  isAuthenticated: () => {
    return !!apiUtils.getAuthToken();
  }
}; 
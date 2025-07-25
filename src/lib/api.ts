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
export default apiClient; 
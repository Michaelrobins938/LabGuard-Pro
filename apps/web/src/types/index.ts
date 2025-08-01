// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Equipment Types
export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'retired';
  location: string;
  lastCalibration?: string;
  nextCalibration?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Calibration Types
export interface Calibration {
  id: string;
  equipmentId: string;
  type: 'routine' | 'emergency' | 'preventive';
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  scheduledDate: string;
  completedDate?: string;
  technician?: string;
  notes?: string;
  results?: any;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technician' | 'viewer';
  laboratoryId: string;
  laboratoryName: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Laboratory Types
export interface Laboratory {
  id: string;
  name: string;
  description?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  subscriptionPlan: 'basic' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'cancelled' | 'expired';
  maxUsers: number;
  maxEquipment: number;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface AnalyticsData {
  equipment: {
    total: number;
    active: number;
    maintenance: number;
    retired: number;
  };
  calibrations: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  compliance: {
    overall: number;
    equipment: number;
    procedures: number;
  };
}

// File Analysis Types
export interface FileAnalysisResult {
  id: string;
  type: string;
  content: string;
  analysis: {
    insights: string[];
    recommendations: string[];
    warnings: string[];
    processingTime: number;
    confidence: number;
  };
  metadata: {
    size: number;
    format: string;
    encoding?: string;
  };
}

// Image Analysis Types
export interface ImageAnalysisResult {
  id: string;
  type: string;
  detections: any[];
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  analysis: {
    insights: string[];
    recommendations: string[];
    warnings: string[];
    processingTime: number;
    confidence: number;
  };
}

// Biomni Analysis Types
export interface BiomniAnalysisResult {
  id: string;
  type: string;
  data: any;
  analysis: {
    insights: string[];
    recommendations: string[];
    nextSteps: string[];
    processingTime: number;
    confidence: number;
  };
  metadata: {
    source: string;
    timestamp: string;
    version: string;
  };
}

// Speech Options
export interface SpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

// OpenRouter Types
export interface OpenRouterOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  systemPrompt?: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// API Client Types
export interface ApiClient {
  auth: {
    login: (credentials: { email: string; password: string }) => Promise<ApiResponse<any>>;
    register: (userData: any) => Promise<ApiResponse<any>>;
    logout: () => Promise<ApiResponse<any>>;
    refresh: () => Promise<ApiResponse<any>>;
  };
  dashboard: {
    getStats: () => Promise<ApiResponse<any>>;
    getRecentActivity: (limit?: number) => Promise<ApiResponse<any>>;
    getComplianceOverview: () => Promise<ApiResponse<any>>;
    getEquipmentStatus: () => Promise<ApiResponse<any>>;
    getCalibrationSchedule: () => Promise<ApiResponse<any>>;
  };
  equipment: {
    getAll: (params?: any) => Promise<ApiResponse<Equipment[]>>;
    getById: (id: string) => Promise<ApiResponse<Equipment>>;
    create: (data: any) => Promise<ApiResponse<Equipment>>;
    update: (id: string, data: any) => Promise<ApiResponse<Equipment>>;
    delete: (id: string) => Promise<ApiResponse<any>>;
    getStats: () => Promise<ApiResponse<any>>;
    getCalibrationHistory: (id: string) => Promise<ApiResponse<Calibration[]>>;
  };
  analytics: {
    getEquipmentAnalytics: (params: any) => Promise<ApiResponse<any>>;
    getCalibrationAnalytics: (params: any) => Promise<ApiResponse<any>>;
    getComplianceAnalytics: (params: any) => Promise<ApiResponse<any>>;
    getUserAnalytics: (params: any) => Promise<ApiResponse<any>>;
    getCustomReport: (reportData: any) => Promise<ApiResponse<any>>;
  };
  team: {
    getMembers: () => Promise<ApiResponse<User[]>>;
    inviteMember: (data: any) => Promise<ApiResponse<any>>;
    updateMember: (id: string, data: any) => Promise<ApiResponse<any>>;
    removeMember: (id: string) => Promise<ApiResponse<any>>;
  };
  billing: {
    getSubscription: () => Promise<ApiResponse<any>>;
    upgradePlan: (planId: string) => Promise<ApiResponse<any>>;
    cancelSubscription: () => Promise<ApiResponse<any>>;
    getInvoices: () => Promise<ApiResponse<any>>;
  };
  automation: {
    getWorkflows: () => Promise<ApiResponse<any>>;
    createWorkflow: (data: any) => Promise<ApiResponse<any>>;
    updateWorkflow: (id: string, data: any) => Promise<ApiResponse<any>>;
    deleteWorkflow: (id: string) => Promise<ApiResponse<any>>;
  };
  bulkOperations: {
    getTemplates: () => Promise<ApiResponse<any>>;
    createOperation: (data: any) => Promise<ApiResponse<any>>;
    getOperations: () => Promise<ApiResponse<any>>;
    getOperationById: (id: string) => Promise<ApiResponse<any>>;
  };
  admin: {
    getSystemMetrics: () => Promise<ApiResponse<any>>;
    getSecurityEvents: () => Promise<ApiResponse<any>>;
    createBackup: (type: 'full' | 'incremental') => Promise<ApiResponse<any>>;
    getBackups: () => Promise<ApiResponse<any>>;
    createApiKey: (data: any) => Promise<ApiResponse<any>>;
    getApiKeys: () => Promise<ApiResponse<any>>;
    revokeApiKey: (id: string) => Promise<ApiResponse<any>>;
  };
} 
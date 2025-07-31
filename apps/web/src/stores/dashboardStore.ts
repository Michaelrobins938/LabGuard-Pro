import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types
export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'operational' | 'maintenance' | 'inactive' | 'calibration_due';
  location: string;
  lastCalibration?: string;
  nextCalibration?: string;
  healthScore: number;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  assignedTechnician?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Calibration {
  id: string;
  equipmentId: string;
  equipmentName: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  technicianId?: string;
  technicianName?: string;
  type: 'routine' | 'emergency' | 'post_repair';
  results?: {
    accuracy: number;
    precision: number;
    drift: number;
    notes: string;
  };
  certificate?: string;
  cost?: number;
  duration?: number;
  aiValidation?: {
    status: 'pending' | 'approved' | 'rejected';
    confidence: number;
    notes: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AIInsight {
  id: string;
  type: 'equipment_optimization' | 'compliance_alert' | 'performance_recommendation' | 'cost_savings';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'reviewed' | 'implemented' | 'dismissed';
  confidence: number;
  impact: {
    cost: number;
    time: number;
    accuracy: number;
  };
  equipmentIds?: string[];
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'calibration_due' | 'equipment_alert' | 'compliance_alert' | 'ai_insight' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'unread' | 'read' | 'dismissed';
  equipmentId?: string;
  calibrationId?: string;
  insightId?: string;
  createdAt: string;
  readAt?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'technician' | 'scientist' | 'manager';
  avatar?: string;
  lastLoginAt: string;
  laboratory: {
    id: string;
    name: string;
    planType: string;
    subscriptionStatus: string;
  };
}

export interface DashboardStats {
  totalEquipment: number;
  operationalEquipment: number;
  maintenanceEquipment: number;
  calibrationDue: number;
  overdueCalibrations: number;
  complianceScore: number;
  aiInsights: number;
  unreadNotifications: number;
  teamProductivity: number;
  timeSaved: number;
  costSavings: number;
}

interface DashboardState {
  // Data
  equipment: Equipment[];
  calibrations: Calibration[];
  aiInsights: AIInsight[];
  notifications: Notification[];
  user: User | null;
  stats: DashboardStats;
  
  // Loading states
  loading: {
    equipment: boolean;
    calibrations: boolean;
    aiInsights: boolean;
    notifications: boolean;
    stats: boolean;
  };
  
  // UI state
  sidebarOpen: boolean;
  selectedEquipment: Equipment | null;
  selectedCalibration: Calibration | null;
  filters: {
    equipmentStatus: string[];
    calibrationStatus: string[];
    dateRange: { start: string; end: string } | null;
  };
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setSelectedEquipment: (equipment: Equipment | null) => void;
  setSelectedCalibration: (calibration: Calibration | null) => void;
  setFilters: (filters: Partial<DashboardState['filters']>) => void;
  
  // Data fetching
  fetchEquipment: () => Promise<void>;
  fetchCalibrations: () => Promise<void>;
  fetchAIInsights: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchUser: () => Promise<void>;
  
  // Data mutations
  addEquipment: (equipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEquipment: (id: string, updates: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  
  addCalibration: (calibration: Omit<Calibration, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCalibration: (id: string, updates: Partial<Calibration>) => Promise<void>;
  deleteCalibration: (id: string) => Promise<void>;
  
  markNotificationRead: (id: string) => Promise<void>;
  dismissNotification: (id: string) => Promise<void>;
  
  // Real-time updates
  updateEquipmentStatus: (id: string, status: Equipment['status']) => void;
  updateCalibrationStatus: (id: string, status: Calibration['status']) => void;
  addAIInsight: (insight: AIInsight) => void;
  addNotification: (notification: Notification) => void;
}

// Mock data for development
const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Analytical Balance',
    type: 'balance',
    status: 'operational',
    location: 'Lab A - Bench 1',
    lastCalibration: '2024-01-15T10:00:00Z',
    nextCalibration: '2024-04-15T10:00:00Z',
    healthScore: 95,
    manufacturer: 'Mettler Toledo',
    model: 'MS204S',
    serialNumber: 'MT-2024-001',
    purchaseDate: '2023-01-15T00:00:00Z',
    warrantyExpiry: '2026-01-15T00:00:00Z',
    assignedTechnician: 'Dr. Sarah Johnson',
    notes: 'High precision balance for analytical work',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'pH Meter',
    type: 'ph_meter',
    status: 'calibration_due',
    location: 'Lab B - Bench 3',
    lastCalibration: '2024-01-01T09:00:00Z',
    nextCalibration: '2024-02-01T09:00:00Z',
    healthScore: 78,
    manufacturer: 'Thermo Scientific',
    model: 'Orion Star A211',
    serialNumber: 'TS-2023-045',
    purchaseDate: '2022-06-01T00:00:00Z',
    assignedTechnician: 'Mike Chen',
    notes: 'Used for pH measurements in buffer solutions',
    createdAt: '2022-06-01T00:00:00Z',
    updatedAt: '2024-01-01T09:00:00Z',
  },
  {
    id: '3',
    name: 'Spectrophotometer',
    type: 'spectrophotometer',
    status: 'maintenance',
    location: 'Lab A - Equipment Room',
    lastCalibration: '2024-01-10T14:00:00Z',
    nextCalibration: '2024-04-10T14:00:00Z',
    healthScore: 62,
    manufacturer: 'PerkinElmer',
    model: 'Lambda 35',
    serialNumber: 'PE-2022-123',
    purchaseDate: '2021-12-01T00:00:00Z',
    assignedTechnician: 'Dr. Sarah Johnson',
    notes: 'Requires lamp replacement',
    createdAt: '2021-12-01T00:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
  },
];

const mockCalibrations: Calibration[] = [
  {
    id: '1',
    equipmentId: '1',
    equipmentName: 'Analytical Balance',
    status: 'completed',
    scheduledDate: '2024-01-15T10:00:00Z',
    completedDate: '2024-01-15T11:30:00Z',
    technicianId: 'tech-1',
    technicianName: 'Dr. Sarah Johnson',
    type: 'routine',
    results: {
      accuracy: 99.8,
      precision: 0.001,
      drift: 0.0005,
      notes: 'Excellent calibration results, within specifications',
    },
    certificate: 'CAL-2024-001.pdf',
    cost: 150,
    duration: 90,
    aiValidation: {
      status: 'approved',
      confidence: 98.5,
      notes: 'AI validation confirms calibration meets all standards',
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T11:30:00Z',
  },
  {
    id: '2',
    equipmentId: '2',
    equipmentName: 'pH Meter',
    status: 'overdue',
    scheduledDate: '2024-02-01T09:00:00Z',
    technicianId: 'tech-2',
    technicianName: 'Mike Chen',
    type: 'routine',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'equipment_optimization',
    title: 'pH Meter Calibration Optimization',
    description: 'The pH meter shows signs of drift. Recommend immediate calibration to maintain accuracy.',
    priority: 'high',
    status: 'new',
    confidence: 94.2,
    impact: {
      cost: -200,
      time: -2,
      accuracy: 15,
    },
    equipmentIds: ['2'],
    recommendations: [
      'Schedule immediate calibration',
      'Check electrode condition',
      'Update calibration schedule to monthly',
    ],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    type: 'cost_savings',
    title: 'Spectrophotometer Maintenance Savings',
    description: 'Preventive maintenance on spectrophotometer could save $500 in repair costs.',
    priority: 'medium',
    status: 'reviewed',
    confidence: 87.5,
    impact: {
      cost: -500,
      time: 4,
      accuracy: 5,
    },
    equipmentIds: ['3'],
    recommendations: [
      'Schedule preventive maintenance',
      'Replace lamp during next maintenance',
      'Update maintenance schedule',
    ],
    createdAt: '2024-01-19T14:30:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'calibration_due',
    title: 'pH Meter Calibration Overdue',
    message: 'The pH meter calibration is 5 days overdue. Please schedule immediately.',
    priority: 'high',
    status: 'unread',
    equipmentId: '2',
    calibrationId: '2',
    createdAt: '2024-01-20T08:00:00Z',
  },
  {
    id: '2',
    type: 'ai_insight',
    title: 'New AI Insight Available',
    message: 'AI has identified optimization opportunities for your equipment.',
    priority: 'medium',
    status: 'unread',
    insightId: '1',
    createdAt: '2024-01-20T10:00:00Z',
  },
];

const mockStats: DashboardStats = {
  totalEquipment: 3,
  operationalEquipment: 1,
  maintenanceEquipment: 1,
  calibrationDue: 1,
  overdueCalibrations: 1,
  complianceScore: 85.7,
  aiInsights: 2,
  unreadNotifications: 2,
  teamProductivity: 88,
  timeSaved: 12.5,
  costSavings: 700,
};

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      // Initial state
      equipment: mockEquipment,
      calibrations: mockCalibrations,
      aiInsights: mockAIInsights,
      notifications: mockNotifications,
      user: null,
      stats: mockStats,
      
      loading: {
        equipment: false,
        calibrations: false,
        aiInsights: false,
        notifications: false,
        stats: false,
      },
      
      sidebarOpen: false,
      selectedEquipment: null,
      selectedCalibration: null,
      filters: {
        equipmentStatus: [],
        calibrationStatus: [],
        dateRange: null,
      },
      
      // UI Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSelectedEquipment: (equipment) => set({ selectedEquipment: equipment }),
      setSelectedCalibration: (calibration) => set({ selectedCalibration: calibration }),
      setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters } 
      })),
      
      // Data fetching
      fetchEquipment: async () => {
        set((state) => ({ loading: { ...state.loading, equipment: true } }));
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ equipment: mockEquipment });
        } catch (error) {
          console.error('Failed to fetch equipment:', error);
        } finally {
          set((state) => ({ loading: { ...state.loading, equipment: false } }));
        }
      },
      
      fetchCalibrations: async () => {
        set((state) => ({ loading: { ...state.loading, calibrations: true } }));
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ calibrations: mockCalibrations });
        } catch (error) {
          console.error('Failed to fetch calibrations:', error);
        } finally {
          set((state) => ({ loading: { ...state.loading, calibrations: false } }));
        }
      },
      
      fetchAIInsights: async () => {
        set((state) => ({ loading: { ...state.loading, aiInsights: true } }));
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ aiInsights: mockAIInsights });
        } catch (error) {
          console.error('Failed to fetch AI insights:', error);
        } finally {
          set((state) => ({ loading: { ...state.loading, aiInsights: false } }));
        }
      },
      
      fetchNotifications: async () => {
        set((state) => ({ loading: { ...state.loading, notifications: true } }));
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ notifications: mockNotifications });
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        } finally {
          set((state) => ({ loading: { ...state.loading, notifications: false } }));
        }
      },
      
      fetchStats: async () => {
        set((state) => ({ loading: { ...state.loading, stats: true } }));
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ stats: mockStats });
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        } finally {
          set((state) => ({ loading: { ...state.loading, stats: false } }));
        }
      },
      
      fetchUser: async () => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockUser: User = {
            id: 'user-1',
            email: 'sarah.johnson@labguard.com',
            firstName: 'Sarah',
            lastName: 'Johnson',
            role: 'admin',
            lastLoginAt: '2024-01-20T10:00:00Z',
            laboratory: {
              id: 'lab-1',
              name: 'Advanced Research Laboratory',
              planType: 'enterprise',
              subscriptionStatus: 'active',
            },
          };
          set({ user: mockUser });
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      },
      
      // Data mutations
      addEquipment: async (equipment) => {
        const newEquipment: Equipment = {
          ...equipment,
          id: `eq-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ equipment: [...state.equipment, newEquipment] }));
      },
      
      updateEquipment: async (id, updates) => {
        set((state) => ({
          equipment: state.equipment.map(eq => 
            eq.id === id 
              ? { ...eq, ...updates, updatedAt: new Date().toISOString() }
              : eq
          ),
        }));
      },
      
      deleteEquipment: async (id) => {
        set((state) => ({
          equipment: state.equipment.filter(eq => eq.id !== id),
        }));
      },
      
      addCalibration: async (calibration) => {
        const newCalibration: Calibration = {
          ...calibration,
          id: `cal-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ calibrations: [...state.calibrations, newCalibration] }));
      },
      
      updateCalibration: async (id, updates) => {
        set((state) => ({
          calibrations: state.calibrations.map(cal => 
            cal.id === id 
              ? { ...cal, ...updates, updatedAt: new Date().toISOString() }
              : cal
          ),
        }));
      },
      
      deleteCalibration: async (id) => {
        set((state) => ({
          calibrations: state.calibrations.filter(cal => cal.id !== id),
        }));
      },
      
      markNotificationRead: async (id) => {
        set((state) => ({
          notifications: state.notifications.map(notif => 
            notif.id === id 
              ? { ...notif, status: 'read', readAt: new Date().toISOString() }
              : notif
          ),
        }));
      },
      
      dismissNotification: async (id) => {
        set((state) => ({
          notifications: state.notifications.map(notif => 
            notif.id === id 
              ? { ...notif, status: 'dismissed' }
              : notif
          ),
        }));
      },
      
      // Real-time updates
      updateEquipmentStatus: (id, status) => {
        set((state) => ({
          equipment: state.equipment.map(eq => 
            eq.id === id 
              ? { ...eq, status, updatedAt: new Date().toISOString() }
              : eq
          ),
        }));
      },
      
      updateCalibrationStatus: (id, status) => {
        set((state) => ({
          calibrations: state.calibrations.map(cal => 
            cal.id === id 
              ? { ...cal, status, updatedAt: new Date().toISOString() }
              : cal
          ),
        }));
      },
      
      addAIInsight: (insight) => {
        set((state) => ({
          aiInsights: [insight, ...state.aiInsights],
        }));
      },
      
      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
      },
    }),
    {
      name: 'dashboard-store',
    }
  )
);
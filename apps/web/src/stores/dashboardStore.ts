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

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      // Initial state
      equipment: [],
      calibrations: [],
      aiInsights: [],
      notifications: [],
      user: null,
      stats: {
        totalEquipment: 0,
        operationalEquipment: 0,
        maintenanceEquipment: 0,
        calibrationDue: 0,
        overdueCalibrations: 0,
        complianceScore: 0,
        aiInsights: 0,
        unreadNotifications: 0,
        teamProductivity: 0,
        timeSaved: 0,
        costSavings: 0,
      },
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

      // Data fetching with real API calls
      fetchEquipment: async () => {
        set((state) => ({ loading: { ...state.loading, equipment: true } }));
        try {
          const response = await fetch('/api/equipment');
          if (response.ok) {
            const equipment = await response.json();
            set({ equipment });
          } else {
            console.error('Failed to fetch equipment');
            set({ equipment: [] });
          }
        } catch (error) {
          console.error('Error fetching equipment:', error);
          set({ equipment: [] });
        } finally {
          set((state) => ({ loading: { ...state.loading, equipment: false } }));
        }
      },

      fetchCalibrations: async () => {
        set((state) => ({ loading: { ...state.loading, calibrations: true } }));
        try {
          const response = await fetch('/api/calibrations');
          if (response.ok) {
            const calibrations = await response.json();
            set({ calibrations });
          } else {
            console.error('Failed to fetch calibrations');
            set({ calibrations: [] });
          }
        } catch (error) {
          console.error('Error fetching calibrations:', error);
          set({ calibrations: [] });
        } finally {
          set((state) => ({ loading: { ...state.loading, calibrations: false } }));
        }
      },

      fetchAIInsights: async () => {
        set((state) => ({ loading: { ...state.loading, aiInsights: true } }));
        try {
          const response = await fetch('/api/ai-insights');
          if (response.ok) {
            const aiInsights = await response.json();
            set({ aiInsights });
          } else {
            console.error('Failed to fetch AI insights');
            set({ aiInsights: [] });
          }
        } catch (error) {
          console.error('Error fetching AI insights:', error);
          set({ aiInsights: [] });
        } finally {
          set((state) => ({ loading: { ...state.loading, aiInsights: false } }));
        }
      },

      fetchNotifications: async () => {
        set((state) => ({ loading: { ...state.loading, notifications: true } }));
        try {
          const response = await fetch('/api/notifications');
          if (response.ok) {
            const notifications = await response.json();
            set({ notifications });
          } else {
            console.error('Failed to fetch notifications');
            set({ notifications: [] });
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
          set({ notifications: [] });
        } finally {
          set((state) => ({ loading: { ...state.loading, notifications: false } }));
        }
      },

      fetchStats: async () => {
        set((state) => ({ loading: { ...state.loading, stats: true } }));
        try {
          const response = await fetch('/api/stats');
          if (response.ok) {
            const stats = await response.json();
            set({ stats });
          } else {
            console.error('Failed to fetch stats');
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          set((state) => ({ loading: { ...state.loading, stats: false } }));
        }
      },

      fetchUser: async () => {
        try {
          const response = await fetch('/api/user');
          if (response.ok) {
            const user = await response.json();
            set({ user });
          } else {
            console.error('Failed to fetch user');
            set({ user: null });
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          set({ user: null });
        }
      },

      // Data mutations with real API calls
      addEquipment: async (equipmentData) => {
        try {
          const response = await fetch('/api/equipment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(equipmentData),
          });
          if (response.ok) {
            const newEquipment = await response.json();
            set((state) => ({ 
              equipment: [...state.equipment, newEquipment] 
            }));
          }
        } catch (error) {
          console.error('Error adding equipment:', error);
        }
      },

      updateEquipment: async (id, updates) => {
        try {
          const response = await fetch(`/api/equipment/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });
          if (response.ok) {
            const updatedEquipment = await response.json();
            set((state) => ({
              equipment: state.equipment.map(eq => 
                eq.id === id ? updatedEquipment : eq
              )
            }));
          }
        } catch (error) {
          console.error('Error updating equipment:', error);
        }
      },

      deleteEquipment: async (id) => {
        try {
          const response = await fetch(`/api/equipment/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            set((state) => ({
              equipment: state.equipment.filter(eq => eq.id !== id)
            }));
          }
        } catch (error) {
          console.error('Error deleting equipment:', error);
        }
      },

      addCalibration: async (calibrationData) => {
        try {
          const response = await fetch('/api/calibrations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(calibrationData),
          });
          if (response.ok) {
            const newCalibration = await response.json();
            set((state) => ({ 
              calibrations: [...state.calibrations, newCalibration] 
            }));
          }
        } catch (error) {
          console.error('Error adding calibration:', error);
        }
      },

      updateCalibration: async (id, updates) => {
        try {
          const response = await fetch(`/api/calibrations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });
          if (response.ok) {
            const updatedCalibration = await response.json();
            set((state) => ({
              calibrations: state.calibrations.map(cal => 
                cal.id === id ? updatedCalibration : cal
              )
            }));
          }
        } catch (error) {
          console.error('Error updating calibration:', error);
        }
      },

      deleteCalibration: async (id) => {
        try {
          const response = await fetch(`/api/calibrations/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            set((state) => ({
              calibrations: state.calibrations.filter(cal => cal.id !== id)
            }));
          }
        } catch (error) {
          console.error('Error deleting calibration:', error);
        }
      },

      markNotificationRead: async (id) => {
        try {
          const response = await fetch(`/api/notifications/${id}/read`, {
            method: 'PATCH',
          });
          if (response.ok) {
            set((state) => ({
              notifications: state.notifications.map(notif => 
                notif.id === id ? { ...notif, status: 'read' } : notif
              )
            }));
          }
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      },

      dismissNotification: async (id) => {
        try {
          const response = await fetch(`/api/notifications/${id}/dismiss`, {
            method: 'PATCH',
          });
          if (response.ok) {
            set((state) => ({
              notifications: state.notifications.map(notif => 
                notif.id === id ? { ...notif, status: 'dismissed' } : notif
              )
            }));
          }
        } catch (error) {
          console.error('Error dismissing notification:', error);
        }
      },

      // Real-time updates
      updateEquipmentStatus: (id, status) => {
        set((state) => ({
          equipment: state.equipment.map(eq => 
            eq.id === id ? { ...eq, status } : eq
          )
        }));
      },

      updateCalibrationStatus: (id, status) => {
        set((state) => ({
          calibrations: state.calibrations.map(cal => 
            cal.id === id ? { ...cal, status } : cal
          )
        }));
      },

      addAIInsight: (insight) => {
        set((state) => ({
          aiInsights: [insight, ...state.aiInsights]
        }));
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications]
        }));
      },
    }),
    {
      name: 'dashboard-store',
    }
  )
);
import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

interface DashboardStats {
  totalEquipment: number;
  activeEquipment: number;
  calibrationDue: number;
  complianceScore: number;
  totalUsers: number;
  recentActivity: number;
}

interface AnalyticsData {
  equipmentAnalytics: any;
  calibrationAnalytics: any;
  complianceAnalytics: any;
  userAnalytics: any;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata?: any;
}

export function useAnalytics() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.dashboard.getStats();
      setDashboardStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (params?: { startDate?: string; endDate?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const [equipmentRes, calibrationRes, complianceRes, userRes] = await Promise.all([
        apiService.analytics.getEquipmentAnalytics(params),
        apiService.analytics.getCalibrationAnalytics(params),
        apiService.analytics.getComplianceAnalytics(params),
        apiService.analytics.getUserAnalytics(params)
      ]);

      setAnalyticsData({
        equipmentAnalytics: equipmentRes.data,
        calibrationAnalytics: calibrationRes.data,
        complianceAnalytics: complianceRes.data,
        userAnalytics: userRes.data
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async (limit: number = 10) => {
    try {
      const response = await apiService.dashboard.getRecentActivity(limit);
      setRecentActivity(response.data);
    } catch (err: any) {
      console.error('Failed to fetch recent activity:', err);
    }
  };

  const fetchComplianceOverview = async () => {
    try {
      // Mock compliance overview data since the API method doesn't exist
      const mockData = {
        complianceScore: 95,
        totalChecks: 150,
        passedChecks: 142,
        failedChecks: 8,
        lastUpdated: new Date().toISOString()
      };
      return { success: true, data: mockData };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch compliance overview';
      return { success: false, error: errorMessage };
    }
  };

  const fetchEquipmentStatus = async () => {
    try {
      // Mock equipment status data since the API method doesn't exist
      const mockData = {
        totalEquipment: 25,
        operational: 22,
        maintenance: 2,
        offline: 1,
        lastUpdated: new Date().toISOString()
      };
      return { success: true, data: mockData };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch equipment status';
      return { success: false, error: errorMessage };
    }
  };

  const fetchCalibrationSchedule = async () => {
    try {
      // Mock calibration schedule data since the API method doesn't exist
      const mockData = {
        upcomingCalibrations: [
          { id: '1', equipmentName: 'HPLC System', dueDate: '2024-02-15', status: 'scheduled' },
          { id: '2', equipmentName: 'Microscope', dueDate: '2024-02-20', status: 'scheduled' }
        ],
        completedCalibrations: 45,
        overdueCalibrations: 2
      };
      return { success: true, data: mockData };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch calibration schedule';
      return { success: false, error: errorMessage };
    }
  };

  const generateCustomReport = async (reportData: any) => {
    try {
      setLoading(true);
      setError(null);
      // Mock custom report data since the API method doesn't exist
      const mockData = {
        reportId: 'custom-' + Date.now(),
        generatedAt: new Date().toISOString(),
        data: reportData,
        summary: {
          totalRecords: 150,
          processedRecords: 150,
          errors: 0
        }
      };
      return { success: true, data: mockData };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to generate custom report';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchDashboardStats();
    fetchAnalytics();
    fetchRecentActivity();
  }, []);

  return {
    dashboardStats,
    analyticsData,
    recentActivity,
    loading,
    error,
    fetchDashboardStats,
    fetchAnalytics,
    fetchRecentActivity,
    fetchComplianceOverview,
    fetchEquipmentStatus,
    fetchCalibrationSchedule,
    generateCustomReport,
    clearError: () => setError(null)
  };
} 
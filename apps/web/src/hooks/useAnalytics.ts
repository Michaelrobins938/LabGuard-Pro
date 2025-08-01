import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api-service';

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
      const response = await apiService.dashboard.getComplianceOverview();
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch compliance overview';
      return { success: false, error: errorMessage };
    }
  };

  const fetchEquipmentStatus = async () => {
    try {
      const response = await apiService.dashboard.getEquipmentStatus();
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch equipment status';
      return { success: false, error: errorMessage };
    }
  };

  const fetchCalibrationSchedule = async () => {
    try {
      const response = await apiService.dashboard.getCalibrationSchedule();
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch calibration schedule';
      return { success: false, error: errorMessage };
    }
  };

  const generateCustomReport = async (reportData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.analytics.getCustomReport(reportData);
      return { success: true, data: response.data };
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
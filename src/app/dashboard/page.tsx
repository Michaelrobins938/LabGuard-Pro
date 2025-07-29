'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LogOut, 
  User, 
  Building, 
  Crown, 
  Loader2,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Zap,
  Brain,
  Shield,
  BarChart3,
  Users,
  Calendar,
  Settings,
  Eye,
  Plus,
  Download,
  RefreshCw,
  Bell,
  Search,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PerformanceMetrics } from '@/components/dashboard/PerformanceMetrics';
import { ComplianceStatusOverview } from '@/components/dashboard/ComplianceStatusOverview';
import { EquipmentStatusGrid } from '@/components/dashboard/EquipmentStatusGrid';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { useDashboardStore } from '@/stores/dashboardStore';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  lastLoginAt: string;
  laboratory: {
    id: string;
    name: string;
    planType: string;
    subscriptionStatus: string;
  };
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const router = useRouter();
  const { fetchUser, fetchEquipment, fetchCalibrations, fetchAIInsights, fetchNotifications, fetchStats } = useDashboardStore();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Check for bypass parameter in URL
      const urlParams = new URLSearchParams(window.location.search);
      const bypassAuth = urlParams.get('bypass');
      
      if (bypassAuth === 'true') {
        // Create demo user data for bypass
        const demoUser: UserData = {
          id: 'demo-user-123',
          email: 'demo@labguard.com',
          firstName: 'Demo',
          lastName: 'User',
          role: 'ADMIN',
          lastLoginAt: new Date().toISOString(),
          laboratory: {
            id: 'demo-lab-123',
            name: 'Demo Laboratory',
            planType: 'PRO',
            subscriptionStatus: 'ACTIVE'
          }
        };
        
        setUser(demoUser);
        localStorage.setItem('labguard_user', JSON.stringify(demoUser));
        setLoading(false);
        return;
      }

      if (!apiClient.isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      const response = await apiClient.getProfile();
      
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        const storedUser = localStorage.getItem('labguard_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          throw new Error('No user data found');
        }
      }

      // Load dashboard data
      await Promise.all([
        fetchUser(),
        fetchEquipment(),
        fetchCalibrations(),
        fetchAIInsights(),
        fetchNotifications(),
        fetchStats()
      ]);
    } catch (error: any) {
      console.error('❌ Failed to load user data:', error);
      setError('Failed to load user data');
      setTimeout(() => router.push('/auth/login'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    
    try {
      await apiClient.logout();
      localStorage.removeItem('labguard_user');
      router.push('/auth/login');
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      localStorage.removeItem('labguard_user');
      router.push('/auth/login');
    } finally {
      setLoggingOut(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Crown className="h-4 w-4 text-amber-400" />;
      default:
        return <User className="h-4 w-4 text-blue-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
          <span className="text-slate-200 font-medium">Loading LabGuard Pro...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md bg-slate-800/50 backdrop-blur-sm border border-red-500/50">
          <AlertDescription className="text-slate-200">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <DashboardSidebar onLogout={handleLogout} user={user} />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <DashboardHeader 
          user={user}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(true)}
          loggingOut={loggingOut}
        />

        {/* Main Dashboard Content */}
        <main className="p-6 space-y-8">
          {/* Welcome Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                  Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="text-lg text-slate-300 mt-2">
                  Your laboratory intelligence dashboard is ready
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Laboratory</p>
                    <p className="text-2xl font-bold text-slate-50">{user?.laboratory.name}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                    <Building className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Plan Type</p>
                    <p className="text-2xl font-bold text-emerald-400 capitalize">{user?.laboratory.planType}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg">
                    <Crown className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Status</p>
                    <p className="text-2xl font-bold text-blue-400 capitalize">{user?.laboratory.subscriptionStatus}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Last Login</p>
                    <p className="text-lg font-bold text-slate-50">
                      {user?.lastLoginAt ? formatDate(user.lastLoginAt) : 'Just now'}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <PerformanceMetrics />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Compliance Status */}
              <ComplianceStatusOverview />

              {/* Equipment Status */}
              <EquipmentStatusGrid />

              {/* Charts */}
              <DashboardCharts />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* AI Insights */}
              <AIInsightsPanel />

              {/* Recent Activity */}
              <RecentActivityFeed />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 
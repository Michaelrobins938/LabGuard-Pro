'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, User, Building, Crown, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';

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
  
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // First check if we have a token
      if (!apiClient.isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      // Try to get fresh user data from API
      const response = await apiClient.getProfile();
      
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        // If API fails, try localStorage
        const storedUser = localStorage.getItem('labguard_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          throw new Error('No user data found');
        }
      }
    } catch (error: any) {
      console.error('❌ Failed to load user data:', error);
      setError('Failed to load user data');
      // Redirect to login if we can't get user data
      setTimeout(() => router.push('/auth/login'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    
    try {
      await apiClient.logout();
      console.log('✅ Logout successful');
      
      // Clear all stored data
      localStorage.removeItem('labguard_user');
      
      // Redirect to login
      router.push('/auth/login');
      
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      // Even if logout API fails, clear local data and redirect
      localStorage.removeItem('labguard_user');
      router.push('/auth/login');
    } finally {
      setLoggingOut(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      default:
        return <User className="h-4 w-4 text-blue-600" />;
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LabGuard Pro</h1>
              <p className="text-gray-600">Laboratory Management System</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              disabled={loggingOut}
              className="flex items-center space-x-2"
            >
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span>{loggingOut ? 'Signing Out...' : 'Sign Out'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h2>
            <p className="text-blue-100">
              You're successfully signed in to your laboratory management dashboard.
            </p>
          </div>

          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(user?.role || '')}
                    <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Role: <span className="font-medium capitalize">{user?.role.toLowerCase()}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Laboratory Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Laboratory</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{user?.laboratory.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Plan: <span className="font-medium capitalize">{user?.laboratory.planType}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: <span className="font-medium capitalize">{user?.laboratory.subscriptionStatus}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Session Info Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Session Info</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Last Login:
                  </p>
                  <p className="text-xs font-medium">
                    {user?.lastLoginAt ? formatDate(user.lastLoginAt) : 'Just now'}
                  </p>
                  <p className="text-xs text-green-600">
                    ✅ Authentication Active
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Your authentication system is working perfectly! Here's what we can build next:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-green-600">✅ Completed</h4>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>• User registration</li>
                      <li>• User login</li>
                      <li>• User logout</li>
                      <li>• Session management</li>
                      <li>• Protected routes</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-blue-600">🔄 Ready to Build</h4>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>• Equipment management</li>
                      <li>• Calibration tracking</li>
                      <li>• AI assistant</li>
                      <li>• Team management</li>
                      <li>• Reporting system</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 
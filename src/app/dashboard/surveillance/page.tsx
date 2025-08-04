'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Database, 
  FileText, 
  Upload, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { SurveillanceMetrics, SurveillanceConnectionStatus } from '@/types/surveillance';

export default function SurveillanceDashboard() {
  const [metrics, setMetrics] = useState<SurveillanceMetrics>({
    totalSamples: 0,
    positiveCases: 0,
    positivityRate: 0,
    counties: 0,
    reportsGenerated: 0,
    lastUpdated: new Date()
  });

  const [connectionStatus, setConnectionStatus] = useState<SurveillanceConnectionStatus>({
    labware: 'disconnected',
    nedss: 'disconnected',
    arboret: 'disconnected',
    equipment: 'disconnected'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveillanceData();
  }, []);

  const fetchSurveillanceData = async () => {
    try {
      // Fetch analytics summary
      const analyticsResponse = await fetch('/api/surveillance/analytics/summary');
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setMetrics({
          totalSamples: analyticsData.data?.totalSamples || 0,
          positiveCases: analyticsData.data?.positiveCases || 0,
          positivityRate: analyticsData.data?.positivityRate || 0,
          counties: analyticsData.data?.counties || 0,
          reportsGenerated: analyticsData.data?.reportsGenerated || 0,
          lastUpdated: new Date()
        });
      }

      // Fetch connection status (mock data for now)
      setConnectionStatus({
        labware: 'connected',
        nedss: 'connected',
        arboret: 'disconnected',
        equipment: 'connected'
      });
    } catch (error) {
      console.error('Error fetching surveillance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading surveillance dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Surveillance Dashboard</h1>
          <p className="text-gray-600 mt-1">Public health surveillance and reporting system</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchSurveillanceData}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSamples.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last updated: {metrics.lastUpdated.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.positiveCases.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Positivity rate: {metrics.positivityRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Counties</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.counties}</div>
            <p className="text-xs text-muted-foreground">
              Counties with active surveillance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.reportsGenerated}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Connections</CardTitle>
          <CardDescription>Status of surveillance system integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(connectionStatus).map(([system, status]) => (
              <div key={system} className="flex items-center space-x-2">
                {getStatusIcon(status)}
                <div>
                  <p className="text-sm font-medium capitalize">{system}</p>
                  <Badge className={getStatusColor(status)}>
                    {status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common surveillance tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <a href="/dashboard/surveillance/labware">
                <Database className="w-6 h-6 mb-2" />
                <span>LabWare Integration</span>
              </a>
            </Button>

            <Button variant="outline" className="h-20 flex-col" asChild>
              <a href="/dashboard/surveillance/nedss">
                <Upload className="w-6 h-6 mb-2" />
                <span>NEDSS Automation</span>
              </a>
            </Button>

            <Button variant="outline" className="h-20 flex-col" asChild>
              <a href="/dashboard/surveillance/arboret">
                <Upload className="w-6 h-6 mb-2" />
                <span>ArboNET Upload</span>
              </a>
            </Button>

            <Button variant="outline" className="h-20 flex-col" asChild>
              <a href="/dashboard/surveillance/reports">
                <FileText className="w-6 h-6 mb-2" />
                <span>Report Generation</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Recent surveillance activity will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Surveillance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Detailed analytics and trends will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Generated report history will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Surveillance Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">System configuration and settings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
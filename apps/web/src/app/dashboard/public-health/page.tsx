"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Thermometer,
  FileText,
  Download,
  RefreshCw,
  Microscope,
  Globe,
  Brain,
  Settings
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import SurveillanceDataManagement from '@/components/public-health/SurveillanceDataManagement';
import SystemIntegrationsTab from '@/components/public-health/SystemIntegrationsTab';
import AutomatedReportsTab from '@/components/public-health/AutomatedReportsTab';
import AIAnalyticsTab from '@/components/public-health/AIAnalyticsTab';
import EquipmentMonitoringTab from '@/components/public-health/EquipmentMonitoringTab';
import PublicHealthSettingsTab from '@/components/public-health/PublicHealthSettingsTab';

interface SurveillanceMetrics {
  totalSamplesThisWeek: number;
  positiveSamplesThisWeek: number;
  positivityRate: number;
  activeClusters: number;
  equipmentAlertsActive: number;
  lastSyncTime: string;
  samplesLastHour: number;
  weekOverWeekChange: number;
}

interface AlertItem {
  id: string;
  type: 'outbreak' | 'equipment' | 'compliance' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  actionRequired: boolean;
}

export default function PublicHealthDashboard() {
  const [metrics, setMetrics] = useState<SurveillanceMetrics>({
    totalSamplesThisWeek: 0,
    positiveSamplesThisWeek: 0,
    positivityRate: 0,
    activeClusters: 0,
    equipmentAlertsActive: 0,
    lastSyncTime: '',
    samplesLastHour: 0,
    weekOverWeekChange: 0
  });
  
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // 5 min updates
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsResponse, alertsResponse] = await Promise.all([
        fetch('/api/public-health/metrics'),
        fetch('/api/public-health/alerts')
      ]);

      if (!metricsResponse.ok || !alertsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const metricsData = await metricsResponse.json();
      const alertsData = await alertsResponse.json();

      setMetrics(metricsData.data);
      setAlerts(alertsData.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const syncLabWareData = async () => {
    setSyncing(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const response = await fetch('/api/public-health/sync/labware', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Sync failed');
      }

      const result = await response.json();
      
      toast({
        title: "Sync Complete",
        description: `Successfully synced ${result.samplesProcessed} samples from LabWare LIMS.`
      });

      fetchDashboardData(); // Refresh metrics
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync data from LabWare LIMS. Please check your connection settings.",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const generateWeeklyReports = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/public-health/reports/generate-weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reportDate: new Date().toISOString(),
          counties: ['TARRANT', 'DALLAS', 'DENTON', 'COLLIN'] // All active counties
        })
      });

      if (!response.ok) {
        throw new Error('Report generation failed');
      }

      const result = await response.json();
      
      toast({
        title: "Reports Generated",
        description: `Successfully generated and distributed ${result.reportsGenerated} county reports.`
      });

    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate weekly reports. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/public-health/alerts/${alertId}/acknowledge`, {
        method: 'POST'
      });

      if (response.ok) {
        setAlerts(alerts.map(alert => 
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        ));
        
        toast({
          title: "Alert Acknowledged",
          description: "Alert has been marked as acknowledged."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to acknowledge alert.",
        variant: "destructive"
      });
    }
  };

  const getAlertBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    const color = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
    return <span className={color}>{sign}{change}%</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading surveillance dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Public Health Surveillance</h1>
          <p className="text-gray-600 mt-1">Tarrant County Public Health Laboratory</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={syncLabWareData} 
            disabled={syncing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync LabWare'}</span>
          </Button>
          <Button 
            onClick={generateWeeklyReports} 
            disabled={generating}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <FileText className="h-4 w-4" />
            <span>{generating ? 'Generating...' : 'Generate Reports'}</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Samples This Week</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSamplesThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              {formatChange(metrics.weekOverWeekChange)} from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Samples</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metrics.positiveSamplesThisWeek}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.samplesLastHour} in last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positivity Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.positivityRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Current week average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clusters</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metrics.activeClusters}
            </div>
            <p className="text-xs text-muted-foreground">
              Geographic clusters detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Alerts</CardTitle>
            <Thermometer className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {metrics.equipmentAlertsActive}
            </div>
            <p className="text-xs text-muted-foreground">
              Active monitoring alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {metrics.lastSyncTime ? new Date(metrics.lastSyncTime).toLocaleTimeString() : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              LabWare LIMS data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts Section */}
      {alerts.filter(alert => !alert.acknowledged).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Active Alerts ({alerts.filter(alert => !alert.acknowledged).length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.filter(alert => !alert.acknowledged).slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Badge variant={getAlertBadgeVariant(alert.priority)}>
                      {alert.priority.toUpperCase()}
                    </Badge>
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Acknowledge
                  </Button>
                </div>
              ))}
              {alerts.filter(alert => !alert.acknowledged).length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  {alerts.filter(alert => !alert.acknowledged).length - 5} more alerts...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="surveillance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="surveillance">Surveillance Data</TabsTrigger>
          <TabsTrigger value="integrations">System Integrations</TabsTrigger>
          <TabsTrigger value="reports">Automated Reports</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="equipment">Equipment Monitoring</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="surveillance" className="space-y-4">
          <SurveillanceDataManagement />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <SystemIntegrationsTab />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <AutomatedReportsTab />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AIAnalyticsTab />
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <EquipmentMonitoringTab />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <PublicHealthSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
} 
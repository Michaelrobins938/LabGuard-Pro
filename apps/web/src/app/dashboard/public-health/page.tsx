'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  FileText, 
  Globe, 
  Brain, 
  Clock,
  TrendingUp,
  MapPin,
  TestTube,
  Bell,
  Upload
} from 'lucide-react';

interface SurveillanceMetrics {
  totalSamplesThisWeek: number;
  positiveSamplesThisWeek: number;
  positivityRate: number;
  activeClusters: number;
  equipmentAlertsActive: number;
  pendingReports: number;
  lastSyncTime: string;
}

interface Alert {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  type: 'outbreak' | 'equipment' | 'compliance' | 'integration';
}

export default function PublicHealthDashboard() {
  const [metrics, setMetrics] = useState<SurveillanceMetrics>({
    totalSamplesThisWeek: 0,
    positiveSamplesThisWeek: 0,
    positivityRate: 0,
    activeClusters: 0,
    equipmentAlertsActive: 0,
    pendingReports: 0,
    lastSyncTime: 'Never'
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData.data);
      }

      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const generateWeeklyReports = async () => {
    try {
      const response = await fetch('/api/public-health/reports/generate-weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportDate: new Date().toISOString() })
      });

      if (response.ok) {
        alert('Weekly reports generated and distributed successfully!');
        fetchDashboardData(); // Refresh data
      } else {
        alert('Error generating reports');
      }
    } catch (error) {
      alert('Error generating reports');
    }
  };

  const syncLabWareData = async () => {
    try {
      const response = await fetch('/api/surveillance/labware/samples', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert('LabWare data synchronized successfully!');
        fetchDashboardData(); // Refresh data
      } else {
        alert('Error syncing LabWare data');
      }
    } catch (error) {
      alert('Error syncing LabWare data');
    }
  };

  const automateNEDSSSubmission = async () => {
    try {
      const response = await fetch('/api/surveillance/nedss/automate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countyCode: 'TARRANT',
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString(),
          caseData: [] // This would be populated with actual case data
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`NEDSS automation completed! Processed ${result.data.processed} cases.`);
        fetchDashboardData();
      } else {
        alert('Error automating NEDSS submission');
      }
    } catch (error) {
      alert('Error automating NEDSS submission');
    }
  };

  const uploadToArboNET = async () => {
    try {
      const response = await fetch('/api/surveillance/arboret/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countyCode: 'TARRANT',
          weekEnding: new Date().toISOString(),
          speciesData: [] // This would be populated with actual species data
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`ArboNET upload completed! Uploaded ${result.data.uploaded} records.`);
        fetchDashboardData();
      } else {
        alert('Error uploading to ArboNET');
      }
    } catch (error) {
      alert('Error uploading to ArboNET');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading surveillance dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Public Health Surveillance</h1>
          <p className="text-gray-600 mt-1">West Nile Virus surveillance and reporting system</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={syncLabWareData} variant="outline" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Sync LabWare
          </Button>
          <Button onClick={automateNEDSSSubmission} variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Automate NEDSS
          </Button>
          <Button onClick={uploadToArboNET} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Upload ArboNET
          </Button>
          <Button onClick={generateWeeklyReports} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Weekly Reports
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Samples This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSamplesThisWeek}</div>
            <p className="text-xs text-gray-500 mt-1">Total mosquito pools tested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Positive Samples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.positiveSamplesThisWeek}</div>
            <p className="text-xs text-gray-500 mt-1">WNV positive pools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Positivity Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.positivityRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">Weekly positivity rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Active Clusters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeClusters}</div>
            <p className="text-xs text-gray-500 mt-1">Geographic clusters detected</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4 text-orange-600" />
              Equipment Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.equipmentAlertsActive}</div>
            <p className="text-xs text-gray-500 mt-1">Active temperature alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pending Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingReports}</div>
            <p className="text-xs text-gray-500 mt-1">Reports awaiting distribution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{metrics.lastSyncTime}</div>
            <p className="text-xs text-gray-500 mt-1">LabWare data sync</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map(alert => (
                <Alert key={alert.id}>
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.priority === 'critical' ? 'destructive' : 
                                       alert.priority === 'high' ? 'default' : 'secondary'}>
                          {alert.priority.toUpperCase()}
                        </Badge>
                        <span>{alert.message}</span>
                      </div>
                      <span className="text-xs text-gray-500">{alert.timestamp}</span>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="surveillance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="surveillance">Surveillance Data</TabsTrigger>
          <TabsTrigger value="integrations">System Integrations</TabsTrigger>
          <TabsTrigger value="reports">Automated Reports</TabsTrigger>
          <TabsTrigger value="analytics">AI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="surveillance">
          <SurveillanceDataTab />
        </TabsContent>

        <TabsContent value="integrations">
          <SystemIntegrationsTab />
        </TabsContent>

        <TabsContent value="reports">
          <AutomatedReportsTab />
        </TabsContent>

        <TabsContent value="analytics">
          <AIAnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Tab Components
function SurveillanceDataTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Surveillance Data Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Surveillance data management interface will be implemented here.</p>
      </CardContent>
    </Card>
  );
}

function SystemIntegrationsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">System integration management interface will be implemented here.</p>
      </CardContent>
    </Card>
  );
}

function AutomatedReportsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Automated report management interface will be implemented here.</p>
      </CardContent>
    </Card>
  );
}

function AIAnalyticsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">AI analysis interface will be implemented here.</p>
      </CardContent>
    </Card>
  );
} 
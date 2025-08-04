'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  FileText, 
  Database, 
  Globe, 
  Mail, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Thermometer,
  Zap
} from 'lucide-react';

interface SurveillanceStats {
  totalSamples: number;
  positiveSamples: number;
  reportsGenerated: number;
  emailsSent: number;
  pendingAutomations: number;
  equipmentAlerts: number;
}

interface CountyReport {
  id: string;
  countyCode: string;
  weekEnding: string;
  status: 'pending' | 'generated' | 'sent' | 'failed';
  recipients: string[];
  filePath?: string;
}

export default function SurveillanceDashboard() {
  const [stats, setStats] = useState<SurveillanceStats>({
    totalSamples: 0,
    positiveSamples: 0,
    reportsGenerated: 0,
    emailsSent: 0,
    pendingAutomations: 0,
    equipmentAlerts: 0
  });

  const [recentReports, setRecentReports] = useState<CountyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSurveillanceData();
  }, []);

  const fetchSurveillanceData = async () => {
    try {
      // Fetch surveillance analytics
      const analyticsResponse = await fetch('/api/surveillance/analytics/summary');
      const analytics = await analyticsResponse.json();

      // Fetch recent reports
      const reportsResponse = await fetch('/api/surveillance/reports/history?limit=5');
      const reports = await reportsResponse.json();

      setStats({
        totalSamples: analytics.data?.summary?.totalSamples || 0,
        positiveSamples: analytics.data?.summary?.positiveSamples || 0,
        reportsGenerated: reports.data?.length || 0,
        emailsSent: 0, // Would come from email tracking
        pendingAutomations: 0, // Would come from automation queue
        equipmentAlerts: 0 // Would come from equipment monitoring
      });

      setRecentReports(reports.data || []);
    } catch (error) {
      console.error('Error fetching surveillance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAutomatedReports = async () => {
    try {
      const response = await fetch('/api/surveillance/reports/automated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weekEnding: new Date().toISOString()
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh data
        fetchSurveillanceData();
      }
    } catch (error) {
      console.error('Error generating automated reports:', error);
    }
  };

  const positiveRate = stats.totalSamples > 0 
    ? ((stats.positiveSamples / stats.totalSamples) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Surveillance Dashboard</h1>
          <p className="text-muted-foreground">
            Automated vector surveillance and reporting system
          </p>
        </div>
        <Button onClick={generateAutomatedReports} className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Generate Friday Reports
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSamples}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positiveRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.positiveSamples} positive samples
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reportsGenerated}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.equipmentAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Temperature excursions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common surveillance tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Test LabWare Connection
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="mr-2 h-4 w-4" />
                  Sync to NEDSS
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Weekly Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Thermometer className="mr-2 h-4 w-4" />
                  Check Equipment Status
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest surveillance activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{report.countyCode} County</p>
                        <p className="text-xs text-muted-foreground">
                          Week ending {new Date(report.weekEnding).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={report.status === 'sent' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>County Report Status</CardTitle>
              <CardDescription>
                Track automated report generation and distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {report.status === 'sent' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : report.status === 'failed' ? (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="font-medium">{report.countyCode} County</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(report.weekEnding).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === 'sent' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                      {report.recipients && (
                        <span className="text-sm text-muted-foreground">
                          {report.recipients.length} recipients
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>LabWare Integration</CardTitle>
                <CardDescription>
                  Connect to LabWare LIMS for data extraction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Connection Status</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Sync</span>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Samples This Week</span>
                    <span className="text-sm font-medium">{stats.totalSamples}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NEDSS Automation</CardTitle>
                <CardDescription>
                  Texas NEDSS web automation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Status</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cases Processed</span>
                    <span className="text-sm font-medium">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Submission</span>
                    <span className="text-sm text-muted-foreground">1 hour ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Monitoring</CardTitle>
              <CardDescription>
                Real-time equipment status and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Freezer #1 (SensoScientific)</p>
                      <p className="text-sm text-muted-foreground">-80°C • Normal</p>
                    </div>
                  </div>
                  <Badge variant="default">Online</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Freezer #2 (VWR Logger)</p>
                      <p className="text-sm text-muted-foreground">-80°C • Normal</p>
                    </div>
                  </div>
                  <Badge variant="default">Online</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Water Bath #1</p>
                      <p className="text-sm text-muted-foreground">37°C • Maintenance Due</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Warning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
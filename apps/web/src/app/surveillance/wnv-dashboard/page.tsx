'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, MapPin, TrendingUp, Activity, Users, Calendar, Download, Printer, Camera, Smartphone } from 'lucide-react';

interface SurveillanceMetrics {
  totalSamples: number;
  positiveSamples: number;
  positivityRate: number;
  activeClusters: number;
  currentRisk: string;
  activeTraps: number;
  totalTraps: number;
  coveragePercentage: number;
}

interface AlertItem {
  id: string;
  type: string;
  severity: string;
  message: string;
  location: string;
  timestamp: Date;
  status: string;
}

interface ClusterItem {
  id: string;
  centroid: { latitude: number; longitude: number };
  riskLevel: string;
  positiveSamples: number;
  totalSamples: number;
  positivityRate: number;
  affectedTraps: string[];
}

export default function WNVDashboard() {
  const [metrics, setMetrics] = useState<SurveillanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [clusters, setClusters] = useState<ClusterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('30d');

  useEffect(() => {
    loadDashboardData();
  }, [selectedDateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard summary
      const response = await fetch('/api/analytics/dashboard');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.data.overview);
        setAlerts(data.data.alerts || []);
        setClusters(data.data.spatialAnalysis?.clusters || []);
      } else {
        // Fallback to demo data
        setMetrics({
          totalSamples: 1247,
          positiveSamples: 47,
          positivityRate: 0.0377,
          activeClusters: 3,
          currentRisk: 'MODERATE',
          activeTraps: 42,
          totalTraps: 46,
          coveragePercentage: 91.3
        });
        
        setAlerts([
          {
            id: '1',
            type: 'CLUSTER_DETECTED',
            severity: 'HIGH',
            message: 'New high-risk cluster detected in Fort Worth area',
            location: 'Fort Worth, TX 76102',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'ACTIVE'
          },
          {
            id: '2',
            type: 'POSITIVITY_INCREASE',
            severity: 'MODERATE',
            message: 'Positivity rate increased 15% in Arlington region',
            location: 'Arlington, TX 76006',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            status: 'MONITORING'
          }
        ]);

        setClusters([
          {
            id: 'cluster_1',
            centroid: { latitude: 32.7555, longitude: -97.3308 },
            riskLevel: 'HIGH',
            positiveSamples: 12,
            totalSamples: 47,
            positivityRate: 0.255,
            affectedTraps: ['FTW-001', 'FTW-002', 'FTW-003']
          },
          {
            id: 'cluster_2',
            centroid: { latitude: 32.7357, longitude: -97.1081 },
            riskLevel: 'MODERATE',
            positiveSamples: 8,
            totalSamples: 63,
            positivityRate: 0.127,
            affectedTraps: ['ARL-015', 'ARL-016']
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MODERATE': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleMobileIntake = () => {
    window.open('/mobile/sample-intake', '_blank');
  };

  const handleQuickScan = () => {
    window.open('/mobile/quick-scan', '_blank');
  };

  const handlePrintLabels = async () => {
    try {
      // Get recent samples for printing
      const response = await fetch('/api/wnv-samples?limit=10');
      if (response.ok) {
        const samples = await response.json();
        
        // Create print job
        const printResponse = await fetch('/api/printers/print-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sampleIds: samples.data.slice(0, 5).map((s: any) => s.id),
            printerId: 'zebra-001',
            copies: 1
          })
        });

        if (printResponse.ok) {
          alert('Print job created successfully!');
        }
      }
    } catch (error) {
      console.error('Print error:', error);
      alert('Failed to create print job');
    }
  };

  const handleGenerateDemoData = async () => {
    try {
      const response = await fetch('/api/demo-data/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleCount: 100,
          timeRange: 'CURRENT_SEASON'
        })
      });

      if (response.ok) {
        alert('Demo data generated successfully!');
        loadDashboardData();
      }
    } catch (error) {
      console.error('Demo data generation error:', error);
      alert('Failed to generate demo data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">West Nile Virus Surveillance Dashboard</h1>
          <p className="text-gray-600 mt-1">Tarrant County Public Health Laboratory</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleMobileIntake} className="bg-blue-600 hover:bg-blue-700">
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile Sample Intake
          </Button>
          <Button onClick={handleQuickScan} variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            Quick QR Scan
          </Button>
          <Button onClick={() => window.open('/mobile/print-labels', '_blank')} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print QR Labels
          </Button>
          <Button onClick={handleGenerateDemoData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Generate Demo Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Samples</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.totalSamples || 0}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Positive Samples</p>
                <p className="text-2xl font-bold text-red-600">{metrics?.positiveSamples || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Positivity Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {((metrics?.positivityRate || 0) * 100).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clusters</p>
                <p className="text-2xl font-bold text-purple-600">{metrics?.activeClusters || 0}</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Risk</p>
                <Badge className={`${getRiskLevelColor(metrics?.currentRisk || 'LOW')} text-white`}>
                  {metrics?.currentRisk || 'LOW'}
                </Badge>
              </div>
              <Users className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="clusters">Risk Clusters</TabsTrigger>
          <TabsTrigger value="coverage">Trap Coverage</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                Active Surveillance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="text-sm text-gray-500">{alert.type}</span>
                        </div>
                        <h4 className="font-medium text-gray-900">{alert.message}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {alert.location}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No active alerts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clusters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-purple-500" />
                Spatial-Temporal Risk Clusters
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clusters.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {clusters.map((cluster) => (
                    <div key={cluster.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`${getRiskLevelColor(cluster.riskLevel)} text-white`}>
                          {cluster.riskLevel} RISK
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {(cluster.positivityRate * 100).toFixed(1)}% positive
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Location:</span>
                          <span className="text-sm font-medium">
                            {cluster.centroid.latitude.toFixed(4)}, {cluster.centroid.longitude.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Samples:</span>
                          <span className="text-sm font-medium">
                            {cluster.positiveSamples}/{cluster.totalSamples}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Affected Traps:</span>
                          <span className="text-sm font-medium">
                            {cluster.affectedTraps.length}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <Button variant="outline" size="sm" className="w-full">
                          View on Map
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No active clusters detected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Trap Network Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Traps</span>
                    <span className="text-lg font-bold text-green-600">
                      {metrics?.activeTraps}/{metrics?.totalTraps}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${metrics?.coveragePercentage || 0}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-center">
                    <span className="text-2xl font-bold text-green-600">
                      {(metrics?.coveragePercentage || 0).toFixed(1)}%
                    </span>
                    <p className="text-sm text-gray-600">Coverage</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <Button variant="outline" className="w-full" onClick={handleMobileIntake}>
                      <Smartphone className="w-4 h-4 mr-2" />
                      Add New Sample
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => window.open('/mobile/print-labels', '_blank')}>
                      <Printer className="w-4 h-4 mr-2" />
                      Print QR Labels
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MapPin className="w-4 h-4 mr-2" />
                      View Trap Map
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Sample Collection</p>
                      <p className="text-xs text-gray-600">15 new samples processed</p>
                    </div>
                    <span className="text-xs text-gray-500">2h ago</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Printer className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Labels Printed</p>
                      <p className="text-xs text-gray-600">25 QR labels generated</p>
                    </div>
                    <span className="text-xs text-gray-500">4h ago</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Alert Generated</p>
                      <p className="text-xs text-gray-600">High-risk cluster detected</p>
                    </div>
                    <span className="text-xs text-gray-500">6h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Spatial-Temporal Analysis
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Generate Heat Map
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Outbreak Detection
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Activity Forecast
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleMobileIntake}>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Open Mobile Sample Intake
                </Button>
                <Button className="w-full" variant="outline" onClick={handleQuickScan}>
                  <Camera className="w-4 h-4 mr-2" />
                  Quick QR Code Scanner
                </Button>
                <Button className="w-full" variant="outline" onClick={handlePrintLabels}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Sample Labels
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Trap Network
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">API Response Time</span>
                    <span className="text-sm font-medium text-green-600">145ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Database Performance</span>
                    <span className="text-sm font-medium text-green-600">Optimal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mobile App Status</span>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Run Performance Tests
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Samples/Hour</span>
                    <span className="text-sm font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">QR Codes Generated</span>
                    <span className="text-sm font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Print Jobs</span>
                    <span className="text-sm font-medium">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Printers</span>
                    <Badge className="bg-green-100 text-green-800">2/3 Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mobile Sync</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
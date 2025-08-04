'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FlaskConical, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Users,
  TestTube,
  Activity,
  Eye,
  Download,
  Plus
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Interfaces for West Nile Virus specific data
interface SurveillanceSummary {
  summary: {
    totalSamples: number;
    positiveSamples: number;
    positivityRate: number;
    completedTests: number;
    pendingTests: number;
    recentActivity: number;
  };
  timeRange: string;
  lastUpdated: string;
}

interface MosquitoPool {
  id: string;
  sampleId: string;
  status: 'RECEIVED' | 'PROCESSING' | 'COMPLETED' | 'POSITIVE';
  collectionDate: string;
  location: string;
  data: {
    poolId: string;
    collectionInfo: {
      trapType: string;
      collectorName: string;
      trapLocation: {
        latitude: number;
        longitude: number;
        address?: string;
      };
    };
    taxonomicInfo: {
      mosquitoSpecies: string;
      poolSize: number;
      sexDetermination: string;
    };
    qrCode: string;
    barcode: string;
  };
  aiAnalysis?: {
    wnvResult: 'POSITIVE' | 'NEGATIVE' | 'PENDING';
    ctValue?: number;
    plateId?: string;
  };
}

interface GeographicData {
  sampleId: string;
  latitude: number;
  longitude: number;
  location: string;
  result: 'POSITIVE' | 'NEGATIVE' | 'PENDING';
  ctValue?: number;
  collectionDate: string;
  trapType: string;
  species: string;
}

interface EquipmentStatus {
  equipmentId: string;
  name: string;
  realTimeStatus: {
    temperature: number;
    runStatus: 'IDLE' | 'RUNNING' | 'PAUSED' | 'ERROR' | 'MAINTENANCE';
    currentCycle: number;
    timeRemaining: number;
    plateId: string;
    protocol: string;
    performance: {
      successfulRunRate: number;
      utilizationRate: number;
      downtimeHours: number;
    };
  };
}

export default function WestNileVirusDashboard() {
  const [surveillanceSummary, setSurveillanceSummary] = useState<SurveillanceSummary | null>(null);
  const [mosquitoPools, setMosquitoPools] = useState<MosquitoPool[]>([]);
  const [equipmentStatus, setEquipmentStatus] = useState<EquipmentStatus[]>([]);
  const [geographicData, setGeographicData] = useState<GeographicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30d');

  // Real-time data fetching
  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, poolsRes, equipmentRes, geoRes] = await Promise.all([
        fetch(`/api/west-nile-virus/surveillance-summary?timeRange=${timeRange}`),
        fetch('/api/west-nile-virus/mosquito-pools?limit=10&status=PROCESSING,COMPLETED'),
        fetch('/api/equipment?equipmentType=ANALYZER&laboratoryId=' + localStorage.getItem('laboratoryId')),
        fetch(`/api/west-nile-virus/geographic-analysis?timeRange=${timeRange}&includeNegative=false`)
      ]);

      if (!summaryRes.ok || !poolsRes.ok || !equipmentRes.ok || !geoRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [summary, pools, equipment, geographic] = await Promise.all([
        summaryRes.json(),
        poolsRes.json(),
        equipmentRes.json(),
        geoRes.json()
      ]);

      setSurveillanceSummary(summary.data);
      setMosquitoPools(pools.data || []);
      setEquipmentStatus(equipment.data || []);
      setGeographicData(geographic.data?.samples || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPool = () => {
    // Navigate to mosquito pool registration
    window.location.href = '/dashboard/west-nile-virus/register-pool';
  };

  const handleSetupPCR = () => {
    // Navigate to PCR plate setup
    window.location.href = '/dashboard/west-nile-virus/pcr-setup';
  };

  const handleViewReports = () => {
    // Navigate to surveillance reports
    window.location.href = '/dashboard/surveillance/reports';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error loading dashboard: {error}
          <Button onClick={fetchDashboardData} className="ml-2" size="sm">Retry</Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">West Nile Virus Surveillance</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and testing for Tarrant County Public Health Laboratory
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button onClick={fetchDashboardData} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveillanceSummary?.summary.totalSamples || 0}</div>
            <p className="text-xs text-muted-foreground">
              {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
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
              {surveillanceSummary?.summary.positiveSamples || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {surveillanceSummary?.summary.positivityRate?.toFixed(1) || 0}% positivity rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
            <FlaskConical className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveillanceSummary?.summary.completedTests || 0}</div>
            <p className="text-xs text-muted-foreground">
              {surveillanceSummary?.summary.pendingTests || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveillanceSummary?.summary.recentActivity || 0}</div>
            <p className="text-xs text-muted-foreground">
              Actions in last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time PCR Equipment Status */}
      <Card>
        <CardHeader>
          <CardTitle>PCR Equipment Status</CardTitle>
          <CardDescription>Real-time monitoring of West Nile virus testing equipment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {equipmentStatus.length > 0 ? (
              equipmentStatus.map((equipment) => (
                <div key={equipment.equipmentId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{equipment.name}</h4>
                    <Badge 
                      variant={equipment.realTimeStatus?.runStatus === 'RUNNING' ? 'default' : 
                              equipment.realTimeStatus?.runStatus === 'ERROR' ? 'destructive' : 'secondary'}
                    >
                      {equipment.realTimeStatus?.runStatus || 'UNKNOWN'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Temperature:</span>
                      <div className="font-medium">{equipment.realTimeStatus?.temperature || '--'}°C</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current Cycle:</span>
                      <div className="font-medium">{equipment.realTimeStatus?.currentCycle || 0}/45</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time Remaining:</span>
                      <div className="font-medium">{equipment.realTimeStatus?.timeRemaining || 0} min</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success Rate:</span>
                      <div className="font-medium">{equipment.realTimeStatus?.performance?.successfulRunRate || 0}%</div>
                    </div>
                  </div>
                  
                  {equipment.realTimeStatus?.plateId && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <span className="text-xs font-medium text-blue-700">
                        Plate: {equipment.realTimeStatus.plateId}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-muted-foreground py-8">
                No PCR equipment found. Check equipment connections.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Mosquito Pool Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Mosquito Pools</CardTitle>
              <CardDescription>Latest samples in processing</CardDescription>
            </div>
            <Button onClick={handleRegisterPool} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Register Pool
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mosquitoPools.length > 0 ? (
                mosquitoPools.slice(0, 5).map((pool) => (
                  <div key={pool.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{pool.data.poolId}</div>
                        <div className="text-sm text-muted-foreground">
                          {pool.data.taxonomicInfo.mosquitoSpecies} • {pool.data.taxonomicInfo.poolSize} specimens
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(pool.collectionDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={pool.status === 'COMPLETED' ? 'default' : 
                                pool.status === 'PROCESSING' ? 'secondary' : 
                                pool.aiAnalysis?.wnvResult === 'POSITIVE' ? 'destructive' : 'outline'}
                      >
                        {pool.aiAnalysis?.wnvResult || pool.status}
                      </Badge>
                      {pool.aiAnalysis?.ctValue && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Ct: {pool.aiAnalysis.ctValue}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No recent mosquito pools found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Hotspots */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Geographic Analysis</CardTitle>
              <CardDescription>Positive detection locations</CardDescription>
            </div>
            <Button onClick={() => window.location.href = '/dashboard/surveillance/analytics'} size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View Map
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {geographicData.length > 0 ? (
                geographicData.slice(0, 5).map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">{location.sampleId}</div>
                        <div className="text-sm text-muted-foreground">
                          {location.location}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {location.species} • {location.trapType}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">POSITIVE</Badge>
                      {location.ctValue && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Ct: {location.ctValue}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No positive detections in selected time range
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common West Nile virus testing workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleRegisterPool} className="h-16 flex flex-col space-y-1">
              <Plus className="h-5 w-5" />
              <span>Register Mosquito Pool</span>
            </Button>
            <Button onClick={handleSetupPCR} variant="outline" className="h-16 flex flex-col space-y-1">
              <FlaskConical className="h-5 w-5" />
              <span>Setup PCR Plate</span>
            </Button>
            <Button onClick={handleViewReports} variant="outline" className="h-16 flex flex-col space-y-1">
              <Download className="h-5 w-5" />
              <span>Generate Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-xs text-muted-foreground text-center">
        Last updated: {surveillanceSummary?.lastUpdated ? 
          new Date(surveillanceSummary.lastUpdated).toLocaleString() : 
          'Never'
        }
      </div>
    </div>
  );
}
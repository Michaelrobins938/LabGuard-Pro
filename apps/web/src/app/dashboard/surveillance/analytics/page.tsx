'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  MapPin, 
  Calendar,
  Download,
  RefreshCw,
  Eye,
  FileText,
  Globe,
  PieChart,
  LineChart,
  BarChart,
  ScatterChart,
  AlertCircle,
  Info,
  Star,
  Target,
  Users,
  Clock
} from 'lucide-react';
import { SurveillanceAnalytics } from '@/types/surveillance';

export default function SurveillanceAnalyticsPage() {
  const [analytics, setAnalytics] = useState<SurveillanceAnalytics>({
    id: '',
    laboratoryId: '',
    reportDate: new Date(),
    totalSamples: 0,
    positiveSamples: 0,
    negativeSamples: 0,
    pendingSamples: 0,
    positiveCases: 0,
    positivityRate: 0,
    sampleTypes: {
      clinical: 0,
      environmental: 0,
      food: 0,
      water: 0,
      other: 0
    },
    priorityLevels: {
      routine: 0,
      urgent: 0,
      emergency: 0
    },
    turnaroundTime: {
      average: 0,
      median: 0,
      range: {
        min: 0,
        max: 0
      }
    },
    qualityMetrics: {
      accuracy: 0,
      precision: 0,
      sensitivity: 0,
      specificity: 0
    },
    aiInsights: {
      trends: [],
      anomalies: [],
      recommendations: []
    },
    speciesBreakdown: [],
    geographicDistribution: [],
    temporalTrends: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCounty, setSelectedCounty] = useState('all');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, selectedCounty]);

  const fetchAnalyticsData = async () => {
    try {
      const params = new URLSearchParams({
        timeRange,
        ...(selectedCounty !== 'all' && { countyCode: selectedCounty })
      });

      const response = await fetch(`/api/surveillance/analytics/summary?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data || {
          totalSamples: 0,
          positiveCases: 0,
          positivityRate: 0,
          speciesBreakdown: [],
          geographicDistribution: [],
          temporalTrends: []
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async (format: 'json' | 'csv' | 'pdf') => {
    try {
      const response = await fetch(`/api/surveillance/analytics/export?format=${format}&timeRange=${timeRange}&countyCode=${selectedCounty}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `surveillance-analytics-${timeRange}-${selectedCounty}.${format}`;
        a.click();
      }
    } catch (error) {
      console.error('Error exporting analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Surveillance Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for public health surveillance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCounty} onValueChange={setSelectedCounty}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              <SelectItem value="TARRANT">Tarrant County</SelectItem>
              <SelectItem value="DALLAS">Dallas County</SelectItem>
              <SelectItem value="COLLIN">Collin County</SelectItem>
              <SelectItem value="DENTON">Denton County</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalyticsData} variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSamples.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Cases</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.positiveCases.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.positivityRate.toFixed(1)}% positivity rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Species Detected</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.speciesBreakdown.length}</div>
            <p className="text-xs text-muted-foreground">
              Different species identified
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.geographicDistribution.length}</div>
            <p className="text-xs text-muted-foreground">
              Geographic locations monitored
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="species">Species Analysis</TabsTrigger>
          <TabsTrigger value="geographic">Geographic Distribution</TabsTrigger>
          <TabsTrigger value="temporal">Temporal Trends</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Positivity Rate Trend</CardTitle>
                <CardDescription>
                  Positivity rate over the selected time period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Chart visualization would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sample Volume</CardTitle>
                <CardDescription>
                  Total samples processed over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Chart visualization would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="species" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Species Breakdown</CardTitle>
              <CardDescription>
                Distribution of detected species
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.speciesBreakdown.map((species, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${index * 30}, 70%, 50%)` }}></div>
                      <span className="font-medium">{species.species}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {species.count} samples
                      </span>
                      <Badge variant="secondary">
                        {species.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
                {analytics.speciesBreakdown.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-2" />
                    <p>No species data available for the selected time period</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>
                Sample collection locations and distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.geographicDistribution.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{location.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {location.count} samples
                      </span>
                      {location.coordinates && (
                        <Badge variant="outline">
                          {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {analytics.geographicDistribution.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>No geographic data available for the selected time period</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temporal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Temporal Trends</CardTitle>
              <CardDescription>
                Sample collection and positivity trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.temporalTrends.slice(-10).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{new Date(trend.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{trend.count}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-red-600">{trend.positiveCount}</div>
                        <div className="text-xs text-muted-foreground">Positive</div>
                      </div>
                      <Badge variant="secondary">
                        {trend.count > 0 ? ((trend.positiveCount / trend.count) * 100).toFixed(1) : 0}%
                      </Badge>
                    </div>
                  </div>
                ))}
                {analytics.temporalTrends.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2" />
                    <p>No temporal data available for the selected time period</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Analytics Data</CardTitle>
              <CardDescription>
                Download analytics data in various formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button onClick={() => exportAnalytics('json')} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button onClick={() => exportAnalytics('csv')} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={() => exportAnalytics('pdf')} className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Export Options</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• JSON: Raw data for further analysis</li>
                  <li>• CSV: Spreadsheet-compatible format</li>
                  <li>• PDF: Formatted report with charts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  Zap,
  Map,
  Clock,
  Eye,
  Download
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar } from 'recharts';

interface ClusterData {
  cluster_id: number;
  sample_count: number;
  center_lat: number;
  center_lng: number;
  samples: Array<{
    pool_id: string;
    latitude: number;
    longitude: number;
    collection_date: string;
  }>;
}

interface TemporalAnomaly {
  week: number;
  year: number;
  positive_count: number;
  expected_count: number;
  z_score: number;
  type: 'spike' | 'drop';
}

interface AIAnalysisResult {
  geographic_clusters: {
    clusters: ClusterData[];
    cluster_count: number;
  };
  temporal_patterns: {
    anomalies: TemporalAnomaly[];
    trend: string;
  };
  report_narrative: string;
  risk_assessment: {
    level: 'low' | 'moderate' | 'high' | 'critical';
    factors: string[];
    recommendations: string[];
  };
  weather_correlation?: {
    temperature_correlation: number;
    rainfall_correlation: number;
    significant_factors: string[];
  };
}

export default function AIAnalyticsTab() {
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('current_week');
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    fetchSurveillanceData();
  }, [timeframe]);

  const fetchSurveillanceData = async () => {
    try {
      const response = await fetch(`/api/public-health/samples?period=${timeframe}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      setSamples(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load surveillance data for analysis.",
        variant: "destructive"
      });
    }
  };

  const runAIAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/biomni/surveillance-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          samples: samples,
          analysis_type: analysisType,
          timeframe: timeframe,
          metrics: {
            total_pools: samples.length,
            positive_pools: samples.filter((s: any) => s.result === 'positive').length,
            positivity_rate: samples.length > 0 ? samples.filter((s: any) => s.result === 'positive').length / samples.length : 0
          }
        })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      setAnalysisResult(result.analysis);
      
      toast({
        title: "AI Analysis Complete",
        description: "Surveillance data analysis has been completed successfully."
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to complete AI analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAlerts = async () => {
    if (!analysisResult) return;

    try {
      const response = await fetch('/api/public-health/alerts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis_result: analysisResult,
          samples: samples
        })
      });

      if (!response.ok) throw new Error('Alert generation failed');

      const result = await response.json();
      
      toast({
        title: "Alerts Generated",
        description: `Generated ${result.alerts_created} new alerts based on AI analysis.`
      });
    } catch (error) {
      toast({
        title: "Alert Generation Failed",
        description: "Failed to generate alerts from analysis.",
        variant: "destructive"
      });
    }
  };

  const exportAnalysis = async () => {
    if (!analysisResult) return;

    try {
      const response = await fetch('/api/public-health/analysis/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis_result: analysisResult,
          timeframe: timeframe,
          format: 'pdf'
        })
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_analysis_${timeframe}_${new Date().toISOString().slice(0,10)}.pdf`;
      a.click();
      
      toast({
        title: "Export Complete",
        description: "AI analysis report has been exported successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export analysis report.",
        variant: "destructive"
      });
    }
  };

  const getRiskBadge = (level: string) => {
    const variants = {
      'low': 'default',
      'moderate': 'secondary',
      'high': 'destructive',
      'critical': 'destructive'
    } as const;

    const colors = {
      'low': 'text-green-600',
      'moderate': 'text-yellow-600',
      'high': 'text-orange-600',
      'critical': 'text-red-600'
    };

    return (
      <Badge variant={variants[level as keyof typeof variants]} className={colors[level as keyof typeof colors]}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const getWeeklyTrendData = () => {
    if (!samples.length) return [];
    
    const weeklyData = samples.reduce((acc: any, sample: any) => {
      const week = new Date(sample.collection_date).toISOString().slice(0, 10);
      if (!acc[week]) {
        acc[week] = { date: week, positive: 0, negative: 0, total: 0 };
      }
      acc[week][sample.result === 'positive' ? 'positive' : 'negative']++;
      acc[week].total++;
      return acc;
    }, {});

    return Object.values(weeklyData).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const getGeographicData = () => {
    return samples
      .filter((s: any) => s.latitude && s.longitude)
      .map((s: any) => ({
        ...s,
        x: s.longitude,
        y: s.latitude,
        fill: s.result === 'positive' ? '#ef4444' : '#3b82f6'
      }));
  };

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI-Powered Surveillance Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-sm font-medium">Timeframe</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current_week">Current Week</SelectItem>
                    <SelectItem value="last_week">Last Week</SelectItem>
                    <SelectItem value="last_month">Last Month</SelectItem>
                    <SelectItem value="last_quarter">Last Quarter</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Analysis Type</label>
                <Select value={analysisType} onValueChange={setAnalysisType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="geographic">Geographic Only</SelectItem>
                    <SelectItem value="temporal">Temporal Only</SelectItem>
                    <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-600">
                <p>{samples.length} samples loaded</p>
                <p>{samples.filter((s: any) => s.result === 'positive').length} positive</p>
              </div>
            </div>

            <div className="flex space-x-2">
              {analysisResult && (
                <>
                  <Button variant="outline" onClick={generateAlerts}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Generate Alerts
                  </Button>
                  <Button variant="outline" onClick={exportAnalysis}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </>
              )}
              <Button onClick={runAIAnalysis} disabled={loading}>
                {loading ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Run AI Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Risk Assessment Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Risk Assessment</span>
                </span>
                {getRiskBadge(analysisResult.risk_assessment.level)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Risk Factors Identified:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysisResult.risk_assessment.factors.map((factor, index) => (
                      <li key={index} className="text-sm">{factor}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommendations:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysisResult.risk_assessment.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geographic Clusters */}
          {analysisResult.geographic_clusters.cluster_count > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Geographic Clusters Detected ({analysisResult.geographic_clusters.cluster_count})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Cluster Details</h4>
                    <div className="space-y-3">
                      {analysisResult.geographic_clusters.clusters.map((cluster) => (
                        <div key={cluster.cluster_id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">Cluster {cluster.cluster_id}</h5>
                              <p className="text-sm text-gray-600">
                                {cluster.sample_count} positive samples
                              </p>
                              <p className="text-sm text-gray-600">
                                Center: {cluster.center_lat.toFixed(4)}, {cluster.center_lng.toFixed(4)}
                              </p>
                            </div>
                            <Badge variant="destructive">High Priority</Badge>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-xs text-gray-500">
                              Samples: {cluster.samples.map(s => s.pool_id).join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Geographic Distribution</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <ScatterChart data={getGeographicData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" name="Longitude" />
                        <YAxis dataKey="y" name="Latitude" />
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${props.payload.pool_id} - ${props.payload.result}`,
                            'Sample'
                          ]}
                        />
                        <Scatter name="Negative" data={getGeographicData().filter(d => d.result === 'negative')} fill="#3b82f6" />
                        <Scatter name="Positive" data={getGeographicData().filter(d => d.result === 'positive')} fill="#ef4444" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Temporal Anomalies */}
          {analysisResult.temporal_patterns.anomalies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Temporal Anomalies Detected ({analysisResult.temporal_patterns.anomalies.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Anomaly Details</h4>
                    <div className="space-y-3">
                      {analysisResult.temporal_patterns.anomalies.map((anomaly, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">Week {anomaly.week}, {anomaly.year}</h5>
                              <p className="text-sm text-gray-600">
                                {anomaly.positive_count} positive (expected: {anomaly.expected_count})
                              </p>
                              <p className="text-sm text-gray-600">
                                Z-score: {anomaly.z_score}
                              </p>
                            </div>
                            <Badge variant={anomaly.type === 'spike' ? 'destructive' : 'secondary'}>
                              {anomaly.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Weekly Trend</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getWeeklyTrendData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="positive" stroke="#ef4444" strokeWidth={2} name="Positive" />
                        <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weather Correlation */}
          {analysisResult.weather_correlation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Weather Pattern Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <h4 className="font-medium">Temperature Correlation</h4>
                    <p className="text-2xl font-bold">
                      {(analysisResult.weather_correlation.temperature_correlation * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {Math.abs(analysisResult.weather_correlation.temperature_correlation) > 0.3 ? 'Significant' : 'Minimal'} correlation
                    </p>
                  </div>

                  <div className="text-center">
                    <h4 className="font-medium">Rainfall Correlation</h4>
                    <p className="text-2xl font-bold">
                      {(analysisResult.weather_correlation.rainfall_correlation * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {Math.abs(analysisResult.weather_correlation.rainfall_correlation) > 0.3 ? 'Significant' : 'Minimal'} correlation
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Significant Factors</h4>
                    <ul className="text-sm space-y-1">
                      {analysisResult.weather_correlation.significant_factors.map((factor, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Narrative Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI-Generated Analysis Report</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {analysisResult.report_narrative}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Analysis State */}
      {!analysisResult && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">AI Analysis Ready</h3>
            <p className="text-gray-600 mb-6">
              Run comprehensive AI analysis on your surveillance data to detect patterns, clusters, and anomalies.
            </p>
            <Button onClick={runAIAnalysis} size="lg">
              <Brain className="h-5 w-5 mr-2" />
              Start AI Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
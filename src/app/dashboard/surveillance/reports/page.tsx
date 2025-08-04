'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Calendar,
  MapPin,
  BarChart3,
  History
} from 'lucide-react';
import { SurveillanceReport, SurveillanceReportHistory } from '@/types/surveillance';

export default function SurveillanceReports() {
  const [reportData, setReportData] = useState<SurveillanceReport>({
    countyCode: '',
    weekEnding: new Date(),
    reportType: 'weekly',
    includeMaps: true,
    includeHistorical: true
  });

  const [reportHistory, setReportHistory] = useState<SurveillanceReportHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchReportHistory();
  }, []);

  const fetchReportHistory = async () => {
    try {
      const response = await fetch('/api/surveillance/reports/history');
      if (response.ok) {
        const data = await response.json();
        setReportHistory(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching report history:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    setGenerationStatus('generating');

    try {
      const response = await fetch('/api/surveillance/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        setGenerationStatus('success');
        fetchReportHistory(); // Refresh history
      } else {
        setGenerationStatus('error');
      }
    } catch (error) {
      console.error('Report generation failed:', error);
      setGenerationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'generating':
        return <RefreshCw className="w-4 h-4 animate-spin text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Surveillance Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage county surveillance reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(generationStatus)}>
            {getStatusIcon(generationStatus)}
            <span className="ml-1 capitalize">{generationStatus}</span>
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate County Report</CardTitle>
              <CardDescription>
                Configure and generate automated county surveillance reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="countyCode">County Code</Label>
                  <Input
                    id="countyCode"
                    value={reportData.countyCode}
                    onChange={(e) => setReportData({ ...reportData, countyCode: e.target.value })}
                    placeholder="e.g., 439 (Tarrant County)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weekEnding">Week Ending</Label>
                  <Input
                    id="weekEnding"
                    type="date"
                    value={reportData.weekEnding.toISOString().split('T')[0]}
                    onChange={(e) => setReportData({ ...reportData, weekEnding: new Date(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <select
                    id="reportType"
                    value={reportData.reportType}
                    onChange={(e) => setReportData({ ...reportData, reportType: e.target.value as 'weekly' | 'monthly' | 'quarterly' })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="weekly">Weekly Report</option>
                    <option value="monthly">Monthly Report</option>
                    <option value="quarterly">Quarterly Report</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Report Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeMaps"
                        checked={reportData.includeMaps}
                        onChange={(e) => setReportData({ ...reportData, includeMaps: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="includeMaps">Include Maps</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeHistorical"
                        checked={reportData.includeHistorical}
                        onChange={(e) => setReportData({ ...reportData, includeHistorical: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="includeHistorical">Include Historical Data</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Report Summary</Label>
                <div className="p-4 bg-blue-50 rounded border">
                  <ul className="space-y-1 text-sm">
                    <li>• County: {reportData.countyCode || 'Not specified'}</li>
                    <li>• Week Ending: {reportData.weekEnding.toLocaleDateString()}</li>
                    <li>• Report Type: {reportData.reportType.charAt(0).toUpperCase() + reportData.reportType.slice(1)}</li>
                    <li>• Include Maps: {reportData.includeMaps ? 'Yes' : 'No'}</li>
                    <li>• Include Historical Data: {reportData.includeHistorical ? 'Yes' : 'No'}</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={generateReport} 
                  disabled={loading || !reportData.countyCode}
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Preview Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>
                View previously generated surveillance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportHistory.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">
                      {reportHistory.length} reports
                    </Badge>
                    <Button variant="outline" size="sm" onClick={fetchReportHistory}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>

                  <div className="border rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">County</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Week Ending</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Report Type</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Generated</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Generated By</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {reportHistory.map((report, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm font-medium">{report.countyCode}</td>
                              <td className="px-4 py-2 text-sm">{new Date(report.weekEnding).toLocaleDateString()}</td>
                              <td className="px-4 py-2 text-sm">
                                <Badge variant="outline">{report.reportType}</Badge>
                              </td>
                              <td className="px-4 py-2 text-sm">{new Date(report.generatedAt).toLocaleDateString()}</td>
                              <td className="px-4 py-2 text-sm">{report.generatedBy}</td>
                              <td className="px-4 py-2 text-sm">
                                <div className="flex space-x-1">
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <FileText className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No reports generated yet</p>
                  <p className="text-sm text-gray-400">Generated reports will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Manage report templates and configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Template</CardTitle>
                    <CardDescription>Standard weekly surveillance report</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li>• Summary statistics</li>
                      <li>• Species breakdown</li>
                      <li>• Geographic distribution</li>
                      <li>• Trend analysis</li>
                    </ul>
                    <Button className="mt-4" size="sm">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Template</CardTitle>
                    <CardDescription>Comprehensive monthly analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li>• Extended statistics</li>
                      <li>• Historical comparison</li>
                      <li>• Risk assessment</li>
                      <li>• Recommendations</li>
                    </ul>
                    <Button className="mt-4" size="sm">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quarterly Template</CardTitle>
                    <CardDescription>Quarterly surveillance summary</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li>• Seasonal analysis</li>
                      <li>• Year-over-year comparison</li>
                      <li>• Predictive modeling</li>
                      <li>• Strategic recommendations</li>
                    </ul>
                    <Button className="mt-4" size="sm">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Custom Template</CardTitle>
                    <CardDescription>Create custom report template</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li>• Custom sections</li>
                      <li>• Flexible formatting</li>
                      <li>• Branded styling</li>
                      <li>• Save for reuse</li>
                    </ul>
                    <Button className="mt-4" size="sm">
                      Create Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
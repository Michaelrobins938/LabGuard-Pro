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
  Mail, 
  Download, 
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  RefreshCw,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CountyReport {
  id: string;
  countyCode: string;
  weekEnding: string;
  status: 'pending' | 'generated' | 'sent' | 'failed';
  recipients: string[];
  filePath?: string;
  summary?: {
    totalSamples: number;
    positiveSamples: number;
    speciesBreakdown: Record<string, number>;
    locations: string[];
  };
}

interface CountyConfiguration {
  countyCode: string;
  templateName: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  includeMaps: boolean;
  includeHistorical: boolean;
  customFields: Record<string, any>;
  isActive: boolean;
}

export default function SurveillanceReports() {
  const { toast } = useToast();
  const [reports, setReports] = useState<CountyReport[]>([]);
  const [configurations, setConfigurations] = useState<CountyConfiguration[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle');
  const [weekEnding, setWeekEnding] = useState('');

  useEffect(() => {
    fetchReports();
    fetchConfigurations();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/surveillance/reports/history?limit=20');
      const result = await response.json();
      setReports(result.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchConfigurations = async () => {
    try {
      const response = await fetch('/api/surveillance/reports/counties');
      const result = await response.json();
      setConfigurations(result.data?.countyConfigurations || []);
    } catch (error) {
      console.error('Error fetching configurations:', error);
    }
  };

  const generateAutomatedReports = async () => {
    if (!weekEnding) {
      toast({
        title: 'Week Ending Required',
        description: 'Please select a week ending date.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('generating');

    try {
      const response = await fetch('/api/surveillance/reports/automated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weekEnding
        })
      });

      const result = await response.json();

      if (result.success) {
        setGenerationStatus('completed');
        toast({
          title: 'Reports Generated',
          description: `Successfully generated ${result.data.reportsGenerated} reports and sent ${result.data.emailsSent} emails.`,
        });
        fetchReports(); // Refresh the reports list
      } else {
        setGenerationStatus('error');
        toast({
          title: 'Generation Failed',
          description: result.error || 'Failed to generate automated reports.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setGenerationStatus('error');
      toast({
        title: 'Generation Error',
        description: 'An error occurred while generating reports.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = async (reportId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/surveillance/reports/download/${reportId}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Report Downloaded',
        description: 'Report downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download report.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-green-500';
      case 'generated':
        return 'text-blue-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4" />;
      case 'generated':
        return <FileText className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Surveillance Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage automated county reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={generationStatus === 'completed' ? 'default' : 'secondary'}>
            <span className={`mr-1 ${getStatusColor(generationStatus)}`}>
              {getStatusIcon(generationStatus)}
            </span>
            {generationStatus}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
          <TabsTrigger value="configurations">County Configurations</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Report Generation
                </CardTitle>
                <CardDescription>
                  Generate automated county reports for the selected week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weekEnding">Week Ending</Label>
                  <Input
                    id="weekEnding"
                    type="date"
                    value={weekEnding}
                    onChange={(e) => setWeekEnding(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Active Counties</p>
                  <div className="text-sm text-muted-foreground">
                    {configurations.filter(c => c.isActive).length} counties configured
                  </div>
                </div>
                <Button 
                  onClick={generateAutomatedReports} 
                  disabled={isGenerating || !weekEnding}
                  className="flex items-center gap-2 w-full"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate Friday Reports'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Distribution Summary
                </CardTitle>
                <CardDescription>
                  Overview of report distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {configurations.filter(c => c.isActive).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Counties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {configurations.reduce((total, c) => total + c.recipients.length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Recipients</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">County Breakdown:</p>
                  <div className="space-y-1">
                    {configurations.filter(c => c.isActive).map((config) => (
                      <div key={config.countyCode} className="flex items-center justify-between text-sm">
                        <span>{config.countyCode}</span>
                        <span className="text-muted-foreground">
                          {config.recipients.length} recipients
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report History
              </CardTitle>
              <CardDescription>
                View generated reports and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          <div>
                            <p className="font-medium">{report.countyCode} County</p>
                            <p className="text-sm text-muted-foreground">
                              Week ending {new Date(report.weekEnding).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {report.summary && (
                          <div className="text-sm text-muted-foreground">
                            {report.summary.totalSamples} samples, {report.summary.positiveSamples} positive
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={report.status === 'sent' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                        {report.status === 'generated' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadReport(report.id, `${report.countyCode}_report.pdf`)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {report.recipients && report.recipients.length > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {report.recipients.length} recipients
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No reports generated yet. Generate reports to see them here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configurations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                County Configurations
              </CardTitle>
              <CardDescription>
                Manage county-specific report configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {configurations.length > 0 ? (
                <div className="space-y-4">
                  {configurations.map((config) => (
                    <div key={config.countyCode} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{config.countyCode} County</p>
                          <p className="text-sm text-muted-foreground">
                            Template: {config.templateName} • Format: {config.format.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {config.recipients.length} recipients
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={config.isActive ? 'default' : 'secondary'}>
                          {config.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No county configurations set up yet. Configure counties to enable automated reporting.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
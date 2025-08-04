'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, Mail, Clock, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CountyConfig {
  countyCode: string;
  countyName: string;
  recipients: string[];
  templateName: string;
  includeMaps: boolean;
  includeHistorical: boolean;
  customFields: Record<string, any>;
  isActive: boolean;
}

interface FridayReportResult {
  success: boolean;
  reportsGenerated: number;
  emailsSent: number;
  errors: string[];
  processingTime: number;
  reports: Array<{
    id: string;
    countyCode: string;
    weekEnding: Date;
    filePath: string;
    summary: {
      totalSamples: number;
      positiveSamples: number;
      speciesBreakdown: Record<string, number>;
      locations: string[];
      customMetrics: Record<string, any>;
    };
  }>;
}

export default function FridayAutomationPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<FridayReportResult | null>(null);
  const [countyConfigs, setCountyConfigs] = useState<CountyConfig[]>([]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [newCountyConfig, setNewCountyConfig] = useState<Partial<CountyConfig>>({
    countyCode: '',
    countyName: '',
    recipients: [],
    templateName: 'default',
    includeMaps: true,
    includeHistorical: true,
    customFields: {},
    isActive: true
  });

  useEffect(() => {
    loadCountyConfigurations();
  }, []);

  const loadCountyConfigurations = async () => {
    try {
      const response = await fetch('/api/surveillance/reports/counties');
      const data = await response.json();
      if (data.success) {
        setCountyConfigs(data.data.countyConfigurations || []);
      }
    } catch (error) {
      console.error('Error loading county configurations:', error);
    }
  };

  const generateFridayReports = async () => {
    setIsGenerating(true);
    setProgress(0);
    setResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/surveillance/reports/friday', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weekEnding: selectedDate.toISOString()
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        throw new Error(data.error || 'Failed to generate reports');
      }
    } catch (error) {
      console.error('Error generating Friday reports:', error);
      setResult({
        success: false,
        reportsGenerated: 0,
        emailsSent: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        processingTime: 0,
        reports: []
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveCountyConfiguration = async () => {
    if (!newCountyConfig.countyCode || !newCountyConfig.countyName) {
      return;
    }

    setIsConfiguring(true);
    try {
      const updatedConfigs = [...countyConfigs, newCountyConfig as CountyConfig];
      
      const response = await fetch('/api/surveillance/reports/counties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          countyConfigurations: updatedConfigs
        }),
      });

      if (response.ok) {
        setCountyConfigs(updatedConfigs);
        setNewCountyConfig({
          countyCode: '',
          countyName: '',
          recipients: [],
          templateName: 'default',
          includeMaps: true,
          includeHistorical: true,
          customFields: {},
          isActive: true
        });
      }
    } catch (error) {
      console.error('Error saving county configuration:', error);
    } finally {
      setIsConfiguring(false);
    }
  };

  const addRecipient = () => {
    const email = prompt('Enter recipient email:');
    if (email) {
      setNewCountyConfig(prev => ({
        ...prev,
        recipients: [...(prev.recipients || []), email]
      }));
    }
  };

  const removeRecipient = (index: number) => {
    setNewCountyConfig(prev => ({
      ...prev,
      recipients: prev.recipients?.filter((_, i) => i !== index) || []
    }));
  };

  const timeSaved = result ? (4.5 - (result.processingTime / 1000 / 60)).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Friday Report Automation</h1>
          <p className="text-muted-foreground">
            Automate your weekly county reports and save 4-5 hours every Friday
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Clock className="w-4 h-4 mr-2" />
          Time Saved: {timeSaved} hours
        </Badge>
      </div>

      {/* County Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>County Report Configurations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="countyCode">County Code</Label>
              <Input
                id="countyCode"
                value={newCountyConfig.countyCode}
                onChange={(e) => setNewCountyConfig(prev => ({ ...prev, countyCode: e.target.value }))}
                placeholder="e.g., DALLAS"
              />
            </div>
            <div>
              <Label htmlFor="countyName">County Name</Label>
              <Input
                id="countyName"
                value={newCountyConfig.countyName}
                onChange={(e) => setNewCountyConfig(prev => ({ ...prev, countyName: e.target.value }))}
                placeholder="e.g., Dallas County"
              />
            </div>
          </div>

          <div>
            <Label>Recipients</Label>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={addRecipient}>
                Add Recipient
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {newCountyConfig.recipients?.map((email, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeRecipient(index)}>
                  {email} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="templateName">Template</Label>
              <Input
                id="templateName"
                value={newCountyConfig.templateName}
                onChange={(e) => setNewCountyConfig(prev => ({ ...prev, templateName: e.target.value }))}
                placeholder="default"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeMaps"
                checked={newCountyConfig.includeMaps}
                onChange={(e) => setNewCountyConfig(prev => ({ ...prev, includeMaps: e.target.checked }))}
              />
              <Label htmlFor="includeMaps">Include Maps</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeHistorical"
                checked={newCountyConfig.includeHistorical}
                onChange={(e) => setNewCountyConfig(prev => ({ ...prev, includeHistorical: e.target.checked }))}
              />
              <Label htmlFor="includeHistorical">Include Historical Data</Label>
            </div>
          </div>

          <Button onClick={saveCountyConfiguration} disabled={isConfiguring}>
            {isConfiguring ? 'Saving...' : 'Add County Configuration'}
          </Button>
        </CardContent>
      </Card>

      {/* Current Configurations */}
      <Card>
        <CardHeader>
          <CardTitle>Current County Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {countyConfigs.map((config, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{config.countyName}</h3>
                    <p className="text-sm text-muted-foreground">Code: {config.countyCode}</p>
                  </div>
                  <Badge variant={config.isActive ? "default" : "secondary"}>
                    {config.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="mt-2">
                  <p className="text-sm">
                    <strong>Recipients:</strong> {config.recipients.join(', ')}
                  </p>
                  <p className="text-sm">
                    <strong>Template:</strong> {config.templateName}
                  </p>
                </div>
              </div>
            ))}
            {countyConfigs.length === 0 && (
              <p className="text-muted-foreground">No county configurations found. Add one above to get started.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Friday Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Week Ending Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            onClick={generateFridayReports} 
            disabled={isGenerating || countyConfigs.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Play className="w-4 h-4 mr-2 animate-spin" />
                Generating Reports...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Generate Friday Reports
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Processing {countyConfigs.length} county reports...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {result.success ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Reports Generated Successfully
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  Report Generation Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{result.reportsGenerated}</div>
                <div className="text-sm text-muted-foreground">Reports Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{result.emailsSent}</div>
                <div className="text-sm text-muted-foreground">Emails Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {(result.processingTime / 1000 / 60).toFixed(1)}m
                </div>
                <div className="text-sm text-muted-foreground">Processing Time</div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Errors encountered:</strong>
                  <ul className="mt-2 list-disc list-inside">
                    {result.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {result.reports.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Generated Reports:</h4>
                <div className="space-y-2">
                  {result.reports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{report.countyCode} County</h5>
                          <p className="text-sm text-muted-foreground">
                            Week ending: {format(new Date(report.weekEnding), "PPP")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Samples: </span>
                        <span className="font-medium">{report.summary.totalSamples}</span>
                        <span className="text-muted-foreground ml-4">Positive: </span>
                        <span className="font-medium text-red-600">{report.summary.positiveSamples}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Time Savings Summary */}
      {result && result.success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Time Saved:</strong> You saved approximately {timeSaved} hours compared to manual report generation!
            This automation will save you {(parseFloat(timeSaved as string) * 52).toFixed(1)} hours annually.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 
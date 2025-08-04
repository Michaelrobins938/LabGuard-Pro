"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileText, 
  Download, 
  Send, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  Settings,
  Play,
  Eye,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface CountyConfig {
  id: string;
  countyName: string;
  countyCode: string;
  contactEmails: string[];
  reportTemplate: string;
  specificRequirements: any;
  lastReportSent?: string;
  active: boolean;
}

interface AutomatedReport {
  id: string;
  reportType: string;
  countyName: string;
  generatedAt: string;
  dataStart: string;
  dataEnd: string;
  status: 'pending' | 'generated' | 'sent' | 'failed';
  fileUrl?: string;
  recipients: string[];
  errorMessage?: string;
  reportContent: {
    metrics: any;
    charts?: string[];
  };
}

const REPORT_TEMPLATES = {
  dallas: {
    name: 'Dallas County Format',
    description: 'Includes species breakdown, trap efficiency calculations, and detailed geographic analysis',
    features: ['Species breakdown', 'Trap efficiency', 'Geographic clustering', 'Weekly trends']
  },
  tarrant: {
    name: 'Tarrant County Format', 
    description: 'Weather correlation analysis with temperature and rainfall data',
    features: ['Weather correlations', 'Environmental factors', 'Seasonal patterns', 'Risk assessment']
  },
  denton: {
    name: 'Denton County Format',
    description: 'Historical comparisons with 5-year trend analysis',
    features: ['5-year comparisons', 'Historical trends', 'Seasonal analysis', 'Long-term patterns']
  },
  collin: {
    name: 'Collin County Format',
    description: 'Standard surveillance summary with essential metrics',
    features: ['Basic metrics', 'Weekly summary', 'Geographic distribution', 'Alert status']
  },
  standard: {
    name: 'Standard Public Health Format',
    description: 'Generic format suitable for most public health departments',
    features: ['Weekly summary', 'Geographic map', 'Trend analysis', 'Compliance metrics']
  }
};

export default function AutomatedReportsTab() {
  const [counties, setCounties] = useState<CountyConfig[]>([]);
  const [reports, setReports] = useState<AutomatedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingCounty, setEditingCounty] = useState<CountyConfig | null>(null);
  const [showAddCounty, setShowAddCounty] = useState(false);
  const [newCountyData, setNewCountyData] = useState<Partial<CountyConfig>>({});

  useEffect(() => {
    fetchCountyConfigs();
    fetchRecentReports();
  }, []);

  const fetchCountyConfigs = async () => {
    try {
      const response = await fetch('/api/public-health/counties');
      if (!response.ok) throw new Error('Failed to fetch counties');
      
      const data = await response.json();
      setCounties(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load county configurations.",
        variant: "destructive"
      });
    }
  };

  const fetchRecentReports = async () => {
    try {
      const response = await fetch('/api/public-health/reports?limit=50');
      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const data = await response.json();
      setReports(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load report history.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyReports = async () => {
    setGenerating(true);
    try {
      const activeCounties = counties.filter(c => c.active);
      
      const response = await fetch('/api/public-health/reports/generate-weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportDate: selectedDate.toISOString(),
          counties: activeCounties.map(c => c.id)
        })
      });

      if (!response.ok) throw new Error('Report generation failed');

      const result = await response.json();
      
      toast({
        title: "Reports Generated Successfully",
        description: `Generated and distributed ${result.reportsGenerated} reports. ${result.distributionResults.successful} sent successfully.`
      });

      fetchRecentReports();
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

  const generateSingleReport = async (countyId: string) => {
    try {
      const response = await fetch(`/api/public-health/reports/generate-single/${countyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportDate: selectedDate.toISOString()
        })
      });

      if (!response.ok) throw new Error('Report generation failed');

      const result = await response.json();
      
      toast({
        title: "Report Generated",
        description: `Report for ${result.countyName} has been generated and sent.`
      });

      fetchRecentReports();
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report.",
        variant: "destructive"
      });
    }
  };

  const resendReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/public-health/reports/${reportId}/resend`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Resend failed');

      toast({
        title: "Report Resent",
        description: "Report has been resent successfully."
      });

      fetchRecentReports();
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: "Failed to resend report.",
        variant: "destructive"
      });
    }
  };

  const saveCountyConfig = async () => {
    try {
      const url = editingCounty 
        ? `/api/public-health/counties/${editingCounty.id}`
        : '/api/public-health/counties';
      
      const method = editingCounty ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCounty || newCountyData)
      });

      if (!response.ok) throw new Error('Failed to save county configuration');

      toast({
        title: "County Configuration Saved",
        description: `Configuration for ${(editingCounty || newCountyData).countyName} has been saved.`
      });

      setEditingCounty(null);
      setShowAddCounty(false);
      setNewCountyData({});
      fetchCountyConfigs();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save county configuration.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'outline',
      'generated': 'default',
      'sent': 'secondary',
      'failed': 'destructive'
    } as const;

    const icons = {
      'pending': Clock,
      'generated': FileText,
      'sent': CheckCircle,
      'failed': XCircle
    };

    const IconComponent = icons[status as keyof typeof icons];
    
    return (
      <Badge variant={variants[status as keyof typeof variants]} className="flex items-center space-x-1">
        <IconComponent className="h-3 w-3" />
        <span>{status}</span>
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading automated reports...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Generation Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Weekly Report Generation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <Label>Report Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      required
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>Active Counties</Label>
                <p className="text-sm text-gray-600">
                  {counties.filter(c => c.active).length} of {counties.length} counties configured
                </p>
              </div>
            </div>

            <Button 
              onClick={generateWeeklyReports}
              disabled={generating}
              className="flex items-center space-x-2"
            >
              {generating ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Generate All Reports</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* County Configurations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>County Configurations</span>
            </CardTitle>
            <Dialog open={showAddCounty} onOpenChange={setShowAddCounty}>
              <DialogTrigger asChild>
                <Button>Add County</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New County Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>County Name</Label>
                    <Input
                      value={newCountyData.countyName || ''}
                      onChange={(e) => setNewCountyData({...newCountyData, countyName: e.target.value})}
                      placeholder="Tarrant County"
                    />
                  </div>
                  
                  <div>
                    <Label>County Code</Label>
                    <Input
                      value={newCountyData.countyCode || ''}
                      onChange={(e) => setNewCountyData({...newCountyData, countyCode: e.target.value.toUpperCase()})}
                      placeholder="TARR"
                    />
                  </div>

                  <div>
                    <Label>Report Template</Label>
                    <Select
                      value={newCountyData.reportTemplate}
                      onValueChange={(value) => setNewCountyData({...newCountyData, reportTemplate: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(REPORT_TEMPLATES).map(([key, template]) => (
                          <SelectItem key={key} value={key}>{template.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Contact Emails (one per line)</Label>
                    <Textarea
                      value={newCountyData.contactEmails?.join('\n') || ''}
                      onChange={(e) => setNewCountyData({
                        ...newCountyData, 
                        contactEmails: e.target.value.split('\n').filter(email => email.trim())
                      })}
                      placeholder="surveillance@county.gov&#10;lab@county.gov"
                    />
                  </div>

                  <Button onClick={saveCountyConfig} className="w-full">
                    Add County
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {counties.map((county) => (
              <div key={county.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">{county.countyName}</h3>
                      <Badge variant={county.active ? 'default' : 'secondary'}>
                        {county.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{county.countyCode}</Badge>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Template: {REPORT_TEMPLATES[county.reportTemplate as keyof typeof REPORT_TEMPLATES]?.name || county.reportTemplate}</p>
                      <p>Recipients: {county.contactEmails.length} contacts</p>
                      {county.lastReportSent && (
                        <p>Last report: {format(new Date(county.lastReportSent), 'PPP')}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateSingleReport(county.id)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCounty(county)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>County</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.slice(0, 20).map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.countyName}</TableCell>
                    <TableCell>{format(new Date(report.generatedAt), 'MMM dd, HH:mm')}</TableCell>
                    <TableCell>
                      {format(new Date(report.dataStart), 'MMM dd')} - {format(new Date(report.dataEnd), 'MMM dd')}
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{report.recipients.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {report.fileUrl && (
                          <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        
                        {(report.status === 'failed' || report.status === 'generated') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => resendReport(report.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {reports.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No reports generated yet. Click "Generate All Reports" to create your first batch.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit County Dialog */}
      <Dialog open={!!editingCounty} onOpenChange={(open) => !open && setEditingCounty(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit County Configuration - {editingCounty?.countyName}</DialogTitle>
          </DialogHeader>
          {editingCounty && (
            <div className="space-y-4">
              <div>
                <Label>County Name</Label>
                <Input
                  value={editingCounty.countyName}
                  onChange={(e) => setEditingCounty({...editingCounty, countyName: e.target.value})}
                />
              </div>
              
              <div>
                <Label>County Code</Label>
                <Input
                  value={editingCounty.countyCode}
                  onChange={(e) => setEditingCounty({...editingCounty, countyCode: e.target.value.toUpperCase()})}
                />
              </div>

              <div>
                <Label>Report Template</Label>
                <Select
                  value={editingCounty.reportTemplate}
                  onValueChange={(value) => setEditingCounty({...editingCounty, reportTemplate: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(REPORT_TEMPLATES).map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-500">{template.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {editingCounty.reportTemplate && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Features: {REPORT_TEMPLATES[editingCounty.reportTemplate as keyof typeof REPORT_TEMPLATES]?.features.join(', ')}</p>
                  </div>
                )}
              </div>

              <div>
                <Label>Contact Emails (one per line)</Label>
                <Textarea
                  value={editingCounty.contactEmails.join('\n')}
                  onChange={(e) => setEditingCounty({
                    ...editingCounty, 
                    contactEmails: e.target.value.split('\n').filter(email => email.trim())
                  })}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={editingCounty.active}
                  onChange={(e) => setEditingCounty({...editingCounty, active: e.target.checked})}
                />
                <Label htmlFor="active">Active (include in weekly report generation)</Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={saveCountyConfig} className="flex-1">
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditingCounty(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 
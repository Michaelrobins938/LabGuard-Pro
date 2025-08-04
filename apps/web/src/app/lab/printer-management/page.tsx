'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Printer, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Activity, 
  Clock, 
  FileText,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface PrinterStatus {
  id: string;
  name: string;
  type: string;
  connection: string;
  isOnline: boolean;
  hasError: boolean;
  errorMessage?: string;
  paperLevel?: number;
  lastPrintJob?: Date;
  totalJobs?: number;
}

interface PrintJob {
  id: string;
  qrCodes: any[];
  format: string;
  status: 'PENDING' | 'PRINTING' | 'READY' | 'COMPLETED' | 'FAILED';
  printMethod: string;
  createdAt: Date;
  completedAt?: Date;
  errorMessage?: string;
}

interface PrinterStats {
  totalJobs: number;
  successRate: number;
  averageJobTime: number;
  labelsPerDay: number;
  paperUsage: number;
}

export default function PrinterManagement() {
  const [printers, setPrinters] = useState<PrinterStatus[]>([]);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
  const [printerStats, setPrinterStats] = useState<PrinterStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrinters();
    loadPrintJobs();
  }, []);

  useEffect(() => {
    if (selectedPrinter) {
      loadPrinterStats(selectedPrinter);
    }
  }, [selectedPrinter]);

  const loadPrinters = async () => {
    try {
      const response = await fetch('/api/mobile-print/printers');
      if (response.ok) {
        const data = await response.json();
        setPrinters(data.data);
        if (data.data.length > 0 && !selectedPrinter) {
          setSelectedPrinter(data.data[0].id);
        }
      } else {
        // Fallback demo data for mobile/office printers
        const demoData = [
          {
            id: 'mobile-browser',
            name: 'Mobile Browser Print',
            type: 'MOBILE_BROWSER',
            connection: 'BROWSER',
            isOnline: true,
            hasError: false,
            mobileCompatible: true,
            totalJobs: 67
          },
          {
            id: 'office-hp-001',
            name: 'HP LaserJet Pro 400 - Office',
            type: 'OFFICE_PRINTER',
            connection: 'WIFI',
            isOnline: true,
            hasError: false,
            paperLevel: 75,
            mobileCompatible: true,
            lastPrintJob: new Date(Date.now() - 1000 * 60 * 30),
            totalJobs: 142
          },
          {
            id: 'office-canon-001',
            name: 'Canon PIXMA - Lab Station',
            type: 'OFFICE_PRINTER',
            connection: 'WIFI',
            isOnline: true,
            hasError: false,
            paperLevel: 60,
            mobileCompatible: true,
            lastPrintJob: new Date(Date.now() - 1000 * 60 * 60 * 2),
            totalJobs: 89
          },
          {
            id: 'email-print-001',
            name: 'Email to Printer Service',
            type: 'EMAIL_TO_PRINT',
            connection: 'EMAIL',
            isOnline: true,
            hasError: false,
            mobileCompatible: true,
            emailAddress: 'printer@lab.example.com',
            totalJobs: 34
          }
        ];
        setPrinters(demoData);
        setSelectedPrinter(demoData[0].id);
      }
    } catch (error) {
      console.error('Failed to load printers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrintJobs = async () => {
    try {
      const response = await fetch('/api/mobile-print/jobs');
      if (response.ok) {
        const data = await response.json();
        setPrintJobs(data.data);
      } else {
        // Demo data for mobile print jobs
        setPrintJobs([
          {
            id: 'MPJ_1234567890_abc123',
            qrCodes: Array(5).fill(null).map((_, i) => ({ poolId: `POOL-${String(i + 1).padStart(3, '0')}` })),
            format: 'SHEET_LAYOUT',
            status: 'COMPLETED',
            printMethod: 'MOBILE_BROWSER',
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
            completedAt: new Date(Date.now() - 1000 * 60 * 28)
          },
          {
            id: 'MPJ_1234567891_def456',
            qrCodes: Array(12).fill(null).map((_, i) => ({ poolId: `POOL-${String(i + 6).padStart(3, '0')}` })),
            format: 'ADHESIVE_LABELS',
            status: 'READY',
            printMethod: 'PDF_DOWNLOAD',
            createdAt: new Date(Date.now() - 1000 * 60 * 5)
          },
          {
            id: 'MPJ_1234567892_ghi789',
            qrCodes: Array(3).fill(null).map((_, i) => ({ poolId: `POOL-${String(i + 16).padStart(3, '0')}` })),
            format: 'INDIVIDUAL_LABELS',
            status: 'FAILED',
            printMethod: 'EMAIL_TO_PRINTER',
            createdAt: new Date(Date.now() - 1000 * 60 * 10),
            errorMessage: 'Email delivery failed'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load mobile print jobs:', error);
    }
  };

  const loadPrinterStats = async (printerId: string) => {
    try {
      const response = await fetch(`/api/printers/${printerId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setPrinterStats(data.data);
      } else {
        // Demo stats
        setPrinterStats({
          totalJobs: 247,
          successRate: 0.967,
          averageJobTime: 23.4,
          labelsPerDay: 47,
          paperUsage: 568
        });
      }
    } catch (error) {
      console.error('Failed to load printer stats:', error);
    }
  };

  const testPrinter = async (printerId: string) => {
    try {
      const response = await fetch(`/api/mobile-print/test-printer/${printerId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data.success) {
          alert(`Mobile printer test successful! ${data.data.message}`);
        } else {
          alert(`Mobile printer test failed: ${data.data.message}`);
        }
      }
    } catch (error) {
      console.error('Mobile printer test failed:', error);
      alert('Failed to test mobile printer');
    }
  };

  const createTestPrintJob = async () => {
    if (!selectedPrinter) return;

    try {
      // Create test mobile print job
      const printResponse = await fetch('/api/mobile-print/create-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCodes: [
            {
              poolId: 'TEST-001',
              trapId: 'TEST-TRAP',
              collectionDate: new Date().toISOString().split('T')[0],
              species: 'CULEX_QUINQUEFASCIATUS',
              collectedBy: 'Test User',
              latitude: 32.7555,
              longitude: -97.3308,
              laboratoryId: 'test-lab'
            }
          ],
          printFormat: 'INDIVIDUAL_LABELS',
          labelSize: 'MEDIUM_25MM',
          copies: 1,
          options: {
            includeBorder: true,
            includeText: true,
            includeLogo: false
          },
          printMethod: selectedPrinter === 'mobile-browser' ? 'MOBILE_BROWSER' : 'PDF_DOWNLOAD'
        })
      });

      if (printResponse.ok) {
        const result = await printResponse.json();
        alert(`Test mobile print job created! Job ID: ${result.data.printJob.id}`);
        loadPrintJobs();
      } else {
        const error = await printResponse.json();
        alert(`Failed to create test print job: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to create test mobile print job:', error);
      alert('Failed to create test mobile print job');
    }
  };

  const getPrinterStatusIcon = (printer: PrinterStatus) => {
    if (!printer.isOnline) return <XCircle className="w-5 h-5 text-red-500" />;
    if (printer.hasError) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PRINTING': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const selectedPrinterData = printers.find(p => p.id === selectedPrinter);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Printer Management</h1>
          <p className="text-gray-600 mt-1">Laboratory Label Printing System</p>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={createTestPrintJob} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Test Print Job
          </Button>
          <Button onClick={loadPrinters} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Printer List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Printer className="w-5 h-5 mr-2" />
              Available Printers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {printers.map((printer) => (
              <div
                key={printer.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedPrinter === printer.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPrinter(printer.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getPrinterStatusIcon(printer)}
                      <span className="font-medium text-sm">{printer.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">{printer.type} • {printer.connection}</p>
                    {printer.hasError && (
                      <p className="text-xs text-red-600 mt-1">{printer.errorMessage}</p>
                    )}
                  </div>
                </div>
                
                {printer.paperLevel !== undefined && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Paper Level</span>
                      <span>{printer.paperLevel}%</span>
                    </div>
                    <Progress value={printer.paperLevel} className="h-1" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Printer Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                {selectedPrinterData?.name || 'Printer Details'}
              </span>
              {selectedPrinterData && (
                <Button 
                  onClick={() => testPrinter(selectedPrinterData.id)}
                  variant="outline" 
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Test Printer
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPrinterData ? (
              <Tabs defaultValue="status" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="status">Status</TabsTrigger>
                  <TabsTrigger value="statistics">Statistics</TabsTrigger>
                  <TabsTrigger value="configuration">Configuration</TabsTrigger>
                </TabsList>

                <TabsContent value="status" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <div className="flex items-center space-x-2">
                          {getPrinterStatusIcon(selectedPrinterData)}
                          <span className="text-sm font-medium">
                            {selectedPrinterData.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Connection:</span>
                        <span className="text-sm font-medium">{selectedPrinterData.connection}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Jobs:</span>
                        <span className="text-sm font-medium">{selectedPrinterData.totalJobs}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedPrinterData.paperLevel !== undefined && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Paper Level:</span>
                            <span className="font-medium">{selectedPrinterData.paperLevel}%</span>
                          </div>
                          <Progress value={selectedPrinterData.paperLevel} />
                        </div>
                      )}
                      
                      {selectedPrinterData.lastPrintJob && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Job:</span>
                          <span className="text-sm font-medium">
                            {selectedPrinterData.lastPrintJob.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedPrinterData.hasError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-red-800">Error</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">{selectedPrinterData.errorMessage}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="statistics" className="space-y-4">
                  {printerStats ? (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{printerStats.totalJobs}</div>
                          <div className="text-sm text-gray-600">Total Jobs</div>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {(printerStats.successRate * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">Success Rate</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {printerStats.averageJobTime.toFixed(1)}s
                          </div>
                          <div className="text-sm text-gray-600">Avg Job Time</div>
                        </div>
                        
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{printerStats.labelsPerDay}</div>
                          <div className="text-sm text-gray-600">Labels/Day</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Loading statistics...</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="configuration" className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Printer Settings</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Print Speed</label>
                        <select className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                          <option>Fast (6 ips)</option>
                          <option>Medium (4 ips)</option>
                          <option>Slow (2 ips)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-600">Print Darkness</label>
                        <select className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                          <option>15 (Default)</option>
                          <option>10 (Light)</option>
                          <option>20 (Dark)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Label Size</label>
                      <select className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                        <option>25mm x 15mm (Standard)</option>
                        <option>30mm x 20mm (Large)</option>
                        <option>20mm x 10mm (Small)</option>
                      </select>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button variant="outline">
                        Reset to Defaults
                      </Button>
                      <Button>
                        Save Configuration
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Printer className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a printer to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Print Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Print Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {printJobs.length > 0 ? (
              printJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge className={getJobStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    <div>
                      <p className="font-medium">{job.qrCodes.length} labels</p>
                      <p className="text-sm text-gray-600">
                        {job.printMethod} • {job.createdAt.toLocaleString()}
                      </p>
                      {job.errorMessage && (
                        <p className="text-xs text-red-600">{job.errorMessage}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {job.status === 'COMPLETED' && job.completedAt && (
                      <span className="text-xs text-gray-500">
                        Completed {job.completedAt.toLocaleString()}
                      </span>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent print jobs</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
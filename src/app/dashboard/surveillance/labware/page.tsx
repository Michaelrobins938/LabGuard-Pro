'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Download, 
  Upload, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  FileText,
  Calendar
} from 'lucide-react';
import { LabWareConnection, LabWareSample } from '@/types/surveillance';

export default function LabWareIntegration() {
  const [connection, setConnection] = useState<LabWareConnection>({
    server: '',
    database: '',
    username: '',
    password: '',
    port: 1433
  });

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');
  const [samples, setSamples] = useState<LabWareSample[]>([]);
  const [loading, setLoading] = useState(false);
  const [extractionParams, setExtractionParams] = useState({
    startDate: '',
    endDate: '',
    sampleType: ''
  });

  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus('testing');

    try {
      const response = await fetch('/api/surveillance/labware/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connection),
      });

      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  const extractSamples = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        startDate: extractionParams.startDate,
        endDate: extractionParams.endDate,
        sampleType: extractionParams.sampleType
      });

      const response = await fetch(`/api/surveillance/labware/samples?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setSamples(data.data || []);
      }
    } catch (error) {
      console.error('Sample extraction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'testing':
        return <RefreshCw className="w-4 h-4 animate-spin text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">LabWare Integration</h1>
          <p className="text-gray-600 mt-1">Connect to LabWare LIMS and extract surveillance data</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {getStatusIcon(connectionStatus)}
            <span className="ml-1 capitalize">{connectionStatus}</span>
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="connection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="extraction">Data Extraction</TabsTrigger>
          <TabsTrigger value="samples">Sample Data</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>LabWare Connection Configuration</CardTitle>
              <CardDescription>
                Configure connection to LabWare LIMS system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="server">Server</Label>
                  <Input
                    id="server"
                    value={connection.server}
                    onChange={(e) => setConnection({ ...connection, server: e.target.value })}
                    placeholder="labware-server.example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="database">Database</Label>
                  <Input
                    id="database"
                    value={connection.database}
                    onChange={(e) => setConnection({ ...connection, database: e.target.value })}
                    placeholder="LabWareDB"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={connection.username}
                    onChange={(e) => setConnection({ ...connection, username: e.target.value })}
                    placeholder="labware_user"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={connection.password}
                    onChange={(e) => setConnection({ ...connection, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={connection.port}
                    onChange={(e) => setConnection({ ...connection, port: parseInt(e.target.value) || 1433 })}
                    placeholder="1433"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={testConnection} disabled={loading}>
                  <Database className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button variant="outline" onClick={() => setConnectionStatus('disconnected')}>
                  Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extraction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Extraction Parameters</CardTitle>
              <CardDescription>
                Configure parameters for extracting surveillance data from LabWare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={extractionParams.startDate}
                    onChange={(e) => setExtractionParams({ ...extractionParams, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={extractionParams.endDate}
                    onChange={(e) => setExtractionParams({ ...extractionParams, endDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sampleType">Sample Type</Label>
                  <Input
                    id="sampleType"
                    value={extractionParams.sampleType}
                    onChange={(e) => setExtractionParams({ ...extractionParams, sampleType: e.target.value })}
                    placeholder="Mosquito, Human, etc."
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={extractSamples} disabled={loading || connectionStatus !== 'connected'}>
                  <Download className="w-4 h-4 mr-2" />
                  Extract Samples
                </Button>
                <Button variant="outline" onClick={() => setSamples([])}>
                  Clear Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="samples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Sample Data</CardTitle>
              <CardDescription>
                {samples.length} samples extracted from LabWare
              </CardDescription>
            </CardHeader>
            <CardContent>
              {samples.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">
                      {samples.length} samples
                    </Badge>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>

                  <div className="border rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Sample ID</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Patient ID</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Test Type</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Result</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Collection Date</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Location</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {samples.slice(0, 10).map((sample, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm">{sample.sampleId}</td>
                              <td className="px-4 py-2 text-sm">{sample.patientId}</td>
                              <td className="px-4 py-2 text-sm">{sample.testType}</td>
                              <td className="px-4 py-2 text-sm">
                                <Badge variant={sample.result === 'Positive' ? 'destructive' : 'secondary'}>
                                  {sample.result}
                                </Badge>
                              </td>
                              <td className="px-4 py-2 text-sm">{sample.collectionDate}</td>
                              <td className="px-4 py-2 text-sm">{sample.location}</td>
                              <td className="px-4 py-2 text-sm">
                                <Badge variant="outline">{sample.status}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {samples.length > 10 && (
                    <p className="text-sm text-gray-500 text-center">
                      Showing first 10 samples. Total: {samples.length}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No samples extracted yet</p>
                  <p className="text-sm text-gray-400">Use the Data Extraction tab to extract samples from LabWare</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>LabWare Integration Settings</CardTitle>
              <CardDescription>
                Configure advanced settings for LabWare integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Auto-sync Frequency</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="manual">Manual Only</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Data Retention</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                    <option value="forever">Forever</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Error Notifications</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="emailNotifications" className="rounded" />
                    <Label htmlFor="emailNotifications">Email notifications for connection errors</Label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button>
                    <Settings className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                  <Button variant="outline">
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  TestTube, 
  Download, 
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LabWareConnection {
  server: string;
  database: string;
  username: string;
  password: string;
  port: number;
}

interface LabWareSample {
  sampleId: string;
  patientId: string;
  testType: string;
  result: string;
  collectionDate: string;
  location: string;
  species?: string;
  poolId?: string;
}

export default function LabWareIntegration() {
  const { toast } = useToast();
  const [connection, setConnection] = useState<LabWareConnection>({
    server: '',
    database: '',
    username: '',
    password: '',
    port: 1433
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [samples, setSamples] = useState<LabWareSample[]>([]);
  const [extractionParams, setExtractionParams] = useState({
    startDate: '',
    endDate: '',
    sampleType: ''
  });

  const testConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');

    try {
      const response = await fetch('/api/surveillance/labware/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connection)
      });

      const result = await response.json();

      if (result.success) {
        setConnectionStatus('connected');
        toast({
          title: 'Connection Successful',
          description: 'LabWare LIMS connection established successfully.',
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: 'Connection Failed',
          description: result.message || 'Failed to connect to LabWare LIMS.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: 'Connection Error',
        description: 'An error occurred while testing the connection.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const extractSamples = async () => {
    setIsExtracting(true);

    try {
      const params = new URLSearchParams();
      if (extractionParams.startDate) params.append('startDate', extractionParams.startDate);
      if (extractionParams.endDate) params.append('endDate', extractionParams.endDate);
      if (extractionParams.sampleType) params.append('sampleType', extractionParams.sampleType);

      const response = await fetch(`/api/surveillance/labware/samples?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setSamples(result.data || []);
        toast({
          title: 'Samples Extracted',
          description: `Successfully extracted ${result.count} samples from LabWare.`,
        });
      } else {
        toast({
          title: 'Extraction Failed',
          description: 'Failed to extract samples from LabWare.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Extraction Error',
        description: 'An error occurred while extracting samples.',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const saveConnection = async () => {
    try {
      // Save connection settings to laboratory settings
      const response = await fetch('/api/surveillance/labware/save-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connection)
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Settings Saved',
          description: 'LabWare connection settings saved successfully.',
        });
      } else {
        toast({
          title: 'Save Failed',
          description: 'Failed to save connection settings.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Save Error',
        description: 'An error occurred while saving settings.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4" />;
      case 'connecting':
        return <Clock className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LabWare Integration</h1>
          <p className="text-muted-foreground">
            Connect to LabWare LIMS and extract sample data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
            <span className={`mr-1 ${getStatusColor(connectionStatus)}`}>
              {getStatusIcon(connectionStatus)}
            </span>
            {connectionStatus}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="connection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="extraction">Data Extraction</TabsTrigger>
          <TabsTrigger value="samples">Sample Data</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                LabWare Connection Settings
              </CardTitle>
              <CardDescription>
                Configure connection to LabWare LIMS 7.2
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    onChange={(e) => setConnection({ ...connection, port: parseInt(e.target.value) })}
                    placeholder="1433"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={testConnection} 
                  disabled={isConnecting}
                  className="flex items-center gap-2"
                >
                  {isConnecting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4" />
                  )}
                  {isConnecting ? 'Testing...' : 'Test Connection'}
                </Button>
                <Button 
                  onClick={saveConnection} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extraction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Sample Data Extraction
              </CardTitle>
              <CardDescription>
                Extract sample data from LabWare LIMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
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
                    placeholder="Mosquito Pool"
                  />
                </div>
              </div>

              <Button 
                onClick={extractSamples} 
                disabled={isExtracting || connectionStatus !== 'connected'}
                className="flex items-center gap-2"
              >
                {isExtracting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isExtracting ? 'Extracting...' : 'Extract Samples'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="samples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Extracted Samples
              </CardTitle>
              <CardDescription>
                Sample data extracted from LabWare LIMS
              </CardDescription>
            </CardHeader>
            <CardContent>
              {samples.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {samples.length} samples extracted
                    </span>
                    <Button variant="outline" size="sm">
                      Export CSV
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="p-2 text-left">Sample ID</th>
                            <th className="p-2 text-left">Patient ID</th>
                            <th className="p-2 text-left">Test Type</th>
                            <th className="p-2 text-left">Result</th>
                            <th className="p-2 text-left">Collection Date</th>
                            <th className="p-2 text-left">Location</th>
                            <th className="p-2 text-left">Species</th>
                          </tr>
                        </thead>
                        <tbody>
                          {samples.slice(0, 10).map((sample, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-2 font-mono text-xs">{sample.sampleId}</td>
                              <td className="p-2 font-mono text-xs">{sample.patientId}</td>
                              <td className="p-2">{sample.testType}</td>
                              <td className="p-2">
                                <Badge variant={sample.result === 'Positive' ? 'destructive' : 'secondary'}>
                                  {sample.result}
                                </Badge>
                              </td>
                              <td className="p-2 text-xs">
                                {new Date(sample.collectionDate).toLocaleDateString()}
                              </td>
                              <td className="p-2">{sample.location}</td>
                              <td className="p-2">{sample.species || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {samples.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Showing first 10 samples of {samples.length} total
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No samples extracted yet. Use the extraction tab to pull data from LabWare.
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
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Upload, 
  Play, 
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  RefreshCw,
  FileText,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NEDSSCase {
  patientId: string;
  sampleId: string;
  testType: string;
  result: string;
  collectionDate: string;
  location: string;
}

interface NEDSSAutomation {
  countyCode: string;
  startDate: string;
  endDate: string;
  caseData: NEDSSCase[];
}

export default function NEDSSAutomation() {
  const { toast } = useToast();
  const [automation, setAutomation] = useState<NEDSSAutomation>({
    countyCode: '',
    startDate: '',
    endDate: '',
    caseData: []
  });

  const [isRunning, setIsRunning] = useState(false);
  const [automationStatus, setAutomationStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [results, setResults] = useState<{
    processed: number;
    errors: string[];
    success: boolean;
  } | null>(null);

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [caseDataInput, setCaseDataInput] = useState('');

  const runAutomation = async () => {
    setIsRunning(true);
    setAutomationStatus('running');

    try {
      const response = await fetch('/api/surveillance/nedss/automate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(automation)
      });

      const result = await response.json();

      if (result.success) {
        setAutomationStatus('completed');
        setResults(result.data);
        toast({
          title: 'Automation Completed',
          description: `Successfully processed ${result.data.processed} cases.`,
        });
      } else {
        setAutomationStatus('error');
        toast({
          title: 'Automation Failed',
          description: result.error || 'Failed to run NEDSS automation.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setAutomationStatus('error');
      toast({
        title: 'Automation Error',
        description: 'An error occurred while running the automation.',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const parseCaseData = () => {
    try {
      const lines = caseDataInput.trim().split('\n');
      const cases: NEDSSCase[] = [];

      for (const line of lines) {
        if (line.trim()) {
          const [patientId, sampleId, testType, result, collectionDate, location] = line.split(',').map(s => s.trim());
          cases.push({
            patientId,
            sampleId,
            testType,
            result,
            collectionDate,
            location
          });
        }
      }

      setAutomation(prev => ({ ...prev, caseData: cases }));
      toast({
        title: 'Data Parsed',
        description: `Successfully parsed ${cases.length} cases.`,
      });
    } catch (error) {
      toast({
        title: 'Parse Error',
        description: 'Failed to parse case data. Please check the format.',
        variant: 'destructive',
      });
    }
  };

  const saveCredentials = async () => {
    try {
      const response = await fetch('/api/surveillance/nedss/save-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Credentials Saved',
          description: 'NEDSS credentials saved successfully.',
        });
      } else {
        toast({
          title: 'Save Failed',
          description: 'Failed to save credentials.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Save Error',
        description: 'An error occurred while saving credentials.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'running':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NEDSS Automation</h1>
          <p className="text-muted-foreground">
            Automate Texas NEDSS data entry and reporting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={automationStatus === 'completed' ? 'default' : 'secondary'}>
            <span className={`mr-1 ${getStatusColor(automationStatus)}`}>
              {getStatusIcon(automationStatus)}
            </span>
            {automationStatus}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="automation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Automation Settings
                </CardTitle>
                <CardDescription>
                  Configure NEDSS automation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="countyCode">County Code</Label>
                  <Input
                    id="countyCode"
                    value={automation.countyCode}
                    onChange={(e) => setAutomation({ ...automation, countyCode: e.target.value })}
                    placeholder="e.g., TARRANT"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={automation.startDate}
                      onChange={(e) => setAutomation({ ...automation, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={automation.endDate}
                      onChange={(e) => setAutomation({ ...automation, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Case Data
                </CardTitle>
                <CardDescription>
                  Import case data for automation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="caseData">Case Data (CSV format)</Label>
                  <Textarea
                    id="caseData"
                    value={caseDataInput}
                    onChange={(e) => setCaseDataInput(e.target.value)}
                    placeholder="patientId,sampleId,testType,result,collectionDate,location"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: patientId,sampleId,testType,result,collectionDate,location
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={parseCaseData} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Parse Data
                  </Button>
                  <Button 
                    onClick={() => setCaseDataInput('')} 
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>
                {automation.caseData.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {automation.caseData.length} cases loaded
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Run Automation
              </CardTitle>
              <CardDescription>
                Execute NEDSS automation with loaded data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Ready to process {automation.caseData.length} cases
                  </p>
                  <p className="text-xs text-muted-foreground">
                    County: {automation.countyCode} | 
                    Date Range: {automation.startDate} to {automation.endDate}
                  </p>
                </div>
                <Button 
                  onClick={runAutomation} 
                  disabled={isRunning || automation.caseData.length === 0}
                  className="flex items-center gap-2"
                >
                  {isRunning ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isRunning ? 'Running...' : 'Run Automation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                NEDSS Credentials
              </CardTitle>
              <CardDescription>
                Configure Texas NEDSS login credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    placeholder="nedss_username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <Button 
                onClick={saveCredentials} 
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Save Credentials
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Automation Results
              </CardTitle>
              <CardDescription>
                View results from NEDSS automation runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {results.processed}
                      </div>
                      <div className="text-sm text-muted-foreground">Cases Processed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {results.errors.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.success ? 'Success' : 'Failed'}
                      </div>
                      <div className="text-sm text-muted-foreground">Status</div>
                    </div>
                  </div>

                  {results.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Errors:</h4>
                      <div className="space-y-1">
                        {results.errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No automation results yet. Run an automation to see results here.
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
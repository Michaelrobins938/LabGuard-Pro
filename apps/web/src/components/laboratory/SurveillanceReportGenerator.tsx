'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FileText,
  Download,
  Mail,
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Zap,
  Users,
  Globe,
  BarChart3,
  Settings,
  Eye,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Send,
  Save,
  FileSpreadsheet,
  QrCode,
  Scan,
  Truck,
  Building,
  MailCheck,
  RefreshCw,
  Layers,
  Target,
  Shield,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SurveillanceData {
  county: string;
  dateRange: string;
  westNileCases: number;
  westNileDeaths: number;
  positiveSamples: number;
  totalSamples: number;
  mosquitoPools: number;
  positivePools: number;
  humanCases: number;
  equineCases: number;
  deadBirds: number;
  positiveBirds: number;
  lastUpdated: string;
  status: 'pending' | 'generated' | 'sent' | 'error';
}

interface ReportTemplate {
  id: string;
  name: string;
  county: string;
  format: 'pdf' | 'excel' | 'csv';
  recipients: string[];
  lastGenerated: string;
  status: 'active' | 'inactive';
}

interface LIMSIntegration {
  system: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  dataTypes: string[];
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

interface SampleTrackingData {
  sampleId: string;
  qrCode: string;
  barcode: string;
  chainOfCustody: Array<{
    timestamp: Date;
    location: string;
    handler: string;
    action: string;
    notes?: string;
  }>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'collected' | 'in_transit' | 'received' | 'processing' | 'completed' | 'archived';
  location: string;
  lastUpdated: Date;
}

const SurveillanceReportGenerator = () => {
  const [surveillanceData, setSurveillanceData] = useState<SurveillanceData[]>([]);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [limsIntegrations, setLimsIntegrations] = useState<LIMSIntegration[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneration, setLastGeneration] = useState<string>('');
  
  // New state for enhanced features
  const [countyConfigurations, setCountyConfigurations] = useState<CountyConfiguration[]>([]);
  const [isAutomatedGeneration, setIsAutomatedGeneration] = useState(false);
  const [multiSystemSync, setMultiSystemSync] = useState({
    sourceSystem: 'lims',
    targetSystems: ['nedss', 'arboret'],
    isSyncing: false
  });
  const [sampleTracking, setSampleTracking] = useState<SampleTrackingData[]>([]);
  const [newSampleTracking, setNewSampleTracking] = useState({
    sampleId: '',
    priority: 'medium' as const,
    location: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    setSurveillanceData([
      {
        county: 'Tarrant',
        dateRange: '2024-01-01 to 2024-01-07',
        westNileCases: 12,
        westNileDeaths: 2,
        positiveSamples: 45,
        totalSamples: 234,
        mosquitoPools: 156,
        positivePools: 23,
        humanCases: 8,
        equineCases: 3,
        deadBirds: 67,
        positiveBirds: 12,
        lastUpdated: '2024-01-07 14:30',
        status: 'pending'
      },
      {
        county: 'Dallas',
        dateRange: '2024-01-01 to 2024-01-07',
        westNileCases: 18,
        westNileDeaths: 3,
        positiveSamples: 67,
        totalSamples: 312,
        mosquitoPools: 234,
        positivePools: 34,
        humanCases: 12,
        equineCases: 5,
        deadBirds: 89,
        positiveBirds: 18,
        lastUpdated: '2024-01-07 15:45',
        status: 'generated'
      }
    ]);

    setCountyConfigurations([
      {
        countyCode: 'Tarrant',
        templateName: 'Tarrant County Weekly Report',
        recipients: ['health@tarrantcounty.com', 'surveillance@tarrantcounty.com'],
        format: 'pdf',
        includeMaps: true,
        includeHistorical: true,
        customFields: {
          'Population Density': 'High',
          'Risk Level': 'Medium',
          'Response Protocol': 'Standard'
        },
        isActive: true
      },
      {
        countyCode: 'Dallas',
        templateName: 'Dallas County Weekly Report',
        recipients: ['public.health@dallascounty.org'],
        format: 'pdf',
        includeMaps: true,
        includeHistorical: false,
        customFields: {
          'Population Density': 'Very High',
          'Risk Level': 'High',
          'Response Protocol': 'Enhanced'
        },
        isActive: true
      }
    ]);

    setLimsIntegrations([
      {
        system: 'LabWare LIMS',
        status: 'connected',
        lastSync: '2024-01-07 14:30',
        dataTypes: ['Samples', 'Results', 'Patients']
      },
      {
        system: 'Texas NEDSS',
        status: 'connected',
        lastSync: '2024-01-07 14:25',
        dataTypes: ['Case Reports', 'Notifications']
      },
      {
        system: 'CDC ArboNET',
        status: 'connected',
        lastSync: '2024-01-07 14:20',
        dataTypes: ['Vector Data', 'Species Counts']
      }
    ]);
  }, []);

  const generateAutomatedReports = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate automated report generation
      for (let i = 0; i <= 100; i += 10) {
        setGenerationProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Simulate API call
      const response = await fetch('/api/surveillance/reports/automated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weekEnding: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setLastGeneration(new Date().toLocaleString());
        setIsAutomatedGeneration(true);
      }
    } catch (error) {
      console.error('Error generating automated reports:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const syncMultiSystemData = async () => {
    setMultiSystemSync(prev => ({ ...prev, isSyncing: true }));

    try {
      // Simulate multi-system sync
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate API call
      const response = await fetch('/api/surveillance/sync/multi-system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: { sampleId: 'SAMPLE-001', result: 'Positive' },
          sourceSystem: 'lims',
          targetSystems: ['nedss', 'arboret']
        })
      });

      if (response.ok) {
        console.log('Multi-system sync completed');
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setMultiSystemSync(prev => ({ ...prev, isSyncing: false }));
    }
  };

  const createSampleTracking = async () => {
    try {
      const response = await fetch('/api/surveillance/samples/tracking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSampleTracking)
      });

      if (response.ok) {
        const trackingData = await response.json();
        setSampleTracking(prev => [...prev, trackingData.data]);
        setNewSampleTracking({ sampleId: '', priority: 'medium', location: '' });
      }
    } catch (error) {
      console.error('Error creating sample tracking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surveillance Report Generator</h1>
          <p className="text-gray-600 mt-2">
            Automated county reports, multi-system data sync, and smart sample tracking
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={syncMultiSystemData} disabled={multiSystemSync.isSyncing}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {multiSystemSync.isSyncing ? 'Syncing...' : 'Sync Systems'}
          </Button>
          <Button onClick={generateAutomatedReports} disabled={isGenerating}>
            <Zap className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Reports'}
          </Button>
        </div>
      </div>

      {/* Automated County Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MailCheck className="w-5 h-5 mr-2" />
            Automated County Reports
            <Badge variant="secondary" className="ml-2">Saves 4-5 hours/week</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countyConfigurations.map((config) => (
              <div key={config.countyCode} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{config.countyCode} County</h3>
                  <Badge variant={config.isActive ? "default" : "secondary"}>
                    {config.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{config.templateName}</p>
                <div className="text-xs text-gray-500">
                  <p>Recipients: {config.recipients.length}</p>
                  <p>Format: {config.format.toUpperCase()}</p>
                  <p>Maps: {config.includeMaps ? 'Yes' : 'No'}</p>
                </div>
              </div>
            ))}
          </div>
          
          {isGenerating && (
            <div className="mt-4">
              <Progress value={generationProgress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Generating {countyConfigurations.length} county reports...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Multi-System Data Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            Multi-System Data Integration
            <Badge variant="secondary" className="ml-2">Eliminates triple data entry</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {limsIntegrations.map((integration) => (
              <div key={integration.system} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{integration.system}</h3>
                  <Badge className={getStatusColor(integration.status)}>
                    {getStatusIcon(integration.status)}
                    <span className="ml-1">{integration.status}</span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Last sync: {integration.lastSync}</p>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Data types:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {integration.dataTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Sample Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            Smart Sample Tracking
            <Badge variant="secondary" className="ml-2">Prevents lost samples</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create New Tracking */}
            <div className="space-y-4">
              <h3 className="font-semibold">Create Sample Tracking</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Sample ID"
                  value={newSampleTracking.sampleId}
                  onChange={(e) => setNewSampleTracking(prev => ({ ...prev, sampleId: e.target.value }))}
                />
                <Select
                  value={newSampleTracking.priority}
                  onValueChange={(value) => setNewSampleTracking(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Location"
                  value={newSampleTracking.location}
                  onChange={(e) => setNewSampleTracking(prev => ({ ...prev, location: e.target.value }))}
                />
                <Button onClick={createSampleTracking} className="w-full">
                  <QrCode className="w-4 h-4 mr-2" />
                  Create Tracking
                </Button>
              </div>
            </div>

            {/* Tracking List */}
            <div>
              <h3 className="font-semibold mb-4">Active Tracking</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sampleTracking.map((tracking) => (
                  <div key={tracking.sampleId} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{tracking.sampleId}</p>
                        <p className="text-sm text-gray-600">{tracking.location}</p>
                      </div>
                      <Badge variant={
                        tracking.priority === 'urgent' ? 'destructive' :
                        tracking.priority === 'high' ? 'default' :
                        tracking.priority === 'medium' ? 'secondary' : 'outline'
                      }>
                        {tracking.priority}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Status: {tracking.status}</p>
                      <p>Last updated: {tracking.lastUpdated.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Surveillance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Surveillance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {surveillanceData.map((data) => (
              <div key={data.county} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{data.county} County</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Samples:</span>
                    <span className="font-medium">{data.totalSamples}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Positive Samples:</span>
                    <span className="font-medium text-red-600">{data.positiveSamples}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>West Nile Cases:</span>
                    <span className="font-medium text-orange-600">{data.westNileCases}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mosquito Pools:</span>
                    <span className="font-medium">{data.mosquitoPools}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge className={getStatusColor(data.status)}>
                    {getStatusIcon(data.status)}
                    <span className="ml-1">{data.status}</span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveillanceReportGenerator; 
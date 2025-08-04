'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Database,
  Zap,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Clock,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Eye,
  Download,
  Upload,
  ArrowRight,
  ArrowLeft,
  Activity,
  Shield,
  Globe,
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Filter,
  Search,
  Plus,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemIntegration {
  id: string;
  name: string;
  type: 'lims' | 'nedss' | 'arbonet' | 'external';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string;
  syncInterval: number; // minutes
  dataTypes: string[];
  apiEndpoint: string;
  credentials: 'configured' | 'missing' | 'expired';
  syncStatus: {
    samples: 'success' | 'error' | 'pending';
    results: 'success' | 'error' | 'pending';
    cases: 'success' | 'error' | 'pending';
    surveillance: 'success' | 'error' | 'pending';
  };
}

interface SyncJob {
  id: string;
  system: string;
  dataType: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  startTime: string;
  endTime?: string;
  recordsProcessed: number;
  recordsFailed: number;
  errorMessage?: string;
}

interface DataMapping {
  sourceField: string;
  targetField: string;
  transformation: string;
  required: boolean;
  validation: string;
}

const MultiSystemIntegrationHub = () => {
  const [integrations, setIntegrations] = useState<SystemIntegration[]>([]);
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([]);
  const [dataMappings, setDataMappings] = useState<DataMapping[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  // Mock data for demonstration
  useEffect(() => {
    setIntegrations([
      {
        id: 'lims-primary',
        name: 'Primary LIMS System',
        type: 'lims',
        status: 'connected',
        lastSync: '2024-01-07 14:30',
        syncInterval: 15,
        dataTypes: ['samples', 'results', 'patients', 'locations'],
        apiEndpoint: 'https://lims.internal/api/v1',
        credentials: 'configured',
        syncStatus: {
          samples: 'success',
          results: 'success',
          cases: 'success',
          surveillance: 'success'
        }
      },
      {
        id: 'texas-nedss',
        name: 'Texas NEDSS',
        type: 'nedss',
        status: 'connected',
        lastSync: '2024-01-07 14:30',
        syncInterval: 30,
        dataTypes: ['case_reports', 'surveillance_data', 'demographics'],
        apiEndpoint: 'https://nedss.dshs.texas.gov/api',
        credentials: 'configured',
        syncStatus: {
          samples: 'success',
          results: 'success',
          cases: 'success',
          surveillance: 'success'
        }
      },
      {
        id: 'cdc-arbonet',
        name: 'CDC ArboNET',
        type: 'arbonet',
        status: 'connected',
        lastSync: '2024-01-07 14:30',
        syncInterval: 60,
        dataTypes: ['vector_data', 'human_cases', 'animal_cases', 'environmental'],
        apiEndpoint: 'https://arbonet.cdc.gov/api',
        credentials: 'configured',
        syncStatus: {
          samples: 'success',
          results: 'success',
          cases: 'success',
          surveillance: 'success'
        }
      },
      {
        id: 'county-health',
        name: 'County Health Department',
        type: 'external',
        status: 'connected',
        lastSync: '2024-01-07 14:30',
        syncInterval: 45,
        dataTypes: ['patient_data', 'clinical_reports'],
        apiEndpoint: 'https://health.tarrantcounty.com/api',
        credentials: 'configured',
        syncStatus: {
          samples: 'success',
          results: 'success',
          cases: 'success',
          surveillance: 'success'
        }
      }
    ]);

    setDataMappings([
      {
        sourceField: 'sample_id',
        targetField: 'specimen_id',
        transformation: 'direct',
        required: true,
        validation: 'alphanumeric'
      },
      {
        sourceField: 'patient_name',
        targetField: 'subject_name',
        transformation: 'direct',
        required: true,
        validation: 'text'
      },
      {
        sourceField: 'test_result',
        targetField: 'assay_result',
        transformation: 'standardize_result',
        required: true,
        validation: 'enum'
      },
      {
        sourceField: 'collection_date',
        targetField: 'specimen_collection_date',
        transformation: 'date_format',
        required: true,
        validation: 'date'
      }
    ]);
  }, []);

  const startSync = async (integrationId: string) => {
    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync process
    const steps = [
      'Validating credentials...',
      'Establishing connection...',
      'Pulling data from source...',
      'Transforming data...',
      'Pushing to target system...',
      'Validating sync results...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSyncProgress(((i + 1) / steps.length) * 100);
    }

    setIsSyncing(false);
    
    // Update integration status
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              lastSync: new Date().toISOString(),
              syncStatus: {
                samples: 'success',
                results: 'success',
                cases: 'success',
                surveillance: 'success'
              }
            }
          : integration
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'error': return 'bg-yellow-500';
      case 'syncing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Multi-System Integration Hub</h1>
          <p className="text-gray-600 mt-2">
            Eliminate triple data entry with automated system synchronization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>Auto-Sync Enabled</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>Data Validation</span>
          </Badge>
        </div>
      </div>

      {/* System Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>System Integrations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{integration.name}</h4>
                    <p className="text-sm text-gray-500">
                      {integration.type.toUpperCase()} • Sync every {integration.syncInterval} min
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(integration.status)}`} />
                    <Badge variant="outline" className="text-xs">
                      {integration.credentials}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-xs text-gray-500">
                    API: {integration.apiEndpoint}
                  </div>
                  <div className="text-xs text-gray-500">
                    Last sync: {integration.lastSync}
                  </div>
                </div>

                {/* Sync Status */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {Object.entries(integration.syncStatus).map(([key, status]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="capitalize">{key}:</span>
                      <span className={getSyncStatusColor(status)}>
                        {status === 'success' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                        {status === 'error' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                        {status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                        {status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => startSync(integration.id)}
                    disabled={isSyncing}
                    className="flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync Now</span>
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync Progress */}
      {isSyncing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Synchronizing Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Syncing systems...</span>
                <span className="text-sm text-gray-500">{Math.round(syncProgress)}%</span>
              </div>
              <Progress value={syncProgress} className="w-full" />
              <div className="text-xs text-gray-500">
                This process ensures data consistency across all integrated systems
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Flow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Data Flow</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4 p-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs font-medium">LIMS</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs font-medium">Hub</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs font-medium">NEDSS</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-xs font-medium">ArboNET</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Mappings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Data Field Mappings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataMappings.map((mapping, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{mapping.sourceField}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{mapping.targetField}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Transformation: {mapping.transformation} • Validation: {mapping.validation}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={mapping.required ? 'default' : 'secondary'}>
                    {mapping.required ? 'Required' : 'Optional'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Sync Jobs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {syncJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <RefreshCw className="w-8 h-8 mx-auto mb-2" />
                <p>No recent sync jobs</p>
                <p className="text-sm">Sync jobs will appear here after data synchronization</p>
              </div>
            ) : (
              syncJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{job.system}</span>
                      <span className="text-sm text-gray-500">• {job.dataType}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {job.startTime} • {job.recordsProcessed} records processed
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      job.status === 'completed' ? 'default' :
                      job.status === 'failed' ? 'destructive' :
                      job.status === 'running' ? 'secondary' : 'outline'
                    }>
                      {job.status}
                    </Badge>
                    {job.status === 'running' && (
                      <Progress value={job.progress} className="w-16" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
              <RefreshCw className="w-5 h-5" />
              <span className="text-xs">Sync All</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
              <Eye className="w-5 h-5" />
              <span className="text-xs">View Logs</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
              <Download className="w-5 h-5" />
              <span className="text-xs">Export Data</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
              <Settings className="w-5 h-5" />
              <span className="text-xs">Configure</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiSystemIntegrationHub; 
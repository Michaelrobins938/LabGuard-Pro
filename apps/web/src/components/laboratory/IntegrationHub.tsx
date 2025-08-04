'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Globe, 
  Database, 
  Zap, 
  Settings, 
  Eye, 
  Download, 
  Upload, 
  Calendar,
  Users,
  Activity,
  Target,
  BarChart3,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ExternalLink,
  Lock,
  Unlock,
  AlertCircle,
  Info,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  QrCode,
  Barcode,
  Hash,
  CalendarDays,
  Timer,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  FileText,
  Shield,
  Wifi,
  WifiOff,
  Server,
  Code,
  Key,
  Link,
  Unlink,
  TestTube,
  FlaskConical,
  Beaker,
  Microscope,
  Brain
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Integration {
  id: string;
  name: string;
  type: 'LIMS' | 'LIS' | 'HIS' | 'EMR' | 'API' | 'Database' | 'Equipment' | 'Reporting';
  status: 'active' | 'inactive' | 'error' | 'maintenance' | 'testing';
  health: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  lastSync: Date;
  nextSync: Date;
  syncInterval: number; // minutes
  dataTypes: string[];
  endpoints: Endpoint[];
  credentials: Credential[];
  logs: IntegrationLog[];
  performance: PerformanceMetrics;
  alerts: Alert[];
}

interface Endpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive' | 'error';
  lastTest: Date;
  responseTime: number; // milliseconds
  successRate: number; // percentage
}

interface Credential {
  id: string;
  name: string;
  type: 'API Key' | 'OAuth' | 'Username/Password' | 'Certificate';
  status: 'valid' | 'expired' | 'invalid';
  lastRotated: Date;
  nextRotation: Date;
}

interface IntegrationLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  details?: string;
  endpoint?: string;
}

interface PerformanceMetrics {
  uptime: number; // percentage
  averageResponseTime: number; // milliseconds
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  last24Hours: {
    requests: number;
    errors: number;
    avgResponseTime: number;
  };
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
  integrationId: string;
}

interface WorkflowBuilder {
  id: string;
  name: string;
  description: string;
  triggers: Trigger[];
  actions: Action[];
  status: 'active' | 'inactive' | 'draft';
  lastExecuted?: Date;
  executionCount: number;
}

interface Trigger {
  id: string;
  type: 'data_received' | 'time_scheduled' | 'condition_met' | 'manual';
  condition: string;
  integration: string;
}

interface Action {
  id: string;
  type: 'send_data' | 'transform_data' | 'notify_user' | 'update_record';
  target: string;
  parameters: Record<string, any>;
}

export default function IntegrationHub() {
  const [activeTab, setActiveTab] = useState<'overview' | 'integrations' | 'workflows' | 'monitoring'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'lims-001',
      name: 'LabWare LIMS',
      type: 'LIMS',
      status: 'active',
      health: 'excellent',
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      nextSync: new Date(Date.now() + 25 * 60 * 1000),
      syncInterval: 30,
      dataTypes: ['Samples', 'Results', 'Equipment', 'Personnel'],
      endpoints: [
        {
          id: 'ep1',
          name: 'Sample Data API',
          url: 'https://api.labware.com/samples',
          method: 'GET',
          status: 'active',
          lastTest: new Date(Date.now() - 10 * 60 * 1000),
          responseTime: 150,
          successRate: 99.8
        },
        {
          id: 'ep2',
          name: 'Results Upload',
          url: 'https://api.labware.com/results',
          method: 'POST',
          status: 'active',
          lastTest: new Date(Date.now() - 5 * 60 * 1000),
          responseTime: 200,
          successRate: 99.5
        }
      ],
      credentials: [
        {
          id: 'cred1',
          name: 'API Key',
          type: 'API Key',
          status: 'valid',
          lastRotated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          nextRotation: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      ],
      logs: [
        {
          id: 'log1',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          level: 'info',
          message: 'Data sync completed successfully',
          details: 'Synced 45 new samples and 23 results'
        }
      ],
      performance: {
        uptime: 99.9,
        averageResponseTime: 175,
        totalRequests: 15420,
        successfulRequests: 15380,
        failedRequests: 40,
        last24Hours: {
          requests: 1250,
          errors: 2,
          avgResponseTime: 180
        }
      },
      alerts: []
    },
    {
      id: 'his-001',
      name: 'Epic HIS',
      type: 'HIS',
      status: 'active',
      health: 'good',
      lastSync: new Date(Date.now() - 15 * 60 * 1000),
      nextSync: new Date(Date.now() + 15 * 60 * 1000),
      syncInterval: 30,
      dataTypes: ['Patient Data', 'Orders', 'Results'],
      endpoints: [
        {
          id: 'ep3',
          name: 'Patient Data API',
          url: 'https://api.epic.com/patients',
          method: 'GET',
          status: 'active',
          lastTest: new Date(Date.now() - 20 * 60 * 1000),
          responseTime: 300,
          successRate: 98.5
        }
      ],
      credentials: [
        {
          id: 'cred2',
          name: 'OAuth Token',
          type: 'OAuth',
          status: 'valid',
          lastRotated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          nextRotation: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000)
        }
      ],
      logs: [
        {
          id: 'log2',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          level: 'warning',
          message: 'High response time detected',
          details: 'Average response time increased to 300ms'
        }
      ],
      performance: {
        uptime: 99.5,
        averageResponseTime: 300,
        totalRequests: 8920,
        successfulRequests: 8780,
        failedRequests: 140,
        last24Hours: {
          requests: 850,
          errors: 5,
          avgResponseTime: 320
        }
      },
      alerts: [
        {
          id: 'alert1',
          type: 'warning',
          message: 'Response time above threshold',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          resolved: false,
          integrationId: 'his-001'
        }
      ]
    },
    {
      id: 'equipment-001',
      name: 'Roche Cobas Analyzer',
      type: 'Equipment',
      status: 'active',
      health: 'excellent',
      lastSync: new Date(Date.now() - 2 * 60 * 1000),
      nextSync: new Date(Date.now() + 28 * 60 * 1000),
      syncInterval: 30,
      dataTypes: ['Test Results', 'QC Data', 'Calibration'],
      endpoints: [
        {
          id: 'ep4',
          name: 'Results Interface',
          url: 'tcp://192.168.1.100:8080',
          method: 'POST',
          status: 'active',
          lastTest: new Date(Date.now() - 2 * 60 * 1000),
          responseTime: 50,
          successRate: 100
        }
      ],
      credentials: [
        {
          id: 'cred3',
          name: 'Equipment Certificate',
          type: 'Certificate',
          status: 'valid',
          lastRotated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          nextRotation: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        }
      ],
      logs: [
        {
          id: 'log3',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          level: 'info',
          message: 'QC data transmitted successfully',
          details: 'Transmitted 12 QC results'
        }
      ],
      performance: {
        uptime: 100,
        averageResponseTime: 50,
        totalRequests: 4560,
        successfulRequests: 4560,
        failedRequests: 0,
        last24Hours: {
          requests: 180,
          errors: 0,
          avgResponseTime: 45
        }
      },
      alerts: []
    },
    {
      id: 'api-001',
      name: 'CDC Public Health API',
      type: 'API',
      status: 'error',
      health: 'poor',
      lastSync: new Date(Date.now() - 45 * 60 * 1000),
      nextSync: new Date(Date.now() + 15 * 60 * 1000),
      syncInterval: 60,
      dataTypes: ['Surveillance Data', 'Outbreak Reports'],
      endpoints: [
        {
          id: 'ep5',
          name: 'Surveillance Data',
          url: 'https://api.cdc.gov/surveillance',
          method: 'GET',
          status: 'error',
          lastTest: new Date(Date.now() - 45 * 60 * 1000),
          responseTime: 0,
          successRate: 0
        }
      ],
      credentials: [
        {
          id: 'cred4',
          name: 'CDC API Key',
          type: 'API Key',
          status: 'valid',
          lastRotated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          nextRotation: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      ],
      logs: [
        {
          id: 'log4',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          level: 'error',
          message: 'Connection timeout',
          details: 'Failed to connect to CDC API after 30 seconds'
        }
      ],
      performance: {
        uptime: 85.0,
        averageResponseTime: 0,
        totalRequests: 1200,
        successfulRequests: 1020,
        failedRequests: 180,
        last24Hours: {
          requests: 50,
          errors: 15,
          avgResponseTime: 0
        }
      },
      alerts: [
        {
          id: 'alert2',
          type: 'critical',
          message: 'CDC API connection failed',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          resolved: false,
          integrationId: 'api-001'
        }
      ]
    }
  ]);

  const [workflows, setWorkflows] = useState<WorkflowBuilder[]>([
    {
      id: 'wf1',
      name: 'Sample Results Auto-Sync',
      description: 'Automatically sync completed test results to LIMS',
      triggers: [
        {
          id: 'trig1',
          type: 'data_received',
          condition: 'test_status = completed',
          integration: 'equipment-001'
        }
      ],
      actions: [
        {
          id: 'act1',
          type: 'send_data',
          target: 'lims-001',
          parameters: {
            endpoint: 'results',
            format: 'HL7'
          }
        }
      ],
      status: 'active',
      lastExecuted: new Date(Date.now() - 10 * 60 * 1000),
      executionCount: 1250
    },
    {
      id: 'wf2',
      name: 'Critical Results Alert',
      description: 'Send immediate alerts for critical test results',
      triggers: [
        {
          id: 'trig2',
          type: 'condition_met',
          condition: 'result_value > critical_threshold',
          integration: 'lims-001'
        }
      ],
      actions: [
        {
          id: 'act2',
          type: 'notify_user',
          target: 'his-001',
          parameters: {
            method: 'email',
            priority: 'urgent'
          }
        }
      ],
      status: 'active',
      lastExecuted: new Date(Date.now() - 30 * 60 * 1000),
      executionCount: 45
    }
  ]);

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || integration.type === filterType;
    const matchesStatus = filterStatus === 'all' || integration.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalIntegrations = integrations.length;
  const activeIntegrations = integrations.filter(i => i.status === 'active').length;
  const errorIntegrations = integrations.filter(i => i.status === 'error').length;
  const totalAlerts = integrations.reduce((count, integration) => 
    count + integration.alerts.filter(a => !a.resolved).length, 0
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'error': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'testing': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'fair': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'poor': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'LIMS': return Database;
      case 'LIS': return Database;
      case 'HIS': return Users;
      case 'EMR': return FileText;
      case 'API': return Code;
      case 'Database': return Database;
      case 'Equipment': return TestTube;
      case 'Reporting': return BarChart3;
      default: return Globe;
    }
  };

  const selectedIntegrationData = selectedIntegration 
    ? integrations.find(i => i.id === selectedIntegration) 
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integration Hub</h1>
          <p className="text-gray-600">Manage system integrations and data synchronization</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Integration
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'integrations', label: 'Integrations', icon: Globe },
          { id: 'workflows', label: 'Workflows', icon: Activity },
          { id: 'monitoring', label: 'Monitoring', icon: Shield }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className="flex items-center gap-2"
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Integrations</p>
                    <p className="text-2xl font-bold text-gray-900">{totalIntegrations}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+2 this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                    <p className="text-2xl font-bold text-gray-900">{activeIntegrations}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">All systems operational</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Error States</p>
                    <p className="text-2xl font-bold text-gray-900">{errorIntegrations}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Requires attention</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">{totalAlerts}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600">Monitor closely</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integration Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Integration Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.slice(0, 6).map((integration) => {
                  const TypeIcon = getTypeIcon(integration.type);
                  return (
                    <motion.div
                      key={integration.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedIntegration(integration.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <TypeIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{integration.name}</h4>
                            <p className="text-sm text-gray-600">{integration.type}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status}
                          </Badge>
                          <Badge className={getHealthColor(integration.health)}>
                            {integration.health}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Uptime:</span>
                          <span className="font-medium">{integration.performance.uptime}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Response Time:</span>
                          <span className="font-medium">{integration.performance.averageResponseTime}ms</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Success Rate:</span>
                          <span className="font-medium">
                            {((integration.performance.successfulRequests / integration.performance.totalRequests) * 100).toFixed(1)}%
                          </span>
                        </div>
                        {integration.alerts.filter(a => !a.resolved).length > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-red-600">
                              {integration.alerts.filter(a => !a.resolved).length} active alerts
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Integration Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.flatMap(integration => 
                  integration.logs.slice(0, 2).map(log => ({
                    ...log,
                    integrationName: integration.name,
                    integrationType: integration.type
                  }))
                ).slice(0, 8).map((log, index) => (
                  <div key={`${log.integrationName}-${index}`} className="flex items-start gap-4 p-3 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      log.level === 'critical' ? 'bg-red-100 text-red-800' :
                      log.level === 'error' ? 'bg-red-100 text-red-800' :
                      log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {log.level === 'critical' && <AlertTriangle className="w-4 h-4" />}
                      {log.level === 'error' && <AlertCircle className="w-4 h-4" />}
                      {log.level === 'warning' && <Clock className="w-4 h-4" />}
                      {log.level === 'info' && <Info className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{log.message}</h4>
                        <Badge variant="outline" className="text-xs">
                          {log.integrationName}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{log.integrationType}</span>
                        <span>{log.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search integrations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="LIMS">LIMS</option>
                      <option value="LIS">LIS</option>
                      <option value="HIS">HIS</option>
                      <option value="EMR">EMR</option>
                      <option value="API">API</option>
                      <option value="Database">Database</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Reporting">Reporting</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="error">Error</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="testing">Testing</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integrations List */}
          <div className="space-y-4">
            {filteredIntegrations.map((integration) => {
              const TypeIcon = getTypeIcon(integration.type);
              return (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <TypeIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                              <p className="text-sm text-gray-600">{integration.type} Integration</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(integration.status)}>
                                {integration.status}
                              </Badge>
                              <Badge className={getHealthColor(integration.health)}>
                                {integration.health}
                              </Badge>
                              {integration.alerts.filter(a => !a.resolved).length > 0 && (
                                <Badge variant="destructive">
                                  {integration.alerts.filter(a => !a.resolved).length}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Performance</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Uptime:</span>
                                  <span className="font-medium">{integration.performance.uptime}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Avg Response:</span>
                                  <span className="font-medium">{integration.performance.averageResponseTime}ms</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Success Rate:</span>
                                  <span className="font-medium">
                                    {((integration.performance.successfulRequests / integration.performance.totalRequests) * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Sync Status</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Last Sync:</span>
                                  <span>{integration.lastSync.toLocaleTimeString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Next Sync:</span>
                                  <span className="font-medium">{integration.nextSync.toLocaleTimeString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Interval:</span>
                                  <span className="font-medium">{integration.syncInterval} min</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Endpoints</h4>
                              <div className="space-y-1">
                                {integration.endpoints.slice(0, 2).map((endpoint) => (
                                  <div key={endpoint.id} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{endpoint.name}</span>
                                    <Badge className={getStatusColor(endpoint.status)}>
                                      {endpoint.status}
                                    </Badge>
                                  </div>
                                ))}
                                {integration.endpoints.length > 2 && (
                                  <div className="text-sm text-gray-500">
                                    +{integration.endpoints.length - 2} more endpoints
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Integration Details */}
      {selectedIntegrationData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {selectedIntegrationData.name} - Integration Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Integration Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedIntegrationData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedIntegrationData.status)}>
                        {selectedIntegrationData.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health:</span>
                      <Badge className={getHealthColor(selectedIntegrationData.health)}>
                        {selectedIntegrationData.health}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sync Interval:</span>
                      <span className="font-medium">{selectedIntegrationData.syncInterval} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Types:</span>
                      <span className="font-medium">{selectedIntegrationData.dataTypes.length}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Activity className="w-4 h-4 mr-2" />
                      View Logs
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Performance
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
} 
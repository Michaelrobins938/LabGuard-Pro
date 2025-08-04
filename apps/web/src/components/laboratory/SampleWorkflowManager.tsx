'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FlaskConical, 
  Beaker, 
  TestTube, 
  Microscope, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  FileText, 
  Settings, 
  Eye, 
  Download, 
  Upload, 
  Calendar,
  Users,
  Database,
  Zap,
  Target,
  Globe,
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
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Sample {
  id: string;
  sampleId: string;
  type: 'clinical' | 'water' | 'dairy' | 'bioterrorism' | 'surveillance';
  priority: 'STAT' | 'routine' | 'bioterrorism' | 'research';
  status: 'received' | 'processing' | 'testing' | 'completed' | 'reported' | 'archived';
  description: string;
  source: string;
  receivedDate: Date;
  dueDate: Date;
  completedDate?: Date;
  tests: Test[];
  chainOfCustody: CustodyEvent[];
  assignedTo?: string;
  location: string;
  volume: string;
  preservation: string;
  notes: string[];
  alerts: Alert[];
}

interface Test {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  result?: string;
  units?: string;
  referenceRange?: string;
  performedBy?: string;
  performedDate?: Date;
  validatedBy?: string;
  validatedDate?: Date;
}

interface CustodyEvent {
  id: string;
  action: 'received' | 'transferred' | 'processed' | 'stored' | 'disposed';
  timestamp: Date;
  user: string;
  location: string;
  notes: string;
  signature?: string;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  assignedTo?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  notes: string[];
}

export default function SampleWorkflowManager() {
  const [activeTab, setActiveTab] = useState<'overview' | 'samples' | 'workflows' | 'chain'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  const [samples, setSamples] = useState<Sample[]>([
    {
      id: '1',
      sampleId: 'WT-2024-001',
      type: 'water',
      priority: 'routine',
      status: 'processing',
      description: 'Municipal water sample - bacteriological analysis',
      source: 'City Water Treatment Plant',
      receivedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tests: [
        {
          id: 't1',
          name: 'Total Coliform',
          type: 'Bacteriological',
          status: 'in-progress',
          performedBy: 'Dr. Sarah Johnson',
          performedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 't2',
          name: 'E. coli',
          type: 'Bacteriological',
          status: 'pending'
        },
        {
          id: 't3',
          name: 'Turbidity',
          type: 'Physical',
          status: 'completed',
          result: '0.5',
          units: 'NTU',
          referenceRange: '< 1.0',
          performedBy: 'Mike Chen',
          performedDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
          validatedBy: 'Dr. Sarah Johnson',
          validatedDate: new Date(Date.now() - 6 * 60 * 60 * 1000)
        }
      ],
      chainOfCustody: [
        {
          id: 'c1',
          action: 'received',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          user: 'John Smith',
          location: 'Receiving Area',
          notes: 'Sample received in good condition'
        },
        {
          id: 'c2',
          action: 'transferred',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          user: 'Dr. Sarah Johnson',
          location: 'Microbiology Lab',
          notes: 'Transferred to bacteriological testing'
        }
      ],
      assignedTo: 'Dr. Sarah Johnson',
      location: 'Microbiology Lab',
      volume: '500ml',
      preservation: '4°C',
      notes: [
        'Sample collected from main distribution line',
        'Temperature maintained during transport'
      ],
      alerts: [
        {
          id: 'a1',
          type: 'warning',
          message: 'Sample approaching 24-hour processing limit',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          resolved: false
        }
      ]
    },
    {
      id: '2',
      sampleId: 'CL-2024-015',
      type: 'clinical',
      priority: 'STAT',
      status: 'testing',
      description: 'Blood sample - CBC and chemistry panel',
      source: 'Emergency Department',
      receivedDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
      tests: [
        {
          id: 't4',
          name: 'Complete Blood Count',
          type: 'Hematology',
          status: 'completed',
          result: 'Normal',
          performedBy: 'Lisa Rodriguez',
          performedDate: new Date(Date.now() - 30 * 60 * 1000),
          validatedBy: 'Dr. Michael Brown',
          validatedDate: new Date(Date.now() - 15 * 60 * 1000)
        },
        {
          id: 't5',
          name: 'Comprehensive Metabolic Panel',
          type: 'Chemistry',
          status: 'in-progress',
          performedBy: 'Lisa Rodriguez',
          performedDate: new Date(Date.now() - 20 * 60 * 1000)
        }
      ],
      chainOfCustody: [
        {
          id: 'c3',
          action: 'received',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          user: 'John Smith',
          location: 'Receiving Area',
          notes: 'STAT sample - immediate processing required'
        },
        {
          id: 'c4',
          action: 'transferred',
          timestamp: new Date(Date.now() - 55 * 60 * 1000),
          user: 'Lisa Rodriguez',
          location: 'Clinical Lab',
          notes: 'Transferred to hematology and chemistry'
        }
      ],
      assignedTo: 'Lisa Rodriguez',
      location: 'Clinical Lab',
      volume: '10ml',
      preservation: 'Room temperature',
      notes: [
        'STAT emergency sample',
        'Patient in critical condition'
      ],
      alerts: [
        {
          id: 'a2',
          type: 'critical',
          message: 'STAT sample - results needed within 2 hours',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          resolved: false
        }
      ]
    },
    {
      id: '3',
      sampleId: 'DT-2024-008',
      type: 'dairy',
      priority: 'routine',
      status: 'completed',
      description: 'Milk sample - quality and safety testing',
      source: 'Dairy Farm #3',
      receivedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tests: [
        {
          id: 't6',
          name: 'Somatic Cell Count',
          type: 'Quality',
          status: 'completed',
          result: '150,000',
          units: 'cells/ml',
          referenceRange: '< 400,000',
          performedBy: 'Alex Thompson',
          performedDate: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
          validatedBy: 'Dr. Emily Davis',
          validatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 't7',
          name: 'Bacterial Count',
          type: 'Microbiology',
          status: 'completed',
          result: '2,500',
          units: 'CFU/ml',
          referenceRange: '< 100,000',
          performedBy: 'Alex Thompson',
          performedDate: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
          validatedBy: 'Dr. Emily Davis',
          validatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ],
      chainOfCustody: [
        {
          id: 'c5',
          action: 'received',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          user: 'John Smith',
          location: 'Receiving Area',
          notes: 'Dairy sample received'
        },
        {
          id: 'c6',
          action: 'transferred',
          timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
          user: 'Alex Thompson',
          location: 'Dairy Lab',
          notes: 'Transferred to dairy testing'
        },
        {
          id: 'c7',
          action: 'processed',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          user: 'Dr. Emily Davis',
          location: 'Dairy Lab',
          notes: 'Testing completed and validated'
        }
      ],
      assignedTo: 'Alex Thompson',
      location: 'Dairy Lab',
      volume: '100ml',
      preservation: '4°C',
      notes: [
        'Routine quality control sample',
        'All tests within acceptable ranges'
      ],
      alerts: []
    }
  ]);

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = sample.sampleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sample.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sample.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || sample.type === filterType;
    const matchesStatus = filterStatus === 'all' || sample.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || sample.priority === filterPriority;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const totalSamples = samples.length;
  const pendingSamples = samples.filter(s => s.status === 'received' || s.status === 'processing').length;
  const completedToday = samples.filter(s => 
    s.completedDate && 
    s.completedDate.toDateString() === new Date().toDateString()
  ).length;
  const criticalAlerts = samples.reduce((count, sample) => 
    count + sample.alerts.filter(a => a.type === 'critical' && !a.resolved).length, 0
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'testing': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'completed': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'reported': return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'STAT': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'bioterrorism': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'routine': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'research': return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'pending': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'failed': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const selectedSampleData = selectedSample 
    ? samples.find(s => s.id === selectedSample) 
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sample Workflow Manager</h1>
          <p className="text-gray-600">Track and manage laboratory samples through complete workflow</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Sample
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'samples', label: 'Samples', icon: TestTube },
          { id: 'workflows', label: 'Workflows', icon: Activity },
          { id: 'chain', label: 'Chain of Custody', icon: Database }
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
                    <p className="text-sm font-medium text-gray-600">Total Samples</p>
                    <p className="text-2xl font-bold text-gray-900">{totalSamples}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TestTube className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+5% from yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Processing</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingSamples}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600">Requires attention</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">On track for daily goal</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">{criticalAlerts}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Immediate action required</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Samples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Recent Samples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {samples.slice(0, 5).map((sample) => (
                  <motion.div
                    key={sample.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedSample(sample.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <TestTube className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{sample.sampleId}</h4>
                          <Badge className={getStatusColor(sample.status)}>
                            {sample.status}
                          </Badge>
                          <Badge className={getPriorityColor(sample.priority)}>
                            {sample.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{sample.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>Source: {sample.source}</span>
                          <span>Received: {sample.receivedDate.toLocaleDateString()}</span>
                          <span>Due: {sample.dueDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-medium">{sample.assignedTo}</div>
                        <div className="text-xs text-gray-500">{sample.location}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Samples Tab */}
      {activeTab === 'samples' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search samples by ID, description, or source..."
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
                      <option value="clinical">Clinical</option>
                      <option value="water">Water</option>
                      <option value="dairy">Dairy</option>
                      <option value="bioterrorism">Bioterrorism</option>
                      <option value="surveillance">Surveillance</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="received">Received</option>
                      <option value="processing">Processing</option>
                      <option value="testing">Testing</option>
                      <option value="completed">Completed</option>
                      <option value="reported">Reported</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Priorities</option>
                      <option value="STAT">STAT</option>
                      <option value="routine">Routine</option>
                      <option value="bioterrorism">Bioterrorism</option>
                      <option value="research">Research</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Samples List */}
          <div className="space-y-4">
            {filteredSamples.map((sample) => (
              <motion.div
                key={sample.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{sample.sampleId}</h3>
                          <Badge className={getStatusColor(sample.status)}>
                            {sample.status}
                          </Badge>
                          <Badge className={getPriorityColor(sample.priority)}>
                            {sample.priority}
                          </Badge>
                          {sample.alerts.filter(a => !a.resolved).length > 0 && (
                            <Badge variant="destructive">
                              {sample.alerts.filter(a => !a.resolved).length} alerts
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{sample.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Info</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Source:</span>
                                <span className="font-medium">{sample.source}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Volume:</span>
                                <span className="font-medium">{sample.volume}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Preservation:</span>
                                <span className="font-medium">{sample.preservation}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Received:</span>
                                <span>{sample.receivedDate.toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Due:</span>
                                <span className="font-medium">{sample.dueDate.toLocaleDateString()}</span>
                              </div>
                              {sample.completedDate && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Completed:</span>
                                  <span>{sample.completedDate.toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Tests</h4>
                            <div className="space-y-1">
                              {sample.tests.slice(0, 3).map((test) => (
                                <div key={test.id} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">{test.name}</span>
                                  <Badge className={getTestStatusColor(test.status)}>
                                    {test.status}
                                  </Badge>
                                </div>
                              ))}
                              {sample.tests.length > 3 && (
                                <div className="text-sm text-gray-500">
                                  +{sample.tests.length - 3} more tests
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
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Sample Details */}
      {selectedSampleData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                {selectedSampleData.sampleId} - Sample Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Sample Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sample ID:</span>
                      <span className="font-medium">{selectedSampleData.sampleId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedSampleData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <Badge className={getPriorityColor(selectedSampleData.priority)}>
                        {selectedSampleData.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedSampleData.status)}>
                        {selectedSampleData.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned To:</span>
                      <span className="font-medium">{selectedSampleData.assignedTo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedSampleData.location}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full justify-start">
                      <Play className="w-4 h-4 mr-2" />
                      Start Testing
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      Chain of Custody
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Sample
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
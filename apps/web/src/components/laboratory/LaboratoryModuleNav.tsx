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
  Brain, 
  Shield, 
  Activity, 
  Search, 
  Settings, 
  Plus, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  FileText,
  Users,
  Database,
  Zap,
  Target,
  Globe,
  BarChart3,
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LabModule {
  id: string;
  name: string;
  type: 'clinical' | 'water' | 'dairy' | 'bioterrorism' | 'surveillance';
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  sampleCount: number;
  pendingTests: number;
  alerts: number;
  compliance: number;
  lastActivity: Date;
  icon: React.ComponentType<any>;
  color: string;
  features: string[];
  workflows: Workflow[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  steps: number;
  avgDuration: number;
  priority: 'high' | 'medium' | 'low';
}

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  action: string;
  module?: string;
}

export default function LaboratoryModuleNav() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'activity' | 'alerts'>('activity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const [labModules, setLabModules] = useState<LabModule[]>([
    {
      id: 'clinical',
      name: 'Clinical Diagnostics',
      type: 'clinical',
      description: 'Comprehensive clinical testing and diagnostic services',
      status: 'active',
      sampleCount: 156,
      pendingTests: 23,
      alerts: 2,
      compliance: 98,
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      icon: TestTube,
      color: 'from-blue-500 to-cyan-500',
      features: ['Blood Chemistry', 'Microbiology', 'Hematology', 'Immunology'],
      workflows: [
        {
          id: 'w1',
          name: 'Routine Blood Panel',
          description: 'Standard blood chemistry and CBC analysis',
          status: 'active',
          steps: 8,
          avgDuration: 2.5,
          priority: 'medium'
        },
        {
          id: 'w2',
          name: 'STAT Emergency Tests',
          description: 'Urgent diagnostic testing for emergency cases',
          status: 'active',
          steps: 5,
          avgDuration: 1.0,
          priority: 'high'
        }
      ]
    },
    {
      id: 'water',
      name: 'Water Testing',
      type: 'water',
      description: 'Environmental water quality and safety testing',
      status: 'active',
      sampleCount: 89,
      pendingTests: 12,
      alerts: 1,
      compliance: 95,
      lastActivity: new Date(Date.now() - 45 * 60 * 1000),
      icon: Beaker,
      color: 'from-cyan-500 to-blue-500',
      features: ['Bacteriological', 'Chemical Analysis', 'Turbidity', 'pH Testing'],
      workflows: [
        {
          id: 'w3',
          name: 'Routine Water Quality',
          description: 'Standard water quality assessment',
          status: 'active',
          steps: 12,
          avgDuration: 4.0,
          priority: 'medium'
        },
        {
          id: 'w4',
          name: 'Emergency Water Testing',
          description: 'Rapid response to water contamination events',
          status: 'active',
          steps: 6,
          avgDuration: 2.0,
          priority: 'high'
        }
      ]
    },
    {
      id: 'dairy',
      name: 'Dairy Testing',
      type: 'dairy',
      description: 'Dairy product safety and quality assurance',
      status: 'active',
      sampleCount: 67,
      pendingTests: 8,
      alerts: 0,
      compliance: 99,
      lastActivity: new Date(Date.now() - 60 * 60 * 1000),
      icon: FlaskConical,
      color: 'from-green-500 to-emerald-500',
      features: ['Milk Quality', 'Bacterial Count', 'Antibiotic Residue', 'Somatic Cell Count'],
      workflows: [
        {
          id: 'w5',
          name: 'Milk Quality Assessment',
          description: 'Comprehensive dairy product testing',
          status: 'active',
          steps: 10,
          avgDuration: 3.5,
          priority: 'medium'
        }
      ]
    },
    {
      id: 'bioterrorism',
      name: 'Bioterrorism Response',
      type: 'bioterrorism',
      description: 'Emergency response and threat assessment testing',
      status: 'active',
      sampleCount: 12,
      pendingTests: 3,
      alerts: 1,
      compliance: 100,
      lastActivity: new Date(Date.now() - 15 * 60 * 1000),
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      features: ['Threat Assessment', 'Rapid Screening', 'Confirmatory Testing', 'Emergency Response'],
      workflows: [
        {
          id: 'w6',
          name: 'Threat Assessment Protocol',
          description: 'Rapid screening for biological threats',
          status: 'active',
          steps: 15,
          avgDuration: 6.0,
          priority: 'high'
        }
      ]
    },
    {
      id: 'surveillance',
      name: 'Public Health Surveillance',
      type: 'surveillance',
      description: 'Population health monitoring and disease surveillance',
      status: 'active',
      sampleCount: 234,
      pendingTests: 18,
      alerts: 3,
      compliance: 97,
      lastActivity: new Date(Date.now() - 20 * 60 * 1000),
      icon: Activity,
      color: 'from-purple-500 to-pink-500',
      features: ['Disease Monitoring', 'Trend Analysis', 'Outbreak Detection', 'Population Health'],
      workflows: [
        {
          id: 'w7',
          name: 'Disease Surveillance',
          description: 'Population health monitoring and trend analysis',
          status: 'active',
          steps: 20,
          avgDuration: 8.0,
          priority: 'medium'
        },
        {
          id: 'w8',
          name: 'Outbreak Response',
          description: 'Rapid response to disease outbreaks',
          status: 'active',
          steps: 12,
          avgDuration: 4.0,
          priority: 'high'
        }
      ]
    }
  ]);

  const [quickActions, setQuickActions] = useState<QuickAction[]>([
    {
      id: 'qa1',
      name: 'New Sample',
      description: 'Register a new sample for testing',
      icon: Plus,
      action: 'new-sample'
    },
    {
      id: 'qa2',
      name: 'Start Workflow',
      description: 'Begin a testing workflow',
      icon: Play,
      action: 'start-workflow'
    },
    {
      id: 'qa3',
      name: 'View Reports',
      description: 'Access laboratory reports',
      icon: FileText,
      action: 'view-reports'
    },
    {
      id: 'qa4',
      name: 'AI Analysis',
      description: 'Get AI-powered insights',
      icon: Brain,
      action: 'ai-analysis'
    },
    {
      id: 'qa5',
      name: 'Compliance Check',
      description: 'Review compliance status',
      icon: Shield,
      action: 'compliance-check'
    },
    {
      id: 'qa6',
      name: 'Integration Status',
      description: 'Check system integrations',
      icon: Globe,
      action: 'integration-status'
    }
  ]);

  const filteredModules = labModules
    .filter(module => {
      const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          module.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || module.type === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'activity':
          comparison = a.lastActivity.getTime() - b.lastActivity.getTime();
          break;
        case 'alerts':
          comparison = a.alerts - b.alerts;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    // Navigate to module-specific dashboard
    console.log(`Navigating to module: ${moduleId}`);
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // Implement quick action logic
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const selectedModuleData = selectedModule 
    ? labModules.find(m => m.id === selectedModule) 
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratory Modules</h1>
          <p className="text-gray-600">Navigate and manage laboratory testing modules</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Module
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search modules..."
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
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
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
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="activity">Activity</option>
                  <option value="name">Name</option>
                  <option value="alerts">Alerts</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <motion.div
                key={action.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <action.icon className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.name}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Module Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModules.map((module) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => handleModuleSelect(module.id)}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(module.status)}>
                      {module.status}
                    </Badge>
                    {module.alerts > 0 && (
                      <Badge variant="destructive">
                        {module.alerts}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{module.sampleCount}</p>
                    <p className="text-xs text-gray-600">Samples</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{module.pendingTests}</p>
                    <p className="text-xs text-gray-600">Pending</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{module.compliance}%</p>
                    <p className="text-xs text-gray-600">Compliance</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {module.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {module.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{module.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Workflows */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Active Workflows</h4>
                  <div className="space-y-2">
                    {module.workflows.slice(0, 2).map((workflow) => (
                      <div key={workflow.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{workflow.name}</p>
                          <p className="text-xs text-gray-600">{workflow.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(workflow.priority)}>
                            {workflow.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {workflow.avgDuration}h
                          </span>
                        </div>
                      </div>
                    ))}
                    {module.workflows.length > 2 && (
                      <div className="text-center">
                        <Button variant="ghost" size="sm">
                          View {module.workflows.length - 2} more workflows
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Last Activity */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last activity: {module.lastActivity.toLocaleTimeString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected Module Details */}
      {selectedModuleData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <selectedModuleData.icon className="w-5 h-5" />
                {selectedModuleData.name} - Module Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Module Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedModuleData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedModuleData.status)}>
                        {selectedModuleData.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compliance:</span>
                      <span className="font-medium">{selectedModuleData.compliance}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Workflows:</span>
                      <span className="font-medium">{selectedModuleData.workflows.length}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full justify-start">
                      <Play className="w-4 h-4 mr-2" />
                      Start New Test
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      View Reports
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure Module
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Analysis
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
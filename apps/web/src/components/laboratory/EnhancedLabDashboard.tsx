'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FlaskConical, 
  Beaker, 
  TestTube, 
  Microscope, 
  Brain, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Activity, 
  Database, 
  Zap, 
  Users, 
  FileText,
  Target,
  Globe,
  BarChart3,
  Settings,
  Plus,
  Eye,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  TrendingDown,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LabModule {
  id: string;
  name: string;
  type: 'clinical' | 'water' | 'dairy' | 'bioterrorism' | 'surveillance';
  status: 'active' | 'inactive' | 'maintenance';
  sampleCount: number;
  pendingTests: number;
  completedToday: number;
  alerts: number;
  compliance: number;
  icon: React.ComponentType<any>;
  color: string;
  aiInsights?: string[];
  predictiveAlerts?: string[];
  efficiencyScore?: number;
  automationLevel?: number;
}

interface LabMetric {
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target: number;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'ai' | 'predictive';
  title: string;
  description: string;
  module: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  aiGenerated?: boolean;
  confidence?: number;
  recommendedAction?: string;
}

export default function EnhancedLabDashboard() {
  const [activeModule, setActiveModule] = useState<string>('all');
  const [labModules, setLabModules] = useState<LabModule[]>([
    {
      id: 'dairy',
      name: 'Dairy Quality Control',
      type: 'dairy',
      status: 'active',
      sampleCount: 156,
      pendingTests: 12,
      completedToday: 89,
      alerts: 2,
      compliance: 99,
      icon: FlaskConical,
      color: 'from-green-500 to-emerald-500',
      aiInsights: [
        'Dairy quality compliance at 99.2% - highest in 6 months',
        'AI optimization reduced testing time by 25%',
        'Predictive maintenance prevented 2 equipment failures'
      ],
      predictiveAlerts: [
        'Seasonal increase in dairy samples expected next month',
        'New testing protocol compliance at 100%'
      ],
      efficiencyScore: 94,
      automationLevel: 95
    },
    {
      id: 'bioterrorism',
      name: 'Bioterrorism Response',
      type: 'bioterrorism',
      status: 'active',
      sampleCount: 12,
      pendingTests: 3,
      completedToday: 5,
      alerts: 1,
      compliance: 100,
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      aiInsights: [
        'Response time improved by 60% with AI-assisted protocols',
        'Real-time threat assessment accuracy at 98.5%',
        'Automated reporting to CDC reduced manual errors by 90%'
      ],
      predictiveAlerts: [
        'Enhanced surveillance recommended for high-risk areas',
        'Equipment readiness at optimal levels'
      ],
      efficiencyScore: 96,
      automationLevel: 98
    },
    {
      id: 'surveillance',
      name: 'Public Health Surveillance',
      type: 'surveillance',
      status: 'active',
      sampleCount: 234,
      pendingTests: 18,
      completedToday: 156,
      alerts: 3,
      compliance: 97,
      icon: Activity,
      color: 'from-purple-500 to-pink-500',
      aiInsights: [
        'AI detected 3 emerging disease patterns this week',
        'Automated contact tracing reduced investigation time by 70%',
        'Predictive modeling accuracy improved to 94%'
      ],
      predictiveAlerts: [
        'Potential outbreak indicators detected in 2 counties',
        'Surveillance system optimization recommended'
      ],
      efficiencyScore: 89,
      automationLevel: 93
    }
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch real laboratory modules from API
  useEffect(() => {
    const fetchLabModules = async () => {
      try {
        const response = await fetch('/api/laboratory/modules');
        if (response.ok) {
          const data = await response.json();
          setLabModules(data.data || []);
        } else {
          // Fallback to West Nile virus specific modules if API fails
          setLabModules([
            {
              id: 'west-nile-virus',
              name: 'West Nile Virus Surveillance',
              type: 'surveillance',
              status: 'active',
              sampleCount: 0,
              pendingTests: 0,
              completedToday: 0,
              alerts: 0,
              compliance: 100,
              icon: TestTube,
              color: 'from-red-500 to-orange-500',
              aiInsights: [],
              predictiveAlerts: [],
              efficiencyScore: 95,
              automationLevel: 88
            },
            {
              id: 'clinical',
              name: 'Clinical Diagnostics',
              type: 'clinical',
              status: 'active',
              sampleCount: 0,
              pendingTests: 0,
              completedToday: 0,
              alerts: 0,
              compliance: 98,
              icon: TestTube,
              color: 'from-blue-500 to-cyan-500',
              aiInsights: [],
              predictiveAlerts: [],
              efficiencyScore: 87,
              automationLevel: 92
            },
            {
              id: 'water',
              name: 'Water Testing',
              type: 'water',
              status: 'active',
              sampleCount: 0,
              pendingTests: 0,
              completedToday: 0,
              alerts: 0,
              compliance: 95,
              icon: Beaker,
              color: 'from-cyan-500 to-blue-500',
              aiInsights: [],
              predictiveAlerts: [],
              efficiencyScore: 91,
              automationLevel: 88
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching lab modules:', error);
        // Set empty array on error
        setLabModules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLabModules();
  }, []);

  // Fetch real module data when activeModule changes
  useEffect(() => {
    if (activeModule && activeModule !== 'all') {
      fetchModuleData(activeModule);
    }
  }, [activeModule]);

  const fetchModuleData = async (moduleId: string) => {
    try {
      const response = await fetch(`/api/laboratory/modules/${moduleId}/stats`);
      if (response.ok) {
        const data = await response.json();
        // Update the specific module with real data
        setLabModules(prev => prev.map(module => 
          module.id === moduleId ? { ...module, ...data.data } : module
        ));
      }
    } catch (error) {
      console.error(`Error fetching data for module ${moduleId}:`, error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter modules based on activeModule
  const filteredModules = activeModule === 'all' ? labModules : labModules.filter(module => module.id === activeModule);

  // Get current active modules to display
  const currentModules = filteredModules;

  const [metrics, setMetrics] = useState<LabMetric[]>([
    { name: 'Total Samples', value: 558, unit: '', change: 12, trend: 'up', target: 600 },
    { name: 'Tests Completed', value: 327, unit: 'today', change: 8, trend: 'up', target: 350 },
    { name: 'Average Turnaround', value: 4.2, unit: 'hours', change: -0.5, trend: 'up', target: 4.0 },
    { name: 'Compliance Rate', value: 97.8, unit: '%', change: 0.3, trend: 'up', target: 95.0 },
    { name: 'Critical Alerts', value: 7, unit: '', change: -2, trend: 'down', target: 0 },
    { name: 'AI Insights', value: 23, unit: 'generated', change: 5, trend: 'up', target: 20 }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'Critical Sample Overdue',
      description: 'Sample #WT-2024-001 has exceeded 24-hour processing time',
      module: 'water',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: 'high'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Calibration Due',
      description: 'Microscope #MS-001 requires calibration within 48 hours',
      module: 'clinical',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      priority: 'medium'
    },
    {
      id: '3',
      type: 'ai',
      title: 'AI Pattern Detected',
      description: 'Unusual testing pattern detected in dairy samples - review recommended',
      module: 'dairy',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      priority: 'low',
      aiGenerated: true,
      confidence: 87,
      recommendedAction: 'Review sample collection protocols'
    },
    {
      id: '4',
      type: 'predictive',
      title: 'Predictive Alert: Equipment Maintenance',
      description: 'AI predicts equipment failure in 72 hours based on usage patterns',
      module: 'clinical',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      priority: 'medium',
      aiGenerated: true,
      confidence: 94,
      recommendedAction: 'Schedule preventive maintenance'
    },
    {
      id: '5',
      type: 'ai',
      title: 'Efficiency Optimization Opportunity',
      description: 'AI suggests 15% efficiency improvement in water testing workflow',
      module: 'water',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      priority: 'low',
      aiGenerated: true,
      confidence: 92,
      recommendedAction: 'Implement suggested workflow changes'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleModuleAction = (moduleId: string, action: string) => {
    console.log(`Action ${action} for module ${moduleId}`);
    // Implement module-specific actions
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertCircle;
      case 'info': return Eye;
      case 'ai': return Sparkles;
      case 'predictive': return Brain;
      default: return AlertCircle;
    }
  };

  const totalSamples = labModules.reduce((sum, module) => sum + module.sampleCount, 0);
  const totalPending = labModules.reduce((sum, module) => sum + module.pendingTests, 0);
  const totalCompleted = labModules.reduce((sum, module) => sum + module.completedToday, 0);
  const totalAlerts = labModules.reduce((sum, module) => sum + module.alerts, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratory Dashboard</h1>
          <p className="text-gray-600">Real-time overview of laboratory operations and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Sample
          </Button>
        </div>
      </div>

      {/* Module Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Laboratory Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button
              variant={activeModule === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveModule('all')}
            >
              All Modules
            </Button>
            {labModules.map((module) => (
              <Button
                key={module.id}
                variant={activeModule === module.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveModule(module.id)}
                className="flex items-center gap-2"
              >
                <module.icon className="w-4 h-4" />
                {module.name}
                {module.alerts > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {module.alerts}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

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
              <span className="text-sm text-green-600">+12% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tests</p>
                <p className="text-2xl font-bold text-gray-900">{totalPending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-600">3 require attention</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{totalCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">+8% from yesterday</span>
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
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">1 critical alert</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center`}>
                      <module.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={module.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {module.status}
                        </Badge>
                        {module.alerts > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {module.alerts} alerts
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleModuleAction(module.id, 'view')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleModuleAction(module.id, 'settings')}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <p className="text-2xl font-bold text-gray-900">{module.completedToday}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Compliance</span>
                    <span className="font-medium">{module.compliance}%</span>
                  </div>
                  <Progress value={module.compliance} className="h-2" />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Play className="w-4 h-4 mr-1" />
                    Start Test
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-1" />
                    Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start gap-4 p-4 border rounded-lg ${
                    alert.aiGenerated ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    alert.type === 'critical' ? 'bg-red-100' : 
                    alert.type === 'warning' ? 'bg-yellow-100' : 
                    alert.type === 'ai' ? 'bg-purple-100' :
                    alert.type === 'predictive' ? 'bg-indigo-100' : 'bg-blue-100'
                  }`}>
                    <AlertIcon className={`w-5 h-5 ${
                      alert.type === 'critical' ? 'text-red-600' : 
                      alert.type === 'warning' ? 'text-yellow-600' : 
                      alert.type === 'ai' ? 'text-purple-600' :
                      alert.type === 'predictive' ? 'text-indigo-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                      {alert.aiGenerated && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          AI Generated
                        </Badge>
                      )}
                      {alert.confidence && (
                        <Badge variant="outline" className="text-xs">
                          {alert.confidence}% confidence
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                    {alert.recommendedAction && (
                      <div className="mb-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                        <p className="text-xs font-medium text-blue-800">Recommended Action:</p>
                        <p className="text-xs text-blue-700">{alert.recommendedAction}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{alert.module}</span>
                      <span>{alert.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-medium">Performance Trend</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Sample processing efficiency has improved by 15% this week compared to last week.
              </p>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium">Quality Alert</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Unusual pattern detected in water testing results. Recommend review of sampling procedures.
              </p>
              <Button size="sm" variant="outline">
                Investigate
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium">Optimization</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                AI suggests reordering test sequence could reduce turnaround time by 20%.
              </p>
              <Button size="sm" variant="outline">
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
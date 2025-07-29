'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  RefreshCw,
  Shield,
  Target,
  Zap,
  BarChart3,
  FileText,
  Users,
  Settings,
  AlertCircle,
  CheckSquare,
  Clock3,
  CalendarDays,
  Gauge,
  Activity
} from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';

interface ComplianceMetric {
  id: string;
  title: string;
  value: number;
  target: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: {
    gradient: string;
    text: string;
    bg: string;
  };
  description: string;
}

interface CalibrationItem {
  id: string;
  equipmentName: string;
  dueDate: string;
  status: 'overdue' | 'due_soon' | 'scheduled' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
}

export function ComplianceStatusOverview() {
  const { equipment, calibrations } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Calculate real compliance metrics
  const calculateComplianceMetrics = () => {
    if (!equipment || !calibrations) return;

    const totalEquipment = equipment.length;
    const operationalEquipment = equipment.filter(eq => eq.status === 'operational').length;
    const overdueCalibrations = calibrations.filter(cal => cal.status === 'overdue').length;
    const completedCalibrations = calibrations.filter(cal => cal.status === 'completed').length;
    const totalCalibrations = calibrations.length;

    const uptime = totalEquipment > 0 ? (operationalEquipment / totalEquipment) * 100 : 94.2;
    const calibrationCompliance = totalCalibrations > 0 ? (completedCalibrations / totalCalibrations) * 100 : 98.5;
    const overallCompliance = ((uptime + calibrationCompliance) / 2);

    return {
      overallCompliance: Math.round(overallCompliance * 10) / 10,
      uptime: Math.round(uptime * 10) / 10,
      calibrationCompliance: Math.round(calibrationCompliance * 10) / 10,
      overdueCalibrations
    };
  };

  const metrics = calculateComplianceMetrics();

  const complianceMetrics: ComplianceMetric[] = [
    {
      id: '1',
      title: 'Overall Compliance',
      value: metrics?.overallCompliance || 99.9,
      target: 100,
      unit: '%',
      status: 'excellent',
      trend: 'up',
      change: 0.2,
      icon: Shield,
      color: {
        gradient: "from-emerald-500/20 to-emerald-600/20",
        text: "text-emerald-400",
        bg: "bg-emerald-500/10"
      },
      description: 'Laboratory compliance score'
    },
    {
      id: '2',
      title: 'Equipment Uptime',
      value: metrics?.uptime || 94.2,
      target: 95,
      unit: '%',
      status: 'good',
      trend: 'up',
      change: 1.5,
      icon: Target,
      color: {
        gradient: "from-blue-500/20 to-blue-600/20",
        text: "text-blue-400",
        bg: "bg-blue-500/10"
      },
      description: 'Operational equipment percentage'
    },
    {
      id: '3',
      title: 'Calibration Compliance',
      value: metrics?.calibrationCompliance || 98.5,
      target: 100,
      unit: '%',
      status: 'good',
      trend: 'stable',
      change: 0.0,
      icon: Calendar,
      color: {
        gradient: "from-purple-500/20 to-purple-600/20",
        text: "text-purple-400",
        bg: "bg-purple-500/10"
      },
      description: 'On-time calibration rate'
    },
    {
      id: '4',
      title: 'Safety Score',
      value: 96.8,
      target: 100,
      unit: '%',
      status: 'good',
      trend: 'up',
      change: 0.8,
      icon: CheckCircle,
      color: {
        gradient: "from-amber-500/20 to-amber-600/20",
        text: "text-amber-400",
        bg: "bg-amber-500/10"
      },
      description: 'Safety protocol compliance'
    }
  ];

  const overdueCalibrations: CalibrationItem[] = [
    {
      id: '1',
      equipmentName: 'pH Meter',
      dueDate: '2024-01-15',
      status: 'overdue',
      priority: 'high',
      assignedTo: 'Mike Chen'
    },
    {
      id: '2',
      equipmentName: 'Spectrophotometer',
      dueDate: '2024-01-20',
      status: 'due_soon',
      priority: 'medium',
      assignedTo: 'Dr. Sarah Johnson'
    },
    {
      id: '3',
      equipmentName: 'Analytical Balance',
      dueDate: '2024-01-25',
      status: 'scheduled',
      priority: 'low',
      assignedTo: 'Dr. Sarah Johnson'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'good':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <BarChart3 className="h-4 w-4 text-slate-400" />;
    }
  };

  const getCalibrationStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'due_soon':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'scheduled':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'completed':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-amber-400';
      case 'low':
        return 'text-emerald-400';
      default:
        return 'text-slate-400';
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    // Export compliance report to PDF/CSV
    const exportData = {
      complianceMetrics: metrics,
      overdueCalibrations,
      exportDate: new Date().toISOString(),
      laboratory: 'Advanced Research Laboratory',
      reportType: 'compliance-status'
    };
    
    // Create downloadable file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compliance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Compliance Status
          </h2>
          <p className="text-slate-300 mt-1">Real-time compliance monitoring and alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Compliance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="group cursor-pointer">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color.gradient}`}>
                    <Icon className="h-6 w-6 text-slate-200" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm font-medium ${
                      metric.change > 0 ? 'text-emerald-400' : 
                      metric.change < 0 ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-300">
                    {metric.title}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className={`text-3xl md:text-4xl font-bold ${metric.color.text}`}>
                      {metric.value}{metric.unit}
                    </p>
                    <Badge className={`text-xs ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Target: {metric.target}{metric.unit}
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-medium text-slate-200">{Math.round((metric.value / metric.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        (metric.value / metric.target) >= 1 
                          ? 'bg-emerald-500' 
                          : (metric.value / metric.target) >= 0.8 
                          ? 'bg-amber-500' 
                          : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min((metric.value / metric.target) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overdue Calibrations */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-50">Overdue Calibrations</h3>
              <p className="text-sm text-slate-400">Equipment requiring immediate attention</p>
            </div>
          </div>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/20">
            {overdueCalibrations.filter(cal => cal.status === 'overdue').length} Overdue
          </Badge>
        </div>

        <div className="space-y-4">
          {overdueCalibrations.map((calibration) => (
            <div key={calibration.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${getCalibrationStatusColor(calibration.status)}`}>
                  {calibration.status === 'overdue' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : calibration.status === 'due_soon' ? (
                    <Clock3 className="h-4 w-4" />
                  ) : (
                    <CalendarDays className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-200">{calibration.equipmentName}</p>
                  <p className="text-sm text-slate-400">Due: {calibration.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={`text-xs ${getPriorityColor(calibration.priority)}`}>
                  {calibration.priority} priority
                </Badge>
                <span className="text-sm text-slate-400">{calibration.assignedTo}</span>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300"
                >
                  Schedule
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="bg-slate-800/50 border border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Calibrations
        </Button>
        <Button className="bg-slate-800/50 border border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        <Button className="bg-slate-800/50 border border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
          <Settings className="h-4 w-4 mr-2" />
          Configure Alerts
        </Button>
      </div>
    </div>
  );
}
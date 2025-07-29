"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDashboardStore } from '@/stores/dashboardStore';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Bot, 
  Clock, 
  Target,
  BarChart3,
  Calendar,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Download,
  Eye,
  Sparkles,
  Brain,
  Shield,
  Activity,
  Gauge,
  Timer,
  DollarSign
} from 'lucide-react';

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: {
    gradient: string;
    text: string;
    bg: string;
  };
  description: string;
  trend: number[];
  period: string;
  unit?: string;
  target?: number;
  status?: 'good' | 'warning' | 'critical';
}

interface PerformanceData {
  teamProductivity: number;
  aiQueries: number;
  timeSaved: number;
  accuracyRate: number;
  equipmentUptime: number;
  complianceScore: number;
  responseTime: number;
  userSatisfaction: number;
}

export function PerformanceMetrics() {
  const { equipment, calibrations, aiInsights } = useDashboardStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    teamProductivity: 88,
    aiQueries: 156,
    timeSaved: 12.5,
    accuracyRate: 96,
    equipmentUptime: 94.2,
    complianceScore: 98.5,
    responseTime: 180,
    userSatisfaction: 4.8
  });

  // Calculate metrics based on real data
  useEffect(() => {
    const calculateMetrics = () => {
      if (!equipment || !calibrations || !aiInsights) return;

      // Calculate team productivity based on completed calibrations
      const completedCalibrations = calibrations.filter(cal => cal.status === 'completed').length;
      const totalCalibrations = calibrations.length;
      const productivity = totalCalibrations > 0 ? (completedCalibrations / totalCalibrations) * 100 : 88;

      // Calculate equipment uptime
      const operationalEquipment = equipment.filter(eq => eq.status === 'operational').length;
      const totalEquipment = equipment.length;
      const uptime = totalEquipment > 0 ? (operationalEquipment / totalEquipment) * 100 : 94.2;

      // Calculate compliance score
      const compliantEquipment = equipment.filter(eq => eq.lastCalibration && 
        new Date(eq.lastCalibration).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000).length;
      const complianceScore = totalEquipment > 0 ? (compliantEquipment / totalEquipment) * 100 : 98.5;

      setPerformanceData(prev => ({
        ...prev,
        teamProductivity: Math.round(productivity),
        equipmentUptime: Math.round(uptime * 10) / 10,
        complianceScore: Math.round(complianceScore * 10) / 10
      }));
    };

    calculateMetrics();
  }, [equipment, calibrations, aiInsights]);

  const metrics: MetricCard[] = [
    {
      id: 'productivity',
      title: 'Team Productivity',
      value: `${performanceData.teamProductivity}%`,
      change: 12,
      changeType: 'increase',
      icon: Users,
      color: {
        gradient: "from-emerald-500/20 to-emerald-600/20",
        text: "text-emerald-400",
        bg: "bg-emerald-500/10"
      },
      description: 'Percentage of tasks completed on time',
      trend: [75, 78, 82, 79, 85, 88, 88],
      period: 'vs last period',
      target: 90,
      status: performanceData.teamProductivity >= 85 ? 'good' : performanceData.teamProductivity >= 75 ? 'warning' : 'critical'
    },
    {
      id: 'ai-queries',
      title: 'AI Queries',
      value: performanceData.aiQueries,
      change: 23,
      changeType: 'increase',
      icon: Brain,
      color: {
        gradient: "from-blue-500/20 to-blue-600/20",
        text: "text-blue-400",
        bg: "bg-blue-500/10"
      },
      description: 'Total AI assistant interactions',
      trend: [120, 135, 142, 138, 150, 156, 156],
      period: 'vs last period',
      unit: 'queries'
    },
    {
      id: 'time-saved',
      title: 'Time Saved',
      value: `${performanceData.timeSaved}h`,
      change: 8.5,
      changeType: 'increase',
      icon: Clock,
      color: {
        gradient: "from-purple-500/20 to-purple-600/20",
        text: "text-purple-400",
        bg: "bg-purple-500/10"
      },
      description: 'Hours saved through automation',
      trend: [8.2, 9.1, 10.3, 11.2, 12.1, 12.5, 12.5],
      period: 'vs last period',
      unit: 'hours'
    },
    {
      id: 'accuracy',
      title: 'Accuracy Rate',
      value: `${performanceData.accuracyRate}%`,
      change: 2.1,
      changeType: 'increase',
      icon: Target,
      color: {
        gradient: "from-amber-500/20 to-amber-600/20",
        text: "text-amber-400",
        bg: "bg-amber-500/10"
      },
      description: 'AI prediction accuracy',
      trend: [93.2, 94.1, 94.8, 95.2, 95.7, 96.0, 96.0],
      period: 'vs last period',
      target: 95,
      status: performanceData.accuracyRate >= 95 ? 'good' : performanceData.accuracyRate >= 90 ? 'warning' : 'critical'
    },
    {
      id: 'uptime',
      title: 'Equipment Uptime',
      value: `${performanceData.equipmentUptime}%`,
      change: 1.8,
      changeType: 'increase',
      icon: CheckCircle,
      color: {
        gradient: "from-emerald-500/20 to-emerald-600/20",
        text: "text-emerald-400",
        bg: "bg-emerald-500/10"
      },
      description: 'Equipment operational time',
      trend: [92.1, 92.8, 93.2, 93.7, 94.0, 94.2, 94.2],
      period: 'vs last period',
      target: 95,
      status: performanceData.equipmentUptime >= 95 ? 'good' : performanceData.equipmentUptime >= 90 ? 'warning' : 'critical'
    },
    {
      id: 'compliance',
      title: 'Compliance Score',
      value: `${performanceData.complianceScore}%`,
      change: 0.5,
      changeType: 'increase',
      icon: Shield,
      color: {
        gradient: "from-indigo-500/20 to-indigo-600/20",
        text: "text-indigo-400",
        bg: "bg-indigo-500/10"
      },
      description: 'Regulatory compliance rate',
      trend: [97.8, 98.0, 98.2, 98.3, 98.4, 98.5, 98.5],
      period: 'vs last period',
      target: 98,
      status: performanceData.complianceScore >= 98 ? 'good' : performanceData.complianceScore >= 95 ? 'warning' : 'critical'
    }
  ];

  const getStatusIcon = (status?: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getChangeIcon = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <BarChart3 className="h-4 w-4 text-slate-400" />;
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    // Export performance data to CSV/PDF
    const exportData = {
      metrics: performanceData,
      timeRange,
      exportDate: new Date().toISOString(),
      laboratory: 'Advanced Research Laboratory'
    };
    
    // Create downloadable file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-metrics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
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
            Performance Metrics
          </h2>
          <p className="text-slate-300 mt-1">Real-time insights into your laboratory performance</p>
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
            Export
          </Button>
        </div>
      </div>
      
      {/* Metrics Grid - Matching Landing Page Style */}
      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Tooltip key={metric.id}>
                <TooltipTrigger asChild>
                  <div className="group cursor-pointer">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color.gradient}`}>
                          <Icon className="h-6 w-6 text-slate-200" />
                        </div>
                        <div className="flex items-center space-x-2">
                          {getChangeIcon(metric.changeType)}
                          <span className={`text-sm font-medium ${
                            metric.changeType === 'increase' ? 'text-emerald-400' : 
                            metric.changeType === 'decrease' ? 'text-red-400' : 'text-slate-400'
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
                            {metric.value}
                          </p>
                          {getStatusIcon(metric.status)}
                        </div>
                        <p className="text-xs text-slate-400">
                          {metric.period}
                        </p>
                      </div>
                      
                      {metric.target && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-slate-400">Target</span>
                            <span className="font-medium text-slate-200">{metric.target}%</span>
                          </div>
                          <div className="w-full bg-slate-700/50 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                (Number(metric.value.toString().replace('%', '')) / metric.target) >= 1 
                                  ? 'bg-emerald-500' 
                                  : (Number(metric.value.toString().replace('%', '')) / metric.target) >= 0.8 
                                  ? 'bg-amber-500' 
                                  : 'bg-red-500'
                              }`}
                              style={{ 
                                width: `${Math.min((Number(metric.value.toString().replace('%', '')) / metric.target) * 100, 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs bg-slate-800 border border-slate-700 rounded-lg shadow-xl">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-200">{metric.title}</p>
                    <p className="text-sm text-slate-300">
                      {metric.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Current: {metric.value}</span>
                      {metric.target && <span className="text-slate-400">Target: {metric.target}%</span>}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Change: {metric.change > 0 ? '+' : ''}{metric.change}%</span>
                      <span className="text-slate-400">Period: {timeRange}</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
      
      {/* Additional Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Response Time</p>
                <p className="text-xs text-slate-400">Average API response</p>
              </div>
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {performanceData.responseTime}ms
          </p>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">User Satisfaction</p>
                <p className="text-xs text-slate-400">Average rating</p>
              </div>
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400">
            {performanceData.userSatisfaction}/5
          </p>
        </div>
      </div>
      
      {/* Time Range Selector */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700/50">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-400">Time Range:</span>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`h-8 text-xs ${
                  timeRange === range 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50'
                } transition-all duration-300`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {/* Navigate to detailed analytics */}}
          className="h-8 bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 transition-all duration-300"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </div>
    </div>
  );
}
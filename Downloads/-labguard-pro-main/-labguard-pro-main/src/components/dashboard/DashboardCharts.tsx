'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye,
  Download,
  RefreshCw,
  Target,
  Zap,
  FileText,
  Users,
  MapPin,
  Activity,
  Thermometer,
  Gauge,
  Battery,
  Wifi,
  Signal,
  Plus,
  Edit,
  Trash2,
  Shield,
  Bell,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Settings,
  Calendar,
  BarChart,
  LineChart,
  PieChart,
  Brain
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  target?: number;
  previous?: number;
  change?: number;
}

interface ComplianceData {
  month: string;
  compliance: number;
  target: number;
  trend: number;
}

interface EquipmentPerformanceData {
  equipment: string;
  uptime: number;
  efficiency: number;
  health: number;
  alerts: number;
}

interface CalibrationData {
  month: string;
  completed: number;
  scheduled: number;
  overdue: number;
  total: number;
}

interface AIUsageData {
  category: string;
  usage: number;
  accuracy: number;
  timeSaved: number;
}

export function DashboardCharts() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedChart, setSelectedChart] = useState<'compliance' | 'equipment' | 'calibration' | 'ai'>('compliance');

  const complianceData: ComplianceData[] = [
    { month: 'Jan', compliance: 98.5, target: 100, trend: 2.1 },
    { month: 'Feb', compliance: 99.1, target: 100, trend: 1.8 },
    { month: 'Mar', compliance: 99.7, target: 100, trend: 1.2 },
    { month: 'Apr', compliance: 99.9, target: 100, trend: 0.8 },
    { month: 'May', compliance: 99.8, target: 100, trend: 1.1 },
    { month: 'Jun', compliance: 99.9, target: 100, trend: 0.5 },
    { month: 'Jul', compliance: 99.9, target: 100, trend: 0.3 },
    { month: 'Aug', compliance: 99.9, target: 100, trend: 0.2 },
    { month: 'Sep', compliance: 99.9, target: 100, trend: 0.1 },
    { month: 'Oct', compliance: 99.9, target: 100, trend: 0.0 },
    { month: 'Nov', compliance: 99.9, target: 100, trend: 0.0 },
    { month: 'Dec', compliance: 99.9, target: 100, trend: 0.0 }
  ];

  const equipmentPerformanceData: EquipmentPerformanceData[] = [
    { equipment: 'Centrifuge CF-16', uptime: 98.5, efficiency: 92.3, health: 95, alerts: 0 },
    { equipment: 'Balance PB-220', uptime: 85.2, efficiency: 88.7, health: 78, alerts: 2 },
    { equipment: 'Incubator IC-200', uptime: 62.1, efficiency: 58.9, health: 45, alerts: 5 },
    { equipment: 'pH Meter PH-100', uptime: 94.8, efficiency: 91.2, health: 88, alerts: 1 },
    { equipment: 'Microscope MS-500', uptime: 96.3, efficiency: 94.1, health: 92, alerts: 0 },
    { equipment: 'Autoclave AC-150', uptime: 0, efficiency: 0, health: 23, alerts: 8 }
  ];

  const calibrationData: CalibrationData[] = [
    { month: 'Jan', completed: 12, scheduled: 8, overdue: 2, total: 22 },
    { month: 'Feb', completed: 15, scheduled: 6, overdue: 1, total: 22 },
    { month: 'Mar', completed: 18, scheduled: 4, overdue: 0, total: 22 },
    { month: 'Apr', completed: 20, scheduled: 2, overdue: 0, total: 22 },
    { month: 'May', completed: 22, scheduled: 0, overdue: 0, total: 22 },
    { month: 'Jun', completed: 25, scheduled: 0, overdue: 0, total: 25 }
  ];

  const aiUsageData: AIUsageData[] = [
    { category: 'Equipment Optimization', usage: 45, accuracy: 94.2, timeSaved: 156.5 },
    { category: 'Predictive Maintenance', usage: 28, accuracy: 87.6, timeSaved: 89.3 },
    { category: 'Protocol Analysis', usage: 32, accuracy: 91.8, timeSaved: 112.7 },
    { category: 'Compliance Monitoring', usage: 38, accuracy: 96.4, timeSaved: 67.2 },
    { category: 'Resource Allocation', usage: 22, accuracy: 89.3, timeSaved: 45.8 }
  ];

  const chartColors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  };

  const getChartData = () => {
    switch (selectedChart) {
      case 'compliance':
        return complianceData;
      case 'equipment':
        return equipmentPerformanceData;
      case 'calibration':
        return calibrationData;
      case 'ai':
        return aiUsageData;
      default:
        return complianceData;
    }
  };

  const renderComplianceChart = () => (
          <ResponsiveContainer width="100%" height={300}>
      <LineChart data={complianceData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
          dataKey="month" 
          stroke="#cbd5e1"
                fontSize={12}
              />
              <YAxis 
          stroke="#cbd5e1"
                fontSize={12}
          domain={[95, 100]}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#f8fafc'
          }}
        />
        <Legend />
              <Line 
                type="monotone" 
                dataKey="compliance" 
          stroke={chartColors.primary} 
                strokeWidth={3}
          dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: chartColors.primary, strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
          stroke={chartColors.success} 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );

  const renderEquipmentChart = () => (
          <ResponsiveContainer width="100%" height={300}>
      <BarChart data={equipmentPerformanceData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
          dataKey="equipment" 
          stroke="#cbd5e1"
          fontSize={10}
          angle={-45}
          textAnchor="end"
          height={80}
              />
              <YAxis 
          stroke="#cbd5e1"
                fontSize={12}
          domain={[0, 100]}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#f8fafc'
          }}
        />
        <Legend />
        <Bar dataKey="uptime" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
        <Bar dataKey="efficiency" fill={chartColors.secondary} radius={[4, 4, 0, 0]} />
        <Bar dataKey="health" fill={chartColors.success} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

  const renderCalibrationChart = () => (
          <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={calibrationData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
          dataKey="month" 
          stroke="#cbd5e1"
                fontSize={12}
              />
              <YAxis 
          stroke="#cbd5e1"
                fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#f8fafc'
          }}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="completed" 
          stackId="1"
          stroke={chartColors.success} 
          fill={chartColors.success}
          fillOpacity={0.8}
        />
        <Area 
          type="monotone" 
          dataKey="scheduled" 
          stackId="1"
          stroke={chartColors.info} 
          fill={chartColors.info}
          fillOpacity={0.8}
        />
              <Area 
                type="monotone" 
          dataKey="overdue" 
          stackId="1"
          stroke={chartColors.danger} 
          fill={chartColors.danger}
          fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

  const renderAIChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={aiUsageData}>
        <PolarGrid stroke="#334155" />
        <PolarAngleAxis 
          dataKey="category" 
          stroke="#cbd5e1"
          fontSize={10}
        />
        <PolarRadiusAxis 
          stroke="#cbd5e1"
          fontSize={10}
          domain={[0, 100]}
        />
        <Radar 
          name="Usage %" 
          dataKey="usage" 
          stroke={chartColors.primary} 
          fill={chartColors.primary} 
          fillOpacity={0.3} 
        />
        <Radar 
          name="Accuracy %" 
          dataKey="accuracy" 
          stroke={chartColors.secondary} 
          fill={chartColors.secondary} 
          fillOpacity={0.3} 
        />
        <Legend />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#f8fafc'
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (selectedChart) {
      case 'compliance':
        return renderComplianceChart();
      case 'equipment':
        return renderEquipmentChart();
      case 'calibration':
        return renderCalibrationChart();
      case 'ai':
        return renderAIChart();
      default:
        return renderComplianceChart();
    }
  };

  const getChartTitle = () => {
    switch (selectedChart) {
      case 'compliance':
        return 'Compliance Trends';
      case 'equipment':
        return 'Equipment Performance';
      case 'calibration':
        return 'Calibration Overview';
      case 'ai':
        return 'AI Usage Analytics';
      default:
        return 'Compliance Trends';
    }
  };

  const getChartDescription = () => {
    switch (selectedChart) {
      case 'compliance':
        return 'Monthly compliance score tracking and target comparison';
      case 'equipment':
        return 'Equipment uptime, efficiency, and health metrics';
      case 'calibration':
        return 'Calibration completion status and scheduling';
      case 'ai':
        return 'AI usage patterns and accuracy metrics';
      default:
        return 'Monthly compliance score tracking and target comparison';
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    // Export chart data to various formats
    const exportData = {
      charts: {
        equipmentTrends: equipmentPerformanceData,
        calibrationMetrics: calibrationData,
        complianceTrends: complianceData,
        aiInsights: aiUsageData
      },
      exportDate: new Date().toISOString(),
      laboratory: 'Advanced Research Laboratory',
      timeRange: selectedTimeRange,
      format: 'json'
    };
    
    // Create downloadable file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-charts-${selectedTimeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-50">{getChartTitle()}</CardTitle>
            <p className="text-sm text-slate-400">{getChartDescription()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Type Selector */}
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant={selectedChart === 'compliance' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedChart('compliance')}
            className={selectedChart === 'compliance' ? 'bg-blue-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-200'}
          >
            <Shield className="h-4 w-4 mr-2" />
            Compliance
          </Button>
          <Button
            variant={selectedChart === 'equipment' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedChart('equipment')}
            className={selectedChart === 'equipment' ? 'bg-green-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-200'}
          >
            <Settings className="h-4 w-4 mr-2" />
            Equipment
          </Button>
          <Button
            variant={selectedChart === 'calibration' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedChart('calibration')}
            className={selectedChart === 'calibration' ? 'bg-purple-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-200'}
          >
            <Target className="h-4 w-4 mr-2" />
            Calibration
          </Button>
              <Button
            variant={selectedChart === 'ai' ? 'default' : 'outline'}
                size="sm"
            onClick={() => setSelectedChart('ai')}
            className={selectedChart === 'ai' ? 'bg-orange-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-200'}
              >
            <Brain className="h-4 w-4 mr-2" />
            AI Analytics
              </Button>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-sm text-slate-400">Time Range:</span>
          <Button
            variant={selectedTimeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('7d')}
            className={selectedTimeRange === '7d' ? 'bg-slate-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-200'}
          >
            7D
          </Button>
          <Button
            variant={selectedTimeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('30d')}
            className={selectedTimeRange === '30d' ? 'bg-slate-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-200'}
          >
            30D
          </Button>
          <Button
            variant={selectedTimeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('90d')}
            className={selectedTimeRange === '90d' ? 'bg-slate-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-200'}
          >
            90D
          </Button>
          <Button
            variant={selectedTimeRange === '1y' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('1y')}
            className={selectedTimeRange === '1y' ? 'bg-slate-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-200'}
          >
            1Y
          </Button>
        </div>

        {/* Chart Container */}
        <div className="w-full h-80">
          {renderChart()}
        </div>

        {/* Chart Summary */}
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedChart === 'compliance' && (
              <>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-50">99.9%</p>
                  <p className="text-xs text-slate-400">Current Compliance</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">+0.2%</p>
                  <p className="text-xs text-slate-400">Monthly Growth</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">100%</p>
                  <p className="text-xs text-slate-400">Target</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">12</p>
                  <p className="text-xs text-slate-400">Months Compliant</p>
                </div>
              </>
            )}
            {selectedChart === 'equipment' && (
              <>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-50">89.5%</p>
                  <p className="text-xs text-slate-400">Avg Uptime</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">87.2%</p>
                  <p className="text-xs text-slate-400">Avg Efficiency</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">70.3%</p>
                  <p className="text-xs text-slate-400">Avg Health</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">16</p>
                  <p className="text-xs text-slate-400">Total Alerts</p>
                </div>
              </>
            )}
            {selectedChart === 'calibration' && (
              <>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-50">112</p>
                  <p className="text-xs text-slate-400">Total Calibrations</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">95.5%</p>
                  <p className="text-xs text-slate-400">Completion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">20</p>
                  <p className="text-xs text-slate-400">Scheduled</p>
              </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">3</p>
                  <p className="text-xs text-slate-400">Overdue</p>
          </div>
              </>
            )}
            {selectedChart === 'ai' && (
              <>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-50">165</p>
                  <p className="text-xs text-slate-400">Total Queries</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">91.9%</p>
                  <p className="text-xs text-slate-400">Avg Accuracy</p>
                </div>
          <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">471.5h</p>
                  <p className="text-xs text-slate-400">Time Saved</p>
          </div>
          <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">$28.4k</p>
                  <p className="text-xs text-slate-400">Cost Savings</p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
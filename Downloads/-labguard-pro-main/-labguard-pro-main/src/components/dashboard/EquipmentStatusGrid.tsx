'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Wrench,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  Download,
  RefreshCw,
  Target,
  Zap,
  BarChart3,
  FileText,
  Users,
  MapPin,
  Activity,
  Thermometer,
  Gauge,
  Battery,
  Wifi,
  Signal,
  FlaskConical,
  Microscope,
  TestTube,
  Beaker
} from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'operational' | 'maintenance' | 'offline' | 'calibration_due';
  health: number;
  lastCalibration: string;
  nextCalibration: string;
  assignedTo: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  uptime: number;
  efficiency: number;
  alerts: number;
}

interface EquipmentType {
  type: string;
  count: number;
  operational: number;
  color: {
    gradient: string;
    text: string;
    bg: string;
  };
  icon: React.ComponentType<{ className?: string }>;
}

export function EquipmentStatusGrid() {
  const { equipment } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'operational' | 'maintenance' | 'offline'>('all');

  // Calculate equipment statistics from store data
  const calculateEquipmentStats = () => {
    if (!equipment) return { total: 0, operational: 0, maintenance: 0, offline: 0, calibrationDue: 0 };

    const total = equipment.length;
    const operational = equipment.filter(eq => eq.status === 'operational').length;
    const maintenance = equipment.filter(eq => eq.status === 'maintenance').length;
    const offline = equipment.filter(eq => eq.status === 'inactive').length;
    const calibrationDue = equipment.filter(eq => eq.status === 'calibration_due').length;

    return { total, operational, maintenance, offline, calibrationDue };
  };

  const stats = calculateEquipmentStats();

  const equipmentData: EquipmentItem[] = [
    {
      id: '1',
      name: 'Analytical Balance',
      type: 'Balance',
      location: 'Lab A - Bench 1',
      status: 'operational',
      health: 95,
      lastCalibration: '2024-01-15',
      nextCalibration: '2024-04-15',
      assignedTo: 'Dr. Sarah Johnson',
      temperature: 24.5,
      humidity: 45,
      pressure: 1013,
      uptime: 98.5,
      efficiency: 92.3,
      alerts: 0
    },
    {
      id: '2',
      name: 'pH Meter',
      type: 'pH Meter',
      location: 'Lab B - Bench 3',
      status: 'calibration_due',
      health: 78,
      lastCalibration: '2024-01-01',
      nextCalibration: '2024-02-01',
      assignedTo: 'Mike Chen',
      temperature: 22.8,
      humidity: 42,
      pressure: 1012,
      uptime: 85.2,
      efficiency: 88.7,
      alerts: 2
    },
    {
      id: '3',
      name: 'Spectrophotometer',
      type: 'Spectrophotometer',
      location: 'Lab A - Equipment Room',
      status: 'maintenance',
      health: 62,
      lastCalibration: '2024-01-10',
      nextCalibration: '2024-04-10',
      assignedTo: 'Dr. Sarah Johnson',
      temperature: 23.1,
      humidity: 48,
      pressure: 1014,
      uptime: 72.8,
      efficiency: 75.4,
      alerts: 3
    }
  ];

  const equipmentTypes: EquipmentType[] = [
    {
      type: 'Balance',
      count: 1,
      operational: 1,
      color: {
        gradient: "from-emerald-500/20 to-emerald-600/20",
        text: "text-emerald-400",
        bg: "bg-emerald-500/10"
      },
      icon: Target
    },
    {
      type: 'pH Meter',
      count: 1,
      operational: 0,
      color: {
        gradient: "from-blue-500/20 to-blue-600/20",
        text: "text-blue-400",
        bg: "bg-blue-500/10"
      },
      icon: Thermometer
    },
    {
      type: 'Spectrophotometer',
      count: 1,
      operational: 0,
      color: {
        gradient: "from-purple-500/20 to-purple-600/20",
        text: "text-purple-400",
        bg: "bg-purple-500/10"
      },
      icon: Beaker
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'maintenance':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'offline':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'calibration_due':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-emerald-400';
    if (health >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-amber-400" />;
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'calibration_due':
        return <Clock className="h-4 w-4 text-blue-400" />;
      default:
        return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleAddEquipment = () => {
    // Navigate to equipment management page or open modal
    const equipmentFormData = {
      name: '',
      type: '',
      location: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      assignedTechnician: '',
      notes: ''
    };
    
    // Store form data in session storage for form persistence
    sessionStorage.setItem('newEquipmentForm', JSON.stringify(equipmentFormData));
    
    // Navigate to equipment management page
    window.location.href = '/dashboard/equipment/add';
  };

  const filteredEquipment = equipmentData.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.status === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Equipment Status
          </h2>
          <p className="text-slate-300 mt-1">Real-time equipment monitoring and health tracking</p>
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
            onClick={handleAddEquipment}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </div>

      {/* Equipment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg">
              <Target className="h-6 w-6 text-emerald-400" />
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">
              {stats.operational}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">Operational</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.operational}</p>
            <p className="text-xs text-slate-400">Active equipment</p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-lg">
              <Wrench className="h-6 w-6 text-amber-400" />
            </div>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20">
              {stats.maintenance}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">Maintenance</p>
            <p className="text-2xl font-bold text-amber-400">{stats.maintenance}</p>
            <p className="text-xs text-slate-400">Under repair</p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20">
              {stats.calibrationDue}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">Calibration Due</p>
            <p className="text-2xl font-bold text-blue-400">{stats.calibrationDue}</p>
            <p className="text-xs text-slate-400">Needs calibration</p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/20">
              {stats.offline}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">Offline</p>
            <p className="text-2xl font-bold text-red-400">{stats.offline}</p>
            <p className="text-xs text-slate-400">Inactive equipment</p>
          </div>
        </div>
      </div>

      {/* Equipment Type Breakdown */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-50">Equipment Types</h3>
            <p className="text-sm text-slate-400">Distribution by equipment category</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {equipmentTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.type} className="group cursor-pointer">
                <div className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color.gradient}`}>
                      <Icon className="h-5 w-5 text-slate-200" />
                    </div>
                    <span className={`text-sm font-medium ${type.color.text}`}>
                      {type.operational}/{type.count}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{type.type}</p>
                    <p className="text-xs text-slate-400">
                      {type.operational} operational, {type.count - type.operational} maintenance
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment List */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-50">Equipment Details</h3>
            <p className="text-sm text-slate-400">Real-time status and health monitoring</p>
          </div>
          <div className="flex space-x-2">
            {(['all', 'operational', 'maintenance', 'offline'] as const).map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className={`text-xs ${
                  selectedFilter === filter 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50'
                } transition-all duration-300`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredEquipment.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{item.name}</p>
                      <p className="text-sm text-slate-400">{item.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getHealthColor(item.health)}`}>
                        Health: {item.health}%
                      </p>
                      <p className="text-xs text-slate-400">
                        Uptime: {item.uptime}%
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 transition-all duration-300"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Health Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Health Score</span>
                    <span className="font-medium text-slate-200">{item.health}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.health >= 90 ? 'bg-emerald-500' : 
                        item.health >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.health}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
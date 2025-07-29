'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  User, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
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
  Plus,
  Edit,
  Trash2,
  Brain,
  Shield,
  Bell
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'calibration' | 'equipment' | 'user' | 'ai' | 'system' | 'alert';
  title: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
    role: string;
  };
  timestamp: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  priority: 'high' | 'medium' | 'low';
  equipment?: string;
  location?: string;
  metadata?: Record<string, any>;
}

interface ActivityFilter {
  type: 'all' | 'calibration' | 'equipment' | 'user' | 'ai' | 'system' | 'alert';
  status: 'all' | 'completed' | 'in_progress' | 'pending' | 'failed';
  priority: 'all' | 'high' | 'medium' | 'low';
}

export function RecentActivityFeed() {
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ActivityFilter>({
    type: 'all',
    status: 'all',
    priority: 'all'
  });
  const [showAll, setShowAll] = useState(false);

  const activityData: ActivityItem[] = [
    {
      id: '1',
      type: 'calibration',
      title: 'Calibration Completed',
      description: 'Balance PB-220 calibration completed successfully',
      user: {
        name: 'Dr. Sarah Chen',
        role: 'Lab Manager'
      },
      timestamp: '2024-01-15T10:30:00Z',
      status: 'completed',
      priority: 'high',
      equipment: 'Balance PB-220',
      location: 'Lab A - Room 102',
      metadata: {
        accuracy: '99.8%',
        duration: '2h 15m',
        technician: 'Mike Johnson'
      }
    },
    {
      id: '2',
      type: 'equipment',
      title: 'Equipment Maintenance',
      description: 'Incubator IC-200 scheduled for maintenance',
      user: {
        name: 'Lisa Wang',
        role: 'Technician'
      },
      timestamp: '2024-01-15T09:15:00Z',
      status: 'in_progress',
      priority: 'medium',
      equipment: 'Incubator IC-200',
      location: 'Lab B - Room 201',
      metadata: {
        estimatedDuration: '4h',
        maintenanceType: 'Preventive',
        partsRequired: ['Thermostat', 'Humidity Sensor']
      }
    },
    {
      id: '3',
      type: 'ai',
      title: 'AI Analysis Complete',
      description: 'Biomni AI completed protocol optimization analysis',
      user: {
        name: 'AI Assistant',
        role: 'AI System'
      },
      timestamp: '2024-01-15T08:45:00Z',
      status: 'completed',
      priority: 'medium',
      metadata: {
        analysisType: 'Protocol Optimization',
        confidence: '94.2%',
        timeSaved: '3.5 hours',
        recommendations: 5
      }
    },
    {
      id: '4',
      type: 'user',
      title: 'New Team Member',
      description: 'Alex Rodriguez joined the laboratory team',
      user: {
        name: 'Alex Rodriguez',
        role: 'Research Assistant'
      },
      timestamp: '2024-01-15T08:00:00Z',
      status: 'completed',
      priority: 'low',
      metadata: {
        department: 'Molecular Biology',
        supervisor: 'Dr. Emily Davis',
        trainingStatus: 'In Progress'
      }
    },
    {
      id: '5',
      type: 'alert',
      title: 'Temperature Alert',
      description: 'Incubator IC-200 temperature variance detected',
      user: {
        name: 'System Monitor',
        role: 'Automated Alert'
      },
      timestamp: '2024-01-15T07:30:00Z',
      status: 'pending',
      priority: 'high',
      equipment: 'Incubator IC-200',
      location: 'Lab B - Room 201',
      metadata: {
        currentTemp: '38.5°C',
        targetTemp: '37.0°C',
        variance: '+1.5°C',
        actionRequired: 'Immediate attention needed'
      }
    },
    {
      id: '6',
      type: 'system',
      title: 'System Update',
      description: 'LabGuard Pro system updated to version 2.1.0',
      user: {
        name: 'System Administrator',
        role: 'Admin'
      },
      timestamp: '2024-01-15T06:00:00Z',
      status: 'completed',
      priority: 'medium',
      metadata: {
        version: '2.1.0',
        features: ['Enhanced AI integration', 'Improved reporting', 'Bug fixes'],
        downtime: '15 minutes'
      }
    },
    {
      id: '7',
      type: 'calibration',
      title: 'Calibration Scheduled',
      description: 'pH Meter PH-100 calibration scheduled for next week',
      user: {
        name: 'Dr. Emily Davis',
        role: 'Senior Researcher'
      },
      timestamp: '2024-01-15T05:30:00Z',
      status: 'pending',
      priority: 'medium',
      equipment: 'pH Meter PH-100',
      location: 'Lab A - Room 103',
      metadata: {
        scheduledDate: '2024-01-22',
        technician: 'Mike Johnson',
        estimatedDuration: '1h 30m'
      }
    },
    {
      id: '8',
      type: 'equipment',
      title: 'Equipment Added',
      description: 'New microscope MS-500 added to inventory',
      user: {
        name: 'Tom Wilson',
        role: 'Equipment Manager'
      },
      timestamp: '2024-01-15T04:15:00Z',
      status: 'completed',
      priority: 'low',
      equipment: 'Microscope MS-500',
      location: 'Lab C - Room 301',
      metadata: {
        manufacturer: 'Olympus',
        model: 'BX53',
        serialNumber: 'OLY-2024-001',
        warranty: '3 years'
      }
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'calibration':
        return <Target className="h-4 w-4" />;
      case 'equipment':
        return <Settings className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'ai':
        return <Brain className="h-4 w-4" />;
      case 'system':
        return <Shield className="h-4 w-4" />;
      case 'alert':
        return <Bell className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'in_progress':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'failed':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-emerald-400';
      default:
        return 'text-slate-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'calibration':
        return 'from-blue-500 to-blue-600';
      case 'equipment':
        return 'from-green-500 to-green-600';
      case 'user':
        return 'from-purple-500 to-purple-600';
      case 'ai':
        return 'from-orange-500 to-orange-600';
      case 'system':
        return 'from-indigo-500 to-indigo-600';
      case 'alert':
        return 'from-red-500 to-red-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const filteredActivities = activityData.filter(activity => {
    if (filters.type !== 'all' && activity.type !== filters.type) return false;
    if (filters.status !== 'all' && activity.status !== filters.status) return false;
    if (filters.priority !== 'all' && activity.priority !== filters.priority) return false;
    return true;
  });

  const displayedActivities = showAll ? filteredActivities : filteredActivities.slice(0, 5);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleFilterChange = (filterType: keyof ActivityFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-50">Recent Activity</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-slate-700/50"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {activityData.length} activities
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex items-center space-x-2 mb-6">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-1 text-sm text-slate-200"
          >
            <option value="all">All Types</option>
            <option value="calibration">Calibration</option>
            <option value="equipment">Equipment</option>
            <option value="user">User</option>
            <option value="ai">AI</option>
            <option value="system">System</option>
            <option value="alert">Alert</option>
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-1 text-sm text-slate-200"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-1 text-sm text-slate-200"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {displayedActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-200">{activity.title}</p>
                    <p className="text-sm text-slate-400">{activity.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(activity.status)}`}>
                      {activity.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={`${getPriorityColor(activity.priority)} bg-transparent border ${getPriorityColor(activity.priority)}/30`}>
                      {activity.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold">
                        {getInitials(activity.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium text-slate-300">{activity.user.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{activity.user.role}</p>
                    </div>
                    {activity.equipment && (
                      <div className="flex items-center space-x-1">
                        <Settings className="h-3 w-3 text-slate-400" />
                        <p className="text-xs text-slate-400">{activity.equipment}</p>
                      </div>
                    )}
                    {activity.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <p className="text-xs text-slate-400">{activity.location}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <p className="text-xs text-slate-400">{formatTimestamp(activity.timestamp)}</p>
                    <Button variant="ghost" size="sm" className="p-1 hover:bg-slate-600/50">
                      <Eye className="h-3 w-3 text-slate-400" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {filteredActivities.length > 5 && (
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="w-full bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50"
            >
              {showAll ? 'Show Less' : `Show ${filteredActivities.length - 5} More`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
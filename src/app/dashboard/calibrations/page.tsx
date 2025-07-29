"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Users,
  FileText,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  Filter,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Target,
  Microscope,
  CalendarDays
} from 'lucide-react';

interface Calibration {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentType: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  dueDate: string;
  technician?: string;
  type: 'routine' | 'preventive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  department: string;
  description: string;
  specifications: Record<string, any>;
  results?: {
    accuracy: number;
    precision: number;
    uncertainty: number;
    passed: boolean;
    notes: string;
  };
  attachments: string[];
  aiValidation?: {
    status: 'pending' | 'approved' | 'rejected';
    confidence: number;
    suggestions: string[];
  };
}

interface FilterState {
  status: string;
  type: string;
  priority: string;
  technician: string;
  dateRange: [Date | undefined, Date | undefined];
  search: string;
}

export default function CalibrationsPage() {
  const router = useRouter();
  const { calibrations, fetchCalibrations } = useDashboardStore();
  const [selectedCalibrations, setSelectedCalibrations] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'timeline'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    type: 'all',
    priority: 'all',
    technician: 'all',
    dateRange: [undefined, undefined],
    search: ''
  });

  // Generate sample calibration data
  const generateCalibrationData = (): Calibration[] => {
    const equipmentTypes = ['Microscope', 'Centrifuge', 'Spectrophotometer', 'PCR Machine', 'Incubator', 'Autoclave'];
    const locations = ['Lab A', 'Lab B', 'Lab C', 'Storage Room', 'Maintenance Bay'];
    const departments = ['Research', 'Quality Control', 'Production', 'Development'];
    const technicians = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];

    return Array.from({ length: 30 }, (_, i) => {
      const status = ['scheduled', 'in_progress', 'completed', 'overdue', 'cancelled'][Math.floor(Math.random() * 5)] as Calibration['status'];
      const priority = ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as Calibration['priority'];
      const type = ['routine', 'preventive', 'corrective', 'emergency'][Math.floor(Math.random() * 4)] as Calibration['type'];
      
      const scheduledDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      const dueDate = new Date(scheduledDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      const completedDate = status === 'completed' ? new Date(scheduledDate.getTime() + Math.random() * 24 * 60 * 60 * 1000) : undefined;

      return {
        id: `CAL-2024-${String(i + 1).padStart(3, '0')}`,
        equipmentId: `EQ-2024-${String(Math.floor(Math.random() * 25) + 1).padStart(3, '0')}`,
        equipmentName: `${equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]} ${Math.floor(Math.random() * 10) + 1}`,
        equipmentType: equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)],
        status,
        scheduledDate: scheduledDate.toISOString(),
        completedDate: completedDate?.toISOString(),
        dueDate: dueDate.toISOString(),
        technician: Math.random() > 0.2 ? technicians[Math.floor(Math.random() * technicians.length)] : undefined,
        type,
        priority,
        location: locations[Math.floor(Math.random() * locations.length)],
        department: departments[Math.floor(Math.random() * departments.length)],
        description: `Calibration for ${equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]} - ${type} maintenance`,
        specifications: {
          accuracy: Math.floor(Math.random() * 5) + 95,
          tolerance: Math.floor(Math.random() * 2) + 1,
          frequency: Math.floor(Math.random() * 12) + 6
        },
        results: status === 'completed' ? {
          accuracy: Math.floor(Math.random() * 5) + 95,
          precision: Math.floor(Math.random() * 3) + 97,
          uncertainty: Math.random() * 2 + 0.5,
          passed: Math.random() > 0.1,
          notes: Math.random() > 0.5 ? 'Calibration completed successfully' : 'Minor adjustments required'
        } : undefined,
        attachments: Math.random() > 0.5 ? ['certificate.pdf', 'report.pdf'] : [],
        aiValidation: Math.random() > 0.3 ? {
          status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as 'pending' | 'approved' | 'rejected',
          confidence: Math.floor(Math.random() * 30) + 70,
          suggestions: Math.random() > 0.5 ? ['Consider recalibration', 'Update procedures'] : []
        } : undefined
      };
    });
  };

  const calibrationData = useMemo(() => generateCalibrationData(), []);

  // Filter and sort calibrations
  const filteredCalibrations = useMemo(() => {
    let filtered = calibrationData.filter(item => {
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesType = filters.type === 'all' || item.type === filters.type;
      const matchesPriority = filters.priority === 'all' || item.priority === filters.priority;
      const matchesTechnician = filters.technician === 'all' || item.technician === filters.technician;
      const matchesSearch = item.equipmentName.toLowerCase().includes(filters.search.toLowerCase()) ||
                          item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                          item.id.toLowerCase().includes(filters.search.toLowerCase());

      let matchesDateRange = true;
      if (filters.dateRange[0] && filters.dateRange[1]) {
        const itemDate = new Date(item.scheduledDate);
        matchesDateRange = itemDate >= filters.dateRange[0] && itemDate <= filters.dateRange[1];
      }

      return matchesStatus && matchesType && matchesPriority && matchesTechnician && matchesSearch && matchesDateRange;
    });

    // Sort by due date for overdue items first
    filtered.sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (a.status !== 'overdue' && b.status === 'overdue') return 1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return filtered;
  }, [calibrationData, filters]);

  const getStatusColor = (status: Calibration['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'scheduled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getPriorityColor = (priority: Calibration['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleBulkAction = (action: string) => {
    if (selectedCalibrations.length === 0) return;
    
    switch (action) {
      case 'export':
        console.log('Exporting selected calibrations:', selectedCalibrations);
        break;
      case 'schedule':
        console.log('Scheduling calibrations:', selectedCalibrations);
        break;
      case 'assign':
        console.log('Assigning technicians to:', selectedCalibrations);
        break;
      case 'cancel':
        console.log('Cancelling calibrations:', selectedCalibrations);
        break;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCalibrations(filteredCalibrations.map(item => item.id));
    } else {
      setSelectedCalibrations([]);
    }
  };

  const handleSelectCalibration = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCalibrations(prev => [...prev, id]);
    } else {
      setSelectedCalibrations(prev => prev.filter(item => item !== id));
    }
  };

  const CalibrationCard = ({ item }: { item: Calibration }) => {
    const isSelected = selectedCalibrations.includes(item.id);
    const daysUntilDue = getDaysUntilDue(item.dueDate);
    const isOverdue = daysUntilDue < 0;
    
    return (
      <Card className={`relative transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isOverdue ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => handleSelectCalibration(item.id, checked as boolean)}
              />
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                {item.status.replace('_', ' ')}
              </Badge>
              <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {item.equipmentName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.equipmentType} • {item.type}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Due Date</span>
              <span className={`font-medium ${isOverdue ? 'text-red-600' : daysUntilDue <= 3 ? 'text-yellow-600' : 'text-gray-600'}`}>
                {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days`}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <CalendarIcon className="h-3 w-3 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  {new Date(item.scheduledDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Settings className="h-3 w-3 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">{item.location}</span>
              </div>
            </div>
            
            {item.technician && (
              <div className="flex items-center space-x-1 text-xs">
                <Users className="h-3 w-3 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">{item.technician}</span>
              </div>
            )}
            
            {item.results && (
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${item.results.passed ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-gray-500 dark:text-gray-400">
                  {item.results.passed ? 'Passed' : 'Failed'} • {item.results.accuracy}% accuracy
                </span>
              </div>
            )}
            
            {item.aiValidation && (
              <div className="flex items-center space-x-1 text-xs">
                <Zap className="h-3 w-3 text-purple-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  AI: {item.aiValidation.status} ({item.aiValidation.confidence}%)
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {item.attachments.length} attachments
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/calibrations/${item.id}`)}
                className="h-6 w-6 p-0"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/calibrations/${item.id}/edit`)}
                className="h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const stats = useMemo(() => {
    const total = calibrationData.length;
    const completed = calibrationData.filter(cal => cal.status === 'completed').length;
    const overdue = calibrationData.filter(cal => cal.status === 'overdue').length;
    const scheduled = calibrationData.filter(cal => cal.status === 'scheduled').length;
    const inProgress = calibrationData.filter(cal => cal.status === 'in_progress').length;
    const avgAccuracy = calibrationData
      .filter(cal => cal.results)
      .reduce((sum, cal) => sum + (cal.results?.accuracy || 0), 0) / 
      calibrationData.filter(cal => cal.results).length;

    return { total, completed, overdue, scheduled, inProgress, avgAccuracy: Math.round(avgAccuracy) };
  }, [calibrationData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calibration Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule, track, and manage equipment calibrations
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/dashboard/calibrations/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Calibration
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
                <p className="text-xs text-gray-500">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.overdue}</p>
                <p className="text-xs text-gray-500">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.avgAccuracy}%</p>
                <p className="text-xs text-gray-500">Avg Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search calibrations..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="preventive">Preventive</SelectItem>
                  <SelectItem value="corrective">Corrective</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* View Mode */}
            <div className="flex items-center space-x-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <CalendarDays className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('timeline')}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCalibrations.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedCalibrations.length === filteredCalibrations.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCalibrations.length} calibrations selected
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('export')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('schedule')}>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('assign')}>
                  <Users className="h-4 w-4 mr-2" />
                  Assign Technician
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('cancel')}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      )}

      {/* Calibration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCalibrations.map((item) => (
          <CalibrationCard key={item.id} item={item} />
        ))}
      </div>

      {/* Empty State */}
      {filteredCalibrations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No calibrations found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your filters or schedule new calibrations to get started.
            </p>
            <Button onClick={() => router.push('/dashboard/calibrations/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Calibration
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
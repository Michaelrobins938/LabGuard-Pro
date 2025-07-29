"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Settings,
  Microscope,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  QrCode,
  Camera,
  FileText,
  Users,
  Zap,
  TrendingUp,
  TrendingDown,
  Brain,
  Sparkles
} from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: 'operational' | 'maintenance' | 'offline' | 'calibration';
  location: string;
  health: number;
  lastCalibration?: string;
  nextCalibration?: string;
  assignedTo?: string;
  department: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  cost: number;
  manufacturer: string;
  specifications: Record<string, any>;
  maintenanceHistory: Array<{
    date: string;
    type: string;
    description: string;
    technician: string;
  }>;
}

interface FilterState {
  status: string;
  type: string;
  location: string;
  department: string;
  healthRange: [number, number];
  search: string;
}

export default function EquipmentPage() {
  const router = useRouter();
  const { equipment, fetchEquipment } = useDashboardStore();
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [showAIBanner, setShowAIBanner] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    type: 'all',
    location: 'all',
    department: 'all',
    healthRange: [0, 100],
    search: ''
  });

  // Generate sample equipment data
  const generateEquipmentData = (): Equipment[] => {
    const equipmentTypes = ['Microscope', 'Centrifuge', 'Spectrophotometer', 'PCR Machine', 'Incubator', 'Autoclave'];
    const locations = ['Lab A', 'Lab B', 'Lab C', 'Storage Room', 'Maintenance Bay'];
    const departments = ['Research', 'Quality Control', 'Production', 'Development'];
    const manufacturers = ['Thermo Fisher', 'Beckman Coulter', 'Eppendorf', 'Bio-Rad', 'Agilent'];

    return Array.from({ length: 25 }, (_, i) => {
      const type = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
      const status = ['operational', 'maintenance', 'offline', 'calibration'][Math.floor(Math.random() * 4)] as Equipment['status'];
      const health = Math.floor(Math.random() * 40) + 60; // 60-100
      
      return {
        id: `EQ-2024-${String(i + 1).padStart(3, '0')}`,
        name: `${type} ${i + 1}`,
        type,
        model: `${manufacturers[Math.floor(Math.random() * manufacturers.length)]} ${Math.floor(Math.random() * 1000)}`,
        serialNumber: `SN${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        status,
        location: locations[Math.floor(Math.random() * locations.length)],
        health,
        lastCalibration: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        nextCalibration: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: Math.random() > 0.3 ? `Technician ${Math.floor(Math.random() * 5) + 1}` : undefined,
        department: departments[Math.floor(Math.random() * departments.length)],
        purchaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        warrantyExpiry: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        cost: Math.floor(Math.random() * 50000) + 5000,
        manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
        specifications: {
          power: `${Math.floor(Math.random() * 1000) + 100}W`,
          dimensions: `${Math.floor(Math.random() * 50) + 20}x${Math.floor(Math.random() * 50) + 20}x${Math.floor(Math.random() * 50) + 20}cm`,
          weight: `${Math.floor(Math.random() * 50) + 10}kg`
        },
        maintenanceHistory: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          type: ['Preventive', 'Corrective', 'Calibration'][Math.floor(Math.random() * 3)],
          description: `Maintenance activity ${j + 1}`,
          technician: `Tech ${Math.floor(Math.random() * 5) + 1}`
        }))
      };
    });
  };

  const equipmentData = useMemo(() => generateEquipmentData(), []);

  // Filter and sort equipment
  const filteredEquipment = useMemo(() => {
    let filtered = equipmentData.filter(item => {
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesType = filters.type === 'all' || item.type === filters.type;
      const matchesLocation = filters.location === 'all' || item.location === filters.location;
      const matchesDepartment = filters.department === 'all' || item.department === filters.department;
      const matchesHealth = item.health >= filters.healthRange[0] && item.health <= filters.healthRange[1];
      const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          item.model.toLowerCase().includes(filters.search.toLowerCase()) ||
                          item.serialNumber.toLowerCase().includes(filters.search.toLowerCase());

      return matchesStatus && matchesType && matchesLocation && matchesDepartment && matchesHealth && matchesSearch;
    });

    // Sort equipment
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Equipment];
      let bValue = b[sortBy as keyof Equipment];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [equipmentData, filters, sortBy, sortOrder]);

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'calibration':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleBulkAction = (action: string) => {
    if (selectedEquipment.length === 0) return;
    
    switch (action) {
      case 'export':
        console.log('Exporting selected equipment:', selectedEquipment);
        break;
      case 'maintenance':
        console.log('Scheduling maintenance for:', selectedEquipment);
        break;
      case 'calibration':
        console.log('Scheduling calibration for:', selectedEquipment);
        break;
      case 'delete':
        console.log('Deleting equipment:', selectedEquipment);
        break;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEquipment(filteredEquipment.map(item => item.id));
    } else {
      setSelectedEquipment([]);
    }
  };

  const handleSelectEquipment = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedEquipment(prev => [...prev, id]);
    } else {
      setSelectedEquipment(prev => prev.filter(item => item !== id));
    }
  };

  const EquipmentCard = ({ item }: { item: Equipment }) => {
    const isSelected = selectedEquipment.includes(item.id);
    
    return (
      <Card className={`relative transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => handleSelectEquipment(item.id, checked as boolean)}
              />
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Microscope className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                {item.status}
              </Badge>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.model}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Health</span>
              <span className={`font-medium ${getHealthColor(item.health)}`}>
                {item.health}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${getHealthColor(item.health).replace('text-', 'bg-')}`}
                style={{ width: `${item.health}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">{item.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  {item.nextCalibration ? new Date(item.nextCalibration).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
            
            {item.assignedTo && (
              <div className="flex items-center space-x-1 text-xs">
                <Users className="h-3 w-3 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">{item.assignedTo}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ${item.cost.toLocaleString()}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/equipment/${item.id}`)}
                className="h-6 w-6 p-0"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/equipment/${item.id}/edit`)}
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
    const total = equipmentData.length;
    const operational = equipmentData.filter(eq => eq.status === 'operational').length;
    const maintenance = equipmentData.filter(eq => eq.status === 'maintenance').length;
    const offline = equipmentData.filter(eq => eq.status === 'offline').length;
    const avgHealth = Math.round(equipmentData.reduce((sum, eq) => sum + eq.health, 0) / total);

    return { total, operational, maintenance, offline, avgHealth };
  }, [equipmentData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Equipment Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage laboratory equipment, track status, and schedule maintenance
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
          <Button onClick={() => router.push('/dashboard/equipment/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </div>

      {/* AI Integration Banner */}
      {showAIBanner && (
        <Alert className="mb-4">
          <Sparkles className="h-4 w-4 mr-2" />
          <AlertDescription>
            <strong>AI Integration Available!</strong> Try our new AI-powered features to optimize equipment management.
            <Button variant="outline" size="sm" className="ml-2" onClick={() => setShowAIBanner(false)}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Microscope className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Equipment</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.operational}</p>
                <p className="text-xs text-gray-500">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.maintenance}</p>
                <p className="text-xs text-gray-500">Maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.offline}</p>
                <p className="text-xs text-gray-500">Offline</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.avgHealth}%</p>
                <p className="text-xs text-gray-500">Avg Health</p>
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
                  placeholder="Search equipment..."
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
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="calibration">Calibration</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Microscope">Microscope</SelectItem>
                  <SelectItem value="Centrifuge">Centrifuge</SelectItem>
                  <SelectItem value="Spectrophotometer">Spectrophotometer</SelectItem>
                  <SelectItem value="PCR Machine">PCR Machine</SelectItem>
                  <SelectItem value="Incubator">Incubator</SelectItem>
                  <SelectItem value="Autoclave">Autoclave</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Lab A">Lab A</SelectItem>
                  <SelectItem value="Lab B">Lab B</SelectItem>
                  <SelectItem value="Lab C">Lab C</SelectItem>
                  <SelectItem value="Storage Room">Storage Room</SelectItem>
                  <SelectItem value="Maintenance Bay">Maintenance Bay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* View Mode */}
            <div className="flex items-center space-x-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedEquipment.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedEquipment.length === filteredEquipment.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedEquipment.length} equipment selected
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('export')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('maintenance')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('calibration')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Calibration
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEquipment.map((item) => (
          <EquipmentCard key={item.id} item={item} />
        ))}
      </div>

      {/* Empty State */}
      {filteredEquipment.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Microscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No equipment found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your filters or add new equipment to get started.
            </p>
            <Button onClick={() => router.push('/dashboard/equipment/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
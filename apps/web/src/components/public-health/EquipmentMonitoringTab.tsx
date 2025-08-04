"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Thermometer, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings, 
  Eye, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  MapPin,
  Calendar,
  FileText,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Equipment {
  id: string;
  name: string;
  type: 'freezer' | 'incubator' | 'pcr' | 'centrifuge' | 'microscope' | 'other';
  location: string;
  model: string;
  serialNumber: string;
  status: 'operational' | 'maintenance' | 'out_of_service' | 'calibration_due';
  lastCalibration: string;
  nextCalibration: string;
  temperature?: number;
  humidity?: number;
  alertThresholds: {
    minTemp?: number;
    maxTemp?: number;
    minHumidity?: number;
    maxHumidity?: number;
  };
  currentAlerts: Alert[];
  temperatureHistory: Array<{
    timestamp: string;
    temperature: number;
    humidity?: number;
  }>;
}

interface Alert {
  id: string;
  type: 'temperature' | 'humidity' | 'calibration' | 'maintenance' | 'power';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
}

interface CalibrationRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  calibrationDate: string;
  nextCalibrationDate: string;
  performedBy: string;
  certificate: string;
  notes: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
}

export default function EquipmentMonitoringTab() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchEquipmentData();
    const interval = setInterval(fetchEquipmentData, 30000); // 30 second updates
    return () => clearInterval(interval);
  }, []);

  const fetchEquipmentData = async () => {
    try {
      const [equipmentResponse, calibrationsResponse] = await Promise.all([
        fetch('/api/public-health/equipment'),
        fetch('/api/public-health/equipment/calibrations')
      ]);

      if (equipmentResponse.ok) {
        const equipmentData = await equipmentResponse.json();
        setEquipment(equipmentData.data);
      }

      if (calibrationsResponse.ok) {
        const calibrationsData = await calibrationsResponse.json();
        setCalibrations(calibrationsData.data);
      }
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (equipmentId: string, alertId: string) => {
    try {
      const response = await fetch(`/api/public-health/equipment/${equipmentId}/alerts/${alertId}/acknowledge`, {
        method: 'POST'
      });

      if (response.ok) {
        setEquipment(equipment.map(eq => 
          eq.id === equipmentId 
            ? {
                ...eq,
                currentAlerts: eq.currentAlerts.map(alert => 
                  alert.id === alertId ? { ...alert, acknowledged: true } : alert
                )
              }
            : eq
        ));
        
        toast.success("Alert acknowledged successfully");
      }
    } catch (error) {
      toast.error("Failed to acknowledge alert");
    }
  };

  const resolveAlert = async (equipmentId: string, alertId: string) => {
    try {
      const response = await fetch(`/api/public-health/equipment/${equipmentId}/alerts/${alertId}/resolve`, {
        method: 'POST'
      });

      if (response.ok) {
        setEquipment(equipment.map(eq => 
          eq.id === equipmentId 
            ? {
                ...eq,
                currentAlerts: eq.currentAlerts.filter(alert => alert.id !== alertId)
              }
            : eq
        ));
        
        toast.success("Alert resolved successfully");
      }
    } catch (error) {
      toast.error("Failed to resolve alert");
    }
  };

  const updateAlertThresholds = async (equipmentId: string, thresholds: any) => {
    try {
      const response = await fetch(`/api/public-health/equipment/${equipmentId}/thresholds`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(thresholds)
      });

      if (response.ok) {
        setEquipment(equipment.map(eq => 
          eq.id === equipmentId 
            ? { ...eq, alertThresholds: { ...eq.alertThresholds, ...thresholds } }
            : eq
        ));
        
        toast.success("Alert thresholds updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update alert thresholds");
    }
  };

  const exportEquipmentReport = async () => {
    try {
      const response = await fetch('/api/public-health/equipment/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          format: 'pdf',
          includeHistory: true,
          includeCalibrations: true
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `equipment_report_${new Date().toISOString().slice(0,10)}.pdf`;
        a.click();
        
        toast.success("Equipment report exported successfully");
      }
    } catch (error) {
      toast.error("Failed to export equipment report");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'operational': 'default',
      'maintenance': 'secondary',
      'out_of_service': 'destructive',
      'calibration_due': 'outline'
    } as const;

    const colors = {
      'operational': 'text-green-600',
      'maintenance': 'text-yellow-600',
      'out_of_service': 'text-red-600',
      'calibration_due': 'text-orange-600'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getAlertSeverityBadge = (severity: string) => {
    const variants = {
      'low': 'secondary',
      'medium': 'default',
      'high': 'destructive',
      'critical': 'destructive'
    } as const;

    return <Badge variant={variants[severity as keyof typeof variants]}>{severity.toUpperCase()}</Badge>;
  };

  const getTemperatureTrend = (history: Array<{temperature: number}>) => {
    if (history.length < 2) return 'stable';
    const recent = history.slice(-5);
    const first = recent[0].temperature;
    const last = recent[recent.length - 1].temperature;
    const change = last - first;
    
    if (change > 2) return 'rising';
    if (change < -2) return 'falling';
    return 'stable';
  };

  const getTemperatureIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'falling': return <TrendingDown className="h-4 w-4 text-blue-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredEquipment = equipment.filter(eq => {
    const matchesStatus = filterStatus === 'all' || eq.status === filterStatus;
    const matchesType = filterType === 'all' || eq.type === filterType;
    return matchesStatus && matchesType;
  });

  const criticalAlerts = equipment.flatMap(eq => 
    eq.currentAlerts.filter(alert => alert.severity === 'critical' && !alert.acknowledged)
  );

  const upcomingCalibrations = calibrations.filter(cal => 
    cal.status === 'scheduled' && 
    new Date(cal.calibrationDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading equipment monitoring data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Critical Equipment Alerts ({criticalAlerts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acknowledgeAlert(alert.id, alert.id)}
                    >
                      Acknowledge
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveAlert(alert.id, alert.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
              {criticalAlerts.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  {criticalAlerts.length - 3} more critical alerts...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipment.length}</div>
            <p className="text-xs text-muted-foreground">
              {equipment.filter(eq => eq.status === 'operational').length} operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {equipment.reduce((total, eq) => total + eq.currentAlerts.filter(a => !a.acknowledged).length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {criticalAlerts.length} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calibrations Due</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {upcomingCalibrations.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature Range</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.min(...equipment.filter(eq => eq.temperature).map(eq => eq.temperature!))}°C - {Math.max(...equipment.filter(eq => eq.temperature).map(eq => eq.temperature!))}°C
            </div>
            <p className="text-xs text-muted-foreground">
              Current range
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5" />
              <span>Equipment Monitoring</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={fetchEquipmentData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportEquipmentReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out_of_service">Out of Service</SelectItem>
                <SelectItem value="calibration_due">Calibration Due</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="freezer">Freezers</SelectItem>
                <SelectItem value="incubator">Incubators</SelectItem>
                <SelectItem value="pcr">PCR Systems</SelectItem>
                <SelectItem value="centrifuge">Centrifuges</SelectItem>
                <SelectItem value="microscope">Microscopes</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {(filterStatus !== 'all' || filterType !== 'all') && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  setFilterStatus('all');
                  setFilterType('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Equipment Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Alerts</TableHead>
                  <TableHead>Next Calibration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((eq) => {
                  const temperatureTrend = getTemperatureTrend(eq.temperatureHistory);
                  const unacknowledgedAlerts = eq.currentAlerts.filter(a => !a.acknowledged);
                  
                  return (
                    <TableRow key={eq.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{eq.name}</div>
                          <div className="text-sm text-gray-600">{eq.model}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span className="text-sm">{eq.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(eq.status)}</TableCell>
                      <TableCell>
                        {eq.temperature ? (
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">{eq.temperature}°C</span>
                            {getTemperatureIcon(temperatureTrend)}
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {unacknowledgedAlerts.length > 0 ? (
                          <Badge variant="destructive">
                            {unacknowledgedAlerts.length} active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">None</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(eq.nextCalibration).toLocaleDateString()}
                          {new Date(eq.nextCalibration) <= new Date() && (
                            <Badge variant="destructive" className="ml-2">Overdue</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEquipment(eq);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredEquipment.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No equipment found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Calibrations */}
      {upcomingCalibrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Calibrations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingCalibrations.slice(0, 5).map((calibration) => (
                <div key={calibration.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{calibration.equipmentName}</h4>
                    <p className="text-sm text-gray-600">
                      Scheduled: {new Date(calibration.calibrationDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Performed by: {calibration.performedBy}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={calibration.status === 'overdue' ? 'destructive' : 'secondary'}>
                      {calibration.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Equipment Details - {selectedEquipment?.name}</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <div className="space-y-6">
              {/* Equipment Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Model</Label>
                  <p className="text-sm">{selectedEquipment.model}</p>
                </div>
                <div>
                  <Label>Serial Number</Label>
                  <p className="text-sm">{selectedEquipment.serialNumber}</p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p className="text-sm">{selectedEquipment.location}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="text-sm">{getStatusBadge(selectedEquipment.status)}</p>
                </div>
                <div>
                  <Label>Last Calibration</Label>
                  <p className="text-sm">{new Date(selectedEquipment.lastCalibration).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Next Calibration</Label>
                  <p className="text-sm">{new Date(selectedEquipment.nextCalibration).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Current Readings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Temperature</Label>
                  <p className="text-2xl font-bold">
                    {selectedEquipment.temperature ? `${selectedEquipment.temperature}°C` : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label>Current Humidity</Label>
                  <p className="text-2xl font-bold">
                    {selectedEquipment.humidity ? `${selectedEquipment.humidity}%` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Temperature History Chart */}
              {selectedEquipment.temperatureHistory.length > 0 && (
                <div>
                  <Label>Temperature History (Last 24 Hours)</Label>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={selectedEquipment.temperatureHistory.slice(-24)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value) => [`${value}°C`, 'Temperature']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Alert Thresholds */}
              <div>
                <Label>Alert Thresholds</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm">Temperature Range</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={selectedEquipment.alertThresholds.minTemp || ''}
                        onChange={(e) => updateAlertThresholds(selectedEquipment.id, {
                          minTemp: parseFloat(e.target.value)
                        })}
                        className="w-20"
                      />
                      <span className="text-sm">to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={selectedEquipment.alertThresholds.maxTemp || ''}
                        onChange={(e) => updateAlertThresholds(selectedEquipment.id, {
                          maxTemp: parseFloat(e.target.value)
                        })}
                        className="w-20"
                      />
                      <span className="text-sm">°C</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Humidity Range</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={selectedEquipment.alertThresholds.minHumidity || ''}
                        onChange={(e) => updateAlertThresholds(selectedEquipment.id, {
                          minHumidity: parseFloat(e.target.value)
                        })}
                        className="w-20"
                      />
                      <span className="text-sm">to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={selectedEquipment.alertThresholds.maxHumidity || ''}
                        onChange={(e) => updateAlertThresholds(selectedEquipment.id, {
                          maxHumidity: parseFloat(e.target.value)
                        })}
                        className="w-20"
                      />
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Alerts */}
              {selectedEquipment.currentAlerts.length > 0 && (
                <div>
                  <Label>Current Alerts</Label>
                  <div className="space-y-2 mt-2">
                    {selectedEquipment.currentAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            {getAlertSeverityBadge(alert.severity)}
                            <span className="font-medium">{alert.message}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {!alert.acknowledged && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => acknowledgeAlert(selectedEquipment.id, alert.id)}
                            >
                              Acknowledge
                            </Button>
                          )}
                          {!alert.resolved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resolveAlert(selectedEquipment.id, alert.id)}
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 
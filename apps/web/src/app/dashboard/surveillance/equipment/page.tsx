'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Settings, 
  Database, 
  Monitor, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { EquipmentMonitoring } from '@/types/surveillance';

export default function EquipmentMonitoringPage() {
  const [equipment, setEquipment] = useState<EquipmentMonitoring[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentMonitoring | null>(null);

  const [formData, setFormData] = useState({
    equipmentType: '',
    integrationType: '',
    credentials: {},
    isActive: true
  });

  useEffect(() => {
    fetchEquipmentMonitoring();
  }, []);

  const fetchEquipmentMonitoring = async () => {
    try {
      const response = await fetch('/api/surveillance/equipment/monitoring');
      if (response.ok) {
        const data = await response.json();
        setEquipment(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching equipment monitoring:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async () => {
    try {
      const response = await fetch('/api/surveillance/equipment/monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddForm(false);
        setFormData({
          equipmentType: '',
          integrationType: '',
          credentials: {},
          isActive: true
        });
        fetchEquipmentMonitoring();
      }
    } catch (error) {
      console.error('Error adding equipment monitoring:', error);
    }
  };

  const handleUpdateEquipment = async (equipmentId: string, updates: Partial<EquipmentMonitoring>) => {
    try {
      const response = await fetch(`/api/surveillance/equipment/monitoring/${equipmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setEditingEquipment(null);
        fetchEquipmentMonitoring();
      }
    } catch (error) {
      console.error('Error updating equipment monitoring:', error);
    }
  };

  const handleDeleteEquipment = async (equipmentId: string) => {
    try {
      const response = await fetch(`/api/surveillance/equipment/monitoring/${equipmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEquipmentMonitoring();
      }
    } catch (error) {
      console.error('Error deleting equipment monitoring:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Disconnected</Badge>;
      case 'error':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipment Monitoring</h1>
          <p className="text-muted-foreground">
            Manage equipment monitoring integrations and surveillance settings
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Add Equipment Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Equipment Monitoring</CardTitle>
            <CardDescription>
              Configure new equipment monitoring integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="equipmentType">Equipment Type</Label>
                <Select
                  value={formData.equipmentType}
                  onValueChange={(value) => setFormData({ ...formData, equipmentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thermocycler">Thermocycler</SelectItem>
                    <SelectItem value="microscope">Microscope</SelectItem>
                    <SelectItem value="centrifuge">Centrifuge</SelectItem>
                    <SelectItem value="incubator">Incubator</SelectItem>
                    <SelectItem value="spectrophotometer">Spectrophotometer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="integrationType">Integration Type</Label>
                <Select
                  value={formData.integrationType}
                  onValueChange={(value) => setFormData({ ...formData, integrationType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select integration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="api">API Integration</SelectItem>
                    <SelectItem value="database">Database Connection</SelectItem>
                    <SelectItem value="serial">Serial Communication</SelectItem>
                    <SelectItem value="ethernet">Ethernet Connection</SelectItem>
                    <SelectItem value="wifi">WiFi Connection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="credentials">Connection Credentials (JSON)</Label>
              <Textarea
                id="credentials"
                placeholder='{"host": "192.168.1.100", "port": 8080, "username": "admin", "password": "password"}'
                value={JSON.stringify(formData.credentials, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({ ...formData, credentials: parsed });
                  } catch (error) {
                    // Invalid JSON, keep as string
                  }
                }}
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <Label htmlFor="isActive">Active Monitoring</Label>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddEquipment}>Add Equipment</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment List */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Equipment</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Equipment</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {equipment.filter(eq => eq.isActive).map((eq) => (
              <Card key={eq.equipmentType}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-5 w-5" />
                      <CardTitle>{eq.equipmentType}</CardTitle>
                      {getStatusIcon(eq.status || 'unknown')}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(eq.status || 'unknown')}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingEquipment(eq)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEquipment(eq.equipmentType)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Integration: {eq.integrationType} • Last Check: {eq.lastCheck ? new Date(eq.lastCheck).toLocaleString() : 'Never'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Integration Type:</span> {eq.integrationType}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {eq.status || 'Unknown'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {equipment.filter(eq => eq.isActive).length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Monitor className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No active equipment monitoring configured</p>
                  <Button onClick={() => setShowAddForm(true)} className="mt-2">
                    Add Equipment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <div className="grid gap-4">
            {equipment.filter(eq => !eq.isActive).map((eq) => (
              <Card key={eq.equipmentType}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-5 w-5" />
                      <CardTitle>{eq.equipmentType}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Inactive</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateEquipment(eq.equipmentType, { isActive: true })}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Integration: {eq.integrationType}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
            {equipment.filter(eq => !eq.isActive).length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">No inactive equipment found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Settings</CardTitle>
              <CardDescription>
                Configure global equipment monitoring settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkInterval">Check Interval (minutes)</Label>
                  <Input id="checkInterval" type="number" defaultValue={5} />
                </div>
                <div>
                  <Label htmlFor="alertThreshold">Alert Threshold</Label>
                  <Input id="alertThreshold" type="number" defaultValue={3} />
                </div>
              </div>
              <div>
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input id="notificationEmail" type="email" placeholder="admin@labguard.com" />
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
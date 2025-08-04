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
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Database, 
  Globe, 
  Mail, 
  Bell, 
  Shield,
  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  TestTube,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Zap,
  Monitor,
  Activity
} from 'lucide-react';

interface SurveillanceSettings {
  labware: {
    server: string;
    database: string;
    username: string;
    password: string;
    port: number;
    autoSync: boolean;
    syncInterval: number;
  };
  nedss: {
    username: string;
    password: string;
    baseUrl: string;
    autoSubmit: boolean;
    timeout: number;
  };
  arboret: {
    apiKey: string;
    baseUrl: string;
    autoUpload: boolean;
    uploadInterval: number;
  };
  notifications: {
    email: string;
    sms: string;
    alerts: boolean;
    reports: boolean;
    errors: boolean;
  };
  reporting: {
    defaultCounty: string;
    autoGenerate: boolean;
    recipients: string[];
    format: 'pdf' | 'excel' | 'csv';
    includeMaps: boolean;
    includeHistorical: boolean;
  };
  equipment: {
    monitoringEnabled: boolean;
    checkInterval: number;
    alertThreshold: number;
    notificationEmail: string;
  };
}

export default function SurveillanceSettingsPage() {
  const [settings, setSettings] = useState<SurveillanceSettings>({
    labware: {
      server: '',
      database: '',
      username: '',
      password: '',
      port: 1433,
      autoSync: true,
      syncInterval: 30
    },
    nedss: {
      username: '',
      password: '',
      baseUrl: 'https://nedss.dshs.texas.gov',
      autoSubmit: true,
      timeout: 1200
    },
    arboret: {
      apiKey: '',
      baseUrl: 'https://wwwn.cdc.gov/arbonet/',
      autoUpload: true,
      uploadInterval: 60
    },
    notifications: {
      email: '',
      sms: '',
      alerts: true,
      reports: true,
      errors: true
    },
    reporting: {
      defaultCounty: 'TARRANT',
      autoGenerate: true,
      recipients: [],
      format: 'pdf',
      includeMaps: true,
      includeHistorical: true
    },
    equipment: {
      monitoringEnabled: true,
      checkInterval: 5,
      alertThreshold: 3,
      notificationEmail: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/surveillance/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.data || settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/surveillance/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        // Show success message
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (type: 'labware' | 'nedss' | 'arboret') => {
    try {
      const response = await fetch(`/api/surveillance/settings/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, settings: settings[type] }),
      });

      if (response.ok) {
        // Show success message
        console.log(`${type} connection test successful`);
      }
    } catch (error) {
      console.error(`Error testing ${type} connection:`, error);
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
          <h1 className="text-3xl font-bold tracking-tight">Surveillance Settings</h1>
          <p className="text-muted-foreground">
            Configure surveillance system integrations and preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchSettings} variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          {/* LabWare Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>LabWare Integration</span>
                  </CardTitle>
                  <CardDescription>
                    Configure LabWare LIMS connection settings
                  </CardDescription>
                </div>
                <Badge variant="outline">Connected</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="labware-server">Server</Label>
                  <Input
                    id="labware-server"
                    value={settings.labware.server}
                    onChange={(e) => setSettings({
                      ...settings,
                      labware: { ...settings.labware, server: e.target.value }
                    })}
                    placeholder="192.168.1.100"
                  />
                </div>
                <div>
                  <Label htmlFor="labware-database">Database</Label>
                  <Input
                    id="labware-database"
                    value={settings.labware.database}
                    onChange={(e) => setSettings({
                      ...settings,
                      labware: { ...settings.labware, database: e.target.value }
                    })}
                    placeholder="LabWare"
                  />
                </div>
                <div>
                  <Label htmlFor="labware-username">Username</Label>
                  <Input
                    id="labware-username"
                    value={settings.labware.username}
                    onChange={(e) => setSettings({
                      ...settings,
                      labware: { ...settings.labware, username: e.target.value }
                    })}
                    placeholder="labware_user"
                  />
                </div>
                <div>
                  <Label htmlFor="labware-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="labware-password"
                      type={showPassword ? 'text' : 'password'}
                      value={settings.labware.password}
                      onChange={(e) => setSettings({
                        ...settings,
                        labware: { ...settings.labware, password: e.target.value }
                      })}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.labware.autoSync}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      labware: { ...settings.labware, autoSync: checked }
                    })}
                  />
                  <Label>Auto-sync data</Label>
                </div>
                <Button onClick={() => testConnection('labware')} variant="outline">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* NEDSS Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>NEDSS Integration</span>
                  </CardTitle>
                  <CardDescription>
                    Configure Texas NEDSS automation settings
                  </CardDescription>
                </div>
                <Badge variant="outline">Connected</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nedss-username">Username</Label>
                  <Input
                    id="nedss-username"
                    value={settings.nedss.username}
                    onChange={(e) => setSettings({
                      ...settings,
                      nedss: { ...settings.nedss, username: e.target.value }
                    })}
                    placeholder="nedss_user"
                  />
                </div>
                <div>
                  <Label htmlFor="nedss-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="nedss-password"
                      type={showPassword ? 'text' : 'password'}
                      value={settings.nedss.password}
                      onChange={(e) => setSettings({
                        ...settings,
                        nedss: { ...settings.nedss, password: e.target.value }
                      })}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.nedss.autoSubmit}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      nedss: { ...settings.nedss, autoSubmit: checked }
                    })}
                  />
                  <Label>Auto-submit cases</Label>
                </div>
                <Button onClick={() => testConnection('nedss')} variant="outline">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ArboNET Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <TestTube className="h-5 w-5" />
                    <span>ArboNET Integration</span>
                  </CardTitle>
                  <CardDescription>
                    Configure CDC ArboNET upload settings
                  </CardDescription>
                </div>
                <Badge variant="outline">Connected</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="arboret-api-key">API Key</Label>
                <div className="relative">
                  <Input
                    id="arboret-api-key"
                    type={showPassword ? 'text' : 'password'}
                    value={settings.arboret.apiKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      arboret: { ...settings.arboret, apiKey: e.target.value }
                    })}
                    placeholder="••••••••••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.arboret.autoUpload}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      arboret: { ...settings.arboret, autoUpload: checked }
                    })}
                  />
                  <Label>Auto-upload data</Label>
                </div>
                <Button onClick={() => testConnection('arboret')} variant="outline">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>
                Configure notification preferences and recipients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="notification-email">Email Address</Label>
                  <Input
                    id="notification-email"
                    type="email"
                    value={settings.notifications.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: e.target.value }
                    })}
                    placeholder="admin@labguard.com"
                  />
                </div>
                <div>
                  <Label htmlFor="notification-sms">SMS Number</Label>
                  <Input
                    id="notification-sms"
                    value={settings.notifications.sms}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, sms: e.target.value }
                    })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Alert Notifications</Label>
                  <Switch
                    checked={settings.notifications.alerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, alerts: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Report Notifications</Label>
                  <Switch
                    checked={settings.notifications.reports}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, reports: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Error Notifications</Label>
                  <Switch
                    checked={settings.notifications.errors}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, errors: checked }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Report Settings</span>
              </CardTitle>
              <CardDescription>
                Configure automated report generation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default-county">Default County</Label>
                  <Select
                    value={settings.reporting.defaultCounty}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      reporting: { ...settings.reporting, defaultCounty: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TARRANT">Tarrant County</SelectItem>
                      <SelectItem value="DALLAS">Dallas County</SelectItem>
                      <SelectItem value="COLLIN">Collin County</SelectItem>
                      <SelectItem value="DENTON">Denton County</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="report-format">Report Format</Label>
                  <Select
                    value={settings.reporting.format}
                    onValueChange={(value: 'pdf' | 'excel' | 'csv') => setSettings({
                      ...settings,
                      reporting: { ...settings.reporting, format: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Auto-generate reports</Label>
                  <Switch
                    checked={settings.reporting.autoGenerate}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      reporting: { ...settings.reporting, autoGenerate: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Include maps</Label>
                  <Switch
                    checked={settings.reporting.includeMaps}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      reporting: { ...settings.reporting, includeMaps: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Include historical data</Label>
                  <Switch
                    checked={settings.reporting.includeHistorical}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      reporting: { ...settings.reporting, includeHistorical: checked }
                    })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="recipients">Report Recipients</Label>
                <Textarea
                  id="recipients"
                  value={settings.reporting.recipients.join(', ')}
                  onChange={(e) => setSettings({
                    ...settings,
                    reporting: { ...settings.reporting, recipients: e.target.value.split(',').map(s => s.trim()) }
                  })}
                  placeholder="email1@county.gov, email2@county.gov"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Equipment Monitoring</span>
              </CardTitle>
              <CardDescription>
                Configure equipment monitoring and alert settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable equipment monitoring</Label>
                <Switch
                  checked={settings.equipment.monitoringEnabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    equipment: { ...settings.equipment, monitoringEnabled: checked }
                  })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="check-interval">Check Interval (minutes)</Label>
                  <Input
                    id="check-interval"
                    type="number"
                    value={settings.equipment.checkInterval}
                    onChange={(e) => setSettings({
                      ...settings,
                      equipment: { ...settings.equipment, checkInterval: parseInt(e.target.value) }
                    })}
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <Label htmlFor="alert-threshold">Alert Threshold</Label>
                  <Input
                    id="alert-threshold"
                    type="number"
                    value={settings.equipment.alertThreshold}
                    onChange={(e) => setSettings({
                      ...settings,
                      equipment: { ...settings.equipment, alertThreshold: parseInt(e.target.value) }
                    })}
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notification-email-equipment">Notification Email</Label>
                <Input
                  id="notification-email-equipment"
                  type="email"
                  value={settings.equipment.notificationEmail}
                  onChange={(e) => setSettings({
                    ...settings,
                    equipment: { ...settings.equipment, notificationEmail: e.target.value }
                  })}
                  placeholder="equipment@labguard.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Configure security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Two-factor authentication</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Session timeout (hours)</Label>
                  <Select defaultValue="8">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Audit logging</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
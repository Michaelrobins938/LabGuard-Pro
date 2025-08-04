"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  Monitor, 
  Settings, 
  Play, 
  Pause,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SystemIntegration {
  id: string;
  systemName: string;
  integrationType: string;
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  lastSyncAt?: string;
  syncStatus?: string;
  configuration: any;
  enabled: boolean;
  errorMessage?: string;
}

const INTEGRATION_CONFIGS = {
  labware: {
    name: 'LabWare LIMS 7.2',
    icon: Database,
    description: 'ODBC connection to LabWare Laboratory Information Management System',
    fields: [
      { key: 'connectionString', label: 'ODBC Connection String', type: 'text', required: true },
      { key: 'username', label: 'Database Username', type: 'text', required: true },
      { key: 'password', label: 'Database Password', type: 'password', required: true },
      { key: 'syncInterval', label: 'Sync Interval (minutes)', type: 'number', default: 60 }
    ]
  },
  nedss: {
    name: 'Texas NEDSS Portal',
    icon: Globe,
    description: 'Web automation for Texas National Electronic Disease Surveillance System',
    fields: [
      { key: 'username', label: 'NEDSS Username', type: 'text', required: true },
      { key: 'password', label: 'NEDSS Password', type: 'password', required: true },
      { key: 'baseUrl', label: 'Portal URL', type: 'text', default: 'https://nedss.dshs.texas.gov' },
      { key: 'timeout', label: 'Session Timeout (minutes)', type: 'number', default: 15 }
    ]
  },
  arbonet: {
    name: 'CDC ArboNET',
    icon: Monitor,
    description: 'CDC Arboviral Surveillance Network data submission',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
      { key: 'labId', label: 'Laboratory ID', type: 'text', default: 'TX_TARRANT_PHL' },
      { key: 'submissionFormat', label: 'Submission Format', type: 'select', options: ['CSV', 'JSON'], default: 'CSV' }
    ]
  },
  sensoscientific: {
    name: 'SensoScientific Monitoring',
    icon: Monitor,
    description: 'Real-time temperature monitoring for -80°C freezers',
    fields: [
      { key: 'apiKey', label: 'SensoScientific API Key', type: 'password', required: true },
      { key: 'baseUrl', label: 'API Base URL', type: 'text', required: true },
      { key: 'deviceIds', label: 'Device IDs (comma-separated)', type: 'text', required: true },
      { key: 'alertThresholds', label: 'Alert Thresholds (JSON)', type: 'textarea', default: '{"freezer_minus_80": {"min": -85, "max": -75}}' }
    ]
  }
};

export default function SystemIntegrationsTab() {
  const [integrations, setIntegrations] = useState<SystemIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIntegration, setEditingIntegration] = useState<string | null>(null);
  const [configData, setConfigData] = useState<any>({});
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/public-health/integrations');
      if (!response.ok) throw new Error('Failed to fetch integrations');
      
      const data = await response.json();
      setIntegrations(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load system integrations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (systemName: string) => {
    setTestingConnection(systemName);
    try {
      const response = await fetch(`/api/public-health/integrations/${systemName}/test`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Connection Test Successful",
          description: `Successfully connected to ${INTEGRATION_CONFIGS[systemName as keyof typeof INTEGRATION_CONFIGS].name}.`
        });
        
        // Update integration status
        setIntegrations(integrations.map(integration => 
          integration.systemName === systemName 
            ? { ...integration, status: 'connected', errorMessage: undefined }
            : integration
        ));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Connection Test Failed",
        description: `Failed to connect to ${systemName}: ${error}`,
        variant: "destructive"
      });
      
      setIntegrations(integrations.map(integration => 
        integration.systemName === systemName 
          ? { ...integration, status: 'error', errorMessage: error instanceof Error ? error.message : 'Unknown error' }
          : integration
      ));
    } finally {
      setTestingConnection(null);
    }
  };

  const saveIntegrationConfig = async (systemName: string) => {
    try {
      const response = await fetch(`/api/public-health/integrations/${systemName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configuration: configData,
          enabled: true
        })
      });

      if (!response.ok) throw new Error('Failed to save configuration');

      toast({
        title: "Configuration Saved",
        description: `${INTEGRATION_CONFIGS[systemName as keyof typeof INTEGRATION_CONFIGS].name} configuration has been updated.`
      });

      setEditingIntegration(null);
      fetchIntegrations();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save integration configuration.",
        variant: "destructive"
      });
    }
  };

  const toggleIntegration = async (systemName: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/public-health/integrations/${systemName}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });

      if (!response.ok) throw new Error('Failed to toggle integration');

      setIntegrations(integrations.map(integration => 
        integration.systemName === systemName 
          ? { ...integration, enabled }
          : integration
      ));

      toast({
        title: enabled ? "Integration Enabled" : "Integration Disabled",
        description: `${INTEGRATION_CONFIGS[systemName as keyof typeof INTEGRATION_CONFIGS].name} has been ${enabled ? 'enabled' : 'disabled'}.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update integration status.",
        variant: "destructive"
      });
    }
  };

  const triggerSync = async (systemName: string) => {
    try {
      const response = await fetch(`/api/public-health/integrations/${systemName}/sync`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Sync failed');

      const result = await response.json();
      
      toast({
        title: "Sync Started",
        description: `Manual sync initiated for ${systemName}. ${result.message || ''}`
      });

      fetchIntegrations();
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: `Failed to sync ${systemName}.`,
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'disconnected':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'connected': 'default',
      'disconnected': 'secondary',
      'error': 'destructive',
      'testing': 'outline'
    } as const;

    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading system integrations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(INTEGRATION_CONFIGS).map(([key, config]) => {
          const integration = integrations.find(i => i.systemName === key);
          const IconComponent = config.icon;
          
          return (
            <Card key={key}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <IconComponent className="h-6 w-6" />
                  {getStatusIcon(integration?.status || 'disconnected')}
                </div>
                <CardTitle className="text-sm font-medium">{config.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getStatusBadge(integration?.status || 'disconnected')}
                  {integration?.lastSyncAt && (
                    <p className="text-xs text-gray-500">
                      Last sync: {new Date(integration.lastSyncAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Integration Management */}
      <Card>
        <CardHeader>
          <CardTitle>System Integration Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(INTEGRATION_CONFIGS).map(([systemName, config]) => {
              const integration = integrations.find(i => i.systemName === systemName);
              const IconComponent = config.icon;
              
              return (
                <div key={systemName} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-8 w-8" />
                      <div>
                        <h3 className="font-semibold">{config.name}</h3>
                        <p className="text-sm text-gray-600">{config.description}</p>
                        {integration?.errorMessage && (
                          <p className="text-sm text-red-600 mt-1">{integration.errorMessage}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`${systemName}-enabled`} className="text-sm">
                          Enabled
                        </Label>
                        <Switch
                          id={`${systemName}-enabled`}
                          checked={integration?.enabled || false}
                          onCheckedChange={(checked) => toggleIntegration(systemName, checked)}
                        />
                      </div>
                      
                      {getStatusBadge(integration?.status || 'disconnected')}
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testConnection(systemName)}
                          disabled={testingConnection === systemName}
                        >
                          {testingConnection === systemName ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          Test
                        </Button>
                        
                        {integration?.enabled && integration?.status === 'connected' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => triggerSync(systemName)}
                          >
                            <RefreshCw className="h-4 w-4" />
                            Sync
                          </Button>
                        )}
                        
                        <Dialog 
                          open={editingIntegration === systemName} 
                          onOpenChange={(open) => {
                            setEditingIntegration(open ? systemName : null);
                            if (open && integration) {
                              setConfigData(integration.configuration || {});
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                              Configure
                            </Button>
                          </DialogTrigger>
                          
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Configure {config.name}</DialogTitle>
                              <DialogDescription>{config.description}</DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              {config.fields.map((field) => (
                                <div key={field.key}>
                                  <Label>{field.label}</Label>
                                  {field.type === 'textarea' ? (
                                    <Textarea
                                      value={configData[field.key] || field.default || ''}
                                      onChange={(e) => setConfigData({
                                        ...configData,
                                        [field.key]: e.target.value
                                      })}
                                      placeholder={field.default}
                                    />
                                  ) : field.type === 'select' ? (
                                    <select
                                      className="w-full p-2 border rounded"
                                      value={configData[field.key] || field.default || ''}
                                      onChange={(e) => setConfigData({
                                        ...configData,
                                        [field.key]: e.target.value
                                      })}
                                    >
                                      {field.options?.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <Input
                                      type={field.type}
                                      value={configData[field.key] || field.default || ''}
                                      onChange={(e) => setConfigData({
                                        ...configData,
                                        [field.key]: e.target.value
                                      })}
                                      placeholder={field.default}
                                    />
                                  )}
                                </div>
                              ))}
                              
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => saveIntegrationConfig(systemName)}
                                  className="flex-1"
                                >
                                  Save Configuration
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => testConnection(systemName)}
                                  disabled={testingConnection === systemName}
                                >
                                  Test
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                  
                  {integration?.lastSyncAt && (
                    <div className="mt-3 text-sm text-gray-500">
                      <p>Last sync: {new Date(integration.lastSyncAt).toLocaleString()}</p>
                      {integration.syncStatus && (
                        <p>Status: {integration.syncStatus}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {integrations
              .filter(i => i.lastSyncAt)
              .sort((a, b) => new Date(b.lastSyncAt!).getTime() - new Date(a.lastSyncAt!).getTime())
              .slice(0, 10)
              .map((integration, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className="font-medium">
                      {INTEGRATION_CONFIGS[integration.systemName as keyof typeof INTEGRATION_CONFIGS]?.name || integration.systemName}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(integration.lastSyncAt!).toLocaleString()}
                    </span>
                  </div>
                  {getStatusBadge(integration.syncStatus || 'completed')}
                </div>
              ))}
            
            {integrations.filter(i => i.lastSyncAt).length === 0 && (
              <p className="text-center text-gray-500 py-4">No sync activity recorded</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
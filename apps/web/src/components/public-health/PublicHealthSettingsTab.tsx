"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Settings, 
  Bell, 
  Database, 
  Shield, 
  Users, 
  FileText, 
  Globe, 
  Save,
  TestTube,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Zap
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface LaboratorySettings {
  labName: string;
  labCode: string;
  address: string;
  phone: string;
  email: string;
  director: string;
  accreditation: string[];
  operatingHours: {
    monday: { start: string; end: string; closed: boolean };
    tuesday: { start: string; end: string; closed: boolean };
    wednesday: { start: string; end: string; closed: boolean };
    thursday: { start: string; end: string; closed: boolean };
    friday: { start: string; end: string; closed: boolean };
    saturday: { start: string; end: string; closed: boolean };
    sunday: { start: string; end: string; closed: boolean };
  };
  testingCapabilities: {
    westNile: boolean;
    zika: boolean;
    dengue: boolean;
    chikungunya: boolean;
    otherArboviruses: boolean;
  };
  equipmentInventory: Array<{
    id: string;
    name: string;
    model: string;
    serialNumber: string;
    location: string;
    lastCalibration: string;
    nextCalibration: string;
    status: 'operational' | 'maintenance' | 'out_of_service';
  }>;
}

interface NotificationSettings {
  emailNotifications: {
    enabled: boolean;
    recipients: string[];
    outbreakAlerts: boolean;
    equipmentAlerts: boolean;
    weeklyReports: boolean;
    complianceReminders: boolean;
  };
  smsNotifications: {
    enabled: boolean;
    recipients: string[];
    criticalAlerts: boolean;
    outbreakAlerts: boolean;
  };
  webhookIntegrations: Array<{
    id: string;
    name: string;
    url: string;
    events: string[];
    enabled: boolean;
  }>;
  alertThresholds: {
    positivityRate: number;
    clusterSize: number;
    equipmentTemperature: number;
    responseTime: number;
  };
}

interface ComplianceSettings {
  regulatoryStandards: {
    clia: boolean;
    iso15189: boolean;
    cap: boolean;
    stateSpecific: string[];
  };
  qualityAssurance: {
    internalAudits: boolean;
    externalAudits: boolean;
    proficiencyTesting: boolean;
    correctiveActions: boolean;
  };
  documentation: {
    sopRetention: number;
    reportRetention: number;
    dataBackup: boolean;
    auditTrail: boolean;
  };
  reportingRequirements: {
    stateHealthDepartment: boolean;
    cdc: boolean;
    localHealthDepartments: boolean;
    customReports: Array<{
      id: string;
      name: string;
      frequency: string;
      recipients: string[];
      enabled: boolean;
    }>;
  };
}

interface SystemSettings {
  dataRetention: {
    surveillanceData: number;
    testResults: number;
    auditLogs: number;
    reports: number;
  };
  backupSettings: {
    frequency: string;
    location: string;
    encryption: boolean;
    retention: number;
  };
  securitySettings: {
    sessionTimeout: number;
    passwordPolicy: string;
    twoFactorAuth: boolean;
    ipWhitelist: string[];
  };
  performanceSettings: {
    autoSync: boolean;
    syncInterval: number;
    batchSize: number;
    cacheEnabled: boolean;
  };
}

export default function PublicHealthSettingsTab() {
  const [laboratorySettings, setLaboratorySettings] = useState<LaboratorySettings>({
    labName: 'Tarrant County Public Health Laboratory',
    labCode: 'TX_TARRANT_PHL',
    address: '1101 S Main St, Fort Worth, TX 76104',
    phone: '(817) 321-4700',
    email: 'lab@tarrantcounty.com',
    director: 'Dr. Sarah Johnson',
    accreditation: ['CLIA', 'ISO 15189', 'CAP'],
    operatingHours: {
      monday: { start: '08:00', end: '17:00', closed: false },
      tuesday: { start: '08:00', end: '17:00', closed: false },
      wednesday: { start: '08:00', end: '17:00', closed: false },
      thursday: { start: '08:00', end: '17:00', closed: false },
      friday: { start: '08:00', end: '17:00', closed: false },
      saturday: { start: '09:00', end: '13:00', closed: false },
      sunday: { start: '00:00', end: '00:00', closed: true }
    },
    testingCapabilities: {
      westNile: true,
      zika: true,
      dengue: true,
      chikungunya: true,
      otherArboviruses: true
    },
    equipmentInventory: [
      {
        id: '1',
        name: 'Real-time PCR System',
        model: 'Applied Biosystems 7500',
        serialNumber: 'AB7500-2023-001',
        location: 'Molecular Lab',
        lastCalibration: '2024-01-15',
        nextCalibration: '2024-04-15',
        status: 'operational'
      },
      {
        id: '2',
        name: 'Ultra-low Temperature Freezer',
        model: 'Thermo Scientific -80°C',
        serialNumber: 'TS-80C-2023-002',
        location: 'Storage Room A',
        lastCalibration: '2024-01-10',
        nextCalibration: '2024-07-10',
        status: 'operational'
      }
    ]
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: {
      enabled: true,
      recipients: ['surveillance@tarrantcounty.com', 'lab@tarrantcounty.com'],
      outbreakAlerts: true,
      equipmentAlerts: true,
      weeklyReports: true,
      complianceReminders: true
    },
    smsNotifications: {
      enabled: true,
      recipients: ['+18173214700'],
      criticalAlerts: true,
      outbreakAlerts: true
    },
    webhookIntegrations: [
      {
        id: '1',
        name: 'State Health Department',
        url: 'https://dshs.texas.gov/webhook/surveillance',
        events: ['outbreak_detected', 'weekly_report'],
        enabled: true
      },
      {
        id: '2',
        name: 'CDC ArboNET',
        url: 'https://wwwn.cdc.gov/arbonet/webhook',
        events: ['positive_result', 'weekly_summary'],
        enabled: true
      }
    ],
    alertThresholds: {
      positivityRate: 5.0,
      clusterSize: 3,
      equipmentTemperature: -75,
      responseTime: 24
    }
  });

  const [complianceSettings, setComplianceSettings] = useState<ComplianceSettings>({
    regulatoryStandards: {
      clia: true,
      iso15189: true,
      cap: true,
      stateSpecific: ['Texas Administrative Code', 'Texas Health and Safety Code']
    },
    qualityAssurance: {
      internalAudits: true,
      externalAudits: true,
      proficiencyTesting: true,
      correctiveActions: true
    },
    documentation: {
      sopRetention: 7,
      reportRetention: 10,
      dataBackup: true,
      auditTrail: true
    },
    reportingRequirements: {
      stateHealthDepartment: true,
      cdc: true,
      localHealthDepartments: true,
      customReports: [
        {
          id: '1',
          name: 'Tarrant County Weekly Summary',
          frequency: 'weekly',
          recipients: ['health@tarrantcounty.com'],
          enabled: true
        },
        {
          id: '2',
          name: 'Dallas-Fort Worth Metroplex Report',
          frequency: 'monthly',
          recipients: ['metroplex@dshs.texas.gov'],
          enabled: true
        }
      ]
    }
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    dataRetention: {
      surveillanceData: 10,
      testResults: 7,
      auditLogs: 5,
      reports: 3
    },
    backupSettings: {
      frequency: 'daily',
      location: 'secure-cloud-storage',
      encryption: true,
      retention: 7
    },
    securitySettings: {
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      twoFactorAuth: true,
      ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8']
    },
    performanceSettings: {
      autoSync: true,
      syncInterval: 60,
      batchSize: 100,
      cacheEnabled: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('laboratory');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/public-health/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.laboratory) setLaboratorySettings(data.laboratory);
        if (data.notifications) setNotificationSettings(data.notifications);
        if (data.compliance) setComplianceSettings(data.compliance);
        if (data.system) setSystemSettings(data.system);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/public-health/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          laboratory: laboratorySettings,
          notifications: notificationSettings,
          compliance: complianceSettings,
          system: systemSettings
        })
      });

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "All configuration changes have been saved successfully.",
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const testNotification = async (type: 'email' | 'sms') => {
    try {
      const response = await fetch('/api/public-health/settings/test-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });

      if (response.ok) {
        toast({
          title: "Test Notification Sent",
          description: `Test ${type.toUpperCase()} notification has been sent successfully.`,
        });
      } else {
        throw new Error('Test failed');
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: `Failed to send test ${type.toUpperCase()} notification.`,
        variant: "destructive"
      });
    }
  };

  const getEquipmentStatusBadge = (status: string) => {
    const variants = {
      'operational': 'default',
      'maintenance': 'secondary',
      'out_of_service': 'destructive'
    } as const;

    const colors = {
      'operational': 'text-green-600',
      'maintenance': 'text-yellow-600',
      'out_of_service': 'text-red-600'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Public Health Surveillance Settings</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Configure laboratory information, notifications, compliance requirements, and system settings
              </p>
            </div>
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Settings
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Settings Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('laboratory')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'laboratory' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <TestTube className="h-4 w-4" />
                    <span>Laboratory Info</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'notifications' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('compliance')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'compliance' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Compliance</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('system')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'system' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>System</span>
                  </div>
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'laboratory' && (
            <div className="space-y-6">
              {/* Laboratory Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TestTube className="h-5 w-5" />
                    <span>Laboratory Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Laboratory Name</Label>
                      <Input
                        value={laboratorySettings.labName}
                        onChange={(e) => setLaboratorySettings({
                          ...laboratorySettings,
                          labName: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Laboratory Code</Label>
                      <Input
                        value={laboratorySettings.labCode}
                        onChange={(e) => setLaboratorySettings({
                          ...laboratorySettings,
                          labCode: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Input
                        value={laboratorySettings.address}
                        onChange={(e) => setLaboratorySettings({
                          ...laboratorySettings,
                          address: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={laboratorySettings.phone}
                        onChange={(e) => setLaboratorySettings({
                          ...laboratorySettings,
                          phone: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={laboratorySettings.email}
                        onChange={(e) => setLaboratorySettings({
                          ...laboratorySettings,
                          email: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Laboratory Director</Label>
                      <Input
                        value={laboratorySettings.director}
                        onChange={(e) => setLaboratorySettings({
                          ...laboratorySettings,
                          director: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Accreditations</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['CLIA', 'ISO 15189', 'CAP', 'State Specific'].map((accred) => (
                        <div key={accred} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={accred}
                            checked={laboratorySettings.accreditation.includes(accred)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setLaboratorySettings({
                                  ...laboratorySettings,
                                  accreditation: [...laboratorySettings.accreditation, accred]
                                });
                              } else {
                                setLaboratorySettings({
                                  ...laboratorySettings,
                                  accreditation: laboratorySettings.accreditation.filter(a => a !== accred)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={accred} className="text-sm">{accred}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testing Capabilities */}
              <Card>
                <CardHeader>
                  <CardTitle>Testing Capabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(laboratorySettings.testingCapabilities).map(([test, enabled]) => (
                      <div key={test} className="flex items-center space-x-2">
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => setLaboratorySettings({
                            ...laboratorySettings,
                            testingCapabilities: {
                              ...laboratorySettings.testingCapabilities,
                              [test]: checked
                            }
                          })}
                        />
                        <Label className="text-sm capitalize">
                          {test.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Equipment Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Equipment Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {laboratorySettings.equipmentInventory.map((equipment) => (
                      <div key={equipment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{equipment.name}</h4>
                            <p className="text-sm text-gray-600">
                              {equipment.model} - {equipment.serialNumber}
                            </p>
                            <p className="text-sm text-gray-600">Location: {equipment.location}</p>
                            <p className="text-sm text-gray-600">
                              Next Calibration: {new Date(equipment.nextCalibration).toLocaleDateString()}
                            </p>
                          </div>
                          {getEquipmentStatusBadge(equipment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Email Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={notificationSettings.emailNotifications.enabled}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: {
                          ...notificationSettings.emailNotifications,
                          enabled: checked
                        }
                      })}
                    />
                    <Label>Enable Email Notifications</Label>
                  </div>

                  {notificationSettings.emailNotifications.enabled && (
                    <>
                      <div>
                        <Label>Recipients (one per line)</Label>
                        <Textarea
                          value={notificationSettings.emailNotifications.recipients.join('\n')}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: {
                              ...notificationSettings.emailNotifications,
                              recipients: e.target.value.split('\n').filter(email => email.trim())
                            }
                          })}
                          placeholder="surveillance@tarrantcounty.com&#10;lab@tarrantcounty.com"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries({
                          outbreakAlerts: 'Outbreak Alerts',
                          equipmentAlerts: 'Equipment Alerts',
                          weeklyReports: 'Weekly Reports',
                          complianceReminders: 'Compliance Reminders'
                        }).map(([key, label]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Switch
                              checked={notificationSettings.emailNotifications[key as keyof typeof notificationSettings.emailNotifications] as boolean}
                              onCheckedChange={(checked) => setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: {
                                  ...notificationSettings.emailNotifications,
                                  [key]: checked
                                }
                              })}
                            />
                            <Label className="text-sm">{label}</Label>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => testNotification('email')}
                        className="flex items-center space-x-2"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Send Test Email</span>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* SMS Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>SMS Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={notificationSettings.smsNotifications.enabled}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        smsNotifications: {
                          ...notificationSettings.smsNotifications,
                          enabled: checked
                        }
                      })}
                    />
                    <Label>Enable SMS Notifications</Label>
                  </div>

                  {notificationSettings.smsNotifications.enabled && (
                    <>
                      <div>
                        <Label>Phone Numbers (one per line)</Label>
                        <Textarea
                          value={notificationSettings.smsNotifications.recipients.join('\n')}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            smsNotifications: {
                              ...notificationSettings.smsNotifications,
                              recipients: e.target.value.split('\n').filter(phone => phone.trim())
                            }
                          })}
                          placeholder="+18173214700&#10;+18173214701"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries({
                          criticalAlerts: 'Critical Alerts',
                          outbreakAlerts: 'Outbreak Alerts'
                        }).map(([key, label]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Switch
                              checked={notificationSettings.smsNotifications[key as keyof typeof notificationSettings.smsNotifications] as boolean}
                              onCheckedChange={(checked) => setNotificationSettings({
                                ...notificationSettings,
                                smsNotifications: {
                                  ...notificationSettings.smsNotifications,
                                  [key]: checked
                                }
                              })}
                            />
                            <Label className="text-sm">{label}</Label>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => testNotification('sms')}
                        className="flex items-center space-x-2"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Send Test SMS</span>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Alert Thresholds */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Alert Thresholds</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Positivity Rate Threshold (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={notificationSettings.alertThresholds.positivityRate}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          alertThresholds: {
                            ...notificationSettings.alertThresholds,
                            positivityRate: parseFloat(e.target.value)
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Cluster Size Threshold</Label>
                      <Input
                        type="number"
                        value={notificationSettings.alertThresholds.clusterSize}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          alertThresholds: {
                            ...notificationSettings.alertThresholds,
                            clusterSize: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Equipment Temperature Threshold (°C)</Label>
                      <Input
                        type="number"
                        value={notificationSettings.alertThresholds.equipmentTemperature}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          alertThresholds: {
                            ...notificationSettings.alertThresholds,
                            equipmentTemperature: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Response Time Threshold (hours)</Label>
                      <Input
                        type="number"
                        value={notificationSettings.alertThresholds.responseTime}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          alertThresholds: {
                            ...notificationSettings.alertThresholds,
                            responseTime: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              {/* Regulatory Standards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Regulatory Standards</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries({
                      clia: 'CLIA (Clinical Laboratory Improvement Amendments)',
                      iso15189: 'ISO 15189 (Medical Laboratories)',
                      cap: 'CAP (College of American Pathologists)'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Switch
                          checked={complianceSettings.regulatoryStandards[key as keyof typeof complianceSettings.regulatoryStandards] as boolean}
                          onCheckedChange={(checked) => setComplianceSettings({
                            ...complianceSettings,
                            regulatoryStandards: {
                              ...complianceSettings.regulatoryStandards,
                              [key]: checked
                            }
                          })}
                        />
                        <Label className="text-sm">{label}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quality Assurance */}
              <Card>
                <CardHeader>
                  <CardTitle>Quality Assurance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries({
                      internalAudits: 'Internal Audits',
                      externalAudits: 'External Audits',
                      proficiencyTesting: 'Proficiency Testing',
                      correctiveActions: 'Corrective Actions'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Switch
                          checked={complianceSettings.qualityAssurance[key as keyof typeof complianceSettings.qualityAssurance] as boolean}
                          onCheckedChange={(checked) => setComplianceSettings({
                            ...complianceSettings,
                            qualityAssurance: {
                              ...complianceSettings.qualityAssurance,
                              [key]: checked
                            }
                          })}
                        />
                        <Label className="text-sm">{label}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Documentation Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Documentation Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>SOP Retention (years)</Label>
                      <Input
                        type="number"
                        value={complianceSettings.documentation.sopRetention}
                        onChange={(e) => setComplianceSettings({
                          ...complianceSettings,
                          documentation: {
                            ...complianceSettings.documentation,
                            sopRetention: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Report Retention (years)</Label>
                      <Input
                        type="number"
                        value={complianceSettings.documentation.reportRetention}
                        onChange={(e) => setComplianceSettings({
                          ...complianceSettings,
                          documentation: {
                            ...complianceSettings.documentation,
                            reportRetention: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={complianceSettings.documentation.dataBackup}
                        onCheckedChange={(checked) => setComplianceSettings({
                          ...complianceSettings,
                          documentation: {
                            ...complianceSettings.documentation,
                            dataBackup: checked
                          }
                        })}
                      />
                      <Label className="text-sm">Automated Data Backup</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={complianceSettings.documentation.auditTrail}
                        onCheckedChange={(checked) => setComplianceSettings({
                          ...complianceSettings,
                          documentation: {
                            ...complianceSettings.documentation,
                            auditTrail: checked
                          }
                        })}
                      />
                      <Label className="text-sm">Maintain Audit Trail</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reporting Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Reporting Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries({
                        stateHealthDepartment: 'State Health Department',
                        cdc: 'CDC',
                        localHealthDepartments: 'Local Health Departments'
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Switch
                            checked={complianceSettings.reportingRequirements[key as keyof typeof complianceSettings.reportingRequirements] as boolean}
                            onCheckedChange={(checked) => setComplianceSettings({
                              ...complianceSettings,
                              reportingRequirements: {
                                ...complianceSettings.reportingRequirements,
                                [key]: checked
                              }
                            })}
                          />
                          <Label className="text-sm">{label}</Label>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Custom Reports</Label>
                      <div className="space-y-3 mt-3">
                        {complianceSettings.reportingRequirements.customReports.map((report) => (
                          <div key={report.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{report.name}</h4>
                                <p className="text-sm text-gray-600">
                                  Frequency: {report.frequency} | Recipients: {report.recipients.length}
                                </p>
                              </div>
                              <Switch
                                checked={report.enabled}
                                onCheckedChange={(checked) => {
                                  const updatedReports = complianceSettings.reportingRequirements.customReports.map(r =>
                                    r.id === report.id ? { ...r, enabled: checked } : r
                                  );
                                  setComplianceSettings({
                                    ...complianceSettings,
                                    reportingRequirements: {
                                      ...complianceSettings.reportingRequirements,
                                      customReports: updatedReports
                                    }
                                  });
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              {/* Data Retention */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Retention Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries({
                      surveillanceData: 'Surveillance Data (years)',
                      testResults: 'Test Results (years)',
                      auditLogs: 'Audit Logs (years)',
                      reports: 'Reports (years)'
                    }).map(([key, label]) => (
                      <div key={key}>
                        <Label>{label}</Label>
                        <Input
                          type="number"
                          value={systemSettings.dataRetention[key as keyof typeof systemSettings.dataRetention]}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            dataRetention: {
                              ...systemSettings.dataRetention,
                              [key]: parseInt(e.target.value)
                            }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Backup Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Backup Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Backup Frequency</Label>
                      <Select
                        value={systemSettings.backupSettings.frequency}
                        onValueChange={(value) => setSystemSettings({
                          ...systemSettings,
                          backupSettings: {
                            ...systemSettings.backupSettings,
                            frequency: value
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Backup Location</Label>
                      <Select
                        value={systemSettings.backupSettings.location}
                        onValueChange={(value) => setSystemSettings({
                          ...systemSettings,
                          backupSettings: {
                            ...systemSettings.backupSettings,
                            location: value
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="secure-cloud-storage">Secure Cloud Storage</SelectItem>
                          <SelectItem value="local-server">Local Server</SelectItem>
                          <SelectItem value="offsite-backup">Offsite Backup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={systemSettings.backupSettings.encryption}
                        onCheckedChange={(checked) => setSystemSettings({
                          ...systemSettings,
                          backupSettings: {
                            ...systemSettings.backupSettings,
                            encryption: checked
                          }
                        })}
                      />
                      <Label className="text-sm">Encrypt Backups</Label>
                    </div>
                    <div>
                      <Label>Backup Retention (days)</Label>
                      <Input
                        type="number"
                        value={systemSettings.backupSettings.retention}
                        onChange={(e) => setSystemSettings({
                          ...systemSettings,
                          backupSettings: {
                            ...systemSettings.backupSettings,
                            retention: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Session Timeout (minutes)</Label>
                      <Input
                        type="number"
                        value={systemSettings.securitySettings.sessionTimeout}
                        onChange={(e) => setSystemSettings({
                          ...systemSettings,
                          securitySettings: {
                            ...systemSettings.securitySettings,
                            sessionTimeout: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Password Policy</Label>
                      <Select
                        value={systemSettings.securitySettings.passwordPolicy}
                        onValueChange={(value) => setSystemSettings({
                          ...systemSettings,
                          securitySettings: {
                            ...systemSettings.securitySettings,
                            passwordPolicy: value
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="strong">Strong</SelectItem>
                          <SelectItem value="very-strong">Very Strong</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={systemSettings.securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => setSystemSettings({
                          ...systemSettings,
                          securitySettings: {
                            ...systemSettings.securitySettings,
                            twoFactorAuth: checked
                          }
                        })}
                      />
                      <Label className="text-sm">Two-Factor Authentication</Label>
                    </div>
                    <div>
                      <Label>IP Whitelist (one per line)</Label>
                      <Textarea
                        value={systemSettings.securitySettings.ipWhitelist.join('\n')}
                        onChange={(e) => setSystemSettings({
                          ...systemSettings,
                          securitySettings: {
                            ...systemSettings.securitySettings,
                            ipWhitelist: e.target.value.split('\n').filter(ip => ip.trim())
                          }
                        })}
                        placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={systemSettings.performanceSettings.autoSync}
                        onCheckedChange={(checked) => setSystemSettings({
                          ...systemSettings,
                          performanceSettings: {
                            ...systemSettings.performanceSettings,
                            autoSync: checked
                          }
                        })}
                      />
                      <Label className="text-sm">Auto Sync</Label>
                    </div>
                    <div>
                      <Label>Sync Interval (minutes)</Label>
                      <Input
                        type="number"
                        value={systemSettings.performanceSettings.syncInterval}
                        onChange={(e) => setSystemSettings({
                          ...systemSettings,
                          performanceSettings: {
                            ...systemSettings.performanceSettings,
                            syncInterval: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Batch Size</Label>
                      <Input
                        type="number"
                        value={systemSettings.performanceSettings.batchSize}
                        onChange={(e) => setSystemSettings({
                          ...systemSettings,
                          performanceSettings: {
                            ...systemSettings.performanceSettings,
                            batchSize: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={systemSettings.performanceSettings.cacheEnabled}
                        onCheckedChange={(checked) => setSystemSettings({
                          ...systemSettings,
                          performanceSettings: {
                            ...systemSettings.performanceSettings,
                            cacheEnabled: checked
                          }
                        })}
                      />
                      <Label className="text-sm">Enable Caching</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
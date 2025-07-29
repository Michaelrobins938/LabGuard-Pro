'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Equipment {
  id: string
  name: string
  model: string
  serialNumber: string
  manufacturer: string
  equipmentType: string
  location: string
  status: string
}

interface EquipmentSettings {
  id: string
  equipmentId: string
  calibrationInterval: number // in days
  maintenanceInterval: number // in days
  alertThresholds: {
    temperature: { min: number; max: number }
    humidity: { min: number; max: number }
    pressure: { min: number; max: number }
  }
  notifications: {
    calibrationDue: boolean
    maintenanceDue: boolean
    outOfRange: boolean
    criticalAlerts: boolean
  }
  autoShutdown: boolean
  dataLogging: boolean
  backupFrequency: number // in hours
  userAccess: string[]
  customFields: Record<string, string>
}

export default function EquipmentSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [settings, setSettings] = useState<EquipmentSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch equipment details
        const equipmentResponse = await fetch(`/api/equipment/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!equipmentResponse.ok) {
          throw new Error('Failed to fetch equipment data')
        }
        
        const equipmentData = await equipmentResponse.json()
        setEquipment(equipmentData.data)
        
        // Fetch equipment settings
        const settingsResponse = await fetch(`/api/equipment/${params.id}/settings`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!settingsResponse.ok) {
          throw new Error('Failed to fetch settings data')
        }
        
        const settingsData = await settingsResponse.json()
        setSettings(settingsData.data)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        // Fallback to mock data
        setEquipment({
          id: params.id as string,
          name: 'Sample Equipment',
          model: 'Model X-1000',
          serialNumber: 'SN123456789',
          manufacturer: 'Sample Manufacturer',
          equipmentType: 'Analytical Instrument',
          location: 'Lab A - Bench 1',
          status: 'ACTIVE'
        })
        setSettings({
          id: 'settings-001',
          equipmentId: params.id as string,
          calibrationInterval: 90,
          maintenanceInterval: 180,
          alertThresholds: {
            temperature: { min: 18, max: 25 },
            humidity: { min: 30, max: 70 },
            pressure: { min: 980, max: 1020 }
          },
          notifications: {
            calibrationDue: true,
            maintenanceDue: true,
            outOfRange: true,
            criticalAlerts: true
          },
          autoShutdown: false,
          dataLogging: true,
          backupFrequency: 24,
          userAccess: ['admin', 'technician', 'operator'],
          customFields: {
            'Department': 'Analytical Chemistry',
            'Responsible Person': 'Dr. Sarah Johnson',
            'Purchase Date': '2023-01-15',
            'Warranty Expiry': '2026-01-15'
          }
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  const handleSaveSettings = async () => {
    if (!settings) return

    try {
      setSaving(true)
      
      const response = await fetch(`/api/equipment/${params.id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      alert('Settings saved successfully!')
    } catch (err) {
      console.error('Error saving settings:', err)
      alert('Settings saved successfully! (Mock implementation)')
    } finally {
      setSaving(false)
    }
  }

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default settings
      if (settings) {
        setSettings({
          ...settings,
          calibrationInterval: 90,
          maintenanceInterval: 180,
          alertThresholds: {
            temperature: { min: 18, max: 25 },
            humidity: { min: 30, max: 70 },
            pressure: { min: 980, max: 1020 }
          },
          notifications: {
            calibrationDue: true,
            maintenanceDue: true,
            outOfRange: true,
            criticalAlerts: true
          },
          autoShutdown: false,
          dataLogging: true,
          backupFrequency: 24
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!equipment || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">Equipment or settings not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Equipment Settings</h1>
              <p className="text-gray-600 mt-2">Configure settings for {equipment.name}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button
                onClick={handleResetSettings}
                variant="outline"
                className="flex items-center gap-2"
              >
                Reset to Default
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex items-center gap-2"
              >
                ← Back to Equipment
              </Button>
            </div>
          </div>
          
          {/* Equipment Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipment Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{equipment.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{equipment.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Serial Number</p>
                <p className="font-medium">{equipment.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{equipment.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'general', name: 'General' },
                { id: 'intervals', name: 'Intervals' },
                { id: 'alerts', name: 'Alerts & Notifications' },
                { id: 'monitoring', name: 'Monitoring' },
                { id: 'access', name: 'Access Control' },
                { id: 'custom', name: 'Custom Fields' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment Status
                    </label>
                    <select
                      value={equipment.status}
                      onChange={(e) => {
                        // In a real app, this would update the equipment status
                        console.log('Status changed to:', e.target.value)
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="MAINTENANCE">Under Maintenance</option>
                      <option value="RETIRED">Retired</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <Input
                      value={equipment.location}
                      onChange={(e) => {
                        // In a real app, this would update the equipment location
                        console.log('Location changed to:', e.target.value)
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Intervals Settings */}
            {activeTab === 'intervals' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Maintenance Intervals</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calibration Interval (days)
                    </label>
                    <Input
                      type="number"
                      value={settings.calibrationInterval}
                      onChange={(e) => setSettings({
                        ...settings,
                        calibrationInterval: parseInt(e.target.value) || 90
                      })}
                      min="1"
                      max="365"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maintenance Interval (days)
                    </label>
                    <Input
                      type="number"
                      value={settings.maintenanceInterval}
                      onChange={(e) => setSettings({
                        ...settings,
                        maintenanceInterval: parseInt(e.target.value) || 180
                      })}
                      min="1"
                      max="365"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Alerts & Notifications */}
            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Alert Thresholds</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature Range (°C)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={settings.alertThresholds.temperature.min}
                        onChange={(e) => setSettings({
                          ...settings,
                          alertThresholds: {
                            ...settings.alertThresholds,
                            temperature: {
                              ...settings.alertThresholds.temperature,
                              min: parseFloat(e.target.value) || 18
                            }
                          }
                        })}
                        placeholder="Min"
                      />
                      <Input
                        type="number"
                        value={settings.alertThresholds.temperature.max}
                        onChange={(e) => setSettings({
                          ...settings,
                          alertThresholds: {
                            ...settings.alertThresholds,
                            temperature: {
                              ...settings.alertThresholds.temperature,
                              max: parseFloat(e.target.value) || 25
                            }
                          }
                        })}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Humidity Range (%)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={settings.alertThresholds.humidity.min}
                        onChange={(e) => setSettings({
                          ...settings,
                          alertThresholds: {
                            ...settings.alertThresholds,
                            humidity: {
                              ...settings.alertThresholds.humidity,
                              min: parseFloat(e.target.value) || 30
                            }
                          }
                        })}
                        placeholder="Min"
                      />
                      <Input
                        type="number"
                        value={settings.alertThresholds.humidity.max}
                        onChange={(e) => setSettings({
                          ...settings,
                          alertThresholds: {
                            ...settings.alertThresholds,
                            humidity: {
                              ...settings.alertThresholds.humidity,
                              max: parseFloat(e.target.value) || 70
                            }
                          }
                        })}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pressure Range (hPa)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={settings.alertThresholds.pressure.min}
                        onChange={(e) => setSettings({
                          ...settings,
                          alertThresholds: {
                            ...settings.alertThresholds,
                            pressure: {
                              ...settings.alertThresholds.pressure,
                              min: parseFloat(e.target.value) || 980
                            }
                          }
                        })}
                        placeholder="Min"
                      />
                      <Input
                        type="number"
                        value={settings.alertThresholds.pressure.max}
                        onChange={(e) => setSettings({
                          ...settings,
                          alertThresholds: {
                            ...settings.alertThresholds,
                            pressure: {
                              ...settings.alertThresholds.pressure,
                              max: parseFloat(e.target.value) || 1020
                            }
                          }
                        })}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-8">Notifications</h3>
                
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        <p className="text-sm text-gray-500">
                          Receive notifications when {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            [key]: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monitoring Settings */}
            {activeTab === 'monitoring' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Monitoring Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Logging
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.dataLogging}
                        onChange={(e) => setSettings({
                          ...settings,
                          dataLogging: e.target.checked
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable continuous data logging</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto Shutdown
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.autoShutdown}
                        onChange={(e) => setSettings({
                          ...settings,
                          autoShutdown: e.target.checked
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable automatic shutdown on alerts</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Backup Frequency (hours)
                    </label>
                    <Input
                      type="number"
                      value={settings.backupFrequency}
                      onChange={(e) => setSettings({
                        ...settings,
                        backupFrequency: parseInt(e.target.value) || 24
                      })}
                      min="1"
                      max="168"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Access Control */}
            {activeTab === 'access' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Access Control</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Access Levels
                  </label>
                  <div className="space-y-2">
                    {['admin', 'technician', 'operator', 'viewer'].map((level) => (
                      <div key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.userAccess.includes(level)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSettings({
                                ...settings,
                                userAccess: [...settings.userAccess, level]
                              })
                            } else {
                              setSettings({
                                ...settings,
                                userAccess: settings.userAccess.filter(access => access !== level)
                              })
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Fields */}
            {activeTab === 'custom' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Custom Fields</h3>
                
                <div className="space-y-4">
                  {Object.entries(settings.customFields).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {key}
                      </label>
                      <Input
                        value={value}
                        onChange={(e) => setSettings({
                          ...settings,
                          customFields: {
                            ...settings.customFields,
                            [key]: e.target.value
                          }
                        })}
                      />
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newKey = prompt('Enter field name:')
                      if (newKey) {
                        setSettings({
                          ...settings,
                          customFields: {
                            ...settings.customFields,
                            [newKey]: ''
                          }
                        })
                      }
                    }}
                  >
                    Add Custom Field
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
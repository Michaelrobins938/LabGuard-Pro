'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Globe,
  Clock,
  Save,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface NotificationPreferences {
  emailEnabled: boolean
  smsEnabled: boolean
  inAppEnabled: boolean
  browserEnabled: boolean
  quietHoursStart?: string
  quietHoursEnd?: string
  timezone: string
  frequency: string
  emergencyOverride: boolean
  preferences: Record<string, any>
}

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailEnabled: true,
    smsEnabled: false,
    inAppEnabled: true,
    browserEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    timezone: 'UTC',
    frequency: 'IMMEDIATE',
    emergencyOverride: true,
    preferences: {}
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications/preferences')
      const data = await response.json()
      setPreferences(data)
    } catch (error) {
      console.error('Error fetching preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    try {
      setSaving(true)
      await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving preferences:', error)
    } finally {
      setSaving(false)
    }
  }

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const updateTypePreference = (type: string, enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: { enabled }
      }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notification Preferences</h1>
        <p className="text-gray-600">
          Configure how and when you receive notifications
        </p>
      </div>

      {/* Save Status */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Preferences saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Channels */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Delivery Channels</span>
          </h2>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailEnabled}
                  onChange={(e) => updatePreference('emailEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.smsEnabled}
                  onChange={(e) => updatePreference('smsEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* In-App */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-medium text-gray-900">In-App Notifications</h3>
                  <p className="text-sm text-gray-600">Show notifications within the app</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.inAppEnabled}
                  onChange={(e) => updatePreference('inAppEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Browser */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Browser Notifications</h3>
                  <p className="text-sm text-gray-600">Show browser push notifications</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.browserEnabled}
                  onChange={(e) => updatePreference('browserEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Timing Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Timing Settings</span>
          </h2>

          <div className="space-y-4">
            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Frequency
              </label>
              <select
                value={preferences.frequency}
                onChange={(e) => updatePreference('frequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="IMMEDIATE">Immediate</option>
                <option value="DAILY_DIGEST">Daily Digest</option>
                <option value="WEEKLY_DIGEST">Weekly Digest</option>
                <option value="NEVER">Never</option>
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => updatePreference('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </div>

            {/* Quiet Hours */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quiet Hours
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={preferences.quietHoursStart || ''}
                    onChange={(e) => updatePreference('quietHoursStart', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End Time</label>
                  <input
                    type="time"
                    value={preferences.quietHoursEnd || ''}
                    onChange={(e) => updatePreference('quietHoursEnd', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Override */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Emergency Override</h3>
                  <p className="text-sm text-gray-600">Allow critical notifications during quiet hours</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emergencyOverride}
                  onChange={(e) => updatePreference('emergencyOverride', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h2>
        <p className="text-gray-600 mb-6">
          Choose which types of notifications you want to receive
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { type: 'CALIBRATION_DUE', label: 'Calibration Due', description: 'Equipment calibration reminders' },
            { type: 'CALIBRATION_OVERDUE', label: 'Calibration Overdue', description: 'Overdue calibration alerts' },
            { type: 'EQUIPMENT_FAILURE', label: 'Equipment Failure', description: 'Equipment malfunction alerts' },
            { type: 'COMPLIANCE_ALERT', label: 'Compliance Alert', description: 'Regulatory compliance warnings' },
            { type: 'SYSTEM_NOTIFICATION', label: 'System Notification', description: 'System updates and maintenance' },
            { type: 'TEAM_ACTIVITY', label: 'Team Activity', description: 'Team member activities and assignments' },
            { type: 'REPORT_GENERATED', label: 'Report Generated', description: 'Report completion notifications' },
            { type: 'BILLING_ALERT', label: 'Billing Alert', description: 'Subscription and billing notifications' }
          ].map(({ type, label, description }) => (
            <div key={type} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{label}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.preferences[type]?.enabled !== false}
                  onChange={(e) => updateTypePreference(type, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={savePreferences}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </div>
    </div>
  )
} 
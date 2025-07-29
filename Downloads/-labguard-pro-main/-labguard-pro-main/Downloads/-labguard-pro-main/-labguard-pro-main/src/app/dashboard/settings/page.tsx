'use client'

import { useState } from 'react'
import { 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Users, 
  CreditCard,
  Zap,
  Globe,
  Lock,
  Palette,
  Download,
  Upload,
  Trash2,
  Save,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface SettingsSection {
  id: string
  title: string
  description: string
  icon: any
  href: string
  color: string
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const settingsSections: SettingsSection[] = [
    {
      id: 'laboratory',
      title: 'Laboratory Settings',
      description: 'Configure laboratory information, compliance standards, and operational parameters',
      icon: Settings,
      href: '/dashboard/settings/laboratory',
      color: 'text-blue-600'
    },
    {
      id: 'security',
      title: 'Security & Access',
      description: 'Manage authentication, user permissions, and security policies',
      icon: Shield,
      href: '/dashboard/settings/security',
      color: 'text-red-600'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure email, SMS, and in-app notification preferences',
      icon: Bell,
      href: '/dashboard/settings/notifications',
      color: 'text-green-600'
    },
    {
      id: 'team',
      title: 'Team Management',
      description: 'Manage team members, roles, and collaboration settings',
      icon: Users,
      href: '/dashboard/settings/team',
      color: 'text-purple-600'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect with external services and configure API settings',
      icon: Zap,
      href: '/dashboard/settings/integrations',
      color: 'text-orange-600'
    },
    {
      id: 'billing',
      title: 'Billing & Subscription',
      description: 'Manage subscription plans, payment methods, and billing history',
      icon: CreditCard,
      href: '/dashboard/settings/billing',
      color: 'text-indigo-600'
    },
    {
      id: 'data',
      title: 'Data Management',
      description: 'Export data, manage backups, and configure data retention',
      icon: Database,
      href: '/dashboard/settings/data',
      color: 'text-gray-600'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize themes, layouts, and visual preferences',
      icon: Palette,
      href: '/dashboard/settings/appearance',
      color: 'text-pink-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Configure your laboratory management system preferences and settings
        </p>
      </div>

      {/* Save Status */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Settings saved successfully!</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center`}>
                <section.icon className={`w-6 h-6 ${section.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {section.description}
                </p>
                <div className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  <span>Configure</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-600">Download all data</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
            <Upload className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Import Data</p>
              <p className="text-sm text-gray-600">Upload CSV files</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
            <Lock className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-sm text-gray-600">Update credentials</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
            <Trash2 className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600">Permanent removal</p>
            </div>
          </button>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Version</h3>
            <p className="text-gray-900">LabGuard Pro v2.1.0</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
            <p className="text-gray-900">December 15, 2024</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
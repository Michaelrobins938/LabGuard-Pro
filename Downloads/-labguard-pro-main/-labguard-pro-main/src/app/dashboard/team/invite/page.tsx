'use client'

import { useState } from 'react'
import { 
  UserPlus, 
  Mail, 
  Users, 
  Shield, 
  Eye, 
  Settings,
  Send,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface InvitationForm {
  email: string
  role: string
  message: string
}

export default function InviteTeamMemberPage() {
  const [form, setForm] = useState<InvitationForm>({
    email: '',
    role: 'TECHNICIAN',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const roles = [
    {
      value: 'ADMIN',
      label: 'Administrator',
      description: 'Full access to all features and team management',
      icon: Shield,
      color: 'text-red-600'
    },
    {
      value: 'SUPERVISOR',
      label: 'Supervisor',
      description: 'Manage team members, create assignments, view reports',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      value: 'TECHNICIAN',
      label: 'Technician',
      description: 'Perform calibrations, update equipment, view own assignments',
      icon: Settings,
      color: 'text-green-600'
    },
    {
      value: 'VIEWER',
      label: 'Viewer',
      description: 'View equipment and reports, no editing permissions',
      icon: Eye,
      color: 'text-gray-600'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/team/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        setSuccess(true)
        setForm({ email: '', role: 'TECHNICIAN', message: '' })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to send invitation')
      }
    } catch (error) {
      console.error('Error sending invitation:', error)
      alert('Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  const selectedRole = roles.find(r => r.value === form.role)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/dashboard/team"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Team</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invite Team Member</h1>
        <p className="text-gray-600">
          Send an invitation to join your laboratory team
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Invitation sent successfully!</span>
          </div>
          <p className="text-green-700 mt-1">
            The invitation has been sent to {form.email}. They will receive an email with instructions to join your team.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Invitation Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Invitation Details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Role
              </label>
              <div className="space-y-3">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      form.role === role.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={form.role === role.value}
                      onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <role.icon className={`w-4 h-4 ${role.color}`} />
                        <span className="font-medium text-gray-900">{role.label}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a personal message to the invitation..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending Invitation...' : 'Send Invitation'}</span>
            </button>
          </form>
        </div>

        {/* Role Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Role Preview</h2>

          {selectedRole && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center`}>
                  <selectedRole.icon className={`w-6 h-6 ${selectedRole.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedRole.label}</h3>
                  <p className="text-sm text-gray-600">{selectedRole.description}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Permissions</h4>
                <div className="space-y-2">
                  {form.role === 'ADMIN' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Full access to all features</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Manage team members and roles</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Access all reports and analytics</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Configure system settings</span>
                      </div>
                    </>
                  )}
                  {form.role === 'SUPERVISOR' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Create and manage assignments</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">View team performance reports</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Manage equipment and calibrations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-500">Cannot manage user roles</span>
                      </div>
                    </>
                  )}
                  {form.role === 'TECHNICIAN' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Perform equipment calibrations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Update equipment information</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">View own assignments and reports</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-500">Cannot manage team members</span>
                      </div>
                    </>
                  )}
                  {form.role === 'VIEWER' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">View equipment and reports</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Access read-only dashboards</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-500">No editing permissions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-500">Cannot perform calibrations</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Invitation Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Invitation will expire in 7 days</p>
                  <p>• User can accept or decline the invitation</p>
                  <p>• Role can be changed after they join</p>
                  <p>• They will receive an email with login instructions</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
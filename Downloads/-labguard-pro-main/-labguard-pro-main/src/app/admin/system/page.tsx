'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Shield, 
  Settings, 
  Activity, 
  Database, 
  Server, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter
} from 'lucide-react'

interface SystemUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'user' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  permissions: string[]
}

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: 'healthy' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
}

interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'permission_change' | 'data_access' | 'system_change'
  user: string
  description: string
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  ipAddress: string
}

interface SystemBackup {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  size: number
  status: 'completed' | 'in_progress' | 'failed'
  createdAt: string
  retentionDays: number
}

export default function SystemAdministration() {
  const [users, setUsers] = useState<SystemUser[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [backups, setBackups] = useState<SystemBackup[]>([])
  const [selectedTab, setSelectedTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as const,
    permissions: [] as string[]
  })

  // Mock data for fallback
  const mockUsers: SystemUser[] = [
    {
      id: '1',
      name: 'John Admin',
      email: 'john.admin@labguard.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Sarah Manager',
      email: 'sarah.manager@labguard.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-15T09:15:00Z',
      permissions: ['equipment', 'calibrations', 'reports']
    },
    {
      id: '3',
      name: 'Mike User',
      email: 'mike.user@labguard.com',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-14T16:45:00Z',
      permissions: ['equipment', 'calibrations']
    },
    {
      id: '4',
      name: 'Lisa Viewer',
      email: 'lisa.viewer@labguard.com',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '2024-01-10T14:20:00Z',
      permissions: ['equipment']
    }
  ]

  const mockSystemMetrics: SystemMetric[] = [
    { name: 'CPU Usage', value: 45, unit: '%', status: 'healthy', trend: 'stable' },
    { name: 'Memory Usage', value: 78, unit: '%', status: 'warning', trend: 'up' },
    { name: 'Disk Usage', value: 67, unit: '%', status: 'healthy', trend: 'stable' },
    { name: 'Network I/O', value: 2.4, unit: 'GB/s', status: 'healthy', trend: 'down' },
    { name: 'Database Connections', value: 156, unit: '', status: 'healthy', trend: 'stable' },
    { name: 'Active Sessions', value: 89, unit: '', status: 'healthy', trend: 'up' }
  ]

  const mockSecurityEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'login',
      user: 'john.admin@labguard.com',
      description: 'Successful login from 192.168.1.100',
      timestamp: '2024-01-15T10:30:00Z',
      severity: 'low',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      type: 'permission_change',
      user: 'sarah.manager@labguard.com',
      description: 'Updated user permissions for mike.user@labguard.com',
      timestamp: '2024-01-15T09:15:00Z',
      severity: 'medium',
      ipAddress: '192.168.1.101'
    },
    {
      id: '3',
      type: 'data_access',
      user: 'mike.user@labguard.com',
      description: 'Accessed sensitive equipment calibration data',
      timestamp: '2024-01-14T16:45:00Z',
      severity: 'medium',
      ipAddress: '192.168.1.102'
    },
    {
      id: '4',
      type: 'system_change',
      user: 'john.admin@labguard.com',
      description: 'Modified system configuration settings',
      timestamp: '2024-01-14T14:20:00Z',
      severity: 'high',
      ipAddress: '192.168.1.100'
    }
  ]

  const mockBackups: SystemBackup[] = [
    {
      id: '1',
      name: 'Full Backup - 2024-01-15',
      type: 'full',
      size: 2.4,
      status: 'completed',
      createdAt: '2024-01-15T02:00:00Z',
      retentionDays: 30
    },
    {
      id: '2',
      name: 'Incremental Backup - 2024-01-14',
      type: 'incremental',
      size: 0.8,
      status: 'completed',
      createdAt: '2024-01-14T02:00:00Z',
      retentionDays: 7
    },
    {
      id: '3',
      name: 'Full Backup - 2024-01-08',
      type: 'full',
      size: 2.2,
      status: 'completed',
      createdAt: '2024-01-08T02:00:00Z',
      retentionDays: 30
    },
    {
      id: '4',
      name: 'Incremental Backup - 2024-01-13',
      type: 'incremental',
      size: 0.9,
      status: 'failed',
      createdAt: '2024-01-13T02:00:00Z',
      retentionDays: 7
    }
  ]

  const fetchSystemData = async () => {
    try {
      setIsLoading(true)
      
      const [usersRes, metricsRes, eventsRes, backupsRes] = await Promise.all([
        fetch('/api/admin/system/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/admin/system/metrics', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/admin/system/security-events', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/admin/system/backups', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ])

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      } else {
        setUsers(mockUsers)
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setSystemMetrics(metricsData)
      } else {
        setSystemMetrics(mockSystemMetrics)
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json()
        setSecurityEvents(eventsData)
      } else {
        setSecurityEvents(mockSecurityEvents)
      }

      if (backupsRes.ok) {
        const backupsData = await backupsRes.json()
        setBackups(backupsData)
      } else {
        setBackups(mockBackups)
      }
    } catch (err) {
      console.error('Error fetching system data:', err)
      setUsers(mockUsers)
      setSystemMetrics(mockSystemMetrics)
      setSecurityEvents(mockSecurityEvents)
      setBackups(mockBackups)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-green-100 text-green-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/admin/system/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(newUser)
      })

      if (response.ok) {
        alert('User created successfully!')
        setNewUser({ name: '', email: '', role: 'user', permissions: [] })
        setShowAddUser(false)
        fetchSystemData()
      } else {
        alert('Failed to create user')
      }
    } catch (err) {
      console.error('Error creating user:', err)
      alert('Failed to create user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/admin/system/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })

      if (response.ok) {
        alert('User deleted successfully!')
        fetchSystemData()
      } else {
        alert('Failed to delete user')
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      alert('Failed to delete user')
    }
  }

  const handleCreateBackup = async () => {
    try {
      const response = await fetch('/api/admin/system/backups', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ type: 'full' })
      })

      if (response.ok) {
        alert('Backup started successfully!')
        fetchSystemData()
      } else {
        alert('Failed to start backup')
      }
    } catch (err) {
      console.error('Error creating backup:', err)
      alert('Failed to start backup')
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-600 mt-2">Manage users, monitor system health, and configure security settings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: Activity },
              { id: 'users', name: 'User Management', icon: Users },
              { id: 'security', name: 'Security', icon: Shield },
              { id: 'backups', name: 'Backups', icon: Database },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium ${
                  selectedTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* System Metrics */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {systemMetrics.map((metric, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                        <span className={`text-sm font-semibold ${getStatusColor(metric.status)}`}>
                          {metric.value}{metric.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.status === 'healthy' ? 'bg-green-500' :
                            metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(metric.value, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Security Events */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Security Events</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {securityEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{event.description}</p>
                          <p className="text-xs text-gray-500">{event.user} • {event.ipAddress}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <button
                    onClick={() => setShowAddUser(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' :
                              user.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.lastLogin).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {selectedTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Security Events</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{event.description}</p>
                          <p className="text-xs text-gray-500">{event.user} • {event.ipAddress}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backups Tab */}
        {selectedTab === 'backups' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">System Backups</h3>
                  <button
                    onClick={handleCreateBackup}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Backup</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {backups.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{backup.name}</p>
                          <p className="text-xs text-gray-500">
                            {backup.type} • {backup.size}GB • {backup.retentionDays} days retention
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          backup.status === 'completed' ? 'bg-green-100 text-green-800' :
                          backup.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {backup.status}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(backup.createdAt).toLocaleString()}</span>
                        <button className="text-blue-600 hover:text-blue-900">Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {selectedTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Security Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Require 2FA for all users</p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                          Enable
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                          <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                        </div>
                        <select className="border border-gray-300 rounded-lg px-3 py-2">
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>4 hours</option>
                          <option>8 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Backup Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Auto Backup Schedule</p>
                          <p className="text-sm text-gray-500">Automatically create backups</p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
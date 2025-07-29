'use client'

import { useState, useEffect } from 'react'
import { 
  Database, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Activity,
  BarChart3,
  FileText,
  Users,
  Calendar
} from 'lucide-react'

interface LIMSConnection {
  id: string
  name: string
  type: 'epic-beaker' | 'cerner' | 'sunquest' | 'custom'
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  lastSync: string
  syncInterval: number
  dataTypes: string[]
  errorCount: number
  lastError?: string
  config: any
}

interface LIMSDataSync {
  id: string
  connectionId: string
  dataType: 'equipment' | 'calibrations' | 'samples' | 'quality-control'
  status: 'pending' | 'syncing' | 'completed' | 'failed'
  recordsProcessed: number
  recordsTotal: number
  startedAt: string
  completedAt?: string
  error?: string
}

interface LIMSProvider {
  id: string
  name: string
  description: string
  type: 'epic-beaker' | 'cerner' | 'sunquest' | 'custom'
  icon: React.ReactNode
  color: string
  features: string[]
  supportedDataTypes: string[]
}

const LIMS_PROVIDERS: LIMSProvider[] = [
  {
    id: 'epic-beaker',
    name: 'Epic Beaker',
    description: 'Epic Systems laboratory information management system',
    type: 'epic-beaker',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-blue-500',
    features: ['Real-time data sync', 'Sample tracking', 'Quality control', 'Automated workflows'],
    supportedDataTypes: ['equipment', 'calibrations', 'samples', 'quality-control']
  },
  {
    id: 'cerner',
    name: 'Cerner Millennium',
    description: 'Cerner Corporation laboratory management system',
    type: 'cerner',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-green-500',
    features: ['Comprehensive LIS', 'Integration APIs', 'Custom workflows', 'Reporting tools'],
    supportedDataTypes: ['equipment', 'calibrations', 'samples', 'quality-control']
  },
  {
    id: 'sunquest',
    name: 'Sunquest Information Systems',
    description: 'Sunquest laboratory and pathology information system',
    type: 'sunquest',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-purple-500',
    features: ['Advanced analytics', 'Multi-site support', 'Compliance tools', 'Mobile access'],
    supportedDataTypes: ['equipment', 'calibrations', 'samples', 'quality-control']
  },
  {
    id: 'custom',
    name: 'Custom LIMS',
    description: 'Connect to custom or legacy laboratory systems',
    type: 'custom',
    icon: <Settings className="w-5 h-5" />,
    color: 'bg-orange-500',
    features: ['Custom API integration', 'Data mapping', 'Flexible configuration', 'Legacy support'],
    supportedDataTypes: ['equipment', 'calibrations', 'samples', 'quality-control']
  }
]

export default function LIMSIntegrationPage() {
  const [connections, setConnections] = useState<LIMSConnection[]>([])
  const [syncHistory, setSyncHistory] = useState<LIMSDataSync[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddConnection, setShowAddConnection] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [connectionConfig, setConnectionConfig] = useState<any>({})
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    fetchLIMSData()
  }, [])

  const fetchLIMSData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch connections and sync history
      const [connectionsResponse, syncHistoryResponse] = await Promise.all([
        fetch('/api/integrations/lims/connections', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/integrations/lims/sync-history', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ])

      if (!connectionsResponse.ok) { throw new Error('Failed to fetch LIMS connections') }
      if (!syncHistoryResponse.ok) { throw new Error('Failed to fetch sync history') }

      const connectionsData = await connectionsResponse.json()
      const syncHistoryData = await syncHistoryResponse.json()

      setConnections(connectionsData.data || [])
      setSyncHistory(syncHistoryData.data || [])
    } catch (err) {
      console.error('Error fetching LIMS data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch LIMS data')
      // Fallback to mock data
      setConnections([
        {
          id: '1',
          name: 'Epic Beaker - Main Lab',
          type: 'epic-beaker',
          status: 'connected',
          lastSync: '2024-01-15T10:30:00Z',
          syncInterval: 300,
          dataTypes: ['equipment', 'calibrations', 'samples'],
          errorCount: 0,
          config: {}
        },
        {
          id: '2',
          name: 'Cerner - Satellite Lab',
          type: 'cerner',
          status: 'error',
          lastSync: '2024-01-14T16:45:00Z',
          syncInterval: 600,
          dataTypes: ['equipment', 'calibrations'],
          errorCount: 3,
          lastError: 'Authentication failed - invalid credentials',
          config: {}
        }
      ])
      setSyncHistory([
        {
          id: '1',
          connectionId: '1',
          dataType: 'equipment',
          status: 'completed',
          recordsProcessed: 25,
          recordsTotal: 25,
          startedAt: '2024-01-15T10:30:00Z',
          completedAt: '2024-01-15T10:32:00Z'
        },
        {
          id: '2',
          connectionId: '1',
          dataType: 'calibrations',
          status: 'syncing',
          recordsProcessed: 15,
          recordsTotal: 45,
          startedAt: '2024-01-15T10:35:00Z'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    setConnectionConfig({})
  }

  const handleCreateConnection = async () => {
    if (!selectedProvider) {
      alert('Please select a LIMS provider')
      return
    }

    try {
      setIsConnecting(true)
      const response = await fetch('/api/integrations/lims/connections', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({
          providerId: selectedProvider,
          config: connectionConfig
        })
      })

      if (!response.ok) { throw new Error('Failed to create connection') }
      
      const result = await response.json()
      alert('LIMS connection created successfully!')
      
      // Reset form
      setSelectedProvider(null)
      setConnectionConfig({})
      setShowAddConnection(false)
      
      // Refresh data
      fetchLIMSData()
    } catch (err) {
      console.error('Error creating LIMS connection:', err)
      alert('Failed to create LIMS connection. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSyncConnection = async (connectionId: string) => {
    try {
      const response = await fetch(`/api/integrations/lims/connections/${connectionId}/sync`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })

      if (!response.ok) { throw new Error('Failed to start sync') }
      
      alert('Sync started successfully!')
      fetchLIMSData()
    } catch (err) {
      console.error('Error starting sync:', err)
      alert('Failed to start sync. Please try again.')
    }
  }

  const handleDisconnectConnection = async (connectionId: string) => {
    if (!confirm('Are you sure you want to disconnect this LIMS connection?')) {
      return
    }

    try {
      const response = await fetch(`/api/integrations/lims/connections/${connectionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })

      if (!response.ok) { throw new Error('Failed to disconnect') }
      
      alert('Connection disconnected successfully!')
      fetchLIMSData()
    } catch (err) {
      console.error('Error disconnecting:', err)
      alert('Failed to disconnect. Please try again.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800'
      case 'syncing':
        return 'bg-blue-100 text-blue-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LIMS Integration</h1>
          <p className="text-gray-600">Connect and manage laboratory information management systems</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connections */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">LIMS Connections</h2>
                  <p className="text-gray-600 mt-1">Manage your LIMS system integrations</p>
                </div>
                <button
                  onClick={() => setShowAddConnection(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Connection
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div key={connection.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${LIMS_PROVIDERS.find(p => p.type === connection.type)?.color} text-white`}>
                          {LIMS_PROVIDERS.find(p => p.type === connection.type)?.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{connection.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{connection.type.replace('-', ' ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(connection.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connection.status)}`}>
                          {connection.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Last Sync:</span>
                        <p>{formatDate(connection.lastSync)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Sync Interval:</span>
                        <p>{connection.syncInterval} seconds</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {connection.dataTypes.map((type) => (
                          <span key={type} className="px-2 py-1 bg-gray-100 text-xs rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSyncConnection(connection.id)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Sync now"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDisconnectConnection(connection.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Disconnect"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {connection.lastError && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                        <p className="font-medium mb-1">Last Error:</p>
                        <p>{connection.lastError}</p>
                      </div>
                    )}
                  </div>
                ))}

                {connections.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No LIMS connections yet</p>
                    <p className="text-sm">Add your first LIMS connection to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sync History */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Sync History</h2>
              <p className="text-gray-600 mt-1">Recent data synchronization activity</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {syncHistory.map((sync) => (
                  <div key={sync.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(sync.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sync.status)}`}>
                          {sync.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(sync.startedAt)}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1 capitalize">
                      {sync.dataType} Sync
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {sync.recordsProcessed} of {sync.recordsTotal} records
                      </span>
                      <span className="capitalize">
                        {connections.find(c => c.id === sync.connectionId)?.name}
                      </span>
                    </div>

                    {sync.error && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                        <p className="font-medium mb-1">Error:</p>
                        <p>{sync.error}</p>
                      </div>
                    )}
                  </div>
                ))}

                {syncHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No sync history yet</p>
                    <p className="text-sm">Sync activity will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Connection Modal */}
        {showAddConnection && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add LIMS Connection</h3>
                <button
                  onClick={() => setShowAddConnection(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <EyeOff className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select LIMS Provider
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {LIMS_PROVIDERS.map((provider) => (
                      <div
                        key={provider.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedProvider === provider.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleProviderSelect(provider.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${provider.color} text-white`}>
                            {provider.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{provider.name}</h4>
                            <p className="text-sm text-gray-600">{provider.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedProvider && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Connection Name
                      </label>
                      <input
                        type="text"
                        value={connectionConfig.name || ''}
                        onChange={(e) => setConnectionConfig((prev: any) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter connection name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Endpoint
                      </label>
                      <input
                        type="url"
                        value={connectionConfig.endpoint || ''}
                        onChange={(e) => setConnectionConfig((prev: any) => ({ ...prev, endpoint: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="https://your-lims-system.com/api"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={connectionConfig.username || ''}
                          onChange={(e) => setConnectionConfig((prev: any) => ({ ...prev, username: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="API username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={connectionConfig.password || ''}
                          onChange={(e) => setConnectionConfig((prev: any) => ({ ...prev, password: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="API password"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Sync Interval (seconds)</span>
                      <input
                        type="number"
                        value={connectionConfig.syncInterval || 300}
                        onChange={(e) => setConnectionConfig((prev: any) => ({ ...prev, syncInterval: parseInt(e.target.value) }))}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                        min="60"
                        max="3600"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setShowAddConnection(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateConnection}
                    disabled={!selectedProvider || isConnecting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isConnecting ? 'Connecting...' : 'Create Connection'}
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
'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Key,
  Activity,
  BarChart3,
  Settings,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Globe,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'
import { toast } from 'react-hot-toast'

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  status: 'active' | 'inactive' | 'expired'
  createdAt: string
  lastUsed?: string
  usageCount: number
  rateLimit: number
  expiresAt?: string
}

interface ApiUsage {
  endpoint: string
  method: string
  calls: number
  errors: number
  avgResponseTime: number
  lastCall: string
}

interface ApiEndpoint {
  path: string
  method: string
  description: string
  requiresAuth: boolean
  rateLimit: number
  status: 'active' | 'deprecated' | 'beta'
}

export default function ApiManagementPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [showCreateKey, setShowCreateKey] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [showKey, setShowKey] = useState<string | null>(null)

  // Fetch API keys
  const { data: apiKeys, isLoading: keysLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const response = await apiService.api.getApiKeys()
      return response as ApiKey[]
    },
    enabled: !!session
  })

  // Fetch API usage
  const { data: apiUsage } = useQuery({
    queryKey: ['api-usage'],
    queryFn: async () => {
      const response = await apiService.api.getApiUsage()
      return response as ApiUsage[]
    },
    enabled: !!session
  })

  // Fetch API endpoints
  const { data: endpoints } = useQuery({
    queryKey: ['api-endpoints'],
    queryFn: async () => {
      const response = await apiService.api.getApiEndpoints()
      return response as ApiEndpoint[]
    },
    enabled: !!session
  })

  // Create API key mutation
  const createKeyMutation = useMutation({
    mutationFn: (data: { name: string; permissions: string[] }) => 
      apiService.api.createApiKey(data),
    onSuccess: () => {
      toast.success('API key created successfully')
      setShowCreateKey(false)
      setNewKeyName('')
      setSelectedPermissions([])
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
    onError: (error: any) => {
      toast.error('Failed to create API key')
    }
  })

  // Revoke API key mutation
  const revokeKeyMutation = useMutation({
    mutationFn: (keyId: string) => apiService.api.revokeApiKey(keyId),
    onSuccess: () => {
      toast.success('API key revoked successfully')
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
    onError: (error: any) => {
      toast.error('Failed to revoke API key')
    }
  })

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name')
      return
    }
    createKeyMutation.mutate({
      name: newKeyName,
      permissions: selectedPermissions
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-green-100 text-green-800'
      case 'POST':
        return 'bg-blue-100 text-blue-800'
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800'
      case 'DELETE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const availablePermissions = [
    'equipment:read',
    'equipment:write',
    'calibrations:read',
    'calibrations:write',
    'reports:read',
    'reports:write',
    'users:read',
    'users:write',
    'analytics:read',
    'analytics:write'
  ]

  if (keysLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
          <p className="text-muted-foreground">
            Manage API keys, monitor usage, and explore endpoints
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Documentation
          </Button>
          <Button size="sm" onClick={() => setShowCreateKey(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New API Key
          </Button>
        </div>
      </div>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage your API keys for external integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys?.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{key.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Created {formatDate(key.createdAt)} • {key.usageCount} calls
                    </div>
                    <div className="flex gap-1 mt-1">
                      {key.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {key.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{key.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(key.status)}>
                    {key.status.toUpperCase()}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                  >
                    {showKey === key.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(key.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeKeyMutation.mutate(key.id)}
                    disabled={revokeKeyMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!apiKeys || apiKeys.length === 0) && (
              <div className="text-center py-8">
                <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No API Keys</h3>
                <p className="text-muted-foreground">
                  Create your first API key to get started
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Usage Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Usage Analytics</CardTitle>
            <CardDescription>Monitor API call patterns and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiUsage?.slice(0, 5).map((usage) => (
                <div key={usage.endpoint} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{usage.endpoint}</div>
                    <div className="text-sm text-muted-foreground">
                      {usage.calls} calls • {usage.errors} errors
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getMethodColor(usage.method)}>
                      {usage.method}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {usage.avgResponseTime}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
            <CardDescription>Current rate limit status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Requests per minute</span>
                <span className="text-sm">45 / 60</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Requests per hour</span>
                <span className="text-sm">1,200 / 2,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Requests per day</span>
                <span className="text-sm">15,000 / 50,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle>Available Endpoints</CardTitle>
          <CardDescription>Explore the available API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {endpoints?.map((endpoint) => (
              <div key={endpoint.path} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge className={getMethodColor(endpoint.method)}>
                    {endpoint.method}
                  </Badge>
                  <div>
                    <div className="font-medium">{endpoint.path}</div>
                    <div className="text-sm text-muted-foreground">
                      {endpoint.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {endpoint.requiresAuth && (
                    <Badge variant="outline">Auth Required</Badge>
                  )}
                  <Badge variant={endpoint.status === 'active' ? 'default' : 'secondary'}>
                    {endpoint.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {endpoint.rateLimit}/min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create API Key Modal */}
      {showCreateKey && (
        <Card>
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
            <CardDescription>
              Generate a new API key with specific permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium">Key Name</label>
              <Input
                placeholder="Enter a descriptive name for this key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Permissions</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {availablePermissions.map((permission) => (
                  <label key={permission} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([...selectedPermissions, permission])
                        } else {
                          setSelectedPermissions(selectedPermissions.filter(p => p !== permission))
                        }
                      }}
                    />
                    <span className="text-sm">{permission}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim() || createKeyMutation.isPending}
              >
                {createKeyMutation.isPending ? 'Creating...' : 'Create API Key'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateKey(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Resources for API integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Globe className="h-6 w-6" />
              <span className="text-sm">API Reference</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Download className="h-6 w-6" />
              <span className="text-sm">SDK Downloads</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Code Examples</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
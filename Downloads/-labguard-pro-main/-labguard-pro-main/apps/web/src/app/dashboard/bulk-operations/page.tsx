'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Upload,
  Download,
  Trash2,
  Edit,
  Calendar,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  Activity,
  Plus,
  X,
  Save,
  Play,
  Pause
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'
import { toast } from 'react-hot-toast'

interface BulkOperation {
  id: string
  type: 'equipment' | 'calibration' | 'maintenance' | 'user' | 'notification'
  action: 'create' | 'update' | 'delete' | 'schedule' | 'notify'
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused'
  totalItems: number
  processedItems: number
  successfulItems: number
  failedItems: number
  createdAt: string
  startedAt?: string
  completedAt?: string
  description: string
  createdBy: string
}

interface BulkOperationTemplate {
  id: string
  name: string
  description: string
  type: string
  action: string
  fields: {
    name: string
    type: string
    required: boolean
    options?: string[]
  }[]
}

export default function BulkOperationsPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [operationData, setOperationData] = useState<Record<string, any>>({})
  const [showCreateOperation, setShowCreateOperation] = useState(false)

  // Fetch bulk operations
  const { data: bulkOperations, isLoading: operationsLoading } = useQuery({
    queryKey: ['bulk-operations'],
    queryFn: async () => {
      const response = await apiService.bulkOperations.getBulkOperations()
      return response as BulkOperation[]
    },
    enabled: !!session
  })

  // Fetch operation templates
  const { data: templates } = useQuery({
    queryKey: ['bulk-operation-templates'],
    queryFn: async () => {
      const response = await apiService.bulkOperations.getTemplates()
      return response as BulkOperationTemplate[]
    },
    enabled: !!session
  })

  // Create bulk operation mutation
  const createOperationMutation = useMutation({
    mutationFn: (data: any) => apiService.bulkOperations.createBulkOperation(data),
    onSuccess: () => {
      toast.success('Bulk operation created successfully')
      setShowCreateOperation(false)
      setSelectedTemplate('')
      setUploadedFile(null)
      setOperationData({})
      queryClient.invalidateQueries({ queryKey: ['bulk-operations'] })
    },
    onError: (error: any) => {
      toast.error('Failed to create bulk operation')
    }
  })

  // Cancel operation mutation
  const cancelOperationMutation = useMutation({
    mutationFn: (operationId: string) => apiService.bulkOperations.cancelBulkOperation(operationId),
    onSuccess: () => {
      toast.success('Operation cancelled successfully')
      queryClient.invalidateQueries({ queryKey: ['bulk-operations'] })
    },
    onError: (error: any) => {
      toast.error('Failed to cancel operation')
    }
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleCreateOperation = () => {
    if (!selectedTemplate || !uploadedFile) {
      toast.error('Please select a template and upload a file')
      return
    }

    const formData = new FormData()
    formData.append('templateId', selectedTemplate)
    formData.append('file', uploadedFile)
    formData.append('data', JSON.stringify(operationData))

    createOperationMutation.mutate(formData)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'paused':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'running':
        return <Play className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />
      case 'paused':
        return <Pause className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
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

  const getProgressPercentage = (operation: BulkOperation) => {
    return Math.round((operation.processedItems / operation.totalItems) * 100)
  }

  if (operationsLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Bulk Operations</h1>
          <p className="text-muted-foreground">
            Manage large-scale operations across equipment, calibrations, and users
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          <Button size="sm" onClick={() => setShowCreateOperation(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Operation
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Equipment Import</h3>
                <p className="text-sm text-muted-foreground">Import equipment from CSV</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Schedule Calibrations</h3>
                <p className="text-sm text-muted-foreground">Bulk calibration scheduling</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">User Management</h3>
                <p className="text-sm text-muted-foreground">Bulk user operations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Maintenance</h3>
                <p className="text-sm text-muted-foreground">Bulk maintenance scheduling</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Operations</CardTitle>
          <CardDescription>
            Monitor the status of your bulk operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bulkOperations?.map((operation) => (
              <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    {getStatusIcon(operation.status)}
                  </div>
                  <div>
                    <div className="font-medium">{operation.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {operation.type} • {operation.action} • {operation.createdBy}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {operation.processedItems}/{operation.totalItems} items
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {operation.successfulItems} successful, {operation.failedItems} failed
                    </div>
                  </div>
                  <Badge className={getStatusColor(operation.status)}>
                    {operation.status.toUpperCase()}
                  </Badge>
                  <div className="flex gap-1">
                    {operation.status === 'running' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelOperationMutation.mutate(operation.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {(!bulkOperations || bulkOperations.length === 0) && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Operations</h3>
                <p className="text-muted-foreground">
                  Create your first bulk operation to get started
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Operation Modal */}
      {showCreateOperation && (
        <Card>
          <CardHeader>
            <CardTitle>Create Bulk Operation</CardTitle>
            <CardDescription>
              Select a template and upload your data file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template Selection */}
            <div>
              <label className="text-sm font-medium">Operation Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mt-1"
              >
                <option value="">Select a template</option>
                {templates?.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.description}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="text-sm font-medium">Data File</label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700">
                    Click to upload
                  </span>
                  <span className="text-muted-foreground"> or drag and drop</span>
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  CSV, XLSX, or XLS files up to 10MB
                </p>
                {uploadedFile && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ {uploadedFile.name} uploaded
                  </div>
                )}
              </div>
            </div>

            {/* Operation Settings */}
            {selectedTemplate && (
              <div>
                <label className="text-sm font-medium">Operation Settings</label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="validate-only"
                      checked={operationData.validateOnly || false}
                      onChange={(e) => setOperationData({
                        ...operationData,
                        validateOnly: e.target.checked
                      })}
                    />
                    <label htmlFor="validate-only" className="text-sm">
                      Validate only (don't execute)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="send-notifications"
                      checked={operationData.sendNotifications || false}
                      onChange={(e) => setOperationData({
                        ...operationData,
                        sendNotifications: e.target.checked
                      })}
                    />
                    <label htmlFor="send-notifications" className="text-sm">
                      Send notifications to affected users
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleCreateOperation}
                disabled={!selectedTemplate || !uploadedFile || createOperationMutation.isPending}
              >
                {createOperationMutation.isPending ? 'Creating...' : 'Create Operation'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateOperation(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Operation Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
          <CardDescription>
            Pre-configured templates for common bulk operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates?.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Type:</span>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Action:</span>
                      <Badge variant="outline">{template.action}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {template.fields.length} required fields
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
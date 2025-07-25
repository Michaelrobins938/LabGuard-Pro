'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Zap,
  Play,
  Pause,
  Square,
  Edit,
  Trash2,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Settings,
  Calendar,
  Users,
  FileText,
  BarChart3,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'
import { toast } from 'react-hot-toast'

interface AutomationWorkflow {
  id: string
  name: string
  description: string
  type: 'calibration' | 'maintenance' | 'notification' | 'report' | 'data_sync'
  status: 'active' | 'inactive' | 'paused' | 'error'
  trigger: 'schedule' | 'event' | 'manual'
  schedule?: string
  conditions: {
    field: string
    operator: string
    value: string
  }[]
  actions: {
    type: string
    config: Record<string, any>
  }[]
  lastRun?: string
  nextRun?: string
  executionCount: number
  successCount: number
  errorCount: number
  createdAt: string
  createdBy: string
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  type: string
  category: string
  complexity: 'simple' | 'medium' | 'advanced'
  estimatedTime: string
  tags: string[]
}

export default function AutomationPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')

  // Fetch automation workflows
  const { data: workflows, isLoading: workflowsLoading } = useQuery({
    queryKey: ['automation-workflows'],
    queryFn: async () => {
      const response = await apiService.automation.getWorkflows()
      return response as AutomationWorkflow[]
    },
    enabled: !!session
  })

  // Fetch workflow templates
  const { data: templates } = useQuery({
    queryKey: ['workflow-templates'],
    queryFn: async () => {
      const response = await apiService.automation.getTemplates()
      return response as WorkflowTemplate[]
    },
    enabled: !!session
  })

  // Create workflow mutation
  const createWorkflowMutation = useMutation({
    mutationFn: (data: any) => apiService.automation.createWorkflow(data),
    onSuccess: () => {
      toast.success('Workflow created successfully')
      setShowCreateWorkflow(false)
      setSelectedTemplate('')
      setWorkflowName('')
      setWorkflowDescription('')
      queryClient.invalidateQueries({ queryKey: ['automation-workflows'] })
    },
    onError: (error: any) => {
      toast.error('Failed to create workflow')
    }
  })

  // Toggle workflow status mutation
  const toggleWorkflowMutation = useMutation({
    mutationFn: ({ workflowId, action }: { workflowId: string; action: 'start' | 'pause' | 'stop' }) =>
      apiService.automation.toggleWorkflow(workflowId, action),
    onSuccess: () => {
      toast.success('Workflow status updated')
      queryClient.invalidateQueries({ queryKey: ['automation-workflows'] })
    },
    onError: (error: any) => {
      toast.error('Failed to update workflow status')
    }
  })

  const handleCreateWorkflow = () => {
    if (!workflowName.trim() || !selectedTemplate) {
      toast.error('Please enter a workflow name and select a template')
      return
    }

    createWorkflowMutation.mutate({
      name: workflowName,
      description: workflowDescription,
      templateId: selectedTemplate
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4" />
      case 'inactive':
        return <Square className="h-4 w-4" />
      case 'paused':
        return <Pause className="h-4 w-4" />
      case 'error':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'calibration':
        return <Calendar className="h-4 w-4" />
      case 'maintenance':
        return <Settings className="h-4 w-4" />
      case 'notification':
        return <Users className="h-4 w-4" />
      case 'report':
        return <BarChart3 className="h-4 w-4" />
      case 'data_sync':
        return <RefreshCw className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
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

  if (workflowsLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Automation Workflows</h1>
          <p className="text-muted-foreground">
            Create and manage automated workflows for your laboratory processes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Workflows
          </Button>
          <Button size="sm" onClick={() => setShowCreateWorkflow(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows?.filter(w => w.status === 'active').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows?.reduce((sum, w) => sum + w.executionCount, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows && workflows.length > 0 
                ? Math.round((workflows.reduce((sum, w) => sum + w.successCount, 0) / 
                   workflows.reduce((sum, w) => sum + w.executionCount, 0)) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Successful executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows && workflows.length > 0 
                ? Math.round((workflows.reduce((sum, w) => sum + w.errorCount, 0) / 
                   workflows.reduce((sum, w) => sum + w.executionCount, 0)) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Failed executions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Active Workflows</CardTitle>
          <CardDescription>
            Monitor and manage your automation workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows?.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    {getTypeIcon(workflow.type)}
                  </div>
                  <div>
                    <div className="font-medium">{workflow.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {workflow.description}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Trigger: {workflow.trigger}</span>
                      <span>Executions: {workflow.executionCount}</span>
                      {workflow.lastRun && (
                        <span>Last run: {formatDate(workflow.lastRun)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(workflow.status)}>
                    {workflow.status.toUpperCase()}
                  </Badge>
                  <div className="flex gap-1">
                    {workflow.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWorkflowMutation.mutate({
                          workflowId: workflow.id,
                          action: 'pause'
                        })}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {workflow.status === 'paused' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWorkflowMutation.mutate({
                          workflowId: workflow.id,
                          action: 'start'
                        })}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {(!workflows || workflows.length === 0) && (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Workflows</h3>
                <p className="text-muted-foreground">
                  Create your first automation workflow to get started
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
          <CardDescription>
            Pre-built templates for common automation scenarios
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
                      <span>Category:</span>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Complexity:</span>
                      <Badge variant="outline">{template.complexity}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Time:</span>
                      <span className="text-muted-foreground">{template.estimatedTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Workflow Modal */}
      {showCreateWorkflow && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Workflow</CardTitle>
            <CardDescription>
              Set up a new automation workflow from a template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium">Workflow Template</label>
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

            <div>
              <label className="text-sm font-medium">Workflow Name</label>
              <Input
                placeholder="Enter a name for your workflow"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Describe what this workflow does"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateWorkflow}
                disabled={!workflowName.trim() || !selectedTemplate || createWorkflowMutation.isPending}
              >
                {createWorkflowMutation.isPending ? 'Creating...' : 'Create Workflow'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateWorkflow(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Automation Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calibration Automation
            </CardTitle>
            <CardDescription>
              Automate calibration scheduling and reminders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>• Schedule periodic calibrations</div>
              <div>• Send reminder notifications</div>
              <div>• Generate calibration reports</div>
              <div>• Update equipment status</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Maintenance Automation
            </CardTitle>
            <CardDescription>
              Automate maintenance scheduling and tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>• Schedule preventive maintenance</div>
              <div>• Track maintenance history</div>
              <div>• Generate maintenance reports</div>
              <div>• Alert on maintenance due</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Notification Automation
            </CardTitle>
            <CardDescription>
              Automate notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>• Send compliance alerts</div>
              <div>• Notify team members</div>
              <div>• Escalate critical issues</div>
              <div>• Schedule regular updates</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Report Automation
            </CardTitle>
            <CardDescription>
              Automate report generation and distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>• Generate monthly reports</div>
              <div>• Export compliance data</div>
              <div>• Send reports via email</div>
              <div>• Archive old reports</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Data Sync Automation
            </CardTitle>
            <CardDescription>
              Automate data synchronization and backups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>• Sync with external systems</div>
              <div>• Backup critical data</div>
              <div>• Import new equipment</div>
              <div>• Update reference data</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Automation
            </CardTitle>
            <CardDescription>
              Automate document generation and management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>• Generate certificates</div>
              <div>• Create audit trails</div>
              <div>• Archive documents</div>
              <div>• Update templates</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
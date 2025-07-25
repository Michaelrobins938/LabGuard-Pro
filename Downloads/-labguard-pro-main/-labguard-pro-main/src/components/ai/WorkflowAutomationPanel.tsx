'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Zap, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Brain,
  Target,
  Activity,
  ArrowRight,
  Repeat,
  Calendar,
  Users,
  Database
} from 'lucide-react'

interface WorkflowStep {
  id: string
  name: string
  type: 'PROTOCOL_GENERATION' | 'DATA_ANALYSIS' | 'EQUIPMENT_CALIBRATION' | 'COMPLIANCE_CHECK' | 'REPORT_GENERATION'
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  progress: number
  estimatedTime: string
  dependencies: string[]
  parameters: Record<string, any>
}

interface Workflow {
  id: string
  name: string
  description: string
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED'
  steps: WorkflowStep[]
  triggers: string[]
  schedule: string
  lastRun: string
  nextRun: string
  successRate: number
  totalRuns: number
  averageDuration: string
  createdBy: string
  createdAt: string
}

export default function WorkflowAutomationPanel() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    triggers: [],
    schedule: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/biomni/workflows')
      if (response.ok) {
        const data = await response.json()
        setWorkflows(data.workflows)
      } else {
        // Mock data for demo
        setWorkflows([
          {
            id: '1',
            name: 'Daily Equipment Calibration',
            description: 'Automated daily calibration workflow for all laboratory equipment',
            status: 'ACTIVE',
            steps: [
              {
                id: '1-1',
                name: 'Equipment Status Check',
                type: 'EQUIPMENT_CALIBRATION',
                status: 'COMPLETED',
                progress: 100,
                estimatedTime: '5 min',
                dependencies: [],
                parameters: { equipmentType: 'all' }
              },
              {
                id: '1-2',
                name: 'Calibration Protocol Generation',
                type: 'PROTOCOL_GENERATION',
                status: 'COMPLETED',
                progress: 100,
                estimatedTime: '10 min',
                dependencies: ['1-1'],
                parameters: { protocolType: 'calibration' }
              },
              {
                id: '1-3',
                name: 'Compliance Validation',
                type: 'COMPLIANCE_CHECK',
                status: 'RUNNING',
                progress: 60,
                estimatedTime: '15 min',
                dependencies: ['1-2'],
                parameters: { standards: ['ISO', 'FDA'] }
              }
            ],
            triggers: ['DAILY_6AM', 'EQUIPMENT_MAINTENANCE_DUE'],
            schedule: '0 6 * * *',
            lastRun: '2024-01-15T06:00:00Z',
            nextRun: '2024-01-16T06:00:00Z',
            successRate: 95.2,
            totalRuns: 45,
            averageDuration: '45 min',
            createdBy: 'Dr. Smith',
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            name: 'Weekly Data Analysis Pipeline',
            description: 'Comprehensive data analysis and reporting workflow',
            status: 'ACTIVE',
            steps: [
              {
                id: '2-1',
                name: 'Data Collection',
                type: 'DATA_ANALYSIS',
                status: 'COMPLETED',
                progress: 100,
                estimatedTime: '30 min',
                dependencies: [],
                parameters: { dataSources: ['equipment', 'samples', 'results'] }
              },
              {
                id: '2-2',
                name: 'Statistical Analysis',
                type: 'DATA_ANALYSIS',
                status: 'RUNNING',
                progress: 75,
                estimatedTime: '45 min',
                dependencies: ['2-1'],
                parameters: { analysisType: 'statistical' }
              },
              {
                id: '2-3',
                name: 'Report Generation',
                type: 'REPORT_GENERATION',
                status: 'PENDING',
                progress: 0,
                estimatedTime: '20 min',
                dependencies: ['2-2'],
                parameters: { reportFormat: 'PDF' }
              }
            ],
            triggers: ['WEEKLY_SUNDAY', 'DATA_THRESHOLD_REACHED'],
            schedule: '0 9 * * 0',
            lastRun: '2024-01-14T09:00:00Z',
            nextRun: '2024-01-21T09:00:00Z',
            successRate: 88.7,
            totalRuns: 12,
            averageDuration: '1h 35min',
            createdBy: 'Dr. Johnson',
            createdAt: '2024-01-01T00:00:00Z'
          }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const startWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/biomni/workflows/${workflowId}/start`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchWorkflows()
      }
    } catch (error) {
      console.error('Failed to start workflow:', error)
    }
  }

  const pauseWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/biomni/workflows/${workflowId}/pause`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchWorkflows()
      }
    } catch (error) {
      console.error('Failed to pause workflow:', error)
    }
  }

  const createWorkflow = async () => {
    try {
      const response = await fetch('/api/biomni/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newWorkflow)
      })
      if (response.ok) {
        setIsCreating(false)
        setNewWorkflow({ name: '', description: '', triggers: [], schedule: '' })
        fetchWorkflows()
      }
    } catch (error) {
      console.error('Failed to create workflow:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'PROTOCOL_GENERATION':
        return <Brain className="w-4 h-4" />
      case 'DATA_ANALYSIS':
        return <Database className="w-4 h-4" />
      case 'EQUIPMENT_CALIBRATION':
        return <Settings className="w-4 h-4" />
      case 'COMPLIANCE_CHECK':
        return <CheckCircle className="w-4 h-4" />
      case 'REPORT_GENERATION':
        return <Target className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Automation</h2>
          <p className="text-gray-600 mt-1">
            Intelligent automation of laboratory processes and workflows
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center space-x-2">
          <Zap className="w-4 h-4" />
          <span>Create Workflow</span>
        </Button>
      </div>

      {/* Create Workflow Modal */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Workflow Name</label>
              <Input
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                placeholder="Enter workflow name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                placeholder="Describe the workflow purpose"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Schedule (Cron Expression)</label>
              <Input
                value={newWorkflow.schedule}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, schedule: e.target.value })}
                placeholder="0 6 * * * (daily at 6 AM)"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={createWorkflow}>Create Workflow</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <span>{workflow.name}</span>
                </CardTitle>
                <Badge className={getStatusColor(workflow.status)}>
                  {workflow.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{workflow.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Workflow Stats */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">{workflow.successRate}%</p>
                  <p className="text-gray-500">Success Rate</p>
                </div>
                <div>
                  <p className="font-medium">{workflow.totalRuns}</p>
                  <p className="text-gray-500">Total Runs</p>
                </div>
                <div>
                  <p className="font-medium">{workflow.averageDuration}</p>
                  <p className="text-gray-500">Avg Duration</p>
                </div>
              </div>

              {/* Workflow Steps */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Current Steps</h4>
                {workflow.steps.map((step) => (
                  <div key={step.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    {getStepIcon(step.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{step.name}</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={step.progress} className="w-20 h-2" />
                        <span className="text-xs text-gray-500">{step.progress}%</span>
                      </div>
                    </div>
                    <Badge variant={step.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {step.status}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Workflow Actions */}
              <div className="flex space-x-2">
                {workflow.status === 'ACTIVE' ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => pauseWorkflow(workflow.id)}
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => startWorkflow(workflow.id)}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-1" />
                  Configure
                </Button>
              </div>

              {/* Schedule Info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Next: {new Date(workflow.nextRun).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Repeat className="w-3 h-3" />
                  <span>{workflow.schedule}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-2 mb-2">
                <Settings className="w-5 h-5 text-blue-500" />
                <h4 className="font-medium">Equipment Maintenance</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Automated equipment calibration and maintenance scheduling
              </p>
              <Button size="sm" variant="outline">Use Template</Button>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="w-5 h-5 text-green-500" />
                <h4 className="font-medium">Data Analysis Pipeline</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                End-to-end data collection, analysis, and reporting workflow
              </p>
              <Button size="sm" variant="outline">Use Template</Button>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <h4 className="font-medium">Compliance Monitoring</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Automated compliance checks and regulatory reporting
              </p>
              <Button size="sm" variant="outline">Use Template</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
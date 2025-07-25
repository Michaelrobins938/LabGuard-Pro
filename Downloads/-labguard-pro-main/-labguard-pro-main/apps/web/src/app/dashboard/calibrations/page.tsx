'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Brain,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Calibration {
  id: string
  equipmentName: string
  equipmentType: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'failed'
  scheduledDate: string
  dueDate: string
  completedDate?: string
  technician: string
  progress: number
  complianceScore?: number
  aiValidation?: boolean
  notes?: string
}

export default function CalibrationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNewCalibration, setShowNewCalibration] = useState(false)

  const calibrations: Calibration[] = [
    {
      id: '1',
      equipmentName: 'Analytical Balance PB-220',
      equipmentType: 'Balance',
      status: 'completed',
      scheduledDate: '2024-01-15',
      dueDate: '2024-02-15',
      completedDate: '2024-01-15',
      technician: 'Dr. Sarah Chen',
      progress: 100,
      complianceScore: 98.5,
      aiValidation: true,
      notes: 'All parameters within acceptable limits'
    },
    {
      id: '2',
      equipmentName: 'Centrifuge CF-16',
      equipmentType: 'Centrifuge',
      status: 'in_progress',
      scheduledDate: '2024-01-20',
      dueDate: '2024-02-20',
      technician: 'Mike Rodriguez',
      progress: 65,
      aiValidation: false,
      notes: 'Speed calibration in progress'
    },
    {
      id: '3',
      equipmentName: 'Incubator IC-200',
      equipmentType: 'Incubator',
      status: 'overdue',
      scheduledDate: '2024-01-10',
      dueDate: '2024-02-10',
      technician: 'Emily Johnson',
      progress: 0,
      aiValidation: false,
      notes: 'Temperature sensor needs replacement'
    },
    {
      id: '4',
      equipmentName: 'pH Meter PH-100',
      equipmentType: 'pH Meter',
      status: 'scheduled',
      scheduledDate: '2024-02-01',
      dueDate: '2024-03-01',
      technician: 'Dr. Sarah Chen',
      progress: 0,
      aiValidation: false
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'in_progress':
        return 'text-blue-600 bg-blue-100'
      case 'scheduled':
        return 'text-gray-600 bg-gray-100'
      case 'overdue':
        return 'text-red-600 bg-red-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'in_progress':
        return <Play className="w-4 h-4" />
      case 'scheduled':
        return <Calendar className="w-4 h-4" />
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />
      case 'failed':
        return <RotateCcw className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const filteredCalibrations = calibrations.filter(item => {
    const matchesSearch = item.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.equipmentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.technician.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: calibrations.length,
    completed: calibrations.filter(c => c.status === 'completed').length,
    inProgress: calibrations.filter(c => c.status === 'in_progress').length,
    overdue: calibrations.filter(c => c.status === 'overdue').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calibration Workflows</h1>
          <p className="text-gray-600">Manage equipment calibration schedules and processes</p>
        </div>
        <Button onClick={() => setShowNewCalibration(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Calibration
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Calibrations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search calibrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calibrations List */}
      <div className="space-y-4">
        {filteredCalibrations.map((calibration) => (
          <Card key={calibration.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(calibration.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {calibration.equipmentName}
                    </h3>
                    <p className="text-sm text-gray-500">{calibration.equipmentType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(calibration.status)}>
                    {calibration.status.replace('_', ' ')}
                  </Badge>
                  {calibration.aiValidation && (
                    <Badge className="text-purple-600 bg-purple-100">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Validated
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Technician</p>
                  <p className="text-sm text-gray-900">{calibration.technician}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Due Date</p>
                  <p className="text-sm text-gray-900">{calibration.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={calibration.progress} className="flex-1" />
                    <span className="text-sm text-gray-600">{calibration.progress}%</span>
                  </div>
                </div>
              </div>

              {calibration.complianceScore && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Compliance Score</span>
                    <span className="text-lg font-bold text-green-600">{calibration.complianceScore}%</span>
                  </div>
                </div>
              )}

              {calibration.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{calibration.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('View', calibration.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {calibration.status === 'scheduled' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Start', calibration.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Calibration
                    </Button>
                  )}
                  {calibration.status === 'in_progress' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Continue', calibration.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Edit', calibration.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Report', calibration.id)}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCalibrations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No calibrations found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Schedule your first calibration to get started.'
              }
            </p>
            <Button onClick={() => setShowNewCalibration(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Calibration
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  AlertTriangle,
  Clock,
  Calendar,
  Play,
  Eye,
  Edit,
  Filter,
  Search,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react'

interface OverdueCalibration {
  id: string
  equipment: {
    id: string
    name: string
    model: string
    serialNumber: string
    equipmentType: string
    location: string
  }
  calibrationType: string
  scheduledDate: string
  dueDate: string
  daysOverdue: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  status: string
  complianceStatus: string
  assignedTo?: {
    id: string
    name: string
    email: string
  }
}

export default function OverdueCalibrationsPage() {
  const [overdueCalibrations, setOverdueCalibrations] = useState<OverdueCalibration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Mock data - replace with API call
  useEffect(() => {
    const mockOverdue: OverdueCalibration[] = [
      {
        id: '1',
        equipment: {
          id: 'eq1',
          name: 'Analytical Balance AB-001',
          model: 'Sartorius ME36S',
          serialNumber: 'AB-001',
          equipmentType: 'ANALYTICAL_BALANCE',
          location: 'Lab A - Room 101'
        },
        calibrationType: 'PERIODIC',
        scheduledDate: '2024-01-10T09:00:00Z',
        dueDate: '2024-01-15T17:00:00Z',
        daysOverdue: 5,
        priority: 'HIGH',
        status: 'OVERDUE',
        complianceStatus: 'PENDING',
        assignedTo: {
          id: 'user1',
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@lab.com'
        }
      },
      {
        id: '2',
        equipment: {
          id: 'eq2',
          name: 'Centrifuge CF-003',
          model: 'Eppendorf 5810R',
          serialNumber: 'CF-003',
          equipmentType: 'CENTRIFUGE',
          location: 'Lab B - Room 102'
        },
        calibrationType: 'PERIODIC',
        scheduledDate: '2024-01-08T14:00:00Z',
        dueDate: '2024-01-12T17:00:00Z',
        daysOverdue: 8,
        priority: 'HIGH',
        status: 'OVERDUE',
        complianceStatus: 'PENDING',
        assignedTo: {
          id: 'user2',
          name: 'Mike Chen',
          email: 'mike.chen@lab.com'
        }
      },
      {
        id: '3',
        equipment: {
          id: 'eq3',
          name: 'pH Meter PH-002',
          model: 'Thermo Scientific Orion',
          serialNumber: 'PH-002',
          equipmentType: 'OTHER',
          location: 'Lab A - Room 101'
        },
        calibrationType: 'PERIODIC',
        scheduledDate: '2024-01-05T09:00:00Z',
        dueDate: '2024-01-10T17:00:00Z',
        daysOverdue: 10,
        priority: 'MEDIUM',
        status: 'OVERDUE',
        complianceStatus: 'PENDING'
      },
      {
        id: '4',
        equipment: {
          id: 'eq4',
          name: 'Microscope MS-005',
          model: 'Olympus BX53',
          serialNumber: 'MS-005',
          equipmentType: 'MICROSCOPE',
          location: 'Lab C - Room 103'
        },
        calibrationType: 'PERIODIC',
        scheduledDate: '2024-01-03T10:00:00Z',
        dueDate: '2024-01-08T17:00:00Z',
        daysOverdue: 12,
        priority: 'LOW',
        status: 'OVERDUE',
        complianceStatus: 'PENDING'
      }
    ]

    setOverdueCalibrations(mockOverdue)
    setLoading(false)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4" />
      case 'MEDIUM':
        return <AlertCircle className="w-4 h-4" />
      case 'LOW':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredCalibrations = overdueCalibrations.filter(calibration => {
    const matchesSearch = calibration.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calibration.equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === 'all' || calibration.priority === priorityFilter
    const matchesType = typeFilter === 'all' || calibration.calibrationType === typeFilter
    
    return matchesSearch && matchesPriority && matchesType
  })

  const highPriorityCount = overdueCalibrations.filter(c => c.priority === 'HIGH').length
  const totalOverdueCount = overdueCalibrations.length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Overdue Calibrations</h1>
              <p className="text-gray-600 mt-2">
                {totalOverdueCount} calibrations past due date
              </p>
            </div>
            <Link
              href="/dashboard/calibrations"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              View All Calibrations
            </Link>
          </div>

          {/* Priority Alert */}
          {highPriorityCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    {highPriorityCount} High Priority Overdue Calibrations
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    These calibrations require immediate attention to maintain compliance.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Equipment
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or serial number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calibration Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="PERIODIC">Periodic</option>
                <option value="INITIAL">Initial</option>
                <option value="AFTER_REPAIR">After Repair</option>
                <option value="VERIFICATION">Verification</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setPriorityFilter('all')
                  setTypeFilter('all')
                }}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <X className="w-4 h-4 inline mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Overdue Calibrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalibrations.map((calibration) => (
            <div
              key={calibration.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Priority Badge */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(calibration.priority)}`}>
                    {getPriorityIcon(calibration.priority)}
                    <span className="ml-1">{calibration.priority}</span>
                  </div>
                  <div className="text-sm text-red-600 font-medium">
                    {calibration.daysOverdue} days overdue
                  </div>
                </div>
              </div>

              {/* Equipment Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {calibration.equipment.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="font-medium">{calibration.equipment.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Serial:</span>
                    <span className="font-medium">{calibration.equipment.serialNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{calibration.equipment.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{calibration.calibrationType.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Due Date */}
                <div className="mt-4 p-3 bg-red-50 rounded-md">
                  <div className="flex items-center text-red-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      Due: {new Date(calibration.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Assigned To */}
                {calibration.assignedTo && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <div className="flex items-center text-blue-700">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-medium text-blue-600">
                          {calibration.assignedTo.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm">
                        Assigned to {calibration.assignedTo.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/calibrations/${calibration.id}/perform`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Now
                  </Link>
                  <Link
                    href={`/dashboard/calibrations/${calibration.id}`}
                    className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/dashboard/calibrations/${calibration.id}/edit`}
                    className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCalibrations.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || priorityFilter !== 'all' || typeFilter !== 'all' 
                ? 'No overdue calibrations match your filters'
                : 'No overdue calibrations'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || priorityFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'All calibrations are up to date!'
              }
            </p>
            {(searchTerm || priorityFilter !== 'all' || typeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setPriorityFilter('all')
                  setTypeFilter('all')
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 
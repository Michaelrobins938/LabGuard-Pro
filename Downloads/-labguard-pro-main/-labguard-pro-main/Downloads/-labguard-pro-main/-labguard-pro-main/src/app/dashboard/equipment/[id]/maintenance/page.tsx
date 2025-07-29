'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Equipment {
  id: string
  name: string
  model: string
  serialNumber: string
  manufacturer: string
  equipmentType: string
  location: string
  status: string
}

interface MaintenanceRecord {
  id: string
  equipmentId: string
  performedDate: string
  scheduledDate: string
  performedBy: string
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'INSPECTION'
  status: 'COMPLETED' | 'PENDING' | 'IN_PROGRESS' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  actions: string[]
  parts: string[]
  cost: number
  notes: string
  attachments: string[]
  nextMaintenanceDate: string
}

export default function EquipmentMaintenancePage() {
  const params = useParams()
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch equipment details
        const equipmentResponse = await fetch(`/api/equipment/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!equipmentResponse.ok) {
          throw new Error('Failed to fetch equipment data')
        }
        
        const equipmentData = await equipmentResponse.json()
        setEquipment(equipmentData.data)
        
        // Fetch maintenance records
        const maintenanceResponse = await fetch(`/api/equipment/${params.id}/maintenance`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!maintenanceResponse.ok) {
          throw new Error('Failed to fetch maintenance data')
        }
        
        const maintenanceData = await maintenanceResponse.json()
        setMaintenanceRecords(maintenanceData.data || [])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        // Fallback to mock data
        setEquipment({
          id: params.id as string,
          name: 'Sample Equipment',
          model: 'Model X-1000',
          serialNumber: 'SN123456789',
          manufacturer: 'Sample Manufacturer',
          equipmentType: 'Analytical Instrument',
          location: 'Lab A - Bench 1',
          status: 'ACTIVE'
        })
        setMaintenanceRecords([
          {
            id: 'maint-001',
            equipmentId: params.id as string,
            performedDate: '2024-01-20',
            scheduledDate: '2024-01-20',
            performedBy: 'Mike Johnson',
            type: 'PREVENTIVE',
            status: 'COMPLETED',
            priority: 'MEDIUM',
            description: 'Routine preventive maintenance including cleaning, lubrication, and inspection',
            actions: ['Cleaned optical components', 'Lubricated moving parts', 'Inspected electrical connections'],
            parts: ['Cleaning solution', 'Lubricant'],
            cost: 150,
            notes: 'Equipment operating normally. No issues found during inspection.',
            attachments: ['maintenance-report-001.pdf'],
            nextMaintenanceDate: '2024-04-20'
          },
          {
            id: 'maint-002',
            equipmentId: params.id as string,
            performedDate: '2023-10-15',
            scheduledDate: '2023-10-15',
            performedBy: 'Sarah Chen',
            type: 'CORRECTIVE',
            status: 'COMPLETED',
            priority: 'HIGH',
            description: 'Replaced faulty sensor and recalibrated system',
            actions: ['Replaced temperature sensor', 'Recalibrated temperature readings', 'Tested system functionality'],
            parts: ['Temperature sensor', 'Calibration kit'],
            cost: 450,
            notes: 'Sensor replacement resolved temperature drift issues. System now operating within specifications.',
            attachments: ['maintenance-report-002.pdf', 'parts-invoice-002.pdf'],
            nextMaintenanceDate: '2024-01-15'
          },
          {
            id: 'maint-003',
            equipmentId: params.id as string,
            performedDate: '2023-07-10',
            scheduledDate: '2023-07-10',
            performedBy: 'David Rodriguez',
            type: 'INSPECTION',
            status: 'COMPLETED',
            priority: 'LOW',
            description: 'Annual comprehensive inspection and performance testing',
            actions: ['Comprehensive system inspection', 'Performance testing', 'Documentation review'],
            parts: [],
            cost: 200,
            notes: 'Annual inspection completed. All systems functioning properly. No maintenance required.',
            attachments: ['inspection-report-003.pdf'],
            nextMaintenanceDate: '2024-07-10'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.performedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    const matchesType = typeFilter === 'all' || record.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || record.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PREVENTIVE': return 'bg-blue-100 text-blue-800'
      case 'CORRECTIVE': return 'bg-orange-100 text-orange-800'
      case 'EMERGENCY': return 'bg-red-100 text-red-800'
      case 'INSPECTION': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">Equipment not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Maintenance Records</h1>
              <p className="text-gray-600 mt-2">Maintenance history for {equipment.name}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push(`/dashboard/maintenance/new?equipmentId=${params.id}`)}
                className="flex items-center gap-2"
              >
                Schedule Maintenance
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex items-center gap-2"
              >
                ← Back to Equipment
              </Button>
            </div>
          </div>
          
          {/* Equipment Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipment Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{equipment.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{equipment.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Serial Number</p>
                <p className="font-medium">{equipment.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{equipment.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <Input
                placeholder="Search maintenance records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="PREVENTIVE">Preventive</option>
                <option value="CORRECTIVE">Corrective</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="INSPECTION">Inspection</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Maintenance Records */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Maintenance Records ({filteredRecords.length})
            </h3>
          </div>
          
          {filteredRecords.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-600">No maintenance records found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <div key={record.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                          {record.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(record.priority)}`}>
                          {record.priority}
                        </span>
                        <span className="text-sm text-gray-500">
                          Cost: {formatCurrency(record.cost)}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">{record.description}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Performed Date</p>
                          <p className="font-medium">{formatDate(record.performedDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Scheduled Date</p>
                          <p className="font-medium">{formatDate(record.scheduledDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Performed By</p>
                          <p className="font-medium">{record.performedBy}</p>
                        </div>
                      </div>
                      
                      {record.actions && record.actions.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500 mb-2">Actions Performed</p>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {record.actions.map((action, index) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {record.parts && record.parts.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500 mb-2">Parts Used</p>
                          <div className="flex flex-wrap gap-2">
                            {record.parts.map((part, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {part}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {record.notes && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Notes</p>
                          <p className="text-sm text-gray-700">{record.notes}</p>
                        </div>
                      )}
                      
                      {record.attachments && record.attachments.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Attachments</p>
                          <div className="flex gap-2">
                            {record.attachments.map((attachment, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Mock download functionality
                                  alert(`Downloading ${attachment}`)
                                }}
                              >
                                {attachment}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Mock view details functionality
                          alert('View maintenance details')
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Mock download report functionality
                          alert('Download maintenance report')
                        }}
                      >
                        Download Report
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
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

interface CalibrationRecord {
  id: string
  equipmentId: string
  performedDate: string
  dueDate: string
  performedBy: string
  status: 'COMPLETED' | 'PENDING' | 'OVERDUE' | 'CANCELLED'
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING'
  complianceScore: number
  notes: string
  attachments: string[]
  nextCalibrationDate: string
}

export default function EquipmentCalibrationsPage() {
  const params = useParams()
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

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
        
        // Fetch calibration records
        const calibrationsResponse = await fetch(`/api/equipment/${params.id}/calibrations`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!calibrationsResponse.ok) {
          throw new Error('Failed to fetch calibration data')
        }
        
        const calibrationsData = await calibrationsResponse.json()
        setCalibrations(calibrationsData.data || [])
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
        setCalibrations([
          {
            id: 'cal-001',
            equipmentId: params.id as string,
            performedDate: '2024-01-15',
            dueDate: '2024-04-15',
            performedBy: 'Dr. Sarah Johnson',
            status: 'COMPLETED',
            complianceStatus: 'COMPLIANT',
            complianceScore: 95,
            notes: 'Routine calibration performed. All parameters within acceptable limits.',
            attachments: ['calibration-report-001.pdf'],
            nextCalibrationDate: '2024-04-15'
          },
          {
            id: 'cal-002',
            equipmentId: params.id as string,
            performedDate: '2023-10-15',
            dueDate: '2024-01-15',
            performedBy: 'Dr. Michael Chen',
            status: 'COMPLETED',
            complianceStatus: 'COMPLIANT',
            complianceScore: 92,
            notes: 'Annual calibration completed successfully.',
            attachments: ['calibration-report-002.pdf'],
            nextCalibrationDate: '2024-01-15'
          },
          {
            id: 'cal-003',
            equipmentId: params.id as string,
            performedDate: '2023-07-15',
            dueDate: '2023-10-15',
            performedBy: 'Dr. Emily Rodriguez',
            status: 'COMPLETED',
            complianceStatus: 'COMPLIANT',
            complianceScore: 88,
            notes: 'Quarterly calibration performed. Minor adjustments made.',
            attachments: ['calibration-report-003.pdf'],
            nextCalibrationDate: '2023-10-15'
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

  const filteredCalibrations = calibrations.filter(calibration => {
    const matchesSearch = calibration.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calibration.performedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || calibration.status === statusFilter
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'recent' && new Date(calibration.performedDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) ||
                       (dateFilter === 'upcoming' && new Date(calibration.dueDate) > new Date())
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'OVERDUE': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return 'bg-green-100 text-green-800'
      case 'NON_COMPLIANT': return 'bg-red-100 text-red-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
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
              <h1 className="text-3xl font-bold text-gray-900">Calibration History</h1>
              <p className="text-gray-600 mt-2">Calibration records for {equipment.name}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push(`/dashboard/calibrations/new?equipmentId=${params.id}`)}
                className="flex items-center gap-2"
              >
                Schedule New Calibration
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <Input
                placeholder="Search calibrations..."
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
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Dates</option>
                <option value="recent">Last 90 Days</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calibration Records */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Calibration Records ({filteredCalibrations.length})
            </h3>
          </div>
          
          {filteredCalibrations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600">No calibration records found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCalibrations.map((calibration) => (
                <div key={calibration.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(calibration.status)}`}>
                          {calibration.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(calibration.complianceStatus)}`}>
                          {calibration.complianceStatus}
                        </span>
                        <span className="text-sm text-gray-500">
                          Score: {calibration.complianceScore}%
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Performed Date</p>
                          <p className="font-medium">{formatDate(calibration.performedDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Due Date</p>
                          <p className="font-medium">{formatDate(calibration.dueDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Performed By</p>
                          <p className="font-medium">{calibration.performedBy}</p>
                        </div>
                      </div>
                      
                      {calibration.notes && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Notes</p>
                          <p className="text-sm text-gray-700">{calibration.notes}</p>
                        </div>
                      )}
                      
                      {calibration.attachments && calibration.attachments.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Attachments</p>
                          <div className="flex gap-2">
                            {calibration.attachments.map((attachment, index) => (
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
                          alert('View calibration details')
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Mock download report functionality
                          alert('Download calibration report')
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
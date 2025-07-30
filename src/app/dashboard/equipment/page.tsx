'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Microscope
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Equipment {
  id: string
  name: string
  model: string
  serialNumber: string
  manufacturer: string
  equipmentType: string
  location: string
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'CALIBRATION_DUE' | 'OUT_OF_SERVICE' | 'RETIRED'
  installDate: string
  warrantyExpiry: string
  lastCalibration: {
    id: string
    status: string
    complianceStatus: string
    dueDate: string
    performedDate: string
  } | null
  _count: {
    calibrationRecords: number
    maintenanceRecords: number
  }
}

export default function EquipmentPage() {
  const { data: session } = useSession()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockEquipment: Equipment[] = [
        {
          id: '1',
          name: 'Precision Balance PB-220',
          model: 'PB-220',
          serialNumber: 'PB220-2024-001',
          manufacturer: 'Mettler Toledo',
          equipmentType: 'ANALYTICAL_BALANCE',
          location: 'Chemistry Lab - Bench 1',
          status: 'ACTIVE',
          installDate: '2024-01-15T00:00:00Z',
          warrantyExpiry: '2027-01-15T00:00:00Z',
          lastCalibration: {
            id: 'cal-1',
            status: 'COMPLETED',
            complianceStatus: 'COMPLIANT',
            dueDate: '2024-04-15T00:00:00Z',
            performedDate: '2024-01-15T00:00:00Z'
          },
          _count: {
            calibrationRecords: 4,
            maintenanceRecords: 2
          }
        },
        {
          id: '2',
          name: 'High-Speed Centrifuge CF-16',
          model: 'CF-16',
          serialNumber: 'CF16-2024-002',
          manufacturer: 'Eppendorf',
          equipmentType: 'CENTRIFUGE',
          location: 'Processing Room - Station 2',
          status: 'CALIBRATION_DUE',
          installDate: '2024-01-20T00:00:00Z',
          warrantyExpiry: '2027-01-20T00:00:00Z',
          lastCalibration: {
            id: 'cal-2',
            status: 'COMPLETED',
            complianceStatus: 'CONDITIONAL',
            dueDate: '2024-02-20T00:00:00Z',
            performedDate: '2023-11-20T00:00:00Z'
          },
          _count: {
            calibrationRecords: 3,
            maintenanceRecords: 1
          }
        },
        {
          id: '3',
          name: 'CO2 Incubator IC-200',
          model: 'IC-200',
          serialNumber: 'IC200-2024-003',
          manufacturer: 'Thermo Fisher',
          equipmentType: 'INCUBATOR',
          location: 'Microbiology Lab - Corner Unit',
          status: 'MAINTENANCE',
          installDate: '2024-01-25T00:00:00Z',
          warrantyExpiry: '2027-01-25T00:00:00Z',
          lastCalibration: null,
          _count: {
            calibrationRecords: 0,
            maintenanceRecords: 0
          }
        }
      ]
      
      setEquipment(mockEquipment)
    } catch (error) {
      console.error('Failed to fetch equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: Equipment['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'CALIBRATION_DUE':
        return <Badge className="bg-yellow-100 text-yellow-800">Calibration Due</Badge>
      case 'MAINTENANCE':
        return <Badge className="bg-blue-100 text-blue-800">Maintenance</Badge>
      case 'OUT_OF_SERVICE':
        return <Badge className="bg-red-100 text-red-800">Out of Service</Badge>
      case 'INACTIVE':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case 'RETIRED':
        return <Badge className="bg-gray-100 text-gray-800">Retired</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getComplianceIcon = (complianceStatus: string | null) => {
    switch (complianceStatus) {
      case 'COMPLIANT':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'NON_COMPLIANT':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'CONDITIONAL':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />
    }
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesType = typeFilter === 'all' || item.equipmentType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const equipmentTypes = [
    'ANALYTICAL_BALANCE',
    'CENTRIFUGE',
    'INCUBATOR',
    'AUTOCLAVE',
    'SPECTROPHOTOMETER',
    'PCR_MACHINE',
    'MICROSCOPE',
    'PIPETTE'
  ]

  const statusOptions = [
    'ACTIVE',
    'CALIBRATION_DUE',
    'MAINTENANCE',
    'OUT_OF_SERVICE',
    'INACTIVE',
    'RETIRED'
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment Management</h1>
          <p className="text-sm text-gray-600">
            Manage and monitor all laboratory equipment
          </p>
        </div>
        <Link href="/dashboard/equipment/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Microscope className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">{equipment.length}</p>
                <p className="text-sm text-gray-600">Total Equipment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {equipment.filter(e => e.status === 'ACTIVE').length}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {equipment.filter(e => e.status === 'CALIBRATION_DUE').length}
                </p>
                <p className="text-sm text-gray-600">Due for Calibration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {equipment.filter(e => e.status === 'OUT_OF_SERVICE').length}
                </p>
                <p className="text-sm text-gray-600">Out of Service</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="whitespace-nowrap"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  {equipmentTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter('all')
                    setTypeFilter('all')
                    setSearchTerm('')
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {item.manufacturer} • {item.model}
                  </CardDescription>
                </div>
                <div className="relative">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status and Compliance */}
              <div className="flex justify-between items-center">
                {getStatusBadge(item.status)}
                <div className="flex items-center space-x-1">
                  {getComplianceIcon(item.lastCalibration?.complianceStatus || null)}
                  <span className="text-xs text-gray-600">
                    {item.lastCalibration?.complianceStatus || 'No Data'}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Serial Number:</span>
                  <span className="font-medium">{item.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{item.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Calibration:</span>
                  <span className="font-medium">
                    {item.lastCalibration?.performedDate 
                      ? new Date(item.lastCalibration.performedDate).toLocaleDateString()
                      : 'Never'
                    }
                  </span>
                </div>
              </div>

              {/* Next Calibration Due */}
              {item.lastCalibration?.dueDate && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Next Calibration Due:</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {new Date(item.lastCalibration.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Link href={`/dashboard/equipment/${item.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </Link>
                <Link href={`/dashboard/calibrations/new?equipmentId=${item.id}`} className="flex-1">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Calendar className="w-3 h-3 mr-1" />
                    Calibrate
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEquipment.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Microscope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Get started by adding your first piece of equipment.'
              }
            </p>
            {!(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
              <Link href="/dashboard/equipment/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Equipment
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
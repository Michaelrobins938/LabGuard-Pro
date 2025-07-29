'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Plus,
  Eye,
  Settings,
  ArrowLeft,
  Activity,
  Gauge,
  Wrench
} from 'lucide-react'

interface EquipmentPerformance {
  id: string
  name: string
  model: string
  serialNumber: string
  equipmentType: string
  location: string
  uptime: number
  lastCalibration: string
  nextCalibration: string
  complianceScore: number
  aiValidationPassRate: number
  maintenanceHistory: Array<{
    id: string
    type: string
    date: string
    cost: number
    description: string
  }>
  calibrationHistory: Array<{
    id: string
    date: string
    status: string
    complianceScore: number
  }>
}

interface PerformanceMetrics {
  totalEquipment: number
  averageUptime: number
  averageComplianceScore: number
  totalMaintenanceCost: number
  equipmentByType: {
    [key: string]: number
  }
  complianceDistribution: {
    excellent: number
    good: number
    fair: number
    poor: number
  }
}

export default function EquipmentAnalyticsPage() {
  const [equipment, setEquipment] = useState<EquipmentPerformance[]>([])
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const mockEquipment: EquipmentPerformance[] = [
      {
        id: '1',
        name: 'Analytical Balance AB-001',
        model: 'Sartorius ME36S',
        serialNumber: 'AB-001',
        equipmentType: 'ANALYTICAL_BALANCE',
        location: 'Lab A - Room 101',
        uptime: 98.5,
        lastCalibration: '2024-01-15T10:30:00Z',
        nextCalibration: '2024-02-15T10:30:00Z',
        complianceScore: 96.2,
        aiValidationPassRate: 94.8,
        maintenanceHistory: [
          {
            id: 'm1',
            type: 'PREVENTIVE',
            date: '2024-01-10T09:00:00Z',
            cost: 150,
            description: 'Routine cleaning and inspection'
          }
        ],
        calibrationHistory: [
          {
            id: 'c1',
            date: '2024-01-15T10:30:00Z',
            status: 'COMPLETED',
            complianceScore: 96.2
          }
        ]
      }
    ]

    const mockMetrics: PerformanceMetrics = {
      totalEquipment: 24,
      averageUptime: 96.8,
      averageComplianceScore: 92.3,
      totalMaintenanceCost: 12500,
      equipmentByType: {
        'ANALYTICAL_BALANCE': 6,
        'CENTRIFUGE': 4,
        'INCUBATOR': 3,
        'OTHER': 11
      },
      complianceDistribution: {
        excellent: 8,
        good: 12,
        fair: 3,
        poor: 1
      }
    }

    setEquipment(mockEquipment)
    setMetrics(mockMetrics)
    setLoading(false)
  }, [])

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 85) return 'text-yellow-600'
    if (score >= 75) return 'text-orange-600'
    return 'text-red-600'
  }

  const getComplianceLabel = (score: number) => {
    if (score >= 95) return 'Excellent'
    if (score >= 85) return 'Good'
    if (score >= 75) return 'Fair'
    return 'Poor'
  }

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 98) return 'text-green-600'
    if (uptime >= 95) return 'text-yellow-600'
    if (uptime >= 90) return 'text-orange-600'
    return 'text-red-600'
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || item.equipmentType === typeFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'excellent' && item.complianceScore >= 95) ||
                         (statusFilter === 'good' && item.complianceScore >= 85 && item.complianceScore < 95) ||
                         (statusFilter === 'fair' && item.complianceScore >= 75 && item.complianceScore < 85) ||
                         (statusFilter === 'poor' && item.complianceScore < 75)
    
    return matchesSearch && matchesType && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/reports"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Reports
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Equipment Analytics</h1>
                <p className="text-gray-600 mt-2">
                  Performance analysis and maintenance tracking for laboratory equipment
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/dashboard/reports/equipment/export"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Link>
            </div>
          </div>
        </div>

        {metrics && (
          <>
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Equipment</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalEquipment}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Gauge className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Uptime</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.averageUptime}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Compliance</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.averageComplianceScore}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Wrench className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Maintenance Cost</p>
                    <p className="text-2xl font-bold text-gray-900">${metrics.totalMaintenanceCost.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Equipment List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <h2 className="text-lg font-medium text-gray-900">Equipment Performance</h2>
                <span className="text-sm text-gray-500">{filteredEquipment.length} items</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Equipment List */}
          <div className="divide-y divide-gray-200">
            {filteredEquipment.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <span className="text-sm text-gray-500">{item.equipmentType.replace('_', ' ')}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Model:</span> {item.model}
                      </div>
                      <div>
                        <span className="font-medium">Serial:</span> {item.serialNumber}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {item.location}
                      </div>
                      <div>
                        <span className="font-medium">Last Calibration:</span> {new Date(item.lastCalibration).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Uptime</p>
                      <p className={`text-lg font-semibold ${getUptimeColor(item.uptime)}`}>{item.uptime}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Compliance</p>
                      <p className={`text-lg font-semibold ${getComplianceColor(item.complianceScore)}`}>
                        {item.complianceScore}%
                      </p>
                      <p className="text-xs text-gray-500">{getComplianceLabel(item.complianceScore)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">AI Pass Rate</p>
                      <p className="text-lg font-semibold text-gray-900">{item.aiValidationPassRate}%</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/reports/equipment/${item.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Link>
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'No equipment matches your filters'
                  : 'No equipment data available'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Add equipment to start tracking performance analytics.'
                }
              </p>
              <Link
                href="/dashboard/equipment/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
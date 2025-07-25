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
  PieChart,
  Activity
} from 'lucide-react'

interface ComplianceData {
  overallCompliance: number
  equipmentCompliance: {
    compliant: number
    warning: number
    nonCompliant: number
    overdue: number
  }
  calibrationStatus: {
    completed: number
    scheduled: number
    overdue: number
    failed: number
  }
  aiValidationResults: {
    passed: number
    failed: number
    conditional: number
  }
  recentViolations: Array<{
    id: string
    equipmentName: string
    violationType: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    date: string
    description: string
  }>
}

interface ComplianceReport {
  id: string
  title: string
  period: string
  generatedAt: string
  complianceScore: number
  equipmentCount: number
  violationsCount: number
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED'
}

export default function ComplianceReportsPage() {
  const [complianceData, setComplianceData] = useState<ComplianceData | null>(null)
  const [reports, setReports] = useState<ComplianceReport[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - replace with API call
  useEffect(() => {
    const mockComplianceData: ComplianceData = {
      overallCompliance: 94.2,
      equipmentCompliance: {
        compliant: 18,
        warning: 3,
        nonCompliant: 2,
        overdue: 1
      },
      calibrationStatus: {
        completed: 156,
        scheduled: 12,
        overdue: 3,
        failed: 2
      },
      aiValidationResults: {
        passed: 142,
        failed: 8,
        conditional: 6
      },
      recentViolations: [
        {
          id: '1',
          equipmentName: 'Analytical Balance AB-001',
          violationType: 'CALIBRATION_OVERDUE',
          severity: 'HIGH',
          date: '2024-01-15T10:30:00Z',
          description: 'Calibration overdue by 5 days'
        },
        {
          id: '2',
          equipmentName: 'Centrifuge CF-003',
          violationType: 'AI_VALIDATION_FAILED',
          severity: 'MEDIUM',
          date: '2024-01-14T14:20:00Z',
          description: 'AI validation failed accuracy check'
        },
        {
          id: '3',
          equipmentName: 'pH Meter PH-002',
          violationType: 'ENVIRONMENTAL_CONDITIONS',
          severity: 'LOW',
          date: '2024-01-13T09:15:00Z',
          description: 'Temperature outside acceptable range'
        }
      ]
    }

    const mockReports: ComplianceReport[] = [
      {
        id: '1',
        title: 'Monthly Compliance Report - January 2024',
        period: 'January 2024',
        generatedAt: '2024-01-31T10:30:00Z',
        complianceScore: 94.2,
        equipmentCount: 24,
        violationsCount: 3,
        status: 'COMPLETED'
      },
      {
        id: '2',
        title: 'Quarterly Compliance Summary - Q4 2023',
        period: 'Q4 2023',
        generatedAt: '2024-01-01T09:00:00Z',
        complianceScore: 96.8,
        equipmentCount: 24,
        violationsCount: 1,
        status: 'COMPLETED'
      },
      {
        id: '3',
        title: 'Annual Compliance Report - 2023',
        period: '2023',
        generatedAt: '2024-01-01T08:00:00Z',
        complianceScore: 95.1,
        equipmentCount: 24,
        violationsCount: 8,
        status: 'COMPLETED'
      }
    ]

    setComplianceData(mockComplianceData)
    setReports(mockReports)
    setLoading(false)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                <h1 className="text-3xl font-bold text-gray-900">Compliance Reports</h1>
                <p className="text-gray-600 mt-2">
                  Monitor laboratory compliance status and generate detailed reports
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/dashboard/reports/compliance/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Report
              </Link>
            </div>
          </div>
        </div>

        {complianceData && (
          <>
            {/* Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
                    <p className="text-2xl font-bold text-gray-900">{complianceData.overallCompliance}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Compliant Equipment</p>
                    <p className="text-2xl font-bold text-gray-900">{complianceData.equipmentCompliance.compliant}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Violations</p>
                    <p className="text-2xl font-bold text-gray-900">{complianceData.recentViolations.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">AI Validations</p>
                    <p className="text-2xl font-bold text-gray-900">{complianceData.aiValidationResults.passed}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Compliance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Equipment Compliance Status */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Equipment Compliance Status</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Compliant</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{complianceData.equipmentCompliance.compliant}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Warning</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{complianceData.equipmentCompliance.warning}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Non-Compliant</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{complianceData.equipmentCompliance.nonCompliant}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Overdue</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{complianceData.equipmentCompliance.overdue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Validation Results */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">AI Validation Results</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Passed</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{complianceData.aiValidationResults.passed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Failed</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{complianceData.aiValidationResults.failed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Conditional</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{complianceData.aiValidationResults.conditional}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Violations */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Violations</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {complianceData.recentViolations.map((violation) => (
                  <div key={violation.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-sm font-medium text-gray-900">{violation.equipmentName}</h3>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(violation.severity)}`}>
                            {violation.severity}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{violation.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(violation.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Compliance Reports */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Compliance Reports</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Reports List */}
          <div className="divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{report.period}</span>
                      <span className="text-sm text-gray-500">
                        Generated {new Date(report.generatedAt).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {report.equipmentCount} equipment items
                      </span>
                      <span className="text-sm text-gray-500">
                        {report.violationsCount} violations
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Compliance Score</p>
                      <p className="text-lg font-semibold text-gray-900">{report.complianceScore}%</p>
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                      {report.status.replace('_', ' ')}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/reports/compliance/${report.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Link>
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No reports match your search' : 'No compliance reports generated yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search terms.' : 'Generate your first compliance report to get started.'}
              </p>
              <Link
                href="/dashboard/reports/compliance/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Report
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
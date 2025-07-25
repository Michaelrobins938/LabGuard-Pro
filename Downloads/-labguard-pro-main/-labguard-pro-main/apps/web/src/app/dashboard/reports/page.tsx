'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  FileText,
  Brain,
  Settings,
  Users,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ComplianceData {
  month: string
  compliant: number
  warning: number
  overdue: number
  total: number
}

interface EquipmentPerformance {
  name: string
  type: string
  complianceScore: number
  lastCalibration: string
  nextCalibration: string
  status: 'compliant' | 'warning' | 'overdue'
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [selectedReport, setSelectedReport] = useState('compliance')

  const complianceData: ComplianceData[] = [
    { month: 'Jan', compliant: 85, warning: 10, overdue: 5, total: 100 },
    { month: 'Feb', compliant: 88, warning: 8, overdue: 4, total: 100 },
    { month: 'Mar', compliant: 92, warning: 6, overdue: 2, total: 100 },
    { month: 'Apr', compliant: 89, warning: 9, overdue: 2, total: 100 },
    { month: 'May', compliant: 94, warning: 4, overdue: 2, total: 100 },
    { month: 'Jun', compliant: 96, warning: 3, overdue: 1, total: 100 }
  ]

  const equipmentPerformance: EquipmentPerformance[] = [
    {
      name: 'Analytical Balance PB-220',
      type: 'Balance',
      complianceScore: 98.5,
      lastCalibration: '2024-01-15',
      nextCalibration: '2024-02-15',
      status: 'compliant'
    },
    {
      name: 'Centrifuge CF-16',
      type: 'Centrifuge',
      complianceScore: 85.2,
      lastCalibration: '2024-01-10',
      nextCalibration: '2024-02-10',
      status: 'warning'
    },
    {
      name: 'Incubator IC-200',
      type: 'Incubator',
      complianceScore: 72.8,
      lastCalibration: '2024-01-05',
      nextCalibration: '2024-02-05',
      status: 'overdue'
    },
    {
      name: 'pH Meter PH-100',
      type: 'pH Meter',
      complianceScore: 95.1,
      lastCalibration: '2024-01-20',
      nextCalibration: '2024-02-20',
      status: 'compliant'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'overdue':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />
      case 'overdue':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const totalEquipment = equipmentPerformance.length
  const compliantEquipment = equipmentPerformance.filter(e => e.status === 'compliant').length
  const warningEquipment = equipmentPerformance.filter(e => e.status === 'warning').length
  const overdueEquipment = equipmentPerformance.filter(e => e.status === 'overdue').length
  const averageComplianceScore = equipmentPerformance.reduce((acc, e) => acc + e.complianceScore, 0) / totalEquipment

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive compliance dashboards and performance insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Time Period:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Report Type:</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="compliance">Compliance Report</option>
                <option value="performance">Performance Report</option>
                <option value="financial">Financial Report</option>
                <option value="ai">AI Analysis Report</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Equipment</p>
                <p className="text-2xl font-bold text-gray-900">{totalEquipment}</p>
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
                <p className="text-sm font-medium text-gray-600">Compliant</p>
                <p className="text-2xl font-bold text-green-600">{compliantEquipment}</p>
                <p className="text-xs text-gray-500">
                  {((compliantEquipment / totalEquipment) * 100).toFixed(1)}% of total
                </p>
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
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-blue-600">{averageComplianceScore.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Compliance score</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Validations</p>
                <p className="text-2xl font-bold text-purple-600">24</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {complianceData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t" style={{ height: `${(data.compliant / data.total) * 200}px` }}>
                  <div className="w-full bg-green-500 rounded-t" style={{ height: `${(data.compliant / data.total) * 200}px` }}></div>
                </div>
                <div className="w-full bg-gray-200 rounded-t" style={{ height: `${(data.warning / data.total) * 200}px` }}>
                  <div className="w-full bg-yellow-500 rounded-t" style={{ height: `${(data.warning / data.total) * 200}px` }}></div>
                </div>
                <div className="w-full bg-gray-200 rounded-t" style={{ height: `${(data.overdue / data.total) * 200}px` }}>
                  <div className="w-full bg-red-500 rounded-t" style={{ height: `${(data.overdue / data.total) * 200}px` }}></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-600">Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-xs text-gray-600">Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-xs text-gray-600">Overdue</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Equipment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Compliance Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Calibration</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Next Calibration</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipmentPerformance.map((equipment, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{equipment.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">{equipment.type}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${equipment.complianceScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {equipment.complianceScore}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(equipment.status)}
                        <Badge className={getStatusColor(equipment.status)}>
                          {equipment.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{equipment.lastCalibration}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{equipment.nextCalibration}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log('View', equipment.name)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log('Report', equipment.name)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Validations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Balance Calibration</p>
                    <p className="text-xs text-gray-500">AI validated - 98.5% accuracy</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">pH Meter Analysis</p>
                    <p className="text-xs text-gray-500">AI validated - 95.2% accuracy</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Centrifuge Check</p>
                    <p className="text-xs text-gray-500">AI validated - 87.3% accuracy</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Calibrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Centrifuge CF-16</p>
                    <p className="text-xs text-gray-500">Due in 3 days</p>
                  </div>
                </div>
                <Badge className="text-yellow-600 bg-yellow-100">Warning</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">pH Meter PH-100</p>
                    <p className="text-xs text-gray-500">Due in 7 days</p>
                  </div>
                </div>
                <Badge className="text-green-600 bg-green-100">Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Incubator IC-200</p>
                    <p className="text-xs text-gray-500">Overdue by 5 days</p>
                  </div>
                </div>
                <Badge className="text-red-600 bg-red-100">Overdue</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
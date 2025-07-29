'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/cards'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, StatusBadge, ActionMenu } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { FlaskConical, AlertTriangle, CheckCircle, Clock, MoreVertical, Plus, TrendingUp } from 'lucide-react'

const equipment = [
  {
    id: 1,
    name: 'Centrifuge #1',
    type: 'Centrifuge',
    status: 'active',
    compliance: 'compliant',
    lastCalibration: '2024-01-15',
    nextCalibration: '2024-02-15',
    location: 'Lab A',
    efficiency: 95
  },
  {
    id: 2,
    name: 'Spectrophotometer #2',
    type: 'Analytical',
    status: 'maintenance',
    compliance: 'due_soon',
    lastCalibration: '2024-01-10',
    nextCalibration: '2024-01-25',
    location: 'Lab B',
    efficiency: 87
  },
  {
    id: 3,
    name: 'Incubator #3',
    type: 'Environmental',
    status: 'active',
    compliance: 'compliant',
    lastCalibration: '2024-01-20',
    nextCalibration: '2024-02-20',
    location: 'Lab A',
    efficiency: 98
  },
  {
    id: 4,
    name: 'Autoclave #1',
    type: 'Sterilization',
    status: 'inactive',
    compliance: 'overdue',
    lastCalibration: '2023-12-15',
    nextCalibration: '2024-01-15',
    location: 'Lab C',
    efficiency: 0
  },
  {
    id: 5,
    name: 'Microscope #4',
    type: 'Imaging',
    status: 'active',
    compliance: 'compliant',
    lastCalibration: '2024-01-18',
    nextCalibration: '2024-02-18',
    location: 'Lab B',
    efficiency: 92
  },
  {
    id: 6,
    name: 'pH Meter #2',
    type: 'Analytical',
    status: 'maintenance',
    compliance: 'due_soon',
    lastCalibration: '2024-01-12',
    nextCalibration: '2024-01-27',
    location: 'Lab A',
    efficiency: 78
  }
]

export function EquipmentStatus() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <StatusBadge status="success">Active</StatusBadge>
      case 'maintenance':
        return <StatusBadge status="warning">Maintenance</StatusBadge>
      case 'inactive':
        return <StatusBadge status="error">Inactive</StatusBadge>
      default:
        return <StatusBadge status="info">Unknown</StatusBadge>
    }
  }

  const getComplianceIcon = (compliance: string) => {
    switch (compliance) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'due_soon':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-emerald-500'
    if (efficiency >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Equipment Status</CardTitle>
              <CardDescription>Real-time equipment monitoring and compliance tracking</CardDescription>
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>Efficiency</TableHead>
              <TableHead>Next Calibration</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.id} className="hover:bg-white/5">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg border border-teal-500/30">
                      <FlaskConical className="h-4 w-4 text-teal-500" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-sm text-gray-400">{item.location}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-300">{item.type}</span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getComplianceIcon(item.compliance)}
                    <span className="text-sm capitalize">
                      {item.compliance.replace('_', ' ')}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className={`h-4 w-4 ${getEfficiencyColor(item.efficiency)}`} />
                    <span className={`font-medium ${getEfficiencyColor(item.efficiency)}`}>
                      {item.efficiency}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-300">
                    {new Date(item.nextCalibration).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <ActionMenu>
                    <div className="hidden">Menu</div>
                  </ActionMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">145</p>
            <p className="text-xs text-gray-400">Total Equipment</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">142</p>
            <p className="text-xs text-gray-400">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">2</p>
            <p className="text-xs text-gray-400">Maintenance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">1</p>
            <p className="text-xs text-gray-400">Inactive</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
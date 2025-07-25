'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Microscope, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Thermometer,
  Gauge,
  Zap,
  Brain,
  Bot
} from 'lucide-react'
import { EnhancedBiomniAssistant } from '@/components/ai-assistant/EnhancedBiomniAssistant'

interface Equipment {
  id: string
  name: string
  type: string
  model: string
  location: string
  status: 'active' | 'maintenance' | 'calibration' | 'offline'
  lastCalibration: string
  nextCalibration: string
  complianceScore: number
  temperature: number
  humidity: number
  pressure: number
}

export function ModernEquipmentManager() {
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Analytical Balance PB-220',
      type: 'Balance',
      model: 'PB-220',
      location: 'Lab A - Bench 1',
      status: 'active',
      lastCalibration: '2024-01-15',
      nextCalibration: '2024-02-15',
      complianceScore: 98.5,
      temperature: 22.5,
      humidity: 45.2,
      pressure: 1013.25
    },
    {
      id: '2',
      name: 'Centrifuge CF-16',
      type: 'Centrifuge',
      model: 'CF-16',
      location: 'Lab B - Equipment Room',
      status: 'calibration',
      lastCalibration: '2024-01-10',
      nextCalibration: '2024-02-10',
      complianceScore: 95.2,
      temperature: 21.8,
      humidity: 48.1,
      pressure: 1012.8
    },
    {
      id: '3',
      name: 'Incubator IC-200',
      type: 'Incubator',
      model: 'IC-200',
      location: 'Lab C - Growth Chamber',
      status: 'maintenance',
      lastCalibration: '2024-01-05',
      nextCalibration: '2024-02-05',
      complianceScore: 87.3,
      temperature: 37.2,
      humidity: 65.4,
      pressure: 1014.1
    },
    {
      id: '4',
      name: 'Spectrophotometer SP-500',
      type: 'Spectrophotometer',
      model: 'SP-500',
      location: 'Lab A - Bench 3',
      status: 'active',
      lastCalibration: '2024-01-20',
      nextCalibration: '2024-02-20',
      complianceScore: 99.1,
      temperature: 23.1,
      humidity: 42.8,
      pressure: 1013.5
    },
    {
      id: '5',
      name: 'Autoclave AC-100',
      type: 'Autoclave',
      model: 'AC-100',
      location: 'Lab B - Sterilization Room',
      status: 'active',
      lastCalibration: '2024-01-12',
      nextCalibration: '2024-02-12',
      complianceScore: 96.7,
      temperature: 121.5,
      humidity: 100.0,
      pressure: 1034.2
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showAIAssistant, setShowAIAssistant] = useState(true)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10'
      case 'maintenance': return 'text-yellow-500 bg-yellow-500/10'
      case 'calibration': return 'text-blue-500 bg-blue-500/10'
      case 'offline': return 'text-red-500 bg-red-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'maintenance': return <Settings className="w-4 h-4" />
      case 'calibration': return <Target className="w-4 h-4" />
      case 'offline': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: equipment.length,
    active: equipment.filter(e => e.status === 'active').length,
    maintenance: equipment.filter(e => e.status === 'maintenance').length,
    calibration: equipment.filter(e => e.status === 'calibration').length,
    averageCompliance: (equipment.reduce((sum, e) => sum + e.complianceScore, 0) / equipment.length).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Equipment Management
            </h1>
            <p className="text-gray-300">
              AI-powered equipment monitoring and calibration management
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Bot className="w-4 h-4 mr-2" />
              {showAIAssistant ? 'Hide AI' : 'Show AI'}
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">Total Equipment</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">Active</p>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">Maintenance</p>
                  <p className="text-2xl font-bold text-white">{stats.maintenance}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">Calibration</p>
                  <p className="text-2xl font-bold text-white">{stats.calibration}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">Avg Compliance</p>
                  <p className="text-2xl font-bold text-white">{stats.averageCompliance}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-300"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' ? 'bg-blue-500 hover:bg-blue-600' : 'border-white/20 text-white hover:bg-white/10'}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('active')}
                  className={filterStatus === 'active' ? 'bg-green-500 hover:bg-green-600' : 'border-white/20 text-white hover:bg-white/10'}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === 'maintenance' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('maintenance')}
                  className={filterStatus === 'maintenance' ? 'bg-yellow-500 hover:bg-yellow-600' : 'border-white/20 text-white hover:bg-white/10'}
                >
                  Maintenance
                </Button>
                <Button
                  variant={filterStatus === 'calibration' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('calibration')}
                  className={filterStatus === 'calibration' ? 'bg-blue-500 hover:bg-blue-600' : 'border-white/20 text-white hover:bg-white/10'}
                >
                  Calibration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEquipment.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                    <p className="text-gray-300 text-sm">{item.type} • {item.model}</p>
                    <p className="text-gray-400 text-xs">{item.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">{item.status}</span>
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Compliance Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Compliance Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                          style={{ width: `${item.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-white">{item.complianceScore}%</span>
                    </div>
                  </div>

                  {/* Calibration Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Last Calibration</p>
                      <p className="text-white font-medium">{item.lastCalibration}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Next Calibration</p>
                      <p className="text-white font-medium">{item.nextCalibration}</p>
                    </div>
                  </div>

                  {/* Environmental Data */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                        <Thermometer className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-gray-400 text-xs">Temperature</p>
                      <p className="text-white font-medium">{item.temperature}°C</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                        <Gauge className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-gray-400 text-xs">Humidity</p>
                      <p className="text-white font-medium">{item.humidity}%</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                        <Zap className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-gray-400 text-xs">Pressure</p>
                      <p className="text-white font-medium">{item.pressure} hPa</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      onClick={() => {
                        const event = new CustomEvent('toggle-assistant')
                        window.dispatchEvent(event)
                      }}
                    >
                      <Bot className="w-3 h-3 mr-1" />
                      AI Assist
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Assistant */}
              {showAIAssistant && <EnhancedBiomniAssistant />}
    </div>
  )
} 
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  BarChart3, 
  FileText, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Brain,
  Eye,
  Target,
  Zap,
  Shield,
  DollarSign,
  HelpCircle,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

interface EquipmentStatus {
  id: string
  name: string
  status: 'compliant' | 'warning' | 'overdue' | 'maintenance'
  lastCalibration: string
  nextCalibration: string
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard'
    },
    {
      name: 'Equipment',
      href: '/dashboard/equipment',
      icon: Settings,
      current: pathname.startsWith('/dashboard/equipment')
    },
    {
      name: 'Calibrations',
      href: '/dashboard/calibrations',
      icon: Calendar,
      current: pathname.startsWith('/dashboard/calibrations')
    },
    {
      name: 'AI & Biomni',
      href: '/dashboard/ai',
      icon: Brain,
      current: pathname.startsWith('/dashboard/ai')
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      current: pathname.startsWith('/dashboard/analytics')
    },
    {
      name: 'Compliance',
      href: '/dashboard/compliance',
      icon: Shield,
      current: pathname.startsWith('/dashboard/compliance')
    },
    {
      name: 'Surveillance',
      href: '/dashboard/surveillance',
      icon: Eye,
      current: pathname.startsWith('/dashboard/surveillance')
    },
    {
      name: 'Public Health',
      href: '/dashboard/public-health',
      icon: Target,
      current: pathname.startsWith('/dashboard/public-health')
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: FileText,
      current: pathname.startsWith('/dashboard/reports')
    },
    {
      name: 'Team',
      href: '/dashboard/team',
      icon: Users,
      current: pathname.startsWith('/dashboard/team')
    },
    {
      name: 'Billing',
      href: '/dashboard/billing',
      icon: DollarSign,
      current: pathname.startsWith('/dashboard/billing')
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: pathname.startsWith('/dashboard/settings')
    }
  ]

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'New Calibration',
      description: 'Schedule equipment calibration',
      icon: <Calendar className="w-5 h-5" />,
      href: '/dashboard/calibrations/new',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: '2',
      title: 'AI Analysis',
      description: 'Run Biomni visual analysis',
      icon: <Eye className="w-5 h-5" />,
      href: '/dashboard/ai/visual-analysis',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: '3',
      title: 'Add Equipment',
      description: 'Register new equipment',
      icon: <Plus className="w-5 h-5" />,
      href: '/dashboard/equipment/new',
      color: 'from-green-500 to-green-600'
    },
    {
      id: '4',
      title: 'Generate Report',
      description: 'Create compliance report',
      icon: <FileText className="w-5 h-5" />,
      href: '/dashboard/reports/generate',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const equipmentStatus: EquipmentStatus[] = [
    {
      id: '1',
      name: 'Analytical Balance PB-220',
      status: 'compliant',
      lastCalibration: '2024-01-15',
      nextCalibration: '2024-02-15'
    },
    {
      id: '2',
      name: 'Centrifuge CF-16',
      status: 'warning',
      lastCalibration: '2024-01-10',
      nextCalibration: '2024-02-10'
    },
    {
      id: '3',
      name: 'Incubator IC-200',
      status: 'overdue',
      lastCalibration: '2024-01-05',
      nextCalibration: '2024-02-05'
    },
    {
      id: '4',
      name: 'pH Meter PH-100',
      status: 'maintenance',
      lastCalibration: '2024-01-20',
      nextCalibration: '2024-02-20'
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
      case 'maintenance':
        return 'text-blue-600 bg-blue-100'
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
      case 'maintenance':
        return <Settings className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className={`bg-white border-r border-gray-200 h-screen ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex flex-col`}>
      {/* Logo - Fixed at top */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">LabGuard</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1"
        >
          <div className="w-4 h-4 flex flex-col justify-center items-center">
            <div className={`w-4 h-0.5 bg-gray-600 transition-all duration-300 ${isCollapsed ? 'rotate-45 translate-y-0.5' : ''}`}></div>
            <div className={`w-4 h-0.5 bg-gray-600 my-0.5 transition-all duration-300 ${isCollapsed ? 'opacity-0' : ''}`}></div>
            <div className={`w-4 h-0.5 bg-gray-600 transition-all duration-300 ${isCollapsed ? '-rotate-45 -translate-y-0.5' : ''}`}></div>
          </div>
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  item.current
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {action.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {action.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Equipment Status */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Equipment Status
            </h3>
            <div className="space-y-2">
              {equipmentStatus.map((equipment) => (
                <div
                  key={equipment.id}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(equipment.status)}
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {equipment.name}
                      </span>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(equipment.status)}`}>
                      {equipment.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Next: {equipment.nextCalibration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Support - Fixed at bottom */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Need Help?</span>
            </div>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-gray-600 hover:text-gray-900"
                onClick={() => console.log('Contact Support')}
              >
                <MessageSquare className="w-3 h-3 mr-2" />
                Contact Support
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-gray-600 hover:text-gray-900"
                onClick={() => console.log('Documentation')}
              >
                <FileText className="w-3 h-3 mr-2" />
                Documentation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
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
  MessageSquare,
  LogOut,
  User,
  Building,
  Crown,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  laboratory: {
    id: string;
    name: string;
    planType: string;
    subscriptionStatus: string;
  };
}

interface DashboardSidebarProps {
  onLogout: () => void;
  user: UserData | null;
}

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

export function DashboardSidebar({ onLogout, user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard',
      badge: null
    },
    {
      name: 'Equipment',
      href: '/dashboard/equipment',
      icon: Settings,
      current: pathname.startsWith('/dashboard/equipment'),
      badge: '12'
    },
    {
      name: 'Calibrations',
      href: '/dashboard/calibrations',
      icon: Calendar,
      current: pathname.startsWith('/dashboard/calibrations'),
      badge: '3'
    },
    {
      name: 'AI & Biomni',
      href: '/dashboard/ai',
      icon: Brain,
      current: pathname.startsWith('/dashboard/ai'),
      badge: null
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      current: pathname.startsWith('/dashboard/analytics'),
      badge: null
    },
    {
      name: 'Team',
      href: '/dashboard/team',
      icon: Users,
      current: pathname.startsWith('/dashboard/team'),
      badge: '5'
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: FileText,
      current: pathname.startsWith('/dashboard/reports'),
      badge: null
    },
    {
      name: 'Notifications',
      href: '/dashboard/notifications',
      icon: Bell,
      current: pathname.startsWith('/dashboard/notifications'),
      badge: '2'
    },
    {
      name: 'Billing',
      href: '/dashboard/billing',
      icon: DollarSign,
      current: pathname.startsWith('/dashboard/billing'),
      badge: null
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: pathname.startsWith('/dashboard/settings'),
      badge: null
    },
    {
      name: 'Admin',
      href: '/dashboard/admin',
      icon: Crown,
      current: pathname.startsWith('/dashboard/admin'),
      badge: null
    }
  ]

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Add Equipment',
      description: 'Register new laboratory equipment',
      icon: <Plus className="h-4 w-4" />,
      href: '/dashboard/equipment/new',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: '2',
      title: 'Schedule Calibration',
      description: 'Book equipment calibration',
      icon: <Calendar className="h-4 w-4" />,
      href: '/dashboard/calibrations/schedule',
      color: 'from-green-500 to-green-600'
    },
    {
      id: '3',
      title: 'AI Analysis',
      description: 'Run Biomni AI analysis',
      icon: <Brain className="h-4 w-4" />,
      href: '/dashboard/ai/analysis',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: '4',
      title: 'Generate Report',
      description: 'Create compliance report',
      icon: <FileText className="h-4 w-4" />,
      href: '/dashboard/reports/generate',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: '5',
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: <BarChart3 className="h-4 w-4" />,
      href: '/dashboard/analytics',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: '6',
      title: 'Manage Team',
      description: 'Update team members',
      icon: <Users className="h-4 w-4" />,
      href: '/dashboard/team',
      color: 'from-pink-500 to-pink-600'
    }
  ]

  const equipmentStatus: EquipmentStatus[] = [
    {
      id: '1',
      name: 'Centrifuge CF-16',
      status: 'compliant',
      lastCalibration: '2024-01-15',
      nextCalibration: '2024-04-15'
    },
    {
      id: '2',
      name: 'Balance PB-220',
      status: 'warning',
      lastCalibration: '2024-01-10',
      nextCalibration: '2024-02-10'
    },
    {
      id: '3',
      name: 'Incubator IC-200',
      status: 'overdue',
      lastCalibration: '2023-12-20',
      nextCalibration: '2024-01-20'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-400 bg-green-500/20'
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/20'
      case 'overdue':
        return 'text-red-400 bg-red-500/20'
      case 'maintenance':
        return 'text-blue-400 bg-blue-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'overdue':
        return <Clock className="h-4 w-4" />
      case 'maintenance':
        return <Settings className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Crown className="h-4 w-4 text-amber-400" />
      case 'manager':
        return <Shield className="h-4 w-4 text-blue-400" />
      default:
        return <User className="h-4 w-4 text-green-400" />
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
            <Zap className="h-6 w-6 text-blue-400" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                LabGuard Pro
              </h2>
              <p className="text-xs text-slate-400">Laboratory Intelligence</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-800/50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-400" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              item.current
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && (
              <>
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <Badge className="ml-auto bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="px-4 py-6 border-t border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-200 group"
              >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                    {action.title}
                  </p>
                  <p className="text-xs text-slate-400">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Equipment Status */}
      {!isCollapsed && (
        <div className="px-4 py-6 border-t border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Equipment Status</h3>
          <div className="space-y-3">
            {equipmentStatus.map((equipment) => (
              <div
                key={equipment.id}
                className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-200">{equipment.name}</p>
                  <div className={`p-1 rounded ${getStatusColor(equipment.status)}`}>
                    {getStatusIcon(equipment.status)}
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Next: {new Date(equipment.nextCalibration).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={user?.firstName} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold">
              {user ? getInitials(user.firstName, user.lastName) : 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-slate-200">
                  {user?.firstName} {user?.lastName}
                </p>
                {getRoleIcon(user?.role || '')}
              </div>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              <p className="text-xs text-slate-500">{user?.laboratory.name}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="p-2 hover:bg-slate-800/50 text-slate-400 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 
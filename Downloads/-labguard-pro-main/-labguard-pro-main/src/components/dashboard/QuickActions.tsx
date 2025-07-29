'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FlaskConical, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  Zap,
  Plus,
  Download,
  Upload,
  Bell
} from 'lucide-react'

const quickActions = [
  {
    id: 1,
    title: 'Add Equipment',
    description: 'Register new laboratory equipment',
    icon: Plus,
    color: 'from-teal-400 to-cyan-500',
    href: '/dashboard/equipment/new'
  },
  {
    id: 2,
    title: 'Schedule Calibration',
    description: 'Book equipment calibration',
    icon: Calendar,
    color: 'from-blue-400 to-indigo-500',
    href: '/dashboard/calibrations/new'
  },
  {
    id: 3,
    title: 'Generate Report',
    description: 'Create compliance reports',
    icon: FileText,
    color: 'from-emerald-400 to-teal-500',
    href: '/dashboard/reports'
  },
  {
    id: 4,
    title: 'Team Management',
    description: 'Manage laboratory staff',
    icon: Users,
    color: 'from-purple-400 to-pink-500',
    href: '/dashboard/team'
  },
  {
    id: 5,
    title: 'AI Analysis',
    description: 'Get intelligent insights',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    href: '/dashboard/ai'
  },
  {
    id: 6,
    title: 'Settings',
    description: 'Configure laboratory settings',
    icon: Settings,
    color: 'from-gray-400 to-slate-500',
    href: '/dashboard/settings'
  }
]

const systemActions = [
  {
    id: 1,
    title: 'Export Data',
    description: 'Download laboratory data',
    icon: Download,
    action: () => {
      // Export laboratory data
      const exportData = {
        equipment: equipment,
        calibrations: calibrations,
        exportDate: new Date().toISOString(),
        laboratory: 'Advanced Research Laboratory'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `labguard-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  },
  {
    id: 2,
    title: 'Import Data',
    description: 'Import equipment and calibration data',
    icon: Upload,
    color: 'blue',
    action: () => {
      // Navigate to import page
      window.location.href = '/dashboard/import';
    }
  },
  {
    id: 3,
    title: 'Notifications',
    description: 'View all notifications and alerts',
    icon: Bell,
    color: 'purple',
    action: () => {
      // Navigate to notifications page
      window.location.href = '/dashboard/notifications';
    }
  }
]

export function QuickActions() {
  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500">
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Common laboratory tasks
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-20 p-4 bg-white/5 border-white/20 hover:bg-white/10 rounded-2xl transition-all duration-200 group hover:scale-105 flex flex-col items-center justify-center space-y-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`p-2 rounded-xl bg-gradient-to-br ${action.color} shadow-lg group-hover:shadow-xl transition-all duration-200`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-white">{action.title}</p>
                <p className="text-xs text-gray-400 truncate">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
        
        {/* System Actions */}
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-sm font-medium text-white mb-3">System Actions</h4>
          <div className="space-y-2">
            {systemActions.map((action, index) => (
              <Button
                key={action.id}
                variant="ghost"
                className="w-full justify-start h-12 px-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                onClick={action.action}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <action.icon className="h-4 w-4 mr-3 text-gray-400 group-hover:text-white transition-colors duration-200" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-gray-400">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-white">System Online</p>
                <p className="text-xs text-gray-400">All services operational</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-emerald-400">98.5%</p>
              <p className="text-xs text-gray-400">Uptime</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
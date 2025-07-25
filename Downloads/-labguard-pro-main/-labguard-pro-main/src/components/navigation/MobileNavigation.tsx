'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { 
  Menu, 
  Home, 
  Settings, 
  BarChart3, 
  TestTube, 
  Brain, 
  Bell, 
  User,
  Search,
  Plus,
  X,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileNavigationProps {
  user?: any
  notifications?: number
}

export function MobileNavigation({ user, notifications = 0 }: MobileNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      active: pathname === '/dashboard'
    },
    {
      name: 'Equipment',
      href: '/dashboard/equipment',
      icon: TestTube,
      active: pathname.startsWith('/dashboard/equipment')
    },
    {
      name: 'Calibrations',
      href: '/dashboard/calibrations',
      icon: Settings,
      active: pathname.startsWith('/dashboard/calibrations')
    },
    {
      name: 'AI Assistant',
      href: '/dashboard/ai',
      icon: Brain,
      active: pathname.startsWith('/dashboard/ai')
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: BarChart3,
      active: pathname.startsWith('/dashboard/reports')
    }
  ]

  const quickActions = [
    {
      name: 'New Calibration',
      href: '/dashboard/calibrations/new',
      icon: Plus,
      description: 'Schedule a new calibration'
    },
    {
      name: 'Add Equipment',
      href: '/dashboard/equipment/new',
      icon: Plus,
      description: 'Register new equipment'
    },
    {
      name: 'AI Analysis',
      href: '/dashboard/ai',
      icon: Brain,
      description: 'Get AI insights'
    }
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50 md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center space-y-1 h-16 w-16 rounded-lg",
                item.active 
                  ? "bg-blue-500/20 text-blue-400" 
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Button>
          ))}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center space-y-1 h-16 w-16 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Menu className="w-5 h-5" />
                <span className="text-xs font-medium">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">LG</span>
                    </div>
                    <div>
                      <h2 className="text-white font-semibold">LabGuard Pro</h2>
                      <p className="text-gray-400 text-sm">Laboratory Management</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* User Info */}
                {user && (
                  <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="p-4 border-b border-slate-700/50">
                  <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {quickActions.map((action) => (
                      <Button
                        key={action.name}
                        variant="ghost"
                        className="w-full justify-start p-3 h-auto"
                        onClick={() => handleNavigation(action.href)}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <action.icon className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-white font-medium">{action.name}</p>
                            <p className="text-gray-400 text-xs">{action.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 p-4">
                  <h3 className="text-white font-semibold mb-3">Navigation</h3>
                  <div className="space-y-1">
                    {navigationItems.map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start p-3 h-auto",
                          item.active 
                            ? "bg-blue-500/20 text-blue-400" 
                            : "text-gray-400 hover:text-white hover:bg-white/10"
                        )}
                        onClick={() => handleNavigation(item.href)}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-700/50">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleNavigation('/dashboard/notifications')}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                      {notifications > 0 && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          {notifications}
                        </Badge>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleNavigation('/dashboard/settings')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LG</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm">LabGuard Pro</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={() => router.push('/dashboard/search')}
            >
              <Search className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white relative"
              onClick={() => router.push('/dashboard/notifications')}
            >
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs flex items-center justify-center"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
} 
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  TestTube, 
  Thermometer, 
  Shield, 
  Settings, 
  Users, 
  FileText, 
  BarChart3, 
  Bell, 
  ChevronDown,
  FlaskConical,
  Microscope,
  AlertTriangle,
  CheckCircle,
  Zap,
  Bot,
  MessageSquare,
  Activity,
  Globe,
  Brain,
  Database,
  Upload,
  Monitor
} from 'lucide-react'

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: string
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />
  },
  {
    title: 'AI Assistant',
    href: '/dashboard/ai-assistant-demo',
    icon: <Bot className="h-4 w-4" />,
    badge: 'New'
  },
  {
    title: 'Compliance Hub',
    href: '/dashboard/compliance',
    icon: <Shield className="h-4 w-4" />,
    badge: 'Live',
    children: [
      {
        title: 'PCR Verification',
        href: '/dashboard/compliance?tool=pcr',
        icon: <TestTube className="h-4 w-4" />
      },
      {
        title: 'Media Validation',
        href: '/dashboard/compliance?tool=media',
        icon: <Thermometer className="h-4 w-4" />
      },
      {
        title: 'Safety Incidents',
        href: '/dashboard/compliance?tool=incident',
        icon: <AlertTriangle className="h-4 w-4" />
      }
    ]
  },
  {
    title: 'Equipment',
    href: '/dashboard/equipment',
    icon: <FlaskConical className="h-4 w-4" />
  },
  {
    title: 'Calibrations',
    href: '/dashboard/calibrations',
    icon: <Microscope className="h-4 w-4" />
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: <FileText className="h-4 w-4" />
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: <BarChart3 className="h-4 w-4" />
  },
  {
    title: 'Team',
    href: '/dashboard/team',
    icon: <Users className="h-4 w-4" />
  },
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    icon: <Bell className="h-4 w-4" />
  },
  {
    title: 'QC Monitoring',
    href: '/dashboard/qc-monitoring',
    icon: <Activity className="h-4 w-4" />,
    badge: 'Live'
  },
  {
    title: 'Surveillance',
    href: '/dashboard/surveillance',
    icon: <Activity className="h-4 w-4" />,
    badge: 'New',
    children: [
      {
        title: 'Dashboard',
        href: '/dashboard/surveillance',
        icon: <BarChart3 className="h-4 w-4" />
      },
      {
        title: 'LabWare Integration',
        href: '/dashboard/surveillance/labware',
        icon: <Database className="h-4 w-4" />
      },
      {
        title: 'NEDSS Automation',
        href: '/dashboard/surveillance/nedss',
        icon: <Upload className="h-4 w-4" />
      },
      {
        title: 'ArboNET Upload',
        href: '/dashboard/surveillance/arboret',
        icon: <Globe className="h-4 w-4" />
      },
      {
        title: 'Report Generation',
        href: '/dashboard/surveillance/reports',
        icon: <FileText className="h-4 w-4" />
      },
      {
        title: 'Equipment Monitoring',
        href: '/dashboard/surveillance/equipment',
        icon: <Monitor className="h-4 w-4" />
      },
      {
        title: 'Analytics',
        href: '/dashboard/surveillance/analytics',
        icon: <BarChart3 className="h-4 w-4" />
      },
      {
        title: 'Settings',
        href: '/dashboard/surveillance/settings',
        icon: <Settings className="h-4 w-4" />
      }
    ]
  },
  {
    title: 'Public Health',
    href: '/dashboard/public-health',
    icon: <Microscope className="h-4 w-4" />,
    badge: 'Live',
    children: [
      {
        title: 'Surveillance Data',
        href: '/dashboard/public-health',
        icon: <Activity className="h-4 w-4" />
      },
      {
        title: 'System Integrations',
        href: '/dashboard/public-health/integrations',
        icon: <Globe className="h-4 w-4" />
      },
      {
        title: 'Automated Reports',
        href: '/dashboard/public-health/reports',
        icon: <FileText className="h-4 w-4" />
      },
      {
        title: 'AI Analysis',
        href: '/dashboard/public-health/analytics',
        icon: <Brain className="h-4 w-4" />
      }
    ]
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="h-4 w-4" />
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Compliance Hub'])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href.includes('?')) {
      return pathname === href.split('?')[0]
    }
    return pathname === href
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">LabGuard Pro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => (
          <div key={item.title}>
            <Link href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-10",
                  isActive(item.href) && "bg-blue-600 text-white hover:bg-blue-700"
                )}
                onClick={() => item.children && toggleExpanded(item.title)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs",
                          item.badge === 'New' && "bg-green-100 text-green-700",
                          item.badge === 'Live' && "bg-blue-100 text-blue-700"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {item.children && (
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedItems.includes(item.title) && "rotate-180"
                        )} 
                      />
                    )}
                  </div>
                </div>
              </Button>
            </Link>

            {/* Submenu */}
            {item.children && expandedItems.includes(item.title) && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map((child) => (
                  <Link key={child.title} href={child.href}>
                    <Button
                      variant={isActive(child.href) ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start h-8 text-sm",
                        isActive(child.href) && "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      )}
                    >
                      {child.icon}
                      <span className="ml-3">{child.title}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          
          <Link href="/dashboard/compliance?tool=pcr">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <TestTube className="h-4 w-4 mr-2" />
              PCR Verification
            </Button>
          </Link>
          
          <Link href="/dashboard/compliance?tool=media">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Thermometer className="h-4 w-4 mr-2" />
              Media Validation
            </Button>
          </Link>
          
          <Link href="/dashboard/ai-assistant-demo">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 
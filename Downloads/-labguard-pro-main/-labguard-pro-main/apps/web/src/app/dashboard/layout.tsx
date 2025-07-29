'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileText, 
  Activity,
  Brain,
  LogOut,
  Menu,
  Microscope,
  Calendar,
  BarChart3,
  Shield,
  Bell,
  CreditCard,
  Database,
  Zap,
  Search,
  UserCheck,
  Cog,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  TestTube,
  Target,
  Globe,
  Code,
  Building,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    current: false
  },
  {
    name: 'Equipment',
    href: '/dashboard/equipment',
    icon: Microscope,
    current: false,
    children: [
      { name: 'All Equipment', href: '/dashboard/equipment', icon: Microscope },
      { name: 'Add Equipment', href: '/dashboard/equipment/new', icon: Plus },
      { name: 'Equipment Modern', href: '/dashboard/equipment-modern', icon: FlaskConical }
    ]
  },
  {
    name: 'Calibrations',
    href: '/dashboard/calibrations',
    icon: Calendar,
    current: false,
    children: [
      { name: 'All Calibrations', href: '/dashboard/calibrations', icon: Calendar },
      { name: 'New Calibration', href: '/dashboard/calibrations/new', icon: Plus },
      { name: 'Due Calibrations', href: '/dashboard/calibrations/due', icon: Clock },
      { name: 'Overdue Items', href: '/dashboard/calibrations/overdue', icon: AlertTriangle }
    ]
  },
  {
    name: 'AI & Biomni',
    href: '/dashboard/ai',
    icon: Brain,
    current: false,
    children: [
      { name: 'AI Assistant', href: '/dashboard/ai', icon: Brain },
      { name: 'AI Assistant Demo', href: '/dashboard/ai-assistant-demo', icon: Brain },
      { name: 'Biomni', href: '/dashboard/biomni', icon: TestTube },
      { name: 'Anomaly Detection', href: '/dashboard/ai/anomaly-detection', icon: AlertTriangle },
      { name: 'Predictive Maintenance', href: '/dashboard/ai/predictive-maintenance', icon: TrendingUp },
      { name: 'NLP Reports', href: '/dashboard/ai/nlp-reports', icon: FileText }
    ]
  },
  {
    name: 'Compliance',
    href: '/dashboard/compliance',
    icon: Shield,
    current: false
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    current: false,
    children: [
      { name: 'All Reports', href: '/dashboard/reports', icon: FileText },
      { name: 'Compliance Reports', href: '/dashboard/reports/compliance', icon: Shield },
      { name: 'Equipment Reports', href: '/dashboard/reports/equipment', icon: Microscope }
    ]
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    current: false,
    children: [
      { name: 'Overview', href: '/dashboard/analytics', icon: BarChart3 },
      { name: 'Enterprise Analytics', href: '/dashboard/analytics/enterprise', icon: Building }
    ]
  },
  {
    name: 'Team',
    href: '/dashboard/team',
    icon: Users,
    current: false,
    children: [
      { name: 'Team Overview', href: '/dashboard/team', icon: Users },
      { name: 'Invite Members', href: '/dashboard/team/invite', icon: UserCheck }
    ]
  },
  {
    name: 'QC Monitoring',
    href: '/dashboard/qc-monitoring',
    icon: Target,
    current: false
  },
  {
    name: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell,
    current: false
  },
  {
    name: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard,
    current: false,
    children: [
      { name: 'Overview', href: '/dashboard/billing', icon: CreditCard },
      { name: 'Subscription', href: '/dashboard/billing/subscription', icon: CreditCard },
      { name: 'Payment Methods', href: '/dashboard/billing/payment-methods', icon: CreditCard },
      { name: 'Invoices', href: '/dashboard/billing/invoices', icon: FileText },
      { name: 'Usage', href: '/dashboard/billing/usage', icon: BarChart3 },
      { name: 'Plans', href: '/dashboard/billing/plans', icon: Building },
      { name: 'Settings', href: '/dashboard/billing/settings', icon: Settings }
    ]
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    current: false,
    children: [
      { name: 'Profile', href: '/dashboard/settings/profile', icon: Users },
      { name: 'Security', href: '/dashboard/settings/security', icon: Shield },
      { name: 'Notifications', href: '/dashboard/settings/notifications', icon: Bell },
      { name: 'Email Templates', href: '/dashboard/settings/email-templates', icon: FileText },
      { name: 'Laboratory', href: '/dashboard/settings/laboratory', icon: Building }
    ]
  },
  {
    name: 'Integrations',
    href: '/dashboard/integrations',
    icon: Globe,
    current: false,
    children: [
      { name: 'LIMS Integration', href: '/dashboard/integrations/lims', icon: Database }
    ]
  },
  {
    name: 'Data Management',
    href: '/dashboard/data-management',
    icon: Database,
    current: false
  },
  {
    name: 'Automation',
    href: '/dashboard/automation',
    icon: Zap,
    current: false
  },
  {
    name: 'API',
    href: '/dashboard/api',
    icon: Code,
    current: false
  },
  {
    name: 'Search',
    href: '/dashboard/search',
    icon: Search,
    current: false
  },
  {
    name: 'Onboarding',
    href: '/dashboard/onboarding',
    icon: UserCheck,
    current: false
  },
  {
    name: 'Bulk Operations',
    href: '/dashboard/bulk-operations',
    icon: Cog,
    current: false
  },
  {
    name: 'Admin',
    href: '/dashboard/admin',
    icon: Building,
    current: false,
    children: [
      { name: 'System', href: '/dashboard/admin/system', icon: Cog },
      { name: 'Billing', href: '/dashboard/admin/billing', icon: CreditCard }
    ]
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white/95 backdrop-blur-xl border-r border-white/10">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold text-white">LabGuard Pro</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-white/10"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {item.children && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto p-1"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleExpanded(item.name);
                      }}
                    >
                      {expandedItems.includes(item.name) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </Link>

                {/* Submenu */}
                {item.children && expandedItems.includes(item.name) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link key={child.name} href={child.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-8 text-sm ${
                            isActive(child.href)
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <child.icon className="w-4 h-4 mr-2" />
                          {child.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/5 backdrop-blur-xl border-r border-white/10">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-lg font-semibold text-white">LabGuard Pro</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {item.children && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto p-1"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleExpanded(item.name);
                      }}
                    >
                      {expandedItems.includes(item.name) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </Link>

                {/* Submenu */}
                {item.children && expandedItems.includes(item.name) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link key={child.name} href={child.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-8 text-sm ${
                            isActive(child.href)
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <child.icon className="w-4 h-4 mr-2" />
                          {child.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-white/5 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            type="button"
            variant="ghost"
            className="-m-2.5 p-2.5 text-gray-300 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Add any header content here */}
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 
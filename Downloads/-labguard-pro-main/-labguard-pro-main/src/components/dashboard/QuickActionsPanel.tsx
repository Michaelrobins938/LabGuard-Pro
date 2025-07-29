"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDashboardStore } from '@/stores/dashboardStore';
import { 
  Plus, 
  Calendar, 
  Bot, 
  FileText, 
  Settings,
  Users,
  Bell,
  BarChart3,
  Microscope,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Zap,
  TrendingUp,
  Shield,
  Database,
  Download,
  Upload,
  Search,
  Filter
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  roles?: string[];
  isFavorite?: boolean;
  isRecent?: boolean;
  shortcut?: string;
  category: 'equipment' | 'calibration' | 'ai' | 'reports' | 'team' | 'system';
}

interface RecentTemplate {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
  usageCount: number;
}

export function QuickActionsPanel() {
  const router = useRouter();
  const { user } = useDashboardStore();
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const userRole = user?.role || 'user';

  const quickActions: QuickAction[] = [
    // Equipment Actions
    {
      id: 'add-equipment',
      title: 'Add Equipment',
      description: 'Register new laboratory equipment',
      icon: Plus,
      href: '/dashboard/equipment/new',
      variant: 'default',
      roles: ['admin', 'manager', 'technician'],
      isFavorite: true,
      category: 'equipment',
      shortcut: 'Ctrl+E'
    },
    {
      id: 'scan-equipment',
      title: 'Scan Equipment',
      description: 'Scan QR code to identify equipment',
      icon: Microscope,
      href: '/dashboard/equipment/scan',
      variant: 'outline',
      roles: ['admin', 'manager', 'technician'],
      category: 'equipment'
    },
    {
      id: 'equipment-maintenance',
      title: 'Schedule Maintenance',
      description: 'Schedule preventive maintenance',
      icon: Settings,
      href: '/dashboard/equipment/maintenance',
      variant: 'outline',
      roles: ['admin', 'manager', 'technician'],
      category: 'equipment'
    },

    // Calibration Actions
    {
      id: 'schedule-calibration',
      title: 'Schedule Calibration',
      description: 'Set up equipment calibration',
      icon: Calendar,
      href: '/dashboard/calibrations/new',
      variant: 'outline',
      roles: ['admin', 'manager', 'technician'],
      isFavorite: true,
      category: 'calibration',
      shortcut: 'Ctrl+C'
    },
    {
      id: 'batch-calibration',
      title: 'Batch Calibration',
      description: 'Schedule multiple calibrations',
      icon: Calendar,
      href: '/dashboard/calibrations/batch',
      variant: 'outline',
      roles: ['admin', 'manager'],
      category: 'calibration'
    },
    {
      id: 'calibration-certificate',
      title: 'Generate Certificate',
      description: 'Create calibration certificates',
      icon: FileText,
      href: '/dashboard/calibrations/certificates',
      variant: 'outline',
      roles: ['admin', 'manager', 'technician'],
      category: 'calibration'
    },

    // AI Actions
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Get AI-powered insights',
      icon: Bot,
      href: '/dashboard/ai',
      variant: 'secondary',
      roles: ['admin', 'manager', 'technician', 'user'],
      isFavorite: true,
      badge: 'New',
      category: 'ai',
      shortcut: 'Ctrl+A'
    },
    {
      id: 'protocol-generation',
      title: 'Generate Protocol',
      description: 'Create experimental protocols',
      icon: FileText,
      href: '/dashboard/ai/protocols',
      variant: 'outline',
      roles: ['admin', 'manager', 'technician'],
      category: 'ai'
    },
    {
      id: 'visual-analysis',
      title: 'Visual Analysis',
      description: 'Analyze images with AI',
      icon: Search,
      href: '/dashboard/ai/visual',
      variant: 'outline',
      roles: ['admin', 'manager', 'technician'],
      category: 'ai'
    },

    // Reports Actions
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create compliance reports',
      icon: FileText,
      href: '/dashboard/reports/new',
      variant: 'outline',
      roles: ['admin', 'manager'],
      isFavorite: true,
      category: 'reports',
      shortcut: 'Ctrl+R'
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Export laboratory data',
      icon: Download,
      href: '/dashboard/reports/export',
      variant: 'outline',
      roles: ['admin', 'manager'],
      category: 'reports'
    },
    {
      id: 'compliance-report',
      title: 'Compliance Report',
      description: 'Generate compliance summary',
      icon: Shield,
      href: '/dashboard/reports/compliance',
      variant: 'outline',
      roles: ['admin', 'manager'],
      category: 'reports'
    },

    // Team Actions
    {
      id: 'team-management',
      title: 'Team Management',
      description: 'Manage team members',
      icon: Users,
      href: '/dashboard/team',
      variant: 'outline',
      roles: ['admin', 'manager'],
      category: 'team'
    },
    {
      id: 'invite-user',
      title: 'Invite User',
      description: 'Invite new team member',
      icon: Users,
      href: '/dashboard/team/invite',
      variant: 'outline',
      roles: ['admin', 'manager'],
      category: 'team'
    },
    {
      id: 'role-management',
      title: 'Role Management',
      description: 'Manage user roles',
      icon: Settings,
      href: '/dashboard/team/roles',
      variant: 'outline',
      roles: ['admin'],
      category: 'team'
    },

    // System Actions
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'View all notifications',
      icon: Bell,
      href: '/dashboard/notifications',
      variant: 'outline',
      roles: ['admin', 'manager', 'technician', 'user'],
      category: 'system'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View detailed analytics',
      icon: BarChart3,
      href: '/dashboard/analytics',
      variant: 'outline',
      roles: ['admin', 'manager'],
      category: 'system'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure system settings',
      icon: Settings,
      href: '/dashboard/settings',
      variant: 'outline',
      roles: ['admin', 'manager'],
      category: 'system'
    }
  ];

  // Recent templates
  const recentTemplates: RecentTemplate[] = [
    {
      id: '1',
      name: 'PCR Protocol Template',
      type: 'Protocol',
      lastUsed: '2 hours ago',
      usageCount: 15
    },
    {
      id: '2',
      name: 'Equipment Calibration Report',
      type: 'Report',
      lastUsed: '1 day ago',
      usageCount: 8
    },
    {
      id: '3',
      name: 'Monthly Compliance Summary',
      type: 'Report',
      lastUsed: '3 days ago',
      usageCount: 12
    }
  ];

  // Filter actions based on user role and category
  const filteredActions = quickActions.filter(action => {
    const hasRole = !action.roles || action.roles.includes(userRole);
    const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
    const matchesFavorite = !showFavorites || action.isFavorite;
    
    return hasRole && matchesCategory && matchesFavorite;
  });

  const handleActionClick = (action: QuickAction) => {
    router.push(action.href);
  };

  const categories = [
    { id: 'all', label: 'All', icon: Zap },
    { id: 'equipment', label: 'Equipment', icon: Microscope },
    { id: 'calibration', label: 'Calibration', icon: Calendar },
    { id: 'ai', label: 'AI', icon: Bot },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'system', label: 'System', icon: Settings }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          <Button
            variant={showFavorites ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
            className="h-8"
          >
            <Star className="h-4 w-4 mr-1" />
            Favorites
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex space-x-1 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-1 whitespace-nowrap"
              >
                <Icon className="h-3 w-3" />
                <span className="text-xs">{category.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
          {filteredActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant || 'outline'}
                className="w-full justify-start h-auto p-3"
                onClick={() => handleActionClick(action)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{action.title}</span>
                      {action.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                      {action.isFavorite && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                  {action.shortcut && (
                    <Badge variant="outline" className="text-xs">
                      {action.shortcut}
                    </Badge>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* Recent Templates */}
        {recentTemplates.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium mb-3">Recent Templates</h4>
            <div className="space-y-2">
              {recentTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/templates/${template.id}`)}
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {template.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{template.type}</span>
                      <span>•</span>
                      <span>{template.lastUsed}</span>
                      <span>•</span>
                      <span>{template.usageCount} uses</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
              <p className="font-medium">All Systems</p>
              <p className="text-green-600 dark:text-green-400">Operational</p>
            </div>
            <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
              <p className="font-medium">Response Time</p>
              <p className="text-blue-600 dark:text-blue-400">&lt; 200ms</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Settings, 
  Shield, 
  Activity, 
  Database, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  CreditCard,
  Building,
  Cog,
  Server,
  HardDrive,
  Network,
  Cpu,
  Globe,
  Lock,
  Eye,
  UserCheck,
  UserX,
  UserPlus,
  DollarSign,
  FileText,
  Zap,
  Bell,
  Calendar,
  Target,
  Microscope,
  TestTube,
  Brain
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  activeUsers: number;
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  systemUptime: number;
  lastBackup: string;
  securityEvents: number;
  pendingApprovals: number;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'permission_change' | 'data_access' | 'system_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  user: string;
  ip: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'TECHNICIAN' | 'VIEWER';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  laboratoryId: string;
}

export default function AdminPage() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    activeUsers: 0,
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    systemUptime: 0,
    lastBackup: '',
    securityEvents: 0,
    pendingApprovals: 0
  });

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading system metrics
    const loadSystemMetrics = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSystemMetrics({
        cpu: 45.2,
        memory: 67.8,
        disk: 23.4,
        network: 89.1,
        activeUsers: 156,
        totalUsers: 234,
        activeSubscriptions: 89,
        totalRevenue: 125000,
        systemUptime: 99.97,
        lastBackup: '2024-01-15T10:30:00Z',
        securityEvents: 12,
        pendingApprovals: 5
      });

      setSecurityEvents([
        {
          id: '1',
          type: 'login',
          severity: 'low',
          description: 'User login from new IP address',
          timestamp: '2024-01-15T14:30:00Z',
          user: 'john.doe@labguard.com',
          ip: '192.168.1.100'
        },
        {
          id: '2',
          type: 'permission_change',
          severity: 'medium',
          description: 'Role changed from TECHNICIAN to SUPERVISOR',
          timestamp: '2024-01-15T13:45:00Z',
          user: 'admin@labguard.com',
          ip: '192.168.1.1'
        },
        {
          id: '3',
          type: 'data_access',
          severity: 'high',
          description: 'Bulk data export initiated',
          timestamp: '2024-01-15T12:15:00Z',
          user: 'sarah.smith@labguard.com',
          ip: '192.168.1.50'
        }
      ]);

      setUsers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@labguard.com',
          role: 'ADMIN',
          status: 'active',
          lastLogin: '2024-01-15T14:30:00Z',
          laboratoryId: 'lab-1'
        },
        {
          id: '2',
          name: 'Sarah Smith',
          email: 'sarah.smith@labguard.com',
          role: 'SUPERVISOR',
          status: 'active',
          lastLogin: '2024-01-15T12:15:00Z',
          laboratoryId: 'lab-1'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@labguard.com',
          role: 'TECHNICIAN',
          status: 'active',
          lastLogin: '2024-01-15T10:45:00Z',
          laboratoryId: 'lab-1'
        }
      ]);

      setLoading(false);
    };

    loadSystemMetrics();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <UserCheck className="h-4 w-4" />;
      case 'logout': return <UserX className="h-4 w-4" />;
      case 'permission_change': return <Shield className="h-4 w-4" />;
      case 'data_access': return <Database className="h-4 w-4" />;
      case 'system_change': return <Settings className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-gray-600">
            Monitor and manage system performance, users, and security
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Button>
          <Button>
            <Shield className="mr-2 h-4 w-4" />
            Security Audit
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Performance</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.cpu}%</div>
            <p className="text-xs text-muted-foreground">CPU Usage</p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemMetrics.cpu}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.memory}%</div>
            <p className="text-xs text-muted-foreground">RAM Utilization</p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemMetrics.memory}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              of {systemMetrics.totalUsers} total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.systemUptime}%</div>
            <p className="text-xs text-muted-foreground">Availability</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                System Health
              </CardTitle>
              <CardDescription>
                Real-time system performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <HardDrive className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Disk Usage</p>
                    <p className="text-xs text-gray-500">{systemMetrics.disk}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Network className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Network</p>
                    <p className="text-xs text-gray-500">{systemMetrics.network}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Database</p>
                    <p className="text-xs text-gray-500">Healthy</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">API Response</p>
                    <p className="text-xs text-gray-500">245ms avg</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Backup</span>
                  <span className="text-sm text-gray-500">
                    {new Date(systemMetrics.lastBackup).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Security Events</span>
                  <Badge variant="outline">{systemMetrics.securityEvents}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending Approvals</span>
                  <Badge variant="outline">{systemMetrics.pendingApprovals}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue & Subscriptions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Revenue & Subscriptions
              </CardTitle>
              <CardDescription>
                Financial metrics and subscription status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold">${systemMetrics.totalRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Active Subscriptions</p>
                  <p className="text-2xl font-bold">{systemMetrics.activeSubscriptions}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monthly Recurring Revenue</span>
                  <span className="text-sm font-bold">$45,230</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Churn Rate</span>
                  <span className="text-sm text-green-600">2.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Revenue Per User</span>
                  <span className="text-sm font-bold">$508</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Security Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Recent Security Events
            </CardTitle>
            <CardDescription>
              Monitor system security and access patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                  <div className="flex items-center space-x-2">
                    {getEventIcon(event.type)}
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.description}</p>
                    <p className="text-xs text-gray-500">
                      {event.user} • {event.ip} • {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage system users and permissions
                </CardDescription>
              </div>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{user.role}</Badge>
                    <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {user.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 
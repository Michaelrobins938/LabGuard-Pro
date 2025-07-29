'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  ChevronDown,
  Zap,
  Shield,
  Crown
} from 'lucide-react';

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

interface DashboardHeaderProps {
  user: UserData | null;
  onLogout: () => void;
  onMenuClick: () => void;
  loggingOut: boolean;
}

export function DashboardHeader({ user, onLogout, onMenuClick, loggingOut }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, title: 'Equipment calibration due', time: '2 min ago', unread: true },
    { id: 2, title: 'New AI insights available', time: '5 min ago', unread: true },
    { id: 3, title: 'Team member joined', time: '1 hour ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Crown className="h-4 w-4 text-amber-400" />;
      case 'manager':
        return <Shield className="h-4 w-4 text-blue-400" />;
      default:
        return <User className="h-4 w-4 text-green-400" />;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-slate-800/50"
            >
              <Menu className="h-5 w-5 text-slate-300" />
            </Button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                  LabGuard Pro
                </h1>
                <p className="text-xs text-slate-400">Laboratory Intelligence</p>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search equipment, calibrations, reports, AI insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative p-2 hover:bg-slate-800/50">
                  <Bell className="h-5 w-5 text-slate-300" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 border-0">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50">
                <DropdownMenuLabel className="text-slate-200">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700/50" />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-3 hover:bg-slate-700/50">
                    <div className="flex items-start space-x-3 w-full">
                      <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-400' : 'bg-slate-600'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">{notification.title}</p>
                        <p className="text-xs text-slate-400">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-slate-700/50" />
                <DropdownMenuItem className="text-center text-blue-400 hover:text-blue-300">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2 hover:bg-slate-800/50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user?.firstName} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold">
                      {user ? getInitials(user.firstName, user.lastName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-slate-200">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50">
                <DropdownMenuLabel className="text-slate-200">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(user?.role || '')}
                    <span>Account</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700/50" />
                
                <DropdownMenuItem className="hover:bg-slate-700/50">
                  <User className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="text-slate-200">Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="hover:bg-slate-700/50">
                  <Settings className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="text-slate-200">Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="hover:bg-slate-700/50">
                  <HelpCircle className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="text-slate-200">Help & Support</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-slate-700/50" />
                
                <DropdownMenuItem 
                  onClick={onLogout}
                  disabled={loggingOut}
                  className="hover:bg-red-500/20 text-red-400 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>{loggingOut ? 'Signing out...' : 'Sign out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
} 
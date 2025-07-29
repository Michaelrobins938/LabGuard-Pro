'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Bell, 
  Search, 
  Command, 
  Settings,
  User,
  ChevronDown,
  Zap,
  HelpCircle,
  FlaskConical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const [notifications] = useState(3)

  return (
    <header className="glass-nav h-20 w-full">
      <div className="flex h-full items-center justify-between px-8 ml-80">
        {/* Search Section */}
        <div className="flex items-center space-x-6 flex-1 max-w-2xl">
          {/* Global Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search equipment, calibrations, reports..."
              className="pl-12 pr-20 h-12 w-full bg-white/5 border-white/20 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="inline-flex h-6 select-none items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2 font-mono text-xs text-gray-400 backdrop-blur-sm">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
          </div>
          
          {/* Quick Actions */}
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 h-10 px-4 rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all duration-200"
            onClick={() => {
              // This will trigger the assistant to appear
              window.dispatchEvent(new CustomEvent('toggle-assistant'));
            }}
          >
            <FlaskConical className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Help Button */}
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-10 w-10 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          {/* Notifications */}
          <Button 
            size="icon" 
            variant="ghost" 
            className="relative h-10 w-10 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">{notifications}</span>
              </div>
            )}
          </Button>
          
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-3 h-12 px-3 rounded-2xl hover:bg-white/10 transition-all duration-200 group"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">SC</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">Dr. Sarah Chen</p>
                  <p className="text-xs text-gray-400">Lab Director</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2"
            >
              <div className="px-3 py-2 border-b border-white/10 mb-2">
                <p className="text-sm font-medium text-white">Dr. Sarah Chen</p>
                <p className="text-xs text-gray-400">sarah.chen@labguard.com</p>
              </div>
              <DropdownMenuItem className="rounded-xl hover:bg-white/10 text-gray-300 hover:text-white">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl hover:bg-white/10 text-gray-300 hover:text-white">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
} 
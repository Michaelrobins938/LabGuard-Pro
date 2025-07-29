'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Bell, 
  HelpCircle,
  Shield,
  CreditCard,
  FileText,
  Mail,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  organization: string
}

interface ProfileDropdownProps {
  user: User
  onLogout: () => void
  onSettings: () => void
  onProfile: () => void
  className?: string
  showNotifications?: boolean
  notificationCount?: number
  theme?: 'light' | 'dark' | 'system'
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void
}

export function ProfileDropdown({
  user,
  onLogout,
  onSettings,
  onProfile,
  className = '',
  showNotifications = true,
  notificationCount = 0,
  theme = 'system',
  onThemeChange
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsThemeMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setIsOpen(false)
    onLogout()
  }

  const handleSettings = () => {
    setIsOpen(false)
    onSettings()
  }

  const handleProfile = () => {
    setIsOpen(false)
    onProfile()
  }

  const menuItems = [
    {
      label: 'Profile',
      icon: User,
      onClick: handleProfile,
      description: 'View your profile'
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: handleSettings,
      description: 'Manage your preferences'
    },
    {
      label: 'Billing',
      icon: CreditCard,
      onClick: () => {},
      description: 'Manage your subscription'
    },
    {
      label: 'Documentation',
      icon: FileText,
      onClick: () => {},
      description: 'View help and guides'
    },
    {
      label: 'Support',
      icon: HelpCircle,
      onClick: () => {},
      description: 'Get help and contact us'
    }
  ]

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ]

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {/* Notifications Badge */}
        {showNotifications && notificationCount > 0 && (
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          </div>
        )}

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.role}
            </p>
          </div>
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {user.role} at {user.organization}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </motion.button>
              ))}

              {/* Theme Selector */}
              {onThemeChange && (
                <div className="relative">
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: menuItems.length * 0.05 }}
                    onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <Monitor className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Theme
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {themeOptions.find(t => t.value === theme)?.label} mode
                      </p>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        isThemeMenuOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </motion.button>

                  <AnimatePresence>
                    {isThemeMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                      >
                        {themeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              onThemeChange(option.value as 'light' | 'dark' | 'system')
                              setIsThemeMenuOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                              theme === option.value ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <option.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {option.label}
                            </span>
                            {theme === option.value && (
                              <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Divider */}
              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

              {/* Logout Button */}
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (menuItems.length + 1) * 0.05 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-red-600 dark:text-red-400"
              >
                <LogOut className="w-5 h-5" />
                <div>
                  <p className="font-medium">Sign out</p>
                  <p className="text-xs text-red-500 dark:text-red-400">
                    Log out of your account
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact Profile Dropdown
interface CompactProfileDropdownProps {
  user: User
  onLogout: () => void
  onSettings: () => void
  onProfile: () => void
  className?: string
}

export function CompactProfileDropdown({
  user,
  onLogout,
  onSettings,
  onProfile,
  className = ''
}: CompactProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false)
                  onProfile()
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-900 dark:text-white">Profile</span>
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false)
                  onSettings()
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-900 dark:text-white">Settings</span>
              </button>

              <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

              <button
                onClick={() => {
                  setIsOpen(false)
                  onLogout()
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-red-600 dark:text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 
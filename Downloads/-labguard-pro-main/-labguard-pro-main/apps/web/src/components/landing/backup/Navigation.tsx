'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Shield, ChevronDown, Zap } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-enterprise border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section with enhanced branding */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-primary-green rounded-xl flex items-center justify-center shadow-enterprise">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">LabGuard Pro</span>
              <span className="text-xs text-gray-500 font-medium">Enterprise Compliance</span>
            </div>
          </div>
          
          {/* Navigation Links with enhanced styling */}
          <nav className="hidden lg:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary-blue transition-all duration-enterprise font-medium relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-blue transition-all duration-enterprise group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-primary-blue transition-all duration-enterprise font-medium relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-blue transition-all duration-enterprise group-hover:w-full"></span>
            </a>
            <a href="#about" className="text-gray-700 hover:text-primary-blue transition-all duration-enterprise font-medium relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-blue transition-all duration-enterprise group-hover:w-full"></span>
            </a>
            <a href="#contact" className="text-gray-700 hover:text-primary-blue transition-all duration-enterprise font-medium relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-blue transition-all duration-enterprise group-hover:w-full"></span>
            </a>
          </nav>
          
          {/* CTA Buttons with enterprise styling */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/auth/login" 
              className="text-gray-700 hover:text-primary-blue transition-all duration-enterprise font-medium px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="bg-primary-green text-white px-6 py-3 rounded-xl hover:bg-primary-green-dark transition-all duration-enterprise font-semibold shadow-enterprise hover:shadow-enterprise-lg flex items-center space-x-2 hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              <span>Get Started</span>
            </Link>
          </div>

          {/* Mobile menu button with enhanced styling */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-lg hover:bg-gray-100 transition-all duration-enterprise"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-6 border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-primary-blue transition-all duration-enterprise font-medium py-2 px-4 rounded-lg hover:bg-gray-50">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-blue transition-all duration-enterprise font-medium py-2 px-4 rounded-lg hover:bg-gray-50">
                Pricing
              </a>
              <a href="#about" className="text-gray-700 hover:text-primary-blue transition-all duration-enterprise font-medium py-2 px-4 rounded-lg hover:bg-gray-50">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-primary-blue transition-all duration-enterprise font-medium py-2 px-4 rounded-lg hover:bg-gray-50">
                Contact
              </a>
              <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200/50">
                <Link href="/auth/login">
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary-blue hover:bg-gray-50">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full bg-primary-green hover:bg-primary-green-dark text-white font-semibold shadow-enterprise">
                    <Zap className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">LabGuard Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Solutions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <span>Solutions</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {isSolutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 glass-card rounded-xl border border-white/10 p-4"
                  >
                    <div className="space-y-3">
                      <Link 
                        href="/solutions/enterprise" 
                        className="block text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsSolutionsOpen(false)}
                      >
                        Enterprise Compliance
                      </Link>
                      <Link 
                        href="/solutions/research" 
                        className="block text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsSolutionsOpen(false)}
                      >
                        Research Labs
                      </Link>
                      <Link 
                        href="/solutions/clinical" 
                        className="block text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsSolutionsOpen(false)}
                      >
                        Clinical Laboratories
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <span>Resources</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {isResourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 glass-card rounded-xl border border-white/10 p-4"
                  >
                    <div className="space-y-3">
                      <Link 
                        href="/resources/documentation" 
                        className="block text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsResourcesOpen(false)}
                      >
                        Documentation
                      </Link>
                      <Link 
                        href="/resources/api" 
                        className="block text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsResourcesOpen(false)}
                      >
                        API Reference
                      </Link>
                      <Link 
                        href="/resources/support" 
                        className="block text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsResourcesOpen(false)}
                      >
                        Support Center
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
              Blog
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                Log in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
                Start Trial
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass-card rounded-xl border border-white/10 mt-4 p-6"
            >
              <div className="space-y-4">
                <Link href="/solutions" className="block text-gray-300 hover:text-white transition-colors">
                  Solutions
                </Link>
                <Link href="/resources" className="block text-gray-300 hover:text-white transition-colors">
                  Resources
                </Link>
                <Link href="/pricing" className="block text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link href="/blog" className="block text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
                <div className="pt-4 border-t border-white/10">
                  <Link href="/auth/login" className="block text-gray-300 hover:text-white transition-colors mb-2">
                    Log in
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
                      Start Trial
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
} 
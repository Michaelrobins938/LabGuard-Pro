'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Sparkles, 
  Menu, 
  X, 
  ArrowRight,
  TrendingUp,
  Globe,
  Award,
  Users,
  Brain,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function HeroUINavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    {
      name: 'Product',
      items: [
        { name: 'AI Assistant', description: 'Intelligent laboratory companion', icon: Brain, href: '/biomni-demo' },
        { name: 'Analytics', description: 'Advanced data insights', icon: BarChart3, href: '/demo' },
        { name: 'Compliance', description: 'Automated regulatory monitoring', icon: Shield, href: '/demo' },
        { name: 'Equipment', description: 'Smart device management', icon: Zap, href: '/demo' }
      ]
    },
    {
      name: 'Solutions',
      items: [
        { name: 'Research Labs', description: 'Academic research institutions', icon: TrendingUp, href: '/solutions/research' },
        { name: 'Clinical Labs', description: 'Medical diagnostic facilities', icon: Award, href: '/solutions/clinical' },
        { name: 'Pharmaceutical', description: 'Drug development companies', icon: Globe, href: '/solutions/pharmaceutical' },
        { name: 'Biotechnology', description: 'Biotech research firms', icon: Users, href: '/solutions/biotechnology' }
      ]
    },
    {
      name: 'Resources',
      items: [
        { name: 'Documentation', description: 'Comprehensive guides', icon: Award, href: '/resources/documentation' },
        { name: 'Case Studies', description: 'Success stories', icon: TrendingUp, href: '/resources/case-studies' },
        { name: 'Blog', description: 'Latest insights', icon: Globe, href: '/blog' },
        { name: 'Support', description: 'Help center', icon: Users, href: '/support' }
      ]
    },
    {
      name: 'Company',
      items: [
        { name: 'About', description: 'Our mission and values', icon: Award, href: '/about' },
        { name: 'Careers', description: 'Join our team', icon: Users, href: '/careers' },
        { name: 'Contact', description: 'Get in touch', icon: Globe, href: '/contact' },
        { name: 'Partners', description: 'Strategic alliances', icon: TrendingUp, href: '/partners' }
      ]
    }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LabGuard Pro</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <button className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors py-2">
                  {item.name}
                  <ArrowRight className="w-3 h-3 rotate-90 transition-transform group-hover:rotate-0" />
                </button>
                
                {/* Dropdown */}
                <div className="absolute top-full left-0 w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="p-4 space-y-2">
                    {item.items.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                          <subItem.icon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{subItem.name}</div>
                          <div className="text-xs text-gray-400">{subItem.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/auth/register" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300">
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10"
            >
              <div className="py-4 space-y-4">
                {navigationItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-white font-semibold px-4">{item.name}</div>
                    <div className="space-y-1">
                      {item.items.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className="w-full flex items-center gap-3 p-3 px-4 hover:bg-white/10 transition-colors text-left"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                            <subItem.icon className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{subItem.name}</div>
                            <div className="text-xs text-gray-400">{subItem.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-white/10 px-4 space-y-3">
                  <Link href="/auth/login" className="w-full text-gray-300 hover:text-white transition-colors text-left py-2 block">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 block text-center">
                    Start Free Trial
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
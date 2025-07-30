'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, Menu, X, ArrowRight, Play, Sparkles, CheckCircle, 
  Shield, Zap, Users, Globe as GlobeIcon, Building, Target,
  Rocket, Award, Star, Mail, Phone, MapPin, Github, Twitter, Linkedin,
  ChevronDown, Eye, EyeOff, Lock, User, Search, Bell, Settings,
  FlaskConical, Microscope, ClipboardCheck, BarChart3, AlertTriangle,
  Cpu, Database, Calendar, FileText, TrendingUp, Wrench
} from 'lucide-react'

// Magic UI Components
import { Particles } from '@/components/magicui/particles'
import { Globe } from '@/components/magicui/globe'
import { Marquee } from '@/components/magicui/marquee'
import { ShineBorder } from '@/components/magicui/shine-border'
import { NeonGradientCard } from '@/components/magicui/neon-gradient-card'
import { MagicCard } from '@/components/magicui/magic-card'
import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar'
import { CoolMode } from '@/components/magicui/cool-mode'
import { Confetti } from '@/components/magicui/confetti'
import { Pointer } from '@/components/magicui/pointer'
import { Lens } from '@/components/magicui/lens'

// shadcn/ui Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

const LabGuardProLanding: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isYearly, setIsYearly] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeDemo, setActiveDemo] = useState(0)

  // Laboratory-focused statistics
  const stats = [
    {
      icon: Building,
      value: "500+",
      label: "Laboratories Worldwide",
      color: "text-blue-400"
    },
    {
      icon: Shield,
      value: "99.9%",
      label: "Compliance Accuracy",
      color: "text-green-400"
    },
    {
      icon: FlaskConical,
      value: "1M+",
      label: "Equipment Managed",
      color: "text-purple-400"
    },
    {
      icon: Award,
      value: "ISO",
      label: "Certified Platform",
      color: "text-yellow-400"
    }
  ]

  // Laboratory-focused marquee items
  const marqueeItems = [
    { icon: "🧬", text: "Biomni AI Integration" },
    { icon: "🔒", text: "FDA Compliant" },
    { icon: "📊", text: "Predictive Analytics" },
    { icon: "🌐", text: "Global Lab Network" },
    { icon: "⚡", text: "Real-time Monitoring" },
    { icon: "🎯", text: "Precision Compliance" },
    { icon: "🛡️", text: "CLIA Ready" },
    { icon: "📈", text: "Performance Optimization" },
    { icon: "🔬", text: "Equipment Intelligence" },
    { icon: "📋", text: "Audit Automation" }
  ]

  const handleStartTrial = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={100}
          staticity={30}
          color="#3b82f6"
        />
      </div>

      {/* Gradient Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <ShineBorder className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </ShineBorder>
            <span className="text-xl font-bold text-white">LabGuard Pro</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Solutions
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Industries
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Pricing
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Resources
            </Button>

            {/* Login Button */}
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              Laboratory Login
            </Button>

            {/* Start Trial Button */}
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              onClick={handleStartTrial}
            >
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            className="lg:hidden text-white"
            variant="ghost"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden mt-4 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl p-4"
            >
              <div className="space-y-3">
                <Button variant="ghost" className="w-full text-left text-white hover:bg-white/10">
                  Solutions
                </Button>
                <Button variant="ghost" className="w-full text-left text-white hover:bg-white/10">
                  Industries
                </Button>
                <Button variant="ghost" className="w-full text-left text-white hover:bg-white/10">
                  Pricing
                </Button>
                <Button variant="ghost" className="w-full text-left text-white hover:bg-white/10">
                  Resources
                </Button>
                <div className="border-t border-white/10 pt-3 space-y-2">
                  <Button variant="outline" className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                    Laboratory Login
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    onClick={handleStartTrial}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Laboratory Intelligence Platform</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold text-white mb-6 text-center"
          >
            The Future of{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Laboratory Management
            </span>{' '}
            is Here
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 text-center"
          >
            Powered by Stanford's cutting-edge Biomni AI, LabGuard Pro transforms laboratory operations 
            with intelligent compliance automation, predictive equipment management, and autonomous research execution.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button 
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={handleStartTrial}
            >
              <Bot className="w-5 h-5 mr-2" />
              Try AI Assistant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Globe Component */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex justify-center mb-16"
          >
            <div className="w-full max-w-4xl">
              <Globe />
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="mt-4">
                  <AnimatedCircularProgressBar 
                    value={index === 0 ? 95 : index === 1 ? 99.9 : index === 2 ? 60 : 40}
                    max={100}
                    min={0}
                    gaugePrimaryColor="#3b82f6"
                    gaugeSecondaryColor="#1e293b"
                    className="mx-auto"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-12 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <Marquee className="[--duration:20s]">
            {marqueeItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mx-8 text-white">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Interactive Effects */}
      {showConfetti && <Confetti />}

      {/* Cool Mode Toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        <CoolMode>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </CoolMode>
      </div>

      {/* Pointer Effect */}
      <Pointer />
    </div>
  )
}

export default LabGuardProLanding 
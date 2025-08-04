'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Brain, 
  Dna, 
  Microscope, 
  Target, 
  CheckCircle, 
  Zap, 
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Users,
  TrendingUp,
  Shield,
  Globe,
  Code,
  Database,
  Cpu,
  Beaker,
  TestTube,
  Crown,
  Lock,
  BarChart3,
  Clock,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  Instagram,
  FlaskConical,
  Award,
  FileText,
  Calendar
} from 'lucide-react'

export function ModernLandingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Stanford Biomni AI",
      description: "Powered by Stanford's cutting-edge research with 150+ biomedical tools and 59 scientific databases.",
      link: "/biomni"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Compliance Automation",
      description: "Automated regulatory compliance with real-time monitoring and audit trail generation.",
      link: "/compliance"
    },
    {
      icon: <Microscope className="w-6 h-6" />,
      title: "Equipment Management",
      description: "Comprehensive laboratory equipment tracking with maintenance scheduling and calibration alerts.",
      link: "/equipment"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "AI-powered insights and predictive analytics for laboratory optimization and decision-making.",
      link: "/analytics"
    }
  ]

  const stats = [
    { label: 'Laboratories', value: '10,000+', icon: Microscope },
    { label: 'Compliance Rate', value: '99.9%', icon: Shield },
    { label: 'Time Saved', value: '60%', icon: Clock },
    { label: 'Cost Reduction', value: '40%', icon: TrendingUp }
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: isYearly ? 29 : 39,
      description: "Perfect for small laboratories",
      features: [
        "Up to 10 equipment items",
        "Basic compliance monitoring",
        "Email support",
        "Standard reports"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: isYearly ? 79 : 99,
      description: "Ideal for growing laboratories",
      features: [
        "Up to 50 equipment items",
        "Advanced compliance monitoring",
        "AI-powered insights",
        "Priority support",
        "Custom reports"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: isYearly ? 199 : 249,
      description: "For large organizations",
      features: [
        "Unlimited equipment",
        "Full compliance automation",
        "Advanced AI features",
        "24/7 support",
        "Custom integrations",
        "Dedicated account manager"
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => window.location.href = '/'}
            >
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span 
              className="text-xl font-bold text-white cursor-pointer hover:text-blue-300 transition-colors"
              onClick={() => window.location.href = '/'}
            >
              LabGuard Pro
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Product Dropdown */}
            <div className="relative group">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 flex items-center space-x-1"
                onMouseEnter={() => setActiveDropdown('product')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span>Product</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              <div 
                className={`absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl transition-all duration-200 ${
                  activeDropdown === 'product' ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setActiveDropdown('product')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="p-4 space-y-2">
                  <a href="/ai-demo" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Bot className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">AI Assistant</div>
                      <div className="text-sm text-gray-400">Stanford Biomni Integration</div>
                    </div>
                  </a>
                  <a href="/dashboard/analytics" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-white font-medium">Analytics</div>
                      <div className="text-sm text-gray-400">Advanced Insights</div>
                    </div>
                  </a>
                  <a href="/dashboard/compliance" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">Compliance</div>
                      <div className="text-sm text-gray-400">Regulatory Monitoring</div>
                    </div>
                  </a>
                  <a href="/dashboard/equipment" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Microscope className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="text-white font-medium">Equipment Management</div>
                      <div className="text-sm text-gray-400">Asset Tracking</div>
                    </div>
                  </a>
                  <a href="/dashboard/ai" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Code className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-white font-medium">Protocol Design</div>
                      <div className="text-sm text-gray-400">AI-Generated Protocols</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Solutions Dropdown */}
            <div className="relative group">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 flex items-center space-x-1"
                onMouseEnter={() => setActiveDropdown('solutions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span>Solutions</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              <div 
                className={`absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl transition-all duration-200 ${
                  activeDropdown === 'solutions' ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setActiveDropdown('solutions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="p-4 space-y-2">
                  <a href="/solutions/research" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Beaker className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">Research Labs</div>
                      <div className="text-sm text-gray-400">Academic & Research</div>
                    </div>
                  </a>
                  <a href="/solutions/clinical" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <TestTube className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-white font-medium">Clinical Labs</div>
                      <div className="text-sm text-gray-400">Medical Diagnostics</div>
                    </div>
                  </a>
                  <a href="/solutions/pharmaceutical" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <FlaskConical className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">Pharmaceutical</div>
                      <div className="text-sm text-gray-400">Drug Development</div>
                    </div>
                  </a>
                  <a href="/solutions/biotechnology" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Dna className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="text-white font-medium">Biotechnology</div>
                      <div className="text-sm text-gray-400">Biotech Research</div>
                    </div>
                  </a>
                  <a href="/solutions/enterprise" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="text-white font-medium">Academic Institutions</div>
                      <div className="text-sm text-gray-400">Universities & Colleges</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 flex items-center space-x-1"
                onMouseEnter={() => setActiveDropdown('resources')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span>Resources</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              <div 
                className={`absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl transition-all duration-200 ${
                  activeDropdown === 'resources' ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setActiveDropdown('resources')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="p-4 space-y-2">
                  <a href="/resources/documentation" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">Documentation</div>
                      <div className="text-sm text-gray-400">User Guides & API Docs</div>
                    </div>
                  </a>
                  <a href="/resources/case-studies" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-white font-medium">Case Studies</div>
                      <div className="text-sm text-gray-400">Success Stories</div>
                    </div>
                  </a>
                  <a href="/blog" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">Blog</div>
                      <div className="text-sm text-gray-400">Latest Updates</div>
                    </div>
                  </a>
                  <a href="/support" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Users className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="text-white font-medium">Support Center</div>
                      <div className="text-sm text-gray-400">Help & Resources</div>
                    </div>
                  </a>
                  <a href="/resources/api" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Code className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-white font-medium">API Reference</div>
                      <div className="text-sm text-gray-400">Developer Resources</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Company Dropdown */}
            <div className="relative group">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 flex items-center space-x-1"
                onMouseEnter={() => setActiveDropdown('company')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span>Company</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              <div 
                className={`absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl transition-all duration-200 ${
                  activeDropdown === 'company' ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setActiveDropdown('company')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="p-4 space-y-2">
                  <a href="/about" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Users className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">About Us</div>
                      <div className="text-sm text-gray-400">Our Mission & Team</div>
                    </div>
                  </a>
                  <a href="/careers" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Star className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-white font-medium">Careers</div>
                      <div className="text-sm text-gray-400">Join Our Team</div>
                    </div>
                  </a>
                  <a href="/contact" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">Contact</div>
                      <div className="text-sm text-gray-400">Get in Touch</div>
                    </div>
                  </a>
                  <a href="/partners" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Users className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="text-white font-medium">Partners</div>
                      <div className="text-sm text-gray-400">Strategic Alliances</div>
                    </div>
                  </a>
                  <a href="/press" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-white font-medium">Press</div>
                      <div className="text-sm text-gray-400">Media & News</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => window.location.href = '/auth/login'}
            >
              Sign In
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => window.location.href = '/dashboard'}
            >
              Dashboard
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              onClick={() => window.location.href = '/auth/register'}
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Laboratory Intelligence Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl lg:text-6xl font-bold text-white mb-6"
            >
              The Future of{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Laboratory Management
              </span>{' '}
              is Here
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Powered by Stanford's cutting-edge Biomni AI, LabGuard Pro revolutionizes laboratory operations 
              with intelligent compliance monitoring, automated equipment management, and AI-driven insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={() => window.location.href = '/ai-demo'}
              >
                <Bot className="w-5 h-5 mr-2" />
                Try AI Assistant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300 backdrop-blur-sm"
                onClick={() => window.location.href = '/demo'}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Key Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Built for{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Laboratory Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive solutions designed specifically for modern laboratory operations and research.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
                
                <Button 
                  variant="ghost"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={() => window.location.href = feature.link}
                >
                  <span className="text-sm font-medium">Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Access Section */}
      <section className="py-20 bg-gradient-to-b from-blue-900 to-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 rounded-full backdrop-blur-sm mb-6">
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Try LabGuard Pro</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Experience{' '}
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Our Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Try our advanced laboratory management features with demo access. No registration required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mobile QR Generator Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Mobile QR Generator</h3>
              <p className="text-gray-300 mb-4">Generate QR codes and print labels for sample tracking</p>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                onClick={() => window.location.href = '/mobile/print-labels'}
              >
                Try Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Barcode Scanner Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Barcode Scanner</h3>
              <p className="text-gray-300 mb-4">Scan barcodes and QR codes with your mobile device</p>
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                onClick={() => window.location.href = '/mobile/quick-scan'}
              >
                Try Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Sample Intake Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Sample Intake</h3>
              <p className="text-gray-300 mb-4">Complete sample registration and chain of custody tracking</p>
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                onClick={() => window.location.href = '/mobile/sample-intake'}
              >
                Try Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Lab Dashboard Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lab Dashboard</h3>
              <p className="text-gray-300 mb-4">Real-time equipment monitoring and analytics</p>
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                onClick={() => window.location.href = '/dashboard'}
              >
                Try Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* AI Assistant Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Assistant</h3>
              <p className="text-gray-300 mb-4">Intelligent lab assistance and automation</p>
              <Button 
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
                onClick={() => window.location.href = '/dashboard/ai-assistant-demo'}
              >
                Try Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Analytics Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Analytics</h3>
              <p className="text-gray-300 mb-4">Advanced data visualization and insights</p>
              <Button 
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                onClick={() => window.location.href = '/dashboard/analytics'}
              >
                Try Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-blue-900 to-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Pricing Plans</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Plan
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Flexible pricing designed to scale with your laboratory needs.
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsYearly(!isYearly)}
                className="relative bg-white/10 hover:bg-white/20"
              >
                <div className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-transform ${isYearly ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </Button>
              <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-400'}`}>Yearly <span className="text-green-400">(Save 20%)</span></span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-purple-500/50 bg-gradient-to-b from-purple-500/10 to-transparent' 
                    : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-white mb-2">
                    ${plan.price}
                    <span className="text-lg text-gray-400">/month</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  } text-white`}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">LabGuard Pro</span>
              </div>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
                The future of laboratory intelligence, powered by Stanford's cutting-edge research and AI technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Product</h3>
              <div className="space-y-3">
                <a href="/solutions" className="block text-gray-300 hover:text-white transition-colors">Solutions</a>
                <a href="/pricing" className="block text-gray-300 hover:text-white transition-colors">Pricing</a>
                <a href="/resources/api" className="block text-gray-300 hover:text-white transition-colors">API</a>
                <a href="/ai-demo" className="block text-gray-300 hover:text-white transition-colors">AI Demo</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Company</h3>
              <div className="space-y-3">
                <a href="/about" className="block text-gray-300 hover:text-white transition-colors">About</a>
                <a href="/blog" className="block text-gray-300 hover:text-white transition-colors">Blog</a>
                <a href="/careers" className="block text-gray-300 hover:text-white transition-colors">Careers</a>
                <a href="/contact" className="block text-gray-300 hover:text-white transition-colors">Contact</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Support</h3>
              <div className="space-y-3">
                <a href="/resources/documentation" className="block text-gray-300 hover:text-white transition-colors">Documentation</a>
                <a href="/support" className="block text-gray-300 hover:text-white transition-colors">Help Center</a>
                <a href="/resources/case-studies" className="block text-gray-300 hover:text-white transition-colors">Case Studies</a>
                <a href="/partners" className="block text-gray-300 hover:text-white transition-colors">Partners</a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 LabGuard Pro. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
                <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
                <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 
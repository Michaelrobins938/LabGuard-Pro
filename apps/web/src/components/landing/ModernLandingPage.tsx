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
  TestTube
} from 'lucide-react'
import { EnhancedBiomniAssistant } from '@/components/ai-assistant/EnhancedBiomniAssistant'

export function ModernLandingPage() {
  const [showAIAssistant, setShowAIAssistant] = useState(true)

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Stanford Biomni AI",
      description: "Powered by Stanford's cutting-edge research with 150+ tools and 59 databases",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "AI-Powered Calibration",
      description: "Automated equipment calibration with real-time validation and compliance checking",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "HIPAA, SOC2, and GDPR compliant with advanced encryption and audit trails",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Comprehensive dashboards with predictive analytics and performance insights",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Smart Automation",
      description: "Intelligent workflow automation with AI-driven decision making",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-tenant Architecture",
      description: "Scalable platform supporting multiple laboratories and organizations",
      color: "from-cyan-500 to-blue-600"
    }
  ]

  const stats = [
    { label: "Equipment Monitored", value: "10,000+", icon: <Microscope className="w-5 h-5" /> },
    { label: "AI Assistance Sessions", value: "50,000+", icon: <Bot className="w-5 h-5" /> },
    { label: "Research Projects", value: "1,000+", icon: <Dna className="w-5 h-5" /> },
    { label: "Compliance Rate", value: "99.8%", icon: <CheckCircle className="w-5 h-5" /> }
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Lab Director, Stanford Medical Center",
      content: "LabGuard Pro with Biomni AI has revolutionized our laboratory operations. The AI assistant has accelerated our research by 100x.",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Research Scientist, MIT",
      content: "The integration with Stanford's Biomni system is game-changing. We can now design experiments and analyze data with unprecedented speed.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Quality Manager, Mayo Clinic",
      content: "The compliance automation features have saved us countless hours. Our audit scores have improved dramatically.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LabGuard Pro</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Features
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Pricing
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              About
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              onClick={() => {
                const event = new CustomEvent('toggle-assistant')
                window.dispatchEvent(event)
              }}
            >
              <Bot className="w-4 h-4 mr-2" />
              Try AI Assistant
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mobile Optimized */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-6"
            >
              <div className="space-y-4">
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Your
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Laboratory
                  </span>
                  <br />
                  with AI
                </motion.h1>
                
                <motion.p 
                  className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Revolutionize your lab operations with Stanford's cutting-edge Biomni AI. 
                  Automate compliance, streamline workflows, and ensure 100% accuracy in every experiment.
                </motion.p>
              </div>

              {/* Mobile Optimized CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Button 
                  size="lg"
                  className="mobile-button-primary text-lg px-8 py-4 h-auto"
                  onClick={() => window.location.href = '/pricing'}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="mobile-button-secondary text-lg px-8 py-4 h-auto border-white/20 text-white hover:bg-white/10"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </motion.div>

              {/* Mobile Optimized Stats */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 bg-white/10 rounded-lg">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - AI Assistant Demo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white">🧬 Stanford Biomni AI</h3>
                      <p className="text-sm text-gray-400">Live Demo - Try it now!</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Live</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">
                          🧬 **Welcome to Stanford Biomni AI Demo!**
                        </p>
                        <p className="text-xs text-gray-300 mt-2">
                          I can accelerate your research by 100x with access to 150+ tools and 59 databases.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => window.location.href = '/dashboard/ai-assistant-demo'}
                      className="w-full mobile-button-primary text-base px-6 py-3"
                    >
                      🚀 Try Interactive Demo
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400">Protocol Design</div>
                        <div className="text-xs text-blue-400">PCR Analysis</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400">Genomic Analysis</div>
                        <div className="text-xs text-purple-400">Cancer Biomarkers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Powered by Stanford Research
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced AI capabilities built on decades of Stanford research and real-world laboratory data
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="mobile-card h-full hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section - Mobile Optimized */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by Leading Laboratories
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            See what researchers and laboratory professionals are saying about LabGuard Pro
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="mobile-card h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-white text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer - Mobile Optimized */}
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
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                The future of laboratory intelligence, powered by Stanford Biomni AI.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Product</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2024 LabGuard Pro. Powered by Stanford Biomni AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Assistant - Desktop Only */}
      {showAIAssistant && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-50">
          <EnhancedBiomniAssistant />
        </div>
      )}

      {/* Mobile AI Assistant Button */}
      {showAIAssistant && (
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <button
            onClick={() => window.open('/dashboard/ai-assistant-demo', '_blank')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            aria-label="Open AI Assistant Demo"
          >
            <Brain className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
} 
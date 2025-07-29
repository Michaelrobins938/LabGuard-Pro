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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by Stanford Biomni AI
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Laboratory Intelligence
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your laboratory with AI-powered compliance automation, real-time monitoring, 
            and Stanford's cutting-edge Biomni research platform. Accelerate your research by 100x.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4">
              <Zap className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-300">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose LabGuard Pro?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The only laboratory platform powered by Stanford's Biomni AI, offering unprecedented 
            research acceleration and compliance automation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Assistant Showcase */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Meet Your AI Laboratory Partner
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Powered by Stanford's Biomni AI system with access to 150+ tools, 59 databases, 
            and 106 software packages for unprecedented research acceleration.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Beaker className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Protocol Design</h3>
                <p className="text-gray-300 text-sm">
                  AI-powered experimental protocol generation with optimization
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TestTube className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Data Analysis</h3>
                <p className="text-gray-300 text-sm">
                  Advanced bioinformatics analysis with genomic data processing
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Compliance</h3>
                <p className="text-gray-300 text-sm">
                  Automated compliance checking and audit trail generation
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4"
            onClick={() => {
              const event = new CustomEvent('toggle-assistant')
              window.dispatchEvent(event)
            }}
          >
            <Bot className="w-5 h-5 mr-2" />
            Try AI Assistant Now
          </Button>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by Leading Laboratories
          </h2>
          <p className="text-xl text-gray-300">
            See what researchers and laboratory professionals are saying about LabGuard Pro
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">LabGuard Pro</span>
              </div>
              <p className="text-gray-300 text-sm">
                The future of laboratory intelligence, powered by Stanford Biomni AI.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 LabGuard Pro. Powered by Stanford Biomni AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
              {showAIAssistant && <EnhancedBiomniAssistant />}
    </div>
  )
} 
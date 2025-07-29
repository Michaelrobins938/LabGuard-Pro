'use client'

import React from 'react'
import { 
  Brain, 
  Shield, 
  Zap, 
  Target, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  FlaskConical,
  Database,
  Lock
} from 'lucide-react'
import { motion } from 'framer-motion'

export function DemoFeatures() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Protocol Design',
      description: 'Watch how our AI generates optimized experimental protocols in seconds.',
      demo: 'Protocol generation demo',
      duration: '2:15'
    },
    {
      icon: Shield,
      title: 'Compliance Monitoring',
      description: 'See real-time compliance tracking and automated audit trail generation.',
      demo: 'Compliance dashboard demo',
      duration: '1:45'
    },
    {
      icon: Zap,
      title: 'Real-time Analytics',
      description: 'Experience live data visualization and predictive insights.',
      demo: 'Analytics demo',
      duration: '2:30'
    },
    {
      icon: Target,
      title: 'Equipment Management',
      description: 'Watch smart device monitoring and predictive maintenance in action.',
      demo: 'Equipment demo',
      duration: '1:55'
    }
  ]

  const capabilities = [
    { icon: FlaskConical, title: 'Protocol Optimization', description: 'AI-driven experimental design' },
    { icon: Database, title: 'Data Management', description: 'Secure, scalable data storage' },
    { icon: Lock, title: 'Security & Compliance', description: 'Enterprise-grade security' },
    { icon: Clock, title: '24/7 Monitoring', description: 'Round-the-clock lab oversight' }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/3 to-purple-600/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Interactive Demos</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Explore{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Key Features
            </span>{' '}
            in Detail
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Dive deep into each feature with our interactive demonstrations. 
            See how LabGuard Pro transforms every aspect of laboratory management.
          </p>
        </div>

        {/* Feature Demos Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  
                  {/* Demo Preview */}
                  <div className="bg-black/20 border border-white/10 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">{feature.demo}</span>
                      <span className="text-xs text-gray-500">{feature.duration}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1">
                      <div className="bg-blue-500 h-1 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                    <span className="text-sm font-medium">Watch Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Capabilities Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Core Capabilities</h3>
            <p className="text-gray-300">Discover the powerful capabilities that make LabGuard Pro the ultimate laboratory management solution</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <capability.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{capability.title}</h4>
                <p className="text-sm text-gray-400">{capability.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Demo Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">4</div>
            <div className="text-sm text-gray-400">Interactive Demos</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="text-3xl lg:text-4xl font-bold text-purple-400 mb-2">8:25</div>
            <div className="text-sm text-gray-400">Total Demo Time</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="text-3xl lg:text-4xl font-bold text-green-400 mb-2">100%</div>
            <div className="text-sm text-gray-400">Interactive</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <div className="text-3xl lg:text-4xl font-bold text-yellow-400 mb-2">0</div>
            <div className="text-sm text-gray-400">Registration Required</div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Experience LabGuard Pro?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start your interactive demo now and see how AI-powered laboratory management can transform your operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Full Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300 backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 mr-2" />
                Schedule Live Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
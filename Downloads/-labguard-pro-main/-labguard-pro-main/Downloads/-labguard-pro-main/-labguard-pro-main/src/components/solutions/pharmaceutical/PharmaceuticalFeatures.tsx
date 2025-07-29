'use client'

import React from 'react'
import { 
  Shield, 
  FileText, 
  BarChart3, 
  Clock, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  FlaskConical,
  Database,
  Lock
} from 'lucide-react'
import { motion } from 'framer-motion'

export function PharmaceuticalFeatures() {
  const features = [
    {
      icon: Shield,
      title: 'FDA Compliance Monitoring',
      description: 'Automated regulatory compliance tracking with real-time alerts and audit trail generation.',
      benefits: ['100% compliance rate', 'Real-time monitoring', 'Automated reporting']
    },
    {
      icon: FileText,
      title: 'Clinical Trial Management',
      description: 'Comprehensive clinical trial workflow management with automated data collection and analysis.',
      benefits: ['Streamlined workflows', 'Data integrity', 'Automated analysis']
    },
    {
      icon: BarChart3,
      title: 'Drug Development Analytics',
      description: 'Advanced analytics and reporting for drug development phases with predictive insights.',
      benefits: ['Predictive insights', 'Phase tracking', 'Performance metrics']
    },
    {
      icon: Clock,
      title: 'Accelerated Time to Market',
      description: 'Reduce drug development timelines with AI-powered optimization and automation.',
      benefits: ['40% faster development', 'Reduced bottlenecks', 'Optimized processes']
    }
  ]

  return (
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
              Pharmaceutical Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive solutions designed specifically for pharmaceutical research and drug development.
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
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <span className="text-sm font-medium">Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 
'use client'

import React from 'react'
import { 
  Dna, 
  Brain, 
  Zap, 
  BarChart3, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Microscope,
  Database,
  Lock
} from 'lucide-react'
import { motion } from 'framer-motion'

export function BiotechnologyFeatures() {
  const features = [
    {
      icon: Dna,
      title: 'Genetic Engineering Workflows',
      description: 'AI-powered design and optimization of genetic engineering protocols with automated validation.',
      benefits: ['Optimized protocols', 'Automated validation', 'Error prevention']
    },
    {
      icon: Brain,
      title: 'Experimental Design AI',
      description: 'Intelligent experimental design with predictive modeling and optimization algorithms.',
      benefits: ['Predictive modeling', 'Optimized parameters', 'Reduced trial and error']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive data analysis and visualization for complex biological datasets.',
      benefits: ['Real-time insights', 'Pattern recognition', 'Statistical analysis']
    },
    {
      icon: Zap,
      title: 'Automated Workflows',
      description: 'Streamlined laboratory processes with robotic integration and automated data collection.',
      benefits: ['Robotic integration', 'Automated collection', 'Process optimization']
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
              Biotech Innovation
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced tools designed specifically for biotechnology research and development.
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
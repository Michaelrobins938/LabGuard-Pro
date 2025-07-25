'use client'

import React from 'react'
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  DollarSign, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Users,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

export function PharmaceuticalBenefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increased Efficiency',
      description: 'Streamline drug development processes and reduce time to market by up to 40%.',
      metric: '40% Faster'
    },
    {
      icon: Shield,
      title: 'Regulatory Compliance',
      description: 'Maintain 100% FDA compliance with automated monitoring and audit trails.',
      metric: '100% Compliance'
    },
    {
      icon: DollarSign,
      title: 'Cost Reduction',
      description: 'Reduce operational costs by up to 60% through automation and optimization.',
      metric: '60% Savings'
    },
    {
      icon: Clock,
      title: 'Faster Approvals',
      description: 'Accelerate regulatory approval processes with comprehensive documentation.',
      metric: '50% Faster'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-blue-900 to-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Measurable Results</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Proven{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Benefits
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See real results from pharmaceutical companies using LabGuard Pro.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-300 mb-4">{benefit.description}</p>
              <div className="text-2xl font-bold text-blue-400">{benefit.metric}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 
'use client'

import React from 'react'
import { 
  Sparkles, 
  Brain, 
  Shield, 
  Zap, 
  Target, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  FlaskConical,
  TrendingUp,
  Users,
  Database,
  Lock,
  Globe,
  Award
} from 'lucide-react'
import { motion } from 'framer-motion'

export function HeroUIFeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Protocol Design',
      description: 'Generate optimized experimental protocols using Stanford\'s cutting-edge AI algorithms.',
      benefits: [
        'Automated protocol optimization',
        'Real-time validation',
        'Compliance checking',
        'Best practice recommendations'
      ]
    },
    {
      icon: Shield,
      title: 'Compliance Monitoring',
      description: 'Ensure 100% regulatory compliance with automated monitoring and reporting.',
      benefits: [
        'FDA/CLIA compliance',
        'Real-time alerts',
        'Audit trail generation',
        'Automated reporting'
      ]
    },
    {
      icon: Zap,
      title: 'Real-time Analytics',
      description: 'Monitor experiments in real-time with advanced analytics and predictive insights.',
      benefits: [
        'Live data visualization',
        'Predictive modeling',
        'Anomaly detection',
        'Performance optimization'
      ]
    },
    {
      icon: Target,
      title: 'Equipment Management',
      description: 'Optimize equipment usage and maintenance with intelligent scheduling.',
      benefits: [
        'Predictive maintenance',
        'Usage optimization',
        'Calibration tracking',
        'Resource allocation'
      ]
    },
    {
      icon: BarChart3,
      title: 'Data Analysis',
      description: 'Advanced bioinformatics tools for comprehensive data analysis and interpretation.',
      benefits: [
        'Statistical analysis',
        'Visualization tools',
        'Report generation',
        'Data export'
      ]
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock AI assistance and human support for your laboratory needs.',
      benefits: [
        'Instant AI responses',
        'Expert consultation',
        'Emergency support',
        'Training resources'
      ]
    }
  ]

  const stats = [
    { label: 'Accuracy Rate', value: '99.9%', color: 'text-green-400' },
    { label: 'Time Saved', value: '10x', color: 'text-blue-400' },
    { label: 'Cost Reduction', value: '60%', color: 'text-purple-400' },
    { label: 'Uptime', value: '99.9%', color: 'text-yellow-400' }
  ]

  const achievements = [
    { icon: Award, title: 'FDA Approved', description: 'Compliant with FDA regulations' },
    { icon: Globe, title: 'Global Reach', description: 'Used in 50+ countries' },
    { icon: Users, title: '500+ Labs', description: 'Trusted by leading institutions' },
    { icon: Database, title: '1M+ Experiments', description: 'Processed experiments' }
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
            <span className="text-sm font-medium">Revolutionary Features</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Everything
            </span>{' '}
            You Need to Succeed
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From AI-powered protocol design to real-time compliance monitoring, 
            LabGuard Pro provides all the tools you need to revolutionize your laboratory operations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Proven Results</h3>
            <p className="text-gray-300">Join hundreds of laboratories already transforming their operations</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{achievement.title}</h4>
                <p className="text-sm text-gray-400">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Laboratory?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the revolution in laboratory management. Start your free trial today and experience the future of AI-powered research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300 backdrop-blur-sm">
                <Users className="w-5 h-5 mr-2" />
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
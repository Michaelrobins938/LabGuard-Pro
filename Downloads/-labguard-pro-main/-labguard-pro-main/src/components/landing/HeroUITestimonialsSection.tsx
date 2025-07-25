'use client'

import React from 'react'
import { 
  Star, 
  Quote, 
  ArrowRight,
  Users,
  Award,
  TrendingUp,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

export function HeroUITestimonialsSection() {
  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Research Director',
      organization: 'Stanford Medical Center',
      avatar: '/api/placeholder/64/64',
      content: 'LabGuard Pro has revolutionized our research workflow. The AI-powered protocol design has reduced our experimental setup time by 80% while improving accuracy.',
      improvement: '80% faster setup time',
      rating: 5
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'Lab Manager',
      organization: 'MIT Research Labs',
      avatar: '/api/placeholder/64/64',
      content: 'The compliance monitoring features are incredible. We\'ve achieved 100% audit readiness and saved countless hours on regulatory reporting.',
      improvement: '100% audit readiness',
      rating: 5
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Principal Investigator',
      organization: 'Harvard Medical School',
      avatar: '/api/placeholder/64/64',
      content: 'The real-time analytics have given us insights we never had before. Our research quality has improved dramatically since implementing LabGuard Pro.',
      improvement: 'Dramatically improved research quality',
      rating: 5
    },
    {
      name: 'Dr. James Thompson',
      role: 'Department Head',
      organization: 'Johns Hopkins University',
      avatar: '/api/placeholder/64/64',
      content: 'The equipment management system has optimized our resource utilization. We\'ve reduced operational costs by 40% while increasing throughput.',
      improvement: '40% cost reduction',
      rating: 5
    },
    {
      name: 'Dr. Lisa Park',
      role: 'Senior Researcher',
      organization: 'UCLA Medical Center',
      avatar: '/api/placeholder/64/64',
      content: 'The AI assistant is like having a brilliant colleague available 24/7. It has accelerated our research timeline significantly.',
      improvement: 'Accelerated research timeline',
      rating: 5
    },
    {
      name: 'Dr. Robert Kim',
      role: 'Lab Director',
      organization: 'Yale University',
      avatar: '/api/placeholder/64/64',
      content: 'The data analysis tools are incredibly powerful. We\'ve discovered patterns in our research that would have taken months to identify manually.',
      improvement: 'Months of time saved',
      rating: 5
    }
  ]

  const stats = [
    { label: 'Customer Satisfaction', value: '98%', icon: Star },
    { label: 'Time Saved', value: '10x', icon: TrendingUp },
    { label: 'Accuracy Improvement', value: '99.9%', icon: CheckCircle },
    { label: 'Cost Reduction', value: '60%', icon: Award }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-blue-900 to-slate-900 relative overflow-hidden">
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
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">Customer Success Stories</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Leading Researchers
            </span>{' '}
            Worldwide
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how laboratories across the globe are transforming their operations 
            with LabGuard Pro and achieving remarkable results.
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
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center mb-4">
                <Quote className="w-6 h-6 text-blue-400" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-300 mb-4 leading-relaxed">"{testimonial.content}"</p>

              {/* Improvement */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300 font-medium">{testimonial.improvement}</span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                  <div className="text-xs text-gray-500">{testimonial.organization}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Join the Revolution
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              See why leading research institutions trust LabGuard Pro to transform their laboratory operations and accelerate their research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Star className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300 backdrop-blur-sm">
                <Users className="w-5 h-5 mr-2" />
                View Case Studies
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
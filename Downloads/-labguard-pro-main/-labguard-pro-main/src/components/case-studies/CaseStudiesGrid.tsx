'use client'

import React from 'react'
import { 
  TrendingUp, 
  Users, 
  Award, 
  Clock, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Globe,
  BarChart3,
  Building,
  FlaskConical,
  Microscope
} from 'lucide-react'
import { motion } from 'framer-motion'

export function CaseStudiesGrid() {
  const caseStudies = [
    {
      title: 'Stanford Research Institute',
      industry: 'Academic Research',
      challenge: 'Managing 50+ concurrent research projects with complex compliance requirements',
      solution: 'Implemented AI-powered protocol design and automated compliance monitoring',
      results: [
        '85% reduction in protocol design time',
        '100% compliance rate maintained',
        '60% cost savings on administrative overhead'
      ],
      icon: Building,
      featured: true
    },
    {
      title: 'GenTech Pharmaceuticals',
      industry: 'Pharmaceutical',
      challenge: 'Ensuring FDA compliance across multiple drug development phases',
      solution: 'Deployed comprehensive audit trail and real-time compliance monitoring',
      results: [
        'Zero compliance violations in 2 years',
        '40% faster FDA approval process',
        'Real-time audit trail generation'
      ],
      icon: FlaskConical,
      featured: false
    },
    {
      title: 'BioMed Clinical Labs',
      industry: 'Clinical Research',
      challenge: 'Scaling operations to handle 10x increase in sample volume',
      solution: 'AI-powered sample tracking and automated quality control',
      results: [
        '10x increase in processing capacity',
        '99.9% accuracy rate maintained',
        '50% reduction in processing time'
      ],
      icon: Microscope,
      featured: false
    },
    {
      title: 'MIT Biotechnology Lab',
      industry: 'Biotechnology',
      challenge: 'Complex experimental protocols requiring precise execution',
      solution: 'AI assistant for protocol optimization and error prevention',
      results: [
        '90% reduction in experimental errors',
        '3x faster protocol execution',
        'Enhanced reproducibility across experiments'
      ],
      icon: Building,
      featured: false
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Featured Stories</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Transforming{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Laboratories Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how leading institutions are achieving breakthrough results with LabGuard Pro.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 ${
                study.featured
                  ? 'border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-purple-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {study.featured && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium mb-4">
                  <Award className="w-3 h-3" />
                  Featured Case Study
                </div>
              )}

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <study.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{study.title}</h3>
                  <p className="text-blue-400 text-sm">{study.industry}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Challenge</h4>
                  <p className="text-gray-300 text-sm">{study.challenge}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Solution</h4>
                  <p className="text-gray-300 text-sm">{study.solution}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Results</h4>
                <div className="space-y-2">
                  {study.results.map((result, resultIndex) => (
                    <div key={resultIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <span className="text-sm font-medium">Read Full Case Study</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 
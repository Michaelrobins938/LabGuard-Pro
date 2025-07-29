'use client'

import React from 'react'
import { 
  BookOpen, 
  Settings, 
  Shield, 
  Zap, 
  Brain, 
  BarChart3, 
  Users, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  MessageCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

export function SupportCategories() {
  const categories = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Learn the basics and set up your lab',
      articles: 12,
      popular: true
    },
    {
      icon: Brain,
      title: 'AI Assistant',
      description: 'Master the AI-powered features',
      articles: 8,
      popular: false
    },
    {
      icon: Shield,
      title: 'Compliance & Security',
      description: 'Ensure regulatory compliance',
      articles: 15,
      popular: true
    },
    {
      icon: Zap,
      title: 'Analytics & Reports',
      description: 'Understand your data insights',
      articles: 10,
      popular: false
    },
    {
      icon: Settings,
      title: 'Configuration',
      description: 'Customize your setup',
      articles: 6,
      popular: false
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Manage users and permissions',
      articles: 9,
      popular: false
    }
  ]

  const popularArticles = [
    { title: 'How to set up your first experiment', views: '2.3k' },
    { title: 'Understanding compliance monitoring', views: '1.8k' },
    { title: 'AI protocol design best practices', views: '1.5k' },
    { title: 'Troubleshooting common issues', views: '1.2k' }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Help Categories</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Find{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              What You Need
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Browse our comprehensive help categories to find answers to your questions 
            and learn how to make the most of LabGuard Pro.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 ${
                category.popular
                  ? 'border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-purple-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {category.popular && (
                <div className="absolute -top-3 left-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Popular
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-gray-300 mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{category.articles} articles</span>
                    <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                      <span className="text-sm font-medium">Browse</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Popular Articles</h3>
              <p className="text-gray-300">Most viewed help articles this week</p>
            </div>
            <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
              <span className="text-sm font-medium">View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{article.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{article.views} views</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 
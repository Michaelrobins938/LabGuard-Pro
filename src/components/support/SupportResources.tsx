'use client'

import React from 'react'
import { 
  BookOpen, 
  Video, 
  Download, 
  Users, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  MessageCircle,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

export function SupportResources() {
  const resources = [
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Comprehensive guides and API references',
      items: 150,
      type: 'Articles'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      items: 45,
      type: 'Videos'
    },
    {
      icon: Download,
      title: 'Downloads',
      description: 'Templates, tools, and resources',
      items: 25,
      type: 'Files'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with other users',
      items: '2.5k+',
      type: 'Members'
    }
  ]

  const quickLinks = [
    { title: 'Getting Started Guide', time: '10 min read' },
    { title: 'API Documentation', time: 'Reference' },
    { title: 'Best Practices', time: '15 min read' },
    { title: 'Troubleshooting', time: '8 min read' }
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
            <span className="text-sm font-medium">Additional Resources</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            More{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Ways to Learn
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our comprehensive library of resources to help you master LabGuard Pro 
            and get the most out of your laboratory management platform.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <resource.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
              <p className="text-gray-300 mb-4">{resource.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{resource.items} {resource.type}</span>
                <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Quick Links */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Quick Links</h3>
            <div className="space-y-4">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{link.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{link.time}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Community & Updates */}
          <div className="space-y-8">
            {/* Community */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Join Our Community</h3>
                  <p className="text-gray-400">Connect with other LabGuard Pro users</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Share best practices</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Get help from peers</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Stay updated on features</span>
                </div>
              </div>
              
              <button className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300">
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Community
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* Updates */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Stay Updated</h3>
                  <p className="text-gray-400">Get the latest news and updates</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">New feature announcements</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Security updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Performance improvements</span>
                </div>
              </div>
              
              <button className="w-full inline-flex items-center justify-center px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 transition-all duration-300">
                <Globe className="w-4 h-4 mr-2" />
                Subscribe to Updates
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
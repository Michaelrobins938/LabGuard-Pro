'use client'

import React from 'react'
import { 
  BookOpen, 
  Clock, 
  Users, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Award,
  Globe,
  Brain,
  Shield,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'

export function BlogGrid() {
  const articles = [
    {
      title: 'New CAP/CLIA Requirements for 2024',
      category: 'Compliance',
      excerpt: 'Learn about the latest updates to laboratory compliance standards and how LabGuard Pro helps you stay compliant.',
      author: 'Dr. Sarah Chen',
      date: 'January 15, 2024',
      readTime: '5 min read',
      icon: Shield
    },
    {
      title: 'How AI is Revolutionizing Lab Management',
      category: 'AI & Automation',
      excerpt: 'Discover how artificial intelligence is transforming laboratory operations and improving efficiency.',
      author: 'Dr. Michael Rodriguez',
      date: 'January 10, 2024',
      readTime: '7 min read',
      icon: Brain
    },
    {
      title: 'Equipment Calibration Best Practices',
      category: 'Best Practices',
      excerpt: 'Essential tips for maintaining accurate equipment calibration and ensuring reliable results.',
      author: 'Dr. Emily Watson',
      date: 'January 5, 2024',
      readTime: '6 min read',
      icon: Zap
    },
    {
      title: 'The Future of Laboratory Automation',
      category: 'Technology',
      excerpt: 'Explore emerging trends in laboratory automation and what to expect in the coming years.',
      author: 'Dr. James Thompson',
      date: 'December 28, 2023',
      readTime: '8 min read',
      icon: Award
    },
    {
      title: 'Data Security in Modern Laboratories',
      category: 'Security',
      excerpt: 'Best practices for protecting sensitive laboratory data and ensuring compliance with security standards.',
      author: 'Dr. Lisa Park',
      date: 'December 20, 2023',
      readTime: '6 min read',
      icon: Shield
    },
    {
      title: 'Streamlining Clinical Trial Management',
      category: 'Clinical Research',
      excerpt: 'How modern software solutions are improving clinical trial efficiency and data quality.',
      author: 'Dr. Robert Kim',
      date: 'December 15, 2023',
      readTime: '7 min read',
      icon: Users
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Latest Articles</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Featured{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Articles
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover insights, best practices, and industry trends from our expert contributors.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <article.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-blue-400 font-medium">{article.category}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">{article.title}</h3>
              <p className="text-gray-300 mb-4">{article.excerpt}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>{article.author}</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{article.date}</span>
                <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
} 
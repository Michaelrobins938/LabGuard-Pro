'use client'

import React from 'react'
import { 
  ArrowRight,
  Sparkles,
  BookOpen,
  Users
} from 'lucide-react'
import { motion } from 'framer-motion'

export function BlogCTA() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-900 to-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-12 backdrop-blur-sm"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Stay{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Updated
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get the latest insights delivered to your inbox. Never miss an important update.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Subscribe to Newsletter
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300 backdrop-blur-sm">
                <Users className="w-5 h-5 mr-2" />
                Browse All Articles
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 
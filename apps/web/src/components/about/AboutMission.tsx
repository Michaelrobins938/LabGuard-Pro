'use client'

import React from 'react'
import { 
  Target, 
  Lightbulb, 
  Heart, 
  ArrowRight,
  Sparkles,
  Brain,
  Shield,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'

export function AboutMission() {
  const missionPoints = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To democratize access to advanced laboratory management tools and accelerate scientific discovery through AI-powered automation.'
    },
    {
      icon: Lightbulb,
      title: 'Our Vision',
      description: 'A world where every researcher has access to the tools they need to make breakthrough discoveries faster and more efficiently.'
    },
    {
      icon: Heart,
      title: 'Our Purpose',
      description: 'To serve the scientific community by reducing barriers to research and enabling more impactful discoveries that benefit humanity.'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Our Story</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Born from{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Scientific Need
              </span>
            </h2>

            <p className="text-xl text-gray-300 leading-relaxed">
              LabGuard Pro was founded by a team of researchers who experienced firsthand 
              the challenges of managing complex laboratory operations. We saw the potential 
              for AI to transform these processes and make research more efficient.
            </p>

            <p className="text-lg text-gray-400 leading-relaxed">
              Today, we're proud to serve hundreds of laboratories worldwide, helping them 
              achieve breakthroughs faster while maintaining the highest standards of accuracy 
              and compliance.
            </p>

            <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
              <span className="text-lg font-medium">Read Our Full Story</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {missionPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <point.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{point.title}</h3>
                    <p className="text-gray-300">{point.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
} 
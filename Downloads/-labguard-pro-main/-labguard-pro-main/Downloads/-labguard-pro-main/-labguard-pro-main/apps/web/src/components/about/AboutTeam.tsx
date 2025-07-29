'use client'

import React from 'react'
import { 
  Users, 
  Award, 
  ArrowRight,
  Sparkles,
  Brain,
  Shield,
  Zap,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

export function AboutTeam() {
  const teamMembers = [
    {
      name: 'Dr. Sarah Chen',
      role: 'CEO & Co-Founder',
      expertise: 'AI Research, Stanford PhD',
      avatar: '/api/placeholder/120/120'
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'CTO & Co-Founder',
      expertise: 'Machine Learning, MIT PhD',
      avatar: '/api/placeholder/120/120'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Head of Research',
      expertise: 'Biotechnology, Harvard PhD',
      avatar: '/api/placeholder/120/120'
    },
    {
      name: 'Dr. James Thompson',
      role: 'Head of Product',
      expertise: 'Laboratory Sciences, Yale PhD',
      avatar: '/api/placeholder/120/120'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-blue-900 to-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Our Team</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Meet the{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Brilliant Minds
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our team combines decades of experience in AI research, laboratory management, 
            and scientific innovation to bring you the most advanced laboratory platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
              <p className="text-blue-400 font-medium mb-2">{member.role}</p>
              <p className="text-sm text-gray-400">{member.expertise}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 
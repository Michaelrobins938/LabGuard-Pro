'use client'

import React from 'react'
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Users,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

export function ContactHero() {
  const contactMethods = [
    { icon: MessageCircle, title: 'Live Chat', description: 'Get instant help', response: '< 5 min' },
    { icon: Phone, title: 'Phone Support', description: 'Talk to an expert', response: '< 2 hours' },
    { icon: Mail, title: 'Email Support', description: 'Send us a message', response: '< 4 hours' }
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Get in Touch</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold text-white mb-6"
          >
            Let's{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Connect
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Have questions about LabGuard Pro? Need support? Want to learn more? 
            We're here to help. Choose your preferred way to get in touch.
          </motion.p>
        </div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <method.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{method.title}</h3>
              <p className="text-gray-300 mb-4">{method.description}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
                <Clock className="w-4 h-4" />
                <span>Response: {method.response}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 
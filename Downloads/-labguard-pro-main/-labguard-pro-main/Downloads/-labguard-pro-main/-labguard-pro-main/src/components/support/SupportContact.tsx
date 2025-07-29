'use client'

import React, { useState } from 'react'
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Users,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

export function SupportContact() {
  const [contactMethod, setContactMethod] = useState('chat')

  const contactMethods = [
    { id: 'chat', icon: MessageCircle, title: 'Live Chat', description: 'Get instant help', response: '< 5 min' },
    { id: 'phone', icon: Phone, title: 'Phone Support', description: 'Talk to an expert', response: '< 2 hours' },
    { id: 'email', icon: Mail, title: 'Email Support', description: 'Send us a message', response: '< 4 hours' }
  ]

  const supportHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM PST', available: true },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM PST', available: true },
    { day: 'Sunday', hours: 'Emergency support only', available: false }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-blue-900 to-slate-900 relative overflow-hidden">
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
            <span className="text-sm font-medium">Contact Support</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Get{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Direct Help
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Can't find what you're looking for? Our support team is here to help. 
            Choose your preferred contact method and we'll get back to you quickly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Choose Your Contact Method</h3>
            
            <div className="space-y-4 mb-8">
              {contactMethods.map((method) => (
                <motion.button
                  key={method.id}
                  onClick={() => setContactMethod(method.id)}
                  className={`w-full p-6 rounded-xl transition-all duration-300 text-left ${
                    contactMethod === method.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      contactMethod === method.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                        : 'bg-white/10'
                    }`}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-1">{method.title}</h4>
                      <p className="text-gray-300 mb-2">{method.description}</p>
                      <div className="flex items-center gap-2 text-sm text-blue-400">
                        <Clock className="w-4 h-4" />
                        <span>Response time: {method.response}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Support Hours */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Support Hours</h4>
              <div className="space-y-3">
                {supportHours.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{schedule.day}</div>
                      <div className="text-sm text-gray-400">{schedule.hours}</div>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${
                      schedule.available ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        schedule.available ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></div>
                      <span>{schedule.available ? 'Available' : 'Limited'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    <option value="">Select a topic</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Describe your issue or question..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Message
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
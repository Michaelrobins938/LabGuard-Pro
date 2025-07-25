'use client'

import React from 'react'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Sparkles,
  CheckCircle,
  Users,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

export function ContactInfo() {
  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@labguardpro.com', description: 'General inquiries' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', description: 'Mon-Fri 9AM-6PM PST' },
    { icon: MapPin, label: 'Address', value: 'Stanford, CA 94305', description: 'Headquarters' }
  ]

  const supportHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM PST', available: true },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM PST', available: true },
    { day: 'Sunday', hours: 'Emergency support only', available: false }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-blue-900 to-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-8">Contact Information</h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">{info.label}</div>
                    <div className="text-white font-semibold mb-1">{info.value}</div>
                    <div className="text-sm text-gray-400">{info.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Support Hours */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-8">Support Hours</h3>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="space-y-4">
                {supportHours.map((schedule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
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
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, MessageSquare, Phone } from 'lucide-react'

export default function BiotechnologyCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Biotechnology Research?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join leading biotech companies that are already accelerating their research and development 
            with LabGuard Pro. Start your transformation today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
              Schedule Demo
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Schedule a Demo</h3>
              <p className="text-blue-100 text-sm mb-3">
                See LabGuard Pro in action with a personalized demo
              </p>
              <button className="text-blue-200 hover:text-white text-sm font-medium">
                Book Demo
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Talk to an Expert</h3>
              <p className="text-blue-100 text-sm mb-3">
                Speak with our biotech solutions specialists
              </p>
              <button className="text-blue-200 hover:text-white text-sm font-medium">
                Contact Us
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Call Us</h3>
              <p className="text-blue-100 text-sm mb-3">
                Speak directly with our team
              </p>
              <a href="tel:+1-800-LABGUARD" className="text-blue-200 hover:text-white text-sm font-medium">
                +1 (800) LABGUARD
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              What Our Biotech Partners Say
            </h3>
            <div className="space-y-4">
              <div className="text-blue-100 italic">
                "LabGuard Pro has revolutionized our research workflow. We've reduced our experimental setup time by 60% and improved our data accuracy significantly."
              </div>
              <div className="text-white font-semibold">
                — Dr. Sarah Chen, Research Director, BioTech Innovations
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 
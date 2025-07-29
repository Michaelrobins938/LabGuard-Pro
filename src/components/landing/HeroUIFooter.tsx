'use client'

import React from 'react'
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Users, 
  Brain, 
  TrendingUp, 
  Globe, 
  Award, 
  Sparkles,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function HeroUIFooter() {
  const footerLinks = {
    product: [
      { name: 'AI Assistant', href: '/dashboard?bypass=true' },
      { name: 'Analytics', href: '/dashboard?bypass=true' },
      { name: 'Compliance', href: '/dashboard/compliance' },
      { name: 'Equipment Management', href: '/dashboard/equipment' },
      { name: 'Protocol Design', href: '/dashboard?bypass=true' }
    ],
    solutions: [
      { name: 'Research Labs', href: '/solutions/research' },
      { name: 'Clinical Labs', href: '/solutions/clinical' },
      { name: 'Pharmaceutical', href: '/solutions/pharmaceutical' },
      { name: 'Biotechnology', href: '/solutions/biotechnology' },
      { name: 'Academic Institutions', href: '/solutions/research' }
    ],
    resources: [
      { name: 'Documentation', href: '/resources/documentation' },
      { name: 'Case Studies', href: '/resources/case-studies' },
      { name: 'Blog', href: '/blog' },
      { name: 'Support Center', href: '/support' },
      { name: 'API Reference', href: '/resources/api' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
      { name: 'Partners', href: '/partners' },
      { name: 'Press Kit', href: '/press' }
    ]
  }

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' }
  ]

  const contactInfo = [
    { label: 'Email', value: 'hello@labguardpro.com', icon: Mail },
    { label: 'Phone', value: '+1 (555) 123-4567', icon: Phone },
    { label: 'Address', value: 'Stanford, CA 94305', icon: MapPin }
  ]

  const achievements = [
    { icon: Award, title: 'FDA Approved', description: 'Compliant with FDA regulations' },
    { icon: Globe, title: 'Global Reach', description: 'Used in 50+ countries' },
    { icon: Users, title: '500+ Labs', description: 'Trusted by leading institutions' },
    { icon: Brain, title: 'AI-Powered', description: 'Cutting-edge technology' }
  ]

  return (
    <footer className="bg-slate-900 relative overflow-hidden z-10">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        {/* CTA Section */}
        <div className="py-16 border-b border-white/10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Get Started Today</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Laboratory?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of laboratories already using LabGuard Pro to streamline their operations 
              and accelerate their research with AI-powered technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard?bypass=true" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300 backdrop-blur-sm">
                <Users className="w-5 h-5 mr-2" />
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-2 xl:grid-cols-5 gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="xl:col-span-2"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">LabGuard Pro</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Revolutionizing laboratory operations with AI-powered technology. 
                Automate compliance, streamline workflows, and ensure 100% accuracy.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                      <contact.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{contact.label}</div>
                      <div className="text-white">{contact.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <button
                    key={index}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5 text-gray-300 hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <div
                key={category}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold text-white mb-4 capitalize">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href} 
                        className="text-gray-300 hover:text-white transition-colors text-left block"
                        onClick={() => console.log('Footer link clicked:', link.href)}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                  {/* Test link with anchor tag */}
                  <li>
                    <a 
                      href="/test-link" 
                      className="text-red-400 hover:text-red-300 transition-colors text-left block"
                      onClick={() => console.log('Test anchor link clicked')}
                    >
                      TEST LINK (Anchor Tag)
                    </a>
                  </li>
                  {/* Nuclear test link */}
                  <li>
                    <a 
                      href="/about" 
                      style={{
                        color: 'yellow',
                        backgroundColor: 'red',
                        padding: '10px',
                        display: 'block',
                        textDecoration: 'underline',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        zIndex: 9999,
                        position: 'relative'
                      }}
                      onClick={() => alert('NUCLEAR TEST LINK CLICKED!')}
                    >
                      🚨 NUCLEAR TEST LINK 🚨
                    </a>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="py-12 border-t border-white/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{achievement.title}</h4>
                <p className="text-sm text-gray-400">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-gray-400 text-sm"
            >
              © 2024 LabGuard Pro. All rights reserved.
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-6 text-sm text-gray-400"
            >
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
} 
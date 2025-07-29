'use client'

import React, { useState } from 'react'
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Users, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  ExternalLink,
  ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'How we protect your data'
    },
    {
      id: 'collection',
      title: 'Data Collection',
      description: 'What information we collect'
    },
    {
      id: 'usage',
      title: 'Data Usage',
      description: 'How we use your information'
    },
    {
      id: 'sharing',
      title: 'Data Sharing',
      description: 'When we share your data'
    },
    {
      id: 'security',
      title: 'Security',
      description: 'How we protect your data'
    },
    {
      id: 'rights',
      title: 'Your Rights',
      description: 'Your data protection rights'
    },
    {
      id: 'cookies',
      title: 'Cookies',
      description: 'How we use cookies'
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'Get in touch with us'
    }
  ]

  const lastUpdated = 'January 15, 2024'
  const effectiveDate = 'January 15, 2024'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
                <p className="text-gray-400">How we protect and handle your data</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <div className="text-sm text-gray-400">
                Last updated: {lastUpdated}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Policy Sections</h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs text-gray-400">{section.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              {/* Overview Section */}
              {activeSection === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Privacy Policy Overview</h2>
                  <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p>
                      At LabGuard Pro, we are committed to protecting your privacy and ensuring the security of your data. 
                      This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
                      our laboratory management platform and related services.
                    </p>
                    <p>
                      This policy applies to all users of LabGuard Pro, including laboratory personnel, researchers, 
                      administrators, and any other individuals who access or use our platform. By using our services, 
                      you agree to the collection and use of information in accordance with this policy.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold text-white">Important Notice</span>
                      </div>
                      <p className="text-sm">
                        This policy was last updated on {lastUpdated} and is effective as of {effectiveDate}. 
                        We may update this policy from time to time, and we will notify you of any material changes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Collection Section */}
              {activeSection === 'collection' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Data Collection</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Users className="w-5 h-5 text-blue-400" />
                          <h3 className="font-semibold text-white">Personal Information</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Name and contact information</li>
                          <li>• Professional credentials and affiliations</li>
                          <li>• Laboratory and institutional details</li>
                          <li>• Account credentials and preferences</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Database className="w-5 h-5 text-green-400" />
                          <h3 className="font-semibold text-white">Laboratory Data</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Experimental protocols and procedures</li>
                          <li>• Equipment calibration and maintenance records</li>
                          <li>• Compliance documentation and audit trails</li>
                          <li>• Performance metrics and analytics</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe className="w-5 h-5 text-purple-400" />
                        <h3 className="font-semibold text-white">Technical Information</h3>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• IP addresses and device information</li>
                        <li>• Browser type and version</li>
                        <li>• Usage patterns and analytics</li>
                        <li>• Error logs and performance data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Usage Section */}
              {activeSection === 'usage' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Data Usage</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <h3 className="font-semibold text-white">Service Provision</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Providing laboratory management services</li>
                          <li>• Processing and analyzing experimental data</li>
                          <li>• Generating compliance reports</li>
                          <li>• Managing equipment and protocols</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="w-5 h-5 text-blue-400" />
                          <h3 className="font-semibold text-white">Security & Compliance</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Ensuring platform security</li>
                          <li>• Preventing fraud and abuse</li>
                          <li>• Complying with legal obligations</li>
                          <li>• Maintaining audit trails</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                        <h3 className="font-semibold text-white">Improvement & Analytics</h3>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• Improving our services and features</li>
                        <li>• Conducting research and development</li>
                        <li>• Analyzing usage patterns</li>
                        <li>• Developing new capabilities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Sharing Section */}
              {activeSection === 'sharing' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Data Sharing</h2>
                  <div className="space-y-6">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="font-semibold text-white">We Do Not Sell Your Data</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        LabGuard Pro does not sell, rent, or trade your personal information to third parties for marketing purposes.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Service Providers</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Cloud infrastructure providers</li>
                          <li>• Analytics and monitoring services</li>
                          <li>• Customer support platforms</li>
                          <li>• Payment processing services</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Legal Requirements</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Regulatory compliance</li>
                          <li>• Law enforcement requests</li>
                          <li>• Court orders and subpoenas</li>
                          <li>• Safety and security emergencies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Data Security</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Lock className="w-5 h-5 text-green-400" />
                          <h3 className="font-semibold text-white">Encryption</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• AES-256 encryption at rest</li>
                          <li>• TLS 1.3 encryption in transit</li>
                          <li>• End-to-end encryption for sensitive data</li>
                          <li>• Secure key management</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="w-5 h-5 text-blue-400" />
                          <h3 className="font-semibold text-white">Access Controls</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Multi-factor authentication</li>
                          <li>• Role-based access controls</li>
                          <li>• Regular security audits</li>
                          <li>• Continuous monitoring</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Eye className="w-5 h-5 text-purple-400" />
                        <h3 className="font-semibold text-white">Compliance & Certifications</h3>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• SOC 2 Type II certified</li>
                        <li>• ISO 27001 information security</li>
                        <li>• HIPAA compliance for clinical data</li>
                        <li>• GDPR compliance for EU users</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Your Rights Section */}
              {activeSection === 'rights' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Your Data Rights</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Access & Control</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Access your personal data</li>
                          <li>• Correct inaccurate information</li>
                          <li>• Request data deletion</li>
                          <li>• Export your data</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Communication</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Opt out of marketing emails</li>
                          <li>• Control notification preferences</li>
                          <li>• Request data processing restrictions</li>
                          <li>• Object to data processing</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-white">Exercise Your Rights</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        To exercise any of these rights, please contact us at privacy@labguardpro.com. 
                        We will respond to your request within 30 days.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cookies Section */}
              {activeSection === 'cookies' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Cookie Policy</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Essential Cookies</h3>
                        <p className="text-sm text-gray-300 mb-3">
                          Required for basic platform functionality
                        </p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Authentication</li>
                          <li>• Security</li>
                          <li>• Session management</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Analytics Cookies</h3>
                        <p className="text-sm text-gray-300 mb-3">
                          Help us improve our services
                        </p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Usage analytics</li>
                          <li>• Performance monitoring</li>
                          <li>• Error tracking</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Preference Cookies</h3>
                        <p className="text-sm text-gray-300 mb-3">
                          Remember your settings
                        </p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Language preferences</li>
                          <li>• Theme settings</li>
                          <li>• Custom configurations</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-3">Cookie Management</h3>
                      <p className="text-sm text-gray-300 mb-4">
                        You can control cookie settings through your browser preferences. 
                        Note that disabling certain cookies may affect platform functionality.
                      </p>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors">
                        Manage Cookie Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Section */}
              {activeSection === 'contact' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <h3 className="font-semibold text-white mb-4">Privacy Team</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <div>
                              <div className="text-white">privacy@labguardpro.com</div>
                              <div className="text-sm text-gray-400">Privacy inquiries</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-green-400" />
                            <div>
                              <div className="text-white">+1 (555) 123-4567</div>
                              <div className="text-sm text-gray-400">Privacy hotline</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-purple-400" />
                            <div>
                              <div className="text-white">Stanford, CA 94305</div>
                              <div className="text-sm text-gray-400">Headquarters</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <h3 className="font-semibold text-white mb-4">Data Protection Officer</h3>
                        <div className="space-y-3">
                          <div className="text-white font-medium">Dr. Sarah Chen</div>
                          <div className="text-sm text-gray-300">Chief Privacy Officer</div>
                          <div className="text-sm text-gray-300">dpo@labguardpro.com</div>
                          <div className="text-sm text-gray-300">+1 (555) 123-4568</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-white">Response Time</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        We aim to respond to all privacy inquiries within 48 hours. 
                        For urgent matters, please call our privacy hotline.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
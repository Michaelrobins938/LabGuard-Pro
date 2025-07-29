'use client'

import React, { useState } from 'react'
import { 
  FileText, 
  Shield, 
  Users, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Download,
  ExternalLink,
  ArrowRight,
  Lock,
  Scale,
  Gavel
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Agreement summary'
    },
    {
      id: 'services',
      title: 'Services',
      description: 'What we provide'
    },
    {
      id: 'accounts',
      title: 'Accounts',
      description: 'User responsibilities'
    },
    {
      id: 'usage',
      title: 'Acceptable Use',
      description: 'Usage guidelines'
    },
    {
      id: 'intellectual',
      title: 'Intellectual Property',
      description: 'IP rights and ownership'
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      description: 'Data handling terms'
    },
    {
      id: 'liability',
      title: 'Liability',
      description: 'Limitations and disclaimers'
    },
    {
      id: 'termination',
      title: 'Termination',
      description: 'Service termination'
    },
    {
      id: 'governing',
      title: 'Governing Law',
      description: 'Legal jurisdiction'
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'Get in touch'
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
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
                <p className="text-gray-400">Legal terms and conditions</p>
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
              <h3 className="text-lg font-semibold text-white mb-4">Terms Sections</h3>
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
                  <h2 className="text-2xl font-bold text-white mb-6">Terms of Service Overview</h2>
                  <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p>
                      These Terms of Service ("Terms") govern your use of LabGuard Pro's laboratory management platform 
                      and related services. By accessing or using our services, you agree to be bound by these Terms.
                    </p>
                    <p>
                      LabGuard Pro provides AI-powered laboratory management solutions, including protocol design, 
                      compliance monitoring, equipment management, and data analytics services.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold text-white">Important Notice</span>
                      </div>
                      <p className="text-sm">
                        These terms were last updated on {lastUpdated} and are effective as of {effectiveDate}. 
                        Continued use of our services constitutes acceptance of any updated terms.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Services Section */}
              {activeSection === 'services' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Services Description</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="w-5 h-5 text-blue-400" />
                          <h3 className="font-semibold text-white">Core Services</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• AI-powered protocol design</li>
                          <li>• Compliance monitoring and reporting</li>
                          <li>• Equipment management and calibration</li>
                          <li>• Real-time analytics and insights</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Users className="w-5 h-5 text-green-400" />
                          <h3 className="font-semibold text-white">Support Services</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• 24/7 technical support</li>
                          <li>• Training and onboarding</li>
                          <li>• Custom integrations</li>
                          <li>• Professional consulting</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe className="w-5 h-5 text-purple-400" />
                        <h3 className="font-semibold text-white">Service Availability</h3>
                      </div>
                      <p className="text-sm text-gray-300">
                        We strive to maintain 99.9% uptime for our services. Scheduled maintenance will be communicated 
                        in advance, and emergency maintenance may be performed with minimal notice to ensure service security.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Accounts Section */}
              {activeSection === 'accounts' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Account Responsibilities</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Account Creation</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Provide accurate registration information</li>
                          <li>• Maintain account security credentials</li>
                          <li>• Notify us of any security concerns</li>
                          <li>• Keep contact information current</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Account Security</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Use strong, unique passwords</li>
                          <li>• Enable multi-factor authentication</li>
                          <li>• Don't share account credentials</li>
                          <li>• Log out from shared devices</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-3">Account Termination</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        We may suspend or terminate accounts that violate these terms, engage in fraudulent activity, 
                        or pose security risks to our platform or other users.
                      </p>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• Immediate suspension for security threats</li>
                        <li>• 30-day notice for policy violations</li>
                        <li>• Data export available upon request</li>
                        <li>• Refund policies apply per service tier</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Acceptable Use Section */}
              {activeSection === 'usage' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Acceptable Use Policy</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Permitted Uses</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Laboratory research and experimentation</li>
                          <li>• Clinical diagnostic procedures</li>
                          <li>• Educational and training purposes</li>
                          <li>• Regulatory compliance activities</li>
                        </ul>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Prohibited Uses</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Illegal or unauthorized activities</li>
                          <li>• Harmful or malicious content</li>
                          <li>• Attempting to breach security</li>
                          <li>• Violating third-party rights</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-3">Compliance Requirements</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        Users must comply with all applicable laws, regulations, and industry standards, including:
                      </p>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• FDA regulations for clinical laboratories</li>
                        <li>• CLIA certification requirements</li>
                        <li>• HIPAA privacy and security rules</li>
                        <li>• ISO 17025 quality management standards</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Intellectual Property Section */}
              {activeSection === 'intellectual' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Intellectual Property</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Our IP Rights</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Platform software and algorithms</li>
                          <li>• User interface and design</li>
                          <li>• Trademarks and branding</li>
                          <li>• Patents and trade secrets</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Your IP Rights</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Your experimental data</li>
                          <li>• Custom protocols you create</li>
                          <li>• Research findings and publications</li>
                          <li>• Your laboratory procedures</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-3">License Grant</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        We grant you a limited, non-exclusive, non-transferable license to use our services 
                        in accordance with these terms and your subscription plan.
                      </p>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• License terminates with account termination</li>
                        <li>• No reverse engineering permitted</li>
                        <li>• No sublicensing without written consent</li>
                        <li>• Usage limited to authorized purposes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy & Data Section */}
              {activeSection === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Privacy & Data Protection</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Data Ownership</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• You retain ownership of your data</li>
                          <li>• We process data as your service provider</li>
                          <li>• Data export available upon request</li>
                          <li>• Deletion upon account termination</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Data Processing</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Processing for service delivery</li>
                          <li>• Security and fraud prevention</li>
                          <li>• Service improvement and analytics</li>
                          <li>• Legal and regulatory compliance</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-3">Data Security</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        We implement industry-standard security measures to protect your data:
                      </p>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• AES-256 encryption at rest and in transit</li>
                        <li>• SOC 2 Type II and ISO 27001 compliance</li>
                        <li>• Regular security audits and penetration testing</li>
                        <li>• Multi-factor authentication and access controls</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Liability Section */}
              {activeSection === 'liability' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Liability & Disclaimers</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Service Disclaimers</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Services provided "as is"</li>
                          <li>• No warranty of fitness for purpose</li>
                          <li>• No guarantee of specific results</li>
                          <li>• Third-party integrations not warranted</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Limitation of Liability</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Limited to subscription fees paid</li>
                          <li>• No indirect or consequential damages</li>
                          <li>• No liability for data loss</li>
                          <li>• Force majeure events excluded</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-3">Indemnification</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        You agree to indemnify and hold harmless LabGuard Pro from any claims arising from:
                      </p>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• Your use of our services</li>
                        <li>• Violation of these terms</li>
                        <li>• Infringement of third-party rights</li>
                        <li>• Your content or data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Termination Section */}
              {activeSection === 'termination' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Service Termination</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Termination by You</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Cancel subscription anytime</li>
                          <li>• 30-day notice for annual plans</li>
                          <li>• Immediate for monthly plans</li>
                          <li>• Data export available</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Termination by Us</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Material breach of terms</li>
                          <li>• Non-payment of fees</li>
                          <li>• Security or legal concerns</li>
                          <li>• Service discontinuation</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-3">Post-Termination</h3>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li>• Immediate service suspension</li>
                        <li>• 30-day data retention period</li>
                        <li>• Data deletion after retention</li>
                        <li>• Refund policies apply</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Governing Law Section */}
              {activeSection === 'governing' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Governing Law & Disputes</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Governing Law</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• California law applies</li>
                          <li>• Federal law for IP matters</li>
                          <li>• International users subject to local laws</li>
                          <li>• Conflicts resolved by California courts</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Dispute Resolution</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Informal resolution first</li>
                          <li>• Mediation if needed</li>
                          <li>• Arbitration for unresolved disputes</li>
                          <li>• Small claims court available</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-3">Class Action Waiver</h3>
                      <p className="text-sm text-gray-300">
                        You agree to resolve disputes individually and waive any right to participate in class action 
                        lawsuits or class-wide arbitration.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Section */}
              {activeSection === 'contact' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <h3 className="font-semibold text-white mb-4">Legal Department</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <div>
                              <div className="text-white">legal@labguardpro.com</div>
                              <div className="text-sm text-gray-400">Legal inquiries</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-green-400" />
                            <div>
                              <div className="text-white">+1 (555) 123-4567</div>
                              <div className="text-sm text-gray-400">Legal hotline</div>
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
                        <h3 className="font-semibold text-white mb-4">General Counsel</h3>
                        <div className="space-y-3">
                          <div className="text-white font-medium">Michael Rodriguez</div>
                          <div className="text-sm text-gray-300">Chief Legal Officer</div>
                          <div className="text-sm text-gray-300">michael.rodriguez@labguardpro.com</div>
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
                        We aim to respond to all legal inquiries within 5 business days. 
                        For urgent matters, please call our legal hotline.
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
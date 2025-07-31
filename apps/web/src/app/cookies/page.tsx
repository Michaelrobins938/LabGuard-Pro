'use client'

import React, { useState } from 'react'
import { 
  Cookie, 
  Shield, 
  Settings, 
  Eye, 
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
  Database,
  Users
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function CookiePolicyPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false
  })

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'What are cookies'
    },
    {
      id: 'types',
      title: 'Cookie Types',
      description: 'Categories of cookies'
    },
    {
      id: 'usage',
      title: 'How We Use Cookies',
      description: 'Our cookie usage'
    },
    {
      id: 'third-party',
      title: 'Third-Party Cookies',
      description: 'External services'
    },
    {
      id: 'management',
      title: 'Cookie Management',
      description: 'Control your preferences'
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'Get in touch'
    }
  ]

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      description: 'Required for basic platform functionality',
      icon: Lock,
      color: 'from-green-500 to-emerald-500',
      examples: [
        'Authentication and security',
        'Session management',
        'CSRF protection',
        'Load balancing'
      ],
      alwaysActive: true
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'Help us improve our services',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      examples: [
        'Usage analytics and metrics',
        'Performance monitoring',
        'Error tracking and debugging',
        'Feature usage statistics'
      ],
      alwaysActive: false
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'Used for advertising and marketing',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      examples: [
        'Ad personalization',
        'Campaign effectiveness',
        'Social media integration',
        'Retargeting campaigns'
      ],
      alwaysActive: false
    },
    {
      id: 'preferences',
      name: 'Preference Cookies',
      description: 'Remember your settings and choices',
      icon: Settings,
      color: 'from-orange-500 to-red-500',
      examples: [
        'Language preferences',
        'Theme and display settings',
        'Custom configurations',
        'User interface choices'
      ],
      alwaysActive: false
    }
  ]

  const lastUpdated = 'January 15, 2024'

  const handleCookieToggle = (cookieType: string) => {
    if (cookieType === 'essential') return // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [cookieType]: !prev[cookieType as keyof typeof prev]
    }))
  }

  const savePreferences = () => {
    // In a real implementation, this would save to localStorage and send to server
    console.log('Cookie preferences saved:', cookiePreferences)
    alert('Cookie preferences saved successfully!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Cookie Policy</h1>
                <p className="text-gray-400">How we use cookies and similar technologies</p>
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
                  <h2 className="text-2xl font-bold text-white mb-6">Cookie Policy Overview</h2>
                  <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p>
                      This Cookie Policy explains how LabGuard Pro uses cookies and similar technologies when you visit 
                      our website and use our laboratory management platform. This policy provides you with clear and 
                      comprehensive information about the cookies we use and how you can control them.
                    </p>
                    <p>
                      Cookies are small text files that are stored on your device when you visit a website. They help 
                      us provide you with a better experience by remembering your preferences, analyzing how you use our 
                      services, and personalizing content.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold text-white">Important Notice</span>
                      </div>
                      <p className="text-sm">
                        This policy was last updated on {lastUpdated}. By continuing to use our services, 
                        you consent to our use of cookies in accordance with this policy.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cookie Types Section */}
              {activeSection === 'types' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Types of Cookies We Use</h2>
                  <div className="space-y-6">
                    {cookieTypes.map((cookieType) => (
                      <div key={cookieType.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${cookieType.color} rounded-lg flex items-center justify-center`}>
                            <cookieType.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">{cookieType.name}</h3>
                            <p className="text-gray-300">{cookieType.description}</p>
                          </div>
                          {!cookieType.alwaysActive && (
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={cookiePreferences[cookieType.id as keyof typeof cookiePreferences]}
                                onChange={() => handleCookieToggle(cookieType.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          )}
                          {cookieType.alwaysActive && (
                            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                              Always Active
                            </div>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-white mb-2">Examples of Use:</h4>
                            <ul className="text-sm text-gray-300 space-y-1">
                              {cookieType.examples.map((example, index) => (
                                <li key={index}>• {example}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-2">Duration:</h4>
                            <p className="text-sm text-gray-300">
                              {cookieType.id === 'essential' 
                                ? 'Session and persistent cookies'
                                : cookieType.id === 'analytics'
                                ? 'Up to 2 years'
                                : cookieType.id === 'marketing'
                                ? 'Up to 1 year'
                                : 'Up to 6 months'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How We Use Cookies Section */}
              {activeSection === 'usage' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">How We Use Cookies</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="w-5 h-5 text-blue-400" />
                          <h3 className="font-semibold text-white">Security & Authentication</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Secure user authentication</li>
                          <li>• Session management</li>
                          <li>• CSRF protection</li>
                          <li>• Fraud prevention</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Eye className="w-5 h-5 text-green-400" />
                          <h3 className="font-semibold text-white">Analytics & Performance</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Usage analytics</li>
                          <li>• Performance monitoring</li>
                          <li>• Error tracking</li>
                          <li>• Service optimization</li>
                        </ul>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Settings className="w-5 h-5 text-purple-400" />
                          <h3 className="font-semibold text-white">Personalization</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• User preferences</li>
                          <li>• Interface customization</li>
                          <li>• Language settings</li>
                          <li>• Feature recommendations</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Globe className="w-5 h-5 text-orange-400" />
                          <h3 className="font-semibold text-white">Marketing & Communication</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Targeted advertising</li>
                          <li>• Campaign effectiveness</li>
                          <li>• Social media integration</li>
                          <li>• Newsletter preferences</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Third-Party Cookies Section */}
              {activeSection === 'third-party' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Third-Party Cookies</h2>
                  <div className="space-y-6">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="font-semibold text-white">Third-Party Services</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        We use third-party services that may set their own cookies. These services have their own 
                        privacy policies and cookie practices.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Analytics Services</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Google Analytics</li>
                          <li>• Mixpanel</li>
                          <li>• Hotjar</li>
                          <li>• Sentry (error tracking)</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Marketing Services</h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Google Ads</li>
                          <li>• Facebook Pixel</li>
                          <li>• LinkedIn Insights</li>
                          <li>• HubSpot</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-3">Managing Third-Party Cookies</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        You can control third-party cookies through your browser settings or by visiting the 
                        respective service providers' opt-out pages:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-white mb-2">Browser Settings:</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Chrome: Settings &gt; Privacy and security</li>
                            <li>• Firefox: Options &gt; Privacy & Security</li>
                            <li>• Safari: Preferences &gt; Privacy</li>
                            <li>• Edge: Settings &gt; Cookies and permissions</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-2">Service Opt-outs:</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Google Analytics Opt-out</li>
                            <li>• Facebook Ad Preferences</li>
                            <li>• LinkedIn Cookie Settings</li>
                            <li>• Digital Advertising Alliance</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cookie Management Section */}
              {activeSection === 'management' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Cookie Management</h2>
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Your Cookie Preferences</h3>
                      <div className="space-y-4">
                        {cookieTypes.map((cookieType) => (
                          <div key={cookieType.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 bg-gradient-to-r ${cookieType.color} rounded-lg flex items-center justify-center`}>
                                <cookieType.icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-white">{cookieType.name}</div>
                                <div className="text-sm text-gray-400">{cookieType.description}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {cookieType.alwaysActive ? (
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                  Always Active
                                </span>
                              ) : (
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={cookiePreferences[cookieType.id as keyof typeof cookiePreferences]}
                                    onChange={() => handleCookieToggle(cookieType.id)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-6">
                        <button
                          onClick={savePreferences}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors"
                        >
                          Save Preferences
                        </button>
                        <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                          Reset to Default
                        </button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Browser Settings</h3>
                        <p className="text-sm text-gray-300 mb-3">
                          You can control cookies through your browser settings:
                        </p>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• Block all cookies</li>
                          <li>• Allow only essential cookies</li>
                          <li>• Delete existing cookies</li>
                          <li>• Set cookie expiration</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Mobile Devices</h3>
                        <p className="text-sm text-gray-300 mb-3">
                          Cookie settings on mobile devices:
                        </p>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li>• iOS Safari settings</li>
                          <li>• Android Chrome settings</li>
                          <li>• App-specific settings</li>
                          <li>• System-wide preferences</li>
                        </ul>
                      </div>
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
                              <div className="text-sm text-gray-400">Cookie inquiries</div>
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
                        We aim to respond to all cookie-related inquiries within 48 hours. 
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
'use client'

import { CheckCircle, X, Star, Shield, Brain, Zap, Users, BarChart3 } from 'lucide-react'

export function FeatureComparisonSection() {
  const features = [
    {
      name: 'AI Compliance Automation',
      labguard: true,
      competitorA: false,
      competitorB: false,
      competitorC: false
    },
    {
      name: 'Equipment Management',
      labguard: true,
      competitorA: false,
      competitorB: true,
      competitorC: false
    },
    {
      name: 'Mobile App',
      labguard: true,
      competitorA: true,
      competitorB: false,
      competitorC: false
    },
    {
      name: 'AI-Powered Integration',
      labguard: true,
      competitorA: true,
      competitorB: true,
      competitorC: false
    },
    {
      name: 'Audit Trail',
      labguard: true,
      competitorA: true,
      competitorB: false,
      competitorC: false
    },
    {
      name: 'Custom Reports',
      labguard: true,
      competitorA: false,
      competitorB: true,
      competitorC: false
    },
    {
      name: 'Realtime Alerts',
      labguard: true,
      competitorA: false,
      competitorB: true,
      competitorC: false
    },
    {
      name: 'Role-Based Access',
      labguard: true,
      competitorA: 'partial',
      competitorB: false,
      competitorC: false
    }
  ]

  const renderFeatureStatus = (status: boolean | string) => {
    if (status === true) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else if (status === 'partial') {
      return <Star className="w-5 h-5 text-yellow-500" />
    } else {
      return <X className="w-5 h-5 text-red-500" />
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Feature Comparison Matrix
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how LabGuard Pro outperforms the competition with comprehensive AI-powered features
          </p>
        </div>

        {/* Feature Comparison Table */}
        <div className="enhanced-card p-8 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-white font-semibold">Feature</th>
                <th className="text-center py-4 px-4 text-white font-semibold">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>LabGuard Pro</span>
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-gray-300 font-semibold">Competitor A</th>
                <th className="text-center py-4 px-4 text-gray-300 font-semibold">Competitor B</th>
                <th className="text-center py-4 px-4 text-gray-300 font-semibold">Competitor C</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-4 px-4 text-white font-medium">{feature.name}</td>
                  <td className="py-4 px-4 text-center">
                    {renderFeatureStatus(feature.labguard)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {renderFeatureStatus(feature.competitorA)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {renderFeatureStatus(feature.competitorB)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {renderFeatureStatus(feature.competitorC)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex justify-center mt-8 space-x-8">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-300">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-300">Partial/Limited</span>
          </div>
          <div className="flex items-center space-x-2">
            <X className="w-5 h-5 text-red-500" />
            <span className="text-gray-300">Not Available</span>
          </div>
        </div>

        {/* Key Advantages */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="enhanced-card p-6 text-center">
            <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI-Powered</h3>
            <p className="text-gray-300">
              Only LabGuard Pro offers comprehensive AI compliance automation
            </p>
          </div>
          <div className="enhanced-card p-6 text-center">
            <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Real-time Alerts</h3>
            <p className="text-gray-300">
              Instant notifications for compliance issues and equipment problems
            </p>
          </div>
          <div className="enhanced-card p-6 text-center">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Role-Based Access</h3>
            <p className="text-gray-300">
              Complete access control with granular permissions
            </p>
          </div>
        </div>

        {/* Feature Comparison Infographic */}
        <div className="text-center mt-16">
          <div className="enhanced-card p-8 max-w-6xl mx-auto">
            <div className="relative">
              {/* Placeholder for the actual feature comparison matrix */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-12 border-2 border-dashed border-blue-300">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Feature Comparison Matrix
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comprehensive comparison of laboratory compliance features
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-800">LabGuard Pro</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-xs">A</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Competitor A</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-xs">B</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Competitor B</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-xs">C</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Competitor C</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="enhanced-button-primary text-lg px-8 py-4">
            Choose LabGuard Pro
          </button>
        </div>
      </div>
    </section>
  )
} 
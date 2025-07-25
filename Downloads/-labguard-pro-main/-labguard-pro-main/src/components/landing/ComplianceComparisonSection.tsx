'use client'

import { AlertTriangle, Clock, CheckCircle, TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react'

export function ComplianceComparisonSection() {
  const beforeProblems = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: 'Compliance Violations',
      stat: '47%',
      description: 'of labs faced compliance violations last year'
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: 'Manual Documentation',
      stat: '30%',
      description: 'Manual documentation and tracking'
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: 'Audit Time',
      stat: '55%',
      description: 'Time spent on audits and inspections'
    }
  ]

  const afterProcess = [
    {
      step: '1',
      title: 'Equipment Tagging',
      description: 'Tag and track all laboratory equipment'
    },
    {
      step: '2',
      title: 'Automated Monitoring',
      description: 'AI-powered continuous monitoring'
    },
    {
      step: '3',
      title: 'Compliance Validation',
      description: 'Real-time compliance checking'
    },
    {
      step: '4',
      title: 'Detailed Reports',
      description: 'Automated report generation'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Laboratory Compliance Made Simple
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your compliance workflow from manual chaos to automated excellence
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          
          {/* Before Section */}
          <div className="enhanced-card p-8">
            <h3 className="text-2xl font-bold text-red-400 mb-6">BEFORE</h3>
            <div className="space-y-6">
              {beforeProblems.map((problem, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    {problem.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-2xl font-bold text-red-400">{problem.stat}</span>
                      <h4 className="text-white font-medium">{problem.title}</h4>
                    </div>
                    <p className="text-gray-300 text-sm">{problem.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* After Section */}
          <div className="enhanced-card p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-6">AFTER LABGUARD PRO</h3>
            <div className="space-y-6">
              {afterProcess.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{step.title}</h4>
                    <p className="text-gray-300 text-sm">{step.description}</p>
                  </div>
                  {index < afterProcess.length - 1 && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Benefit */}
        <div className="text-center mb-16">
          <div className="enhanced-card p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">Key Benefit</h3>
            <div className="text-6xl font-bold text-green-400 mb-2">400 kg</div>
            <p className="text-gray-300 text-lg">
              Reduction in paper waste and manual processes
            </p>
          </div>
        </div>

        {/* Compliance Comparison Infographic */}
        <div className="text-center">
          <div className="enhanced-card p-8 max-w-5xl mx-auto">
            <div className="relative">
              {/* Placeholder for the actual compliance comparison infographic */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-100 rounded-2xl p-12 border-2 border-dashed border-teal-300">
                <div className="text-center">
                  <Shield className="w-16 h-16 text-teal-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Laboratory Compliance Made Simple
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Before/After comparison showing the transformation
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-lg font-semibold text-gray-800">Before</div>
                      <div className="text-sm text-gray-600">Manual processes</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-lg font-semibold text-gray-800">After</div>
                      <div className="text-sm text-gray-600">Automated excellence</div>
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
            Transform Your Lab
          </button>
        </div>
      </div>
    </section>
  )
} 
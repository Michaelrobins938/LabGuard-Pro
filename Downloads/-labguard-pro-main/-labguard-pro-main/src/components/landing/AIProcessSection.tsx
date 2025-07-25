'use client'

import { Brain, Database, Shield, FileText, ArrowRight, Zap } from 'lucide-react'

export function AIProcessSection() {
  const processSteps = [
    {
      icon: <Database className="w-8 h-8 text-blue-500" />,
      title: 'Equipment',
      description: 'Laboratory instruments collect equipment data',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      title: 'AI Analysis',
      description: 'Machine learning algorithms analyze outputs',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: 'Compliance',
      description: 'AI validates data against protocols',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-500" />,
      title: 'Reporting',
      description: 'LabGuard Pro generates compliance reports',
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            AI-Powered Laboratory Management
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            AI-based solutions to ensure compliance through intelligent automation
          </p>
        </div>

        {/* Process Flow */}
        <div className="relative">
          {/* Process Steps */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="enhanced-card text-center p-8 relative">
                  <div className="flex justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-4`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-300">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between steps */}
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile arrows */}
          <div className="md:hidden flex justify-center space-x-4 mb-8">
            {processSteps.slice(0, -1).map((_, index) => (
              <div key={index} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            ))}
          </div>
        </div>

        {/* AI Process Infographic */}
        <div className="text-center">
          <div className="enhanced-card p-8 max-w-5xl mx-auto">
            <div className="relative">
              {/* Placeholder for the actual AI process flowchart */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-12 border-2 border-dashed border-indigo-300">
                <div className="text-center">
                  <Zap className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    AI-Powered Laboratory Management Flowchart
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Visual representation of the 4-step AI process
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {processSteps.map((step, index) => (
                      <div key={index} className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          {step.icon}
                        </div>
                        <div className="text-sm font-semibold text-gray-800">{step.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="enhanced-button-primary text-lg px-8 py-4">
            See AI in Action
          </button>
        </div>
      </div>
    </section>
  )
} 
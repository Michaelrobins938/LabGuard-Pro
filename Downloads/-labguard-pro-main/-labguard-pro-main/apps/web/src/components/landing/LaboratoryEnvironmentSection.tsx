'use client'

import { Microscope, Monitor, TestTube, Shield, CheckCircle, BarChart3, Brain } from 'lucide-react'

export function LaboratoryEnvironmentSection() {
  const labEquipment = [
    {
      icon: <Microscope className="w-8 h-8 text-blue-500" />,
      name: 'Compound Microscope',
      status: 'Calibrated',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <Monitor className="w-8 h-8 text-green-500" />,
      name: 'Digital Analyzer',
      status: 'Active',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <TestTube className="w-8 h-8 text-purple-500" />,
      name: 'Sample Rack',
      status: 'Processing',
      color: 'from-purple-500 to-pink-600'
    }
  ]

  const holographicElements = [
    {
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
      label: 'Quality Control',
      description: 'Real-time verification'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
      label: 'Data Analysis',
      description: 'Trend monitoring'
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      label: 'AI Processing',
      description: 'Intelligent insights'
    },
    {
      icon: <Shield className="w-6 h-6 text-orange-400" />,
      label: 'Security',
      description: 'Compliance protection'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Modern Laboratory Environment
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of laboratory management with AI-powered digital interfaces and holographic monitoring
          </p>
        </div>

        {/* Laboratory Environment Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Laboratory Equipment */}
          <div className="space-y-6">
            <div className="enhanced-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Laboratory Equipment</h3>
              <div className="space-y-4">
                {labEquipment.map((equipment, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg">
                    <div className={`w-12 h-12 bg-gradient-to-r ${equipment.color} rounded-lg flex items-center justify-center`}>
                      {equipment.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{equipment.name}</h4>
                      <p className="text-gray-300 text-sm">{equipment.status}</p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Interface */}
            <div className="enhanced-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Digital Interface</h3>
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">CALIBRATED</h4>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded p-3">
                    <div className="text-green-400 text-sm">Status</div>
                    <div className="text-white font-medium">Active</div>
                  </div>
                  <div className="bg-white/10 rounded p-3">
                    <div className="text-blue-400 text-sm">Accuracy</div>
                    <div className="text-white font-medium">99.8%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Holographic Elements */}
          <div className="enhanced-card p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Holographic Monitoring</h3>
            <div className="grid grid-cols-2 gap-4">
              {holographicElements.map((element, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    {element.icon}
                  </div>
                  <h4 className="text-white font-medium text-sm mb-1">{element.label}</h4>
                  <p className="text-gray-300 text-xs">{element.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Laboratory Environment Infographic */}
        <div className="text-center mt-16">
          <div className="enhanced-card p-8 max-w-6xl mx-auto">
            <div className="relative">
              {/* Placeholder for the actual laboratory environment image */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-12 border-2 border-dashed border-indigo-300">
                <div className="text-center">
                  <Microscope className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Modern High-Tech Laboratory Environment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Advanced laboratory setting with digital interfaces and holographic monitoring
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Microscope className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Equipment</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Monitor className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Digital UI</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-800">AI Monitoring</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Security</div>
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
            Experience the Future
          </button>
        </div>
      </div>
    </section>
  )
} 
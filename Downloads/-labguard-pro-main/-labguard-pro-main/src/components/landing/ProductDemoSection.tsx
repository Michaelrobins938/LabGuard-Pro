'use client'

import { Shield, CheckCircle, Users, BarChart3, Zap, Eye, Brain } from 'lucide-react'

export function ProductDemoSection() {
  const keyFeatures = [
    {
      icon: <Eye className="w-6 h-6 text-green-500" />,
      title: 'Real-time monitoring',
      description: 'Continuous equipment and compliance tracking'
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: 'Incident management',
      description: 'Automated issue detection and resolution'
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      title: 'AI protocol analysis',
      description: 'Intelligent protocol validation and optimization'
    }
  ]

  const dashboardMetrics = [
    { label: 'Compliance', value: '98.5%', status: 'compliant' },
    { label: 'Audits', value: '15', status: 'active' },
    { label: 'Inspections', value: '28', status: 'scheduled' },
    { label: 'Reports', value: '345', status: 'generated' }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Product Demonstration
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See LabGuard Pro in action with our comprehensive laboratory compliance platform
          </p>
        </div>

        {/* Product Demo Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Lab Compliance Dashboard */}
          <div className="enhanced-card p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-4">Lab Compliance Dashboard</h3>
              <div className="flex items-center justify-between p-3 bg-green-600 rounded-lg mb-4">
                <span className="text-white font-medium">egrapket.compliant</span>
                <span className="text-white text-sm">Edit IC Doy I</span>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {dashboardMetrics.map((metric, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-300">{metric.label}</div>
                  <div className="text-xs text-green-400 mt-1">{metric.status}</div>
                </div>
              ))}
            </div>

            {/* Compliance Status */}
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Compliance Status</h4>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Status</div>
                  <div className="text-green-400 text-sm">61 compliant</div>
                  <div className="text-gray-300 text-xs">2.5 Reports</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key Features */}
          <div className="space-y-6">
            <div className="enhanced-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
              <div className="space-y-4">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{feature.title}</h4>
                      <p className="text-gray-300 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Automated Report Generation */}
            <div className="enhanced-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Automated Report Generation</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="bg-red-500 text-white px-4 py-2 rounded-lg mb-2">REPORT</div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-red-400 text-sm">NOT COMPLIANT</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-600 rounded"></div>
                      <div className="h-1 bg-gray-600 rounded"></div>
                      <div className="h-1 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Before</div>
                </div>
                <div className="text-center">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg mb-2">REPORT</div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-green-400 text-sm">COMPLIANT</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-600 rounded"></div>
                      <div className="h-1 bg-gray-600 rounded"></div>
                      <div className="h-1 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">After</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Demo Infographic */}
        <div className="text-center mt-16">
          <div className="enhanced-card p-8 max-w-6xl mx-auto">
            <div className="relative">
              {/* Placeholder for the actual product demo collage */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-12 border-2 border-dashed border-blue-300">
                <div className="text-center">
                  <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    LabGuard Pro Product Demonstration
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comprehensive platform overview with dashboard, features, and automation
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Dashboard</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Compliance</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-800">AI Analysis</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Automation</div>
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
            Try Demo Now
          </button>
        </div>
      </div>
    </section>
  )
} 
'use client'

import Image from 'next/image'
import { TrendingUp, DollarSign, Clock, Zap } from 'lucide-react'

export function ROISection() {
  const roiMetrics = [
    {
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      metric: '50%',
      description: 'average reduction in costs',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
      metric: '3x',
      description: 'increase in productivity',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      metric: '70%',
      description: 'less manual processes',
      color: 'from-purple-500 to-pink-600'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            ROI of Laboratory Automation
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your laboratory operations with AI-powered automation that delivers measurable results
          </p>
        </div>

        {/* ROI Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {roiMetrics.map((item, index) => (
            <div key={index} className="enhanced-card text-center p-8">
              <div className="flex justify-center mb-4">
                {item.icon}
              </div>
              <div className={`text-5xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}>
                {item.metric}
              </div>
              <p className="text-gray-300 text-lg">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* ROI Infographic */}
        <div className="text-center">
          <div className="enhanced-card p-8 max-w-4xl mx-auto">
            <div className="relative">
              {/* Placeholder for the actual infographic image */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-12 border-2 border-dashed border-blue-300">
                <div className="text-center">
                  <Zap className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    ROI Automation Infographic
                  </h3>
                  <p className="text-gray-600">
                    Visual representation of laboratory automation benefits
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">50%</div>
                      <div className="text-sm text-gray-600">Cost Reduction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">3x</div>
                      <div className="text-sm text-gray-600">Productivity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">70%</div>
                      <div className="text-sm text-gray-600">Less Manual Work</div>
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
            Calculate Your ROI
          </button>
        </div>
      </div>
    </section>
  )
} 
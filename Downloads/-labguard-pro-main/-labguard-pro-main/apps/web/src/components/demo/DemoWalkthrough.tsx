'use client'

import React, { useState } from 'react'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  ArrowRight,
  Sparkles,
  Brain,
  Shield,
  Zap,
  Target,
  CheckCircle,
  Clock,
  Users,
  BarChart3
} from 'lucide-react'
import { motion } from 'framer-motion'

export function DemoWalkthrough() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      id: 1,
      title: 'Welcome & Overview',
      description: 'Introduction to LabGuard Pro and its core capabilities',
      duration: '0:45',
      icon: Sparkles,
      content: 'Learn about the revolutionary AI-powered laboratory management platform that transforms how research is conducted.'
    },
    {
      id: 2,
      title: 'AI Protocol Design',
      description: 'Watch AI generate optimized experimental protocols',
      duration: '2:15',
      icon: Brain,
      content: 'See how our AI analyzes your research requirements and generates optimized experimental protocols in seconds.'
    },
    {
      id: 3,
      title: 'Compliance Monitoring',
      description: 'Real-time regulatory compliance tracking',
      duration: '1:45',
      icon: Shield,
      content: 'Experience automated compliance monitoring with real-time alerts and audit trail generation.'
    },
    {
      id: 4,
      title: 'Analytics Dashboard',
      description: 'Live data visualization and insights',
      duration: '2:30',
      icon: BarChart3,
      content: 'Explore the powerful analytics dashboard with real-time data visualization and predictive insights.'
    },
    {
      id: 5,
      title: 'Equipment Management',
      description: 'Smart device monitoring and optimization',
      duration: '1:55',
      icon: Target,
      content: 'Discover how intelligent equipment management optimizes device usage and predicts maintenance needs.'
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  return (
    <div className="py-20 bg-gradient-to-b from-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/3 to-purple-600/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">Step-by-Step Walkthrough</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Follow the{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Complete Journey
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Take a guided tour through LabGuard Pro's key features. 
            Each step builds on the previous one to show you the complete picture.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Step Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-white mb-6">Demo Steps</h3>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <motion.button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                      currentStep === index
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep === index
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                          : 'bg-white/10'
                      }`}>
                        <span className={`text-sm font-medium ${
                          currentStep === index ? 'text-white' : 'text-gray-400'
                        }`}>
                          {step.id}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          currentStep === index ? 'text-white' : 'text-gray-300'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-400">{step.duration}</div>
                      </div>
                      {currentStep === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              {/* Current Step Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Step Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <steps[currentStep].icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-blue-400 font-medium">Step {steps[currentStep].id}</div>
                    <h3 className="text-2xl font-bold text-white">{steps[currentStep].title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{steps[currentStep].duration}</span>
                      <span>•</span>
                      <span>{steps[currentStep].description}</span>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="bg-black/20 border border-white/10 rounded-lg p-6">
                  <p className="text-gray-300 leading-relaxed">{steps[currentStep].content}</p>
                </div>

                {/* Demo Video Placeholder */}
                <div className="bg-black/20 border border-white/10 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-white font-medium">{steps[currentStep].title} Demo</p>
                    <p className="text-gray-400 text-sm mt-2">{steps[currentStep].duration}</p>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentStep === 0
                        ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <SkipBack className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {currentStep + 1} of {steps.length}
                    </span>
                  </div>

                  <button
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentStep === steps.length - 1
                        ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                    }`}
                  >
                    {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center"
              >
                <div className="text-2xl font-bold text-blue-400 mb-1">{steps.length}</div>
                <div className="text-sm text-gray-400">Total Steps</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center"
              >
                <div className="text-2xl font-bold text-purple-400 mb-1">9:10</div>
                <div className="text-sm text-gray-400">Total Duration</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center"
              >
                <div className="text-2xl font-bold text-green-400 mb-1">100%</div>
                <div className="text-sm text-gray-400">Interactive</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
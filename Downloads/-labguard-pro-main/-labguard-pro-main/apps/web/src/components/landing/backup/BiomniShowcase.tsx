'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Brain, 
  Eye, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  Target,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function BiomniShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentDemo, setCurrentDemo] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const demos = [
    {
      title: 'Visual Sample Analysis',
      description: 'Upload any laboratory image for instant AI analysis',
      features: [
        'Contamination detection',
        'Quality assessment',
        'Growth pattern analysis',
        'Equipment condition monitoring'
      ],
      icon: <Eye className="w-6 h-6" />,
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'AI Protocol Generation',
      description: 'Generate experimental protocols with AI assistance',
      features: [
        'Custom protocol creation',
        'Equipment optimization',
        'Safety compliance checking',
        'Step-by-step guidance'
      ],
      icon: <Brain className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Predictive Analytics',
      description: 'Forecast equipment issues before they occur',
      features: [
        'Maintenance prediction',
        'Performance optimization',
        'Cost savings analysis',
        'Risk assessment'
      ],
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600'
    }
  ]

  const analysisResults = [
    { type: 'Sample Quality', score: 98, status: 'Excellent', color: 'text-green-600' },
    { type: 'Contamination Risk', score: 2, status: 'Low', color: 'text-green-600' },
    { type: 'Equipment Condition', score: 95, status: 'Good', color: 'text-blue-600' },
    { type: 'Compliance Status', score: 100, status: 'Compliant', color: 'text-green-600' }
  ]

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 100
          }
          return prev + 2
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const startDemo = () => {
    setIsPlaying(true)
    setAnalysisProgress(0)
  }

  const stopDemo = () => {
    setIsPlaying(false)
    setAnalysisProgress(0)
  }

  const nextDemo = () => {
    setCurrentDemo((prev) => (prev + 1) % demos.length)
    stopDemo()
  }

  const prevDemo = () => {
    setCurrentDemo((prev) => (prev - 1 + demos.length) % demos.length)
    stopDemo()
  }

  const current = demos[currentDemo]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-white/20 text-white border-white/30 mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            Industry First
          </Badge>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Experience the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Laboratory AI
            </span>
          </h2>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            LabGuard Pro is the only platform with Stanford's cutting-edge Biomni AI integration. 
            See how artificial intelligence is revolutionizing laboratory compliance and research.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Interactive Demo */}
          <div className="space-y-8">
            {/* Demo Controls */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {current.title}
                </h3>
                <div className={`w-12 h-12 bg-gradient-to-r ${current.color} rounded-xl flex items-center justify-center text-white`}>
                  {current.icon}
                </div>
              </div>
              
              <p className="text-blue-100 mb-6">
                {current.description}
              </p>

              {/* Demo Controls */}
              <div className="flex items-center space-x-4 mb-6">
                <Button
                  onClick={isPlaying ? stopDemo : startDemo}
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Stop' : 'Start'} Demo
                </Button>
                
                <Button
                  onClick={stopDemo}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-blue-200 mb-2">
                  <span>AI Analysis Progress</span>
                  <span>{analysisProgress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {current.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-blue-100">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={prevDemo}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Previous
              </Button>
              
              <div className="flex space-x-2">
                {demos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDemo(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentDemo ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                onClick={nextDemo}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Next
              </Button>
            </div>
          </div>

          {/* Right Side - Results Display */}
          <div className="space-y-6">
            {/* Analysis Results */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-4">
                AI Analysis Results
              </h4>
              
              <div className="space-y-4">
                {analysisResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        result.score >= 90 ? 'bg-green-400' :
                        result.score >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                      <span className="text-blue-100">{result.type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`font-semibold ${result.color}`}>
                        {result.score}%
                      </span>
                      <Badge className={`${
                        result.score >= 90 ? 'bg-green-100 text-green-800' :
                        result.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-4">
                AI Insights
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="text-white font-medium">Sample Quality Excellent</div>
                    <div className="text-blue-200 text-sm">No contamination detected</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <div className="text-white font-medium">Equipment Maintenance Due</div>
                    <div className="text-blue-200 text-sm">Schedule calibration within 7 days</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-white font-medium">Performance Optimized</div>
                    <div className="text-blue-200 text-sm">AI suggests efficiency improvements</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Competitive Advantage */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-6 h-6 text-yellow-300" />
                <h4 className="text-lg font-semibold text-white">
                  Stanford Biomni Technology
                </h4>
              </div>
              
              <p className="text-blue-100 text-sm mb-4">
                LabGuard Pro is the first and only laboratory platform to integrate Stanford's 
                revolutionary Biomni multimodal AI. This gives you unprecedented capabilities 
                for visual analysis and intelligent automation.
              </p>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="text-blue-100">Real-time Analysis</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4 text-yellow-300" />
                  <span className="text-blue-100">99.8% Accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Experience the Future?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join the revolution in laboratory automation. Start your free trial and see 
              how Biomni AI can transform your laboratory operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3">
                Start Free Trial
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
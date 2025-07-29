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
  Award,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export function BiomniShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentDemo, setCurrentDemo] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResults, setAnalysisResults] = useState<any[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const defaultResults = [
    { type: 'Sample Quality', score: 98, status: 'Excellent', color: 'text-green-600' },
    { type: 'Contamination Risk', score: 2, status: 'Low', color: 'text-green-600' },
    { type: 'Equipment Condition', score: 95, status: 'Good', color: 'text-blue-600' },
    { type: 'Compliance Status', score: 100, status: 'Compliant', color: 'text-green-600' }
  ]

  useEffect(() => {
    if (isPlaying && currentDemo === 0) {
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
  }, [isPlaying, currentDemo])

  const startDemo = () => {
    setIsPlaying(true)
    setAnalysisProgress(0)
    
    if (currentDemo === 0) {
      // Simulate analysis for visual demo
      setTimeout(() => {
        setAnalysisResults(defaultResults)
      }, 2000)
    }
  }

  const stopDemo = () => {
    setIsPlaying(false)
    setAnalysisProgress(0)
  }

  const nextDemo = () => {
    setCurrentDemo((prev) => (prev + 1) % demos.length)
  }

  const prevDemo = () => {
    setCurrentDemo((prev) => (prev - 1 + demos.length) % demos.length)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsAnalyzing(true)
      setAnalysisProgress(0)
      
      // Simulate analysis
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsAnalyzing(false)
            setAnalysisResults(defaultResults)
            return 100
          }
          return prev + 5
        })
      }, 100)
    }
  }

  return (
    <section className="enhanced-section relative px-6 pt-32 pb-20 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Stanford Badge */}
            <div className="inline-flex items-center space-x-2 enhanced-card px-4 py-2 rounded-full">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-medium text-gray-300">Powered by Stanford Biomni AI</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="enhanced-gradient-text leading-tight">
                AI-Powered
                <span className="block">Laboratory</span>
                <span className="block">Compliance</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                Transform your laboratory operations with Stanford's revolutionary Biomni AI. Automate compliance, streamline workflows, and ensure 100% accuracy.
              </p>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" />
                <span className="text-sm text-gray-300 font-medium">99.8% Accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                <span className="text-sm text-gray-300 font-medium">Real-time Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" />
                <span className="text-sm text-gray-300 font-medium">Stanford Research</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="enhanced-button-primary group"
              >
                Start Free Trial
                <Zap className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="enhanced-button-secondary"
              >
                Watch Demo
              </Button>
            </div>

            {/* Social Proof Numbers */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div className="enhanced-metric-card">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Laboratories</div>
              </div>
              <div className="enhanced-metric-card">
                <div className="text-2xl font-bold text-white">99.8%</div>
                <div className="text-sm text-gray-400">Accuracy Rate</div>
              </div>
              <div className="enhanced-metric-card">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400">AI Analysis</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="enhanced-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Live Demo</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">AI Analysis in Action</span>
                </div>
              </div>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center mb-6">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-white mb-2">Upload Laboratory Image</h4>
                <p className="text-gray-400 mb-4">Drag & drop or click to analyze</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="enhanced-button-secondary"
                >
                  Choose File
                </Button>
              </div>

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">AI Analysis Progress</span>
                    <span className="text-sm text-gray-300">{analysisProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Contamination detection</div>
                    <div>Quality assessment</div>
                    <div>Growth pattern analysis</div>
                    <div>Equipment condition monitoring</div>
                  </div>
                </div>
              )}

              {/* Analysis Results */}
              {analysisResults.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-white">AI Analysis Results</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {analysisResults.map((result, index) => (
                      <div key={index} className="enhanced-card p-4">
                        <div className="text-sm text-gray-400">{result.type}</div>
                        <div className="text-2xl font-bold text-white">{result.score}%</div>
                        <div className={`text-sm font-medium ${result.color}`}>{result.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 
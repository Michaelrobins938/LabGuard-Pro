'use client'

import { 
  Shield, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Brain, 
  Eye, 
  FileText,
  Zap,
  Target,
  Users,
  BarChart3,
  AlertTriangle,
  Sparkles,
  Award,
  Lock
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function BenefitsSection() {
  const benefits = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Compliance',
      description: 'Advanced AI validates calibration data in real-time, catching errors before they become costly failures.',
      stats: '95% fewer calibration errors',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Save 20+ Hours Weekly',
      description: 'Automate manual compliance tasks and paperwork, freeing your team to focus on research and patient care.',
      stats: '80% time reduction',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Prevent Costly Failures',
      description: 'Identify equipment issues early and prevent expensive breakdowns that can cost $10K+ per incident.',
      stats: '$50K+ average savings',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Audit-Ready Always',
      description: 'Generate comprehensive compliance reports instantly for CAP, CLIA, and other regulatory inspections.',
      stats: '100% audit success rate',
      color: 'from-indigo-500 to-blue-600'
    }
  ]

  const features = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Visual AI Analysis',
      description: 'Upload images for instant quality assessment, contamination detection, and equipment condition monitoring.'
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Smart Protocol Generation',
      description: 'AI creates experimental protocols tailored to your equipment and research requirements.'
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Predictive Analytics',
      description: 'Forecast equipment maintenance needs and optimize calibration schedules automatically.'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Team Collaboration',
      description: 'Centralized platform for entire lab team with role-based access and real-time updates.'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Real-time Alerts',
      description: 'Instant notifications for calibration due dates, equipment issues, and compliance violations.'
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Custom Workflows',
      description: 'Tailor compliance processes to your lab\'s specific requirements and regulatory standards.'
    }
  ]

  const stats = [
    { number: '95%', label: 'Reduction in Calibration Errors' },
    { number: '20+', label: 'Hours Saved Per Week' },
    { number: '$50K+', label: 'Average Annual Savings' },
    { number: '100%', label: 'Audit Success Rate' }
  ]

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
            Why Choose LabGuard Pro
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Transform Your Laboratory with <span className="text-blue-600">AI-Powered Compliance</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stop losing time to manual compliance tasks. Start preventing costly equipment failures. 
            LabGuard Pro combines cutting-edge AI with proven laboratory workflows.
          </p>
        </div>

        {/* Main Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="relative group">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 h-full border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {benefit.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {benefit.description}
                </p>
                
                {/* Stats */}
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="font-semibold text-gray-900">{benefit.stats}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Proven Results</h3>
            <p className="text-gray-600">Real outcomes from laboratories using LabGuard Pro</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Cutting-Edge Features
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              LabGuard Pro combines the latest AI technology with deep laboratory expertise 
              to deliver unprecedented automation and insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Advantage */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-white/20 text-white border-white/30 mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Industry First
              </Badge>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                The Only Platform with <br />
                <span className="text-yellow-300">Stanford Biomni AI Integration</span>
              </h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                LabGuard Pro is the first and only laboratory platform to integrate Stanford's 
                cutting-edge Biomni multimodal AI. This gives you unprecedented capabilities 
                for visual analysis, protocol generation, and research assistance.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-yellow-300 mr-2" />
                  <span className="text-sm">Stanford AI Technology</span>
                </div>
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-green-300 mr-2" />
                  <span className="text-sm">Enterprise Security</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="font-semibold mb-4">Biomni AI Capabilities:</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-300 mr-3" />
                  <span className="text-sm">Visual sample quality assessment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-300 mr-3" />
                  <span className="text-sm">Automated contamination detection</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-300 mr-3" />
                  <span className="text-sm">Equipment condition monitoring</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-300 mr-3" />
                  <span className="text-sm">AI-powered protocol generation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-300 mr-3" />
                  <span className="text-sm">Research data analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Calculator Preview */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Calculate Your Savings
            </h3>
            <p className="text-gray-600">
              See how much LabGuard Pro can save your laboratory
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">$25K</div>
              <div className="text-sm text-gray-600">Average Equipment Failure Cost</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">20 hrs</div>
              <div className="text-sm text-gray-600">Weekly Compliance Time Saved</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Reduction in Calibration Errors</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
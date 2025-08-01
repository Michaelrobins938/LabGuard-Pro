'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Users,
  Database,
  Zap,
  ArrowRight,
  Play,
  Sparkles,
  Globe,
  Code,
  Microscope,
  Beaker,
  TestTube,
  Crown,
  Lock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  Instagram,
  FlaskConical,
  Award,
  FileText,
  Calendar as CalendarIcon,
  Star,
  Settings,
  Activity,
  Shield,
  FileText as FileTextIcon,
  PieChart,
  LineChart,
  BarChart,
  ScatterChart
} from 'lucide-react'

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const analyticsFeatures = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Advanced machine learning algorithms that analyze laboratory data to provide actionable insights and predictions.",
      benefits: ["Predictive analytics", "Pattern recognition", "Anomaly detection", "Trend forecasting"]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-Time Dashboards",
      description: "Comprehensive dashboards with real-time data visualization and interactive reporting capabilities.",
      benefits: ["Live data feeds", "Interactive charts", "Customizable views", "Mobile responsive"]
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Performance Optimization",
      description: "Data-driven recommendations for laboratory optimization, efficiency improvements, and cost reduction.",
      benefits: ["Efficiency metrics", "Cost analysis", "Resource optimization", "ROI tracking"]
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Predictive Analytics",
      description: "Forecast future trends, equipment failures, and resource needs based on historical data analysis.",
      benefits: ["Failure prediction", "Demand forecasting", "Capacity planning", "Risk assessment"]
    }
  ]

  const analyticsTypes = [
    {
      name: "Operational Analytics",
      examples: ["Equipment utilization", "Workflow efficiency", "Resource allocation", "Process optimization"],
      icon: <Activity className="w-6 h-6" />
    },
    {
      name: "Financial Analytics",
      examples: ["Cost analysis", "Budget tracking", "ROI calculations", "Expense optimization"],
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      name: "Compliance Analytics",
      examples: ["Regulatory tracking", "Audit readiness", "Risk assessment", "Compliance scoring"],
      icon: <Shield className="w-6 h-6" />
    },
    {
      name: "Research Analytics",
      examples: ["Experimental data", "Publication metrics", "Collaboration analysis", "Impact assessment"],
      icon: <Beaker className="w-6 h-6" />
    }
  ]

  const analyticsMetrics = [
    {
      metric: "85%",
      label: "Efficiency Gain",
      description: "Average improvement in laboratory efficiency"
    },
    {
      metric: "30%",
      label: "Cost Reduction",
      description: "Average reduction in operational costs"
    },
    {
      metric: "99.9%",
      label: "Data Accuracy",
      description: "Accuracy rate of predictive analytics"
    },
    {
      metric: "24/7",
      label: "Monitoring",
      description: "Continuous analytics monitoring"
    }
  ]

  const analyticsWorkflows = [
    {
      step: "1",
      title: "Data Collection",
      description: "Automated collection of laboratory data from equipment, processes, and systems",
      duration: "Real-time",
      icon: <Database className="w-5 h-5" />
    },
    {
      step: "2",
      title: "Data Processing",
      description: "AI-powered processing and analysis of collected data for pattern recognition",
      duration: "Continuous",
      icon: <Brain className="w-5 h-5" />
    },
    {
      step: "3",
      title: "Insight Generation",
      description: "Generation of actionable insights and recommendations based on analysis",
      duration: "Automated",
      icon: <Target className="w-5 h-5" />
    },
    {
      step: "4",
      title: "Action Implementation",
      description: "Implementation of recommendations and tracking of outcomes",
      duration: "Ongoing",
      icon: <CheckCircle className="w-5 h-5" />
    }
  ]

  const testimonials = [
    {
      name: "Dr. Lisa Thompson",
      role: "Laboratory Director",
      organization: "Merck Research Labs",
      quote: "LabGuard Pro's analytics have transformed our decision-making process. We've achieved 85% efficiency gains and 30% cost reductions through data-driven optimization.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Operations Manager",
      organization: "Genentech",
      quote: "The predictive analytics and real-time dashboards have given us unprecedented visibility into our laboratory operations. We can now make proactive decisions.",
      rating: 5
    },
    {
      name: "Dr. Amanda Foster",
      role: "Research Coordinator",
      organization: "MIT Research Institute",
      quote: "The AI-powered insights have revolutionized our research analytics. We can now track experimental outcomes and optimize our research processes effectively.",
      rating: 5
    }
  ]

  const analyticsBenefits = [
    {
      category: "Operational Excellence",
      benefits: ["Process optimization", "Resource efficiency", "Workflow automation", "Performance tracking"]
    },
    {
      category: "Financial Intelligence",
      benefits: ["Cost optimization", "Budget management", "ROI analysis", "Expense tracking"]
    },
    {
      category: "Strategic Planning",
      benefits: ["Predictive modeling", "Capacity planning", "Risk assessment", "Trend analysis"]
    },
    {
      category: "Research Enhancement",
      benefits: ["Data insights", "Experimental optimization", "Collaboration metrics", "Impact assessment"]
    }
  ]

  const chartTypes = [
    {
      name: "Real-Time Dashboards",
      description: "Live data visualization with interactive charts and customizable views",
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      name: "Predictive Models",
      description: "AI-powered forecasting and trend prediction for strategic planning",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      name: "Performance Metrics",
      description: "Comprehensive KPIs and performance indicators for laboratory optimization",
      icon: <Target className="w-6 h-6" />
    },
    {
      name: "Compliance Reports",
      description: "Automated compliance tracking and regulatory reporting capabilities",
      icon: <Shield className="w-6 h-6" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Advanced Analytics</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              Advanced{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Analytics
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              AI-powered insights and predictive analytics for laboratory optimization and decision-making. 
              Transform your laboratory data into actionable intelligence with advanced machine learning.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                🤖 AI-Powered Insights
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
                📊 Real-Time Dashboards
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                🔮 Predictive Analytics
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <BarChart3 className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Analytics{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive analytics tools designed for modern laboratory intelligence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {analyticsFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Types Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Analytics{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Types
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive analytics solutions for all aspects of laboratory operations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    {type.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{type.name}</h3>
                  <div className="space-y-1">
                    {type.examples.map((example, i) => (
                      <div key={i} className="text-xs text-gray-400">• {example}</div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Analytics{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Metrics
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Proven results from laboratories using LabGuard Pro analytics
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{metric.metric}</div>
                <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
                <div className="text-xs text-gray-500">{metric.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chart Types Section */}
      <section className="py-20 bg-gradient-to-b from-blue-900 to-slate-900 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Analytics{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Visualizations
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful data visualization tools for comprehensive laboratory insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {chartTypes.map((chart, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    {chart.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{chart.name}</h3>
                  <p className="text-gray-300 text-sm">{chart.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Analytics{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Workflow
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Streamlined analytics process from data collection to actionable insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsWorkflows.map((workflow, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{workflow.step}</span>
                  </div>
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                    {workflow.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{workflow.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{workflow.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {workflow.duration}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Analytics{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Benefits
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive benefits across all aspects of laboratory analytics
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsBenefits.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-4">{category.category}</h3>
                  <div className="space-y-2">
                    {category.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              What Our{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Customers Say
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real feedback from laboratory professionals using LabGuard Pro analytics
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-xs text-gray-500">{testimonial.organization}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-blue-900 to-slate-900 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Transform Your Data?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of laboratories that have transformed their operations 
              with LabGuard Pro's AI-powered analytics and insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <BarChart3 className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <FileText className="w-5 h-5 mr-2" />
                Download Brochure
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Microscope, 
  Wrench, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  BarChart3,
  Users,
  Database,
  Zap,
  Target,
  ArrowRight,
  Play,
  Sparkles,
  Globe,
  Code,
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
  FileText as FileTextIcon
} from 'lucide-react'

export function EquipmentPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const equipmentFeatures = [
    {
      icon: <Microscope className="w-6 h-6" />,
      title: "Comprehensive Tracking",
      description: "Complete equipment lifecycle management from acquisition to retirement with detailed asset tracking.",
      benefits: ["Asset registration", "Location tracking", "Usage history", "Performance metrics"]
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Maintenance Scheduling",
      description: "Automated maintenance scheduling with predictive analytics to prevent equipment failures.",
      benefits: ["Preventive maintenance", "Predictive analytics", "Service history", "Parts inventory"]
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Calibration Management",
      description: "Automated calibration tracking with alerts and compliance validation for regulatory requirements.",
      benefits: ["Calibration scheduling", "Compliance tracking", "Certificate management", "Drift analysis"]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Advanced analytics and reporting tools to optimize equipment utilization and performance.",
      benefits: ["Utilization metrics", "Performance trends", "Cost analysis", "ROI tracking"]
    }
  ]

  const equipmentTypes = [
    {
      name: "Analytical Instruments",
      examples: ["HPLC", "GC", "Mass Spectrometers", "Spectrophotometers"],
      icon: <Microscope className="w-6 h-6" />
    },
    {
      name: "Laboratory Equipment",
      examples: ["Centrifuges", "Incubators", "Autoclaves", "Fume Hoods"],
      icon: <Beaker className="w-6 h-6" />
    },
    {
      name: "Measurement Devices",
      examples: ["pH Meters", "Balances", "Thermometers", "Pressure Gauges"],
      icon: <Target className="w-6 h-6" />
    },
    {
      name: "Safety Equipment",
      examples: ["Fire Extinguishers", "Safety Showers", "Ventilation Systems", "PPE"],
      icon: <Shield className="w-6 h-6" />
    }
  ]

  const equipmentMetrics = [
    {
      metric: "95%",
      label: "Uptime",
      description: "Average equipment availability"
    },
    {
      metric: "40%",
      label: "Cost Reduction",
      description: "Reduction in maintenance costs"
    },
    {
      metric: "100%",
      label: "Compliance",
      description: "Calibration compliance rate"
    },
    {
      metric: "24/7",
      label: "Monitoring",
      description: "Continuous equipment monitoring"
    }
  ]

  const maintenanceWorkflows = [
    {
      step: "1",
      title: "Equipment Registration",
      description: "Register equipment with specifications, location, and maintenance requirements",
      duration: "5 minutes",
      icon: <Microscope className="w-5 h-5" />
    },
    {
      step: "2",
      title: "Automated Monitoring",
      description: "Continuous monitoring of equipment status, performance, and maintenance needs",
      duration: "24/7",
      icon: <Activity className="w-5 h-5" />
    },
    {
      step: "3",
      title: "Predictive Maintenance",
      description: "AI-powered predictions for maintenance needs and potential failures",
      duration: "Real-time",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      step: "4",
      title: "Service Management",
      description: "Automated service scheduling, tracking, and documentation",
      duration: "Automated",
      icon: <Wrench className="w-5 h-5" />
    }
  ]

  const testimonials = [
    {
      name: "Dr. James Wilson",
      role: "Laboratory Manager",
      organization: "Johnson Research Institute",
      quote: "LabGuard Pro's equipment management has revolutionized our laboratory operations. We've reduced equipment downtime by 60% and maintenance costs by 40%.",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Quality Assurance Director",
      organization: "BioTech Solutions",
      quote: "The automated calibration tracking and compliance management have eliminated our regulatory concerns. Everything is always audit-ready.",
      rating: 5
    },
    {
      name: "Dr. Robert Chen",
      role: "Research Director",
      organization: "Stanford Research Labs",
      quote: "The predictive maintenance and performance analytics have optimized our equipment utilization significantly. ROI has been exceptional.",
      rating: 5
    }
  ]

  const equipmentBenefits = [
    {
      category: "Operational Efficiency",
      benefits: ["Reduced downtime", "Optimized utilization", "Streamlined workflows", "Automated processes"]
    },
    {
      category: "Cost Management",
      benefits: ["Lower maintenance costs", "Extended equipment life", "Reduced energy consumption", "Better resource allocation"]
    },
    {
      category: "Compliance & Safety",
      benefits: ["Regulatory compliance", "Safety monitoring", "Audit readiness", "Risk mitigation"]
    },
    {
      category: "Data & Analytics",
      benefits: ["Performance insights", "Predictive analytics", "Historical tracking", "Decision support"]
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
              <Microscope className="w-4 h-4" />
              <span className="text-sm font-medium">Equipment Management</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              Equipment{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Comprehensive laboratory equipment tracking with maintenance scheduling and calibration alerts. 
              Optimize your equipment lifecycle with AI-powered insights and predictive maintenance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                🔧 Predictive Maintenance
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
                ⚡ Real-Time Monitoring
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                📊 Performance Analytics
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Microscope className="w-5 h-5 mr-2" />
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
              Equipment{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive equipment management tools designed for modern laboratories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {equipmentFeatures.map((feature, index) => (
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

      {/* Equipment Types Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Equipment{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Types
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive support for all types of laboratory equipment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipmentTypes.map((type, index) => (
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
              Equipment{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Metrics
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Proven results from laboratories using LabGuard Pro equipment management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipmentMetrics.map((metric, index) => (
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

      {/* Workflow Section */}
      <section className="py-20 bg-gradient-to-b from-blue-900 to-slate-900 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Equipment{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Workflow
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Streamlined equipment management process from registration to maintenance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {maintenanceWorkflows.map((workflow, index) => (
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
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Equipment{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Benefits
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive benefits across all aspects of equipment management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipmentBenefits.map((category, index) => (
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
      <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative z-10">
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
              Real feedback from laboratory professionals using LabGuard Pro equipment management
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
      <section className="py-20 relative z-10">
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
                Optimize Equipment?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of laboratories that have transformed their equipment management 
              with LabGuard Pro's AI-powered automation and predictive maintenance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Microscope className="w-5 h-5 mr-2" />
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
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Clock, 
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
  FileText as FileTextIcon,
  Calendar as CalendarIcon,
  Star
} from 'lucide-react'

export function CompliancePage() {
  const [activeTab, setActiveTab] = useState('overview')

  const complianceFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Real-Time Monitoring",
      description: "Continuous compliance monitoring with instant alerts and notifications for any violations or deviations.",
      benefits: ["24/7 automated monitoring", "Instant violation alerts", "Proactive issue detection", "Real-time status updates"]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Audit Trail Generation",
      description: "Comprehensive audit trails with detailed documentation for regulatory inspections and compliance reporting.",
      benefits: ["Complete activity logs", "Regulatory documentation", "Inspection-ready reports", "Historical compliance data"]
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "AI-Powered Validation",
      description: "Advanced AI algorithms that automatically validate procedures, protocols, and compliance requirements.",
      benefits: ["Automated validation", "Error detection", "Best practice enforcement", "Continuous improvement"]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Compliance Analytics",
      description: "Advanced analytics and reporting tools to track compliance metrics and identify improvement opportunities.",
      benefits: ["Performance metrics", "Trend analysis", "Risk assessment", "Compliance scoring"]
    }
  ]

  const regulatoryFrameworks = [
    {
      name: "FDA GMP",
      description: "Good Manufacturing Practice regulations for pharmaceutical and medical device manufacturing",
      requirements: ["Documentation control", "Quality management", "Equipment validation", "Personnel training"],
      icon: <Shield className="w-6 h-6" />
    },
    {
      name: "ISO 17025",
      description: "General requirements for the competence of testing and calibration laboratories",
      requirements: ["Management system", "Technical competence", "Quality assurance", "Measurement traceability"],
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      name: "CLIA",
      description: "Clinical Laboratory Improvement Amendments for clinical laboratory testing",
      requirements: ["Quality control", "Proficiency testing", "Personnel qualifications", "Documentation"],
      icon: <FileText className="w-6 h-6" />
    },
    {
      name: "EPA",
      description: "Environmental Protection Agency regulations for environmental testing laboratories",
      requirements: ["Method validation", "Quality assurance", "Data integrity", "Reporting requirements"],
      icon: <Globe className="w-6 h-6" />
    }
  ]

  const complianceMetrics = [
    {
      metric: "99.9%",
      label: "Compliance Rate",
      description: "Average compliance rate across all monitored laboratories"
    },
    {
      metric: "60%",
      label: "Time Saved",
      description: "Reduction in compliance management time"
    },
    {
      metric: "24/7",
      label: "Monitoring",
      description: "Continuous automated compliance monitoring"
    },
    {
      metric: "100%",
      label: "Audit Ready",
      description: "Always prepared for regulatory inspections"
    }
  ]

  const complianceWorkflows = [
    {
      step: "1",
      title: "Setup & Configuration",
      description: "Configure compliance requirements, regulatory frameworks, and monitoring parameters",
      duration: "1-2 days",
      icon: <Shield className="w-5 h-5" />
    },
    {
      step: "2",
      title: "Automated Monitoring",
      description: "Continuous monitoring of equipment, procedures, and personnel compliance",
      duration: "Ongoing",
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      step: "3",
      title: "Issue Detection",
      description: "AI-powered detection of compliance violations and potential risks",
      duration: "Real-time",
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      step: "4",
      title: "Documentation & Reporting",
      description: "Automatic generation of audit trails and compliance reports",
      duration: "Automated",
      icon: <FileText className="w-5 h-5" />
    }
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Laboratory Director",
      organization: "Stanford Medical Center",
      quote: "LabGuard Pro's compliance automation has transformed our laboratory operations. We've reduced compliance management time by 70% while improving our audit readiness.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Quality Manager",
      organization: "PharmaTech Labs",
      quote: "The AI-powered validation and real-time monitoring have given us unprecedented confidence in our compliance status. Regulatory inspections are now stress-free.",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      role: "Research Director",
      organization: "MIT Research Labs",
      quote: "The comprehensive audit trails and automated documentation have streamlined our research compliance requirements significantly.",
      rating: 5
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
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Compliance Automation</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              Automated{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Compliance
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Streamline your laboratory compliance with AI-powered validation, real-time monitoring, 
              and comprehensive audit trail generation. Stay compliant 24/7 with automated regulatory oversight.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                ✅ 99.9% Compliance Rate
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
                ⚡ Real-Time Monitoring
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                🤖 AI-Powered Validation
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Shield className="w-5 h-5 mr-2" />
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
              Compliance{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive compliance automation tools designed for modern laboratories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {complianceFeatures.map((feature, index) => (
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

      {/* Regulatory Frameworks Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Regulatory{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Frameworks
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive support for major regulatory frameworks and compliance standards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regulatoryFrameworks.map((framework, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    {framework.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{framework.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{framework.description}</p>
                  <div className="space-y-1">
                    {framework.requirements.map((requirement, i) => (
                      <div key={i} className="text-xs text-gray-400">• {requirement}</div>
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
              Compliance{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Metrics
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Proven results from laboratories using LabGuard Pro compliance automation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceMetrics.map((metric, index) => (
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
              Compliance{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Workflow
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Streamlined compliance process from setup to continuous monitoring
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceWorkflows.map((workflow, index) => (
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
              Real feedback from laboratory professionals using LabGuard Pro compliance automation
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
                <p className="text-gray-300 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
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
                Automate Compliance?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of laboratories that have transformed their compliance management 
              with LabGuard Pro's AI-powered automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Shield className="w-5 h-5 mr-2" />
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
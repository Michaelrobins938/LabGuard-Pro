'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Microscope, 
  Brain, 
  TrendingUp, 
  Shield, 
  Users, 
  Award, 
  Globe, 
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  BarChart3,
  FileText,
  Settings,
  Sparkles,
  Target,
  Clock,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

interface ResearchFeature {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  benefits: string[]
  category: 'automation' | 'compliance' | 'analytics' | 'collaboration'
}

interface Testimonial {
  id: string
  name: string
  role: string
  institution: string
  content: string
  rating: number
  avatar: string
}

interface ResearchCaseStudy {
  id: string
  title: string
  description: string
  institution: string
  results: {
    efficiency: string
    accuracy: string
    timeSaved: string
    costReduction: string
  }
  image: string
}

export default function ResearchLabsPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const features: ResearchFeature[] = [
    {
      id: 'ai-protocol-design',
      title: 'AI-Powered Protocol Design',
      description: 'Generate optimized research protocols using advanced AI algorithms',
      icon: Brain,
      category: 'automation',
      benefits: [
        'Reduce protocol design time by 80%',
        'Ensure regulatory compliance automatically',
        'Optimize resource allocation',
        'Generate reproducible methods'
      ]
    },
    {
      id: 'automated-compliance',
      title: 'Automated Compliance Monitoring',
      description: 'Real-time monitoring of research compliance across all protocols',
      icon: Shield,
      category: 'compliance',
      benefits: [
        '100% compliance rate maintained',
        'Automated audit trail generation',
        'Real-time violation alerts',
        'Regulatory framework integration'
      ]
    },
    {
      id: 'advanced-analytics',
      title: 'Advanced Research Analytics',
      description: 'Comprehensive data analysis and visualization for research insights',
      icon: BarChart3,
      category: 'analytics',
      benefits: [
        'Multi-dimensional data analysis',
        'Predictive modeling capabilities',
        'Custom report generation',
        'Real-time performance metrics'
      ]
    },
    {
      id: 'collaborative-platform',
      title: 'Collaborative Research Platform',
      description: 'Seamless collaboration tools for research teams and institutions',
      icon: Users,
      category: 'collaboration',
      benefits: [
        'Multi-institution collaboration',
        'Secure data sharing protocols',
        'Version control for protocols',
        'Integrated communication tools'
      ]
    }
  ]

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      role: 'Principal Investigator',
      institution: 'Stanford University',
      content: 'LabGuard Pro has revolutionized our research workflow. The AI-powered protocol design has reduced our setup time by 80% while maintaining the highest standards of accuracy.',
      rating: 5,
      avatar: '/avatars/sarah-chen.jpg'
    },
    {
      id: '2',
      name: 'Prof. Michael Rodriguez',
      role: 'Research Director',
      institution: 'MIT Research Labs',
      content: 'The automated compliance monitoring ensures we never miss regulatory requirements. It\'s like having a dedicated compliance officer working 24/7.',
      rating: 5,
      avatar: '/avatars/michael-rodriguez.jpg'
    },
    {
      id: '3',
      name: 'Dr. Emily Watson',
      role: 'Laboratory Manager',
      institution: 'Harvard Medical School',
      content: 'The collaborative features have transformed how we work with partner institutions. Data sharing is seamless and secure.',
      rating: 5,
      avatar: '/avatars/emily-watson.jpg'
    }
  ]

  const caseStudies: ResearchCaseStudy[] = [
    {
      id: 'stanford-genomics',
      title: 'Stanford Genomics Research Initiative',
      description: 'Large-scale genomic research project involving multiple laboratories and institutions',
      institution: 'Stanford University',
      results: {
        efficiency: '85% improvement',
        accuracy: '99.9% accuracy rate',
        timeSaved: '60% reduction in setup time',
        costReduction: '40% operational cost savings'
      },
      image: '/case-studies/stanford-genomics.jpg'
    },
    {
      id: 'mit-biotech',
      title: 'MIT Biotechnology Research Program',
      description: 'Advanced biotechnology research with complex protocol requirements',
      institution: 'Massachusetts Institute of Technology',
      results: {
        efficiency: '90% workflow optimization',
        accuracy: '100% compliance rate',
        timeSaved: '70% faster protocol execution',
        costReduction: '50% resource optimization'
      },
      image: '/case-studies/mit-biotech.jpg'
    },
    {
      id: 'harvard-medical',
      title: 'Harvard Medical Research Collaboration',
      description: 'Multi-institution medical research project with strict regulatory requirements',
      institution: 'Harvard Medical School',
      results: {
        efficiency: '75% collaboration efficiency',
        accuracy: '99.8% data accuracy',
        timeSaved: '65% reduced coordination time',
        costReduction: '45% collaborative cost savings'
      },
      image: '/case-studies/harvard-medical.jpg'
    }
  ]

  const pricingPlans = [
    {
      name: 'Research Starter',
      price: '$299',
      period: '/month',
      description: 'Perfect for small research teams and individual investigators',
      features: [
        'AI Protocol Design (10 protocols/month)',
        'Basic Compliance Monitoring',
        'Standard Analytics Dashboard',
        'Email Support',
        'Up to 5 team members'
      ],
      popular: false
    },
    {
      name: 'Research Professional',
      price: '$599',
      period: '/month',
      description: 'Ideal for medium-sized research institutions and departments',
      features: [
        'Unlimited AI Protocol Design',
        'Advanced Compliance Monitoring',
        'Comprehensive Analytics Suite',
        'Priority Support',
        'Up to 25 team members',
        'Multi-institution Collaboration',
        'Custom Report Generation'
      ],
      popular: true
    },
    {
      name: 'Research Enterprise',
      price: '$1,299',
      period: '/month',
      description: 'For large research institutions and multi-site collaborations',
      features: [
        'Everything in Professional',
        'Unlimited Team Members',
        'Custom AI Model Training',
        'Dedicated Account Manager',
        'On-premise Deployment Options',
        'Advanced Security Features',
        'Custom Integration Development'
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Microscope className="w-4 h-4 mr-2" />
            Research Laboratories
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Transform Your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Research
            </span>{' '}
            with AI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Accelerate breakthrough discoveries with AI-powered laboratory management. 
            Streamline protocols, ensure compliance, and collaborate seamlessly across institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Users className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-300">Research Institutions</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">10,000+</div>
              <div className="text-gray-300">Protocols Generated</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-300">Compliance Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">80%</div>
              <div className="text-gray-300">Time Saved</div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Why Research Labs Choose LabGuard Pro</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Accelerated Research</h3>
                      <p className="text-gray-300">AI-powered protocol design reduces setup time by 80% while maintaining the highest standards of accuracy and reproducibility.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
                      <Shield className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Regulatory Compliance</h3>
                      <p className="text-gray-300">Automated compliance monitoring ensures 100% adherence to regulatory requirements across all research protocols.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mt-1">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Collaborative Excellence</h3>
                      <p className="text-gray-300">Seamless collaboration tools enable multi-institution research projects with secure data sharing and version control.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Research Workflow Optimization</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Protocol Design</span>
                    <span className="text-green-400">80% faster</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Compliance Monitoring</span>
                    <span className="text-blue-400">100% automated</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Data Analysis</span>
                    <span className="text-purple-400">90% more insights</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <Card key={feature.id} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{feature.title}</CardTitle>
                        <CardDescription className="text-gray-300">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="case-studies" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {caseStudies.map((study) => (
                <Card key={study.id} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white">{study.title}</CardTitle>
                    <CardDescription className="text-gray-300">{study.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Globe className="w-4 h-4" />
                        {study.institution}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-400">Efficiency</div>
                          <div className="text-sm font-semibold text-green-400">{study.results.efficiency}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Accuracy</div>
                          <div className="text-sm font-semibold text-blue-400">{study.results.accuracy}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Time Saved</div>
                          <div className="text-sm font-semibold text-purple-400">{study.results.timeSaved}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Cost Reduction</div>
                          <div className="text-sm font-semibold text-cyan-400">{study.results.costReduction}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {pricingPlans.map((plan) => (
                <Card key={plan.name} className={`bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <CardTitle className="text-white">{plan.name}</CardTitle>
                      {plan.popular && (
                        <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                      )}
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400">{plan.period}</span>
                    </div>
                    <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Trusted by Leading Research Institutions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}, {testimonial.institution}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Research?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of research institutions already using LabGuard Pro to accelerate their discoveries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Users className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 
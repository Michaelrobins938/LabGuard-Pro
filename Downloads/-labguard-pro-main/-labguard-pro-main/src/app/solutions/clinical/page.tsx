'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
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
  DollarSign,
  Heart,
  Microscope,
  AlertTriangle,
  Clipboard
} from 'lucide-react'
import Link from 'next/link'

interface ClinicalFeature {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  benefits: string[]
  category: 'diagnostics' | 'compliance' | 'analytics' | 'patient-care'
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

interface ClinicalCaseStudy {
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

export default function ClinicalLabsPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const features: ClinicalFeature[] = [
    {
      id: 'ai-diagnostics',
      title: 'AI-Powered Diagnostics',
      description: 'Advanced diagnostic algorithms for accurate and rapid test results',
      icon: Brain,
      category: 'diagnostics',
      benefits: [
        '99.9% diagnostic accuracy',
        'Real-time result analysis',
        'Automated quality control',
        'Predictive diagnostics'
      ]
    },
    {
      id: 'regulatory-compliance',
      title: 'Regulatory Compliance',
      description: 'Comprehensive compliance monitoring for clinical laboratory standards',
      icon: Shield,
      category: 'compliance',
      benefits: [
        'CLIA compliance automation',
        'CAP accreditation support',
        'Real-time audit trails',
        'Regulatory reporting'
      ]
    },
    {
      id: 'patient-analytics',
      title: 'Patient Analytics',
      description: 'Comprehensive patient data analysis and trend identification',
      icon: BarChart3,
      category: 'analytics',
      benefits: [
        'Patient outcome tracking',
        'Trend analysis and prediction',
        'Custom report generation',
        'Population health insights'
      ]
    },
    {
      id: 'patient-care',
      title: 'Enhanced Patient Care',
      description: 'Streamlined patient care coordination and result delivery',
      icon: Heart,
      category: 'patient-care',
      benefits: [
        'Rapid result delivery',
        'Patient portal integration',
        'Care team coordination',
        'Automated notifications'
      ]
    }
  ]

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Dr. Jennifer Martinez',
      role: 'Laboratory Director',
      institution: 'Mayo Clinic',
      content: 'LabGuard Pro has transformed our clinical operations. The AI-powered diagnostics have improved our accuracy to 99.9% while reducing turnaround time by 60%.',
      rating: 5,
      avatar: '/avatars/jennifer-martinez.jpg'
    },
    {
      id: '2',
      name: 'Dr. Robert Chen',
      role: 'Chief Medical Officer',
      institution: 'Cleveland Clinic',
      content: 'The regulatory compliance features ensure we maintain the highest standards. Our CAP accreditation process was streamlined significantly.',
      rating: 5,
      avatar: '/avatars/robert-chen.jpg'
    },
    {
      id: '3',
      name: 'Dr. Sarah Williams',
      role: 'Clinical Laboratory Manager',
      institution: 'Johns Hopkins Hospital',
      content: 'Patient care has improved dramatically with faster result delivery and better coordination between our lab and care teams.',
      rating: 5,
      avatar: '/avatars/sarah-williams.jpg'
    }
  ]

  const caseStudies: ClinicalCaseStudy[] = [
    {
      id: 'mayo-clinic',
      title: 'Mayo Clinic Diagnostic Excellence',
      description: 'Large-scale clinical laboratory serving multiple specialties with high-volume testing',
      institution: 'Mayo Clinic',
      results: {
        efficiency: '90% improvement',
        accuracy: '99.9% accuracy rate',
        timeSaved: '60% faster results',
        costReduction: '45% operational savings'
      },
      image: '/case-studies/mayo-clinic.jpg'
    },
    {
      id: 'cleveland-clinic',
      title: 'Cleveland Clinic Quality Initiative',
      description: 'Comprehensive quality improvement program across multiple laboratory locations',
      institution: 'Cleveland Clinic',
      results: {
        efficiency: '85% workflow optimization',
        accuracy: '100% compliance rate',
        timeSaved: '70% reduced errors',
        costReduction: '50% quality improvement'
      },
      image: '/case-studies/cleveland-clinic.jpg'
    },
    {
      id: 'johns-hopkins',
      title: 'Johns Hopkins Patient Care',
      description: 'Enhanced patient care coordination with rapid diagnostic capabilities',
      institution: 'Johns Hopkins Hospital',
      results: {
        efficiency: '80% care coordination',
        accuracy: '99.8% diagnostic accuracy',
        timeSaved: '65% faster care delivery',
        costReduction: '40% patient satisfaction'
      },
      image: '/case-studies/johns-hopkins.jpg'
    }
  ]

  const pricingPlans = [
    {
      name: 'Clinical Starter',
      price: '$399',
      period: '/month',
      description: 'Perfect for small clinical laboratories and medical practices',
      features: [
        'AI Diagnostics (100 tests/month)',
        'Basic Compliance Monitoring',
        'Standard Patient Analytics',
        'Email Support',
        'Up to 10 team members'
      ],
      popular: false
    },
    {
      name: 'Clinical Professional',
      price: '$799',
      period: '/month',
      description: 'Ideal for medium-sized clinical laboratories and hospital systems',
      features: [
        'Unlimited AI Diagnostics',
        'Advanced Compliance Monitoring',
        'Comprehensive Patient Analytics',
        'Priority Support',
        'Up to 50 team members',
        'Patient Portal Integration',
        'Custom Report Generation'
      ],
      popular: true
    },
    {
      name: 'Clinical Enterprise',
      price: '$1,599',
      period: '/month',
      description: 'For large hospital systems and multi-site clinical operations',
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
          <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
            <Activity className="w-4 h-4 mr-2" />
            Clinical Laboratories
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Elevate Your{' '}
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Clinical Care
            </span>{' '}
            with AI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform clinical laboratory operations with AI-powered diagnostics and compliance. 
            Deliver faster, more accurate results while maintaining the highest standards of patient care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
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
              <div className="text-3xl font-bold text-green-400 mb-2">1,000+</div>
              <div className="text-gray-300">Clinical Labs</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">50M+</div>
              <div className="text-gray-300">Tests Processed</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-gray-300">Diagnostic Accuracy</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">60%</div>
              <div className="text-gray-300">Faster Results</div>
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
                <h2 className="text-3xl font-bold text-white mb-6">Why Clinical Labs Choose LabGuard Pro</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mt-1">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Diagnostic Excellence</h3>
                      <p className="text-gray-300">AI-powered diagnostics achieve 99.9% accuracy while reducing turnaround time by 60% for faster patient care.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Regulatory Excellence</h3>
                      <p className="text-gray-300">Automated compliance monitoring ensures 100% adherence to CLIA, CAP, and other regulatory requirements.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
                      <Heart className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Patient Care Enhancement</h3>
                      <p className="text-gray-300">Streamlined patient care coordination with rapid result delivery and enhanced care team communication.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Clinical Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Diagnostic Accuracy</span>
                    <span className="text-green-400">99.9%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Result Turnaround</span>
                    <span className="text-blue-400">60% faster</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Compliance Rate</span>
                    <span className="text-purple-400">100% automated</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
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
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-green-400" />
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
                <Card key={plan.name} className={`bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 ${plan.popular ? 'ring-2 ring-green-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <CardTitle className="text-white">{plan.name}</CardTitle>
                      {plan.popular && (
                        <Badge className="bg-green-500 text-white">Most Popular</Badge>
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
                    <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
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
          <h2 className="text-3xl font-bold text-white text-center mb-8">Trusted by Leading Clinical Institutions</h2>
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
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-400" />
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Elevate Your Clinical Care?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of clinical laboratories already using LabGuard Pro to deliver faster, more accurate patient care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
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
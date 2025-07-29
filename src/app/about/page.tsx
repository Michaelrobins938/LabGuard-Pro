'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Award, 
  Globe, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  Star,
  BarChart3,
  Shield,
  Brain,
  Target,
  Clock,
  DollarSign,
  Heart,
  Zap,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Dr. Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former Stanford AI researcher with 15+ years in laboratory automation. Led breakthrough research in AI-powered laboratory management.',
      avatar: '/team/sarah-chen.jpg',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Google engineer specializing in large-scale data systems. Built infrastructure for processing millions of laboratory data points.',
      avatar: '/team/michael-rodriguez.jpg',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'VP of Product',
      bio: 'Former laboratory director with deep expertise in clinical workflows. Passionate about making AI accessible to lab professionals.',
      avatar: '/team/emily-watson.jpg',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'David Kim',
      role: 'VP of Engineering',
      bio: 'Full-stack engineer with experience at top biotech companies. Expert in building scalable laboratory management systems.',
      avatar: '/team/david-kim.jpg',
      linkedin: '#',
      twitter: '#'
    }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Patient Safety First',
      description: 'Every feature we build prioritizes patient safety and data integrity above all else.'
    },
    {
      icon: Shield,
      title: 'Regulatory Excellence',
      description: 'We maintain the highest standards of compliance and regulatory adherence.'
    },
    {
      icon: Brain,
      title: 'AI Innovation',
      description: 'We push the boundaries of what AI can do in laboratory environments.'
    },
    {
      icon: Users,
      title: 'User-Centric Design',
      description: 'We design for the people who use our systems every day in critical environments.'
    }
  ]

  const milestones = [
    {
      year: '2024',
      title: 'Series A Funding',
      description: 'Raised $25M to accelerate product development and expand our team.',
      achievement: '$25M raised'
    },
    {
      year: '2023',
      title: '100+ Laboratories',
      description: 'Reached our first 100 laboratory customers across research, clinical, and pharmaceutical sectors.',
      achievement: '100+ customers'
    },
    {
      year: '2022',
      title: 'FDA Approval',
      description: 'Received FDA clearance for our clinical laboratory management system.',
      achievement: 'FDA cleared'
    },
    {
      year: '2021',
      title: 'Company Founded',
      description: 'LabGuard Pro was founded with a mission to revolutionize laboratory operations.',
      achievement: 'Company founded'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Users className="w-4 h-4 mr-2" />
            About LabGuard Pro
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Revolutionizing{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Laboratory Operations
            </span>{' '}
            with AI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We're on a mission to transform how laboratories operate by making AI-powered tools 
            accessible to every lab professional, from research institutions to clinical facilities.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-400" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                To democratize AI-powered laboratory management, making advanced automation and 
                compliance tools accessible to laboratories of all sizes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Reduce laboratory errors by 90%
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Accelerate research timelines by 50%
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Ensure 100% regulatory compliance
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                A world where every laboratory has access to AI-powered tools that enhance 
                accuracy, efficiency, and innovation in scientific discovery.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  AI in every laboratory by 2030
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Zero preventable laboratory errors
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Accelerated breakthrough discoveries
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-center">
                    <CardTitle className="text-white">{member.name}</CardTitle>
                    <CardDescription className="text-blue-400">{member.role}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm text-center mb-4">{member.bio}</p>
                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      LinkedIn
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Twitter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-500 text-white">{milestone.year}</Badge>
                    <div className="text-2xl font-bold text-blue-400">{milestone.achievement}</div>
                  </div>
                  <CardTitle className="text-white">{milestone.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">{milestone.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-300">Laboratories</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-gray-300">Countries</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Us in Transforming Laboratory Operations</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're a research institution, clinical laboratory, or pharmaceutical company, 
            we're here to help you leverage the power of AI in your operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Users className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Pill, 
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
  Flask,
  Microscope,
  AlertTriangle,
  Clipboard,
  TestTube
} from 'lucide-react'
import Link from 'next/link'

export default function PharmaceuticalPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Pill className="w-4 h-4 mr-2" />
            Pharmaceutical Industry
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Accelerate{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Drug Development
            </span>{' '}
            with AI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform pharmaceutical operations with AI-powered drug discovery and quality control. 
            Accelerate development timelines while maintaining the highest standards of safety and efficacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
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
              <div className="text-3xl font-bold text-purple-400 mb-2">100+</div>
              <div className="text-gray-300">Pharma Companies</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">1,000+</div>
              <div className="text-gray-300">Drug Candidates</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">50%</div>
              <div className="text-gray-300">Faster Development</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-300">Quality Rate</div>
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
                <h2 className="text-3xl font-bold text-white mb-6">Why Pharmaceutical Companies Choose LabGuard Pro</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Accelerated Drug Development</h3>
                      <p className="text-gray-300">AI-powered drug discovery accelerates development timelines by 50% while maintaining the highest standards of safety and efficacy.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center mt-1">
                      <Shield className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Global Regulatory Compliance</h3>
                      <p className="text-gray-300">Automated compliance monitoring ensures adherence to FDA, EMA, and other global regulatory requirements across all operations.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mt-1">
                      <TestTube className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Quality Excellence</h3>
                      <p className="text-gray-300">Advanced quality control systems ensure 99.9% product quality with automated testing and real-time monitoring.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Pharmaceutical Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Drug Discovery</span>
                    <span className="text-purple-400">50% faster</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Quality Control</span>
                    <span className="text-pink-400">99.9% accuracy</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Compliance Rate</span>
                    <span className="text-cyan-400">100% automated</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Pharmaceutical Features</h2>
              <p className="text-gray-300 mb-8">Advanced AI-powered solutions for drug development and quality control</p>
            </div>
          </TabsContent>

          <TabsContent value="case-studies" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Success Stories</h2>
              <p className="text-gray-300 mb-8">Real-world implementations and results from leading pharmaceutical companies</p>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Pricing Plans</h2>
              <p className="text-gray-300 mb-8">Flexible pricing options for pharmaceutical companies of all sizes</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Accelerate Your Drug Development?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of pharmaceutical companies already using LabGuard Pro to accelerate their drug development and maintain the highest quality standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
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
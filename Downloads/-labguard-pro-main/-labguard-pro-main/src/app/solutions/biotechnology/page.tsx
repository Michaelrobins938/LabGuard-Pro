'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dna, 
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
  TestTube,
  Leaf
} from 'lucide-react'
import Link from 'next/link'

export default function BiotechnologyPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
            <Dna className="w-4 h-4 mr-2" />
            Biotechnology
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Revolutionize{' '}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Biotech Research
            </span>{' '}
            with AI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform biotechnology research with AI-powered genetic analysis and synthetic biology. 
            Accelerate breakthroughs in genomics, proteomics, and cellular engineering.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
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
              <div className="text-3xl font-bold text-green-400 mb-2">200+</div>
              <div className="text-gray-300">Biotech Companies</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">10,000+</div>
              <div className="text-gray-300">Genomes Analyzed</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">75%</div>
              <div className="text-gray-300">Faster Discovery</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">99.8%</div>
              <div className="text-gray-300">Accuracy Rate</div>
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
                <h2 className="text-3xl font-bold text-white mb-6">Why Biotech Companies Choose LabGuard Pro</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mt-1">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Advanced Genetic Analysis</h3>
                      <p className="text-gray-300">AI-powered genomic analysis accelerates research by 75% while maintaining 99.8% accuracy in genetic sequencing and analysis.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mt-1">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Synthetic Biology</h3>
                      <p className="text-gray-300">Automated design and optimization of genetic circuits, metabolic pathways, and cellular engineering protocols.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center mt-1">
                      <Leaf className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Cellular Engineering</h3>
                      <p className="text-gray-300">Advanced cell culture optimization and genetic modification protocols with real-time monitoring and quality control.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Biotech Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Genetic Analysis</span>
                    <span className="text-green-400">75% faster</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Sequence Accuracy</span>
                    <span className="text-emerald-400">99.8%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '99.8%' }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Protocol Success</span>
                    <span className="text-teal-400">95% success rate</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Biotechnology Features</h2>
              <p className="text-gray-300 mb-8">Advanced AI-powered solutions for genetic analysis and synthetic biology</p>
            </div>
          </TabsContent>

          <TabsContent value="case-studies" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Success Stories</h2>
              <p className="text-gray-300 mb-8">Real-world implementations and results from leading biotechnology companies</p>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Pricing Plans</h2>
              <p className="text-gray-300 mb-8">Flexible pricing options for biotechnology companies of all sizes</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Revolutionize Your Biotech Research?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of biotechnology companies already using LabGuard Pro to accelerate their research and maintain the highest standards of innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
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
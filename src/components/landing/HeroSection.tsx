'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, ArrowRight, Shield, Zap, TrendingUp, Award, CheckCircle, AlertTriangle, BarChart3, Database, Upload } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Z-Pattern Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TOP LEFT: Logo & Navigation Area */}
        <div className="absolute top-8 left-8 z-20">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">LabGuard Pro</span>
          </div>
        </div>

        {/* TOP RIGHT: Primary CTA */}
        <div className="absolute top-8 right-8 z-20">
          <Link
            href="/dashboard"
            className="bg-primary-green text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-enterprise hover:shadow-enterprise-lg transition-all duration-enterprise flex items-center space-x-2 hover:scale-105"
          >
            <span>Try Demo Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* CENTER: Hero Content with Dashboard Preview */}
        <div className="pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="text-left">
              {/* Main Headline with Z-pattern eye movement */}
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 leading-tight">
                <span className="block">Complete</span>
                <span className="block text-primary-blue">Laboratory</span>
                <span className="block text-primary-green">Management</span>
              </h1>
              
              {/* Subtitle with generous whitespace */}
              <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed">
                From basic equipment tracking to advanced enterprise analytics, 
                LabGuard Pro provides everything you need for modern laboratory compliance and operations.
              </p>
              
              {/* Feature highlights */}
              <div className="mb-8 space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Enterprise Analytics & Business Intelligence</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Bulk Operations & Data Management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">LIMS Integration & API Management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Workflow Automation & System Administration</span>
                </div>
              </div>
              
              {/* Primary CTA with scientific emerald accent */}
              <div className="mb-16">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center bg-primary-green text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-enterprise hover:shadow-enterprise-lg transition-all duration-enterprise hover:scale-105 space-x-3"
                >
                  <Zap className="w-6 h-6" />
                  <span>Explore Platform</span>
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>

            {/* Right: Laboratory Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900 text-lg">Platform Overview</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">All Systems Active</span>
                  </div>
                </div>
                
                {/* Sample Platform Features */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Enterprise Analytics</div>
                        <div className="text-xs text-gray-600">Business intelligence & insights</div>
                      </div>
                    </div>
                    <span className="text-xs text-blue-700 bg-blue-100 px-3 py-1 rounded-full font-medium">Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Bulk Operations</div>
                        <div className="text-xs text-gray-600">Batch processing & automation</div>
                      </div>
                    </div>
                    <span className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium">Ready</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Data Management</div>
                        <div className="text-xs text-gray-600">Import/export & validation</div>
                      </div>
                    </div>
                    <span className="text-xs text-purple-700 bg-purple-100 px-3 py-1 rounded-full font-medium">Active</span>
                  </div>
                </div>

                {/* AI Validation Status */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Complete Platform</span>
                    </div>
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">Phase 3 Ready</span>
                  </div>
                </div>
              </div>
              
              {/* Floating AI Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-primary-blue to-primary-green text-white p-3 rounded-xl shadow-lg">
                <Shield className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM LEFT: Key Benefits & Stats */}
        <div className="absolute bottom-20 left-8 z-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-enterprise border border-gray-200">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-blue rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600 font-medium">Advanced Features</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-green rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600 font-medium">Platform Complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT: Secondary CTA */}
        <div className="absolute bottom-20 right-8 z-20">
          <Link
            href="/dashboard"
            className="bg-white text-primary-blue border-2 border-primary-blue px-8 py-4 rounded-xl hover:bg-primary-blue hover:text-white transition-all duration-enterprise font-semibold text-lg shadow-enterprise hover:shadow-enterprise-lg flex items-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Live Demo</span>
          </Link>
        </div>

        {/* Diagonal Visual Elements to Guide Eye Movement */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-primary-blue/10 to-primary-green/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-primary-green/10 to-primary-blue/10 rounded-full blur-3xl"></div>
      </div>

      {/* Enterprise-grade background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-white/50 opacity-30"></div>
    </section>
  )
} 
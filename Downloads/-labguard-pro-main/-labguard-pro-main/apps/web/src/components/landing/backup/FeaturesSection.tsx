'use client'

import { 
  Shield, 
  Clock, 
  BarChart3, 
  Users, 
  Zap, 
  ArrowRight,
  Database,
  Upload,
  Search,
  Key,
  Server,
  Activity,
  Settings,
  CreditCard,
  FileText,
  Bell
} from 'lucide-react'

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Complete Laboratory Management Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From basic equipment tracking to advanced enterprise analytics, we provide everything you need for modern laboratory compliance
          </p>
        </div>
        
        {/* Core Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Core Laboratory Management</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Equipment Management */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Equipment Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete lifecycle tracking with QR codes, maintenance schedules, and detailed analytics for all laboratory equipment.
              </p>
            </div>
            
            {/* Calibration System */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Calibrations</h3>
              <p className="text-gray-600 leading-relaxed">
                Smart scheduling with AI validation, automated reminders, and comprehensive compliance tracking.
              </p>
            </div>
            
            {/* Team Collaboration */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Team Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Role-based access control, team management, and seamless collaboration across your laboratory.
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Advanced Enterprise Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Enterprise Analytics */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enterprise Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Business intelligence with predictive insights, revenue tracking, and comprehensive performance metrics.
              </p>
            </div>
            
            {/* Bulk Operations */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bulk Operations</h3>
              <p className="text-gray-600 leading-relaxed">
                File-based batch processing for equipment, calibrations, and data with predefined templates.
              </p>
            </div>
            
            {/* Data Management */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Import/export center supporting CSV, Excel, JSON formats with comprehensive data validation.
              </p>
            </div>
            
            {/* LIMS Integration */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <Server className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">LIMS Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect to Laboratory Information Management Systems with real-time data synchronization.
              </p>
            </div>
            
            {/* API Management */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-6">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">API Management</h3>
              <p className="text-gray-600 leading-relaxed">
                RESTful API with key management, usage monitoring, and comprehensive documentation.
              </p>
            </div>
            
            {/* Automation */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Workflow Automation</h3>
              <p className="text-gray-600 leading-relaxed">
                Custom workflow creation and management with trigger-based automation and monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Professional Tools</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Global Search */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced search across all data types with intelligent filtering and quick access to information.
              </p>
            </div>
            
            {/* Billing & Subscriptions */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Billing & Subscriptions</h3>
              <p className="text-gray-600 leading-relaxed">
                Flexible billing plans, usage tracking, payment processing, and comprehensive invoicing.
              </p>
            </div>
            
            {/* System Administration */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">System Administration</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete system management, user administration, security monitoring, and backup management.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="inline-flex items-center px-8 py-4 bg-primary-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Explore All Features
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
} 
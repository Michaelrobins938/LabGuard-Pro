'use client'

import { 
  BarChart3, 
  Database, 
  Zap, 
  Shield, 
  Users, 
  Globe,
  Workflow,
  Search,
  CreditCard,
  Settings,
  FileText,
  Cpu
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function FeaturesSection() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Enterprise Analytics',
      description: 'Advanced business intelligence & reporting',
      category: 'Advanced Enterprise Features'
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Bulk Operations',
      description: 'Efficient data management & automation',
      category: 'Advanced Enterprise Features'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'LIMS Integration',
      description: 'Seamless API management & connectivity',
      category: 'Advanced Enterprise Features'
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: 'API Management',
      description: 'RESTful API with comprehensive documentation',
      category: 'Advanced Enterprise Features'
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: 'Workflow Automation',
      description: 'Custom workflow creation and management',
      category: 'Professional Tools'
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Global Search',
      description: 'Advanced search across all data types',
      category: 'Professional Tools'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Billing & Subscriptions',
      description: 'Flexible billing plans and usage tracking',
      category: 'Professional Tools'
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'System Administration',
      description: 'Complete system management and monitoring',
      category: 'Professional Tools'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Data Management',
      description: 'Import/export center with validation',
      category: 'Professional Tools'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI-Powered Calibrations',
      description: 'Smart scheduling with AI validation',
      category: 'Core Laboratory Management'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Equipment Management',
      description: 'Complete lifecycle tracking with QR codes',
      category: 'Core Laboratory Management'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Collaboration',
      description: 'Role-based access control and management',
      category: 'Core Laboratory Management'
    }
  ]

  const categories = ['Core Laboratory Management', 'Advanced Enterprise Features', 'Professional Tools']

  return (
    <section className="enhanced-section" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="enhanced-card px-4 py-2 rounded-full mb-6">
            Complete Platform
          </Badge>
          <h2 className="enhanced-gradient-text mb-4">
            Complete Laboratory Management Platform
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From basic equipment tracking to advanced enterprise analytics, we provide everything you need for modern laboratory compliance and operations.
          </p>
        </div>

        {/* Features by Category */}
        {categories.map((category, categoryIndex) => (
          <div key={category} className="mb-16">
            <h3 className="text-2xl font-semibold text-white mb-8 text-center">
              {category}
            </h3>
            <div className="enhanced-feature-grid stagger-children">
              {features
                .filter(feature => feature.category === category)
                .map((feature, index) => (
                  <div key={index} className="enhanced-card group">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Enterprise Stats */}
        <div className="enhanced-card mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Laboratories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">Compliance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
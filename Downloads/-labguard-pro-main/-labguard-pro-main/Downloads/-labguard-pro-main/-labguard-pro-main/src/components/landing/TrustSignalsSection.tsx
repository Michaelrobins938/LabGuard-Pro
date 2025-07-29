'use client'

import { 
  Shield, 
  Lock, 
  CheckCircle, 
  Award, 
  Users, 
  Globe,
  Star,
  Zap,
  Eye,
  Brain
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function TrustSignalsSection() {
  const certifications = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'SOC 2 Type II',
      description: 'Enterprise-grade security compliance',
      status: 'Certified'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'HIPAA Compliant',
      description: 'Healthcare data protection standards',
      status: 'Certified'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'CAP Certified',
      description: 'College of American Pathologists',
      status: 'Certified'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'CLIA Compliant',
      description: 'Clinical Laboratory Improvement Amendments',
      status: 'Certified'
    }
  ]

  const securityFeatures = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'End-to-End Encryption',
      description: 'All data encrypted in transit and at rest'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Multi-Factor Authentication',
      description: 'Enterprise-grade access controls'
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Audit Trails',
      description: 'Complete activity logging and monitoring'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Global Data Centers',
      description: '99.9% uptime with redundant infrastructure'
    }
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      title: 'Laboratory Director',
      company: 'Regional Medical Center',
      rating: 5,
      quote: 'The security and compliance features give us complete confidence. We trust LabGuard Pro with our most sensitive data.'
    },
    {
      name: 'Michael Rodriguez',
      title: 'Quality Manager',
      company: 'Diagnostics Plus Laboratory',
      rating: 5,
      quote: 'Passed our CAP inspection with flying colors. The compliance features are exceptional.'
    }
  ]

  return (
    <section id="trust" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
            Security & Compliance
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-blue-600">Leading Laboratories</span> Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enterprise-grade security meets laboratory compliance. LabGuard Pro maintains the highest 
            standards for data protection and regulatory compliance.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  {cert.icon}
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {cert.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {cert.title}
              </h3>
              <p className="text-sm text-gray-600">
                {cert.description}
              </p>
            </div>
          ))}
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Security
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your laboratory data is protected with military-grade security and compliance standards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">
              Trusted by Industry Leaders
            </h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Join hundreds of laboratories that trust LabGuard Pro with their most critical operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-200 text-sm">Laboratories</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200 text-sm">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-200 text-sm">Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-blue-200 text-sm">Compliance</div>
            </div>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h3>
            <p className="text-gray-600">
              Real feedback from laboratory professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-1 mr-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Verified Customer
                  </div>
                </div>
                
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.title} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Industry Certifications
            </h3>
            <p className="text-gray-600">
              LabGuard Pro meets and exceeds all major laboratory compliance standards
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div className="font-semibold text-gray-900">SOC 2 Type II</div>
              <div className="text-sm text-gray-600">Security Certified</div>
            </div>
            
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="font-semibold text-gray-900">CAP Certified</div>
              <div className="text-sm text-gray-600">Pathology Standards</div>
            </div>
            
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div className="font-semibold text-gray-900">CLIA Compliant</div>
              <div className="text-sm text-gray-600">Clinical Standards</div>
            </div>
            
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-8 h-8 text-orange-600" />
              </div>
              <div className="font-semibold text-gray-900">HIPAA Secure</div>
              <div className="text-sm text-gray-600">Healthcare Data</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience Enterprise-Grade Security?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of laboratories that trust LabGuard Pro with their most critical operations. 
              Start your free trial today and see the difference enterprise-grade security makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
                Start Free Trial
              </button>
              <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-semibold">
                Schedule Security Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
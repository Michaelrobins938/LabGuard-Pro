'use client'

import { Shield, Lock, Eye, CheckCircle, Server } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CheckoutSecurity() {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security & Compliance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white font-medium">PCI DSS Compliant</h4>
              <p className="text-gray-300 text-sm">
                Payment processing meets the highest security standards
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white font-medium">SOC 2 Type II</h4>
              <p className="text-gray-300 text-sm">
                Independently audited security controls and practices
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Eye className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white font-medium">End-to-End Encryption</h4>
              <p className="text-gray-300 text-sm">
                All data encrypted in transit and at rest
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Server className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white font-medium">Enterprise Infrastructure</h4>
              <p className="text-gray-300 text-sm">
                Built on AWS with enterprise-grade security
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Security Level</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">Enterprise Grade</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
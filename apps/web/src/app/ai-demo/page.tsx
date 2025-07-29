'use client'

import { EnhancedBiomniAssistant } from '@/components/ai-assistant/EnhancedBiomniAssistant'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function AIDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header with navigation */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">LabGuard Pro</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                Live Demo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧬 Stanford Biomni AI Demo
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of laboratory AI. This interactive demo showcases Stanford's cutting-edge 
            Biomni AI with real-time protocol design, genomic analysis, compliance verification, and equipment optimization.
          </p>
        </div>
        
        <EnhancedBiomniAssistant />
      </div>
    </div>
  )
}
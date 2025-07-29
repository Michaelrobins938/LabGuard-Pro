'use client'

import { EnhancedBiomniAssistant } from '@/components/ai-assistant/EnhancedBiomniAssistant'

export default function AIAssistantDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
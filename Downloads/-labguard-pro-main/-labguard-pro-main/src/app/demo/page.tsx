import { Metadata } from 'next'
import { DemoHero } from '@/components/demo/DemoHero'
import { DemoFeatures } from '@/components/demo/DemoFeatures'
import { DemoWalkthrough } from '@/components/demo/DemoWalkthrough'
import { DemoCTA } from '@/components/demo/DemoCTA'

export const metadata: Metadata = {
  title: 'LabGuard Pro Demo - See AI-Powered Laboratory Management in Action',
  description: 'Experience LabGuard Pro\'s revolutionary AI-powered laboratory management platform. Watch live demos, explore features, and see how we transform lab operations.',
  keywords: 'lab management demo, AI laboratory software, lab automation demo, compliance monitoring demo',
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <DemoHero />
      <DemoFeatures />
      <DemoWalkthrough />
      <DemoCTA />
    </div>
  )
} 
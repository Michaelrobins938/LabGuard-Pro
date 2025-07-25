import { Metadata } from 'next'
import { BiotechnologyHero } from '@/components/solutions/biotechnology/BiotechnologyHero'
import { BiotechnologyFeatures } from '@/components/solutions/biotechnology/BiotechnologyFeatures'
import BiotechnologyBenefits from '@/components/solutions/biotechnology/BiotechnologyBenefits'
import BiotechnologyCTA from '@/components/solutions/biotechnology/BiotechnologyCTA'

export const metadata: Metadata = {
  title: 'Biotechnology Solutions - LabGuard Pro | Advanced Research & Development',
  description: 'Accelerate biotechnology research with AI-powered experimental design, automated workflows, and advanced analytics for breakthrough discoveries.',
  keywords: 'biotechnology solutions, research automation, experimental design, biotech research, genetic engineering',
}

export default function BiotechnologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <BiotechnologyHero />
      <BiotechnologyFeatures />
      <BiotechnologyBenefits />
      <BiotechnologyCTA />
    </div>
  )
} 
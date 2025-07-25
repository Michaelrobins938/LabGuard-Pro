import { Metadata } from 'next'
import { PharmaceuticalHero } from '@/components/solutions/pharmaceutical/PharmaceuticalHero'
import { PharmaceuticalFeatures } from '@/components/solutions/pharmaceutical/PharmaceuticalFeatures'
import { PharmaceuticalBenefits } from '@/components/solutions/pharmaceutical/PharmaceuticalBenefits'
import { PharmaceuticalCTA } from '@/components/solutions/pharmaceutical/PharmaceuticalCTA'

export const metadata: Metadata = {
  title: 'Pharmaceutical Solutions - LabGuard Pro | FDA Compliance & Drug Development',
  description: 'Streamline pharmaceutical research with AI-powered compliance monitoring, FDA audit trails, and automated drug development workflows.',
  keywords: 'pharmaceutical solutions, FDA compliance, drug development, clinical trials, pharmaceutical research',
}

export default function PharmaceuticalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <PharmaceuticalHero />
      <PharmaceuticalFeatures />
      <PharmaceuticalBenefits />
      <PharmaceuticalCTA />
    </div>
  )
} 
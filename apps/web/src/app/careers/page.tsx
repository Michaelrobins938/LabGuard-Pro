import { Metadata } from 'next'
import { CareersHero } from '@/components/careers/CareersHero'
import { CareersPositions } from '@/components/careers/CareersPositions'
import { CareersBenefits } from '@/components/careers/CareersBenefits'
import { CareersCTA } from '@/components/careers/CareersCTA'

export const metadata: Metadata = {
  title: 'Careers - LabGuard Pro | Join Our Team',
  description: 'Join our mission to revolutionize laboratory management. Explore career opportunities at LabGuard Pro and be part of the future of scientific innovation.',
  keywords: 'careers, jobs, employment, labguard pro careers, join our team',
}

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <CareersHero />
      <CareersPositions />
      <CareersBenefits />
      <CareersCTA />
    </div>
  )
} 
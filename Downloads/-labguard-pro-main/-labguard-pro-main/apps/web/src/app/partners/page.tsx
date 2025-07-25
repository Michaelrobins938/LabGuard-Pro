import { Metadata } from 'next'
import { PartnersHero } from '@/components/partners/PartnersHero'
import { PartnersProgram } from '@/components/partners/PartnersProgram'
import { PartnersBenefits } from '@/components/partners/PartnersBenefits'
import { PartnersCTA } from '@/components/partners/PartnersCTA'

export const metadata: Metadata = {
  title: 'Partners - LabGuard Pro | Strategic Partnerships',
  description: 'Partner with LabGuard Pro to revolutionize laboratory management. Explore partnership opportunities and join our ecosystem of innovation.',
  keywords: 'partners, partnerships, strategic partners, labguard pro partners, collaboration',
}

export default function PartnersPage() {
  return (
    <div className="min-h-screen">
      <PartnersHero />
      <PartnersProgram />
      <PartnersBenefits />
      <PartnersCTA />
    </div>
  )
} 
import { Metadata } from 'next'
import { CaseStudiesHero } from '@/components/case-studies/CaseStudiesHero'
import { CaseStudiesGrid } from '@/components/case-studies/CaseStudiesGrid'
import { CaseStudiesCTA } from '@/components/case-studies/CaseStudiesCTA'

export const metadata: Metadata = {
  title: 'Case Studies - LabGuard Pro Success Stories',
  description: 'Discover how leading laboratories are transforming their operations with LabGuard Pro. Read real success stories and see measurable results.',
  keywords: 'case studies, success stories, laboratory transformation, labguard pro results',
}

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <CaseStudiesHero />
      <CaseStudiesGrid />
      <CaseStudiesCTA />
    </div>
  )
} 
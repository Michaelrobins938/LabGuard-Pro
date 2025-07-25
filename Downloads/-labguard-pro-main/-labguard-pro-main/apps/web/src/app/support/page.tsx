import { Metadata } from 'next'
import { SupportHero } from '@/components/support/SupportHero'
import { SupportCategories } from '@/components/support/SupportCategories'
import { SupportContact } from '@/components/support/SupportContact'
import { SupportResources } from '@/components/support/SupportResources'

export const metadata: Metadata = {
  title: 'Support Center - LabGuard Pro Help & Documentation',
  description: 'Get help with LabGuard Pro. Find answers to common questions, contact support, and access comprehensive documentation.',
  keywords: 'labguard pro support, help center, documentation, contact support, troubleshooting, deployment trigger',
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <SupportHero />
      <SupportCategories />
      <SupportContact />
      <SupportResources />
    </div>
  )
} 
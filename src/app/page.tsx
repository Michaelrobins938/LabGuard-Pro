// Force deployment update - all pages are now live
import { Metadata } from 'next'
import { HeroUIHeroSection } from '@/components/landing/HeroUIHeroSection'
import { HeroUIFeaturesSection } from '@/components/landing/HeroUIFeaturesSection'
import { HeroUITestimonialsSection } from '@/components/landing/HeroUITestimonialsSection'
import { HeroUIPricingSection } from '@/components/landing/HeroUIPricingSection'
import { HeroUINavigation } from '@/components/landing/HeroUINavigation'
import { HeroUIFooter } from '@/components/landing/HeroUIFooter'
import { EnhancedBiomniAssistant } from '@/components/ai-assistant/EnhancedBiomniAssistant'

export const metadata: Metadata = {
  title: 'LabGuard Pro - AI-Powered Laboratory Compliance Platform',
  description: 'Transform your laboratory operations with Stanford\'s revolutionary Biomni AI. Automate compliance, streamline workflows, and ensure 100% accuracy.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <HeroUINavigation />
      <main>
        <HeroUIHeroSection />
        <HeroUIFeaturesSection />
        <HeroUITestimonialsSection />
        <HeroUIPricingSection />
      </main>
      <HeroUIFooter />
      <EnhancedBiomniAssistant />
    </div>
  )
} 
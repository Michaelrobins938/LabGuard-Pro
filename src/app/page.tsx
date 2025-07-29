// Force deployment update - all pages are now live
import { Metadata } from 'next'
import { HeroUINavigation } from '@/components/landing/HeroUINavigation'
import { HeroUIFooter } from '@/components/landing/HeroUIFooter'
import { HeroUIHeroSection } from '@/components/landing/HeroUIHeroSection'
import { HeroUIFeaturesSection } from '@/components/landing/HeroUIFeaturesSection'
import { HeroUITestimonialsSection } from '@/components/landing/HeroUITestimonialsSection'
import { HeroUIPricingSection } from '@/components/landing/HeroUIPricingSection'
import { EnhancedBiomniAssistant } from '@/components/ai-assistant/EnhancedBiomniAssistant'

export const metadata: Metadata = {
  title: 'LabGuard Pro - AI-Powered Laboratory Compliance Platform',
  description: 'Transform your laboratory operations with Stanford\'s revolutionary Biomni AI. Automate compliance, streamline workflows, and ensure 100% accuracy.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900">
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
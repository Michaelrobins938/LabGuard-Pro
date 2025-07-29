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
      
      {/* Test section */}
      <div className="py-20 text-center bg-red-900/20 border border-red-500/30 rounded-lg mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">🧪 TEST LINKS SECTION 🧪</h2>
        <p className="text-gray-300 mb-4">If you can see this, the page is updated!</p>
        <div className="space-y-4">
          <a href="/test-link" className="text-blue-400 hover:text-blue-300 block text-lg font-bold">🔗 Test Link (Anchor)</a>
          <a href="/solutions/research" className="text-green-400 hover:text-green-300 block text-lg font-bold">🔗 Research Page (Anchor)</a>
          <a href="/about" className="text-yellow-400 hover:text-yellow-300 block text-lg font-bold">🔗 About Page (Anchor)</a>
        </div>
      </div>
      
      <HeroUIFooter />
      <EnhancedBiomniAssistant />
    </div>
  )
} 
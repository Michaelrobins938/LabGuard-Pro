import { Metadata } from 'next'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutMission } from '@/components/about/AboutMission'
import { AboutTeam } from '@/components/about/AboutTeam'
import { AboutValues } from '@/components/about/AboutValues'
import { AboutCTA } from '@/components/about/AboutCTA'

export const metadata: Metadata = {
  title: 'About Us - LabGuard Pro | Revolutionizing Laboratory Management',
  description: 'Learn about LabGuard Pro\'s mission to revolutionize laboratory management with AI-powered technology and our commitment to scientific advancement.',
  keywords: 'about labguard pro, laboratory management, AI technology, scientific advancement, team',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <AboutHero />
      <AboutMission />
      <AboutTeam />
      <AboutValues />
      <AboutCTA />
    </div>
  )
} 
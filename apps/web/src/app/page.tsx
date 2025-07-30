import { Metadata } from 'next'
import LabGuardProLanding from '@/components/landing/LabGuardProLanding'

export const metadata: Metadata = {
  title: 'LabGuard Pro - AI-Powered Laboratory Compliance Platform',
  description: 'Transform your laboratory operations with Stanford\'s revolutionary Biomni AI. Automate compliance, streamline workflows, and ensure 100% accuracy.',
}

export default function LandingPage() {
  return <LabGuardProLanding />
} 
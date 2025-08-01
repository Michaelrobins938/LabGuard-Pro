import { Metadata } from 'next'
import { AnalyticsPage } from '@/components/analytics/AnalyticsPage'

export const metadata: Metadata = {
  title: 'Advanced Analytics - LabGuard Pro',
  description: 'AI-powered insights and predictive analytics for laboratory optimization and decision-making. Transform your laboratory data into actionable intelligence.',
}

export default function AnalyticsPageRoute() {
  return <AnalyticsPage />
} 
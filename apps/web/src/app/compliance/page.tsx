import { Metadata } from 'next'
import { CompliancePage } from '@/components/compliance/CompliancePage'

export const metadata: Metadata = {
  title: 'Compliance Automation - LabGuard Pro',
  description: 'Automated regulatory compliance with real-time monitoring and audit trail generation. Streamline your laboratory compliance with AI-powered validation.',
}

export default function CompliancePageRoute() {
  return <CompliancePage />
} 
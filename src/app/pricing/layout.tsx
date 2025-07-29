import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - LabGuard Pro',
  description: 'Choose the right plan for your laboratory compliance needs.',
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 
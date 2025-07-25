import { Metadata } from 'next'
import { ContactHero } from '@/components/contact/ContactHero'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactInfo } from '@/components/contact/ContactInfo'
import { ContactCTA } from '@/components/contact/ContactCTA'

export const metadata: Metadata = {
  title: 'Contact Us - LabGuard Pro | Get in Touch',
  description: 'Contact LabGuard Pro for support, sales inquiries, or general questions. Our team is here to help you succeed.',
  keywords: 'contact labguard pro, support, sales, inquiry, help',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <ContactHero />
      <ContactForm />
      <ContactInfo />
      <ContactCTA />
    </div>
  )
} 
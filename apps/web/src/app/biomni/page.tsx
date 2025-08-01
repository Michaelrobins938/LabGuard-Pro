import { Metadata } from 'next'
import { BiomniPage } from '@/components/biomni/BiomniPage'

export const metadata: Metadata = {
  title: 'Stanford Biomni AI - LabGuard Pro',
  description: 'Powered by Stanford\'s cutting-edge Biomni AI research with 150+ biomedical tools and 59 scientific databases. Learn about the world-class research behind LabGuard Pro.',
}

export default function BiomniPageRoute() {
  return <BiomniPage />
} 
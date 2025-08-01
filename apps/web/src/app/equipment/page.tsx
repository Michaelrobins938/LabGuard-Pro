import { Metadata } from 'next'
import { EquipmentPage } from '@/components/equipment/EquipmentPage'

export const metadata: Metadata = {
  title: 'Equipment Management - LabGuard Pro',
  description: 'Comprehensive laboratory equipment tracking with maintenance scheduling and calibration alerts. Streamline your equipment management with AI-powered insights.',
}

export default function EquipmentPageRoute() {
  return <EquipmentPage />
} 
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solutions - LabGuard Pro',
  description: 'Laboratory compliance solutions for different industries.',
}

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Laboratory Solutions</h1>
          <p className="text-xl text-gray-300">
            Tailored compliance solutions for your laboratory type
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Enterprise Compliance */}
          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise Compliance</h3>
            <p className="text-gray-300 mb-6">
              Comprehensive compliance management for large-scale laboratory operations with advanced AI-powered monitoring.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Multi-site management</li>
              <li>✓ Advanced reporting</li>
              <li>✓ Custom integrations</li>
              <li>✓ Dedicated support</li>
            </ul>
            <button className="enhanced-button-primary w-full">Learn More</button>
          </div>

          {/* Research Labs */}
          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-4">Research Labs</h3>
            <p className="text-gray-300 mb-6">
              Specialized tools for research laboratories with flexible compliance requirements and experimental protocols.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Flexible protocols</li>
              <li>✓ Research tracking</li>
              <li>✓ Data management</li>
              <li>✓ Collaboration tools</li>
            </ul>
            <button className="enhanced-button-primary w-full">Learn More</button>
          </div>

          {/* Clinical Laboratories */}
          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-4">Clinical Laboratories</h3>
            <p className="text-gray-300 mb-6">
              HIPAA-compliant solutions for clinical laboratories with patient safety and regulatory requirements.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ HIPAA compliance</li>
              <li>✓ Patient safety</li>
              <li>✓ Quality control</li>
              <li>✓ Audit readiness</li>
            </ul>
            <button className="enhanced-button-primary w-full">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  )
} 
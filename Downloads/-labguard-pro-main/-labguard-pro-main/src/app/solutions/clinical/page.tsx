import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clinical Laboratories - LabGuard Pro',
  description: 'HIPAA-compliant solutions for clinical laboratories with patient safety and regulatory requirements.',
}

export default function ClinicalLaboratoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Clinical Laboratories</h1>
          <p className="text-xl text-gray-300">
            HIPAA-compliant solutions for clinical laboratories with patient safety and regulatory requirements
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">HIPAA Compliance</h3>
            <p className="text-gray-300 mb-6">
              Full HIPAA compliance with secure patient data handling and privacy protection measures.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ HIPAA-compliant data storage</li>
              <li>✓ Patient privacy protection</li>
              <li>✓ Audit trail logging</li>
              <li>✓ Secure data transmission</li>
            </ul>
          </div>

          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Patient Safety</h3>
            <p className="text-gray-300 mb-6">
              Comprehensive patient safety protocols with automated quality control and error prevention.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Quality control automation</li>
              <li>✓ Error prevention systems</li>
              <li>✓ Patient result tracking</li>
              <li>✓ Safety alerts</li>
            </ul>
          </div>

          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Quality Control</h3>
            <p className="text-gray-300 mb-6">
              Automated quality control processes that ensure accurate and reliable test results.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Automated QC monitoring</li>
              <li>✓ Calibration tracking</li>
              <li>✓ Proficiency testing</li>
              <li>✓ Quality metrics</li>
            </ul>
          </div>

          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Audit Readiness</h3>
            <p className="text-gray-300 mb-6">
              Maintain audit readiness with comprehensive documentation and compliance tracking.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Automated documentation</li>
              <li>✓ Compliance reporting</li>
              <li>✓ Audit trail maintenance</li>
              <li>✓ Regulatory updates</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="enhanced-button-primary text-lg px-8 py-4">
            Get Clinical Quote
          </button>
        </div>
      </div>
    </div>
  )
} 
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enterprise Compliance - LabGuard Pro',
  description: 'Comprehensive compliance management for large-scale laboratory operations.',
}

export default function EnterpriseCompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Enterprise Compliance</h1>
          <p className="text-xl text-gray-300">
            Comprehensive compliance management for large-scale laboratory operations
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Multi-Site Management</h3>
            <p className="text-gray-300 mb-6">
              Manage compliance across multiple laboratory locations with centralized control and real-time monitoring.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Centralized dashboard</li>
              <li>✓ Cross-site reporting</li>
              <li>✓ Unified compliance tracking</li>
              <li>✓ Role-based access control</li>
            </ul>
          </div>

          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Advanced AI Monitoring</h3>
            <p className="text-gray-300 mb-6">
              AI-powered compliance monitoring that automatically detects and alerts on potential issues.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Predictive compliance alerts</li>
              <li>✓ Automated risk assessment</li>
              <li>✓ Real-time monitoring</li>
              <li>✓ Intelligent reporting</li>
            </ul>
          </div>

          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Custom Integrations</h3>
            <p className="text-gray-300 mb-6">
              Seamlessly integrate with your existing laboratory information systems and workflows.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ LIMS integration</li>
              <li>✓ ERP connectivity</li>
              <li>✓ Custom API endpoints</li>
              <li>✓ Data synchronization</li>
            </ul>
          </div>

          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Dedicated Support</h3>
            <p className="text-gray-300 mb-6">
              Enterprise-level support with dedicated account managers and priority response times.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Dedicated account manager</li>
              <li>✓ 24/7 priority support</li>
              <li>✓ Custom training programs</li>
              <li>✓ SLA guarantees</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="enhanced-button-primary text-lg px-8 py-4">
            Get Enterprise Quote
          </button>
        </div>
      </div>
    </div>
  )
} 
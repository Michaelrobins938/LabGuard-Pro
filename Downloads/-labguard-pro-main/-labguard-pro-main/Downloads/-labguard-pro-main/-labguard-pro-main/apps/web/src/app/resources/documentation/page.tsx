import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation - LabGuard Pro',
  description: 'Comprehensive guides and tutorials to help you set up and use LabGuard Pro effectively.',
}

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
          <p className="text-xl text-gray-300">
            Comprehensive guides and tutorials to help you set up and use LabGuard Pro effectively
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Getting Started</h3>
            <p className="text-gray-300 mb-6">
              Quick start guides and tutorials to get you up and running with LabGuard Pro.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Installation guide</li>
              <li>✓ First-time setup</li>
              <li>✓ Basic configuration</li>
              <li>✓ User onboarding</li>
            </ul>
          </div>

          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">User Manual</h3>
            <p className="text-gray-300 mb-6">
              Detailed user manual covering all features and functionality of LabGuard Pro.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Feature documentation</li>
              <li>✓ Step-by-step guides</li>
              <li>✓ Troubleshooting</li>
              <li>✓ Best practices</li>
            </ul>
          </div>

          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Video Tutorials</h3>
            <p className="text-gray-300 mb-6">
              Visual tutorials and demonstrations to help you master LabGuard Pro features.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Feature walkthroughs</li>
              <li>✓ Setup tutorials</li>
              <li>✓ Advanced techniques</li>
              <li>✓ Tips and tricks</li>
            </ul>
          </div>

          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">API Reference</h3>
            <p className="text-gray-300 mb-6">
              Complete API documentation for developers and system integrators.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ REST API docs</li>
              <li>✓ Code examples</li>
              <li>✓ SDK documentation</li>
              <li>✓ Integration guides</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="enhanced-button-primary text-lg px-8 py-4">
            Browse Documentation
          </button>
        </div>
      </div>
    </div>
  )
} 
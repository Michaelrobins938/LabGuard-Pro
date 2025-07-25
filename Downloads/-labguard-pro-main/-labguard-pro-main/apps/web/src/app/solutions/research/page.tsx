import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research Labs - LabGuard Pro',
  description: 'Specialized tools for research laboratories with flexible compliance requirements.',
}

export default function ResearchLabsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Research Laboratories</h1>
          <p className="text-xl text-gray-300">
            Specialized tools for research laboratories with flexible compliance requirements
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Flexible Protocols</h3>
            <p className="text-gray-300 mb-6">
              Adapt to changing research requirements with customizable protocols and experimental workflows.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Custom protocol builder</li>
              <li>✓ Experimental tracking</li>
              <li>✓ Version control</li>
              <li>✓ Collaborative editing</li>
            </ul>
          </div>

          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Research Tracking</h3>
            <p className="text-gray-300 mb-6">
              Comprehensive tracking of research projects, experiments, and data collection processes.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Project management</li>
              <li>✓ Experiment logging</li>
              <li>✓ Data collection</li>
              <li>✓ Progress tracking</li>
            </ul>
          </div>

          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Data Management</h3>
            <p className="text-gray-300 mb-6">
              Secure and organized data management for research findings and experimental results.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Secure data storage</li>
              <li>✓ Automated backups</li>
              <li>✓ Data versioning</li>
              <li>✓ Export capabilities</li>
            </ul>
          </div>

          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-6">Collaboration Tools</h3>
            <p className="text-gray-300 mb-6">
              Enable team collaboration with shared workspaces and real-time communication tools.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Team workspaces</li>
              <li>✓ Real-time collaboration</li>
              <li>✓ Comment system</li>
              <li>✓ Access controls</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="enhanced-button-primary text-lg px-8 py-4">
            Start Research Trial
          </button>
        </div>
      </div>
    </div>
  )
} 
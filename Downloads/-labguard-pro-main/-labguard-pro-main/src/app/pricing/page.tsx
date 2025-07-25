import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - LabGuard Pro',
  description: 'Choose the right plan for your laboratory compliance needs.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Pricing Plans</h1>
          <p className="text-xl text-gray-300 mb-12">
            Choose the right plan for your laboratory compliance needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="enhanced-pricing-card">
            <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
            <div className="text-4xl font-bold text-white mb-6">$99<span className="text-lg text-gray-400">/month</span></div>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Up to 50 equipment items</li>
              <li>✓ Basic compliance tracking</li>
              <li>✓ Standard reporting</li>
              <li>✓ Email support</li>
            </ul>
            <button className="enhanced-button-primary w-full">Get Started</button>
          </div>

          {/* Professional Plan */}
          <div className="enhanced-pricing-card popular">
            <h3 className="text-2xl font-bold text-white mb-4">Professional</h3>
            <div className="text-4xl font-bold text-white mb-6">$299<span className="text-lg text-gray-400">/month</span></div>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Up to 200 equipment items</li>
              <li>✓ Advanced compliance tracking</li>
              <li>✓ AI-powered insights</li>
              <li>✓ Priority support</li>
              <li>✓ Custom integrations</li>
            </ul>
            <button className="enhanced-button-primary w-full">Get Started</button>
          </div>

          {/* Enterprise Plan */}
          <div className="enhanced-pricing-card">
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
            <div className="text-4xl font-bold text-white mb-6">Custom</div>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Unlimited equipment</li>
              <li>✓ Full compliance suite</li>
              <li>✓ Custom AI models</li>
              <li>✓ Dedicated support</li>
              <li>✓ On-premise deployment</li>
            </ul>
            <button className="enhanced-button-secondary w-full">Contact Sales</button>
          </div>
        </div>
      </div>
    </div>
  )
} 
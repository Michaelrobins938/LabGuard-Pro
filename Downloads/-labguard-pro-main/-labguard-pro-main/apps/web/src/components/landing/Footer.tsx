'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-blue to-primary-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="ml-2 text-xl font-bold">LabGuard Pro</span>
            </div>
            <p className="text-gray-400">
              The leading AI-powered laboratory compliance platform.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#features" className="hover:text-white transition-colors duration-200">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</Link></li>
              <li><Link href="/api" className="hover:text-white transition-colors duration-200">API</Link></li>
              <li><Link href="/integrations" className="hover:text-white transition-colors duration-200">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors duration-200">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors duration-200">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors duration-200">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white transition-colors duration-200">Help Center</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors duration-200">Documentation</Link></li>
              <li><Link href="/status" className="hover:text-white transition-colors duration-200">Status</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors duration-200">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 LabGuard Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 
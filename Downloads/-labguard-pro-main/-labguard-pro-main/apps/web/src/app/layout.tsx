import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary'
import { AuthProvider } from '@/hooks/useAuth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LabGuard Pro - Laboratory Compliance Automation',
  description: 'AI-powered laboratory compliance automation platform with equipment management, calibration workflows, and regulatory compliance.',
  keywords: 'laboratory, compliance, automation, equipment management, calibration, AI, biomedical',
  authors: [{ name: 'LabGuard Pro Team' }],
  creator: 'LabGuard Pro',
  publisher: 'LabGuard Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f23' },
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LabGuard Pro',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://labguard-pro.vercel.app',
    title: 'LabGuard Pro - Laboratory Compliance Automation',
    description: 'AI-powered laboratory compliance automation platform',
    siteName: 'LabGuard Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LabGuard Pro - Laboratory Compliance Automation',
    description: 'AI-powered laboratory compliance automation platform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LabGuard Pro" />
        <meta name="msapplication-TileColor" content="#0f0f23" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0f0f23" />
        <meta name="theme-color" content="#0f0f23" />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <ErrorBoundary>
          <SessionProvider>
            <AuthProvider>
              <QueryProvider>
                <div className="min-h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                  {children}
                </div>
                <Toaster 
                  position="bottom-center"
                  toastOptions={{
                    style: {
                      background: '#1e293b',
                      color: '#f8fafc',
                      border: '1px solid #334155',
                    },
                  }}
                />
              </QueryProvider>
            </AuthProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 
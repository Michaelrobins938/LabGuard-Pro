import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
    
    // Define public routes that don't need authentication
    const publicRoutes = [
      '/',
      '/about',
      '/pricing',
      '/contact',
      '/blog',
      '/support',
      '/partners',
      '/careers',
      '/demo',
      '/biomni-demo',
      '/modern',
      '/test',
      '/solutions',
      '/resources'
    ]
    
    const isPublicRoute = publicRoutes.some(route => 
      req.nextUrl.pathname === route || 
      req.nextUrl.pathname.startsWith(route + '/')
    )

    // Allow access to public routes without authentication
    if (isPublicRoute && !isDashboard) {
      return NextResponse.next()
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect unauthenticated users to login for protected routes
    if (isDashboard && !isAuth) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Role-based access control for dashboard
    if (isDashboard && isAuth) {
      const userRole = token?.role as string
      const pathname = req.nextUrl.pathname

      // Admin-only routes
      if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

      // Supervisor+ routes
      if (pathname.startsWith('/dashboard/reports') && 
          !['ADMIN', 'SUPERVISOR'].includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
        const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
        
        // Define public routes
        const publicRoutes = [
          '/',
          '/about',
          '/pricing',
          '/contact',
          '/blog',
          '/support',
          '/partners',
          '/careers',
          '/demo',
          '/biomni-demo',
          '/modern',
          '/test',
          '/solutions',
          '/resources'
        ]
        
        const isPublicRoute = publicRoutes.some(route => 
          req.nextUrl.pathname === route || 
          req.nextUrl.pathname.startsWith(route + '/')
        )

        // Allow access to auth pages
        if (isAuthPage) return true
        
        // Allow access to public routes
        if (isPublicRoute) return true

        // Require authentication for dashboard
        if (isDashboard) return !!token

        // Allow access to other pages by default
        return true
      }
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*'
  ]
} 
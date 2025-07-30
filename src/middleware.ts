import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                      req.nextUrl.pathname.startsWith('/register')
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect unauthenticated users to login
    if (isDashboard && !isAuth) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Role-based access control
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
        const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                          req.nextUrl.pathname.startsWith('/register')
        
        // Allow access to auth pages without token
        if (isAuthPage) {
          return true
        }

        // Require token for dashboard pages
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }

        return true
      }
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/api/auth/:path*'
  ]
} 
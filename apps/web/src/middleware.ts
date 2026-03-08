import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
]

// Routes that should redirect to /today
const redirectToToday = ['/taches']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle French route redirects
  if (redirectToToday.includes(pathname)) {
    return NextResponse.redirect(new URL('/today', request.url))
  }

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  // Get auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value

  // If not authenticated and trying to access protected route
  if (!isPublicRoute && !authToken && pathname !== '/') {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated and trying to access auth pages, redirect to today
  if (isPublicRoute && authToken && pathname !== '/verify-email') {
    return NextResponse.redirect(new URL('/today', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}

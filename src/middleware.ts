import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

export async function middleware(request: NextRequest) {
  try {
    // Check if the request is for a dashboard route
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      // Check for session cookie
      const sessionCookie = request.cookies.get('session')
      
      // If no session exists, redirect to login
      if (!sessionCookie?.value) {
        logger.info('Unauthorized access attempt to dashboard, redirecting to login')
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    return NextResponse.next()
  } catch (error) {
    logger.error('Middleware error:', error)
    // In case of error, redirect to login as a safety measure
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: '/dashboard/:path*'
} 
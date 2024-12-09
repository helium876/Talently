import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/reset-password',
  '/talents',
  '/api/auth',
  '/api/talents',
  '/api/register'
]

// Paths that require authentication
const protectedPaths = ['/dashboard', '/api/protected']

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Allow-Credentials': 'true'
}

export function middleware(request: NextRequest) {
  // Get method from request
  const { pathname } = request.nextUrl

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  // For API routes, add CORS headers
  if (pathname.startsWith('/api')) {
    // For API routes, we want to handle CORS and continue
    const response = NextResponse.next()
    
    // Add CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Add content type for JSON responses
    response.headers.set('Content-Type', 'application/json')
    
    return response
  }

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (path) => path === pathname || pathname.startsWith(path)
  )

  // Get the token from the cookies
  const token = request.cookies.get('token')

  // If the path is protected and there's no token, redirect to login
  if (isProtectedPath && !token) {
    const response = NextResponse.redirect(
      new URL('/auth/login', request.url)
    )
    response.cookies.delete('token')
    return response
  }

  // If the path is public and there's a token, redirect to dashboard (except for API routes)
  if (isPublicPath && token && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 
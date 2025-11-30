import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Get session from cookies
  const accessToken = req.cookies.get('sb-access-token')?.value
  const refreshToken = req.cookies.get('sb-refresh-token')?.value

  let session = null

  if (accessToken && refreshToken) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken)
      
      if (!error && user) {
        session = { user }
        
        // Try to get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile) {
          session = { ...session, profile }
        }
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
    }
  }

  // Define protected routes
  const protectedRoutes = ['/dashboard']
  const adminRoutes = ['/dashboard/admin']
  const shipperRoutes = ['/dashboard/shipper']
  const carrierRoutes = ['/dashboard/carrier']
  const authRoutes = ['/auth/signin', '/auth/signup', '/auth/forgot-password', '/auth/reset-password']

  const { pathname } = req.nextUrl

  // Redirect unauthenticated users from protected routes to sign-in
  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    const redirectUrl = new URL('/auth/signin', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users from auth routes to dashboard
  if (session && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // For protected routes, check user role
  if (session && protectedRoutes.some(route => pathname.startsWith(route))) {
    const userRole = session.profile?.role

    // Check admin routes
    if (pathname.startsWith('/dashboard/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Check shipper routes
    if (pathname.startsWith('/dashboard/shipper') && userRole !== 'shipper') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Check carrier routes
    if (pathname.startsWith('/dashboard/carrier') && userRole !== 'carrier') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
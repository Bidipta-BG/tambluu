import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref')
  const existing = request.cookies.get('gt_ref')?.value
  const CODE_RE = /^GT-[A-Z0-9]{6}$/

  if (ref && CODE_RE.test(ref) && ref !== existing) {
    // If there is a valid ref param and it's different from the current cookie, update it
    const response = NextResponse.next()
    response.cookies.set('gt_ref', ref, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax',
      // Not HttpOnly so client components can read it if needed
    })
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  // Only run the proxy on these paths
  matcher: ['/', '/register'],
}

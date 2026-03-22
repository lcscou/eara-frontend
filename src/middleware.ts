import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const maintenance = process.env.MAINTENANCE_MODE === 'true'
  const { pathname } = request.nextUrl

  const postSlugMatch = pathname.match(/^\/post\/([^/]+)\/?$/)
  if (postSlugMatch) {
    const url = request.nextUrl.clone()
    url.pathname = `/news/${postSlugMatch[1]}`
    return NextResponse.redirect(url, 308)
  }

  if (!maintenance) return NextResponse.next()

  const allowed =
    pathname === '/maintenance' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'

  if (allowed) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = '/maintenance'
  url.search = ''
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}

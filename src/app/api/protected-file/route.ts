import { NextRequest, NextResponse } from 'next/server'

import { validateAuthToken } from '@/lib/auth/server'
import { fetchProtectedFileFromWordPress } from '@/lib/protected-files/server'
import { isPrivateUploadsUrl } from '@/lib/protected-files/shared'

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url')

  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing required query parameter: url' }, { status: 400 })
  }

  if (!isPrivateUploadsUrl(rawUrl)) {
    return NextResponse.json({ error: 'Only private upload URLs are allowed.' }, { status: 400 })
  }

  const isAuthenticated = await validateAuthToken()
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  try {
    const upstream = await fetchProtectedFileFromWordPress(rawUrl)

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch protected file from upstream.' },
        { status: upstream.status >= 400 ? upstream.status : 502 }
      )
    }

    const body = await upstream.arrayBuffer()
    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
    const contentDisposition = upstream.headers.get('content-disposition')

    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'private, no-store, max-age=0',
    })

    if (contentDisposition) {
      headers.set('Content-Disposition', contentDisposition)
    }

    return new NextResponse(body, { status: 200, headers })
  } catch {
    return NextResponse.json({ error: 'Unable to load protected file.' }, { status: 500 })
  }
}

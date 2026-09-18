import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getAuthCookieName } from '@/lib/auth/constants'
import { getCurrentServerSiteConfig } from '@/lib/site-config-server'

const VIEWER_QUERY = `
  query Viewer {
    viewer {
      id
      name
      email
    }
  }
`

function decodeJWT(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    return payload
  } catch {
    return null
  }
}

export async function GET() {
  const cookieStore = await cookies()
  const site = await getCurrentServerSiteConfig()
  const token = cookieStore.get(getAuthCookieName(site.key))?.value

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const response = await fetch(site.graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: VIEWER_QUERY,
    }),
    cache: 'no-store',
  })

  const result = await response.json()

  if (result?.errors?.length || !result?.data?.viewer) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  // Decodifica o JWT para pegar o tempo de expiração
  const decodedToken = decodeJWT(token)
  const authTokenExpiration = decodedToken?.exp || null

  return NextResponse.json({
    authenticated: true,
    user: result.data.viewer,
    authTokenExpiration,
  })
}

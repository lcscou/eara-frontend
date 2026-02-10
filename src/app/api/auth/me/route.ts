import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { AUTH_COOKIE_NAME } from '@/lib/auth/constants'

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
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const endpoint =
    process.env.WORDPRESS_GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT

  if (!endpoint) {
    return NextResponse.json(
      { error: 'WordPress GraphQL endpoint is not configured.' },
      { status: 500 }
    )
  }

  const response = await fetch(endpoint, {
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

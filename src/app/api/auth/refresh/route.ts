import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { AUTH_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/lib/auth/constants'

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(input: { refreshToken: $refreshToken }) {
      authToken
      authTokenExpiration
    }
  }
`

export async function POST() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token found.' }, { status: 401 })
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
      },
      body: JSON.stringify({
        query: REFRESH_TOKEN_MUTATION,
        variables: { refreshToken },
      }),
      cache: 'no-store',
    })

    const result = await response.json()

    if (result?.errors?.length) {
      return NextResponse.json(
        { error: result.errors[0]?.message || 'Failed to refresh token.' },
        { status: 401 }
      )
    }

    const refresh = result?.data?.refreshToken
    if (!refresh?.authToken) {
      return NextResponse.json({ error: 'Invalid refresh token.' }, { status: 401 })
    }

    const res = NextResponse.json({
      success: true,
      authTokenExpiration: refresh.authTokenExpiration,
    })

    // Atualiza o auth token com o novo token
    res.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: refresh.authToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    })

    return res
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json({ error: 'Unable to refresh token at the moment.' }, { status: 500 })
  }
}

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getAuthCookieName, getRefreshTokenCookieName } from '@/lib/auth/constants'
import { getCurrentServerSiteConfig } from '@/lib/site-config-server'

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
    const site = await getCurrentServerSiteConfig()
    const refreshToken = cookieStore.get(getRefreshTokenCookieName(site.key))?.value

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token found.' }, { status: 401 })
    }

    const response = await fetch(site.graphqlEndpoint, {
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

    // Calcula tempo de expiração real do WordPress
    const authTokenMaxAge = refresh.authTokenExpiration
      ? Math.floor(refresh.authTokenExpiration - Date.now() / 1000)
      : 60 * 60 * 24 // fallback para 1 dia

    const res = NextResponse.json({
      success: true,
      authTokenExpiration: refresh.authTokenExpiration,
    })

    // Atualiza o auth token com o novo token
    res.cookies.set({
      name: getAuthCookieName(site.key),
      value: refresh.authToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: authTokenMaxAge,
    })

    return res
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json({ error: 'Unable to refresh token at the moment.' }, { status: 500 })
  }
}

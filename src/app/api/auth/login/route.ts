import { NextResponse } from 'next/server'

import { getAuthCookieName, getRefreshTokenCookieName } from '@/lib/auth/constants'
import { getSiteConfig } from '@/lib/site-config'

const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(
      input: { provider: PASSWORD, credentials: { username: $username, password: $password } }
    ) {
      authToken
      authTokenExpiration
      refreshToken
      refreshTokenExpiration
  
      user {
        id
        name
        email
      }
    }
  }
`

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const site = getSiteConfig(
      request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
    )

    const response = await fetch(site.graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: LOGIN_MUTATION,
        variables: { username: email, password },
      }),
      cache: 'no-store',
    })

    const result = await response.json()

    if (result?.errors?.length) {
      return NextResponse.json({ error: result.errors[0]?.message }, { status: 401 })
    }

    const login = result?.data?.login
    if (!login?.authToken) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }

    // Calcula tempo de expiração real do WordPress
    const authTokenMaxAge = login.authTokenExpiration
      ? Math.floor(login.authTokenExpiration - Date.now() / 1000)
      : 60 * 60 * 24 // fallback para 1 dia se não vier

    const refreshTokenMaxAge = login.refreshTokenExpiration
      ? Math.floor(login.refreshTokenExpiration - Date.now() / 1000)
      : 60 * 60 * 24 * 7 // fallback para 7 dias

    const res = NextResponse.json({
      user: login.user,
      authTokenExpiration: login.authTokenExpiration,
      refreshTokenExpiration: login.refreshTokenExpiration,
    })

    // Armazena o JWT token para autenticação nas requisições GraphQL
    res.cookies.set({
      name: getAuthCookieName(site.key),
      value: login.authToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: authTokenMaxAge,
    })

    console.log('Refresh Token Expiration:', login.refreshTokenExpiration)

    // Armazena o refresh token para renovação automática
    if (login.refreshToken) {
      res.cookies.set({
        name: getRefreshTokenCookieName(site.key),
        value: login.refreshToken,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: refreshTokenMaxAge,
      })
    }

    return res
  } catch {
    return NextResponse.json({ error: 'Unable to authenticate at the moment.' }, { status: 500 })
  }
}

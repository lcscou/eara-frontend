import { NextResponse } from 'next/server'

import { AUTH_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/lib/auth/constants'

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
      name: AUTH_COOKIE_NAME,
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
        name: REFRESH_TOKEN_COOKIE_NAME,
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

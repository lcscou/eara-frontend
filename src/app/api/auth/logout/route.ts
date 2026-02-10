import { NextResponse } from 'next/server'

import { AUTH_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/lib/auth/constants'

export async function POST() {
  const response = NextResponse.json({ ok: true })

  // Remove o auth token
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  // Remove o refresh token
  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}

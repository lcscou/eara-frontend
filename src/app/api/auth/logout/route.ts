import { NextResponse } from 'next/server'

import { getAuthCookieName, getRefreshTokenCookieName } from '@/lib/auth/constants'
import { getCurrentServerSiteConfig } from '@/lib/site-config-server'

export async function POST() {
  const site = await getCurrentServerSiteConfig()
  const response = NextResponse.json({ ok: true })

  // Remove o auth token
  response.cookies.set({
    name: getAuthCookieName(site.key),
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  // Remove o refresh token
  response.cookies.set({
    name: getRefreshTokenCookieName(site.key),
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}

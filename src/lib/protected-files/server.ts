import 'server-only'

import { getCurrentServerSiteConfig } from '@/lib/site-config-server'

import { isPrivateUploadsUrl } from './shared'

function resolveWordPressFileUrl(rawUrl: string, wordpressOrigin: string): string {
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl
  }

  if (rawUrl.startsWith('//')) {
    return `https:${rawUrl}`
  }

  return new URL(rawUrl, wordpressOrigin).toString()
}

export async function fetchProtectedFileFromWordPress(rawUrl: string): Promise<Response> {
  const site = await getCurrentServerSiteConfig()
  const secret = process.env.PROTECTED_FILES_SECRET

  if (!secret) {
    throw new Error('PROTECTED_FILES_SECRET is not configured.')
  }

  const resolvedUrl = resolveWordPressFileUrl(rawUrl, site.wordpressOrigin)
  const resolvedOrigin = new URL(resolvedUrl).origin

  if (resolvedOrigin !== site.wordpressOrigin || !isPrivateUploadsUrl(resolvedUrl)) {
    throw new Error('Only private upload URLs are allowed.')
  }

  return fetch(resolvedUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secret}`,
    },
    cache: 'no-store',
  })
}

import 'server-only'

import { isPrivateUploadsUrl } from './shared'

function getWordPressOrigin(): string {
  const endpoint =
    process.env.WORDPRESS_GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT

  if (!endpoint) {
    throw new Error('WordPress GraphQL endpoint is not configured.')
  }

  return new URL(endpoint).origin
}

function resolveWordPressFileUrl(rawUrl: string): string {
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl
  }

  if (rawUrl.startsWith('//')) {
    return `https:${rawUrl}`
  }

  return new URL(rawUrl, getWordPressOrigin()).toString()
}

export async function fetchProtectedFileFromWordPress(rawUrl: string): Promise<Response> {
  const secret = process.env.PROTECTED_FILES_SECRET

  if (!secret) {
    throw new Error('PROTECTED_FILES_SECRET is not configured.')
  }

  const resolvedUrl = resolveWordPressFileUrl(rawUrl)

  if (!isPrivateUploadsUrl(resolvedUrl)) {
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

import { notFound, redirect } from 'next/navigation'

import type { QueryWithAuthFallbackResult } from './queryWithAuthFallback'

export function isPreviewLoginRequired<T>(result: QueryWithAuthFallbackResult<T>) {
  return !!result.authRequired
}

export function requireProtectedContentData<T>(
  result: QueryWithAuthFallbackResult<T>,
  redirectPath: string
): T {
  if (result.authRequired) {
    redirect(`/login?redirect=${encodeURIComponent(redirectPath)}`)
  }

  if (!result.data) {
    notFound()
  }

  return result.data
}

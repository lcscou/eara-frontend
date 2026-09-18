import { headers } from 'next/headers'

import { getSiteConfig, type SiteConfig } from './site-config'

export async function getCurrentServerSiteConfig(): Promise<SiteConfig> {
  const requestHeaders = await headers()
  return getSiteConfig(requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || '')
}

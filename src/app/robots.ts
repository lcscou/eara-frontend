import type { MetadataRoute } from 'next'

import { getCurrentServerSiteConfig } from '@/lib/site-config-server'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getCurrentServerSiteConfig()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/maintenance'],
    },
    host: new URL(site.publicOrigin).host,
    sitemap: `${site.publicOrigin}/sitemap.xml`,
  }
}

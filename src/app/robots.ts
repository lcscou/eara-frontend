import type { MetadataRoute } from 'next'

import { PUBLIC_SITE_ORIGIN } from '@/lib/seo/site-url'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/maintenance'],
    },
    host: new URL(PUBLIC_SITE_ORIGIN).host,
    sitemap: `${PUBLIC_SITE_ORIGIN}/sitemap.xml`,
  }
}

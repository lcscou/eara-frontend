import type { NextRequest } from 'next/server'

import { proxySitemapXml } from '@/lib/seo/sitemap-proxy'

export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{
      slug: string[]
    }>
  }
): Promise<Response> {
  const { slug } = await context.params

  return proxySitemapXml({ upstreamPath: `/${slug.join('/')}` })
}

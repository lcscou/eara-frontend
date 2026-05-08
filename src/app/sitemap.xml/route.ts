import { proxySitemapXml } from '@/lib/seo/sitemap-proxy'

export const runtime = 'nodejs'

export async function GET(): Promise<Response> {
  return proxySitemapXml({ upstreamPath: '/sitemap_index.xml' })
}

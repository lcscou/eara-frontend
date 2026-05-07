import { proxySitemapXml, SITEMAP_REVALIDATE_SECONDS } from '@/lib/seo/sitemap-proxy'

export const runtime = 'nodejs'
export const revalidate = SITEMAP_REVALIDATE_SECONDS

export async function GET(): Promise<Response> {
  return proxySitemapXml({ upstreamPath: '/sitemap_index.xml' })
}

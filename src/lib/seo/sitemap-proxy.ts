import { PUBLIC_SITE_ORIGIN, WORDPRESS_SITE_ORIGIN } from '@/lib/seo/site-url'

const DEFAULT_REVALIDATE_SECONDS = 900
const DEFAULT_TIMEOUT_MS = 8_000
const DEFAULT_STALE_SECONDS = 86_400
const DEFAULT_STREAM_THRESHOLD_BYTES = 2 * 1024 * 1024

const REVALIDATE_SECONDS = readPositiveInt(
  process.env.SITEMAP_REVALIDATE_SECONDS,
  DEFAULT_REVALIDATE_SECONDS
)

const FETCH_TIMEOUT_MS = readPositiveInt(process.env.SITEMAP_FETCH_TIMEOUT_MS, DEFAULT_TIMEOUT_MS)

const STALE_SECONDS = readPositiveInt(process.env.SITEMAP_STALE_SECONDS, DEFAULT_STALE_SECONDS)

const STREAM_THRESHOLD_BYTES = readPositiveInt(
  process.env.SITEMAP_STREAM_THRESHOLD_BYTES,
  DEFAULT_STREAM_THRESHOLD_BYTES
)

const BACKEND_HOST = new URL(WORDPRESS_SITE_ORIGIN).host
const REWRITE_WINDOW_BYTES = Math.max(BACKEND_HOST.length + 32, 128)

const BACKEND_ORIGIN_REGEX = new RegExp(`https?:\\/\\/${escapeRegExp(BACKEND_HOST)}`, 'gi')
const BACKEND_PROTOCOL_RELATIVE_REGEX = new RegExp(`\\/\\/${escapeRegExp(BACKEND_HOST)}`, 'gi')

export const SITEMAP_REVALIDATE_SECONDS = REVALIDATE_SECONDS

type ProxySitemapOptions = {
  upstreamPath: string
}

export async function proxySitemapXml({ upstreamPath }: ProxySitemapOptions): Promise<Response> {
  const normalizedPath = normalizeSitemapPath(upstreamPath)
  if (!normalizedPath) {
    return textResponse('Invalid sitemap path.', 400)
  }

  const upstreamUrl = new URL(normalizedPath, `${WORDPRESS_SITE_ORIGIN}/`).toString()

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ['sitemaps', `sitemap:${normalizedPath}`],
      },
      headers: {
        Accept: 'application/xml, text/xml;q=0.9, application/xhtml+xml;q=0.8, */*;q=0.5',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })

    if (!upstreamResponse.ok) {
      if (upstreamResponse.status === 404) {
        return textResponse('Sitemap not found.', 404)
      }

      return textResponse('Upstream sitemap is unavailable.', 502)
    }

    return buildXmlResponse(upstreamResponse, normalizedPath)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return textResponse('Sitemap upstream timeout.', 504)
    }

    return textResponse('Failed to proxy sitemap.', 502)
  }
}

async function buildXmlResponse(upstream: Response, normalizedPath: string): Promise<Response> {
  const contentLength = Number.parseInt(upstream.headers.get('content-length') || '0', 10)
  const contentType = pickXmlContentType(upstream.headers.get('content-type'), normalizedPath)

  const headers = new Headers({
    'Content-Type': contentType,
    'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
    'X-Robots-Tag': 'noindex, follow',
    'X-Content-Type-Options': 'nosniff',
    Vary: 'Accept-Encoding',
  })

  if (upstream.body && contentLength >= STREAM_THRESHOLD_BYTES) {
    return new Response(rewriteXmlStream(upstream.body), {
      status: 200,
      headers,
    })
  }

  return new Response(await rewriteXmlStringSync(upstream), {
    status: 200,
    headers,
  })
}

function rewriteXmlStringSync(upstream: Response): Promise<string> {
  return upstream.text().then((xml) => rewriteOrigin(xml))
}

function rewriteXmlStream(stream: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let carryOver = ''

  return stream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        const text = carryOver + decoder.decode(chunk, { stream: true })

        if (text.length <= REWRITE_WINDOW_BYTES) {
          carryOver = text
          return
        }

        const splitAt = text.length - REWRITE_WINDOW_BYTES
        const writable = text.slice(0, splitAt)
        carryOver = text.slice(splitAt)

        controller.enqueue(encoder.encode(rewriteOrigin(writable)))
      },
      flush(controller) {
        const remaining = carryOver + decoder.decode()
        if (remaining) {
          controller.enqueue(encoder.encode(rewriteOrigin(remaining)))
        }
      },
    })
  )
}

function rewriteOrigin(xml: string): string {
  return xml
    .replace(BACKEND_ORIGIN_REGEX, PUBLIC_SITE_ORIGIN)
    .replace(BACKEND_PROTOCOL_RELATIVE_REGEX, `//${new URL(PUBLIC_SITE_ORIGIN).host}`)
}

function normalizeSitemapPath(rawPath: string): string | null {
  if (!rawPath) return null

  const normalized = rawPath.startsWith('/') ? rawPath : `/${rawPath}`

  if (!/^\/[A-Za-z0-9._~\-/%/]+$/.test(normalized)) {
    return null
  }

  if (normalized.includes('..')) {
    return null
  }

  const lower = normalized.toLowerCase()
  if (!lower.endsWith('.xml') && !lower.endsWith('.xsl')) {
    return null
  }

  return normalized
}

function pickXmlContentType(upstreamContentType: string | null, path: string): string {
  if (upstreamContentType && /xml|xsl/i.test(upstreamContentType)) {
    return upstreamContentType
  }

  return path.toLowerCase().endsWith('.xsl')
    ? 'text/xsl; charset=utf-8'
    : 'application/xml; charset=utf-8'
}

function textResponse(message: string, status: number): Response {
  return new Response(message, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

function readPositiveInt(raw: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(raw || '', 10)
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback
  }
  return parsed
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

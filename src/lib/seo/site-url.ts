const DEFAULT_PUBLIC_SITE_ORIGIN = 'https://eara.eu'
const DEFAULT_WORDPRESS_SITE_ORIGIN = 'https://backofficeadmin.eara.eu'

function normalizeOrigin(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback

  try {
    const normalized = new URL(raw)
    return normalized.origin
  } catch {
    return fallback
  }
}

function inferWordPressOriginFromGraphQLEndpoint(): string | undefined {
  const endpoint =
    process.env.WORDPRESS_GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT

  if (!endpoint) return undefined

  try {
    return new URL(endpoint).origin
  } catch {
    return undefined
  }
}

export const PUBLIC_SITE_ORIGIN = normalizeOrigin(
  process.env.NEXT_PUBLIC_SITE_URL,
  DEFAULT_PUBLIC_SITE_ORIGIN
)

export const WORDPRESS_SITE_ORIGIN = normalizeOrigin(
  process.env.WORDPRESS_SITE_ORIGIN ||
    process.env.NEXT_PUBLIC_WORDPRESS_SITE_ORIGIN ||
    inferWordPressOriginFromGraphQLEndpoint(),
  DEFAULT_WORDPRESS_SITE_ORIGIN
)

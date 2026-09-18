export interface SiteConfig {
  key: string
  hostnames: string[]
  publicOrigin: string
  wordpressOrigin: string
  graphqlEndpoint: string
}

const DEFAULT_SITE: SiteConfig = {
  key: 'default',
  hostnames: [],
  publicOrigin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  wordpressOrigin:
    process.env.WORDPRESS_SITE_ORIGIN ||
    process.env.NEXT_PUBLIC_WORDPRESS_SITE_ORIGIN ||
    'http://eara.local',
  graphqlEndpoint:
    process.env.WORDPRESS_GRAPHQL_ENDPOINT ||
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
    'http://eara.local/graphql',
}

function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/:\d+$/, '')
}

function normalizeOrigin(origin: string, fallback: string): string {
  try {
    return new URL(origin).origin
  } catch {
    return fallback
  }
}

function parseConfiguredSites(): SiteConfig[] {
  const raw = process.env.NEXT_PUBLIC_WORDPRESS_SITES
  if (!raw) return [DEFAULT_SITE]

  try {
    const configured = JSON.parse(raw) as unknown
    if (!Array.isArray(configured)) return [DEFAULT_SITE]

    const sites = configured.flatMap((site): SiteConfig[] => {
      if (!site || typeof site !== 'object') return []

      const candidate = site as Partial<SiteConfig>
      if (
        typeof candidate.key !== 'string' ||
        !Array.isArray(candidate.hostnames) ||
        typeof candidate.publicOrigin !== 'string' ||
        typeof candidate.wordpressOrigin !== 'string' ||
        typeof candidate.graphqlEndpoint !== 'string'
      ) {
        return []
      }

      return [
        {
          key: candidate.key,
          hostnames: candidate.hostnames.filter(
            (hostname): hostname is string => typeof hostname === 'string'
          ),
          publicOrigin: normalizeOrigin(candidate.publicOrigin, DEFAULT_SITE.publicOrigin),
          wordpressOrigin: normalizeOrigin(candidate.wordpressOrigin, DEFAULT_SITE.wordpressOrigin),
          graphqlEndpoint: candidate.graphqlEndpoint,
        },
      ]
    })

    return sites.length ? sites : [DEFAULT_SITE]
  } catch {
    return [DEFAULT_SITE]
  }
}

export function getSiteConfigs(): SiteConfig[] {
  return parseConfiguredSites()
}

export function getSiteConfig(hostname?: string): SiteConfig {
  const normalizedHostname = hostname ? normalizeHostname(hostname) : undefined
  const sites = getSiteConfigs()

  if (!normalizedHostname) return sites[0]

  return (
    sites.find((site) =>
      site.hostnames.some((siteHostname) => normalizeHostname(siteHostname) === normalizedHostname)
    ) || sites[0]
  )
}

export function getSiteConfigByKey(key: string): SiteConfig | undefined {
  return getSiteConfigs().find((site) => site.key === key)
}

export function getCurrentSiteConfig(): SiteConfig {
  if (typeof window === 'undefined') return getSiteConfig()
  return getSiteConfig(window.location.hostname)
}

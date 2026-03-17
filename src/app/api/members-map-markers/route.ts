import { NextResponse } from 'next/server'

const MEMBERS_PAGE_SIZE = 100
const REVALIDATE_SECONDS = 0

const GET_MEMBERS_MAP_MARKERS_QUERY = `
  query GetMembersMapMarkers($first: Int, $after: String) {
    members(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        title
        featuredImage {
          node {
            guid
          }
        }
        acfMembers {
          website
          geolocation {
            latitude
            longitude
          }
        }
      }
    }
  }
`

type MembersGraphQLResponse = {
  data?: {
    members?: {
      pageInfo?: {
        hasNextPage?: boolean | null
        endCursor?: string | null
      } | null
      nodes?: Array<{
        id?: string | null
        databaseId?: number | null
        title?: string | null
        featuredImage?: { node?: { guid?: string | null } | null } | null
        acfMembers?: {
          website?: string | null
          geolocation?: {
            latitude?: string | null
            longitude?: string | null
          } | null
        } | null
      } | null> | null
    } | null
  }
  errors?: Array<{ message?: string }>
}

type MapMarker = {
  id: string
  title: string
  latitude: number
  longitude: number
  featuredImage?: string
  website?: string
}

type CoordinateType = 'lat' | 'lng'

type NormalizationResult = {
  value: number | null
  wasAdjusted: boolean
}

type DiscardedMapMarker = {
  id: string
  title: string
  latitude: string | null | undefined
  longitude: string | null | undefined
}

type FixedMapMarker = {
  id: string
  title: string
  originalLatitude: string | null | undefined
  originalLongitude: string | null | undefined
  normalizedLatitude: number
  normalizedLongitude: number
}

type DuplicateMapMarker = {
  id: string
  title: string
  latitude: number
  longitude: number
}

function normalizeCoordinate(
  value: string | null | undefined,
  type: CoordinateType
): NormalizationResult {
  const min = type === 'lat' ? -90 : -180
  const max = type === 'lat' ? 90 : 180

  if (!value) return { value: null, wasAdjusted: false }

  let wasAdjusted = false
  let normalized = value.trim().replace(/\s+/g, '')
  if (normalized !== value) wasAdjusted = true
  if (!normalized) return { value: null, wasAdjusted }

  const onlyValidCharacters = normalized.replace(/[^0-9,\.\-+]/g, '')
  if (onlyValidCharacters !== normalized) wasAdjusted = true
  normalized = onlyValidCharacters
  if (!normalized) return { value: null, wasAdjusted }

  const sign = normalized.startsWith('-') ? '-' : normalized.startsWith('+') ? '+' : ''
  const withoutInnerSigns = normalized.slice(sign ? 1 : 0).replace(/[+-]/g, '')
  if (`${sign}${withoutInnerSigns}` !== normalized) wasAdjusted = true
  normalized = `${sign}${withoutInnerSigns}`

  const commaCount = (normalized.match(/,/g) ?? []).length
  const dotCount = (normalized.match(/\./g) ?? []).length

  if (commaCount > 0 && dotCount > 0) {
    normalized = normalized.replace(/,/g, '.')
    const firstDotIndex = normalized.indexOf('.')
    normalized = `${normalized.slice(0, firstDotIndex + 1)}${normalized
      .slice(firstDotIndex + 1)
      .replace(/\./g, '')}`
    wasAdjusted = true
  } else if (commaCount > 0) {
    const firstCommaIndex = normalized.indexOf(',')
    normalized = `${normalized.slice(0, firstCommaIndex)}.${normalized
      .slice(firstCommaIndex + 1)
      .replace(/,/g, '')}`
    wasAdjusted = true
  } else if (dotCount > 1) {
    const firstDotIndex = normalized.indexOf('.')
    normalized = `${normalized.slice(0, firstDotIndex + 1)}${normalized
      .slice(firstDotIndex + 1)
      .replace(/\./g, '')}`
    wasAdjusted = true
  }

  const parsed = Number.parseFloat(normalized)
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return { value: null, wasAdjusted }
  }

  return { value: parsed, wasAdjusted }
}

async function fetchMembersPage(after?: string | null): Promise<MembersGraphQLResponse> {
  const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT

  if (!endpoint) {
    throw new Error('Missing NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GET_MEMBERS_MAP_MARKERS_QUERY,
      variables: {
        first: MEMBERS_PAGE_SIZE,
        after: after ?? null,
      },
    }),
    next: {
      revalidate: REVALIDATE_SECONDS,
      tags: ['members', 'members-map-markers'],
    },
  })

  if (!response.ok) {
    throw new Error(`WordPress GraphQL request failed with status ${response.status}`)
  }

  return (await response.json()) as MembersGraphQLResponse
}

export async function GET() {
  try {
    const markers: MapMarker[] = []
    const discardedMarkers: DiscardedMapMarker[] = []
    const fixedMarkers: FixedMapMarker[] = []
    const duplicateMarkers: DuplicateMapMarker[] = []
    const seenMarkerIds = new Set<string>()
    let hasNextPage = true
    let cursor: string | null | undefined = undefined

    while (hasNextPage) {
      const result = await fetchMembersPage(cursor)

      if (result.errors?.length) {
        const message = result.errors
          .map((error) => error.message)
          .filter(Boolean)
          .join('; ')
        throw new Error(message || 'Unknown GraphQL error')
      }

      const nodes = result.data?.members?.nodes ?? []
      for (const node of nodes) {
        const id = node?.databaseId?.toString() || node?.id
        if (!id) continue

        const title = node?.title || 'Untitled'
        const rawLatitude = node?.acfMembers?.geolocation?.latitude
        const rawLongitude = node?.acfMembers?.geolocation?.longitude
        const latResult = normalizeCoordinate(rawLatitude, 'lat')
        const lonResult = normalizeCoordinate(rawLongitude, 'lng')
        const lat = latResult.value
        const lon = lonResult.value

        if (lat === null || lon === null) {
          discardedMarkers.push({
            id,
            title,
            latitude: rawLatitude,
            longitude: rawLongitude,
          })
          continue
        }

        if (latResult.wasAdjusted || lonResult.wasAdjusted) {
          fixedMarkers.push({
            id,
            title,
            originalLatitude: rawLatitude,
            originalLongitude: rawLongitude,
            normalizedLatitude: lat,
            normalizedLongitude: lon,
          })
        }

        if (seenMarkerIds.has(id)) {
          duplicateMarkers.push({
            id,
            title,
            latitude: lat,
            longitude: lon,
          })
          continue
        }
        seenMarkerIds.add(id)

        markers.push({
          id,
          title,
          latitude: lat,
          longitude: lon,
          featuredImage: node?.featuredImage?.node?.guid || '/logo-eara.svg',
          website: node?.acfMembers?.website || undefined,
        })
      }

      hasNextPage = Boolean(result.data?.members?.pageInfo?.hasNextPage)
      cursor = result.data?.members?.pageInfo?.endCursor
    }

    if (fixedMarkers.length > 0) {
      console.info('[members-map-markers] Coordenadas normalizadas automaticamente:', fixedMarkers)
    }

    if (discardedMarkers.length > 0) {
      console.error(
        '[members-map-markers] Coordenadas descartadas por formato invalido:',
        discardedMarkers
      )
    }

    if (duplicateMarkers.length > 0) {
      console.warn(
        '[members-map-markers] Marcadores duplicados por id foram ignorados:',
        duplicateMarkers
      )
    }

    return NextResponse.json(
      {
        markers,
        total: markers.length,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to load members map markers',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'

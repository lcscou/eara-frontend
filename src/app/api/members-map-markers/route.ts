import { NextResponse } from 'next/server'

const MEMBERS_PAGE_SIZE = 100
const REVALIDATE_SECONDS = 3600

const GET_MEMBERS_MAP_MARKERS_QUERY = `
  query GetMembersMapMarkers($first: Int, $after: String) {
    members(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
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
        const id = node?.id
        if (!id) continue

        const lat = Number.parseFloat(node?.acfMembers?.geolocation?.latitude ?? '')
        const lon = Number.parseFloat(node?.acfMembers?.geolocation?.longitude ?? '')

        if (Number.isNaN(lat) || Number.isNaN(lon)) continue

        markers.push({
          id,
          title: node?.title || 'Sem titulo',
          latitude: lat,
          longitude: lon,
          featuredImage: node?.featuredImage?.node?.guid || '/logo-eara.svg',
          website: node?.acfMembers?.website || undefined,
        })
      }

      hasNextPage = Boolean(result.data?.members?.pageInfo?.hasNextPage)
      cursor = result.data?.members?.pageInfo?.endCursor
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

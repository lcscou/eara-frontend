import { ApolloLink, HttpLink } from '@apollo/client'
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs'
import { setContext } from '@apollo/client/link/context'
import { RetryLink } from '@apollo/client/link/retry'

import { getAuthToken } from './auth/server'

type NetworkErrorLike = {
  statusCode?: number
  response?: {
    status?: number
  }
  message?: string
}

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504])

function getNetworkStatusCode(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined

  const candidate = error as NetworkErrorLike

  if (typeof candidate.statusCode === 'number') {
    return candidate.statusCode
  }

  if (typeof candidate.response?.status === 'number') {
    return candidate.response.status
  }

  return undefined
}

function shouldRetryApolloRequest(error: unknown) {
  const statusCode = getNetworkStatusCode(error)
  if (statusCode) {
    return RETRYABLE_STATUS_CODES.has(statusCode)
  }

  if (!error || typeof error !== 'object') return false

  const message = String((error as NetworkErrorLike).message || '').toLowerCase()

  return (
    message.includes('network') ||
    message.includes('fetch failed') ||
    message.includes('bad gateway') ||
    message.includes('econnreset') ||
    message.includes('etimedout')
  )
}

function createRetryLink() {
  return new RetryLink({
    delay: {
      initial: 300,
      max: 2000,
      jitter: true,
    },
    attempts: {
      max: 3,
      retryIf: (error) => shouldRetryApolloRequest(error),
    },
  })
}

// Cache policy configurada para melhor performance
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Merge inteligente para queries paginadas
        posts: {
          keyArgs: ['where'],
          merge(existing, incoming, { args }) {
            if (!existing) return incoming
            if (args?.after) {
              return {
                ...incoming,
                nodes: [...(existing.nodes || []), ...(incoming.nodes || [])],
              }
            }
            return incoming
          },
        },
        allNews: {
          keyArgs: ['where'],
          merge(existing, incoming, { args }) {
            if (!existing) return incoming
            if (args?.after) {
              return {
                ...incoming,
                nodes: [...(existing.nodes || []), ...(incoming.nodes || [])],
              }
            }
            return incoming
          },
        },
        menus: {
          merge(existing) {
            return existing
          },
        },
        page: {
          merge(existing) {
            return existing
          },
        },
        allTeams: {
          merge(existing) {
            return existing
          },
        },
        team: {
          merge(existing) {
            return existing
          },
        },
        pressRelease: {
          merge(existing) {
            return existing
          },
        },
        allPressReleases: {
          merge(existing) {
            return existing
          },
        },
        members: {
          keyArgs: ['where', 'first', 'last'],
          merge(existing, incoming, { args }) {
            if (!existing) return incoming

            const dedupeById = (nodes: Array<{ id?: string | null } | null | undefined>) => {
              const seen = new Set<string>()
              return nodes.filter((node) => {
                const id = node?.id
                if (!id) return true
                if (seen.has(id)) return false
                seen.add(id)
                return true
              })
            }

            if (args?.after) {
              return {
                ...incoming,
                nodes: dedupeById([...(existing.nodes || []), ...(incoming.nodes || [])]),
              }
            }

            if (args?.before) {
              return {
                ...incoming,
                nodes: dedupeById([...(incoming.nodes || []), ...(existing.nodes || [])]),
              }
            }

            // Sem cursor (mudança de filtro/busca): substitui pela nova primeira página.
            return incoming
          },
        },
        news: {
          merge(existing) {
            return existing
          },
        },

        offices: {
          merge(existing) {
            return existing
          },
        },
        events: {
          merge(existing) {
            return existing
          },
        },
        animal: {
          merge(existing) {
            return existing
          },
        },
        animals: {
          merge(existing) {
            return existing
          },
        },
        diseases: {
          merge(existing) {
            return existing
          },
        },
        allEvents: {
          keyArgs: ['where'],
          merge(existing, incoming, { args }) {
            if (!existing) return incoming
            if (args?.after) {
              return {
                ...incoming,
                nodes: [...(existing.nodes || []), ...(incoming.nodes || [])],
              }
            }
            return incoming
          },
        },
      },
    },
  },
})

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache,
    link: ApolloLink.from([
      createRetryLink(),
      new HttpLink({
        uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
        fetchOptions: {
          next: {
            revalidate: 3600, // Cache de 1 hora por padrão
          },
        },
      }),
    ]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
  })
})

/**
 * Cria um Apollo Client autenticado para acessar conteúdos privados do WordPress
 * Usa o token JWT armazenado no cookie para autenticar as requisições
 *
 * @example
 * ```tsx
 * import { getAuthenticatedClient } from '@/lib/apollo-client'
 *
 * const client = await getAuthenticatedClient()
 * const { data } = await client.query({
 *   query: PRIVATE_CONTENT_QUERY,
 * })
 * ```
 */
export async function getAuthenticatedClient() {
  const token = await getAuthToken()

  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    }
  })

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,

    fetchOptions: {
      cache: 'no-store', // Conteúdo privado não deve ser cacheado
    },
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([createRetryLink(), authLink, httpLink]),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only', // Sempre buscar do servidor para conteúdo autenticado
        errorPolicy: 'all',
      },
    },
  })
}

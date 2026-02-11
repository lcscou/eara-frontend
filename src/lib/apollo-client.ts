import { HttpLink } from '@apollo/client'
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs'
import { setContext } from '@apollo/client/link/context'

import { getAuthToken } from './auth/server'

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
          merge(existing) {
            return existing
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
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
      fetchOptions: {
        next: {
          revalidate: 3600, // Cache de 1 hora por padrão
        },
      },
    }),
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
    link: authLink.concat(httpLink),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only', // Sempre buscar do servidor para conteúdo autenticado
        errorPolicy: 'all',
      },
    },
  })
}

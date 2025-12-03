import { HttpLink } from '@apollo/client'
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs'

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

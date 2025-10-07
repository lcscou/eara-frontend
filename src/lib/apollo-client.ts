import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client";

export function createApolloClient(initialState: NormalizedCacheObject = {}) {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
      credentials: "same-origin",
    }),
    cache: new InMemoryCache().restore(initialState),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
        returnPartialData: true,
      },
    },
  });
}

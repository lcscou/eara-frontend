import { HttpLink } from "@apollo/client";
import {
  registerApolloClient ,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

// import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';


export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
    }),
  });
});
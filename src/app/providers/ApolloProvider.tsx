// components/ApolloProvider.tsx
'use client';

import React from 'react';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react';
import { NormalizedCacheObject } from '@apollo/client';

// If using integration helper:
// import { useApollo, ApolloNextProvider } from '@/lib/apollo-client';

// If fallback:
import { createApolloClient } from '@/lib/apollo-client';

interface ApolloProviderProps {
  children: React.ReactNode;
  initialApolloState?: NormalizedCacheObject;
}

export function ApolloProvider({ children, initialApolloState }: ApolloProviderProps) {
  // Option A: integration helper
  // try {
  //   const apollo = useApollo(initialApolloState);
  //   return <ApolloNextProvider client={apollo}>{children}</ApolloNextProvider>;
  // } catch (_e) {
  //   // fallback path
  // }

  // Option B: manual fallback
  const client = React.useMemo(() => createApolloClient(initialApolloState), [initialApolloState]);
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}

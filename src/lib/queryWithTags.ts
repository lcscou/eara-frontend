import { DocumentNode, OperationVariables } from '@apollo/client'

import { getClient } from './apollo-client'
import { getCurrentServerSiteConfig } from './site-config-server'

interface QueryWithTagsOptions<TVariables extends OperationVariables = OperationVariables> {
  query: DocumentNode
  variables?: TVariables
  tags?: string[]
  revalidate?: number | false
}

/**
 * Executa uma query GraphQL com suporte a cache tags do Next.js
 * Permite revalidação granular via tags
 */
export async function queryWithTags<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>({ query, variables, tags = [], revalidate = 3600 }: QueryWithTagsOptions<TVariables>) {
  const client = getClient()
  const site = await getCurrentServerSiteConfig()

  return client.query<TData, TVariables>({
    query,
    variables: variables as TVariables,
    context: {
      fetchOptions: {
        next: {
          revalidate,
          tags: [`site:${site.key}:wordpress`, ...tags.map((tag) => `site:${site.key}:${tag}`)],
        },
      },
    },
  })
}

import type { ApolloQueryResult, DocumentNode, OperationVariables } from '@apollo/client'

import {
  GetPreviewAccessByUriDocument,
  type GetPreviewAccessByUriQuery,
  type GetPreviewAccessByUriQueryVariables,
} from '@/graphql/generated/graphql'

import { getAuthenticatedClient, getClient } from './apollo-client'
import { validateAuthToken } from './auth/server'

type GraphQLErrorLike = {
  message?: string
  extensions?: {
    code?: string
  }
}

type QueryContext = {
  fetchOptions?: Record<string, unknown>
  [key: string]: unknown
}

export type QueryWithAuthFallbackOptions<
  TVariables extends OperationVariables = OperationVariables,
> = {
  query: DocumentNode
  variables?: TVariables
  context?: QueryContext
  previewUri?: string
}

export type AuthReason = 'private' | 'preview'

export type QueryWithAuthFallbackResult<TData> = {
  data?: TData
  errors?: readonly GraphQLErrorLike[]
  error?: unknown
  usedAuth: boolean
  authRequired?: boolean
  authReason?: AuthReason
}

const AUTH_ERROR_CODES = new Set(['FORBIDDEN', 'UNAUTHENTICATED', 'NOT_AUTHORIZED'])

function isAuthError(errors?: readonly GraphQLErrorLike[]) {
  if (!errors || errors.length === 0) return false

  return errors.some((error) => {
    const code = error.extensions?.code?.toUpperCase()
    if (code && AUTH_ERROR_CODES.has(code)) return true

    const message = (error.message || '').toLowerCase()
    return (
      message.includes('not authorized') ||
      message.includes('not permitted') ||
      message.includes('private') ||
      message.includes('permission') ||
      message.includes('login')
    )
  })
}

function getGraphQLErrors(error: unknown): readonly GraphQLErrorLike[] | undefined {
  if (!error || typeof error !== 'object') return undefined
  const candidate = (error as { graphQLErrors?: unknown }).graphQLErrors
  return Array.isArray(candidate) ? (candidate as readonly GraphQLErrorLike[]) : undefined
}

function getResultErrors(result: unknown): readonly GraphQLErrorLike[] | undefined {
  if (!result || typeof result !== 'object') return undefined
  const candidate = (result as { errors?: unknown }).errors
  return Array.isArray(candidate) ? (candidate as readonly GraphQLErrorLike[]) : undefined
}

type ContentAccessMetadata = {
  status?: string | null
  isPreview?: boolean | null
}

function getContentAccessMetadata(data: unknown): ContentAccessMetadata | undefined {
  if (!data || typeof data !== 'object') return undefined

  const dataObj = data as Record<string, unknown>
  for (const value of Object.values(dataObj)) {
    if (value && typeof value === 'object') {
      const node = value as ContentAccessMetadata
      if (typeof node.status === 'string' || typeof node.isPreview === 'boolean') {
        return node
      }
    }
  }

  return undefined
}

function getAuthReasonFromMetadata(
  metadata?: ContentAccessMetadata | null
): AuthReason | undefined {
  const status = metadata?.status?.toUpperCase()

  if (status === 'PRIVATE') {
    return 'private'
  }

  if (metadata?.isPreview || (status && status !== 'PUBLISH')) {
    return 'preview'
  }

  return undefined
}

function withProtectedContentVariables<TVariables extends OperationVariables>(
  variables: TVariables | undefined,
  enabled: boolean
): TVariables {
  if (!enabled) {
    return (variables ?? {}) as OperationVariables as unknown as TVariables
  }

  return {
    ...(variables ? (variables as Record<string, unknown>) : {}),
    asPreview: true,
  } as unknown as TVariables
}

async function detectPreviewAccessByUri(
  previewUri: string,
  context?: QueryContext
): Promise<{ authRequired: boolean; authReason?: AuthReason }> {
  const client = getClient()
  const existingFetchOptions = (context?.fetchOptions as Record<string, unknown> | undefined) ?? {}

  const previewResult = (await client.query<
    GetPreviewAccessByUriQuery,
    GetPreviewAccessByUriQueryVariables
  >({
    query: GetPreviewAccessByUriDocument,
    variables: {
      id: previewUri,
      asPreview: true,
    },
    context: {
      ...context,
      fetchOptions: {
        ...existingFetchOptions,
        cache: 'no-store',
      },
    },
    errorPolicy: 'all',
  })) as ApolloQueryResult<GetPreviewAccessByUriQuery>

  const previewErrors = getGraphQLErrors(previewResult.error) ?? getResultErrors(previewResult)
  const previewAuthReason = getAuthReasonFromMetadata(previewResult.data?.contentNode)

  if (previewAuthReason) {
    return {
      authRequired: true,
      authReason: previewAuthReason,
    }
  }

  if (isAuthError(previewErrors)) {
    return {
      authRequired: true,
      authReason: 'preview',
    }
  }

  return {
    authRequired: false,
  }
}

export async function queryWithAuthFallback<
  TData,
  TVariables extends OperationVariables = OperationVariables,
>({
  query,
  variables,
  context,
  previewUri,
}: QueryWithAuthFallbackOptions<TVariables>): Promise<QueryWithAuthFallbackResult<TData>> {
  const client = getClient()
  const result = (await client.query<TData, TVariables>({
    query,
    variables: variables as TVariables,
    context,
    errorPolicy: 'all',
  })) as ApolloQueryResult<TData>

  const graphQLErrors = getGraphQLErrors(result.error) ?? getResultErrors(result)

  // Se há erro explícito de autenticação, tenta com credenciais
  const hasAuthError = isAuthError(graphQLErrors)

  const publicMetadata = getContentAccessMetadata(result.data)
  const publicAuthReason = getAuthReasonFromMetadata(publicMetadata)

  // Se data é null/undefined, pode ser privado ou inexistente
  // Tentamos com credenciais se o usuário estiver logado
  const isNullData = !result.data || Object.values(result.data as object).every((v) => v === null)

  // Se tem dados públicos (não privado, não null, sem erro), retorna
  if (!hasAuthError && !isNullData && !publicAuthReason) {
    return {
      data: result.data as TData | undefined,
      errors: graphQLErrors,
      error: result.error,
      usedAuth: false,
    }
  }

  // Se tem erro de auth, data null ou conteúdo privado, verifica se há token válido
  const hasValidToken = await validateAuthToken()
  if (!hasValidToken) {
    const previewAccess =
      !publicAuthReason && previewUri
        ? await detectPreviewAccessByUri(previewUri, context)
        : undefined

    return {
      data: result.data as TData | undefined,
      errors: graphQLErrors,
      error: result.error,
      usedAuth: false,
      authRequired: hasAuthError || !!publicAuthReason || previewAccess?.authRequired,
      authReason: publicAuthReason ?? previewAccess?.authReason,
    }
  }

  // Tenta query autenticada
  const authClient = await getAuthenticatedClient()
  const authResult = (await authClient.query<TData, TVariables>({
    query,
    variables: withProtectedContentVariables(variables, !!previewUri),
    context: {
      ...context,
      fetchOptions: {
        cache: 'no-store',
      },
    },
    errorPolicy: 'all',
  })) as ApolloQueryResult<TData>

  // Se a query autenticada também falhar com erro de auth, token expirou
  const authErrors = getGraphQLErrors(authResult.error) ?? getResultErrors(authResult)
  const authMetadata = getContentAccessMetadata(authResult.data)
  const authReason = getAuthReasonFromMetadata(authMetadata)

  if (isAuthError(authErrors)) {
    const previewAccess =
      !authReason && previewUri ? await detectPreviewAccessByUri(previewUri, context) : undefined

    return {
      data: authResult.data as TData | undefined,
      errors: authErrors,
      error: authResult.error,
      usedAuth: true,
      authRequired: true,
      authReason: authReason ?? previewAccess?.authReason,
    }
  }

  return {
    data: authResult.data as TData | undefined,
    errors: authErrors,
    error: authResult.error,
    usedAuth: true,
    authReason,
  }
}

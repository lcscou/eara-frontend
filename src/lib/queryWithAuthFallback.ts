import type { ApolloQueryResult, DocumentNode, OperationVariables } from '@apollo/client'

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
}

export type QueryWithAuthFallbackResult<TData> = {
  data?: TData
  errors?: readonly GraphQLErrorLike[]
  error?: unknown
  usedAuth: boolean
  authRequired?: boolean
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

function isPrivateContent(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false

  // Verifica se algum nó no resultado tem status PRIVATE
  const dataObj = data as Record<string, unknown>
  for (const value of Object.values(dataObj)) {
    if (value && typeof value === 'object') {
      const node = value as { status?: string }
      if (node.status === 'PRIVATE') {
        return true
      }
    }
  }

  return false
}

export async function queryWithAuthFallback<
  TData,
  TVariables extends OperationVariables = OperationVariables,
>({
  query,
  variables,
  context,
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

  // Verifica se o conteúdo tem status PRIVATE
  const isPrivate = isPrivateContent(result.data)

  // Se data é null/undefined, pode ser privado ou inexistente
  // Tentamos com credenciais se o usuário estiver logado
  const isNullData = !result.data || Object.values(result.data as object).every((v) => v === null)

  // Se tem dados públicos (não privado, não null, sem erro), retorna
  if (!hasAuthError && !isNullData && !isPrivate) {
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
    return {
      data: result.data as TData | undefined,
      errors: graphQLErrors,
      error: result.error,
      usedAuth: false,
      authRequired: hasAuthError || isPrivate, // Marca como authRequired se há erro de auth ou status PRIVATE
    }
  }

  // Tenta query autenticada
  const authClient = await getAuthenticatedClient()
  const authResult = (await authClient.query<TData, TVariables>({
    query,
    variables: variables as TVariables,
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
  if (isAuthError(authErrors)) {
    return {
      data: authResult.data as TData | undefined,
      errors: authErrors,
      error: authResult.error,
      usedAuth: true,
      authRequired: true, // Token expirado - precisa fazer login novamente
    }
  }

  return {
    data: authResult.data as TData | undefined,
    errors: authErrors,
    error: authResult.error,
    usedAuth: true,
  }
}

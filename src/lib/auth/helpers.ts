import { getAuthToken, validateAuthToken } from './server'

/**
 * Verifica se o usuário está autenticado
 *
 * @param validate - Se true, valida o token contra o WordPress (mais lento mas preciso)
 * @returns true se o usuário tem um token de autenticação válido
 *
 * @example
 * ```tsx
 * import { isAuthenticated } from '@/lib/auth/helpers'
 *
 * export default async function ProtectedPage() {
 *   // Validação rápida (apenas verifica se o cookie existe)
 *   if (!(await isAuthenticated())) {
 *     redirect('/login')
 *   }
 *
 *   // Validação completa (verifica se o token é válido no WordPress)
 *   if (!(await isAuthenticated(true))) {
 *     redirect('/login')
 *   }
 * }
 * ```
 */
export async function isAuthenticated(validate = false): Promise<boolean> {
  if (!validate) {
    const token = await getAuthToken()
    return !!token
  }

  return await validateAuthToken()
}

/**
 * Retorna o usuário autenticado ou null
 * Útil para componentes que precisam saber qual usuário está logado
 *
 * @returns Objeto com informações básicas do token ou null
 *
 * @example
 * ```tsx
 * import { getCurrentUser } from '@/lib/auth/helpers'
 *
 * export default async function UserProfile() {
 *   const user = await getCurrentUser()
 *
 *   if (!user) {
 *     return <div>Você precisa estar logado</div>
 *   }
 *
 *   return <div>Olá, {user.email}!</div>
 * }
 * ```
 */
export async function getCurrentUser() {
  const token = await getAuthToken()

  if (!token) {
    return null
  }

  try {
    // Decodifica o JWT para extrair informações do usuário
    // O token JWT é no formato: header.payload.signature
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))

    return {
      id: decoded.data?.user?.id,
      email: decoded.data?.user?.email,
      username: decoded.data?.user?.username,
    }
  } catch (error) {
    console.error('Erro ao decodificar token:', error)
    return null
  }
}

/**
 * Tipo de status de conteúdo do WordPress
 */
export type ContentStatus = 'PUBLISH' | 'PRIVATE' | 'DRAFT' | 'PENDING' | 'FUTURE'

/**
 * Verifica se um status de conteúdo requer autenticação
 *
 * @param status - Status do conteúdo do WordPress
 * @returns true se o conteúdo requer autenticação
 *
 * @example
 * ```tsx
 * import { requiresAuth } from '@/lib/auth/helpers'
 * import { getClient, getAuthenticatedClient } from '@/lib/apollo-client'
 *
 * const status = 'PRIVATE'
 * const client = requiresAuth(status)
 *   ? await getAuthenticatedClient()
 *   : getClient()
 * ```
 */
export function requiresAuth(status: ContentStatus): boolean {
  return status !== 'PUBLISH'
}

import { getAuthToken } from './server'

/**
 * Verifica se o usuário está autenticado
 *
 * @returns true se o usuário tem um token de autenticação válido
 *
 * @example
 * ```tsx
 * import { isAuthenticated } from '@/lib/auth/helpers'
 *
 * export default async function ProtectedPage() {
 *   if (!(await isAuthenticated())) {
 *     redirect('/login')
 *   }
 *
 *   // Renderizar conteúdo protegido
 * }
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken()
  return !!token
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

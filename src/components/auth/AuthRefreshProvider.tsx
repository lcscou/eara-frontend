'use client'

import { useAuthRefresh } from '@/hooks/useAuthRefresh'

/**
 * Componente que gerencia o refresh automático do token de autenticação
 * Deve ser incluído no layout raiz para funcionar em todas as páginas
 */
export function AuthRefreshProvider() {
  useAuthRefresh()
  return null
}

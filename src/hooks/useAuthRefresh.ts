'use client'

import { useEffect } from 'react'

/**
 * Hook que automaticamente renova o token de autenticação antes dele expirar
 * Deve ser usado em um componente que fica montado durante toda a sessão
 */
export function useAuthRefresh() {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    async function checkAndRefreshToken() {
      try {
        // Verifica se o usuário está autenticado
        const meResponse = await fetch('/api/auth/me', { credentials: 'include' })
        const meData = await meResponse.json()

        if (!meData.authenticated || !meData.authTokenExpiration) {
          return
        }

        const now = Date.now() / 1000 // Timestamp em segundos
        const expiresIn = meData.authTokenExpiration - now

        // Se o token vai expirar em menos de 5 minutos, faz refresh
        if (expiresIn < 5 * 60) {
          console.log('Token expirando em breve, fazendo refresh...')
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          })

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json()
            console.log('Token renovado com sucesso')

            // Agenda próxima verificação
            if (refreshData.authTokenExpiration) {
              const newExpiresIn = refreshData.authTokenExpiration - Date.now() / 1000
              const checkIn = Math.max(newExpiresIn - 5 * 60, 60) // Verifica 5 min antes ou no mínimo 1 min
              timeoutId = setTimeout(checkAndRefreshToken, checkIn * 1000)
            }
          } else {
            console.error('Falha ao renovar token')
          }
        } else {
          // Agenda próxima verificação para 5 minutos antes da expiração
          const checkIn = Math.max(expiresIn - 5 * 60, 60) // No mínimo 1 minuto
          timeoutId = setTimeout(checkAndRefreshToken, checkIn * 1000)
        }
      } catch (error) {
        console.error('Erro ao verificar token:', error)
        // Tenta novamente em 1 minuto
        timeoutId = setTimeout(checkAndRefreshToken, 60 * 1000)
      }
    }

    // Inicia verificação
    checkAndRefreshToken()

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])
}

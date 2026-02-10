'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface UseLogoutReturn {
  logout: () => Promise<void>
  isLoading: boolean
}

export function useLogout(): UseLogoutReturn {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const logout = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return { logout, isLoading }
}

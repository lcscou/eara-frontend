'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type AuthContextValue = {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'eara-member-auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    setIsAuthenticated(stored === 'true')
    setIsLoading(false)
  }, [])

  const login = useCallback((email: string, password: string) => {
    if (!email || !password) return
    window.localStorage.setItem(STORAGE_KEY, 'true')
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [isAuthenticated, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

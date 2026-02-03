'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

type ProtectedRouteProps = {
  children: ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  redirectTo = '/members/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-6xl items-center justify-center px-6 py-20">
        <p className="text-lg text-gray-600">Checking your member access...</p>
      </div>
    )
  }

  return <>{children}</>
}

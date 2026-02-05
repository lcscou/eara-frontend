'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      className="border-primaryColor text-primaryColor hover:bg-primaryColor rounded-lg border px-4 py-2 text-sm font-semibold transition hover:text-white"
      disabled={loading}
    >
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  )
}

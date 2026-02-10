'use client'

import { useLogout } from '@/hooks/useLogout'

export default function LogoutButton() {
  const { logout, isLoading } = useLogout()

  return (
    <button
      type="button"
      onClick={logout}
      className="border-primaryColor text-primaryColor hover:bg-primaryColor rounded-lg border px-4 py-2 text-sm font-semibold transition hover:text-white"
      disabled={isLoading}
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </button>
  )
}

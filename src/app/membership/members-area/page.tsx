import { redirect } from 'next/navigation'

import LogoutButton from '@/components/auth/LogoutButton'
import { getAuthToken } from '@/lib/auth/server'

export const metadata = {
  title: 'Members Area | Eara',
}

export default function MembersAreaPage() {
  const token = getAuthToken()

  if (!token) {
    redirect('/login?redirect=/membership/members-area')
  }

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 py-16">
      <div className="max-w-2xl rounded-2xl bg-white/80 p-10 text-center shadow-lg">
        <h1 className="text-earaDark text-3xl font-semibold">Members Area</h1>
        <p className="text-earaDark/70 mt-3 text-sm">
          Welcome! This content is exclusive to authenticated users.
        </p>
        <div className="mt-6 flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </main>
  )
}

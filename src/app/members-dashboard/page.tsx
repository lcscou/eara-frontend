'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function MembersDashboardPage() {
  const { logout } = useAuth()

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f2f3f8] px-6 py-16">
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-[32px] bg-white p-10 shadow-[0_24px_60px_rgba(35,38,89,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2b2a76]">
                Members Area
              </p>
              <h1 className="text-3xl font-semibold text-[#2b2a76]">Members Dashboard</h1>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-[#2b2a76]/30 px-5 py-2 text-sm font-semibold text-[#2b2a76] transition hover:border-[#2b2a76] hover:bg-[#2b2a76] hover:text-white"
            >
              Logout
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#e1e3f0] bg-[#f7f7fb] p-6">
              <h2 className="text-lg font-semibold text-[#2b2a76]">Member resources</h2>
              <p className="mt-2 text-sm text-gray-600">
                Access exclusive reports, brand assets, and event recordings prepared for members.
              </p>
            </div>
            <div className="rounded-2xl border border-[#e1e3f0] bg-[#f7f7fb] p-6">
              <h2 className="text-lg font-semibold text-[#2b2a76]">Upcoming updates</h2>
              <p className="mt-2 text-sm text-gray-600">
                Stay informed about new projects and policy initiatives from EARA.
              </p>
            </div>
          </div>
          <Link
            href="/members"
            className="text-sm font-semibold text-[#2b2a76] underline decoration-[#9ed53b] underline-offset-4"
          >
            Back to members list
          </Link>
        </section>
      </main>
    </ProtectedRoute>
  )
}

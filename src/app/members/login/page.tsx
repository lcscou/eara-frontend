'use client'

import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function MembersLoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    login(email, password)
    router.push('/members-dashboard')
  }

  return (
    <main className="min-h-screen bg-[#ececf6] px-6 pb-20 pt-16">
      <section className="mx-auto w-full max-w-6xl">
        <div className="rounded-[36px] bg-white/70 p-4 shadow-[0_24px_80px_rgba(35,38,89,0.18)] backdrop-blur">
          <div className="grid gap-8 overflow-hidden rounded-[32px] bg-[#ebe9e6] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[360px] overflow-hidden rounded-[28px] bg-gray-200">
              <Image
                src="/informing.jpg"
                alt="Member working in a laboratory"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 560px, 100vw"
                priority
              />
            </div>
            <div className="flex flex-col justify-center gap-6 px-6 py-10 sm:px-10">
              <div className="flex items-center gap-3">
                <Image src="/logo-eara.svg" alt="EARA logo" width={40} height={40} />
                <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[#2c2f7f]">
                  EARA
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-[#2b2a76] sm:text-4xl">Members Login</h1>
                <p className="mt-3 text-sm text-gray-600">
                  Fill your login and password to access your account
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-2 text-sm font-medium text-[#2b2a76]">
                  Insert your email*
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 rounded-full border border-[#2b2a76]/40 bg-transparent px-5 text-sm text-gray-800 outline-none transition focus:border-[#2b2a76]"
                    placeholder="you@email.com"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-[#2b2a76]">
                  Insert your password*
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 rounded-full border border-[#2b2a76]/40 bg-transparent px-5 text-sm text-gray-800 outline-none transition focus:border-[#2b2a76]"
                    placeholder="••••••••"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="group flex items-center gap-4 rounded-full bg-[#2b2a76] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_12px_30px_rgba(43,42,118,0.25)] transition hover:bg-[#262366]"
                  >
                    Login
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9ed53b] text-[#2b2a76] transition group-hover:translate-x-1">
                      ➜
                    </span>
                  </button>
                  <button
                    type="button"
                    className="text-sm font-semibold text-[#2b2a76] underline decoration-[#9ed53b] underline-offset-4"
                  >
                    Recover password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

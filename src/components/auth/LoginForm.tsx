'use client'

import { Input, Stack } from '@mantine/core'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import ButtonEara from '../ui/ButtonEara/ButtonEara'
export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/membership/members-area'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error || 'Unable to authenticate.')
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('Unable to authenticate.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack gap={5}>
        <div className="flex flex-col gap-2">
          {/* <label className="text-earaDark text-sm font-semibold" htmlFor="login-email">
          Email
        </label> */}
          <Input
            id="login-email"
            type="email"
            placeholder="Insert your email*"
            autoComplete="email"
            size="lg"
            styles={{
              input: {
                borderColor: '#312F86',
                color: '#312F86',
                background: 'transparent',
                borderRadius: '50px',
              },
            }}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          {/* <label className="text-earaDark text-sm font-semibold" htmlFor="login-password">
          Password
        </label> */}
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Insert your password*"
            size="lg"
            styles={{
              input: {
                borderColor: '#312F86',
                color: '#312F86',
                background: 'transparent',
                borderRadius: '50px',
              },
            }}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

        <ButtonEara mt={20} variant="with-arrow" disabled={loading} type="submit">
          {loading ? 'Logging in...' : 'Log in'}
        </ButtonEara>

        <Link
          className="text-primaryColor/70 mt-2 text-sm font-semibold hover:underline"
          href="/forgot-password"
        >
          I forgot my password
        </Link>
      </Stack>
    </form>
  )
}

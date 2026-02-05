'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const key = searchParams.get('key') || ''
  const login = searchParams.get('login') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!key || !login) {
      setError('Invalid or incomplete link.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, login, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error || 'Unable to reset the password.')
        return
      }

      setSuccess(true)
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        router.push('/login')
      }, 1200)
    } catch {
      setError('Unable to reset the password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white/80 p-8 shadow-lg"
    >
      <div className="flex flex-col gap-1">
        <label className="text-earaDark text-sm font-semibold" htmlFor="reset-login">
          Username
        </label>
        <input
          id="reset-login"
          type="text"
          className="border-earaGrayLight rounded-lg border bg-white px-4 py-3 text-sm"
          value={login}
          readOnly
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-earaDark text-sm font-semibold" htmlFor="reset-password">
          New password
        </label>
        <input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          className="border-earaGrayLight rounded-lg border bg-white px-4 py-3 text-sm"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-earaDark text-sm font-semibold" htmlFor="reset-password-confirm">
          Confirm password
        </label>
        <input
          id="reset-password-confirm"
          type="password"
          autoComplete="new-password"
          className="border-earaGrayLight rounded-lg border bg-white px-4 py-3 text-sm"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      {success && (
        <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          Password updated. Redirecting to login...
        </p>
      )}

      <button
        type="submit"
        className="bg-primaryColor rounded-lg px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Set new password'}
      </button>
    </form>
  )
}

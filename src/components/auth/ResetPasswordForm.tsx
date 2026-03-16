'use client'

import { Input, PasswordInput, TextInput } from '@mantine/core'
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
      <Input.Wrapper label="Username" size="sm" styles={{ label: { marginBottom: '8px' } }}>
        <TextInput
          id="reset-login"
          placeholder="e.g.: jane.smith@edu.eu"
          value={login}
          readOnly
          size="md"
          radius="md"
          styles={{
            input: {
              backgroundColor: '#FFFFFF',
            },
          }}
        />
      </Input.Wrapper>

      <Input.Wrapper label="New password" size="sm" styles={{ label: { marginBottom: '8px' } }}>
        <PasswordInput
          id="reset-password"
          autoComplete="new-password"
          placeholder="e.g.: MySecurePass123"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          size="md"
          radius="md"
        />
      </Input.Wrapper>

      <Input.Wrapper label="Confirm password" size="sm" styles={{ label: { marginBottom: '8px' } }}>
        <PasswordInput
          id="reset-password-confirm"
          autoComplete="new-password"
          placeholder="e.g.: Repeat MySecurePass123"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          size="md"
          radius="md"
        />
      </Input.Wrapper>

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

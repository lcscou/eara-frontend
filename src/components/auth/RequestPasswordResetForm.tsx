'use client'

import { useState } from 'react'

export default function RequestPasswordResetForm() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error || 'Unable to request a password reset.')
        return
      }

      setSuccess(true)
      setUsername('')
    } catch {
      setError('Unable to request a password reset.')
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
        <label className="text-earaDark text-sm font-semibold" htmlFor="reset-username">
          Email or username
        </label>
        <input
          id="reset-username"
          type="text"
          autoComplete="username"
          placeholder="e.g.: jane.smith@edu.eu"
          className="border-earaGrayLight rounded-lg border bg-white px-4 py-3 text-sm"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      {success && (
        <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          If the user exists, you will receive an email with instructions.
        </p>
      )}

      <button
        type="submit"
        className="bg-primaryColor rounded-lg px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send reset link'}
      </button>
    </form>
  )
}

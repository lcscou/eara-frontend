import Link from 'next/link'

import RequestPasswordResetForm from '@/components/auth/RequestPasswordResetForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EARA | Forgot Password',
  description: 'Reset your password for your EARA account.',
}

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="text-center">
          <h1 className="text-earaDark text-3xl font-semibold">Reset password</h1>
          <p className="text-earaDark/70 mt-2 text-sm">
            Enter your email or username to receive a reset link.
          </p>
        </div>
        <RequestPasswordResetForm />
        <div className="text-center text-sm">
          <Link className="text-primaryColor font-semibold hover:underline" href="/login">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  )
}

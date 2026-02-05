import Link from 'next/link'

import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export const metadata = {
  title: 'Set new password | Eara',
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="text-center">
          <h1 className="text-earaDark text-3xl font-semibold">Set new password</h1>
          <p className="text-earaDark/70 mt-2 text-sm">Create a new password for your account.</p>
        </div>
        <ResetPasswordForm />
        <div className="text-center text-sm">
          <Link className="text-primaryColor font-semibold hover:underline" href="/login">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  )
}

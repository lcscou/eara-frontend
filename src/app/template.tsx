'use client'
import Footer from '@/components/ui/Footer/Footer'
import Header from '@/components/ui/Header/Header'
import { Suspense } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      {children}
      <Suspense>
        <Footer />
      </Suspense>
    </>
  )
}

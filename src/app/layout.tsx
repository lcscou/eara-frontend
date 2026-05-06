import '@mantine/carousel/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/core/styles.css'
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'

import './globals.css'

import { AuthRefreshProvider } from '@/components/auth/AuthRefreshProvider'
import BackToTop from '@/components/ui/BackToTop/BackToTop'
import TranslationWidget from '@/components/ui/TranslationWidget/TranslationWidget'
import { ModalsProvider } from '@/contexts/ModalsContext'

import { ApolloWrapper } from './providers/ApolloProvider'
import { MantineProvider } from './providers/MantineProvider'
const hankenGrotesk = Hanken_Grotesk({
  variable: '--hanken-grotesk-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EARA',
  description: 'European Animal Research Association',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body className={`${hankenGrotesk.variable} antialiased`}>
        <ApolloWrapper>
          <MantineProvider>
            <ModalsProvider>
              <AuthRefreshProvider />
              {children}
              <Analytics />
              {process.env.NODE_ENV === 'production' ? (
                <GoogleTagManager gtmId="GTM-T6WSZKMZ" />
              ) : null}
              <div className="fixed right-5 bottom-5 z-50 flex flex-col gap-2">
                <TranslationWidget />
                <BackToTop />
              </div>
            </ModalsProvider>
          </MantineProvider>
        </ApolloWrapper>
      </body>
    </html>
  )
}

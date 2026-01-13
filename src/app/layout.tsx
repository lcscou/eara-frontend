import '@mantine/carousel/styles.css'
import '@mantine/core/styles.css'
import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import './globals.css'
import { ApolloWrapper } from './providers/ApolloProvider'
import { MantineProvider } from './providers/MantineProvider'

import BackToTop from '@/components/ui/BackToTop/BackToTop'
import { ModalsProvider } from '@/contexts/ModalsContext'
import { GetMenuDocument } from '@/graphql/generated/graphql'
import { PreloadQuery } from '@/lib/apollo-client'

const hankenGrotesk = Hanken_Grotesk({
  variable: '--hanken-grotesk-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Eara',
  description: 'European Animal Research Association',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${hankenGrotesk.variable} antialiased`}>
        <ApolloWrapper>
          <PreloadQuery
            errorPolicy="ignore"
            fetchPolicy="cache-first"
            query={GetMenuDocument}
            context={{ fetchOptions: { next: { tags: ['menus'] } } }}
          >
            <MantineProvider>
              <ModalsProvider>
                {children}
                <div className="fixed right-5 bottom-5 z-50 flex flex-col gap-2">
                  <BackToTop />
                </div>
              </ModalsProvider>
            </MantineProvider>
          </PreloadQuery>
        </ApolloWrapper>
      </body>
    </html>
  )
}

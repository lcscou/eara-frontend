import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import { MantineProvider } from './providers/MantineProvider'
import './globals.css'
import { ApolloWrapper } from './providers/ApolloProvider'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'

import { PreloadQuery } from '@/lib/apollo-client'
import { GetMenuDocument } from '@/graphql/generated/graphql'

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
          <PreloadQuery errorPolicy="ignore" fetchPolicy="cache-first" query={GetMenuDocument}>
            <MantineProvider>
              {/* <Header /> */}
              {children}
              {/* <Footer /> */}
            </MantineProvider>
          </PreloadQuery>
        </ApolloWrapper>
      </body>
    </html>
  )
}

import '@mantine/carousel/styles.css'
import '@mantine/core/styles.css'
import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import './globals.css'
import { ApolloWrapper } from './providers/ApolloProvider'
import { MantineProvider } from './providers/MantineProvider'

import BackToTop from '@/components/ui/BackToTop/BackToTop'
import InfoButton from '@/components/ui/InfoButton/InfoButton'
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
          <PreloadQuery errorPolicy="ignore" fetchPolicy="cache-first" query={GetMenuDocument}>
            <MantineProvider>
              {children}
              <div className="fixed right-5 bottom-5 z-50 flex flex-col gap-2">
                <InfoButton
                  content={
                    <>
                      <h3 className="text-lg font-bold">About Eara</h3>
                      <p className="text-sm">
                        Founded in 2014, EARA is a not-for-profit organisation that has more than
                        200 member organisations from both public research institutions,
                        representative bodies and private biomedical research, as well as breeders
                        and other suppliers to the sector, in 25 European countries and 21 other
                        countries around the world.
                      </p>
                    </>
                  }
                />
                <BackToTop />
              </div>
            </MantineProvider>
          </PreloadQuery>
        </ApolloWrapper>
      </body>
    </html>
  )
}

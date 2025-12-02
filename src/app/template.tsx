import Footer from '@/components/ui/Footer/Footer'
import HeaderMegaMenu from '@/components/ui/HeaderMegaMenu/HeaderMegaMenu'
import { GetMenuDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
import { Suspense } from 'react'

export default async function Template({ children }: { children: React.ReactNode }) {
  const data = await query({
    query: GetMenuDocument,
    context: {
      fetchOptions: {
        next: {
          tags: ['menus'],
        },
      },
    },
  })

  if (data.error) return

  console.log(data.data?.menus)

  return (
    <>
      <Suspense>{/* <Header /> */}</Suspense>
      <HeaderMegaMenu data={data.data} id="main" />
      {children}
      <Suspense>
        <Footer />
      </Suspense>
    </>
  )
}

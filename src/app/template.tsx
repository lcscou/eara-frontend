import Footer from '@/components/ui/Footer/Footer'
import HeaderMegaMenu from '@/components/ui/HeaderMegaMenu/HeaderMegaMenu'
import { GetMenuDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
import { Suspense } from 'react'

export default async function Template({ children }: { children: React.ReactNode }) {
  let menuData: unknown = null

  try {
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

    if (data.error) {
      console.error('Template menu query returned an Apollo error:', data.error)
    } else {
      menuData = data.data
    }
  } catch (error) {
    console.error('Template menu query failed:', error)
  }

  return (
    <>
      {process.env.MAINTENANCE_MODE !== 'true' ? (
        <>
          {menuData ? <HeaderMegaMenu data={menuData} id="main" /> : null}
          {children}
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </>
      ) : (
        <>{children}</>
      )}
    </>
  )
}

import PageTemplate from '@/components/templates/Page/PageTemplate'
import { GetPageDocument, GetPageQuery } from '@/graphql/generated/graphql'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'

const getHomePageData = cache(async (): Promise<GetPageQuery> => {
  const result = await queryWithAuthFallback<GetPageQuery>({
    query: GetPageDocument,
    variables: { id: '/' },
    context: {
      fetchOptions: {
        next: {
          revalidate: 0,
          tags: ['pages', 'pages-home'],
        },
      },
    },
  })
  if (result.authRequired) {
    redirect('/login?redirect=/')
  }
  if (!result.data) notFound()
  return result.data
})

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePageData()
  if (!data?.page) notFound()

  const title = data.page.title || 'Eara'
  const description = data.page.seo?.opengraphDescription || 'European Animal Research Association'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function HomePage() {
  const data = await getHomePageData()
  if (!data?.page) notFound()
  return <PageTemplate withTicker hideTitleBar data={data} />
}

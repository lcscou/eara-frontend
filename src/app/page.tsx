import PageTemplate from '@/components/templates/Page/PageTemplate'
import { GetPageDocument, GetPageQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

const getHomePageData = cache(async (): Promise<GetPageQuery> => {
  const client = getClient()
  const { data } = await client.query<GetPageQuery>({
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
  if (!data) notFound()
  return data
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
  return <PageTemplate hideTitleBar data={data} />
}

import PageTemplate from '@/components/templates/Page/PageTemplate'
import { GetPageDocument, GetPageQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
type PageProps = {
  params: { uri: string[] }
}
const getPageData = cache(async (uri: string[]): Promise<GetPageQuery> => {
  const client = getClient()
  const { data } = await client.query<GetPageQuery>({
    query: GetPageDocument,
    variables: { id: uri.join('/') },
    context: {
      fetchOptions: {
        next: {
          revalidate: 0,
          tags: ['pages', `pages-${uri.join('')}`],
        },
      },
    },
  })
  if (!data) notFound()
  return data
})
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getPageData(params.uri)
  if (!data?.page) notFound()
  const title = `Eara | ${data.page.title}`
  const description = data.page.seo?.opengraphDescription || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}
export default async function Pages({ params }: PageProps) {
  const data = await getPageData(params.uri)
  if (!data?.page) notFound()
  return <PageTemplate data={data} />
}

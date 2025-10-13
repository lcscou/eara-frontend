import { cache } from 'react'
import { GetPageDocument } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import PageTemplate from '@/components/templates/Page/PageTemplate'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
type PageProps = {
  params: { uri: string[] }
}
const getPageData = cache(async (uri: string[]) => {
  const client = getClient()
  const { data } = await client.query({
    query: GetPageDocument,
    variables: { id: uri.join('') },
  })
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

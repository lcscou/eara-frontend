import { cache } from 'react'
import { GetNewsDocument, GetNewsQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SingleNews from '@/components/templates/News/SingleNews'
type NewsProps = {
  params: { uri: string[] }
}
const getNewsData = cache(async (uri: string[]): Promise<GetNewsQuery> => {
  const client = getClient()
  const { data } = await client.query<GetNewsQuery>({
    query: GetNewsDocument,
    variables: { id: uri.join('') },
  })
  if (!data) notFound()
  return data
})
export async function generateMetadata({ params }: NewsProps): Promise<Metadata> {
  const data = await getNewsData(params.uri)
  if (!data?.news) notFound()
  const title = `Eara | News - ${data.news.title || data.news.title}`
  const description = data.news.seo?.opengraphDescription || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,

    },
  }
}
export default async function News({ params }: NewsProps) {
  const data = await getNewsData(params.uri)
  if (!data?.news) notFound()
  return <SingleNews data={data} />
}

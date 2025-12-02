import SingleNews from '@/components/templates/News/SingleNews'
import { GetNewsDocument, GetNewsQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

// ISR: Revalidar a cada 30 minutos
export const revalidate = 1800

type NewsProps = {
  params: { uri: string[] }
}
const getNewsData = cache(async (uri: string[]): Promise<GetNewsQuery> => {
  const client = getClient()
  const { data } = await client.query<GetNewsQuery>({
    query: GetNewsDocument,
    variables: { id: uri.join('') },
    context: {
      fetchOptions: {
        next: {
          revalidate: 1800,
          tags: ['news', `news-${uri.join('')}`],
        },
      },
    },
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

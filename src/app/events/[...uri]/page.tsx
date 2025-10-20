import { cache } from 'react'
import { GetEventsDocument, GetEventsQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SingleEvents from '@/components/templates/Events/SingleEvents'
type EventProps = {
  params: { uri: string[] }
}
const getEventData = cache(async (uri: string[]): Promise<GetEventsQuery> => {
  const client = getClient()
  const { data } = await client.query<GetEventsQuery>({
    query: GetEventsDocument,
    variables: { id: uri.join('') },
  })
  if (!data) notFound()
  return data
})
export async function generateMetadata({ params }: EventProps): Promise<Metadata> {
  const data = await getEventData(params.uri)
  if (!data?.events) notFound()
  const title = `Eara | Events - ${data.events.title || data.events.title}`
  const description = data.events.seo?.opengraphDescription || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,

    },
  }
}
export default async function Event({ params }: EventProps) {
  const data = await getEventData(params.uri)
  if (!data?.events) notFound()
  return <SingleEvents data={data} />
}

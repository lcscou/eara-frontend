import SingleEvents from '@/components/templates/Events/SingleEvents'
import { GetEventsDocument, GetEventsQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

// ISR: Revalidar a cada 30 minutos
export const revalidate = 1800

type EventProps = {
  params: { uri: string[] }
}
const getEventData = cache(async (uri: string[]): Promise<GetEventsQuery> => {
  const client = getClient()
  const { data } = await client.query<GetEventsQuery>({
    query: GetEventsDocument,
    variables: { id: uri.join('') },
    context: {
      fetchOptions: {
        next: {
          revalidate: 1800,
          tags: ['events', `event-${uri.join('')}`],
        },
      },
    },
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
  console.log(data)
  if (!data?.events) notFound()
  return <SingleEvents data={data} />
}

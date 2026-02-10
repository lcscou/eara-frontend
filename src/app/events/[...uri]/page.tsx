import SingleEvents from '@/components/templates/Events/SingleEvents'
import { GetEventsDocument, GetEventsQuery } from '@/graphql/generated/graphql'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'

// ISR: Revalidar a cada 30 minutos
export const revalidate = 1800

type EventProps = {
  params: { uri: string[] }
}
const getEventData = cache(async (uri: string[]): Promise<GetEventsQuery> => {
  const result = await queryWithAuthFallback<GetEventsQuery>({
    query: GetEventsDocument,
    variables: { id: uri.join('') },
    context: {
      fetchOptions: {
        next: {
          revalidate: 0,
          tags: ['events', `event-${uri.join('')}`],
        },
      },
    },
  })
  const path = `/events/${uri.join('/')}`
  if (result.authRequired) {
    redirect(`/login?redirect=${encodeURIComponent(path)}`)
  }
  if (!result.data) notFound()
  return result.data
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

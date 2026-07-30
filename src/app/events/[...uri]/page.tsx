import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import PreviewLoginGate from '@/components/auth/PreviewLoginGate'
import SingleEvents from '@/components/templates/Events/SingleEvents'
import { GetEventsDocument, GetEventsQuery } from '@/graphql/generated/graphql'
import { isPreviewLoginRequired, requireProtectedContentData } from '@/lib/protectedContent'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'

// ISR: Revalidar a cada 30 minutos
export const revalidate = 1800

type EventProps = {
  params: Promise<{ uri: string[] }>
}
const getEventData = cache(async (uri: string[]) => {
  const path = `/events/${uri?.join('/')}`

  return await queryWithAuthFallback<GetEventsQuery>({
    query: GetEventsDocument,
    variables: { id: uri?.join('') },
    previewUri: path,
    context: {
      fetchOptions: {
        next: {
          revalidate: 0,
          tags: ['events', `event-${uri?.join('')}`],
        },
      },
    },
  })
})
export async function generateMetadata({ params }: EventProps): Promise<Metadata> {
  const { uri } = await params
  const path = `/events/${uri?.join('/')}`
  const result = await getEventData(uri)

  if (isPreviewLoginRequired(result)) {
    return {
      title: 'EARA | Restricted Content',
      description: 'Log in to view this restricted content.',
    }
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.events) notFound()
  const title = `EARA | Events - ${data.events.title || data.events.title}`
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
  const { uri } = await params
  const path = `/events/${uri?.join('/')}`
  const result = await getEventData(uri)

  if (isPreviewLoginRequired(result)) {
    return <PreviewLoginGate redirectTo={path} />
  }

  const data = requireProtectedContentData(result, path)

  if (!data?.events) notFound()
  return <SingleEvents data={data} />
}

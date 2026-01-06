import SinglePressRelease from '@/components/templates/PressReleases/SinglePressReleases'
import { GetPressReleaseDocument, GetPressReleaseQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

// ISR: Revalidar a cada 30 minutos
export const revalidate = 1800

type PressReleaseProps = {
  params: { uri: string[] }
}
const getPressReleaseData = cache(async (uri: string[]): Promise<GetPressReleaseQuery> => {
  const client = getClient()
  const { data } = await client.query<GetPressReleaseQuery>({
    query: GetPressReleaseDocument,
    variables: { id: uri.join('') },
    context: {
      fetchOptions: {
        next: {
          revalidate: 1800,
          tags: ['press-release', `press-release-${uri.join('')}`],
        },
      },
    },
  })
  if (!data) notFound()
  return data
})
export async function generateMetadata({ params }: PressReleaseProps): Promise<Metadata> {
  const data = await getPressReleaseData(params.uri)
  if (!data?.pressRelease) notFound()
  const title = `Eara | Press Release - ${data.pressRelease.title || data.pressRelease.title}`
  const description = data.pressRelease.seo?.opengraphDescription || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}
export default async function PressRelease({ params }: PressReleaseProps) {
  const data = await getPressReleaseData(params.uri)
  if (!data?.pressRelease) notFound()
  return <SinglePressRelease data={data} />
}

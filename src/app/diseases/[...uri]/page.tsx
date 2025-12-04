import SingleDiseases from '@/components/templates/Diseases/SingleDiseases'
import { GetDiseasesDocument, GetDiseasesQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
type DiseaseProps = {
  params: { uri: string[] }
}
const getDiseaseData = cache(async (uri: string[]): Promise<GetDiseasesQuery> => {
  const client = getClient()
  const { data } = await client.query<GetDiseasesQuery>({
    query: GetDiseasesDocument,
    variables: { id: uri.join('') },
    context: {
      fetchOptions: {
        next: {
          revalidate: 0,
          tags: ['diseases', `diseases-${uri.join('')}`],
        },
      },
    },
  })
  if (!data) notFound()
  return data
})
export async function generateMetadata({ params }: DiseaseProps): Promise<Metadata> {
  const data = await getDiseaseData(params.uri)
  if (!data?.diseases) notFound()
  const title = `Eara | Diseases - ${data.diseases.title || data.diseases.title}`
  const description = data.diseases.seo?.opengraphDescription || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}
export default async function Diseases({ params }: DiseaseProps) {
  const data = await getDiseaseData(params.uri)
  if (!data?.diseases) notFound()
  return <SingleDiseases data={data} />
}

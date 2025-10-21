import { cache } from 'react'
import {
  GetDiseasesDocument,
  GetDiseasesQuery
} from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SingleDiseases from '@/components/templates/Diseases/SingleDiseases'
type DiseaseProps = {
  params: { uri: string[] }
}
const getDiseaseData = cache(async (uri: string[]): Promise<GetDiseasesQuery> => {
  const client = getClient()
  const { data } = await client.query<GetDiseasesQuery>({
    query: GetDiseasesDocument,
    variables: { id: uri.join('') },
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

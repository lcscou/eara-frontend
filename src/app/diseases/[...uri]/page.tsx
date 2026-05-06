import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'

import SingleDiseases from '@/components/templates/Diseases/SingleDiseases'
import { GetDiseasesDocument, GetDiseasesQuery } from '@/graphql/generated/graphql'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'
type DiseaseProps = {
  params: Promise<{ uri: string[] }>
}
const getDiseaseData = cache(async (uri: string[]): Promise<GetDiseasesQuery> => {
  const result = await queryWithAuthFallback<GetDiseasesQuery>({
    query: GetDiseasesDocument,
    variables: { id: uri?.join('') },
    context: {
      fetchOptions: {
        next: {
          revalidate: 0,
          tags: ['diseases', `diseases-${uri?.join('')}`],
        },
      },
    },
  })
  const path = `/diseases/${uri?.join('/')}`
  if (result.authRequired) {
    redirect(`/login?redirect=${encodeURIComponent(path)}`)
  }
  if (!result.data) notFound()
  return result.data
})
export async function generateMetadata({ params }: DiseaseProps): Promise<Metadata> {
  const { uri } = await params
  const data = await getDiseaseData(uri)
  if (!data?.diseases) notFound()
  const title = `EARA | Diseases - ${data.diseases.title || data.diseases.title}`
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
  const { uri } = await params
  const data = await getDiseaseData(uri)
  if (!data?.diseases) notFound()
  return <SingleDiseases data={data} />
}

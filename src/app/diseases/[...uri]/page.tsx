import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import PreviewLoginGate from '@/components/auth/PreviewLoginGate'
import SingleDiseases from '@/components/templates/Diseases/SingleDiseases'
import { GetDiseasesDocument, GetDiseasesQuery } from '@/graphql/generated/graphql'
import { isPreviewLoginRequired, requireProtectedContentData } from '@/lib/protectedContent'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'
type DiseaseProps = {
  params: Promise<{ uri: string[] }>
}
const getDiseaseData = cache(async (uri: string[]) => {
  const path = `/diseases/${uri?.join('/')}`

  return await queryWithAuthFallback<GetDiseasesQuery>({
    query: GetDiseasesDocument,
    variables: { id: uri?.join('') },
    previewUri: path,
    context: {
      fetchOptions: {
        next: {
          revalidate: 0,
          tags: ['diseases', `diseases-${uri?.join('')}`],
        },
      },
    },
  })
})
export async function generateMetadata({ params }: DiseaseProps): Promise<Metadata> {
  const { uri } = await params
  const path = `/diseases/${uri?.join('/')}`
  const result = await getDiseaseData(uri)

  if (isPreviewLoginRequired(result)) {
    return {
      title: 'EARA | Restricted Content',
      description: 'Log in to view this restricted content.',
    }
  }

  const data = requireProtectedContentData(result, path)
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
  const path = `/diseases/${uri?.join('/')}`
  const result = await getDiseaseData(uri)

  if (isPreviewLoginRequired(result)) {
    return <PreviewLoginGate redirectTo={path} />
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.diseases) notFound()
  return <SingleDiseases data={data} />
}

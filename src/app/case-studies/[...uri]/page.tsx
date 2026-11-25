import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import PreviewLoginGate from '@/components/auth/PreviewLoginGate'
import SingleCaseStudies from '@/components/templates/CaseStudies/SingleCaseStudies'
import { GetCaseStudiesDocument, GetCaseStudiesQuery } from '@/graphql/generated/graphql'
import { isPreviewLoginRequired, requireProtectedContentData } from '@/lib/protectedContent'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'

// ISR: Revalidar a cada 1 hora
export const revalidate = 3600

type CaseStudiesProps = {
  params: Promise<{ uri: string[] }>
}
const getCaseStudies = cache(async (uri: string[]) => {
  const path = `/case-studies/${uri?.join('/')}`

  return await queryWithAuthFallback<GetCaseStudiesQuery>({
    query: GetCaseStudiesDocument,
    variables: { id: uri?.join('') },
    previewUri: path,
    context: {
      fetchOptions: {
        next: {
          revalidate: 3600,
          tags: ['case-studies', `case-study-${uri?.join('')}`],
        },
      },
    },
  })
})
export async function generateMetadata({ params }: CaseStudiesProps): Promise<Metadata> {
  const { uri } = await params
  const path = `/case-studies/${uri?.join('/')}`
  const result = await getCaseStudies(uri)

  if (isPreviewLoginRequired(result)) {
    return {
      title: 'EARA | Restricted Content',
      description: 'Log in to view this restricted content.',
    }
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.caseStudies) notFound()
  const title = `EARA | Case Studies - ${data.caseStudies.title || data.caseStudies.title}`
  const description = data.caseStudies.seo?.opengraphDescription || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}
export default async function CaseStudies({ params }: CaseStudiesProps) {
  const { uri } = await params
  const path = `/case-studies/${uri?.join('/')}`
  const result = await getCaseStudies(uri)

  if (isPreviewLoginRequired(result)) {
    return <PreviewLoginGate redirectTo={path} />
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.caseStudies) notFound()
  return <SingleCaseStudies data={data} />
}

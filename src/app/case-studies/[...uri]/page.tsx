import SingleCaseStudies from '@/components/templates/CaseStudies/SingleCaseStudies'
import { GetCaseStudiesDocument, GetCaseStudiesQuery } from '@/graphql/generated/graphql'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'

// ISR: Revalidar a cada 1 hora
export const revalidate = 3600

type CaseStudiesProps = {
  params: { uri: string[] }
}
const getCaseStudies = cache(async (uri: string[]): Promise<GetCaseStudiesQuery> => {
  const result = await queryWithAuthFallback<GetCaseStudiesQuery>({
    query: GetCaseStudiesDocument,
    variables: { id: uri.join('') },
    context: {
      fetchOptions: {
        next: {
          revalidate: 3600,
          tags: ['case-studies', `case-study-${uri.join('')}`],
        },
      },
    },
  })
  const path = `/case-studies/${uri.join('/')}`
  if (result.authRequired) {
    redirect(`/login?redirect=${encodeURIComponent(path)}`)
  }
  if (!result.data) notFound()
  return result.data
})
export async function generateMetadata({ params }: CaseStudiesProps): Promise<Metadata> {
  const data = await getCaseStudies(params.uri)
  if (!data?.caseStudies) notFound()
  const title = `Eara | Case Studies - ${data.caseStudies.title || data.caseStudies.title}`
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
  const data = await getCaseStudies(params.uri)
  if (!data?.caseStudies) notFound()
  return <SingleCaseStudies data={data} />
}

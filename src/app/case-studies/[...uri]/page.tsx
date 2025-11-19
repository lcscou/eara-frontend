import SingleCaseStudies from '@/components/templates/CaseStudies/SingleCaseStudies'
import { GetCaseStudiesDocument, GetCaseStudiesQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
type MemberProps = {
  params: { uri: string[] }
}
const getCaseStudies = cache(async (uri: string[]): Promise<GetCaseStudiesQuery> => {
  const client = getClient()
  const { data } = await client.query<GetCaseStudiesQuery>({
    query: GetCaseStudiesDocument,
    variables: { id: uri.join('') },
  })
  if (!data) notFound()
  return data
})
export async function generateMetadata({ params }: MemberProps): Promise<Metadata> {
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
export default async function CaseStudies({ params }: MemberProps) {
  const data = await getCaseStudies(params.uri)
  if (!data?.caseStudies) notFound()
  return <SingleCaseStudies data={data} />
}

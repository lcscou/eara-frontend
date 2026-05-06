import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'

import SingleMembers from '@/components/templates/Members/SingleMembers'
import { GetMembersDocument, GetMembersQuery } from '@/graphql/generated/graphql'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'
type MemberProps = {
  params: Promise<{ uri: string[] }>
}
const getMemberData = cache(async (uri: string[]): Promise<GetMembersQuery> => {
  const result = await queryWithAuthFallback<GetMembersQuery>({
    query: GetMembersDocument,
    variables: { id: uri?.join('') },
  })
  const path = `/members/${uri?.join('/')}`
  if (result.authRequired) {
    redirect(`/login?redirect=${encodeURIComponent(path)}`)
  }
  if (!result.data) notFound()
  return result.data
})
export async function generateMetadata({ params }: MemberProps): Promise<Metadata> {
  const { uri } = await params
  const data = await getMemberData(uri)
  if (!data?.member) notFound()
  const title = `EARA | Members - ${data.member.title || data.member.title}`
  const description = data.member.seo?.opengraphDescription || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}
export default async function Member({ params }: MemberProps) {
  const { uri } = await params
  const data = await getMemberData(uri)
  if (!data?.member) notFound()
  return <SingleMembers data={data} />
}

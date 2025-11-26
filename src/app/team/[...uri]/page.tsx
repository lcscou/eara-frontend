import SingleMembers from '@/components/templates/Members/SingleMembers'
import { GetMembersDocument, GetMembersQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
type MemberProps = {
  params: { uri: string[] }
}
const getMemberData = cache(async (uri: string[]): Promise<GetMembersQuery> => {
  const client = getClient()
  const { data } = await client.query<GetMembersQuery>({
    query: GetMembersDocument,
    variables: { id: uri.join('') },
  })
  if (!data) notFound()
  return data
})
export async function generateMetadata({ params }: MemberProps): Promise<Metadata> {
  const data = await getMemberData(params.uri)
  if (!data?.member) notFound()
  const title = `Eara | Members - ${data.member.title || data.member.title}`
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
  const data = await getMemberData(params.uri)
  if (!data?.member) notFound()
  return <SingleMembers data={data} />
}

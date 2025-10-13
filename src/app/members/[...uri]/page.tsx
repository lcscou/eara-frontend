import { cache } from 'react'
import { GetMembersDocument } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SingleMembers from '@/components/templates/Members/SingleMembers'
type MemberProps = {
  params: { uri: string[] }
}
const getMemberData = cache(async (uri: string[]) => {
  const client = getClient()
  const { data } = await client.query({
    query: GetMembersDocument,
    variables: { id: uri.join('') },
  })
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

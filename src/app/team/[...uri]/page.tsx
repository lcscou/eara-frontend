import SingleTeam from '@/components/templates/Team/SingleTeam'
import { GetTeamDocument, GetTeamQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
type MemberProps = {
  params: { uri: string[] }
}
const getTeamData = cache(async (uri: string[]): Promise<GetTeamQuery> => {
  const client = getClient()
  const { data } = await client.query<GetTeamQuery>({
    query: GetTeamDocument,
    variables: { id: uri.join('') },
  })
  if (!data) notFound()
  return data
})
export async function generateMetadata({ params }: MemberProps): Promise<Metadata> {
  const data = await getTeamData(params.uri)
  if (!data?.team) notFound()
  const title = `Eara | Members - ${data.team.title || data.team.title}`
  const description = data.team.seo?.opengraphDescription || ''

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
  const data = await getTeamData(params.uri)
  if (!data?.team) notFound()
  return <SingleTeam data={data} />
}

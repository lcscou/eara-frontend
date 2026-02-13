import SingleTeam from '@/components/templates/Team/SingleTeam'
import { GetTeamDocument, GetTeamQuery } from '@/graphql/generated/graphql'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'
type MemberProps = {
  params: { uri: string[] }
}
const getTeamData = cache(async (uri: string[]): Promise<GetTeamQuery> => {
  const result = await queryWithAuthFallback<GetTeamQuery>({
    query: GetTeamDocument,
    variables: { id: uri.join('') },
    context: {
      fetchOptions: {
        next: {
          revalidate: 1800,
          tags: ['team', `team-${uri.join('')}`],
        },
      },
    },
  })
  const path = `/team/${uri.join('/')}`
  if (result.authRequired) {
    redirect(`/login?redirect=${encodeURIComponent(path)}`)
  }
  if (!result.data) notFound()
  return result.data
})
export async function generateMetadata({ params }: MemberProps): Promise<Metadata> {
  const data = await getTeamData(params.uri)
  if (!data?.team) notFound()
  const title = `EARA | Team - ${data.team.title || data.team.title}`
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
export default async function Team({ params }: MemberProps) {
  const data = await getTeamData(params.uri)
  if (!data?.team) notFound()
  return <SingleTeam data={data} />
}

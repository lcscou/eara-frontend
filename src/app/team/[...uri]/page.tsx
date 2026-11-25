import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import PreviewLoginGate from '@/components/auth/PreviewLoginGate'
import SingleTeam from '@/components/templates/Team/SingleTeam'
import { GetTeamDocument, GetTeamQuery } from '@/graphql/generated/graphql'
import { isPreviewLoginRequired, requireProtectedContentData } from '@/lib/protectedContent'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'
type MemberProps = {
  params: Promise<{ uri: string[] }>
}
const getTeamData = cache(async (uri: string[]) => {
  const path = `/team/${uri?.join('/')}`

  return await queryWithAuthFallback<GetTeamQuery>({
    query: GetTeamDocument,
    variables: { id: uri?.join('') },
    previewUri: path,
    context: {
      fetchOptions: {
        next: {
          revalidate: 1800,
          tags: ['team', `team-${uri?.join('')}`],
        },
      },
    },
  })
})
export async function generateMetadata({ params }: MemberProps): Promise<Metadata> {
  const { uri } = await params
  const path = `/team/${uri?.join('/')}`
  const result = await getTeamData(uri)

  if (isPreviewLoginRequired(result)) {
    return {
      title: 'EARA | Restricted Content',
      description: 'Log in to view this restricted content.',
    }
  }

  const data = requireProtectedContentData(result, path)
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
  const { uri } = await params
  const path = `/team/${uri?.join('/')}`
  const result = await getTeamData(uri)

  if (isPreviewLoginRequired(result)) {
    return <PreviewLoginGate redirectTo={path} />
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.team) notFound()
  return <SingleTeam data={data} />
}

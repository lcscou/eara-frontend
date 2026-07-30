import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import PreviewLoginGate from '@/components/auth/PreviewLoginGate'
import SingleMembers from '@/components/templates/Members/SingleMembers'
import { GetMembersDocument, GetMembersQuery } from '@/graphql/generated/graphql'
import { isPreviewLoginRequired, requireProtectedContentData } from '@/lib/protectedContent'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'
type MemberProps = {
  params: Promise<{ uri: string[] }>
}
const getMemberData = cache(async (uri: string[]) => {
  const path = `/members/${uri?.join('/')}`

  return await queryWithAuthFallback<GetMembersQuery>({
    query: GetMembersDocument,
    variables: { id: uri?.join('') },
    previewUri: path,
  })
})
export async function generateMetadata({ params }: MemberProps): Promise<Metadata> {
  const { uri } = await params
  const path = `/members/${uri?.join('/')}`
  const result = await getMemberData(uri)

  if (isPreviewLoginRequired(result)) {
    return {
      title: 'EARA | Restricted Content',
      description: 'Log in to view this restricted content.',
    }
  }

  const data = requireProtectedContentData(result, path)
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
  const path = `/members/${uri?.join('/')}`
  const result = await getMemberData(uri)

  if (isPreviewLoginRequired(result)) {
    return <PreviewLoginGate redirectTo={path} />
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.member) notFound()
  return <SingleMembers data={data} />
}

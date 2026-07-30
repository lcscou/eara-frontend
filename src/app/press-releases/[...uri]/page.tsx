import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import PreviewLoginGate from '@/components/auth/PreviewLoginGate'
import SinglePressRelease from '@/components/templates/PressReleases/SinglePressReleases'
import { GetPressReleaseDocument, GetPressReleaseQuery } from '@/graphql/generated/graphql'
import { isPreviewLoginRequired, requireProtectedContentData } from '@/lib/protectedContent'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'

// ISR: Revalidar a cada 30 minutos
export const revalidate = 1800

type PressReleaseProps = {
  params: Promise<{ uri: string[] }>
}
const getPressReleaseData = cache(async (uri: string[]) => {
  const path = `/press-releases/${uri?.join('/')}`

  return await queryWithAuthFallback<GetPressReleaseQuery>({
    query: GetPressReleaseDocument,
    variables: { id: uri?.join('') },
    previewUri: path,
    context: {
      fetchOptions: {
        next: {
          revalidate: 1800,
          tags: ['press-release', `press-release-${uri?.join('')}`],
        },
      },
    },
  })
})
export async function generateMetadata({ params }: PressReleaseProps): Promise<Metadata> {
  const { uri } = await params
  const path = `/press-releases/${uri?.join('/')}`
  const result = await getPressReleaseData(uri)

  if (isPreviewLoginRequired(result)) {
    return {
      title: 'EARA | Restricted Content',
      description: 'Log in to view this restricted content.',
    }
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.pressRelease) notFound()
  const title = `EARA | Press Release - ${data.pressRelease.title || data.pressRelease.title}`
  const description = data.pressRelease.seo?.opengraphDescription || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}
export default async function PressRelease({ params }: PressReleaseProps) {
  const { uri } = await params
  const path = `/press-releases/${uri?.join('/')}`
  const result = await getPressReleaseData(uri)

  if (isPreviewLoginRequired(result)) {
    return <PreviewLoginGate redirectTo={path} />
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.pressRelease) notFound()
  return <SinglePressRelease data={data} />
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import PreviewLoginGate from '@/components/auth/PreviewLoginGate'
import PageTemplate from '@/components/templates/Page/PageTemplate'
import { GetPageDocument, GetPageQuery } from '@/graphql/generated/graphql'
import { isPreviewLoginRequired, requireProtectedContentData } from '@/lib/protectedContent'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'
type PageProps = {
  params: Promise<{ uri: string[] }>
}
const getPageData = cache(async (uri: string[]) => {
  const path = `/${uri?.join('/')}`

  return await queryWithAuthFallback<GetPageQuery>({
    query: GetPageDocument,
    variables: { id: uri?.join('/') },
    previewUri: path,
    context: {
      fetchOptions: {
        next: {
          revalidate: 0,
          tags: ['pages', `pages-${uri?.join('')}`],
        },
      },
    },
  })
})
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { uri } = await params
  const path = `/${uri?.join('/')}`
  const result = await getPageData(uri)

  if (isPreviewLoginRequired(result)) {
    return {
      title: 'EARA | Restricted Content',
      description: 'Log in to view this restricted content.',
    }
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.page) notFound()
  const title = `EARA | ${data.page.title}`
  const description = data.page.seo?.opengraphDescription || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}
export default async function Pages({ params }: PageProps) {
  const { uri } = await params
  const path = `/${uri?.join('/')}`
  const result = await getPageData(uri)

  if (isPreviewLoginRequired(result)) {
    return <PreviewLoginGate redirectTo={path} />
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.page) notFound()
  return <PageTemplate data={data} />
}

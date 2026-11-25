import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import PreviewLoginGate from '@/components/auth/PreviewLoginGate'
import PageTemplate from '@/components/templates/Page/PageTemplate'
import { GetPageDocument, GetPageQuery } from '@/graphql/generated/graphql'
import { isPreviewLoginRequired, requireProtectedContentData } from '@/lib/protectedContent'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'

const getHomePageData = cache(async () => {
  return await queryWithAuthFallback<GetPageQuery>({
    query: GetPageDocument,
    variables: { id: '/' },
    previewUri: '/',
    context: {
      fetchOptions: {
        next: {
          revalidate: 1800,
          tags: ['pages', 'pages-home'],
        },
      },
    },
  })
})

export async function generateMetadata(): Promise<Metadata> {
  const result = await getHomePageData()

  if (isPreviewLoginRequired(result)) {
    return {
      title: 'EARA | Restricted Content',
      description: 'Log in to view this restricted content.',
    }
  }

  const data = requireProtectedContentData(result, '/')
  if (!data?.page) notFound()

  const title = data.page.title || 'Eara'
  const description = data.page.seo?.opengraphDescription || 'European Animal Research Association'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function HomePage() {
  const result = await getHomePageData()

  if (isPreviewLoginRequired(result)) {
    return <PreviewLoginGate redirectTo="/" />
  }

  const data = requireProtectedContentData(result, '/')
  if (!data?.page) notFound()
  return <PageTemplate withTicker hideTitleBar data={data} />
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import PreviewLoginGate from '@/components/auth/PreviewLoginGate'
import SingleNews from '@/components/templates/News/SingleNews'
import {
  GetAllNewsDocument,
  GetAllNewsQuery,
  GetNewsDocument,
  GetNewsQuery,
} from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import { isPreviewLoginRequired, requireProtectedContentData } from '@/lib/protectedContent'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'

// ISR: Revalidar a cada 30 minutos
export const revalidate = 1800

type NewsProps = {
  params: Promise<{ uri: string[] }>
}
const getNewsData = cache(async (uri: string[]) => {
  const path = `/news/${uri?.join('/')}`

  return await queryWithAuthFallback<GetNewsQuery>({
    query: GetNewsDocument,
    variables: { id: uri?.join('') },
    previewUri: path,
    context: {
      fetchOptions: {
        next: {
          revalidate: 1800,
          tags: ['news', `news-${uri?.join('')}`],
        },
      },
    },
  })
})

const getAllNewsData = cache(async (): Promise<GetAllNewsQuery> => {
  const client = getClient()
  const { data } = await client.query<GetAllNewsQuery>({
    query: GetAllNewsDocument,
    variables: { first: 1000 },
    fetchPolicy: 'no-cache',
    context: {
      fetchOptions: {
        next: {
          revalidate: 1800,
          tags: ['news'],
        },
      },
    },
  })

  if (!data) notFound()
  return data
})
export async function generateMetadata({ params }: NewsProps): Promise<Metadata> {
  const { uri } = await params
  const path = `/news/${uri?.join('/')}`
  const result = await getNewsData(uri)

  if (isPreviewLoginRequired(result)) {
    return {
      title: 'EARA | Restricted Content',
      description: 'Log in to view this restricted content.',
    }
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.news) notFound()
  const title = `EARA | News - ${data.news.title || data.news.title}`
  const description = data.news.seo?.opengraphDescription || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}
export default async function News({ params }: NewsProps) {
  const { uri } = await params
  const path = `/news/${uri?.join('/')}`
  const result = await getNewsData(uri)

  if (isPreviewLoginRequired(result)) {
    return <PreviewLoginGate redirectTo={path} />
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.news) notFound()
  const allNews = await getAllNewsData()
  return <SingleNews data={data} allNews={allNews} />
}

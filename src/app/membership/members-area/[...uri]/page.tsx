import PageTemplate from '@/components/templates/Page/PageTemplate'
import { GetPageDocument, GetPageQuery } from '@/graphql/generated/graphql'
import { getAuthenticatedClient } from '@/lib/apollo-client'
import { validateAuthToken } from '@/lib/auth/server'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'
type PageProps = {
  params: Promise<{ uri: string[] }>
}
const getPageData = cache(async (uri: string[]): Promise<GetPageQuery> => {
  console.log(uri.join('/'))

  // Valida o token antes de tentar buscar dados
  const isValid = await validateAuthToken()
  if (!isValid) {
    redirect(`/login?redirect=/membership/members-area/${uri.join('/')}`)
  }

  const client = await getAuthenticatedClient()
  const { data } = await client.query<GetPageQuery>({
    query: GetPageDocument,
    variables: { id: uri.join('/') },
    context: {
      fetchOptions: {
        next: {
          revalidate: 0,
          tags: ['pages', `pages-${uri.join('')}`],
        },
      },
    },
  })
  if (!data) notFound()
  return data
})
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { uri } = await params

  const data = await getPageData(uri)
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
  const data = await getPageData(uri)
  if (!data?.page) notFound()
  return <PageTemplate data={data} />
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import PreviewLoginGate from '@/components/auth/PreviewLoginGate'
import SingleAnimals from '@/components/templates/SingleAnimals'
import { GetAnimalDocument, GetAnimalQuery } from '@/graphql/generated/graphql'
import { isPreviewLoginRequired, requireProtectedContentData } from '@/lib/protectedContent'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'

// ISR: Revalidar a cada 1 hora
export const revalidate = 3600

type AnimalProps = {
  params: Promise<{ uri: string[] }>
}
const getAnimalData = cache(async (uri: string[]) => {
  const path = `/animals/${uri?.join('/')}`

  return await queryWithAuthFallback<GetAnimalQuery>({
    query: GetAnimalDocument,
    variables: { id: uri?.join('') },
    previewUri: path,
    context: {
      fetchOptions: {
        next: {
          revalidate: 0,
          tags: ['animals', `animal-${uri?.join('')}`],
        },
      },
    },
  })
})
export async function generateMetadata({ params }: AnimalProps): Promise<Metadata> {
  const { uri } = await params
  const path = `/animals/${uri?.join('/')}`
  const result = await getAnimalData(uri)

  if (isPreviewLoginRequired(result)) {
    return {
      title: 'EARA | Restricted Content',
      description: 'Log in to view this restricted content.',
    }
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.animal) notFound()
  const title = `EARA | Animals - ${data.animal.title || data.animal.title}`
  const description = data.animal.seo?.opengraphDescription || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}
export default async function Animal({ params }: AnimalProps) {
  const { uri } = await params
  const path = `/animals/${uri?.join('/')}`
  const result = await getAnimalData(uri)

  if (isPreviewLoginRequired(result)) {
    return <PreviewLoginGate redirectTo={path} />
  }

  const data = requireProtectedContentData(result, path)
  if (!data?.animal) notFound()
  return <SingleAnimals data={data} />
}

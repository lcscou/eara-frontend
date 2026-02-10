import SingleAnimals from '@/components/templates/SingleAnimals'
import { GetAnimalDocument, GetAnimalQuery } from '@/graphql/generated/graphql'
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'

// ISR: Revalidar a cada 1 hora
export const revalidate = 3600

type AnimalProps = {
  params: { uri: string[] }
}
const getAnimalData = cache(async (uri: string[]): Promise<GetAnimalQuery> => {
  const result = await queryWithAuthFallback<GetAnimalQuery>({
    query: GetAnimalDocument,
    variables: { id: uri.join('') },
    context: {
      fetchOptions: {
        next: {
          revalidate: 0,
          tags: ['animals', `animal-${uri.join('')}`],
        },
      },
    },
  })
  const path = `/animals/${uri.join('/')}`
  if (result.authRequired) {
    redirect(`/login?redirect=${encodeURIComponent(path)}`)
  }
  if (!result.data) notFound()
  return result.data
})
export async function generateMetadata({ params }: AnimalProps): Promise<Metadata> {
  const data = await getAnimalData(params.uri)
  if (!data?.animal) notFound()
  const title = `Eara | Animals - ${data.animal.title || data.animal.title}`
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
  const data = await getAnimalData(params.uri)
  if (!data?.animal) notFound()
  return <SingleAnimals data={data} />
}

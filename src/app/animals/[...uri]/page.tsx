import SingleAnimals from '@/components/templates/SingleAnimals'
import { GetAnimalDocument, GetAnimalQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

// ISR: Revalidar a cada 1 hora
export const revalidate = 3600

type AnimalProps = {
  params: { uri: string[] }
}
const getAnimalData = cache(async (uri: string[]): Promise<GetAnimalQuery> => {
  const client = getClient()
  const { data } = await client.query<GetAnimalQuery>({
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
  if (!data) notFound()
  return data
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

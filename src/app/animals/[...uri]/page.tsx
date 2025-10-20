import { cache } from 'react'
import { GetAnimalDocument, GetAnimalQuery } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SingleAnimals from '@/components/templates/SingleAnimals'
type AnimalProps = {
  params: { uri: string[] }
}
const getAnimalData = cache(async (uri: string[]):Promise<GetAnimalQuery> => {
  const client = getClient()
  const { data } = await client.query<GetAnimalQuery>({
    query: GetAnimalDocument,
    variables: { id: uri.join('') },
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

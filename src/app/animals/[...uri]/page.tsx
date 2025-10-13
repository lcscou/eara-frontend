import { cache } from 'react'
import { GetAnimalDocument, GetPageDocument } from '@/graphql/generated/graphql'
import { getClient } from '@/lib/apollo-client'
import PageTemplate from '@/components/templates/Page/PageTemplate'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SingleAnimals from '@/components/templates/SingleAnimals'
type AnimalProps = {
  params: { uri: string[] }
}
const getAnimalData = cache(async (uri: string[]) => {
  const client = getClient()
  const { data } = await client.query({
    query: GetAnimalDocument,
    variables: { id: uri.join('') },
  })
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

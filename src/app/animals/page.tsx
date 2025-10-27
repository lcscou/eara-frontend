import ArchiveAnimals from '@/components/templates/Animals/ArchiveAnimals'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetAllAnimalsDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
import { notFound } from 'next/navigation'

export default async function Animals() {
  const { data } = await query({ query: GetAllAnimalsDocument })
  if (!data) notFound()
  return (
    <>
      <PageTitleBar title="Animals" subtitle="main" />
      <main>
        <ArchiveAnimals data={data} />
      </main>
    </>
  )
}

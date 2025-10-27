import ArchiveDiseases from '@/components/templates/Diseases/ArchiveDiseases'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetAllDiseasesDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
import { notFound } from 'next/navigation'

export default async function Diseases() {
  const { data } = await query({ query: GetAllDiseasesDocument })
  if (!data) notFound()
  return (
    <>
      <PageTitleBar title="Diseases" subtitle="main" />
      <main>
        <ArchiveDiseases data={data} />
      </main>
    </>
  )
}

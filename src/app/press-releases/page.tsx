import ArchivePressReleases from '@/components/templates/PressReleases/ArchivePressReleases'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetAllNewsDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
import { notFound } from 'next/navigation'

export default async function News() {
  const { data } = await query({ query: GetAllNewsDocument })
  if (!data) notFound()
  return (
    <>
      <PageTitleBar title="Press Release" subtitle="EARA" />
      <main>
        <ArchivePressReleases />
      </main>
    </>
  )
}

import ArchiveNews from '@/components/templates/News/ArchiveNews'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetAllNewsDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
import { notFound } from 'next/navigation'

export default async function News() {
  const { data } = await query({ query: GetAllNewsDocument })
  if (!data) notFound()
  return (
    <>
      <PageTitleBar title="Latest research news" subtitle="news" />
      <main>
        <ArchiveNews data={data} />
      </main>
    </>
  )
}

import ArchiveNews from '@/components/templates/News/ArchiveNews'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetAllNewsDocument } from '@/graphql/generated/graphql'
import { PreloadQuery } from '@/lib/apollo-client'
import type { Metadata } from 'next'

const PAGE_SIZE = 12

export const metadata: Metadata = {
  title: 'EARA | Latest research news',
  description: 'Stay updated with the latest research news from EARA.',
}

export default async function News() {
  return (
    <>
      <PageTitleBar title="Latest research news" subtitle="news" />
      <main>
        <PreloadQuery
          query={GetAllNewsDocument}
          variables={{ first: PAGE_SIZE }}
          context={{ fetchOptions: { next: { tags: ['news'] } } }}
        >
          <ArchiveNews />
        </PreloadQuery>
      </main>
    </>
  )
}

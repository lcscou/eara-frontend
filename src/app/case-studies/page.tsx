import ArchiveCaseStudies from '@/components/templates/CaseStudies/ArchiveCaseStudies'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetAllMembersDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
import { notFound } from 'next/navigation'

export default async function Members() {
  const { data } = await query({ query: GetAllMembersDocument })
  if (!data) notFound()
  return (
    <>
      <PageTitleBar title="Case Studies" subtitle="case studies" />
      <main>
        <ArchiveCaseStudies />
      </main>
    </>
  )
}

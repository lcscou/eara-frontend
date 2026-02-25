import ArchiveMembers from '@/components/templates/Members/ArchiveMembers'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetAllMembersDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'EARA | Members',
  description:
    'Check out the members of EARA and learn more about their contributions to the field of animal research.',
}

export default async function Members() {
  const { data } = await query({ query: GetAllMembersDocument })
  if (!data) notFound()
  return (
    <>
      <PageTitleBar title="EARA Members" subtitle="members" />
      <main>
        <ArchiveMembers />
      </main>
    </>
  )
}

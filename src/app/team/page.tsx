import ArchiveTeam from '@/components/templates/Team/ArchiveTeam'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetAllMembersDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
import { notFound } from 'next/navigation'

export default async function Team() {
  const { data } = await query({ query: GetAllMembersDocument })
  if (!data) notFound()
  return (
    <>
      <PageTitleBar title="EARA Members" subtitle="members" />
      <main>
        <ArchiveTeam />
      </main>
    </>
  )
}

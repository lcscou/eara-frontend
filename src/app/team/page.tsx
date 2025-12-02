import ArchiveTeam from '@/components/templates/Team/ArchiveTeam'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'

export default function Team() {
  return (
    <>
      <PageTitleBar title="EARA Members" subtitle="members" />
      <main>
        <ArchiveTeam />
      </main>
    </>
  )
}
